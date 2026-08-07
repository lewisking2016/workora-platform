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
  CaretRight,
  Cube,
  IdentificationBadge,
  VideoCamera
} from '@phosphor-icons/react';

export default function Home() {
  const heroImage = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=high-tech%20professional%20artisan%20working%20in%20a%20clean%20minimalist%20workshop%20with%20digital%20overlays%20white%20theme%20ultra-modern%20tech%20aesthetic&image_size=landscape_16_9";
  const craftImage = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=close-up%20of%20precision%20engineering%20tools%20on%20a%20white%20grid%20background%20minimalist%20tech%20style%20black%20accents&image_size=square_hd";
  const trustImage = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20trust%20passport%20interface%20with%20biometric%20verification%20elements%20clean%20white%20ui%20tech%20design&image_size=landscape_4_3";
  const proofImage = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=high-definition%20video%20interface%20showing%20construction%20proof%20of%20work%20clean%20tech%20dashboard%20white%20theme&image_size=landscape_16_9";

  return (
    <main className="mx-auto max-w-screen-2xl flex flex-col bg-white text-black overflow-x-hidden font-display pt-20">
      
      {/* 1. TECH HERO - Squared & Minimalist */}
      <section className="relative min-h-[90vh] w-full flex flex-col lg:flex-row items-center border-b border-black/5">
        <div className="flex-1 px-[5%] py-12 lg:py-0 flex flex-col justify-center gap-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Cube size={14} weight="fill" className="text-black" />
              Infrastructure for Trust
            </div>
            
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              AFRICA&apos;S <br />
              <span className="text-[#0066FF]">PROFESSIONAL</span> <br />
              OS
            </h1>
            
            <p className="text-zinc-500 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
              The digital trust layer for the informal workforce. Verified skills, authenticated history, and real-time proof of work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/join" 
                className="h-14 px-10 bg-black text-white font-bold text-sm flex items-center justify-center transition-all hover:bg-[#0066FF] active:scale-95 uppercase tracking-widest"
              >
                Initialize <CaretRight weight="bold" size={18} className="ml-2" />
              </Link>
              <Link 
                href="/platform" 
                className="h-14 px-10 border border-black/10 text-black font-bold text-sm flex items-center justify-center transition-all hover:bg-zinc-50 active:scale-95 uppercase tracking-widest"
              >
                Documentation
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-1 w-full h-full min-h-[500px] relative overflow-hidden">
          <Image 
            src={heroImage}
            alt="Workora OS Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block" />
        </div>
      </section>

      {/* 2. THE TECH STACK (Features) - Squared Grid */}
      <section className="py-24 px-[5%] grid grid-cols-1 md:grid-cols-3 border-b border-black/5">
        {[
          { 
            title: "Verified Protocol", 
            desc: "Multi-layer identity and skill authentication protocol for every professional.",
            icon: ShieldCheck 
          },
          { 
            title: "Proof of Work", 
            desc: "High-definition visual evidence of craftsmanship captured and verified on-site.",
            icon: VideoCamera 
          },
          { 
            title: "Reputation Ledger", 
            desc: "Immutable history of performance, ratings, and verified client feedback.",
            icon: IdentificationBadge 
          }
        ].map((feature, i) => (
          <div key={i} className="p-12 border-b md:border-b-0 md:border-r last:border-r-0 border-black/5 flex flex-col gap-6 hover:bg-zinc-50 transition-colors group">
            <feature.icon size={40} weight="thin" className="text-black group-hover:text-[#0066FF] transition-colors" />
            <h3 className="text-2xl font-black tracking-tight uppercase">{feature.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. PRECISION ENGINEERING - Split Section */}
      <section className="flex flex-col lg:flex-row items-stretch min-h-[600px] border-b border-black/5">
        <div className="flex-1 relative aspect-square lg:aspect-auto">
          <Image 
            src={craftImage}
            alt="Precision Engineering"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-[8%] flex flex-col justify-center gap-8 bg-black text-white">
          <div className="h-1 w-20 bg-[#0066FF]" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
            Precision in <br /> Every Connection
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
            Our professionals are vetted for technical excellence. From complex circuitry to structural integrity, we ensure mastery at every touchpoint.
          </p>
          <Link href="/platform" className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest hover:text-[#0066FF] transition-colors">
            View Skill Standards <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 4. THE SKILL UNIVERSE - Squared Cards */}
      <section className="py-24 px-[5%] bg-white">
        <div className="flex flex-col gap-12 mb-20">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            The Skill <br /> Universe
          </h2>
          <div className="flex flex-wrap gap-4">
            {['Construction', 'Automotive', 'Tech Repair', 'Fashion', 'Domestic', 'Beauty', 'Industrial', 'Logistics'].map((tag) => (
              <span key={tag} className="px-4 py-2 border border-black/10 text-[10px] font-bold uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 border border-black/5">
          {[
            { name: 'Construction', sub: 'Engineering & Build', icon: Hammer },
            { name: 'Automotive', sub: 'Systems & Diagnostics', icon: Car },
            { name: 'Tech Repair', sub: 'Circuitry & Logic', icon: DeviceMobile },
            { name: 'Fashion', sub: 'Design & Craft', icon: TShirt },
            { name: 'Domestic', sub: 'Systems Management', icon: Broom },
            { name: 'Beauty', sub: 'Aesthetic Engineering', icon: Scissors },
            { name: 'Industrial', sub: 'Fabrication & Welding', icon: Gear },
            { name: 'Logistics', sub: 'Operations & Flow', icon: Moped },
          ].map((pillar, i) => (
            <div
              key={pillar.name}
              className="group tech-card p-12 bg-white flex flex-col gap-8 cursor-pointer"
            >
              <pillar.icon size={32} weight="thin" className="text-black group-hover:text-[#0066FF] transition-all" />
              <div>
                <h3 className="text-2xl font-black tracking-tight uppercase mb-2">{pillar.name}</h3>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{pillar.sub}</p>
              </div>
              <div className="mt-auto pt-8 border-t border-black/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">System Active</span>
                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROOF OF WORK - Large Visual */}
      <section className="py-24 px-[5%] bg-zinc-50 border-y border-black/5">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 mb-20">
          <div className="h-12 w-12 border border-black/10 flex items-center justify-center">
            <Star size={24} weight="thin" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Evidence-Based <br /> Hiring
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl">
            Eliminate uncertainty. Access high-definition proof-of-work captures for every professional before engagement.
          </p>
        </div>
        
        <div className="relative w-full max-w-[1200px] mx-auto aspect-video border border-black/10 overflow-hidden group">
           <Image 
            src={proofImage}
            alt="Proof of Work Protocol"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-12 left-12 z-20">
            <div className="bg-white p-8 border border-black/10 max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-2 bg-[#0066FF] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Verification</span>
              </div>
              <p className="text-xl font-black uppercase tracking-tight mb-4">Mastery in Structural Steel</p>
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <span className="text-2xl font-black">5.0</span>
                <ShieldCheck size={24} weight="fill" className="text-[#0066FF]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEM INITIALIZATION (CTA) - Final Section */}
      <section className="py-32 px-[5%] bg-white flex flex-col items-center text-center gap-12">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none max-w-5xl">
          Initialize Your <br /> Professional Network
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
           <Link 
            href="/join" 
            className="h-16 flex-1 flex items-center justify-center bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-[#0066FF] transition-all"
          >
            Become a Provider
          </Link>
          <Link 
            href="/login" 
            className="h-16 flex-1 flex items-center justify-center border border-black/10 text-black font-bold text-sm uppercase tracking-widest hover:bg-zinc-50 transition-all"
          >
            Access Network
          </Link>
        </div>
      </section>

      {/* Mesh Glow is handled in layout.tsx */}
    </main>
  );
}
