import {
  BlockedDate,
  BlockedSlot,
  Booking,
  BusinessHours,
  BusinessSettings,
} from '@/types/database';

export interface TimeSlot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  isAvailable: boolean;
  reason?: string;
}

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Returns current timestamp formatted in business timezone (Asia/Kolkata).
 */
export function getCurrentTimeInZone(timeZone = 'Asia/Kolkata'): Date {
  const now = new Date();
  const dateInZone = new Date(now.toLocaleString('en-US', { timeZone }));
  return dateInZone;
}

/**
 * Checks whether a given calendar date string (YYYY-MM-DD) is within a blocked range.
 */
export function isDateBlocked(dateStr: string, blockedDates: BlockedDate[]): { blocked: boolean; reason?: string } {
  for (const b of blockedDates) {
    if (dateStr >= b.start_date && dateStr <= b.end_date) {
      return { blocked: true, reason: b.reason || 'Studio closed on this date' };
    }
  }
  return { blocked: false };
}

/**
 * Computes available booking slots for a requested date and duration.
 */
export function computeAvailableSlots({
  dateStr,
  durationMinutes,
  businessHours,
  existingBookings,
  blockedSlots = [],
  blockedDates = [],
  settings,
}: {
  dateStr: string;
  durationMinutes: number;
  businessHours: BusinessHours[];
  existingBookings: Booking[];
  blockedSlots?: BlockedSlot[];
  blockedDates?: BlockedDate[];
  settings: BusinessSettings;
}): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // 1. Date boundaries check
  const nowInZone = getCurrentTimeInZone(settings.timezone || 'Asia/Kolkata');
  const targetDate = new Date(`${dateStr}T00:00:00`);

  const todayStr = nowInZone.toISOString().split('T')[0];
  const maxAdvanceDate = new Date(nowInZone.getTime() + settings.advance_booking_days * 24 * 60 * 60 * 1000);
  const maxDateStr = maxAdvanceDate.toISOString().split('T')[0];

  if (dateStr < todayStr) {
    return [];
  }

  if (dateStr > maxDateStr) {
    return [];
  }

  // 2. Blocked dates check
  const blockedCheck = isDateBlocked(dateStr, blockedDates);
  if (blockedCheck.blocked) {
    return [];
  }

  // 3. Day of week & hours
  // JavaScript getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
  const dayOfWeek = targetDate.getDay();
  const hoursForDay = businessHours.find((h) => h.day_of_week === dayOfWeek);

  if (!hoursForDay || !hoursForDay.is_open) {
    return [];
  }

  const openMin = timeToMinutes(hoursForDay.open_time);
  const closeMin = timeToMinutes(hoursForDay.close_time);
  const bufferMin = settings.buffer_minutes || 30;

  // 4. Filter confirmed bookings on this day (pending bookings do NOT block slots)
  const dayConfirmedBookings = existingBookings.filter(
    (b) => b.booking_date === dateStr && b.status === 'confirmed'
  );

  const dayBlockedSlots = blockedSlots.filter((bs) => bs.date === dateStr);

  // 5. Generate discrete 30-min candidate start intervals
  const stepMinutes = 30;
  for (let startMin = openMin; startMin + durationMinutes <= closeMin; startMin += stepMinutes) {
    const endMin = startMin + durationMinutes;
    const startStr = minutesToTime(startMin);
    const endStr = minutesToTime(endMin);

    // Minimum notice check (e.g. 24h ahead of session start)
    const slotDateTime = new Date(`${dateStr}T${startStr}:00`);
    const diffHours = (slotDateTime.getTime() - nowInZone.getTime()) / (1000 * 60 * 60);

    if (diffHours < settings.min_notice_hours) {
      continue; // Skip past or short-notice slots
    }

    // Overlap check with confirmed bookings (including buffer)
    let isConflict = false;
    let conflictReason = '';

    for (const booking of dayConfirmedBookings) {
      const bStart = timeToMinutes(booking.start_time);
      const bEnd = timeToMinutes(booking.end_time);

      // Buffer: [bStart - bufferMin, bEnd + bufferMin]
      const bStartWithBuffer = Math.max(openMin, bStart - bufferMin);
      const bEndWithBuffer = Math.min(closeMin, bEnd + bufferMin);

      // Overlap formula: (startMin < bEndWithBuffer) && (endMin > bStartWithBuffer)
      if (startMin < bEndWithBuffer && endMin > bStartWithBuffer) {
        isConflict = true;
        conflictReason = 'Reserved session';
        break;
      }
    }

    // Overlap check with blocked slots
    if (!isConflict) {
      for (const bs of dayBlockedSlots) {
        const bsStart = timeToMinutes(bs.start_time);
        const bsEnd = timeToMinutes(bs.end_time);
        if (startMin < bsEnd && endMin > bsStart) {
          isConflict = true;
          conflictReason = bs.reason || 'Studio maintenance';
          break;
        }
      }
    }

    if (!isConflict) {
      slots.push({
        startTime: startStr,
        endTime: endStr,
        isAvailable: true,
      });
    }
  }

  return slots;
}

/**
 * Enforces transactional overlap prevention logic.
 */
export function checkSlotOverlap({
  dateStr,
  startTime,
  endTime,
  existingBookings,
  excludeBookingId,
}: {
  dateStr: string;
  startTime: string;
  endTime: string;
  existingBookings: Booking[];
  excludeBookingId?: string;
}): { hasConflict: boolean; conflictingBooking?: Booking } {
  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);

  const conflict = existingBookings.find((b) => {
    if (b.id === excludeBookingId) return false;
    if (b.booking_date !== dateStr) return false;
    if (b.status !== 'confirmed') return false;

    const bStart = timeToMinutes(b.start_time);
    const bEnd = timeToMinutes(b.end_time);

    return reqStart < bEnd && reqEnd > bStart;
  });

  return {
    hasConflict: !!conflict,
    conflictingBooking: conflict,
  };
}

/**
 * Checks cancellation eligibility against policy cutoff.
 */
export function verifyCancellationEligibility(
  bookingDate: string,
  startTime: string,
  cutoffHours = 48,
  timeZone = 'Asia/Kolkata'
): { allowed: boolean; reason?: string } {
  const now = getCurrentTimeInZone(timeZone);
  const bookingStart = new Date(`${bookingDate}T${startTime}:00`);

  const hoursRemaining = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursRemaining < 0) {
    return { allowed: false, reason: 'This session has already taken place.' };
  }

  if (hoursRemaining < cutoffHours) {
    return {
      allowed: false,
      reason: `Cancellations must be requested at least ${cutoffHours} hours prior to session start. Currently, only ${Math.max(0, Math.round(hoursRemaining))} hours remain.`,
    };
  }

  return { allowed: true };
}

/**
 * Checks rescheduling eligibility against policy cutoff.
 */
export function verifyRescheduleEligibility(
  bookingDate: string,
  startTime: string,
  cutoffHours = 24,
  timeZone = 'Asia/Kolkata'
): { allowed: boolean; reason?: string } {
  const now = getCurrentTimeInZone(timeZone);
  const bookingStart = new Date(`${bookingDate}T${startTime}:00`);

  const hoursRemaining = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursRemaining < 0) {
    return { allowed: false, reason: 'This session has already passed.' };
  }

  if (hoursRemaining < cutoffHours) {
    return {
      allowed: false,
      reason: `Rescheduling requests require at least ${cutoffHours} hours advance notice.`,
    };
  }

  return { allowed: true };
}
