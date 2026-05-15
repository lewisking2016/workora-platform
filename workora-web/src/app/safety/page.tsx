'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  LockKey, 
  UserFocus, 
  Handshake, 
  ShieldPlus,
  IdentificationCard,
  CreditCard,
  WarningCircle,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react';

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white text-zinc-950 overflow-x-hidden font-display">
      
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full mt-4 rounded-[60px] overflow-hidden group bg-zinc-50 border border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[800px]"
          >
            <div className="h-16 w-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-8 border border-zinc-100">
              <ShieldPlus size={32} weight="duotone" className="text-[#0066FF]" />
            </div>
            <p className="text-[#0066FF] font-black uppercase tracking-[0.3em] text-[10px] mb-6">Safety & Security</p>
            <h1 className="text-7xl font-black tracking-tighter text-zinc-950 mb-8 leading-[1.1]">
              Your trust is our <br />
              top priority.
            </h1>
            <p className="text-zinc-600 text-xl mb-10 leading-relaxed max-w-2xl font-medium">
              We&apos;ve built a multi-layered security ecosystem to ensure every interaction on Workora is safe, transparent, and reliable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Safety Pillars Grid */}
      <section className="py-32 px-[5%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[
          {
            icon: IdentificationCard,
            title: "Identity Verification",
            desc: "Every Pro undergoes rigorous ID checks and background screening before joining the platform.",
            color: "text-[#0066FF]"
          },
          {
            icon: LockKey,
            title: "Data Protection",
            desc: "Your personal data is encrypted and never shared without your explicit permission.",
            color: "text-[#7000FF]"
          },
          {
            icon: CreditCard,
            title: "Secure Payments",
            desc: "Payments are held in escrow and only released when the work is completed to your satisfaction.",
            color: "text-[#00C2FF]"
          },
          {
            icon: UserFocus,
            title: "Pro Vetting",
            desc: "We verify technical skills through real proof-of-work videos and skill assessments.",
            color: "text-[#0066FF]"
          },
          {
            icon: Handshake,
            title: "Dispute Resolution",
            desc: "Our dedicated support team is here to mediate and resolve any issues that may arise.",
            color: "text-[#7000FF]"
          },
          {
            icon: WarningCircle,
            title: "Reporting System",
            desc: "Flag any suspicious activity or poor conduct instantly through our in-app reporting tools.",
            color: "text-red-500"
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[40px] bg-zinc-50 border border-zinc-100 flex flex-col gap-6"
          >
            <div className={`h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${item.color}`}>
              <item.icon size={28} weight="duotone" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
            <p className="text-zinc-600 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Detailed Protocols Section */}
      <section className="py-32 bg-zinc-50 rounded-[80px] mx-[2%] px-[10%] flex flex-col lg:flex-row items-center gap-24 overflow-hidden relative border border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        <div className="flex-1 z-10">
          <h2 className="text-6xl font-black tracking-tighter text-zinc-950 mb-8 leading-tight">
            Our Zero-Tolerance <br />
            <span className="text-[#0066FF]">Safety Protocols.</span>
          </h2>
          <p className="text-zinc-600 text-xl mb-12 leading-relaxed">
            We maintain the highest standards of conduct. Any violation of our community guidelines results in immediate suspension from the ecosystem.
          </p>
          <div className="grid grid-cols-1 gap-6">
            {[
              "Mandatory Face-to-Face Skill Audits",
              "Verified Physical Workshop/Location Checks",
              "Continuous Performance Monitoring",
              "Escrow-based Financial Protection"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-zinc-950 font-bold bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                <CheckCircle size={24} className="text-[#0066FF]" weight="fill" />
                {text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative w-full aspect-square max-w-[500px]">
           <div className="absolute inset-0 bg-[#0066FF]/10 blur-[120px] rounded-full" />
           <div className="relative z-10 bg-white border border-zinc-100 rounded-[40px] p-12 shadow-2xl flex flex-col items-center text-center gap-8">
              <ShieldCheck size={120} weight="duotone" className="text-[#0066FF]" />
              <h3 className="text-3xl font-black tracking-tight">Verified by Workora</h3>
              <p className="text-zinc-500 font-medium">This badge is only awarded to Pros who have passed 100% of our security and skill audits.</p>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-[5%]">
        <div className="bg-white rounded-[80px] p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden border border-zinc-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0066FF]/5 skew-x-12 translate-x-20" />
          <div className="relative z-10 text-zinc-950 lg:max-w-xl">
            <h2 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
              Build with <br />
              total confidence.
            </h2>
            <p className="text-zinc-600 text-xl font-medium leading-relaxed">
              Whether you&apos;re hiring or working, Workora provides the safest environment for professional artisanal services in Africa.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/login" 
                className="h-14 px-10 bg-[#0066FF] text-white rounded-xl font-black text-base flex items-center justify-center transition-all shadow-xl shadow-[#0066FF]/20 whitespace-nowrap"
              >
                Get Started Securely
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/help" 
                className="h-14 px-10 bg-white border-2 border-zinc-100 text-zinc-950 rounded-xl font-black text-base flex items-center justify-center transition-all hover:bg-zinc-50 whitespace-nowrap"
              >
                Help Center <ArrowRight className="ml-2" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-zinc-100 flex flex-col items-center gap-8">
        <Link href="/" className="relative h-12 w-12 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center">
           <div className="h-8 w-8 bg-black rounded-full" />
        </Link>
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">© 2026 Workora Safety</p>
      </footer>

    </main>
  );
}
