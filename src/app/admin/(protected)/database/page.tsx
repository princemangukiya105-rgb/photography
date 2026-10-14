import React from 'react';
import { isSupabaseConfigured } from '@/lib/data/repository';
import { Database, ShieldCheck, CheckCircle2, Copy, ExternalLink, KeyRound } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Database & Supabase Integration | Moments Admin',
};

export default function AdminDatabasePage() {
  const isConfigured = isSupabaseConfigured();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <span className="editorial-tag text-[#C5A059]">Infrastructure & Architecture</span>
        <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
          Database & Supabase Deployment
        </h1>
        <p className="text-xs text-zinc-400 font-light mt-1">
          Moments Production is architected with PostgreSQL Row Level Security (RLS) and real-time slot conflict triggers.
        </p>
      </div>

      {/* Current Status Box */}
      <div
        className={`p-6 rounded-sm border ${
          isConfigured
            ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
            : 'bg-amber-950/20 border-amber-800/80 text-amber-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <Database className={`w-6 h-6 mt-1 shrink-0 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-normal">
              {isConfigured
                ? 'Active PostgreSQL Connection (Supabase Connected)'
                : 'Local Memory Mode Active (Ready for Supabase Connection)'}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-300 font-light">
              {isConfigured
                ? 'Your website is reading and writing directly to your Supabase PostgreSQL database with Row Level Security enforced on all 11 tables.'
                : 'The website and admin dashboard are running smoothly using the built-in resilient in-memory repository. To enable persistent live cloud database storage, complete the simple 4-step Supabase connection below.'}
            </p>
          </div>
        </div>
      </div>

      {/* Exact 4 Steps for Non-Programmer User */}
      <div className="bg-[#121216] border border-[#23232A] p-6 sm:p-8 rounded-sm space-y-6">
        <h3 className="font-serif text-xl text-[#FAF9F5]">
          Exact Supabase Connection Steps
        </h3>

        <div className="space-y-6 text-xs text-zinc-300">
          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-[#C5A059] text-black font-semibold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-[#FAF9F5] text-sm">Create Free Supabase Project</h4>
              <p className="text-zinc-400 font-light leading-relaxed">
                Log into{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#C5A059] underline inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and click <strong>New Project</strong>. Choose name <code>Moments Production</code> and select region <code>South Asia (Mumbai - ap-south-1)</code> for lowest latency in Gujarat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-[#C5A059] text-black font-semibold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-[#FAF9F5] text-sm">Run Schema Migration & Seed</h4>
              <p className="text-zinc-400 font-light leading-relaxed">
                In your Supabase project dashboard, open the <strong>SQL Editor</strong> tab on the left.
                Copy the contents of the generated migration file <code>supabase/migrations/20260101000000_initial_schema.sql</code> and seed script <code>supabase/seed.sql</code>, paste into the query window, and click <strong>Run</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-[#C5A059] text-black font-semibold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-[#FAF9F5] text-sm">Copy API Credentials</h4>
              <p className="text-zinc-400 font-light leading-relaxed">
                Navigate to <strong>Project Settings → API</strong>. Copy your:
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 pt-1 font-mono text-[11px]">
                <li>Project URL (NEXT_PUBLIC_SUPABASE_URL)</li>
                <li>Project API key: anon public (NEXT_PUBLIC_SUPABASE_ANON_KEY)</li>
                <li>Project API key: service_role secret (SUPABASE_SERVICE_ROLE_KEY)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-[#C5A059] text-black font-semibold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-[#FAF9F5] text-sm">Set Environment Variables</h4>
              <p className="text-zinc-400 font-light leading-relaxed">
                Paste these three keys into your <code>.env.local</code> file or into your hosting environment (Vercel / Netlify / Render settings). The application will automatically switch to your cloud database!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema Overview */}
      <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-4">
        <h4 className="font-serif text-base text-[#FAF9F5]">Installed PostgreSQL Tables & Protections</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
          <div className="p-3 bg-[#18181E] border border-[#25252E] rounded">
            <strong className="text-[#FAF9F5] block">services & service_packages</strong>
            15 agency services with custom duration, description, pricing tiers in INR.
          </div>
          <div className="p-3 bg-[#18181E] border border-[#25252E] rounded">
            <strong className="text-[#FAF9F5] block">bookings & status_history</strong>
            Non-guessable reference (MP-2026-XXXX) + secure 128-bit access token.
          </div>
          <div className="p-3 bg-[#18181E] border border-[#25252E] rounded">
            <strong className="text-[#FAF9F5] block">trg_prevent_booking_overlap</strong>
            PostgreSQL exclusion trigger preventing double-booking of confirmed sessions.
          </div>
          <div className="p-3 bg-[#18181E] border border-[#25252E] rounded">
            <strong className="text-[#FAF9F5] block">Row Level Security (100% Coverage)</strong>
            Public users cannot view or manipulate other clients&apos; bookings or inquiries.
          </div>
        </div>
      </div>
    </div>
  );
}
