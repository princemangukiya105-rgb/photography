import {
  Booking,
  BookingStatus,
  BusinessHours,
  BusinessSettings,
  GalleryItem,
  Inquiry,
  Service,
  BlockedDate,
  BlockedSlot,
} from '@/types/database';
import {
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_SERVICES,
  INITIAL_DEMO_BOOKINGS,
} from './mock-data';
import { computeAvailableSlots, checkSlotOverlap, TimeSlot } from '@/lib/booking-engine';
import { generateAccessToken, generateBookingReference } from '@/lib/security';
import { createAdminClient, createClient } from '@/lib/supabase/server';

// In-memory fallback state for smooth preview & dev before live database linkage
interface InMemoryState {
  settings: BusinessSettings;
  services: Service[];
  hours: BusinessHours[];
  blockedDates: BlockedDate[];
  blockedSlots: BlockedSlot[];
  bookings: Booking[];
  inquiries: Inquiry[];
  gallery: GalleryItem[];
}

declare global {
  // eslint-disable-next-line no-var
  var __moments_in_memory_state: InMemoryState | undefined;
}

function getMemoryStore(): InMemoryState {
  if (!global.__moments_in_memory_state) {
    global.__moments_in_memory_state = {
      settings: { ...DEFAULT_BUSINESS_SETTINGS },
      services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)),
      hours: JSON.parse(JSON.stringify(DEFAULT_BUSINESS_HOURS)),
      blockedDates: [],
      blockedSlots: [],
      bookings: JSON.parse(JSON.stringify(INITIAL_DEMO_BOOKINGS)),
      inquiries: [
        {
          id: 'inq-1',
          name: 'Nisha Vyas',
          email: 'nisha.vyas@example.com',
          phone: '+91 99090 11223',
          service_interest: 'Pre-Wedding Photography',
          event_date: '2026-11-15',
          message: 'Inquiring about destination pre-wedding package around Champaner.',
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ],
      gallery: JSON.parse(JSON.stringify(DEFAULT_GALLERY_ITEMS)),
    };
  }
  return global.__moments_in_memory_state;
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// -------------------------------------------------------------
// SERVICES & PACKAGES
// -------------------------------------------------------------
export async function getServices(): Promise<Service[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('services')
        .select('*, packages:service_packages(*)')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Service[];
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.services.filter((s) => s.is_active);
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('services')
        .select('*, packages:service_packages(*)')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Service[];
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('services')
        .select('*, packages:service_packages(*)')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Service;
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.services.find((s) => s.slug === slug) || null;
}

export async function updateService(
  id: string,
  updates: Partial<Service>
): Promise<Service | null> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('services')
        .update(updates)
        .eq('id', id)
        .select('*, packages:service_packages(*)')
        .single();

      if (!error && data) {
        return data as Service;
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const index = store.services.findIndex((s) => s.id === id);
  if (index !== -1) {
    store.services[index] = { ...store.services[index], ...updates };
    return store.services[index];
  }
  return null;
}

// -------------------------------------------------------------
// BUSINESS SETTINGS
// -------------------------------------------------------------
export async function getBusinessSettings(): Promise<BusinessSettings> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('business_settings')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        return data as BusinessSettings;
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.settings;
}

export async function updateBusinessSettings(
  updates: Partial<BusinessSettings>
): Promise<BusinessSettings> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const current = await getBusinessSettings();
      const { data, error } = await admin
        .from('business_settings')
        .update(updates)
        .eq('id', current.id)
        .select('*')
        .single();

      if (!error && data) {
        return data as BusinessSettings;
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  store.settings = { ...store.settings, ...updates };
  return store.settings;
}

// -------------------------------------------------------------
// BUSINESS HOURS & AVAILABILITY
// -------------------------------------------------------------
export async function getBusinessHours(): Promise<BusinessHours[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('business_hours')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as BusinessHours[];
      }
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.hours;
}

export async function updateBusinessHour(
  id: string,
  updates: Partial<BusinessHours>
): Promise<BusinessHours | null> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('business_hours')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) return data as BusinessHours;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const idx = store.hours.findIndex((h) => h.id === id);
  if (idx !== -1) {
    store.hours[idx] = { ...store.hours[idx], ...updates };
    return store.hours[idx];
  }
  return null;
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('blocked_dates')
        .select('*')
        .order('start_date', { ascending: true });

      if (!error && data) return data as BlockedDate[];
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.blockedDates;
}

export async function addBlockedDate(item: Omit<BlockedDate, 'id'>): Promise<BlockedDate> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('blocked_dates')
        .insert(item)
        .select('*')
        .single();

      if (!error && data) return data as BlockedDate;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const newBlocked: BlockedDate = {
    id: `blk-${Date.now()}`,
    ...item,
  };
  store.blockedDates.push(newBlocked);
  return newBlocked;
}

export async function deleteBlockedDate(id: string): Promise<boolean> {
  const admin = createAdminClient();
  if (admin) {
    try {
      await admin.from('blocked_dates').delete().eq('id', id);
      return true;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  store.blockedDates = store.blockedDates.filter((b) => b.id !== id);
  return true;
}

// -------------------------------------------------------------
// SLOTS CALCULATION
// -------------------------------------------------------------
export async function getAvailableSlotsForService(
  serviceId: string,
  dateStr: string,
  packageId?: string | null
): Promise<TimeSlot[]> {
  const services = await getServices();
  const service = services.find((s) => s.id === serviceId);
  if (!service) return [];

  let durationMinutes = service.duration_minutes;
  if (packageId && service.packages) {
    const pkg = service.packages.find((p) => p.id === packageId);
    if (pkg) durationMinutes = pkg.duration_minutes;
  }

  const [hours, settings, blockedDates, allBookings] = await Promise.all([
    getBusinessHours(),
    getBusinessSettings(),
    getBlockedDates(),
    getBookings({ date: dateStr }),
  ]);

  return computeAvailableSlots({
    dateStr,
    durationMinutes,
    businessHours: hours,
    existingBookings: allBookings,
    blockedDates,
    settings,
  });
}

// -------------------------------------------------------------
// BOOKINGS CRUD & SECURE ACCESS
// -------------------------------------------------------------
export async function getBookings(filters?: {
  status?: BookingStatus;
  date?: string;
  search?: string;
}): Promise<Booking[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      let query = admin
        .from('bookings')
        .select('*, service:services(*), package:service_packages(*)')
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: true });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.date) query = query.eq('booking_date', filters.date);
      if (filters?.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,booking_reference.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (!error && data) return data as Booking[];
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  let list = [...store.bookings];

  if (filters?.status) {
    list = list.filter((b) => b.status === filters.status);
  }
  if (filters?.date) {
    list = list.filter((b) => b.booking_date === filters.date);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (b) =>
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_email.toLowerCase().includes(q) ||
        b.booking_reference.toLowerCase().includes(q)
    );
  }

  // Populate related service/package
  return list.map((b) => {
    const s = store.services.find((serv) => serv.id === b.service_id);
    const p = s?.packages?.find((pkg) => pkg.id === b.package_id);
    return { ...b, service: s, package: p };
  });
}

export async function getBookingByReferenceAndToken(
  reference: string,
  token: string
): Promise<Booking | null> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('bookings')
        .select('*, service:services(*), package:service_packages(*)')
        .eq('booking_reference', reference.trim().toUpperCase())
        .eq('access_token', token.trim())
        .single();

      if (!error && data) return data as Booking;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const booking = store.bookings.find(
    (b) =>
      b.booking_reference.toUpperCase() === reference.trim().toUpperCase() &&
      b.access_token === token.trim()
  );

  if (!booking) return null;
  const s = store.services.find((serv) => serv.id === booking.service_id);
  const p = s?.packages?.find((pkg) => pkg.id === booking.package_id);
  return { ...booking, service: s, package: p };
}

export async function getBookingByReferenceOnly(reference: string): Promise<Booking | null> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('bookings')
        .select('*, service:services(*), package:service_packages(*)')
        .eq('booking_reference', reference.trim().toUpperCase())
        .single();

      if (!error && data) return data as Booking;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const booking = store.bookings.find(
    (b) => b.booking_reference.toUpperCase() === reference.trim().toUpperCase()
  );

  if (!booking) return null;
  const s = store.services.find((serv) => serv.id === booking.service_id);
  const p = s?.packages?.find((pkg) => pkg.id === booking.package_id);
  return { ...booking, service: s, package: p };
}

export interface CreateBookingInput {
  service_id: string;
  package_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  session_location_type: 'studio' | 'on_location';
  location_address?: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  customer_notes?: string | null;
}

export async function createBooking(
  input: CreateBookingInput
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  // Validate service exists
  const services = await getServices();
  const service = services.find((s) => s.id === input.service_id);
  if (!service) {
    return { success: false, error: 'Selected photography service does not exist.' };
  }

  // Check confirmed overlap
  const existingBookings = await getBookings({ date: input.booking_date });
  const overlap = checkSlotOverlap({
    dateStr: input.booking_date,
    startTime: input.start_time,
    endTime: input.end_time,
    existingBookings,
  });

  if (overlap.hasConflict) {
    return {
      success: false,
      error: 'This time slot is no longer available. Please select another slot.',
    };
  }

  const booking_reference = generateBookingReference();
  const access_token = generateAccessToken();

  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('bookings')
        .insert({
          ...input,
          booking_reference,
          access_token,
          currency: 'INR',
          status: 'pending',
        })
        .select('*, service:services(*)')
        .single();

      if (!error && data) {
        // Record status history
        await admin.from('booking_status_history').insert({
          booking_id: data.id,
          from_status: null,
          to_status: 'pending',
          note: 'Online booking request submitted by customer.',
          changed_by: 'customer',
        });

        return { success: true, booking: data as Booking };
      } else if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database error';
      return { success: false, error: msg };
    }
  }

  // In-memory fallback
  const store = getMemoryStore();
  const newBooking: Booking = {
    id: `b-${Date.now()}`,
    booking_reference,
    access_token,
    ...input,
    currency: 'INR',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    service,
  };

  store.bookings.unshift(newBooking);
  return { success: true, booking: newBooking };
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  note: string,
  changedBy = 'admin'
): Promise<{ success: boolean; error?: string }> {
  // If moving to confirmed, verify no overlap conflict
  if (newStatus === 'confirmed') {
    const store = getMemoryStore();
    const current = store.bookings.find((b) => b.id === bookingId);
    if (current) {
      const existing = await getBookings({ date: current.booking_date });
      const conflict = checkSlotOverlap({
        dateStr: current.booking_date,
        startTime: current.start_time,
        endTime: current.end_time,
        existingBookings: existing,
        excludeBookingId: bookingId,
      });

      if (conflict.hasConflict) {
        return {
          success: false,
          error: 'Cannot confirm: another confirmed booking already occupies this time slot.',
        };
      }
    }
  }

  const admin = createAdminClient();
  if (admin) {
    try {
      const { error } = await admin
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) return { success: false, error: error.message };

      await admin.from('booking_status_history').insert({
        booking_id: bookingId,
        from_status: null,
        to_status: newStatus,
        note,
        changed_by: changedBy,
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating booking';
      return { success: false, error: msg };
    }
  }

  const store = getMemoryStore();
  const b = store.bookings.find((item) => item.id === bookingId);
  if (!b) return { success: false, error: 'Booking not found.' };

  b.status = newStatus;
  b.updated_at = new Date().toISOString();
  return { success: true };
}

export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string,
  note: string,
  changedBy = 'customer'
): Promise<{ success: boolean; error?: string }> {
  const existing = await getBookings({ date: newDate });
  const conflict = checkSlotOverlap({
    dateStr: newDate,
    startTime: newStartTime,
    endTime: newEndTime,
    existingBookings: existing,
    excludeBookingId: bookingId,
  });

  if (conflict.hasConflict) {
    return {
      success: false,
      error: 'The requested rescheduled slot is already occupied.',
    };
  }

  const admin = createAdminClient();
  if (admin) {
    try {
      const { error } = await admin
        .from('bookings')
        .update({
          booking_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
          status: 'rescheduled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) return { success: false, error: error.message };

      await admin.from('booking_status_history').insert({
        booking_id: bookingId,
        from_status: null,
        to_status: 'rescheduled',
        note: `Rescheduled to ${newDate} at ${newStartTime}: ${note}`,
        changed_by: changedBy,
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reschedule failed';
      return { success: false, error: msg };
    }
  }

  const store = getMemoryStore();
  const b = store.bookings.find((item) => item.id === bookingId);
  if (!b) return { success: false, error: 'Booking not found.' };

  b.booking_date = newDate;
  b.start_time = newStartTime;
  b.end_time = newEndTime;
  b.status = 'rescheduled';
  b.updated_at = new Date().toISOString();
  return { success: true };
}

// -------------------------------------------------------------
// INQUIRIES
// -------------------------------------------------------------
export async function getInquiries(): Promise<Inquiry[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data as Inquiry[];
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  return store.inquiries;
}

export async function createInquiry(input: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Promise<Inquiry> {
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('inquiries')
        .insert({ ...input, status: 'new' })
        .select('*')
        .single();

      if (!error && data) return data as Inquiry;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const newInq: Inquiry = {
    id: `inq-${Date.now()}`,
    ...input,
    status: 'new',
    created_at: new Date().toISOString(),
  };
  store.inquiries.unshift(newInq);
  return newInq;
}

export async function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'archived'): Promise<boolean> {
  const admin = createAdminClient();
  if (admin) {
    try {
      await admin.from('inquiries').update({ status }).eq('id', id);
      return true;
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  const inq = store.inquiries.find((i) => i.id === id);
  if (inq) {
    inq.status = status;
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// GALLERY
// -------------------------------------------------------------
export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  const admin = createAdminClient();
  if (admin) {
    try {
      let query = admin.from('gallery_items').select('*').order('sort_order', { ascending: true });
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data) return data as GalleryItem[];
    } catch {
      // Fallback
    }
  }

  const store = getMemoryStore();
  if (category && category !== 'All') {
    return store.gallery.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }
  return store.gallery;
}
