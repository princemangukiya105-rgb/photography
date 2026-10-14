import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { getServices } from '@/lib/data/repository';

export const metadata = {
  title: 'Photography Services & Disciplines',
  description:
    'Explore the 15 specialized photography and production services offered by Moments Production in Vadodara, Gujarat. Studio sessions, weddings, portraits, commercial, and fine-art printing.',
};

export default async function ServicesPage() {
  const services = await getServices();

  // Group by category
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="editorial-tag text-[#C5A059]">Disciplines & Commissions</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Our Photography Services
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            From intimate studio portraiture to grand multi-day wedding cinema and commercial product
            campaigns, explore our 15 specialized visual services.
          </p>
        </div>

        {/* Category Groups */}
        <div className="space-y-20">
          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category === category);
            return (
              <div key={category} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-[#23232A] pb-4">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF9F5]">
                    {category}
                  </h2>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">
                    ({categoryServices.length} {categoryServices.length === 1 ? 'service' : 'services'})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col bg-[#121216] border border-[#23232A] hover:border-[#C5A059]/50 transition-all duration-300 rounded-sm overflow-hidden"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <Image
                          src={service.featured_image}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#C5A059] border border-[#C5A059]/30">
                          {service.category}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Approx. {service.duration_minutes} minutes</span>
                          </div>
                          <h3 className="font-serif text-xl text-[#FAF9F5] mb-2 group-hover:text-[#C5A059] transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                            {service.short_description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#1F1F26] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase block">Sample Base Fee</span>
                            <span className="font-serif text-base text-[#FAF9F5]">
                              ₹{service.base_price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Link
                              href={`/services/${service.slug}`}
                              className="text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#D4AF37] font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              Explore <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
