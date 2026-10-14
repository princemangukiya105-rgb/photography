# Moments Production — Photography & Cinema Agency (Vadodara, Gujarat)

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-16%20Passed-emerald?style=flat)](scripts/test-moments.ts)

A polished, secure, and commercially presentable photography agency web platform with a **genuinely functional online booking system**, **timezone-aware availability engine**, **client self-service portal**, and **protected private admin dashboard**.

---

## 🏛️ Business Overview
* **Agency:** Moments Production
* **Specialization:** Editorial Portraiture, Royal Gujarati Weddings, Fashion, Commercial, and Fine-Art Printing
* **Facility:** Studio 402, Signature Square, Race Course Road, Alkapuri, Vadodara, Gujarat 390007
* **Contact:** `+91 98765 43210` | `contact@momentsproduction.com`
* **Operating Timezone:** `Asia/Kolkata` (IST)

---

## 🛠️ Technology Stack
* **Framework:** Next.js 16 (App Router, Server Actions, Dynamic Metadata)
* **Language:** TypeScript 5 (Strict Mode)
* **Styling:** Tailwind CSS v4 with bespoke luxury editorial tokens (obsidian `#0B0B0D`, champagne gold `#C5A059`, warm white `#FAF9F5`)
* **Typography:** Cormorant Garamond (Serif display headlines) & Plus Jakarta Sans (Humanist body)
* **Database & Auth:** Supabase PostgreSQL with 100% Row Level Security (RLS) coverage + built-in zero-downtime fallback memory repository
* **Icons:** Lucide React
* **Validation & Security:** Zod schemas, sliding-window rate limiting, anti-XSS sanitization, non-guessable booking references (`MP-YYYY-XXXX`) and cryptographically strong UUID access tokens.

---

## 📸 15 Included Agency Disciplines & Services
All services, durations, pricing tiers, and descriptions are stored in database records and fully editable from the admin dashboard:
1. **Photography studio sessions** (`/services/studio-sessions`)
2. **Individual photography** (`/services/individual-portraits`)
3. **Events and parties** (`/services/events-parties`)
4. **Corporate photography** (`/services/corporate-photography`)
5. **Maternity and newborn photography** (`/services/maternity-newborn`)
6. **Family and group photography** (`/services/family-group`)
7. **Product photography** (`/services/product-photography`)
8. **Property and real-estate photography** (`/services/real-estate-property`)
9. **Headshots and portraits** (`/services/headshots-portraits`)
10. **Weddings and engagements** (`/services/weddings-engagements`)
11. **School portraits** (`/services/school-portraits`)
12. **Pre-wedding photography** (`/services/pre-wedding`)
13. **Photo printing** (`/services/photo-printing`)
14. **Framing** (`/services/custom-framing`)
15. **Albums** (`/services/bespoke-albums`)

---

## ⚡ Core Systems & Features

### 1. Real Availability Engine (`src/lib/booking-engine.ts`)
* **Studio Timezone:** Real calculations in `Asia/Kolkata`.
* **Advance Windows:** Configurable advance booking window (default: 60 days) and minimum notice restriction (default: 24 hours prior to session commencement).
* **Buffer Time:** Configurable transition buffer between sessions (default: 30 minutes).
* **Blocked Dates:** Facility closures and out-of-station assignments dynamically exclude dates from the calendar.
* **Double-Booking Overlap Prevention:** Server actions and PostgreSQL exclusion trigger `trg_prevent_booking_overlap` guarantee zero concurrent double-booking of confirmed sessions.

### 2. Request-and-Confirm Policy
* Newly submitted bookings enter an initial `pending` state.
* Only `confirmed` bookings lock calendar resources.
* Customers receive a secure non-guessable reference code (e.g. `MP-2026-X8K9`) and a secret 128-bit `access_token`.

### 3. Customer Self-Service Portal (`/booking/lookup`)
* Customers look up their reservation using their Reference and Access Key.
* **Self-Service Rescheduling:** Permitted with at least 24 hours advance notice; calculates live open slots.
* **Self-Service Cancellation:** Permitted with at least 48 hours advance notice; calculates deposit credit eligibility.

### 4. Protected Admin Dashboard (`/admin`)
* **Secure Access:** Server-side verification via Supabase Auth + profile role check, or studio bootstrap passkey.
* **Metrics:** Real-time tally of pending requests, confirmed sessions, total booked value in INR, and inquiries.
* **Booking Manager:** Confirm, reject, cancel, or reschedule bookings with full audit notes.
* **Catalog CRUD:** Adjust prices and session durations across all 15 services without code changes.
* **Calendar Control:** Configure business hours and add custom blocked dates.
* **Inquiries:** Review and update status of client messages from the contact form.
* **Settings:** Update studio phone, email, address, buffer times, and policy cutoffs.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the agency website.

### 2. Run Verification Tests
```bash
npx tsx scripts/test-moments.ts
```
Verifies all 16 engine rules (concurrency, rate limiting, token entropy, 48h/24h cutoffs, slot generator).

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔐 Administrator Bootstrap Credentials
To test or manage the admin dashboard immediately:
* **URL:** `http://localhost:3000/admin/login`
* **Email:** `admin@momentsproduction.com`
* **Passkey:** `Moments@Vadodara2026`

---

## 🗄️ Connecting Live Supabase Database (4 Simple Steps)

Moments Production runs seamlessly out of the box with the local repository adapter. When ready to connect your live Supabase cloud database:

1. **Create Supabase Project:**
   * Go to [supabase.com](https://supabase.com) and create a project named **Moments Production**.
   * Choose region: **South Asia (Mumbai - ap-south-1)** for lowest latency in Gujarat.

2. **Execute Database Migration & Seed:**
   * In Supabase, open the **SQL Editor** tab.
   * Copy and run [`supabase/migrations/20260101000000_initial_schema.sql`](supabase/migrations/20260101000000_initial_schema.sql).
   * Copy and run [`supabase/seed.sql`](supabase/seed.sql).

3. **Copy API Credentials:**
   * Navigate to **Project Settings → API**.
   * Copy `Project URL`, `anon public` key, and `service_role secret` key.

4. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=https://momentsproduction.com
   ```
   *Restart the Next.js server. The application will instantly switch to live PostgreSQL storage with full RLS protection!*

---

## 🌐 External Services Requiring Account Configuration
These features have standard placeholder configurations in `.env.example` and are ready for credential activation when your business accounts are established:
* **Resend Email API (`RESEND_API_KEY`):** For automated client email dispatches upon booking confirmation.
* **Razorpay Payment Gateway (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`):** For collecting advance deposit payments online via UPI / Credit Cards in INR.
