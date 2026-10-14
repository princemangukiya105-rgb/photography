import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/admin-auth';
import { adminLogoutAction } from '@/app/actions/admin';
import {
  Camera,
  Calendar,
  Layers,
  Clock,
  MessageSquare,
  Settings,
  Database,
  LogOut,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminSession();

  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Bookings & Schedule', href: '/admin/bookings', icon: Calendar },
    { label: 'Services & Pricing', href: '/admin/services', icon: Layers },
    { label: 'Working Hours & Blocks', href: '/admin/availability', icon: Clock },
    { label: 'Customer Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { label: 'Studio Settings', href: '/admin/settings', icon: Settings },
    { label: 'Database & Supabase', href: '/admin/database', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#F4F3EF] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0D0D11] border-r border-[#1C1C22] flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-[#1C1C22] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 bg-[#16161A] flex items-center justify-center text-[#C5A059]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-sm tracking-wider font-semibold text-[#FAF9F5] block">
                MOMENTS ADMIN
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Vadodara Studio
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-medium text-zinc-300 hover:text-[#FAF9F5] hover:bg-[#16161C] hover:border-l-2 hover:border-[#C5A059] transition-all"
              >
                <Icon className="w-4 h-4 text-[#C5A059]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#1C1C22] space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="truncate max-w-[140px] text-[11px]">{session.email}</span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {session.source}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] text-zinc-400 hover:text-[#C5A059] flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Live Site
            </Link>

            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}
