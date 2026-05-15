'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lightning, 
  Star, 
  CaretRight,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react';

export default function PersonalPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white text-zinc-950 overflow-x-hidden font-display">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full mt-4 rounded-[60px] overflow-hidden group bg-zinc-50 border border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        <div className="absolute inset-0 flex items-center justify-start px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left max-w-[700px]"
          >
            <p className="text-[#0066FF] font-black uppercase tracking-[0.3em] text-[10px] mb-8">For Clients & Customers</p>
            <h1 className="text-7xl font-black tracking-tighter text-zinc-950 mb-8 leading-[1.1]">
              Find the perfect <br />
              service for you.
            </h1>
            <p className="text-zinc-600 text-xl mb-10 leading-relaxed max-w-md font-medium">
              Browse verified masters, watch proof-of-work videos, and hire the right expert for any personal or home task with total confidence.
            </p>
            <div className="flex gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/login" 
                  className="group/btn h-14 px-8 bg-white text-zinc-950 rounded-2xl font-black text-base flex items-center justify-center transition-all shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-zinc-100 whitespace-nowrap"
                >
                  Start Searching <CaretRight weight="bold" size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-32 px-[5%] grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            icon: ShieldCheck,
            title: "Pre-vetted Experts",
            desc: "We verify identity and skills so you don&apos;t have to. Only the best make it to Workora.",
            color: "text-[#0066FF]"
          },
          {
            icon: Lightning,
            title: "On-Demand Access",
            desc: "Get connected with available masters in your area instantly. No more long waits.",
            color: "text-[#7000FF]"
          },
          {
            icon: Star,
            title: "Verified Reviews",
            desc: "Read real feedback from other clients and watch actual proof-of-work videos.",
            color: "text-[#FFB800]"
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

      {/* Trust Passport Section */}
      <section className="py-32 bg-zinc-50 rounded-[80px] mx-[2%] px-[10%] flex flex-col lg:flex-row items-center gap-20 overflow-hidden relative border border-zinc-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0066FF]/5 to-transparent pointer-events-none" />
        <div className="flex-1 z-10">
          <h2 className="text-6xl font-black tracking-tighter text-zinc-950 mb-8 leading-tight">
            The Digital <br />
            <span className="text-[#0066FF]">Trust Passport.</span>
          </h2>
          <p className="text-zinc-600 text-xl mb-12 leading-relaxed">
            Every professional on Workora has a Trust Passport. This isn&apos;t just a profile; it&apos;s a verified record of their identity, skills, and work history.
          </p>
          <ul className="flex flex-col gap-6">
            {[
              "Verified ID & Background Check",
              "Certified Skill Assessment",
              "Real Video Proof of Work",
              "Transparent Customer Reviews"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-950 font-bold">
                <CheckCircle size={24} className="text-[#0066FF]" weight="fill" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 relative w-full aspect-square max-w-[500px]">
           <div className="absolute inset-0 bg-[#0066FF]/20 blur-[120px] rounded-full" />
           <div className="relative z-10 bg-white border border-zinc-100 rounded-[40px] p-8 shadow-2xl">
              {/* Mockup of a Trust Passport */}
              <div className="flex items-center gap-6 mb-8">
                <div className="h-20 w-20 rounded-full bg-zinc-100 animate-pulse" />
                <div>
                  <div className="h-6 w-32 bg-zinc-50 rounded-full mb-2" />
                  <div className="h-4 w-20 bg-zinc-50 rounded-full" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-zinc-50 rounded-full" />
                <div className="h-4 w-3/4 bg-zinc-50 rounded-full" />
                <div className="pt-4 flex gap-2">
                  <div className="h-8 px-4 bg-[#0066FF] rounded-full text-[10px] font-black flex items-center text-white uppercase tracking-wider">Verified</div>
                  <div className="h-8 px-4 bg-zinc-100 rounded-full text-[10px] font-black flex items-center text-zinc-950 uppercase tracking-wider">Construction</div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-40 px-[5%]">
        <div className="bg-white rounded-[80px] p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden border border-zinc-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0066FF]/5 skew-x-12 translate-x-20" />
          <div className="relative z-10 text-zinc-950 lg:max-w-xl">
            <h2 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
              Ready to find <br />
              your next master?
            </h2>
            <p className="text-zinc-600 text-xl font-medium leading-relaxed">
              Join thousands of clients who trust Workora for their home and personal needs. Hire with zero risk.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/login" 
                className="h-14 px-10 bg-[#0066FF] text-white rounded-xl font-black text-base flex items-center justify-center transition-all shadow-xl shadow-[#0066FF]/20 whitespace-nowrap"
              >
                Create Client Account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/login" 
                className="h-14 px-10 bg-white border-2 border-zinc-100 text-zinc-950 rounded-xl font-black text-base flex items-center justify-center transition-all hover:bg-zinc-50 whitespace-nowrap"
              >
                Browse Experts <ArrowRight className="ml-2" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-zinc-100 flex flex-col items-center gap-8">
        <Link href="/" className="relative h-12 w-12 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center">
           <div className="h-8 w-8 bg-black rounded-full" />
        </Link>
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">© 2026 Workora Personal</p>
      </footer>

    </main>
  );
}
