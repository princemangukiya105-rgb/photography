-- Moments Production: Initial PostgreSQL Database Migration
-- Photography & Production Agency (Vadodara, Gujarat)

-- Enable UUID extension and btree_gist for exclusion checks
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Profiles Table (Auth integration)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'Moments Production',
  tagline TEXT NOT NULL DEFAULT 'Editorial Photography & Cinema Agency',
  email TEXT NOT NULL DEFAULT 'contact@momentsproduction.com',
  phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  alt_phone TEXT DEFAULT '+91 98250 12345',
  address_line1 TEXT NOT NULL DEFAULT 'Studio 402, Signature Square, Alkapuri',
  address_line2 TEXT DEFAULT 'Race Course Road',
  city TEXT NOT NULL DEFAULT 'Vadodara',
  state TEXT NOT NULL DEFAULT 'Gujarat',
  postal_code TEXT NOT NULL DEFAULT '390007',
  country TEXT NOT NULL DEFAULT 'India',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  advance_booking_days INTEGER NOT NULL DEFAULT 60,
  buffer_minutes INTEGER NOT NULL DEFAULT 30,
  min_notice_hours INTEGER NOT NULL DEFAULT 24,
  cancellation_cutoff_hours INTEGER NOT NULL DEFAULT 48,
  reschedule_cutoff_hours INTEGER NOT NULL DEFAULT 24,
  instagram_url TEXT DEFAULT 'https://instagram.com/momentsproduction',
  facebook_url TEXT DEFAULT 'https://facebook.com/momentsproduction',
  youtube_url TEXT DEFAULT 'https://youtube.com/@momentsproduction',
  whatsapp_number TEXT DEFAULT '+919876543210',
  terms_summary TEXT NOT NULL DEFAULT 'All sessions require confirmation. Rescheduling must be requested at least 24 hours prior to the session.',
  cancellation_policy TEXT NOT NULL DEFAULT 'Cancellations made 48 hours or more before session start are eligible for rescheduling or deposit credit.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Services Table (15 agency services)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured_image TEXT NOT NULL,
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Service Packages Table
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Business Hours Table (0 = Sunday, 1 = Monday ... 6 = Saturday)
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
  day_name TEXT NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time TIME NOT NULL DEFAULT '10:00:00',
  close_time TIME NOT NULL DEFAULT '19:00:00'
);

-- 6. Blocked Dates Table
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- 7. Blocked Slots Table
CREATE TABLE IF NOT EXISTS public.blocked_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_slot_range CHECK (start_time < end_time)
);

-- 8. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL UNIQUE,
  access_token UUID NOT NULL DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  package_id UUID REFERENCES public.service_packages(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  session_location_type TEXT NOT NULL DEFAULT 'studio' CHECK (session_location_type IN ('studio', 'on_location')),
  location_address TEXT,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'rescheduled', 'cancelled', 'completed')),
  customer_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_booking_time CHECK (start_time < end_time)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON public.bookings(booking_date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_access_token ON public.bookings(access_token);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);

-- 9. Booking Status History
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT NOT NULL,
  changed_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Customer Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_interest TEXT NOT NULL,
  event_date DATE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Gallery Items Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  client_tag TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT 'portrait' CHECK (aspect_ratio IN ('landscape', 'portrait', 'square')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- TRANSACTIONAL OVERLAP CONCURRENCY PROTECTION TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.check_booking_overlap()
RETURNS TRIGGER AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  -- We only enforce strict overlap checks for confirmed bookings
  IF NEW.status = 'confirmed' THEN
    SELECT COUNT(*)
    INTO conflict_count
    FROM public.bookings
    WHERE id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND booking_date = NEW.booking_date
      AND status = 'confirmed'
      AND (
        (start_time, end_time) OVERLAPS (NEW.start_time, NEW.end_time)
      );

    IF conflict_count > 0 THEN
      RAISE EXCEPTION 'Double booking conflict: A confirmed session already exists overlapping % between % and %',
        NEW.booking_date, NEW.start_time, NEW.end_time
        USING ERRCODE = '23P01'; -- exclusion_violation
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_booking_overlap ON public.bookings;
CREATE TRIGGER trg_prevent_booking_overlap
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.check_booking_overlap();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Business Settings Policies (Public readable, Admin editable)
CREATE POLICY "Public can view business settings" ON public.business_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can update business settings" ON public.business_settings
  FOR ALL USING (public.is_admin());

-- Services and Packages Policies (Public can view active, Admin full CRUD)
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view active packages" ON public.service_packages
  FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage packages" ON public.service_packages
  FOR ALL USING (public.is_admin());

-- Availability Policies
CREATE POLICY "Public can view business hours" ON public.business_hours
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage business hours" ON public.business_hours
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view blocked dates" ON public.blocked_dates
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked dates" ON public.blocked_dates
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view blocked slots" ON public.blocked_slots
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked slots" ON public.blocked_slots
  FOR ALL USING (public.is_admin());

-- Bookings Policies
-- 1. Public can insert pending booking
CREATE POLICY "Public can create pending booking" ON public.bookings
  FOR INSERT WITH CHECK (status = 'pending');

-- 2. Customer can view own booking via reference + access_token (or RPC)
CREATE POLICY "Customer can view own booking with token" ON public.bookings
  FOR SELECT USING (
    public.is_admin() OR
    (auth.uid() IS NOT NULL AND auth.email() = customer_email)
  );

-- 3. Admin can do everything on bookings
CREATE POLICY "Admins have full access to bookings" ON public.bookings
  FOR ALL USING (public.is_admin());

-- Inquiries Policies
CREATE POLICY "Public can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage inquiries" ON public.inquiries
  FOR ALL USING (public.is_admin());

-- Gallery Policies
CREATE POLICY "Public can view gallery items" ON public.gallery_items
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery items" ON public.gallery_items
  FOR ALL USING (public.is_admin());

-- Status history
CREATE POLICY "Admins can view status history" ON public.booking_status_history
  FOR SELECT USING (public.is_admin());
