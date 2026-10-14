'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/admin-auth';
import { createClient } from '@/lib/supabase/server';
import {
  updateBookingStatus,
  rescheduleBooking,
  updateService,
  updateBusinessSettings,
  addBlockedDate,
  deleteBlockedDate,
  updateInquiryStatus,
} from '@/lib/data/repository';
import { BookingStatus, BusinessSettings, Service } from '@/types/database';

export async function adminLoginAction(prevState: unknown, formData: FormData) {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const password = (formData.get('password') as string)?.trim();

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    // 1. Try Supabase Auth if configured
    const supabase = await createClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          // Profile check
          const adminCheck = await verifyAdminSession();
          if (adminCheck.isAdmin) {
            return { success: true };
          } else {
            await supabase.auth.signOut();
            return {
              success: false,
              error: 'Your account does not possess administrator clearance.',
            };
          }
        }
      } catch {
        // Fallback to bootstrap credentials
      }
    }

    // 2. Fallback Studio Owner Bootstrap Key
    // Default studio key for immediate pre-database testing & initial setup
    if (
      (email === 'admin@momentsproduction.com' && password === 'Moments@Vadodara2026') ||
      password === 'Moments@Vadodara2026'
    ) {
      const cookieStore = await cookies();
      cookieStore.set('moments_admin_session', 'authorized_studio_admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid administrator credentials. For initial pre-database bootstrap, use admin@momentsproduction.com / Moments@Vadodara2026.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return { success: false, error: msg };
  }
}

export async function adminLogoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('moments_admin_session');

  const supabase = await createClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }

  revalidatePath('/admin');
  redirect('/admin/login');
}

export async function adminUpdateBookingStatusAction(
  bookingId: string,
  newStatus: BookingStatus,
  note = 'Status updated by administrator'
) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  const result = await updateBookingStatus(bookingId, newStatus, note, 'admin');
  revalidatePath('/admin');
  revalidatePath('/admin/bookings');
  return result;
}

export async function adminRescheduleBookingAction(
  bookingId: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string,
  note = 'Rescheduled by studio coordinator'
) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  const result = await rescheduleBooking(
    bookingId,
    newDate,
    newStartTime,
    newEndTime,
    note,
    'admin'
  );
  revalidatePath('/admin');
  revalidatePath('/admin/bookings');
  return result;
}

export async function adminUpdateServiceAction(id: string, updates: Partial<Service>) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  const updated = await updateService(id, updates);
  if (!updated) {
    return { success: false, error: 'Service not found or update failed.' };
  }

  revalidatePath('/services');
  revalidatePath('/admin/services');
  return { success: true, service: updated };
}

export async function adminUpdateSettingsAction(updates: Partial<BusinessSettings>) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  const updated = await updateBusinessSettings(updates);
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  revalidatePath('/admin/settings');
  return { success: true, settings: updated };
}

export async function adminAddBlockedDateAction(
  startDate: string,
  endDate: string,
  reason: string
) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  await addBlockedDate({
    start_date: startDate,
    end_date: endDate,
    reason,
  });

  revalidatePath('/booking');
  revalidatePath('/admin/availability');
  return { success: true };
}

export async function adminDeleteBlockedDateAction(id: string) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  await deleteBlockedDate(id);
  revalidatePath('/booking');
  revalidatePath('/admin/availability');
  return { success: true };
}

export async function adminUpdateInquiryStatusAction(
  id: string,
  status: 'new' | 'contacted' | 'archived'
) {
  const session = await verifyAdminSession();
  if (!session.isAdmin) {
    return { success: false, error: 'Unauthorized. Administrator session required.' };
  }

  await updateInquiryStatus(id, status);
  revalidatePath('/admin/inquiries');
  return { success: true };
}
