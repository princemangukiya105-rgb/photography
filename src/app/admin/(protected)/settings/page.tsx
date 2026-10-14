import React from 'react';
import { getBusinessSettings } from '@/lib/data/repository';
import { AdminSettingsManager } from '@/components/admin/AdminSettingsManager';

export const metadata = {
  title: 'Studio Profile & Settings | Moments Admin',
};

export default async function AdminSettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="editorial-tag text-[#C5A059]">Agency Configuration</span>
        <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
          Studio Profile & Rules
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Update public business contact information, Vadodara studio address, buffer times, and cancellation cutoffs.
        </p>
      </div>

      <AdminSettingsManager initialSettings={settings} />
    </div>
  );
}
