import React from 'react';
import { getAllServicesAdmin } from '@/lib/data/repository';
import { AdminServicesManager } from '@/components/admin/AdminServicesManager';

export const metadata = {
  title: 'Services & Pricing | Moments Admin',
};

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="editorial-tag text-[#C5A059]">Portfolio & Catalog</span>
        <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
          Services & Pricing Management
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Adjust base pricing, session durations, and toggle services on the live website.
        </p>
      </div>

      <AdminServicesManager initialServices={services} />
    </div>
  );
}
