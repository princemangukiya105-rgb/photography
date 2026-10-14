import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Copy,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { getBookingByReferenceAndToken } from '@/lib/data/repository';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';

interface ConfirmationPageProps {
  searchParams: Promise<{ ref?: string; token?: string }>;
}

export const metadata = {
  title: 'Booking Request Submitted | Moments Production',
  description: 'Your photography session request has been successfully registered.',
};

export default async function BookingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { ref, token } = await searchParams;

  if (!ref || !token) {
    notFound();
  }

  const booking = await getBookingByReferenceAndToken(ref, token);

  if (!booking) {
    notFound();
  }

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="editorial-tag text-[#C5A059]">Request Registered</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] font-normal">
            Thank You, {booking.customer_name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-light">
            Your photography session request has been submitted to Moments Production.
            Please save your reference code below.
          </p>
        </div>

        {/* Reference & Token Card */}
        <div className="bg-[#121216] border border-[#23232A] p-6 sm:p-8 rounded-sm mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1F1F26] gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                Booking Reference
              </span>
              <span className="font-mono text-2xl font-bold tracking-wider text-[#C5A059]">
                {booking.booking_reference}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">Current Status:</span>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* Secret Access Token */}
          <div className="bg-[#18181E] border border-[#2B2B36] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-medium block">
                Private Access Key
              </span>
              <span className="font-mono text-zinc-300 break-all">{booking.access_token}</span>
            </div>
            <span className="text-[10px] text-zinc-500 italic shrink-0">
              Keep this key safe to view or reschedule your session
            </span>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 pt-2">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Session Date</span>
                <span className="text-[#FAF9F5] font-medium">{booking.booking_date}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Reserved Time (IST)</span>
                <span className="text-[#FAF9F5] font-medium">
                  {booking.start_time} – {booking.end_time}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Service & Discipline</span>
                <span className="text-[#FAF9F5] font-medium">
                  {booking.service?.name || 'Photography Session'}
                </span>
                {booking.package && (
                  <span className="text-[#C5A059] block">{booking.package.name}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Location</span>
                <span className="text-[#FAF9F5] font-medium">
                  {booking.session_location_type === 'studio'
                    ? 'Alkapuri Studio 402, Vadodara'
                    : booking.location_address || 'On-Location Session'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t border-[#1F1F26] flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400">Total Estimated Fee</span>
            <span className="font-serif text-2xl text-[#FAF9F5]">
              ₹{booking.total_price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Policy Explainer */}
        <div className="bg-[#121216]/50 border border-[#23232A] p-6 rounded-sm text-xs text-zinc-400 space-y-3 mb-8">
          <h4 className="font-serif text-sm text-[#FAF9F5]">What Happens Next?</h4>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>Our studio coordinator checks crew assignment for your selected date in Vadodara.</li>
            <li>We contact you via WhatsApp / email to confirm preparation details.</li>
            <li>Once confirmed by the studio, your slot is locked exclusively with zero possibility of overlapping sessions.</li>
            <li>You can check status, request rescheduling (up to 24h prior), or cancel anytime in our client portal.</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/booking/lookup?reference=${booking.booking_reference}&token=${booking.access_token}`}>
            <Button size="md" className="gap-2 w-full sm:w-auto">
              Open Client Portal
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
