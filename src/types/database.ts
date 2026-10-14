export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'rescheduled'
  | 'cancelled'
  | 'completed';

export type UserRole = 'admin' | 'customer';

export type LocationType = 'studio' | 'on_location';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface ServicePackage {
  id: string;
  service_id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  includes: string[];
  sort_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  full_description: string;
  base_price: number;
  duration_minutes: number;
  is_active: boolean;
  featured_image: string;
  gallery_images: string[];
  sort_order: number;
  packages?: ServicePackage[];
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline: string;
  email: string;
  phone: string;
  alt_phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  timezone: string; // e.g. "Asia/Kolkata"
  advance_booking_days: number;
  buffer_minutes: number;
  min_notice_hours: number;
  cancellation_cutoff_hours: number;
  reschedule_cutoff_hours: number;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  whatsapp_number?: string;
  terms_summary: string;
  cancellation_policy: string;
}

export interface BusinessHours {
  id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  day_name: string;
  is_open: boolean;
  open_time: string; // "10:00"
  close_time: string; // "19:00"
}

export interface BlockedDate {
  id: string;
  start_date: string; // "YYYY-MM-DD"
  end_date: string; // "YYYY-MM-DD"
  reason: string;
  created_at?: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  reason: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  access_token: string;
  service_id: string;
  package_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  session_location_type: LocationType;
  location_address?: string | null;
  booking_date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  total_price: number;
  currency: string;
  status: BookingStatus;
  customer_notes?: string | null;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
  service?: Service;
  package?: ServicePackage;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  note: string;
  changed_by: string; // e.g. 'customer', 'admin', 'system'
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_interest: string;
  event_date?: string | null;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  client_tag?: string;
  aspect_ratio: 'landscape' | 'portrait' | 'square';
  is_featured: boolean;
  sort_order: number;
}
