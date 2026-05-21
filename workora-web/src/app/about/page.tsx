'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Globe, 
  Heart,
  Lightning,
  Users,
  Target,
  ArrowRight,
  Handshake
} from '@phosphor-icons/react';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white dark:bg-[#0A0E17] text-zinc-950 dark:text-zinc-50 overflow-x-hidden font-display min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[500px] w-full mt-4 rounded-[60px] overflow-hidden group bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#0066FF]/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#7000FF]/10 blur-[150px] rounded-full" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[900px]"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-20 w-20 rounded-[32px] bg-zinc-50 dark:bg-zinc-800 shadow-inner flex items-center justify-center mb-10 border border-zinc-100 dark:border-zinc-700"
            >
              <Rocket size={40} weight="duotone" className="text-[#0066FF]" />
            </motion.div>
            
            <p className="text-[#0066FF] font-black uppercase tracking-[0.4em] text-[11px] mb-8">Our Story</p>
            
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white mb-10 leading-[0.95]">
              Empowering Africa&apos;s <br />
              <span className="italic text-[#0066FF]">craftsmen.</span>
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              Workora is on a mission to formalize Africa&apos;s informal workforce by giving every skilled professional a verifiable digital identity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-32 px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 lg:p-16 rounded-[40px] lg:rounded-[56px] flex flex-col gap-8"
        >
          <div className="h-16 w-16 rounded-3xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
            <Target size={32} weight="duotone" className="text-[#0066FF]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 dark:text-white">Our Mission</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
            To build the digital infrastructure that connects Africa&apos;s 300 million informal workers with opportunities through verified skills, transparent reputation, and a system of trust that replaces traditional gatekeepers.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 lg:p-16 rounded-[40px] lg:rounded-[56px] flex flex-col gap-8"
        >
          <div className="h-16 w-16 rounded-3xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
            <Globe size={32} weight="duotone" className="text-[#7000FF]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 dark:text-white">Our Vision</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
            A world where every skilled professional, regardless of formal education or background, can build a verifiable, portable reputation that opens doors to economic opportunity and financial inclusion.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] mx-[2%] px-[5%] lg:px-[10%] border border-zinc-100 dark:border-zinc-800">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none mb-6">What drives us.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Our core values define how we build, operate, and serve our community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Heart, title: 'Empathy First', desc: 'We deeply understand the challenges faced by Africa\'s informal workers and build with them in mind.', color: 'text-red-500' },
            { icon: Lightning, title: 'Radical Trust', desc: 'We believe transparency and verification can replace traditional gatekeeping systems.', color: 'text-[#0066FF]' },
            { icon: Users, title: 'Community Led', desc: 'Our platform is shaped by the artisans, clients, and communities we serve.', color: 'text-[#7000FF]' },
            { icon: Handshake, title: 'African Pride', desc: 'We celebrate the incredible skill and resilience of Africa\'s workforce.', color: 'text-green-500' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#0A0E17] p-8 lg:p-10 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-black/40"
            >
              <div className={`h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 ${item.color}`}>
                <item.icon size={28} weight="duotone" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Parent Company */}
      <section className="py-20 lg:py-32 px-[5%] flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 dark:bg-zinc-900 text-[#0066FF] text-[11px] font-black uppercase tracking-[0.2em] border border-zinc-100 dark:border-zinc-800">
          Parent Company
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none">
          Built by <span className="italic text-[#0066FF]">ImeanTech.</span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
          Workora is a product of ImeanTech, a technology company focused on building digital solutions that empower underserved communities across Africa. We believe technology should serve everyone — not just the privileged few.
        </p>
        <Link 
          href="https://imeantech.com"
          target="_blank"
          className="group/btn h-14 px-10 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-2xl font-black text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
        >
          Visit ImeanTech <ArrowRight weight="bold" size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-40 px-[5%]">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] p-8 lg:p-24 flex flex-col items-center text-center gap-8 lg:gap-12 relative overflow-hidden border border-zinc-100 dark:border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 to-transparent" />
          <h2 className="text-4xl md:text-6xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white relative z-10 leading-[0.9]">
            Join the <br />
            movement.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full max-w-xl">
            <Link 
              href="/join" 
              className="h-14 flex-1 flex items-center justify-center bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-xl font-black text-xl hover:scale-105 hover:brightness-110 transition-all shadow-xl shadow-[#7000FF]/20 whitespace-nowrap"
            >
              Join as a Pro
            </Link>
            <Link 
              href="/careers" 
              className="h-14 flex-1 flex items-center justify-center bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 text-zinc-950 dark:text-white rounded-xl font-black text-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all whitespace-nowrap"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
