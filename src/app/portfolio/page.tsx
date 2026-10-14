import React from 'react';
import { getGalleryItems } from '@/lib/data/repository';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export const metadata = {
  title: 'Portfolio & Visual Archives',
  description:
    'Curated photography archives by Moments Production in Vadodara, Gujarat. Weddings, portraits, architecture, fashion, studio sessions, and commercial campaigns.',
};

export default async function PortfolioPage() {
  const items = await getGalleryItems();

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="editorial-tag text-[#C5A059]">Visual Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Moments Immortalized
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            A curated selection of commissioned work spanning royal Gujarat weddings, high-end studio
            portraiture, commercial packshots, and architectural perspectives.
          </p>
        </div>

        <GalleryGrid items={items} />
      </div>
    </div>
  );
}
