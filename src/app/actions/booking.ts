'use server';

import { z } from 'zod';
import {
  createBooking,
  getBookingByReferenceAndToken,
  getBookingByReferenceOnly,
  getBusinessSettings,
  rescheduleBooking,
  updateBookingStatus,
} from '@/lib/data/repository';
import {
  checkRateLimit,
  sanitizeString,
} from '@/lib/security';
import {
  verifyCancellationEligibility,
  verifyRescheduleEligibility,
} from '@/lib/booking-engine';

const BookingSubmissionSchema = z.object({
  service_id: z.string().min(1, 'Please select a photography service'),
  package_id: z.string().optional().nullable(),
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Please enter a valid email address'),
  customer_phone: z.string().min(8, 'Please enter a valid phone number'),
  session_location_type: z.enum(['studio', 'on_location']),
  location_address: z.string().optional().nullable(),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date required (YYYY-MM-DD)'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Valid start time required (HH:MM)'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Valid end time required (HH:MM)'),
  total_price: z.coerce.number().min(0, 'Invalid price'),
  customer_notes: z.string().optional().nullable(),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: 'You must review and agree to the cancellation policy.',
  }),
});

export async function submitBookingAction(prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      service_id: sanitizeString(formData.get('service_id') as string),
      package_id: (formData.get('package_id') as string) || null,
      customer_name: sanitizeString(formData.get('customer_name') as string),
      customer_email: sanitizeString(formData.get('customer_email') as string),
      customer_phone: sanitizeString(formData.get('customer_phone') as string),
      session_location_type: formData.get('session_location_type') as 'studio' | 'on_location',
      location_address: sanitizeString(formData.get('location_address') as string) || null,
      booking_date: formData.get('booking_date') as string,
      start_time: formData.get('start_time') as string,
      end_time: formData.get('end_time') as string,
      total_price: Number(formData.get('total_price') || 0),
      customer_notes: sanitizeString(formData.get('customer_notes') as string) || null,
      agree_terms: formData.get('agree_terms') === 'on' || formData.get('agree_terms') === 'true',
    };

    // Rate limiting: 4 booking submissions per 10 minutes per email
    const rateCheck = checkRateLimit(`book-${rawData.customer_email}`, 4, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Booking rate limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`,
      };
    }

    const validated = BookingSubmissionSchema.safeParse(rawData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Invalid booking details.';
      return { success: false, error: firstError };
    }

    const result = await createBooking({
      service_id: validated.data.service_id,
      package_id: validated.data.package_id,
      customer_name: validated.data.customer_name,
      customer_email: validated.data.customer_email,
      customer_phone: validated.data.customer_phone,
      session_location_type: validated.data.session_location_type,
      location_address: validated.data.location_address,
      booking_date: validated.data.booking_date,
      start_time: validated.data.start_time,
      end_time: validated.data.end_time,
      total_price: validated.data.total_price,
      customer_notes: validated.data.customer_notes,
    });

    if (!result.success || !result.booking) {
      return {
        success: false,
        error: result.error || 'Failed to reserve the chosen slot. It may have just been taken.',
      };
    }

    return {
      success: true,
      bookingReference: result.booking.booking_reference,
      accessToken: result.booking.access_token,
      booking: result.booking,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred during booking.';
    return { success: false, error: msg };
  }
}

export async function lookupBookingAction(prevState: unknown, formData: FormData) {
  try {
    const reference = sanitizeString(formData.get('reference') as string).toUpperCase();
    const token = sanitizeString(formData.get('token') as string);
    const email = sanitizeString(formData.get('email') as string);

    if (!reference) {
      return { success: false, error: 'Please enter your Booking Reference.' };
    }

    // Rate limit lookups to prevent brute force reference guessing
    const rateCheck = checkRateLimit(`lookup-${reference}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return { success: false, error: 'Too many lookup attempts. Please wait a minute.' };
    }

    if (token) {
      const booking = await getBookingByReferenceAndToken(reference, token);
      if (!booking) {
        return {
          success: false,
          error: 'No matching booking found for this reference and access key combination.',
        };
      }
      return { success: true, booking };
    }

    if (email) {
      const booking = await getBookingByReferenceOnly(reference);
      if (!booking || booking.customer_email.toLowerCase() !== email.toLowerCase()) {
        return {
          success: false,
          error: 'No matching booking found for this reference and email address.',
        };
      }
      return { success: true, booking };
    }

    return {
      success: false,
      error: 'Please provide either your secret Access Token or the Email used during booking.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error retrieving booking.';
    return { success: false, error: msg };
  }
}

export async function cancelBookingAction(prevState: unknown, formData: FormData) {
  try {
    const reference = sanitizeString(formData.get('reference') as string);
    const token = sanitizeString(formData.get('token') as string);
    const reason = sanitizeString(formData.get('reason') as string) || 'Customer requested cancellation';

    if (!reference || !token) {
      return { success: false, error: 'Authorization tokens missing.' };
    }

    const booking = await getBookingByReferenceAndToken(reference, token);
    if (!booking) {
      return { success: false, error: 'Unauthorized or booking not found.' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'This booking has already been cancelled.' };
    }

    const settings = await getBusinessSettings();
    const eligibility = verifyCancellationEligibility(
      booking.booking_date,
      booking.start_time,
      settings.cancellation_cutoff_hours,
      settings.timezone
    );

    if (!eligibility.allowed) {
      return { success: false, error: eligibility.reason };
    }

    const result = await updateBookingStatus(
      booking.id,
      'cancelled',
      `Customer cancelled: ${reason}`,
      'customer'
    );

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to cancel booking.' };
    }

    return {
      success: true,
      message: 'Your booking has been cancelled successfully. Any deposit credit has been noted.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error cancelling session.';
    return { success: false, error: msg };
  }
}

export async function rescheduleBookingAction(prevState: unknown, formData: FormData) {
  try {
    const reference = sanitizeString(formData.get('reference') as string);
    const token = sanitizeString(formData.get('token') as string);
    const newDate = formData.get('new_date') as string;
    const newStartTime = formData.get('new_start_time') as string;
    const newEndTime = formData.get('new_end_time') as string;
    const reason = sanitizeString(formData.get('reason') as string) || 'Customer rescheduled';

    if (!reference || !token || !newDate || !newStartTime || !newEndTime) {
      return { success: false, error: 'Required rescheduling parameters missing.' };
    }

    const booking = await getBookingByReferenceAndToken(reference, token);
    if (!booking) {
      return { success: false, error: 'Unauthorized or booking not found.' };
    }

    const settings = await getBusinessSettings();
    const eligibility = verifyRescheduleEligibility(
      booking.booking_date,
      booking.start_time,
      settings.reschedule_cutoff_hours,
      settings.timezone
    );

    if (!eligibility.allowed) {
      return { success: false, error: eligibility.reason };
    }

    const result = await rescheduleBooking(
      booking.id,
      newDate,
      newStartTime,
      newEndTime,
      reason,
      'customer'
    );

    if (!result.success) {
      return { success: false, error: result.error || 'Could not reschedule to selected slot.' };
    }

    return {
      success: true,
      message: `Session successfully rescheduled to ${newDate} at ${newStartTime}.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error rescheduling session.';
    return { success: false, error: msg };
  }
}
