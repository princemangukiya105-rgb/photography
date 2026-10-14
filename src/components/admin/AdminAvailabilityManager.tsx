'use client';

import React, { useState } from 'react';
import { BlockedDate, BusinessHours } from '@/types/database';
import {
  adminAddBlockedDateAction,
  adminDeleteBlockedDateAction,
} from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminAvailabilityManagerProps {
  initialHours: BusinessHours[];
  initialBlockedDates: BlockedDate[];
}

export function AdminAvailabilityManager({
  initialHours,
  initialBlockedDates,
}: AdminAvailabilityManagerProps) {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    if (startDate > endDate) {
      setMessage({ type: 'error', text: 'Start date cannot be after end date.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const res = await adminAddBlockedDateAction(startDate, endDate, reason);

    if (res.success) {
      setMessage({ type: 'success', text: `Date range blocked successfully.` });
      setBlockedDates((prev) => [
        ...prev,
        { id: `blk-${Date.now()}`, start_date: startDate, end_date: endDate, reason },
      ]);
      setStartDate('');
      setEndDate('');
      setReason('');
    } else {
      setMessage({ type: 'error', text: 'Failed to block dates.' });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const res = await adminDeleteBlockedDateAction(id);
    if (res.success) {
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      setMessage({ type: 'success', text: 'Blocked date range removed.' });
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-3.5 rounded-sm text-xs flex items-center gap-2.5 ${
            message.type === 'error'
              ? 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
              : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid: Business Hours on Left, Blocked Dates on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Business Hours */}
        <div className="lg:col-span-5 bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1F1F26] pb-3">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-lg text-[#FAF9F5]">Operating Schedule</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Current studio operational hours in Vadodara (Asia/Kolkata).
          </p>

          <div className="divide-y divide-[#1F1F26] text-xs">
            {initialHours.map((h) => (
              <div key={h.id} className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-[#FAF9F5]">{h.day_name}</span>
                {h.is_open ? (
                  <span className="text-zinc-300">
                    {h.open_time} – {h.close_time}
                  </span>
                ) : (
                  <span className="text-rose-400 uppercase text-[10px]">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Dates Management */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add Blocked Date Form */}
          <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1F1F26] pb-3">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-serif text-lg text-[#FAF9F5]">Block Studio Calendar</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Prevent bookings for holidays, private shoots, or facility maintenance.
            </p>

            <form onSubmit={handleAddBlockedDate} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                  Reason for Closure *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Diwali Studio Maintenance or Out-of-station Wedding"
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" size="sm" isLoading={isSubmitting} className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Block Date Range
                </Button>
              </div>
            </form>
          </div>

          {/* Active Blocked Dates List */}
          <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
            <h4 className="font-serif text-base text-[#FAF9F5]">Currently Blocked Ranges</h4>
            <div className="divide-y divide-[#1F1F26] text-xs">
              {blockedDates.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-medium text-[#FAF9F5] block">
                      {b.start_date} {b.start_date !== b.end_date ? `to ${b.end_date}` : ''}
                    </span>
                    <span className="text-zinc-400 text-[11px]">{b.reason}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 cursor-pointer"
                    title="Remove Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {blockedDates.length === 0 && (
                <p className="py-4 text-center text-zinc-500 text-xs">
                  No date ranges currently blocked. The studio follows standard operating hours.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
