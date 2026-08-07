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
  // Using local images from public/landing
  const heroImage = "/landing/workora hero.jpeg";
  const craftImage = "/landing/wiring-1.jpg";
  const trustImage = "/landing/verified badge.jpeg";
  const proofImage = "/landing/The Video Feedback.png";

  return (
    <main className="mx-auto max-w-screen-2xl flex flex-col bg-transparent text-black overflow-x-hidden font-display pt-20">
      
      {/* 1. TECH HERO - Full Background Image */}
      <section className="relative min-h-[90vh] w-full flex items-center border-b border-blue-500/10">
        {/* Full Background Image */}
        <Image 
          src={heroImage}
          alt="Workora OS Hero"
          fill
          className="object-cover"
          priority
        />
        {/* removed overlay to keep hero image super clear per design request */}
        
        {/* Content */}
        <div className="relative z-10 w-full px-[5%] py-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/20 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest mb-6">
              <Cube size={14} weight="fill" className="text-blue-500" />
              Infrastructure for Trust
            </div>
            
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-[#1a1a2e] animated-text">
              AFRICA&apos;S <br />
              <span className="text-inherit">PROFESSIONAL</span> <br />
              OS
            </h1>
            
            <p className="text-slate-700 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-medium">
              The digital trust layer for the informal workforce. Verified skills, authenticated history, and real-time proof of work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/join" 
                className="h-14 px-10 bg-blue-500 text-white font-bold text-sm flex items-center justify-center transition-all hover:bg-blue-600 active:scale-95 uppercase tracking-widest shadow-lg shadow-blue-500/30 btn"
              >
                Get started <CaretRight weight="bold" size={18} className="ml-2" />
              </Link>
              <Link 
                href="/platform" 
                className="h-14 px-10 border border-blue-500/20 bg-white/90 backdrop-blur-sm text-[#1a1a2e] font-bold text-sm flex items-center justify-center transition-all hover:bg-white active:scale-95 uppercase tracking-widest btn"
              >
                How it works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE TECH STACK (Features) - Squared Grid */}
      <section className="py-24 px-[5%] grid grid-cols-1 md:grid-cols-3 border-b border-black/5 bg-transparent">
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
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-12 border-b md:border-b-0 md:border-r last:border-r-0 border-black/5 flex flex-col gap-6 hover:bg-zinc-50/50 backdrop-blur-sm transition-all group cursor-pointer"
          >
            <feature.icon size={40} weight="thin" className="text-black group-hover:text-[#0066FF] transition-colors" />
            <h3 className="text-2xl font-black tracking-tight uppercase">{feature.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
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
        <div className="flex-1 p-[8%] flex flex-col justify-center gap-8 bg-white/80 backdrop-blur-sm text-black">
          <div className="h-1 w-20 bg-[var(--brand)]" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
            Precision in <br /> Every Connection
          </h2>
          <p className="text-zinc-600 text-lg leading-relaxed max-w-lg">
            Our professionals are vetted for technical excellence. From complex circuitry to structural integrity, we ensure mastery at every touchpoint.
          </p>
          <Link href="/platform" className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest bg-[var(--brand)] text-white px-5 py-3 rounded shadow btn">
            How it works <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 4. THE SKILL UNIVERSE - Squared Cards */}
      <section className="py-24 px-[5%] bg-transparent">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group tech-card p-12 bg-white/90 backdrop-blur-sm flex flex-col gap-8 cursor-pointer border border-blue-500/10 hover:border-blue-500/30"
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
            </motion.div>
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
          {/* removed dark overlay to keep proof image clear */}
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
      <section className="py-32 px-[5%] bg-transparent flex flex-col items-center text-center gap-12">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none max-w-5xl">
          Join Workora <br /> today
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
           <Link 
            href="/join" 
            className="h-16 flex-1 flex items-center justify-center bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-[#0066FF] transition-all btn"
          >
            Join as helper
          </Link>
          <Link 
            href="/login" 
            className="h-16 flex-1 flex items-center justify-center border border-black/10 text-black font-bold text-sm uppercase tracking-widest hover:bg-zinc-50 transition-all btn"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Mesh Glow is handled in layout.tsx */}
    </main>
  );
}
