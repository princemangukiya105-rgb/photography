import React from 'react';
import Link from 'next/link';
import {
  getBookings,
  getInquiries,
  getServices,
  isSupabaseConfigured,
  getBusinessSettings,
} from '@/lib/data/repository';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  IndianRupee,
  MessageSquare,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default async function AdminDashboardOverview() {
  const [bookings, inquiries, services, settings] = await Promise.all([
    getBookings(),
    getInquiries(),
    getServices(),
    getBusinessSettings(),
  ]);

  const supabaseConnected = isSupabaseConfigured();

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const newInquiries = inquiries.filter((i) => i.status === 'new');

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Database Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C22] pb-6">
        <div>
          <span className="editorial-tag text-[#C5A059]">Control Center</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF9F5] font-normal">
            Studio Overview
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Real-time management for Moments Production · {settings.city}, {settings.state}
          </p>
        </div>

        {/* Database Linkage Status */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-sm border flex items-center gap-2 text-xs ${
              supabaseConnected
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800 text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {supabaseConnected
                ? 'Supabase PostgreSQL Active'
                : 'Local Memory Mode (Ready for Supabase)'}
            </span>
          </div>

          <Link href="/admin/database">
            <Button variant="secondary" size="sm" className="text-xs">
              Configure DB
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Requests */}
        <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Pending Confirmation
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <p className="font-serif text-3xl text-amber-300">{pendingBookings.length}</p>
          <p className="text-[11px] text-zinc-500">Awaiting schedule review</p>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Confirmed Sessions
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-3xl text-[#FAF9F5]">{confirmedBookings.length}</p>
          <p className="text-[11px] text-zinc-500">Locked on studio calendar</p>
        </div>

        {/* Confirmed Revenue */}
        <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Confirmed Value
            </span>
            <span className="text-xs font-semibold text-[#C5A059]">INR</span>
          </div>
          <p className="font-serif text-3xl text-[#FAF9F5]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-zinc-500">From confirmed commissions</p>
        </div>

        {/* New Inquiries */}
        <div className="bg-[#121216] border border-[#23232A] p-6 rounded-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              New Inquiries
            </span>
            <MessageSquare className="w-4 h-4 text-[#C5A059]" />
          </div>
          <p className="font-serif text-3xl text-[#FAF9F5]">{newInquiries.length}</p>
          <p className="text-[11px] text-zinc-500">Client form submissions</p>
        </div>
      </div>

      {/* Actionable Sections: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Bookings (8 cols) */}
        <div className="lg:col-span-8 bg-[#121216] border border-[#23232A] rounded-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F1F26] pb-4">
            <div>
              <h3 className="font-serif text-xl text-[#FAF9F5]">Recent Bookings</h3>
              <p className="text-xs text-zinc-400 font-light">
                Latest client reservation requests
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-1"
            >
              View All ({totalBookings}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#1F1F26]">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#C5A059]">
                      {b.booking_reference}
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <h4 className="text-sm font-medium text-[#FAF9F5]">
                    {b.customer_name} ·{' '}
                    <span className="text-zinc-400 font-normal">{b.customer_phone}</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {b.service?.name} on{' '}
                    <strong className="text-zinc-200">{b.booking_date}</strong> ({b.start_time} -{' '}
                    {b.end_time})
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-serif text-sm text-[#FAF9F5]">
                    ₹{b.total_price.toLocaleString('en-IN')}
                  </span>
                  <Link href={`/admin/bookings?search=${b.booking_reference}`}>
                    <Button variant="secondary" size="sm" className="text-xs py-1 px-3">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {recentBookings.length === 0 && (
              <p className="text-xs text-zinc-500 py-6 text-center">No bookings recorded yet.</p>
            )}
          </div>
        </div>

        {/* Quick Inquiries (4 cols) */}
        <div className="lg:col-span-4 bg-[#121216] border border-[#23232A] rounded-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F1F26] pb-4">
            <h3 className="font-serif text-xl text-[#FAF9F5]">Client Inquiries</h3>
            <Link
              href="/admin/inquiries"
              className="text-xs text-[#C5A059] hover:underline"
            >
              All ({inquiries.length})
            </Link>
          </div>

          <div className="space-y-4">
            {inquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 bg-[#18181E] border border-[#2B2B36] rounded-sm space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#FAF9F5]">{inq.name}</span>
                  <span className="text-[10px] text-zinc-500">{inq.service_interest}</span>
                </div>
                <p className="text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">
                  {inq.message}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>{inq.phone}</span>
                  <StatusBadge status={inq.status} size="sm" />
                </div>
              </div>
            ))}

            {inquiries.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-6">No inquiries recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
