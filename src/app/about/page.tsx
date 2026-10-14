import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, MapPin, Award, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getBusinessSettings } from '@/lib/data/repository';

export const metadata = {
  title: 'About the Studio & Atelier Ethos',
  description:
    'Learn about Moments Production, an editorial photography and cinema agency in Alkapuri, Vadodara, Gujarat. Studio philosophy, archival craftsmanship, and creative direction.',
};

export default async function AboutPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="editorial-tag text-[#C5A059]">The Atelier Ethos</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Moments Production
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Founded on the belief that imagery should possess emotional longevity, architectural
            rigor, and editorial grace.
          </p>
        </div>

        {/* Narrative & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-[#23232A] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80"
              alt="Moments Production Photography Studio Vadodara"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300">
              <span className="text-[#C5A059] uppercase tracking-wider font-semibold block text-[10px]">
                {settings.business_name} Atelier
              </span>
              {settings.address_line1}, {settings.city}, {settings.state}
            </div>
          </div>

          <div className="space-y-6 text-zinc-300 leading-relaxed font-light text-sm sm:text-base">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF9F5] font-normal">
              A studio dedicated to permanence over trends.
            </h2>
            <p>
              Located in the heart of Vadodara at Alkapuri, {settings.business_name} was established
              to challenge the rapid, disposable nature of modern digital imagery. We view every
              commission—whether a multi-day royal wedding at heritage palaces or a 45-minute executive
              headshot—as an enduring archival record.
            </p>
            <p>
              Our lighting philosophy balances classical Renaissance chiaroscuro with modern editorial
              minimalism. Rather than relying on heavy digital filters or ephemeral color grading
              fads, we sculpt light practically using Swiss and Swedish studio fixtures, preserving
              subtle skin tones and natural textural depth.
            </p>

            <div className="pt-4 border-t border-[#1F1F26] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Zero Double-Booking Guarantee with certified real-time schedule locking</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Museum-grade archival 12-color printing & Italian leather binding</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Transparent client portal for slot lookup, rescheduling, and status tracking</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Dedicated on-location crew equipped for Gujarat & international assignments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Specs */}
        <div className="bg-[#121216] border border-[#23232A] p-8 sm:p-12 rounded-sm mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="editorial-tag text-[#C5A059]">Equipment & Facilities</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF9F5] mt-1">
              Technical Infrastructure
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-zinc-400">
            <div className="space-y-2 border-l border-[#C5A059]/40 pl-4">
              <h4 className="font-serif text-base text-[#FAF9F5]">Camera & Optics</h4>
              <p>
                Full-frame high-resolution sensors paired with prime G-Master and Zeiss cinema optics
                for extreme micro-contrast and true color fidelity.
              </p>
            </div>
            <div className="space-y-2 border-l border-[#C5A059]/40 pl-4">
              <h4 className="font-serif text-base text-[#FAF9F5]">Lighting Architecture</h4>
              <p>
                Profoto acute studio strobes, beauty dishes, parabolic umbrellas, and high-CRI continuous
                lighting with wireless digital sync.
              </p>
            </div>
            <div className="space-y-2 border-l border-[#C5A059]/40 pl-4">
              <h4 className="font-serif text-base text-[#FAF9F5]">Archival Print Lab</h4>
              <p>
                In-house large-format pigment printing on 100% cotton rag Hahnemühle paper, UV-filtered
                framing, and bespoke lay-flat albums.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h3 className="font-serif text-3xl text-[#FAF9F5]">
            Experience our atelier in Vadodara.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            Book an upcoming session online or schedule a consultation at our Alkapuri studio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg">Reserve Online Session</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Contact Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
