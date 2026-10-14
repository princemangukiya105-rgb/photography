import React, { Suspense } from 'react';
import { getServices } from '@/lib/data/repository';
import { BookingWizard } from '@/components/booking/BookingWizard';

export const metadata = {
  title: 'Online Booking System | Reserve a Session',
  description:
    'Real-time booking system for photography and cinema sessions at Moments Production in Vadodara, Gujarat. Certified available dates and guaranteed non-overlapping slots.',
};

export default async function BookingPage() {
  const services = await getServices();

  return (
    <div className="py-16 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="editorial-tag text-[#C5A059]">Direct Reservation</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2 mb-3 font-normal">
            Book Your Photography Session
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            Select your service discipline, choose an open date, and reserve your certified session window.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-24 text-zinc-400 text-xs">
              <div className="animate-spin w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full mx-auto mb-3" />
              Loading booking atelier...
            </div>
          }
        >
          <BookingWizard services={services} />
        </Suspense>
      </div>
    </div>
  );
}
