'use client';

import React, { useState } from 'react';
import { BusinessSettings } from '@/types/database';
import { adminUpdateSettingsAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Save, Building, Clock, Phone, Shield } from 'lucide-react';

interface AdminSettingsManagerProps {
  initialSettings: BusinessSettings;
}

export function AdminSettingsManager({ initialSettings }: AdminSettingsManagerProps) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await adminUpdateSettingsAction(settings);

    if (res.success && res.settings) {
      setSettings(res.settings as BusinessSettings);
      setMessage({ type: 'success', text: 'Studio business settings updated successfully.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update settings.' });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
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

      {/* Identity & Contact */}
      <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1F1F26] pb-3">
          <Building className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-lg text-[#FAF9F5]">Brand & Contact Info</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={settings.business_name}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Primary Phone
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Address Line 1 (Studio)
            </label>
            <input
              type="text"
              name="address_line1"
              value={settings.address_line1}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              City / State / Postal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
                placeholder="City"
                className="bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
              />
              <input
                type="text"
                name="state"
                value={settings.state}
                onChange={handleChange}
                placeholder="State"
                className="bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
              />
              <input
                type="text"
                name="postal_code"
                value={settings.postal_code}
                onChange={handleChange}
                placeholder="PIN"
                className="bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Rules & Cutoffs */}
      <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1F1F26] pb-3">
          <Clock className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-lg text-[#FAF9F5]">Booking Rules & Cutoffs</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Max Advance (Days)
            </label>
            <input
              type="number"
              name="advance_booking_days"
              value={settings.advance_booking_days}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Slot Buffer (Minutes)
            </label>
            <input
              type="number"
              name="buffer_minutes"
              value={settings.buffer_minutes}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Cancellation Cutoff (Hours)
            </label>
            <input
              type="number"
              name="cancellation_cutoff_hours"
              value={settings.cancellation_cutoff_hours}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
              Reschedule Cutoff (Hours)
            </label>
            <input
              type="number"
              name="reschedule_cutoff_hours"
              value={settings.reschedule_cutoff_hours}
              onChange={handleChange}
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded p-2 text-xs text-[#FAF9F5]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          Save Studio Settings
        </Button>
      </div>
    </form>
  );
}
