import React from 'react';
import { getBusinessSettings } from '@/lib/data/repository';

export const metadata = {
  title: 'Privacy Policy | Moments Production',
  description:
    'Client privacy, data protection, and image confidentiality policy at Moments Production in Vadodara, Gujarat.',
};

export default async function PrivacyPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="py-20 bg-[#0B0B0D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="editorial-tag text-[#C5A059]">Data Integrity</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF9F5] mt-2 mb-4 font-normal">
            Privacy & Confidentiality
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            How {settings.business_name} collects, protects, and handles personal and visual data.
          </p>
        </div>

        <div className="bg-[#121216] border border-[#23232A] p-8 sm:p-12 rounded-sm space-y-8 text-sm text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">1. Data We Collect</h2>
            <p>
              When reserving a session or sending an inquiry, we collect only necessary commercial contact information: full name, telephone number (for scheduling and WhatsApp dispatch), email address, and event venue location details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">2. Access Tokens & Predictable Reference Protection</h2>
            <p>
              To protect customer identity, booking references are generated with cryptographic non-predictable formats (e.g. <code>MP-2026-XXXX</code>) and paired with 128-bit secret access tokens. Guessing booking numbers will never reveal personal names or addresses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">3. Visual Confidentiality (NDAs)</h2>
            <p>
              We honor strict confidentiality. Photographs from private family portraits, high-profile corporate boards, or intimate ceremonies are never published on our website, social media, or marketing materials without prior express client consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">4. Payment Data Protection</h2>
            <p>
              We do not store credit card or bank login credentials on our servers. When digital payments are enabled, transactions are handled through compliant PCI-DSS certified gateways (such as Razorpay).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-[#FAF9F5]">5. Contacting the Studio</h2>
            <p>
              For data access requests, deletion of contact logs, or privacy inquiries, contact our data administrator at{' '}
              <a href={`mailto:${settings.email}`} className="text-[#C5A059] underline">
                {settings.email}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
