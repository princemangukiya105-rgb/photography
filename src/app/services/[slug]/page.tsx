import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/image';
import NextLink from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Clock,
  Check,
  Calendar,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getServiceBySlug, getServices } from '@/lib/data/repository';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: `${service.name} | Moments Production Vadodara`,
    description: service.short_description,
    openGraph: {
      title: `${service.name} | Moments Production`,
      description: service.short_description,
      images: [{ url: service.featured_image }],
    },
  };
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="py-12 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
          <NextLink href="/" className="hover:text-[#FAF9F5]">
            Home
          </NextLink>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <NextLink href="/services" className="hover:text-[#FAF9F5]">
            Services
          </NextLink>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-[#C5A059]">{service.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16161A] border border-[#C5A059]/40 rounded-full text-xs text-[#C5A059] uppercase tracking-wider">
              {service.category} Discipline
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] font-normal leading-tight">
              {service.name}
            </h1>
            <p className="text-base text-zinc-300 font-light leading-relaxed">
              {service.full_description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-400 border-t border-[#1F1F26]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>Base Duration: {service.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Studio or On-Location (Vadodara & Gujarat)</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <NextLink href={`/booking?serviceId=${service.id}`}>
                <Button size="lg" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book This Service
                </Button>
              </NextLink>
              <NextLink href="/contact">
                <Button variant="secondary" size="lg">
                  Ask a Question
                </Button>
              </NextLink>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#23232A] shadow-2xl">
            <Image
              src={service.featured_image}
              alt={service.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Packages / Tiers */}
        {service.packages && service.packages.length > 0 && (
          <div className="mb-20 pt-10 border-t border-[#1F1F26]">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="editorial-tag text-[#C5A059]">Package Options</span>
              <h2 className="font-serif text-3xl text-[#FAF9F5] mt-2 mb-3">
                Curated Commission Tiers
              </h2>
              <p className="text-xs text-zinc-400">
                Choose a pre-configured package or request bespoke custom production specs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {service.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#121216] border border-[#23232A] hover:border-[#C5A059]/60 p-8 rounded-sm flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-xl text-[#FAF9F5]">{pkg.name}</h3>
                      <span className="text-xs text-[#C5A059] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {pkg.duration_minutes} min
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="space-y-2.5 mb-8">
                      {pkg.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1F1F26] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">Session Fee</span>
                      <span className="font-serif text-2xl text-[#FAF9F5]">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <NextLink href={`/booking?serviceId=${service.id}&packageId=${pkg.id}`}>
                      <Button size="sm">Select Package</Button>
                    </NextLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Samples */}
        {service.gallery_images && service.gallery_images.length > 0 && (
          <div className="mb-16 pt-8 border-t border-[#1F1F26]">
            <h2 className="font-serif text-2xl text-[#FAF9F5] mb-6">
              Visual Reference Samples
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {service.gallery_images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#23232A] bg-black"
                >
                  <Image
                    src={imgUrl}
                    alt={`${service.name} sample ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Studio Guarantee */}
        <div className="p-8 bg-[#121216] border border-[#23232A] rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#18181E] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#FAF9F5]">
                Certified Non-Overlapping Bookings
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Every booking is confirmed with exclusive access to our camera crew and studio resources.
                No double-booking, guaranteed.
              </p>
            </div>
          </div>

          <NextLink href={`/booking?serviceId=${service.id}`}>
            <Button size="md" className="shrink-0">
              Check Dates & Reserve
            </Button>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
