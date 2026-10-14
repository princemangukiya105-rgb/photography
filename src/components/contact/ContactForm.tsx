'use client';

import React, { useActionState, useState } from 'react';
import { submitInquiryAction } from '@/app/actions/inquiry';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Service } from '@/types/database';

interface ContactFormProps {
  services: Service[];
}

export function ContactForm({ services }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitInquiryAction, null);

  return (
    <div className="bg-[#121216] border border-[#23232A] p-8 sm:p-10 rounded-sm">
      <h3 className="font-serif text-2xl text-[#FAF9F5] mb-2 font-normal">
        Studio Commission Inquiry
      </h3>
      <p className="text-xs text-zinc-400 mb-8 font-light leading-relaxed">
        Submit details regarding your envisioned assignment, milestone event, or portrait session.
      </p>

      {state?.success ? (
        <div className="p-6 bg-emerald-950/40 border border-emerald-800/60 rounded-sm text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="font-serif text-lg text-emerald-200">Inquiry Received</h4>
          <p className="text-xs text-emerald-300 leading-relaxed font-light">{state.message}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-sm flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Yashvardhan Joshi"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+91 98765 00000"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
                Tentative Date (Optional)
              </label>
              <input
                type="date"
                name="event_date"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
              Service of Interest *
            </label>
            <select
              name="service_interest"
              required
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="">Select a discipline...</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
              <option value="Custom Bespoke Production">Custom Bespoke Production</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-2 font-medium">
              Project Vision & Requirements *
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell us about the venue, scale, aesthetic inspirations, or specific dates you have in mind..."
              className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <Button type="submit" isLoading={isPending} className="w-full gap-2">
            <Send className="w-4 h-4" />
            Send Studio Inquiry
          </Button>
        </form>
      )}
    </div>
  );
}
