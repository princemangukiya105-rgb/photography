'use client';

import React, { useState } from 'react';
import { Inquiry } from '@/types/database';
import { adminUpdateInquiryStatusAction } from '@/app/actions/admin';
import { StatusBadge } from '@/components/ui/Badge';
import { Mail, Phone, Calendar, Check, Archive, MessageSquare } from 'lucide-react';

interface AdminInquiriesManagerProps {
  initialInquiries: Inquiry[];
}

export function AdminInquiriesManager({ initialInquiries }: AdminInquiriesManagerProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [filter, setFilter] = useState<string>('all');

  const filtered = inquiries.filter((i) => {
    if (filter !== 'all' && i.status !== filter) return false;
    return true;
  });

  const handleUpdateStatus = async (id: string, status: 'new' | 'contacted' | 'archived') => {
    const res = await adminUpdateInquiryStatusAction(id, status);
    if (res.success) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#23232A] pb-3">
        {['all', 'new', 'contacted', 'archived'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition-colors cursor-pointer ${
              filter === f
                ? 'bg-[#C5A059] text-black font-semibold'
                : 'text-zinc-400 hover:text-white bg-[#16161C]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((inq) => (
          <div
            key={inq.id}
            className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
                  {inq.service_interest}
                </span>
                <StatusBadge status={inq.status} size="sm" />
              </div>

              <div>
                <h3 className="font-serif text-lg text-[#FAF9F5]">{inq.name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-1">
                  <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-white">
                    <Phone className="w-3 h-3 text-[#C5A059]" />
                    {inq.phone}
                  </a>
                  <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-white">
                    <Mail className="w-3 h-3 text-[#C5A059]" />
                    {inq.email}
                  </a>
                  {inq.event_date && (
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      Date: {inq.event_date}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#18181E] border border-[#23232A] rounded text-xs text-zinc-300 leading-relaxed font-light">
                {inq.message}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F1F26] flex items-center justify-between text-xs">
              <span className="text-[10px] text-zinc-500">
                Received: {new Date(inq.created_at).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {inq.status !== 'contacted' && (
                  <button
                    onClick={() => handleUpdateStatus(inq.id, 'contacted')}
                    className="px-2.5 py-1 text-[11px] rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    Mark Contacted
                  </button>
                )}
                {inq.status !== 'archived' && (
                  <button
                    onClick={() => handleUpdateStatus(inq.id, 'archived')}
                    className="px-2.5 py-1 text-[11px] rounded bg-zinc-900 text-zinc-400 border border-zinc-700 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Archive className="w-3 h-3" />
                    Archive
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-[#121216] border border-[#23232A] rounded-sm text-zinc-500 text-xs">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50 text-[#C5A059]" />
            No inquiries matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
