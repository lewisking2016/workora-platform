'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LockKey } from '@phosphor-icons/react';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white dark:bg-[#0A0E17] text-zinc-950 dark:text-zinc-50 overflow-x-hidden font-display min-h-screen">
      
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[350px] w-full mt-4 rounded-[60px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#7000FF]/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[800px]"
          >
            <div className="h-16 w-16 rounded-3xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-700">
              <LockKey size={32} weight="duotone" className="text-[#7000FF]" />
            </div>
            <p className="text-[#7000FF] font-black uppercase tracking-[0.4em] text-[11px] mb-6">Your Data, Protected</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white mb-6 leading-[0.95]">
              Privacy Policy
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">Last updated: May 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32 px-[5%] lg:px-[15%]">
        <div className="prose-lg max-w-none flex flex-col gap-16">
          
          {[
            {
              title: '1. Introduction',
              content: `This Privacy Policy describes how ImeanTech ("Company", "we", "us", or "our") collects, uses, and protects your personal information when you use the Workora platform ("Platform"). We are committed to protecting your privacy and handling your data with transparency and care.`
            },
            {
              title: '2. Information We Collect',
              content: `We collect the following types of information:\n\n• Personal Information: Name, email address, phone number, date of birth, and government-issued ID (for verification purposes).\n• Profile Information: Skills, work history, portfolio images, proof-of-work videos, and professional certifications.\n• Usage Data: How you interact with the Platform, including pages visited, features used, and session duration.\n• Device Information: Device type, operating system, browser type, IP address, and unique device identifiers.\n• Location Data: Approximate location based on IP address or, with your consent, precise location from your device.\n• Payment Information: Payment method details processed through our secure third-party payment processors.`
            },
            {
              title: '3. How We Use Your Information',
              content: `We use your information to:\n\n• Provide, maintain, and improve the Platform.\n• Verify your identity and professional skills.\n• Facilitate connections between Clients and Professionals.\n• Process payments through our escrow system.\n• Send you important updates, notifications, and promotional communications.\n• Detect, prevent, and address fraud, security issues, and technical problems.\n• Comply with legal obligations and enforce our Terms of Service.`
            },
            {
              title: '4. Identity Verification Data',
              content: `As part of our Trust Passport system, we collect government-issued identification documents for professional verification. This data is:\n\n• Encrypted at rest and in transit using industry-standard encryption.\n• Stored on secure, access-controlled servers.\n• Only accessed by authorized verification personnel.\n• Never shared with other users or third parties without your explicit consent.\n• Retained only for as long as necessary to maintain your verification status.`
            },
            {
              title: '5. Data Sharing & Disclosure',
              content: `We do not sell your personal data. We may share your information in the following circumstances:\n\n• With Your Consent: When you explicitly authorize us to share information.\n• With Service Providers: Trusted third parties who assist us in operating the Platform (e.g., payment processors, cloud hosting).\n• For Legal Compliance: When required by law, court order, or to protect our rights and safety.\n• Business Transfers: In connection with a merger, acquisition, or sale of assets, with appropriate data protection safeguards.`
            },
            {
              title: '6. Data Security',
              content: `We implement robust security measures to protect your personal information, including:\n\n• End-to-end encryption for sensitive data.\n• Regular security audits and penetration testing.\n• Access controls and authentication for all systems.\n• Secure data centers with physical and digital safeguards.\n\nHowever, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but will notify you promptly of any data breach.`
            },
            {
              title: '7. Your Rights',
              content: `Depending on your jurisdiction, you may have the following rights:\n\n• Access: Request a copy of the personal data we hold about you.\n• Correction: Request correction of inaccurate or incomplete data.\n• Deletion: Request deletion of your personal data, subject to legal retention requirements.\n• Portability: Request your data in a structured, machine-readable format.\n• Objection: Object to certain processing of your personal data.\n\nTo exercise these rights, contact us at privacy@imeantech.com.`
            },
            {
              title: '8. Cookies & Tracking',
              content: `We use cookies and similar tracking technologies to enhance your experience on the Platform. You can manage your cookie preferences through your browser settings. Essential cookies required for Platform functionality cannot be disabled.`
            },
            {
              title: '9. Children\'s Privacy',
              content: `Workora is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If we discover that we have collected data from a minor, we will delete it promptly.`
            },
            {
              title: '10. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes via email or through the Platform. Your continued use of the Platform after changes constitutes acceptance of the updated policy.`
            },
            {
              title: '11. Contact Us',
              content: `If you have any questions or concerns about this Privacy Policy or our data practices, contact us at:\n\nImeanTech — Data Protection\nEmail: privacy@imeantech.com\nPhone: +254 114 971 070\nWebsite: imeantech.com`
            },
          ].map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">{section.title}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed font-medium whitespace-pre-line">{section.content}</p>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
