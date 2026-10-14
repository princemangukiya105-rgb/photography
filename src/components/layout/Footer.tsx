'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, MapPin, Phone, Mail, Clock, ShieldCheck, Lock } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#08080A] text-[#9A9AA0] border-t border-[#1C1C22] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 bg-[#16161A] flex items-center justify-center text-[#C5A059]">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg tracking-[0.15em] text-[#FAF9F5] font-medium">
                MOMENTS PRODUCTION
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#B3B3B9]">
              Distinguished photography and cinematic production agency based in Vadodara, Gujarat.
              Crafting authentic editorial portraits, grand Gujarati weddings, and commercial visuals.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-[11px] text-[#C5A059] tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                Authorized Studio · Alkapuri
              </span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F5] font-semibold mb-4">
              Featured Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/weddings-engagements" className="hover:text-[#C5A059] transition-colors">
                  Weddings & Engagements
                </Link>
              </li>
              <li>
                <Link href="/services/pre-wedding" className="hover:text-[#C5A059] transition-colors">
                  Pre-Wedding Cinema
                </Link>
              </li>
              <li>
                <Link href="/services/studio-sessions" className="hover:text-[#C5A059] transition-colors">
                  Photography Studio Sessions
                </Link>
              </li>
              <li>
                <Link href="/services/corporate-photography" className="hover:text-[#C5A059] transition-colors">
                  Corporate & Executive
                </Link>
              </li>
              <li>
                <Link href="/services/product-photography" className="hover:text-[#C5A059] transition-colors">
                  Product & Commercial
                </Link>
              </li>
              <li>
                <Link href="/services/maternity-newborn" className="hover:text-[#C5A059] transition-colors">
                  Maternity & Newborn
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#C5A059] hover:underline pt-1 inline-block">
                  View All 15 Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Studio Location */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F5] font-semibold mb-4">
              Studio & Location
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  Studio 402, Signature Square, Race Course Circle, Alkapuri, Vadodara, Gujarat 390007
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#FAF9F5]">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:contact@momentsproduction.com" className="hover:text-[#FAF9F5]">
                  contact@momentsproduction.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 10:00 AM – 7:00 PM</p>
                  <p>Sun: 11:00 AM – 5:00 PM (IST)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F5] font-semibold mb-4">
              Client Portal & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/booking" className="hover:text-[#C5A059] transition-colors">
                  Online Booking System
                </Link>
              </li>
              <li>
                <Link href="/booking/lookup" className="hover:text-[#C5A059] transition-colors">
                  Lookup Existing Booking
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-[#C5A059] transition-colors">
                  Cancellation & Rescheduling
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#C5A059] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C5A059] transition-colors">
                  Terms & Commercial Conditions
                </Link>
              </li>
              <li className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-[11px] transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  Studio Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1C1C22] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Moments Production. All rights reserved.</p>
          <p className="tracking-wide">
            Photography & Cinematic Visual Agency · Vadodara, Gujarat, India
          </p>
        </div>
      </div>
    </footer>
  );
}
