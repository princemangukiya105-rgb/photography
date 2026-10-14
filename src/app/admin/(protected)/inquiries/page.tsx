import React from 'react';
import { getInquiries } from '@/lib/data/repository';
import { AdminInquiriesManager } from '@/components/admin/AdminInquiriesManager';

export const metadata = {
  title: 'Client Inquiries | Moments Admin',
};

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="editorial-tag text-[#C5A059]">Communications</span>
        <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
          Client Inquiries
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Review submissions received through the website contact form and track follow-up progress.
        </p>
      </div>

      <AdminInquiriesManager initialInquiries={inquiries} />
    </div>
  );
}
