'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Hammer, 
  Car, 
  DeviceMobile, 
  TShirt, 
  Broom, 
  Scissors, 
  Gear, 
  Moped,
  ArrowRight,
  ShieldCheck,
  Lightning,
  Star,
  CaretRight
} from '@phosphor-icons/react';

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white text-zinc-950 overflow-x-hidden font-display">
      
      {/* 1. THE MASTER HERO - Clean & Borderless */}
      <section className="relative h-[100vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Full Bleed Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/landing/workora hero.jpeg"
            alt="Workora Master Hero"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        
        {/* Hero Content - Centered & Elegant */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 sm:gap-8"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <div className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
              The Professional Network
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.1] px-4">
              Africa&apos;s Trusted <br />
              <span className="bg-gradient-to-r from-[#0066FF] via-[#00D1FF] to-[#0066FF] bg-clip-text text-transparent">
                Professional Network
              </span>
            </h1>
            
            <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed font-medium px-4">
              Connect with verified craftsmen and professionals. Quality work, verified skills, trusted results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto px-4">
              <Link 
                href="/join" 
                className="group h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 active:scale-95 whitespace-nowrap"
              >
                Get Started <CaretRight weight="bold" size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/platform" 
                className="h-12 sm:h-14 px-6 sm:px-8 bg-white/10 backdrop-blur-xl border border-white/30 text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center transition-all hover:bg-white/20 active:scale-95 whitespace-nowrap"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Hidden on Mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-0.5 bg-white/40 rounded-full"
          />
        </motion.div>
      </section>

      {/* 2. THE MACRO DETAIL (Craftsmanship) - Clean White */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-[5%] flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16 bg-white">
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 w-full">
          <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#7000FF] items-center justify-center shadow-lg shadow-blue-500/20">
            <Lightning size={24} weight="bold" className="text-white sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-zinc-950">
            Precision in <br />
            every connection
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg">
            Our professionals don&apos;t just work—they engineer solutions. From intricate wiring to master plumbing, every skill is verified.
          </p>
          <Link 
            href="/platform" 
            className="inline-flex items-center gap-2 text-[#0066FF] font-bold text-sm sm:text-base hover:gap-3 transition-all active:scale-95"
          >
            Learn about our verification <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
        <div className="flex-1 relative aspect-square w-full max-w-[550px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <Image 
            src="/landing/wiring-1.jpg"
            alt="Professional Craftsmanship"
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            className="object-cover"
          />
        </div>
      </section>

      {/* 3. THE VERIFIED BADGE (Trust Engine) - Clean White */}
      <section className="bg-zinc-50 py-20 lg:py-32 px-[5%] flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl">
          <Image 
            src="/landing/verified badge.jpeg"
            alt="Verified Badge"
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-[#0066FF] text-xs font-bold uppercase tracking-widest shadow-sm w-fit">
            <ShieldCheck size={18} weight="bold" /> Trusted Network
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-zinc-950">
            The Digital <br />
            Trust Passport
          </h2>
          <p className="text-zinc-600 text-lg lg:text-xl leading-relaxed max-w-lg">
            Every professional carries a unique Trust Passport with verified identity, skills, and authentic reviews you can rely on.
          </p>
          <Link 
            href="/trust" 
            className="inline-flex items-center gap-2 text-[#0066FF] font-bold text-base hover:gap-3 transition-all"
          >
            Learn about Trust & Safety <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
      </section>

      {/* 4. THE SKILL UNIVERSE (8 Pillars) - Clean White Grid */}
      <section className="py-24 lg:py-32 px-[5%] bg-white">
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest">
            Discover the Craft
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.1]">
            The Workora Universe
          </h2>
          <p className="text-zinc-600 text-lg lg:text-xl max-w-2xl leading-relaxed">
            Empowering the masters of construction, technology, and artisanal craft
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Construction', sub: 'Masons, Roofers', icon: Hammer, color: 'from-[#0066FF] to-[#00D1FF]' },
            { name: 'Automotive', sub: 'Mechanics, Body Work', icon: Car, color: 'from-[#7000FF] to-[#9D4EDD]' },
            { name: 'Tech Repair', sub: 'Phones, PC, TV', icon: DeviceMobile, color: 'from-[#0066FF] to-[#00D1FF]' },
            { name: 'Fashion', sub: 'Tailors, Cobblers', icon: TShirt, color: 'from-[#7000FF] to-[#9D4EDD]' },
            { name: 'Domestic', sub: 'Cleaners, Cooks', icon: Broom, color: 'from-[#0066FF] to-[#00D1FF]' },
            { name: 'Beauty', sub: 'Barbers, Stylists', icon: Scissors, color: 'from-[#7000FF] to-[#9D4EDD]' },
            { name: 'Industrial', sub: 'Welders, Fabricators', icon: Gear, color: 'from-[#0066FF] to-[#00D1FF]' },
            { name: 'Logistics', sub: 'Riders, Drivers', icon: Moped, color: 'from-[#7000FF] to-[#9D4EDD]' },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl bg-white border border-zinc-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-zinc-300 cursor-pointer"
            >
              <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${pillar.color} items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                <pillar.icon size={28} weight="bold" className="text-white" />
              </div>
              
              <h3 className="text-2xl font-black mb-2 text-zinc-950 tracking-tight">{pillar.name}</h3>
              <p className="text-sm text-zinc-500 font-medium mb-6">{pillar.sub}</p>
              
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Pros</span>
              </div>
              
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                <ArrowRight size={24} weight="bold" className="text-zinc-950" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. THE VIDEO FEEDBACK (Proof Section) - Clean White */}
      <section className="py-24 lg:py-32 px-[5%] flex flex-col items-center text-center gap-12 bg-zinc-50">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-[#7000FF] to-[#9D4EDD] items-center justify-center shadow-lg shadow-purple-500/20">
            <Star size={28} weight="fill" className="text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-zinc-950">
            Proof of Work. <br />
            No guesswork.
          </h2>
          <p className="text-zinc-600 text-lg lg:text-xl leading-relaxed max-w-2xl">
            Watch high-definition videos of professionals in action before you even message them.
          </p>
        </div>
        
        <div className="relative w-full max-w-[1100px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
           <Image 
            src="/landing/The Video Feedback.png"
            alt="Video Proof of Work"
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover bg-white"
          />
          
          {/* Trust Card Overlay */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:block absolute bottom-[25%] left-[8%] z-20 max-w-[280px]"
          >
            <div className="bg-white/95 backdrop-blur-2xl p-7 rounded-3xl shadow-2xl border border-zinc-200">
              <div className="flex flex-col gap-4">
                <div className="text-[#0066FF] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
                  Elite Verification
                </div>
                <p className="text-zinc-950 font-black text-2xl leading-tight tracking-tight">
                  Mastery in <br /> 
                  Custom Woodwork
                </p>
                <div className="mt-3 pt-4 border-t border-zinc-200 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Rating</span>
                      <span className="text-zinc-950 font-black text-xl">5.0 / 5.0</span>
                   </div>
                   <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200">
                      <ShieldCheck size={24} weight="fill" className="text-[#0066FF]" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. THE TRUST CYCLE (How it Works) - Clean White */}
      <section className="py-24 lg:py-32 px-[5%] bg-white">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          <div className="flex-1">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-12 text-zinc-950 leading-[1.1]">
               How Trust <br />is built
             </h2>
             <div className="flex flex-col gap-10">
               {[
                 { step: '01', title: 'Discover', desc: 'Browse verified craftsmen and professionals across all trades.' },
                 { step: '02', title: 'Watch Proof', desc: 'See their work through high-definition proof-of-work videos.' },
                 { step: '03', title: 'Hire Confidently', desc: 'Connect directly and hire the pro that fits your needs.' },
               ].map((item) => (
                 <div key={item.step} className="flex gap-6">
                   <span className="text-5xl font-black text-[#0066FF]/10 tracking-tight">{item.step}</span>
                   <div className="flex-1">
                     <h3 className="text-2xl font-black mb-3 tracking-tight text-zinc-950">{item.title}</h3>
                     <p className="text-zinc-600 text-lg leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="flex-1 bg-zinc-50 p-10 lg:p-12 rounded-3xl shadow-xl border border-zinc-200">
             <div className="flex flex-col gap-8">
               <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00D1FF] items-center justify-center shadow-lg shadow-blue-500/20">
                 <ShieldCheck size={28} weight="bold" className="text-white" />
               </div>
               <h3 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-950 leading-tight">
                 Verified by <br />ImeanTech
               </h3>
               <p className="text-zinc-600 text-lg leading-relaxed">
                 Our multi-layer verification ensures every professional is vetted for identity, skill, and history. We don&apos;t just list pros—we back them.
               </p>
               <Link 
                 href="/safety"
                 className="h-12 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center"
               >
                 Learn about Safety
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION - Clean White */}
      <section className="py-24 lg:py-32 px-[5%] bg-white">
        <div className="bg-zinc-50 rounded-3xl p-12 lg:p-20 flex flex-col items-center text-center gap-10 relative overflow-hidden border border-zinc-200">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-[#7000FF]/5" />
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 relative z-10 leading-[1.1] max-w-4xl">
            Ready to find your next master professional?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-xl">
             <Link 
              href="/join" 
              className="h-14 flex-1 flex items-center justify-center bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-bold text-base hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
            >
              Join as a Pro
            </Link>
            <Link 
              href="/login" 
              className="h-14 flex-1 flex items-center justify-center bg-white border-2 border-zinc-300 text-zinc-950 rounded-full font-bold text-base hover:bg-zinc-100 transition-all"
            >
              Browse Experts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
