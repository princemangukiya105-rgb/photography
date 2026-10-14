import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getBusinessSettings } from '@/lib/data/repository';

export const metadata = {
  title: 'Cancellation & Rescheduling Policy',
  description:
    'Cancellation, rescheduling, and deposit credit guidelines for photography sessions at Moments Production Vadodara.',
};

export default async function CancellationPolicyPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="editorial-tag text-[#C5A059]">Transparent Booking Guidelines</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Cancellation & Rescheduling Policy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            Effective for all commissioned studio, on-location, and event visual sessions.
          </p>
        </div>

        <div className="space-y-10 text-sm text-zinc-300 leading-relaxed font-light">
          {/* Policy Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-[#121216] border border-[#23232A] rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-[#C5A059] font-medium text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                Rescheduling Window
              </div>
              <p className="font-serif text-2xl text-[#FAF9F5]">
                {settings.reschedule_cutoff_hours} Hours Prior
              </p>
              <p className="text-xs text-zinc-400">
                You may request an alternative date/time slot with at least {settings.reschedule_cutoff_hours} hours advance notice via your booking reference portal.
              </p>
            </div>

            <div className="p-6 bg-[#121216] border border-[#23232A] rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-[#C5A059] font-medium text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Cancellation Cutoff
              </div>
              <p className="font-serif text-2xl text-[#FAF9F5]">
                {settings.cancellation_cutoff_hours} Hours Prior
              </p>
              <p className="text-xs text-zinc-400">
                Cancellations submitted at least {settings.cancellation_cutoff_hours} hours ahead are eligible for full deposit credit or reschedule allocation.
              </p>
            </div>
          </div>

          <div className="bg-[#121216] border border-[#23232A] p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl text-[#FAF9F5]">1. Booking Confirmation & Slot Protection</h2>
            <p>
              When an online booking is submitted, it enters an initial <strong className="text-amber-400">pending</strong> state. Our studio producer verifies crew allocation and equipment requirements before marking the session as <strong className="text-emerald-400">confirmed</strong>. Once confirmed, that date and time slot is locked exclusively for your session, preventing any overlapping bookings.
            </p>

            <h2 className="font-serif text-xl text-[#FAF9F5]">2. Rescheduling Procedure</h2>
            <p>
              Clients can request a date or time modification directly using their unique non-guessable booking reference (e.g., <code>MP-2026-XXXX</code>) and private access code at our{' '}
              <Link href="/booking/lookup" className="text-[#C5A059] underline hover:text-[#D4AF37]">
                Self-Service Lookup Portal
              </Link>.
              If requested at least {settings.reschedule_cutoff_hours} hours in advance, no rescheduling fee is charged, subject to schedule availability.
            </p>

            <h2 className="font-serif text-xl text-[#FAF9F5]">3. Late Cancellations & No-Shows</h2>
            <p>
              Because our studio lights, backdrops, and creative crew are reserved specifically for confirmed sessions, cancellations requested less than {settings.cancellation_cutoff_hours} hours prior to scheduled session commencement forfeit the deposit to compensate for blocked calendar capacity.
            </p>

            <h2 className="font-serif text-xl text-[#FAF9F5]">4. Inclement Weather (Outdoor & Destination Shoots)</h2>
            <p>
              For exterior shoots (e.g. pre-wedding shoots around Champaner, heritage garden portraits, or outdoor ceremonies), if adverse weather conditions or safety hazards prevent safe photography, the studio will reschedule the session without penalty to the earliest mutually viable date.
            </p>
          </div>

          {/* Portal Link */}
          <div className="text-center pt-4">
            <Link href="/booking/lookup">
              <Button variant="secondary" size="md">
                Manage an Existing Booking
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
