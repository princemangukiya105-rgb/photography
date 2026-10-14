import React, { Suspense } from 'react';
import { BookingLookupClient } from '@/components/booking/BookingLookupClient';

export const metadata = {
  title: 'Client Portal | Lookup & Manage Booking',
  description:
    'Lookup, reschedule, or cancel your photography reservation at Moments Production with your booking reference.',
};

export default function BookingLookupPage() {
  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="editorial-tag text-[#C5A059]">Client Self-Service</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2 mb-3 font-normal">
            Booking Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            Review your session specs, check confirmation status, or submit rescheduling requests in compliance with our studio policies.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-20 text-zinc-400 text-xs">
              <div className="animate-spin w-5 h-5 border-2 border-[#C5A059] border-t-transparent rounded-full mx-auto mb-3" />
              Loading reservation lookup...
            </div>
          }
        >
          <BookingLookupClient />
        </Suspense>
      </div>
    </div>
  );
}
