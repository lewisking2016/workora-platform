'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase,
  SquaresFour, 
  UserCircle, 
  Storefront, 
  CaretRight,
  ShieldCheck,
  Lightning,
  Globe,
  Devices
} from '@phosphor-icons/react';

export default function PlatformPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white text-zinc-950 overflow-x-hidden font-display">
      
      {/* Platform Hero */}
      <section className="relative h-[60vh] w-full mt-4 rounded-[60px] overflow-hidden group bg-white border border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cube.png')] opacity-[0.03]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[800px]"
          >
            <div className="h-16 w-16 rounded-3xl bg-zinc-50 shadow-sm flex items-center justify-center mb-8 border border-zinc-100">
              <SquaresFour size={32} weight="duotone" className="text-[#0066FF]" />
            </div>
            <p className="text-[#0066FF] font-black uppercase tracking-[0.3em] text-[10px] mb-6">Unified Ecosystem</p>
            <h1 className="text-7xl font-black tracking-tighter text-zinc-950 mb-8 leading-[1.1]">
              One platform. <br />
              Unlimited potential.
            </h1>
            <p className="text-zinc-600 text-xl mb-10 leading-relaxed max-w-2xl font-medium">
              Workora is more than a marketplace. It&apos;s a digital infrastructure built to empower Africa&apos;s workforce and simplify service delivery for everyone.
            </p>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#0066FF]/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#7000FF]/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </section>

      {/* Platform Features Grid */}
      <section className="py-32 px-[5%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: ShieldCheck, title: "Secure", desc: "Enterprise-grade security for all transactions and data." },
          { icon: Lightning, title: "Fast", desc: "Instant matching and real-time communication." },
          { icon: Globe, title: "Scalable", desc: "Designed to grow with your business needs across borders." },
          { icon: Devices, title: "Multi-device", desc: "Accessible from mobile, web, and tablet seamlessly." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-white border border-zinc-100 hover:shadow-xl transition-all group"
          >
            <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-950 mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
              <item.icon size={24} weight="bold" />
            </div>
            <h3 className="text-xl font-black mb-3">{item.title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Choice Sections: Personal vs Business */}
      <section className="py-20 px-[5%] mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Business Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden p-16 rounded-[60px] bg-zinc-50 text-zinc-950 flex flex-col h-full border border-zinc-100"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Storefront size={200} weight="fill" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="h-14 w-14 rounded-2xl bg-[#7000FF] flex items-center justify-center mb-10 shadow-lg shadow-[#7000FF]/20 text-white">
                <Briefcase size={28} weight="bold" />
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-6">I have the skills</h2>
              <p className="text-zinc-500 text-lg mb-12 font-medium leading-relaxed max-w-md">
                Post your work, showcase your expertise through video content, and connect with clients looking for professional services.
              </p>
              
              <div className="mt-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-3 h-14 px-10 bg-[#7000FF] text-white rounded-xl font-black text-base hover:shadow-[0_20px_50px_-10px_rgba(112,0,255,0.4)] transition-all shadow-xl shadow-[#7000FF]/20 whitespace-nowrap"
                  >
                    Create Pro Profile <CaretRight weight="bold" size={20} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Personal Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden p-16 rounded-[60px] bg-zinc-50 text-zinc-950 flex flex-col h-full border border-zinc-100"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <UserCircle size={200} weight="fill" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="h-14 w-14 rounded-2xl bg-[#0066FF] flex items-center justify-center mb-10 shadow-lg shadow-[#0066FF]/20 text-white">
                <UserCircle size={28} weight="bold" />
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-6">I need a service</h2>
              <p className="text-zinc-500 text-lg mb-12 font-medium leading-relaxed max-w-md">
                Find the right expert for any task. Browse verified professionals, watch proof-of-work videos, and hire with total confidence.
              </p>
              
              <div className="mt-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-3 h-14 px-10 bg-[#0066FF] text-white rounded-xl font-black text-base hover:shadow-[0_20px_50px_-10px_rgba(0,102,255,0.4)] transition-all shadow-xl shadow-[#0066FF]/20 whitespace-nowrap"
                  >
                    Create Client Account <CaretRight weight="bold" size={20} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-100 flex flex-col items-center gap-8">
        <Link href="/" className="relative h-12 w-12 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center">
           <div className="h-8 w-8 bg-black rounded-full" />
        </Link>
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">© 2026 Workora Platform</p>
      </footer>

    </main>
  );
}
