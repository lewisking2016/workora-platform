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
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white dark:bg-[#0A0E17] text-zinc-950 dark:text-zinc-50 overflow-x-hidden font-display">
      
      {/* 1. THE MASTER HERO (Elegant Refinement) */}
      <section className="relative h-[80vh] min-h-[600px] lg:h-[85vh] w-full mt-4 rounded-[40px] lg:rounded-[60px] overflow-hidden group">
        <Image 
          src="/landing/workora hero.jpeg"
          alt="Workora Master Hero"
          fill
          sizes="(max-width: 1536px) 100vw, 1536px"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        {/* Subtle, Sophisticated Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/10 to-transparent" />
        
        {/* Elegant Typography (Right Aligned) */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-end lg:text-right max-w-[650px]"
          >
            <p className="text-[#0066FF] font-black uppercase tracking-[0.3em] text-[10px] mb-8">The Professional Network</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
              The people behind <br />
              <span className="bg-gradient-to-r from-[#0066FF] via-[#7000FF] to-[#0066FF] bg-size-200 animate-gradient-x bg-clip-text text-transparent italic">Workora.</span>
            </h1>
            <p className="text-white text-sm sm:text-xl mb-12 leading-relaxed max-w-md font-bold drop-shadow-md">
              A community of verified, innovative craftsmen dedicated to making a lasting impact across Africa.
            </p>
            <Link 
              href="/login" 
              className="group/btn h-14 px-10 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-2xl font-black text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
            >
              Get Started <CaretRight weight="bold" size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. THE MACRO DETAIL (Craftsmanship) */}
      <section className="py-20 lg:py-32 px-[5%] flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        <div className="flex-1 flex flex-col gap-8">
          <div className="h-16 w-16 rounded-3xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
            <Lightning size={32} weight="duotone" className="text-[#0066FF]" />
          </div>
          <h2 className="text-5xl md:text-[64px] font-black tracking-tighter leading-[0.9] text-zinc-950 dark:text-white">
            Precision in <br />
            every connection.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xl leading-relaxed max-w-md font-medium">
            Our pros don&apos;t just work; they engineer solutions. From intricate wiring to master plumbing, we verify the skill behind the screen.
          </p>
        </div>
        <div className="flex-1 relative aspect-square w-full max-w-[600px] rounded-3xl sm:rounded-[56px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-black/50 border-4 sm:border-8 border-white dark:border-zinc-800">
          <Image 
            src="/landing/wiring-1.jpg"
            alt="Macro Wiring Detail"
            fill
            sizes="(max-width: 600px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      </section>

      {/* 3. THE VERIFIED BADGE (Trust Engine) */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-16 lg:py-32 rounded-[40px] lg:rounded-[80px] mx-[2%] px-[5%] flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20">
        <div className="flex-1 relative aspect-video w-full rounded-3xl sm:rounded-[56px] overflow-hidden shadow-2xl border-4 sm:border-[12px] border-white dark:border-zinc-800">
          <Image 
            src="/landing/verified badge.jpeg"
            alt="Verified Badge"
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-zinc-800 text-[#0066FF] text-[11px] font-black uppercase tracking-[0.2em] border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <ShieldCheck size={20} weight="bold" /> Trusted Network
          </div>
          <h2 className="text-5xl md:text-[64px] font-black tracking-tighter leading-[0.9] text-zinc-950 dark:text-white">
            The Digital <br />
            Trust Passport.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xl leading-relaxed font-medium">
            Every Workora professional carries a unique Trust Passport. 
            Verified identities, skills, and verified reviews you can bank on.
          </p>
        </div>
      </section>

      {/* 4. THE SKILL UNIVERSE (8 Pillars) */}
      <section className="py-40 px-[5%] bg-white dark:bg-[#0A0E17]">
        <div className="flex flex-col items-center text-center gap-8 mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 dark:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.2em]">
             Discover the Craft
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none">The Workora Universe.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-2xl max-w-2xl font-medium leading-relaxed">
            Empowering the masters of construction, technology, and artisanal craft.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { name: 'Construction', sub: 'Masons, Roofers', icon: Hammer, color: 'text-[#0066FF]' },
            { name: 'Automotive', sub: 'Mechanics, Body', icon: Car, color: 'text-[#7000FF]' },
            { name: 'Tech Repair', sub: 'Phones, PC, TV', icon: DeviceMobile, color: 'text-[#0066FF]' },
            { name: 'Fashion', sub: 'Tailors, Cobblers', icon: TShirt, color: 'text-[#7000FF]' },
            { name: 'Domestic', sub: 'Cleaners, Cooks', icon: Broom, color: 'text-[#0066FF]' },
            { name: 'Beauty', sub: 'Barbers, Stylists', icon: Scissors, color: 'text-[#7000FF]' },
            { name: 'Industrial', sub: 'Welders, Fabricators', icon: Gear, color: 'text-[#0066FF]' },
            { name: 'Logistics', sub: 'Riders, Drivers', icon: Moped, color: 'text-[#7000FF]' },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              className="relative p-8 lg:p-12 rounded-[40px] lg:rounded-[56px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-700 hover:-translate-y-3 group cursor-pointer shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              
              <div className="h-20 w-20 rounded-[32px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <pillar.icon size={40} weight="duotone" className={pillar.color} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3 text-zinc-950 dark:text-white tracking-tight">{pillar.name}</h3>
                <p className="text-base text-zinc-500 dark:text-zinc-400 font-bold mb-8">{pillar.sub}</p>
                
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#0066FF] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Active Pros
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <ArrowRight size={28} weight="bold" className="text-zinc-950 dark:text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. THE VIDEO FEEDBACK (Proof Section) */}
      <section className="py-20 lg:py-40 px-[5%] flex flex-col items-center text-center gap-10 lg:gap-20">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[#7000FF] shadow-inner">
            <Star size={36} weight="fill" />
          </div>
          <h2 className="text-5xl md:text-[64px] lg:text-[80px] font-black tracking-tighter leading-[0.9] text-zinc-950 dark:text-white">
            Proof of Work. <br />
            No guesswork.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-2xl font-medium leading-relaxed">
            Watch high-definition videos of your pro in action before you even message them.
          </p>
        </div>
        
        <div className="relative w-full max-w-[1100px] aspect-[16/10] rounded-3xl sm:rounded-[80px] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] dark:shadow-black border-4 sm:border-[12px] border-zinc-50 dark:border-zinc-800">
           <Image 
            src="/landing/The Video Feedback.png"
            alt="The Video Feedback"
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover bg-white"
          />
          {/* Trust Insight Card (The "Green Section" Note) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="hidden lg:block absolute bottom-[25%] left-[8%] z-20 max-w-[280px]"
          >
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-7 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white dark:border-zinc-800">
              <div className="flex flex-col gap-4">
                <div className="text-[#0066FF] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
                  Elite Verification
                </div>
                <p className="text-zinc-950 dark:text-white font-black text-2xl leading-tight tracking-tighter">
                  Mastery in <br /> 
                  Custom Woodwork.
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">Rating</span>
                      <span className="text-zinc-950 dark:text-white font-black text-xl tracking-tight">5.0 / 5.0</span>
                   </div>
                   <div className="h-12 w-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                      <ShieldCheck size={24} weight="fill" className="text-[#0066FF]" />
                   </div>
                </div>
              </div>
            </div>
            
            {/* Contextual Note Below */}
            <div className="mt-6 px-4">
               <p className="text-white font-bold text-sm leading-relaxed italic drop-shadow-lg">
                 &quot;Proof of work is the only way to build absolute trust in the digital age.&quot;
               </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. THE TRUST CYCLE (How it Works) */}
      <section className="py-16 lg:py-32 px-[5%] bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] mx-[2%]">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1">
             <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter mb-8 lg:mb-12 text-zinc-950 dark:text-white leading-none">How Trust is built.</h2>
             <div className="flex flex-col gap-12">
               {[
                 { step: '01', title: 'Discover', desc: 'Browse our universe of verified craftsmen and women.' },
                 { step: '02', title: 'Watch Proof', desc: 'See their work in action through high-definition proof-of-work videos.' },
                 { step: '03', title: 'Hire with Confidence', desc: 'Directly connect and hire the pro that fits your needs.' },
               ].map((item) => (
                 <div key={item.step} className="flex gap-8">
                   <span className="text-4xl font-black text-[#0066FF]/10 tracking-tighter pt-1">{item.step}</span>
                   <div>
                     <h3 className="text-3xl font-black mb-3 tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
                     <p className="text-zinc-600 dark:text-zinc-400 text-xl leading-relaxed font-bold">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="flex-1 bg-white dark:bg-[#0A0E17] p-8 lg:p-16 rounded-[40px] lg:rounded-[72px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-black border border-zinc-100 dark:border-zinc-800">
             <div className="flex flex-col gap-10">
               <div className="h-16 w-16 rounded-[24px] bg-[#0066FF] flex items-center justify-center text-white shadow-lg shadow-[#0066FF]/20">
                 <ShieldCheck size={32} weight="bold" />
               </div>
               <h3 className="text-3xl md:text-4xl lg:text-[52px] font-black tracking-tighter italic text-zinc-950 dark:text-white leading-tight">Verified by ImeanTech.</h3>
               <p className="text-zinc-600 dark:text-zinc-400 text-2xl leading-relaxed font-bold">
                 Our multi-layer verification system ensures that every pro on our platform is 
                 vetted for identity, skill, and history. We don&apos;t just list pros; we back them.
               </p>
               <Link 
                 href="/safety"
                 className="h-14 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-xl font-black text-xs transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] uppercase tracking-[0.2em] shadow-lg shadow-[#0066FF]/20 whitespace-nowrap flex items-center justify-center"
               >
                 Learn about Safety
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-20 lg:py-40 px-[5%]">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] p-8 lg:p-24 flex flex-col items-center text-center gap-8 lg:gap-12 relative overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 to-transparent" />
          <h2 className="text-4xl md:text-6xl lg:text-[96px] font-black tracking-tighter text-zinc-950 dark:text-white relative z-10 leading-[0.9]">
            Ready to find your <br />
            next master pro?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full max-w-xl">
             <Link 
              href="/login" 
              className="h-14 flex-1 flex items-center justify-center bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-xl font-black text-xl hover:scale-105 hover:brightness-110 transition-all shadow-xl shadow-[#7000FF]/20 whitespace-nowrap"
            >
              Join as a Pro
            </Link>
            <Link 
              href="/login" 
              className="h-14 flex-1 flex items-center justify-center bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 text-zinc-950 dark:text-white rounded-xl font-black text-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all whitespace-nowrap"
            >
              Browse Experts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
