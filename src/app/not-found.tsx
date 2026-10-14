import React from 'react';
import Link from 'next/link';
import { Camera, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[#0B0B0D]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full border border-[#C5A059]/40 bg-[#16161A] flex items-center justify-center text-[#C5A059] mx-auto">
          <Camera className="w-8 h-8 opacity-80" />
        </div>

        <div>
          <span className="editorial-tag text-[#C5A059]">Error 404</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF9F5] mt-2 mb-3">
            Frame Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            The page or archival record you are looking for does not exist, has been archived, or moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button size="md" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
              Browse Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
