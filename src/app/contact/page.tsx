import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldAlert } from 'lucide-react';
import { getBusinessSettings, getServices } from '@/lib/data/repository';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact Studio & Inquiries',
  description:
    'Contact Moments Production photography studio in Alkapuri, Vadodara, Gujarat. Phone, email, address, and inquiry form for weddings, portraits, and commercial shoots.',
};

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    getBusinessSettings(),
    getServices(),
  ]);

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="editorial-tag text-[#C5A059]">Direct Communication</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Connect With Our Atelier
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            We welcome private consultations at our Alkapuri studio by appointment or via online inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Map Context */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#121216] border border-[#23232A] p-8 rounded-sm space-y-6">
              <h3 className="font-serif text-2xl text-[#FAF9F5]">
                {settings.business_name}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {settings.tagline}
              </p>

              <div className="space-y-4 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#FAF9F5] font-medium block">Studio Location</span>
                    <span className="text-zinc-400">
                      {settings.address_line1}
                      {settings.address_line2 && `, ${settings.address_line2}`},
                      <br />
                      {settings.city}, {settings.state} - {settings.postal_code}, {settings.country}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#FAF9F5] font-medium block">Telephone & WhatsApp</span>
                    <a href={`tel:${settings.phone}`} className="hover:text-[#C5A059]">
                      {settings.phone}
                    </a>
                    {settings.alt_phone && (
                      <span className="block text-zinc-400 mt-0.5">
                        Direct: {settings.alt_phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#FAF9F5] font-medium block">Electronic Mail</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-[#C5A059]">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#FAF9F5] font-medium block">Operating Hours ({settings.timezone})</span>
                    <span className="text-zinc-400">Monday – Saturday: 10:00 AM – 7:00 PM</span>
                    <span className="block text-zinc-400">Sunday: 11:00 AM – 5:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Reminder */}
              <div className="pt-4 border-t border-[#1F1F26]">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Have a specific date in mind? You can skip the inquiry form and check real-time availability in our{' '}
                  <a href="/booking" className="text-[#C5A059] underline hover:text-[#D4AF37]">
                    online booking calendar
                  </a>.
                </p>
              </div>
            </div>

            {/* Studio Privacy & Security Notice */}
            <div className="bg-[#121216]/60 border border-[#23232A] p-6 rounded-sm text-xs text-zinc-400 space-y-2">
              <span className="text-[#C5A059] font-medium uppercase tracking-wider text-[10px] block">
                Client Privacy Assurance
              </span>
              <p>
                We maintain strict non-disclosure for high-profile private events and executive portraiture.
                Your contact information is never shared with third parties.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm services={services} />
          </div>
        </div>
      </div>
    </div>
  );
}
