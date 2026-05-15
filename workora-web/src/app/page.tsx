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
      
      {/* 1. THE MASTER HERO (Elegant Refinement) */}
      <section className="relative h-[85vh] w-full mt-4 rounded-[60px] overflow-hidden group">
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
        <div className="absolute inset-0 flex items-center justify-end px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-end text-right max-w-[650px]"
          >
            <p className="text-[#0066FF] font-black uppercase tracking-[0.3em] text-[10px] mb-8">The Professional Network</p>
            <h1 className="text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
              The people behind <br />
              <span className="bg-gradient-to-r from-[#0066FF] via-[#7000FF] to-[#0066FF] bg-size-200 animate-gradient-x bg-clip-text text-transparent italic">Workora.</span>
            </h1>
            <p className="text-white text-xl mb-12 leading-relaxed max-w-md font-bold drop-shadow-md">
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
      <section className="py-32 px-[5%] flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 flex flex-col gap-8">
          <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center shadow-inner">
            <Lightning size={32} weight="duotone" className="text-[#0066FF]" />
          </div>
          <h2 className="text-[64px] font-black tracking-tighter leading-[0.9] text-zinc-950">
            Precision in <br />
            every connection.
          </h2>
          <p className="text-zinc-600 text-xl leading-relaxed max-w-md font-medium">
            Our pros don&apos;t just work; they engineer solutions. From intricate wiring to master plumbing, we verify the skill behind the screen.
          </p>
        </div>
        <div className="flex-1 relative aspect-square w-full max-w-[600px] rounded-[56px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white">
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
      <section className="bg-zinc-50 py-32 rounded-[80px] mx-[2%] px-[5%] flex flex-col-reverse lg:flex-row items-center gap-20">
        <div className="flex-1 relative aspect-video w-full rounded-[56px] overflow-hidden shadow-2xl border-[12px] border-white">
          <Image 
            src="/landing/verified badge.jpeg"
            alt="Verified Badge"
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0066FF] text-[11px] font-black uppercase tracking-[0.2em] border border-zinc-200 shadow-sm">
            <ShieldCheck size={20} weight="bold" /> Trusted Network
          </div>
          <h2 className="text-[64px] font-black tracking-tighter leading-[0.9] text-zinc-950">
            The Digital <br />
            Trust Passport.
          </h2>
          <p className="text-zinc-600 text-xl leading-relaxed font-medium">
            Every Workora professional carries a unique Trust Passport. 
            Verified identities, skills, and verified reviews you can bank on.
          </p>
        </div>
      </section>

      {/* 4. THE SKILL UNIVERSE (8 Pillars) */}
      <section className="py-40 px-[5%] bg-white">
        <div className="flex flex-col items-center text-center gap-8 mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 text-white text-[11px] font-black uppercase tracking-[0.2em]">
             Discover the Craft
          </div>
          <h2 className="text-[80px] font-black tracking-tighter text-zinc-950 leading-none">The Workora Universe.</h2>
          <p className="text-zinc-600 text-2xl max-w-2xl font-medium leading-relaxed">
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
              className="relative p-12 rounded-[56px] bg-white border border-zinc-100 transition-all duration-700 hover:-translate-y-3 group cursor-pointer shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              
              <div className="h-20 w-20 rounded-[32px] bg-zinc-50 flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <pillar.icon size={40} weight="duotone" className={pillar.color} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3 text-zinc-950 tracking-tight">{pillar.name}</h3>
                <p className="text-base text-zinc-500 font-bold mb-8">{pillar.sub}</p>
                
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#0066FF] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Active Pros
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <ArrowRight size={28} weight="bold" className="text-zinc-950" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. THE VIDEO FEEDBACK (Proof Section) */}
      <section className="py-40 px-[5%] flex flex-col items-center text-center gap-20">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          <div className="h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center text-[#7000FF] shadow-inner">
            <Star size={36} weight="fill" />
          </div>
          <h2 className="text-[80px] font-black tracking-tighter leading-[0.9] text-zinc-950">
            Proof of Work. <br />
            No guesswork.
          </h2>
          <p className="text-zinc-600 text-2xl font-medium leading-relaxed">
            Watch high-definition videos of your pro in action before you even message them.
          </p>
        </div>
        
        <div className="relative w-full max-w-[1100px] aspect-[16/10] rounded-[80px] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] border-[12px] border-zinc-50">
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
            className="absolute bottom-[25%] left-[8%] z-20 max-w-[280px]"
          >
            <div className="bg-white/95 backdrop-blur-2xl p-7 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white">
              <div className="flex flex-col gap-4">
                <div className="text-[#0066FF] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
                  Elite Verification
                </div>
                <p className="text-zinc-950 font-black text-2xl leading-tight tracking-tighter">
                  Mastery in <br /> 
                  Custom Woodwork.
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">Rating</span>
                      <span className="text-zinc-950 font-black text-xl tracking-tight">5.0 / 5.0</span>
                   </div>
                   <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100">
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
      <section className="py-32 px-[5%] bg-zinc-50 rounded-[80px] mx-[2%]">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1">
             <h2 className="text-[64px] font-black tracking-tighter mb-12 text-zinc-950 leading-none">How Trust is built.</h2>
             <div className="flex flex-col gap-12">
               {[
                 { step: '01', title: 'Discover', desc: 'Browse our universe of verified craftsmen and women.' },
                 { step: '02', title: 'Watch Proof', desc: 'See their work in action through high-definition proof-of-work videos.' },
                 { step: '03', title: 'Hire with Confidence', desc: 'Directly connect and hire the pro that fits your needs.' },
               ].map((item) => (
                 <div key={item.step} className="flex gap-8">
                   <span className="text-4xl font-black text-[#0066FF]/10 tracking-tighter pt-1">{item.step}</span>
                   <div>
                     <h3 className="text-3xl font-black mb-3 tracking-tight text-zinc-950">{item.title}</h3>
                     <p className="text-zinc-600 text-xl leading-relaxed font-bold">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="flex-1 bg-white p-16 rounded-[72px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100">
             <div className="flex flex-col gap-10">
               <div className="h-16 w-16 rounded-[24px] bg-[#0066FF] flex items-center justify-center text-white shadow-lg shadow-[#0066FF]/20">
                 <ShieldCheck size={32} weight="bold" />
               </div>
               <h3 className="text-[52px] font-black tracking-tighter italic text-zinc-950 leading-tight">Verified by ImeanTech.</h3>
               <p className="text-zinc-600 text-2xl leading-relaxed font-bold">
                 Our multi-layer verification system ensures that every pro on our platform is 
                 vetted for identity, skill, and history. We don&apos;t just list pros; we back them.
               </p>
               <Link 
                 href="/safety"
                 className="h-14 w-full bg-[#0066FF] text-white rounded-xl font-black text-xs transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.2em] shadow-lg shadow-[#0066FF]/20 whitespace-nowrap flex items-center justify-center"
               >
                 Learn about Safety
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-40 px-[5%]">
        <div className="bg-zinc-50 rounded-[80px] p-24 flex flex-col items-center text-center gap-12 relative overflow-hidden border border-zinc-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 to-transparent" />
          <h2 className="text-[96px] font-black tracking-tighter text-zinc-950 relative z-10 leading-[0.9]">
            Ready to find your <br />
            next master pro?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full max-w-xl">
             <Link 
              href="/login" 
              className="h-14 flex-1 flex items-center justify-center bg-[#7000FF] text-white rounded-xl font-black text-xl hover:scale-105 transition-transform shadow-xl shadow-[#7000FF]/20 whitespace-nowrap"
            >
              Join as a Pro
            </Link>
            <Link 
              href="/login" 
              className="h-14 flex-1 flex items-center justify-center bg-white border-2 border-zinc-100 text-zinc-950 rounded-xl font-black text-xl hover:bg-zinc-50 transition-all whitespace-nowrap"
            >
              Browse Experts
            </Link>
          </div>
        </div>
      </section>
      {/* 8. DETAILED FOOTER */}
      <footer className="bg-white border-t border-zinc-100 py-40 px-[5%]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-20 mb-32">
          <div className="col-span-2 flex flex-col gap-8">
            <Link href="/" className="relative flex items-center justify-center transition-transform hover:scale-110">
            <div className="relative h-20 w-20">
              <Image 
                src="/logo/workora_logo.png"
                alt="Workora Logo"
                fill
                className="object-contain brightness-0"
                priority
              />
            </div>
          </Link>
            <p className="text-zinc-600 text-xl max-w-sm leading-relaxed font-medium">
              Empowering Africa&apos;s informal workforce through the Digital Trust Passport. 
              Reputation is the new currency.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-10 text-zinc-950 uppercase tracking-[0.3em] text-[12px]">Product</h4>
            <ul className="flex flex-col gap-6 text-base text-zinc-500 font-bold">
              <li><Link href="/explore" className="hover:text-zinc-950 transition-colors">Explore Pros</Link></li>
              <li><Link href="/trust" className="hover:text-zinc-950 transition-colors">Trust Passport</Link></li>
              <li><Link href="/safety" className="hover:text-zinc-950 transition-colors">Safety First</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-zinc-950 uppercase tracking-[0.3em] text-[12px]">Company</h4>
            <ul className="flex flex-col gap-6 text-base text-zinc-500 font-bold">
              <li><Link href="/about" className="hover:text-zinc-950 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-zinc-950 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-zinc-950 uppercase tracking-[0.3em] text-[12px]">Legal</h4>
            <ul className="flex flex-col gap-6 text-base text-zinc-500 font-bold">
              <li><Link href="/help" className="hover:text-zinc-950 transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-16 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">
          <p>© 2026 Workora Platform. A subsidiary of ImeanTech.</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-zinc-950 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-zinc-950 transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-zinc-950 transition-colors">Instagram</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
