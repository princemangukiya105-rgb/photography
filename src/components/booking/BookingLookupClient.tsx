'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Booking } from '@/types/database';
import {
  lookupBookingAction,
  cancelBookingAction,
  rescheduleBookingAction,
} from '@/app/actions/booking';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { TimeSlot } from '@/lib/booking-engine';

export function BookingLookupClient() {
  const searchParams = useSearchParams();

  const [reference, setReference] = useState(searchParams.get('reference') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [email, setEmail] = useState('');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Auto-search if ref & token present in URL
  useEffect(() => {
    const initRef = searchParams.get('reference');
    const initToken = searchParams.get('token');
    if (initRef && initToken) {
      handleLookup(initRef, initToken, '');
    }
  }, []);

  const handleLookup = async (lookupRef: string, lookupToken: string, lookupEmail: string) => {
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('reference', lookupRef);
    if (lookupToken) formData.append('token', lookupToken);
    if (lookupEmail) formData.append('email', lookupEmail);

    const res = await lookupBookingAction(null, formData);

    if (res.success && res.booking) {
      setBooking(res.booking as Booking);
      setMessage(null);
    } else {
      setBooking(null);
      setMessage({ type: 'error', text: res.error || 'Booking not found.' });
    }
    setIsLoading(false);
  };

  // Fetch slots for rescheduling
  useEffect(() => {
    if (!newDate || !booking) {
      setAvailableSlots([]);
      return;
    }

    let active = true;
    setIsLoadingSlots(true);
    setSelectedSlot(null);

    fetch(`/api/slots?serviceId=${booking.service_id}&date=${newDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setAvailableSlots(data.slots || []);
          setIsLoadingSlots(false);
        }
      })
      .catch(() => {
        if (active) {
          setAvailableSlots([]);
          setIsLoadingSlots(false);
        }
      });

    return () => {
      active = false;
    };
  }, [newDate, booking]);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsCancelling(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('reference', booking.booking_reference);
    formData.append('token', booking.access_token);
    formData.append('reason', cancelReason);

    const res = await cancelBookingAction(null, formData);

    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Booking cancelled.' });
      setShowCancelModal(false);
      // Reload booking
      handleLookup(booking.booking_reference, booking.access_token, '');
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to cancel.' });
    }
    setIsCancelling(false);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !selectedSlot) return;

    setIsRescheduling(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('reference', booking.booking_reference);
    formData.append('token', booking.access_token);
    formData.append('new_date', newDate);
    formData.append('new_start_time', selectedSlot.startTime);
    formData.append('new_end_time', selectedSlot.endTime);
    formData.append('reason', rescheduleReason);

    const res = await rescheduleBookingAction(null, formData);

    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Session rescheduled.' });
      setShowRescheduleModal(false);
      // Reload booking
      handleLookup(booking.booking_reference, booking.access_token, '');
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to reschedule.' });
    }
    setIsRescheduling(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Box */}
      <div className="bg-[#121216] border border-[#23232A] p-6 sm:p-8 rounded-sm space-y-6">
        <h3 className="font-serif text-2xl text-[#FAF9F5]">
          Find Your Reservation
        </h3>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Enter your unique Booking Reference (e.g., MP-2026-X8K9) along with either your private
          Access Key or the Email address used when reserving.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup(reference, token, email);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
              Booking Reference *
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="MP-2026-XXXX"
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm font-mono tracking-wider text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                Private Access Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="UUID access token"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2 text-xs font-mono text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                Or Customer Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full gap-2">
            <Search className="w-4 h-4" />
            Lookup Reservation
          </Button>
        </form>
      </div>

      {message && (
        <div
          className={`p-4 rounded-sm text-xs flex items-start gap-2.5 ${
            message.type === 'error'
              ? 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
              : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
          }`}
        >
          {message.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Booking Record Display */}
      {booking && (
        <div className="bg-[#121216] border border-[#23232A] p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1F1F26] gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">
                Booking Reference
              </span>
              <span className="font-mono text-xl font-bold text-[#C5A059]">
                {booking.booking_reference}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">Status:</span>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Date</span>
                <span className="text-[#FAF9F5] font-medium">{booking.booking_date}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Time Window (IST)</span>
                <span className="text-[#FAF9F5] font-medium">
                  {booking.start_time} – {booking.end_time}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Service</span>
                <span className="text-[#FAF9F5] font-medium">{booking.service?.name}</span>
                {booking.package && (
                  <span className="text-[#C5A059] block">{booking.package.name}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block">Location</span>
                <span className="text-[#FAF9F5] font-medium">
                  {booking.session_location_type === 'studio'
                    ? 'Moments Studio (Alkapuri Studio 402, Vadodara)'
                    : booking.location_address || 'On-Location Session'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F1F26] flex items-center justify-between text-xs">
            <span className="text-zinc-400 uppercase tracking-wider">Total Fee</span>
            <span className="font-serif text-xl text-[#FAF9F5]">
              ₹{booking.total_price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Action Buttons for Client */}
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <div className="pt-4 border-t border-[#1F1F26] flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRescheduleModal(true)}
                className="gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Request Rescheduling
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowCancelModal(true)}
                className="gap-2"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel Reservation
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && booking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#2B2B36] p-6 max-w-md w-full rounded-sm space-y-4">
            <h4 className="font-serif text-lg text-rose-300">
              Confirm Cancellation
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Per our studio policy, cancellations must be made at least 48 hours prior to session start.
            </p>
            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm p-3 text-xs text-[#FAF9F5] focus:outline-none focus:border-rose-400"
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Dismiss
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  isLoading={isCancelling}
                >
                  Confirm Cancellation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && booking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#2B2B36] p-6 max-w-lg w-full rounded-sm space-y-4">
            <h4 className="font-serif text-lg text-[#FAF9F5]">
              Request New Date & Slot
            </h4>
            <p className="text-xs text-zinc-300">
              Choose an alternative available date and time slot.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm p-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {newDate && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                    Available Slots
                  </label>
                  {isLoadingSlots ? (
                    <p className="text-xs text-zinc-500 py-3">Computing available slots...</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-xs text-amber-400 py-3">No available slots on this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 text-xs rounded border text-center ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'bg-[#C5A059] text-black border-[#C5A059] font-medium'
                              : 'bg-[#18181E] text-zinc-300 border-[#2B2B36]'
                          }`}
                        >
                          {slot.startTime} – {slot.endTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                  Reason / Notes
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Schedule conflict with family travel"
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm p-2 text-xs text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!selectedSlot}
                  isLoading={isRescheduling}
                >
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
