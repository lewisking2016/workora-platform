'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scales } from '@phosphor-icons/react';

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white dark:bg-[#0A0E17] text-zinc-950 dark:text-zinc-50 overflow-x-hidden font-display min-h-screen">
      
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[350px] w-full mt-4 rounded-[60px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#0066FF]/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[800px]"
          >
            <div className="h-16 w-16 rounded-3xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-700">
              <Scales size={32} weight="duotone" className="text-[#0066FF]" />
            </div>
            <p className="text-[#0066FF] font-black uppercase tracking-[0.4em] text-[11px] mb-6">Legal</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white mb-6 leading-[0.95]">
              Terms of Service
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
              content: `Welcome to Workora, a product of ImeanTech ("Company", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of the Workora platform, including our website, mobile applications, and all related services (collectively, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.`
            },
            {
              title: '2. Eligibility',
              content: `You must be at least 18 years old to use Workora. By registering, you confirm that you are of legal age to form a binding contract in your jurisdiction. Workora reserves the right to refuse service, terminate accounts, or cancel orders at our sole discretion.`
            },
            {
              title: '3. Account Registration',
              content: `To access certain features of the Platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.`
            },
            {
              title: '4. Professional Verification',
              content: `Professionals ("Pros") who register on Workora agree to undergo our verification process, which may include identity verification, skill assessments, and background checks. Verification status does not constitute an endorsement, warranty, or guarantee of the quality of any Pro's work. Workora acts as a platform connecting clients with professionals and is not a party to any agreement between users.`
            },
            {
              title: '5. Payments & Escrow',
              content: `All payments for services booked through the Platform are processed through our secure escrow system. Client funds are held in escrow and only released to the Pro upon the client's confirmation that the work has been completed to a satisfactory standard. Workora may charge a service fee for facilitating transactions. All fees are disclosed before a booking is confirmed.`
            },
            {
              title: '6. User Conduct',
              content: `You agree not to: (a) use the Platform for any unlawful purpose; (b) post false, misleading, or fraudulent content; (c) harass, abuse, or harm another user; (d) interfere with or disrupt the Platform; (e) attempt to gain unauthorized access to any part of the Platform; or (f) use the Platform to transmit any malware or harmful code. Violation of these rules may result in immediate account suspension or termination.`
            },
            {
              title: '7. Dispute Resolution',
              content: `In the event of a dispute between a Client and a Pro, Workora provides a mediation process through our support team. Both parties agree to participate in good faith in any dispute resolution process. Workora's decision in any dispute mediation shall be considered final and binding within the scope of the Platform.`
            },
            {
              title: '8. Intellectual Property',
              content: `All content on the Platform, including but not limited to text, graphics, logos, icons, images, and software, is the property of ImeanTech or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without prior written consent.`
            },
            {
              title: '9. Limitation of Liability',
              content: `To the maximum extent permitted by law, Workora and ImeanTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform. Our total liability shall not exceed the amount of fees paid by you to Workora in the twelve (12) months preceding the event giving rise to the claim.`
            },
            {
              title: '10. Changes to Terms',
              content: `We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the updated Terms.`
            },
            {
              title: '11. Contact Us',
              content: `If you have any questions about these Terms, please contact us at:\n\nImeanTech\nEmail: legal@imeantech.com\nPhone: +254 114 971 070\nWebsite: imeantech.com`
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
