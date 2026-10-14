import React from 'react';
import { getBlockedDates, getBusinessHours } from '@/lib/data/repository';
import { AdminAvailabilityManager } from '@/components/admin/AdminAvailabilityManager';

export const metadata = {
  title: 'Working Hours & Blocked Dates | Moments Admin',
};

export default async function AdminAvailabilityPage() {
  const [hours, blockedDates] = await Promise.all([
    getBusinessHours(),
    getBlockedDates(),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="editorial-tag text-[#C5A059]">Calendar Control</span>
        <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
          Working Hours & Blocked Dates
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Configure weekly operational hours and block out full days for studio maintenance or holidays.
        </p>
      </div>

      <AdminAvailabilityManager
        initialHours={hours}
        initialBlockedDates={blockedDates}
      />
    </div>
  );
}
