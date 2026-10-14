'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus } from '@/types/database';
import {
  adminUpdateBookingStatusAction,
  adminRescheduleBookingAction,
} from '@/app/actions/admin';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface AdminBookingsManagerProps {
  initialBookings: Booking[];
}

export function AdminBookingsManager({ initialBookings }: AdminBookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleStartTime, setRescheduleStartTime] = useState<string>('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState<string>('');
  const [rescheduleNote, setRescheduleNote] = useState<string>('');

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (dateFilter && b.booking_date !== dateFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        b.booking_reference.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_email.toLowerCase().includes(q) ||
        b.customer_phone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    note: string
  ) => {
    setIsProcessing(true);
    setActionMessage(null);

    const res = await adminUpdateBookingStatusAction(bookingId, newStatus, note);

    if (res.success) {
      setActionMessage({ type: 'success', text: `Booking marked as ${newStatus}.` });
      setBookings((prev) =>
        prev.map((item) => (item.id === bookingId ? { ...item, status: newStatus } : item))
      );
      if (activeBooking && activeBooking.id === bookingId) {
        setActiveBooking({ ...activeBooking, status: newStatus });
      }
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Failed to update status.' });
    }
    setIsProcessing(false);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;

    setIsProcessing(true);
    setActionMessage(null);

    const res = await adminRescheduleBookingAction(
      activeBooking.id,
      rescheduleDate,
      rescheduleStartTime,
      rescheduleEndTime,
      rescheduleNote || 'Admin rescheduled'
    );

    if (res.success) {
      setActionMessage({
        type: 'success',
        text: `Session rescheduled to ${rescheduleDate} (${rescheduleStartTime}-${rescheduleEndTime}).`,
      });
      setBookings((prev) =>
        prev.map((item) =>
          item.id === activeBooking.id
            ? {
                ...item,
                booking_date: rescheduleDate,
                start_time: rescheduleStartTime,
                end_time: rescheduleEndTime,
                status: 'rescheduled',
              }
            : item
        )
      );
      setIsRescheduling(false);
    } else {
      setActionMessage({ type: 'error', text: res.error || 'Reschedule conflict occurred.' });
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-[#121216] border border-[#23232A] p-4 rounded-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, phone, reference..."
            className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm pl-9 pr-4 py-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3 py-1.5 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3 py-1.5 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-sm text-xs flex items-center gap-2.5 ${
            actionMessage.type === 'error'
              ? 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
              : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
          }`}
        >
          {actionMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Bookings Table / List */}
      <div className="bg-[#121216] border border-[#23232A] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#23232A] bg-[#16161C] text-zinc-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Reference</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Discipline</th>
                <th className="py-3.5 px-4 font-semibold">Date & Window (IST)</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Fee</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F26]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#181820] transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-[#C5A059]">
                    {b.booking_reference}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#FAF9F5] block">{b.customer_name}</span>
                    <span className="text-[11px] text-zinc-400 block">{b.customer_phone}</span>
                    <span className="text-[10px] text-zinc-500 block">{b.customer_email}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#FAF9F5] block">{b.service?.name}</span>
                    {b.package && (
                      <span className="text-[11px] text-[#C5A059] block">{b.package.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#FAF9F5] font-medium block">{b.booking_date}</span>
                    <span className="text-zinc-400 text-[11px]">
                      {b.start_time} - {b.end_time}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-zinc-400">
                    {b.session_location_type === 'studio' ? (
                      <span className="text-zinc-300">Studio 402</span>
                    ) : (
                      <span className="truncate max-w-[120px] block" title={b.location_address || ''}>
                        {b.location_address || 'On-Location'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-medium text-[#FAF9F5]">
                    ₹{b.total_price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'pending' && (
                        <>
                          <button
                            title="Confirm Booking"
                            disabled={isProcessing}
                            onClick={() =>
                              handleUpdateStatus(
                                b.id,
                                'confirmed',
                                'Confirmed by administrator after crew allocation check'
                              )
                            }
                            className="p-1.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Reject Booking"
                            disabled={isProcessing}
                            onClick={() =>
                              handleUpdateStatus(
                                b.id,
                                'rejected',
                                'Rejected by studio administrator'
                              )
                            }
                            className="p-1.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 hover:bg-rose-900 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setActiveBooking(b);
                          setRescheduleDate(b.booking_date);
                          setRescheduleStartTime(b.start_time);
                          setRescheduleEndTime(b.end_time);
                        }}
                        className="px-2.5 py-1 text-[11px] rounded bg-[#1C1C24] text-zinc-300 hover:text-white border border-[#2E2E3A] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-500">
                    No bookings found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Modify Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#23232A] p-6 max-w-xl w-full rounded-sm space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F1F26] pb-3">
              <div>
                <span className="font-mono text-sm text-[#C5A059] font-bold">
                  {activeBooking.booking_reference}
                </span>
                <h3 className="font-serif text-lg text-[#FAF9F5]">
                  Reservation Details & History
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveBooking(null);
                  setIsRescheduling(false);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block">Customer</span>
                <span className="font-medium text-[#FAF9F5]">{activeBooking.customer_name}</span>
                <span className="block text-zinc-400">{activeBooking.customer_phone}</span>
                <span className="block text-zinc-400">{activeBooking.customer_email}</span>
              </div>

              <div>
                <span className="text-zinc-500 block">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={activeBooking.status} />
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block">Session Time</span>
                <span className="text-[#FAF9F5]">
                  {activeBooking.booking_date} ({activeBooking.start_time} - {activeBooking.end_time})
                </span>
              </div>

              <div>
                <span className="text-zinc-500 block">Total Price</span>
                <span className="text-[#FAF9F5] font-serif text-base">
                  ₹{activeBooking.total_price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1 text-xs bg-[#18181E] p-3 rounded border border-[#25252E]">
              <span className="text-[#C5A059] uppercase tracking-wider text-[10px] block font-medium">
                Customer Guidance Notes
              </span>
              <p className="text-zinc-300 italic">
                {activeBooking.customer_notes || 'No special notes provided by client.'}
              </p>
            </div>

            {/* Reschedule View inside Modal */}
            {isRescheduling ? (
              <form
                onSubmit={handleRescheduleSubmit}
                className="space-y-3 pt-3 border-t border-[#1F1F26]"
              >
                <h4 className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold">
                  Administrator Slot Rescheduling
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">New Date</label>
                    <input
                      type="date"
                      required
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-1.5 text-xs text-[#FAF9F5]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Start Time (HH:MM)</label>
                    <input
                      type="text"
                      required
                      value={rescheduleStartTime}
                      onChange={(e) => setRescheduleStartTime(e.target.value)}
                      className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-1.5 text-xs text-[#FAF9F5]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">End Time (HH:MM)</label>
                    <input
                      type="text"
                      required
                      value={rescheduleEndTime}
                      onChange={(e) => setRescheduleEndTime(e.target.value)}
                      className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-1.5 text-xs text-[#FAF9F5]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRescheduling(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" isLoading={isProcessing}>
                    Save Reschedule
                  </Button>
                </div>
              </form>
            ) : (
              <div className="pt-4 border-t border-[#1F1F26] flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRescheduling(true)}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reschedule Slot
                </Button>

                <div className="flex items-center gap-2">
                  {activeBooking.status !== 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(activeBooking.id, 'confirmed', 'Confirmed by admin')
                      }
                      className="text-xs"
                    >
                      Confirm Booking
                    </Button>
                  )}

                  {activeBooking.status === 'confirmed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(activeBooking.id, 'completed', 'Marked completed by admin')
                      }
                      className="text-xs"
                    >
                      Mark Completed
                    </Button>
                  )}

                  {activeBooking.status !== 'cancelled' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(activeBooking.id, 'cancelled', 'Cancelled by admin')
                      }
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
