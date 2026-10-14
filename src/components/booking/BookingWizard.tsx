'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Service, ServicePackage } from '@/types/database';
import { TimeSlot } from '@/lib/booking-engine';
import { submitBookingAction } from '@/app/actions/booking';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react';

interface BookingWizardProps {
  services: Service[];
  initialServiceId?: string;
  initialPackageId?: string;
}

export function BookingWizard({
  services,
  initialServiceId,
  initialPackageId,
}: BookingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected state
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || searchParams.get('serviceId') || services[0]?.id || ''
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || searchParams.get('packageId') || ''
  );

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [locationType, setLocationType] = useState<'studio' | 'on_location'>('studio');
  const [locationAddress, setLocationAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Stepper state (1: Service, 2: Date & Slot, 3: Details & Review)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const activePackage = activeService?.packages?.find((p) => p.id === selectedPackageId);

  const totalPrice = activePackage ? activePackage.price : activeService?.base_price || 0;
  const duration = activePackage ? activePackage.duration_minutes : activeService?.duration_minutes || 60;

  // Min date (tomorrow) and max date (+60 days)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Fetch available slots when date or service/package changes
  useEffect(() => {
    if (!selectedDate || !selectedServiceId) {
      setAvailableSlots([]);
      return;
    }

    let isMounted = true;
    setIsLoadingSlots(true);
    setSelectedSlot(null);
    setErrorMessage('');

    const fetchSlots = async () => {
      try {
        const url = `/api/slots?serviceId=${selectedServiceId}&date=${selectedDate}${
          selectedPackageId ? `&packageId=${selectedPackageId}` : ''
        }`;
        const res = await fetch(url);
        const data = await res.json();
        if (isMounted) {
          if (data.slots) {
            setAvailableSlots(data.slots);
          } else {
            setAvailableSlots([]);
          }
        }
      } catch {
        if (isMounted) setAvailableSlots([]);
      } finally {
        if (isMounted) setIsLoadingSlots(false);
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedServiceId, selectedPackageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage('Please choose an available time slot.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must review and agree to the studio policies.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('service_id', selectedServiceId);
    if (selectedPackageId) formData.append('package_id', selectedPackageId);
    formData.append('customer_name', customerName);
    formData.append('customer_email', customerEmail);
    formData.append('customer_phone', customerPhone);
    formData.append('session_location_type', locationType);
    if (locationAddress) formData.append('location_address', locationAddress);
    formData.append('booking_date', selectedDate);
    formData.append('start_time', selectedSlot.startTime);
    formData.append('end_time', selectedSlot.endTime);
    formData.append('total_price', totalPrice.toString());
    if (notes) formData.append('customer_notes', notes);
    formData.append('agree_terms', 'true');

    const result = await submitBookingAction(null, formData);

    if (result.success && result.bookingReference && result.accessToken) {
      router.push(
        `/booking/confirmation?ref=${result.bookingReference}&token=${result.accessToken}`
      );
    } else {
      setErrorMessage(result.error || 'Booking reservation could not be completed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-10 border-b border-[#23232A] pb-6">
        {[
          { num: 1, title: 'Discipline & Package' },
          { num: 2, title: 'Date & Time Slot' },
          { num: 3, title: 'Session Specifications' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-3 ${
              step >= s.num ? 'text-[#C5A059]' : 'text-zinc-600'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border ${
                step === s.num
                  ? 'border-[#C5A059] bg-[#C5A059] text-[#0B0B0D]'
                  : step > s.num
                  ? 'border-[#C5A059] bg-[#16161A] text-[#C5A059]'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-500'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className="hidden sm:inline text-xs uppercase tracking-widest font-medium">
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="p-4 mb-8 bg-rose-950/40 border border-rose-800/60 rounded-sm flex items-start gap-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: SERVICE & PACKAGE SELECTION */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-[#FAF9F5] mb-2 font-normal">
              1. Select Photography Service
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Choose from our 15 specialized photography disciplines in Vadodara.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => {
              const isSelected = service.id === selectedServiceId;
              return (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    setSelectedPackageId('');
                  }}
                  className={`p-5 rounded-sm border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#18181E] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                      : 'bg-[#121216] border-[#23232A] hover:border-[#C5A059]/40'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-medium block mb-1">
                    {service.category}
                  </span>
                  <h4 className="font-serif text-base text-[#FAF9F5] mb-2">{service.name}</h4>
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-[#1F1F26]">
                    <span>Approx. {service.duration_minutes}m</span>
                    <span className="font-medium text-[#FAF9F5]">
                      ₹{service.base_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Packages if present */}
          {activeService?.packages && activeService.packages.length > 0 && (
            <div className="pt-6 border-t border-[#23232A] space-y-4">
              <h4 className="font-serif text-lg text-[#FAF9F5]">
                Available Package Tiers for {activeService.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeService.packages.map((pkg) => {
                  const isPkgSelected = pkg.id === selectedPackageId;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-5 rounded-sm border cursor-pointer transition-all ${
                        isPkgSelected
                          ? 'bg-[#18181E] border-[#C5A059] shadow-md shadow-[#C5A059]/10'
                          : 'bg-[#121216] border-[#23232A] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-base text-[#FAF9F5]">{pkg.name}</span>
                        <span className="font-medium text-[#C5A059] text-sm">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{pkg.description}</p>
                      <ul className="text-[11px] text-zinc-300 space-y-1">
                        {pkg.includes.map((inc, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-[#C5A059] rounded-full" />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                if (!selectedServiceId) {
                  setErrorMessage('Please select a service.');
                  return;
                }
                setErrorMessage('');
                setStep(2);
              }}
              className="gap-2"
            >
              Next: Select Date & Time
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME SLOT SELECTION */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-[#FAF9F5] mb-2 font-normal">
              2. Select Certified Available Slot
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Our live calendar calculates real studio hours and buffer intervals in Vadodara timezone (IST).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Date Picker Input */}
            <div className="md:col-span-5 bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-medium">
                Choose Session Date *
              </label>
              <input
                type="date"
                min={minDateStr}
                max={maxDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-3 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
              />
              <div className="text-[11px] text-zinc-400 space-y-1 pt-2">
                <p>• Advance booking window: Up to 60 days</p>
                <p>• Minimum preparation notice: 24 hours</p>
                <p>• Sunday operating hours: 11:00 AM – 5:00 PM</p>
                <p>• Mon – Sat operating hours: 10:00 AM – 7:00 PM</p>
              </div>
            </div>

            {/* Time Slots Area */}
            <div className="md:col-span-7 bg-[#121216] border border-[#23232A] p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-base text-[#FAF9F5]">
                  Available Slots for {selectedDate || 'Selected Date'}
                </h4>
                <span className="text-xs text-[#C5A059] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {duration} min session
                </span>
              </div>

              {!selectedDate ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50 text-[#C5A059]" />
                  Please pick a date to compute live availability.
                </div>
              ) : isLoadingSlots ? (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  <div className="animate-spin w-5 h-5 border-2 border-[#C5A059] border-t-transparent rounded-full mx-auto mb-3" />
                  Computing non-overlapping studio slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs space-y-2">
                  <AlertCircle className="w-6 h-6 mx-auto text-amber-500" />
                  <p className="font-serif text-sm text-[#FAF9F5]">No slots available on this date</p>
                  <p className="text-[11px] text-zinc-500">
                    The studio is either fully booked, closed for scheduled maintenance, or violates the 24-hour advance notice window. Please choose another date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot, i) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime &&
                      selectedSlot?.endTime === slot.endTime;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-sm border text-xs text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#C5A059] text-[#0B0B0D] border-[#C5A059] font-medium shadow-md shadow-[#C5A059]/20'
                            : 'bg-[#18181E] text-zinc-300 border-[#2B2B36] hover:border-[#C5A059]/60'
                        }`}
                      >
                        <span className="block font-semibold">{slot.startTime}</span>
                        <span className="text-[10px] opacity-75">until {slot.endTime}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={() => {
                if (!selectedSlot) {
                  setErrorMessage('Please choose a time slot to proceed.');
                  return;
                }
                setErrorMessage('');
                setStep(3);
              }}
              className="gap-2"
            >
              Next: Client Details & Policy
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS, REVIEW & SUBMISSION */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-[#FAF9F5] mb-2 font-normal">
              3. Client Specifications & Booking Terms
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Please enter your direct contact information for booking dispatch and confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Input Fields */}
            <div className="md:col-span-7 bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Meera Desai"
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3.5 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98250 XXXXX"
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3.5 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3.5 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Location Preference */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
                  Session Location *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationType('studio')}
                    className={`p-3 rounded-sm border text-xs text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      locationType === 'studio'
                        ? 'bg-[#1A1A22] border-[#C5A059] text-[#FAF9F5]'
                        : 'bg-[#15151A] border-[#2B2B36] text-zinc-400'
                    }`}
                  >
                    <Building className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Moments Studio</span>
                      <span className="text-[10px] text-zinc-400">Alkapuri, Vadodara</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationType('on_location')}
                    className={`p-3 rounded-sm border text-xs text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      locationType === 'on_location'
                        ? 'bg-[#1A1A22] border-[#C5A059] text-[#FAF9F5]'
                        : 'bg-[#15151A] border-[#2B2B36] text-zinc-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">On-Location</span>
                      <span className="text-[10px] text-zinc-400">Client Venue / Outdoor</span>
                    </div>
                  </button>
                </div>
              </div>

              {locationType === 'on_location' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                    Venue or Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="e.g. Laxmi Vilas Palace lawns, Vadodara"
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3.5 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                  Creative Notes or Aesthetic Guidance
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention desired backdrops, outfit count, or special family milestones..."
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-3.5 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Summary & Policy Acknowledgement */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
                <h4 className="font-serif text-lg text-[#FAF9F5] border-b border-[#23232A] pb-3">
                  Commission Summary
                </h4>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service:</span>
                    <span className="font-medium text-[#FAF9F5] text-right">{activeService.name}</span>
                  </div>

                  {activePackage && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Package:</span>
                      <span className="font-medium text-[#C5A059] text-right">{activePackage.name}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-zinc-500">Date:</span>
                    <span className="font-medium text-[#FAF9F5]">{selectedDate}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">Time Window:</span>
                    <span className="font-medium text-[#FAF9F5]">
                      {selectedSlot?.startTime} – {selectedSlot?.endTime} (IST)
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">Location:</span>
                    <span className="font-medium text-[#FAF9F5]">
                      {locationType === 'studio' ? 'Alkapuri Studio 402' : locationAddress || 'On-Location'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#1F1F26] flex justify-between items-baseline">
                    <span className="text-xs uppercase text-zinc-400 font-semibold">Total Fee:</span>
                    <span className="font-serif text-2xl text-[#FAF9F5]">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-sm text-[11px] text-amber-200 leading-relaxed">
                  <span className="font-semibold block text-[#C5A059] mb-1">
                    Request-and-Confirm Policy
                  </span>
                  Newly submitted requests have a pending status. Only confirmed bookings block the resource. Our studio producer verifies crew allocation before final confirmation.
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 accent-[#C5A059] rounded"
                    />
                    <span className="text-xs text-zinc-300 leading-snug">
                      I understand and agree to the 48-hour cancellation cutoff and 24-hour rescheduling policy of Moments Production.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!agreeTerms}
                  className="w-full gap-2 mt-4"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Submit Booking Request
                </Button>
              </div>

              <div className="text-center">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2 text-xs">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Modify Slot
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
