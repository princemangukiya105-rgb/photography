import React from 'react';
import { getBookings } from '@/lib/data/repository';
import { AdminBookingsManager } from '@/components/admin/AdminBookingsManager';

export const metadata = {
  title: 'Manage Bookings | Moments Admin',
};

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="editorial-tag text-[#C5A059]">Schedule & Reservations</span>
        <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
          Bookings Management
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Review pending requests, confirm calendar reservations, and manage customer cancellations or rescheduling.
        </p>
      </div>

      <AdminBookingsManager initialBookings={bookings} />
    </div>
  );
}
