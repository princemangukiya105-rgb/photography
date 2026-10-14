import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Moments Production | Premium Photography & Cinema Studio in Vadodara',
    template: '%s | Moments Production',
  },
  description:
    'Distinguished photography and cinematic production agency based in Vadodara, Gujarat. Specializing in weddings, corporate, portraits, fashion, studio, and commercial visual storytelling.',
  keywords: [
    'Photography Studio Vadodara',
    'Wedding Photography Vadodara',
    'Moments Production Gujarat',
    'Commercial Photography Gujarat',
    'Maternity Newborn Photography',
    'Corporate Headshots Vadodara',
  ],
  metadataBase: new URL('https://momentsproduction.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PhotographyBusiness',
    name: 'Moments Production',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    '@id': 'https://momentsproduction.com',
    url: 'https://momentsproduction.com',
    telephone: '+919876543210',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Studio 402, Signature Square, Race Course Road, Alkapuri',
      addressLocality: 'Vadodara',
      addressRegion: 'Gujarat',
      postalCode: '390007',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.3107,
      longitude: 73.1812,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '11:00',
        closes: '17:00',
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} dark antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0B0B0D] text-[#F4F3EF] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#0B0B0D]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
