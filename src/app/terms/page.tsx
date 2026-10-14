import React from 'react';
import { getBusinessSettings } from '@/lib/data/repository';

export const metadata = {
  title: 'Terms & Conditions | Moments Production',
  description:
    'Commercial terms, image copyright, licensing, and client guidelines for Moments Production photography agency in Vadodara.',
};

export default async function TermsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="editorial-tag text-[#C5A059]">Commercial Conditions</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            Effective as of 2026 for all commissioned assignments by {settings.business_name}.
          </p>
        </div>

        <div className="bg-[#121216] border border-[#23232A] p-8 sm:p-12 rounded-sm space-y-8 text-sm text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">1. Acceptance of Terms</h2>
            <p>
              By accessing our website or placing an online booking for photography services with {settings.business_name} ({settings.address_line1}, {settings.city}, {settings.state}), you acknowledge and agree to be bound by these Terms and our Cancellation Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">2. Intellectual Property & Copyright</h2>
            <p>
              In accordance with copyright legislation, all master photographic files, negatives, RAW sensor data, and video footage captured by {settings.business_name} remain the intellectual property of the studio.
            </p>
            <p>
              Clients receive a non-exclusive, perpetual personal print and display license upon final invoice settlement. Commercial clients receive specified commercial reproduction licenses tailored to advertising, packaging, or digital broadcast scopes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">3. Archival Delivery & Retouching</h2>
            <p>
              Proofing galleries are delivered via private authenticated cloud link. Standard studio turnarounds range from 3 to 14 business days depending on the commissioned service. Custom retouching includes skin tone refinement, blemish removal, and color balancing; structural anatomical manipulations are not performed without express written direction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">4. Limitation of Liability</h2>
            <p>
              While every technical precaution is undertaken (including dual card backup during shooting and offsite RAID redundancy), in the improbable event of equipment malfunction or catastrophic data loss, studio liability is strictly limited to the total fees paid by the client for the affected session.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">5. Jurisdiction</h2>
            <p>
              These terms are governed by the laws of Gujarat, India. Any dispute arising under these conditions shall be subject to the exclusive jurisdiction of the competent courts in Vadodara, Gujarat.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
