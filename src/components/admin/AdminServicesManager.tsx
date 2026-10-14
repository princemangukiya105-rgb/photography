'use client';

import React, { useState } from 'react';
import { Service } from '@/types/database';
import { adminUpdateServiceAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Edit, Clock, IndianRupee, Layers } from 'lucide-react';

interface AdminServicesManagerProps {
  initialServices: Service[];
}

export function AdminServicesManager({ initialServices }: AdminServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(0);
  const [editActive, setEditActive] = useState<boolean>(true);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setEditPrice(service.base_price);
    setEditDuration(service.duration_minutes);
    setEditActive(service.is_active);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setIsSaving(true);
    setMessage(null);

    const res = await adminUpdateServiceAction(editingService.id, {
      base_price: Number(editPrice),
      duration_minutes: Number(editDuration),
      is_active: editActive,
    });

    if (res.success && res.service) {
      setMessage({ type: 'success', text: `Updated "${editingService.name}" successfully.` });
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? (res.service as Service) : s))
      );
      setEditingService(null);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update service.' });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
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

      {/* Services Table */}
      <div className="bg-[#121216] border border-[#23232A] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#23232A] bg-[#16161C] text-zinc-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Order</th>
                <th className="py-3.5 px-4 font-semibold">Service Name</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Base Price</th>
                <th className="py-3.5 px-4 font-semibold">Duration</th>
                <th className="py-3.5 px-4 font-semibold">Packages</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F26]">
              {services.map((s, index) => (
                <tr key={s.id} className="hover:bg-[#181820] transition-colors">
                  <td className="py-3.5 px-4 text-zinc-500 font-mono">{index + 1}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#FAF9F5] block">{s.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">/services/{s.slug}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#C5A059]">{s.category}</td>
                  <td className="py-3.5 px-4 font-medium text-[#FAF9F5]">
                    ₹{s.base_price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{s.duration_minutes} min</td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {s.packages?.length || 0} configured
                  </td>
                  <td className="py-3.5 px-4">
                    {s.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-700">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleEditClick(s)}
                      className="px-2.5 py-1 text-[11px] rounded bg-[#1C1C24] text-zinc-300 hover:text-white border border-[#2E2E3A] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-[#C5A059]" />
                      Edit Pricing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing / Duration Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#2B2B36] p-6 max-w-md w-full rounded-sm space-y-4">
            <h3 className="font-serif text-lg text-[#FAF9F5]">
              Update Pricing: {editingService.name}
            </h3>
            <p className="text-xs text-zinc-400">
              Changes reflect immediately on the website and booking calculations.
            </p>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                  Base Session Price (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm pl-8 pr-4 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1 font-medium">
                  Base Duration (Minutes) *
                </label>
                <input
                  type="number"
                  required
                  min={15}
                  step={15}
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Publish service as active on public website</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F1F26]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSaving}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
