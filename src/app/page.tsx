import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Camera,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getServices, getGalleryItems } from '@/lib/data/repository';

export default async function HomePage() {
  const [services, galleryItems] = await Promise.all([
    getServices(),
    getGalleryItems(),
  ]);

  const featuredWorks = galleryItems.slice(0, 6);
  const featuredServices = services.slice(0, 8);

  const faqs = [
    {
      q: 'Where is Moments Production located in Vadodara?',
      a: 'Our flagship studio is located at Studio 402, Signature Square, Alkapuri, overlooking Race Course Circle. We also undertake commissioned on-location shoots throughout Gujarat and destination ceremonies worldwide.',
    },
    {
      q: 'How does the online booking system work?',
      a: 'Select your desired service, inspect package tiers, and choose an available date and time slot. When submitted, your booking is placed in a pending status while our creative director reviews requirements to ensure zero schedule conflicts before confirmation.',
    },
    {
      q: 'What is your cancellation and rescheduling policy?',
      a: 'Rescheduling requests can be made up to 24 hours prior to the session directly from your self-service portal. Cancellations made 48 hours or more before session start are eligible for rescheduling or deposit credit.',
    },
    {
      q: 'When do we receive our retouched master photographs?',
      a: 'Digital proofing galleries are typically ready within 3 to 5 business days for studio sessions. Master retouched files and archival prints follow within 10 to 14 days, color-calibrated for gallery display.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0A0A0C]">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="Moments Production Editorial Photography Vadodara"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0B0D]/40 to-[#0B0B0D]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          {/* Subtle gold badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#141418]/80 backdrop-blur-md mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="editorial-tag text-xs text-[#FAF9F5]">
              Photography & Cinema Studio · Vadodara, Gujarat
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#FAF9F5] leading-[1.1] mb-6">
            Capturing Grace, Grandeur <br className="hidden sm:inline" />
            <span className="italic font-light text-[#C5A059]">and Authentic Emotion.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#C8C8CE] font-light leading-relaxed mb-10">
            From regal Gujarati heritage weddings to sculptural studio portraits and commercial campaigns,
            Moments Production crafts visual heirlooms with editorial restraint and cinematic elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Calendar className="w-4 h-4" />
                Reserve Session Online
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                Explore Portfolio
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Metrics / Distinctive Indicators */}
          <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-[#9A9AA0]">Studio Facility</p>
              <p className="font-serif text-lg text-[#FAF9F5]">Alkapuri, Vadodara</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-[#9A9AA0]">Specializations</p>
              <p className="font-serif text-lg text-[#FAF9F5]">15 Dedicated Services</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-[#9A9AA0]">Color Calibration</p>
              <p className="font-serif text-lg text-[#FAF9F5]">Hahnemühle 12-Color</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-[#9A9AA0]">Booking Policy</p>
              <p className="font-serif text-lg text-[#FAF9F5]">Guaranteed Non-Conflict</p>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED PORTFOLIO REEL */}
      <section className="py-24 bg-[#0E0E12] border-t border-[#1C1C22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="editorial-tag text-[#C5A059]">Curated Works</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF9F5] mt-2 font-normal">
                Selected Visual Archives
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="mt-4 md:mt-0 text-sm tracking-wider uppercase text-[#C5A059] hover:text-[#D4AF37] inline-flex items-center gap-1.5 transition-colors"
            >
              Browse Complete Gallery ({galleryItems.length} works)
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorks.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-sm bg-[#141418] border border-white/5 hover:border-[#C5A059]/40 transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent opacity-80" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                  <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-semibold mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg text-[#FAF9F5] group-hover:text-[#C5A059] transition-colors">
                    {item.title}
                  </h3>
                  {item.client_tag && (
                    <p className="text-xs text-zinc-400 mt-0.5">{item.client_tag}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES OVERVIEW */}
      <section className="py-24 bg-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="editorial-tag text-[#C5A059]">Disciplines</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2 mb-4 font-normal">
              Specialized Photography Services
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              Every assignment is treated as an individual commission with custom art direction,
              calibrated lighting setups, and archival post-production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col bg-[#121216] border border-[#23232A] hover:border-[#C5A059]/50 transition-all duration-300 p-6 rounded-sm"
              >
                <div className="relative aspect-video mb-5 overflow-hidden rounded-sm bg-black">
                  <Image
                    src={service.featured_image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#C5A059] border border-[#C5A059]/30">
                    {service.category}
                  </div>
                </div>

                <h3 className="font-serif text-lg text-[#FAF9F5] mb-2 group-hover:text-[#C5A059] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-6 flex-1">
                  {service.short_description}
                </p>

                <div className="pt-4 border-t border-[#1F1F26] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Starting from</span>
                    <span className="font-medium text-[#FAF9F5]">
                      ₹{service.base_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[#C5A059] hover:text-[#D4AF37] font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="secondary" size="md">
                View All 15 Photography & Production Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STUDIO PHILOSOPHY & WORKFLOW */}
      <section className="py-24 bg-[#0E0E12] border-t border-[#1C1C22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="editorial-tag text-[#C5A059]">The Atelier Standard</span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] leading-tight font-normal">
                Editorial Nuance Meets Technical Rigor
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                At Moments Production, we refuse generic presets and cookie-cutter framing.
                Our craft is built on deep understanding of natural facial geometry, cultural symbolism
                in Gujarati celebrations, and controlled studio optics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#18181E] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#FAF9F5]">Certified Clean Schedule</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Strict slot overlap prevention guarantees our team is 100% focused on your session.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#18181E] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#FAF9F5]">Archival Master Retouching</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Skin texture preservation and fine color-grading on Eizo calibrated monitors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80"
                alt="Moments Production Studio Equipment and Lighting"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                <p className="text-[#C5A059] uppercase tracking-wider font-semibold text-[10px]">
                  Studio 402 · Alkapuri Facility
                </p>
                Equipped with Profoto lighting, tethered proofing, seamless backdrops, and private green room.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-24 bg-[#0A0A0C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="editorial-tag text-[#C5A059]">Clarity</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF9F5] mt-2 mb-4 font-normal">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Transparent policies for seamless bookings and expectations.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#121216] border border-[#23232A] rounded-sm space-y-2 hover:border-[#C5A059]/40 transition-colors"
              >
                <h3 className="font-serif text-lg text-[#FAF9F5] font-normal">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVITATION CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-[#0E0E12] to-[#0A0A0C] border-t border-[#1C1C22]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="editorial-tag text-[#C5A059]">Begin Your Commission</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] font-normal">
            Ready to immortalize your narrative?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
            Book directly through our certified calendar or submit a custom inquiry for destination
            events and bespoke commercial assignments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/booking">
              <Button size="lg" className="w-full sm:w-auto">
                Check Live Availability & Book
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Send Studio Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
