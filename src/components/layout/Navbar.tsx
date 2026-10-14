'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Menu, X, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show public navbar in /admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 bg-[#16161A] flex items-center justify-center text-[#C5A059] group-hover:border-[#C5A059] transition-colors">
              <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.2em] font-medium text-[#FAF9F5] group-hover:text-[#C5A059] transition-colors">
                MOMENTS
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#9A9AA0]">
                Production · Vadodara
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#C5A059] font-medium'
                      : 'text-[#D1D1CB] hover:text-[#FAF9F5]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/booking/lookup"
              className="text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-[#FAF9F5] flex items-center gap-1.5 transition-colors px-2 py-1"
            >
              <Search className="w-3.5 h-3.5" />
              Find Booking
            </Link>

            <Link href="/booking">
              <Button size="sm" className="gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Book Session
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/booking">
              <Button size="sm" className="text-xs px-2.5 py-1">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 text-[#D1D1CB] hover:text-[#FAF9F5] focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0F0F12] border-b border-[#23232A] px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-sm uppercase tracking-wider text-[#D1D1CB] hover:text-[#C5A059] py-2 border-b border-[#1E1E24]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/booking/lookup"
              onClick={() => setIsOpen(false)}
              className="text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-[#FAF9F5] flex items-center gap-2 py-1"
            >
              <Search className="w-4 h-4" />
              Find or Manage Booking
            </Link>
            <Link href="/booking" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Book Session</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
