'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types/database';
import { X, ZoomIn, Camera } from 'lucide-react';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#C5A059] text-[#0B0B0D] border-[#C5A059] font-medium shadow-md shadow-[#C5A059]/20'
                  : 'bg-[#121216] text-[#A1A1AA] border-[#23232A] hover:border-[#C5A059]/40 hover:text-[#FAF9F5]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const aspectClass =
            item.aspect_ratio === 'landscape'
              ? 'aspect-[16/10]'
              : item.aspect_ratio === 'square'
              ? 'aspect-square'
              : 'aspect-[4/5]';

          return (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative overflow-hidden rounded-sm bg-[#141418] border border-[#23232A] hover:border-[#C5A059]/60 cursor-pointer transition-all duration-300"
            >
              <div className={`relative w-full ${aspectClass} overflow-hidden`}>
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Hover Meta Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-semibold block mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg text-[#FAF9F5] leading-snug">
                  {item.title}
                </h3>
                {item.client_tag && (
                  <p className="text-xs text-zinc-300 mt-1">{item.client_tag}</p>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#C5A059]">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge photograph</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-[#121216] border border-[#23232A] rounded-sm">
          <Camera className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
          <p className="font-serif text-lg text-[#FAF9F5]">No images found</p>
          <p className="text-xs text-zinc-400 mt-1">
            No portfolio entries are currently published under this category.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={lightboxItem.image_url}
                alt={lightboxItem.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                {lightboxItem.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF9F5] mt-1">
                {lightboxItem.title}
              </h3>
              {lightboxItem.client_tag && (
                <p className="text-xs text-zinc-400 mt-1">{lightboxItem.client_tag}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
