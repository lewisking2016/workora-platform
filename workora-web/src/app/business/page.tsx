'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  ChartLineUp, 
  CaretRight,
  ShieldCheck,
  Globe,
  IdentificationBadge,
  ArrowRight
} from '@phosphor-icons/react';

export default function BusinessPage() {
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
            className="flex flex-col items-start text-left max-w-[800px]"
          >
            <p className="text-[#7000FF] font-black uppercase tracking-[0.3em] text-[10px] mb-8">For the Masters of Craft</p>
            <h1 className="text-7xl font-black tracking-tighter text-zinc-950 mb-8 leading-[1.1]">
              Post your work. <br />
              Grow your business.
            </h1>
            <p className="text-zinc-600 text-xl mb-10 leading-relaxed max-w-md font-medium">
              Create a professional profile, showcase your skills through video content, and connect directly with clients looking for your expertise.
            </p>
            <div className="flex gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/login" 
                  className="group/btn h-14 px-10 bg-[#7000FF] text-white rounded-2xl font-black text-base flex items-center justify-center transition-all shadow-[0_10px_30px_-5px_rgba(112,0,255,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(112,0,255,0.4)] whitespace-nowrap"
                >
                  Create Pro Profile <CaretRight weight="bold" size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Pillars */}
      <section className="py-32 px-[5%] grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            icon: Users,
            title: "Build Your Reputation",
            desc: "Use your Trust Passport to show clients you're verified, skilled, and reliable.",
            color: "text-[#7000FF]"
          },
          {
            icon: ShieldCheck,
            title: "Verification Badges",
            desc: "Get certified for your technical skills and stand out from the crowd.",
            color: "text-[#0066FF]"
          },
          {
            icon: ChartLineUp,
            title: "Client Leads",
            desc: "Directly connect with clients looking for masters in construction, tech, and craft.",
            color: "text-[#00C2FF]"
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

      {/* Enterprise Solutions Section */}
      <section className="py-32 bg-zinc-50 rounded-[80px] mx-[2%] px-[10%] flex flex-col lg:flex-row-reverse items-center gap-24 overflow-hidden relative border border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        <div className="flex-1 z-10">
          <h2 className="text-6xl font-black tracking-tighter text-zinc-950 mb-8 leading-tight">
            Built for <br />
            <span className="text-[#7000FF]">Real Masters.</span>
          </h2>
          <p className="text-zinc-600 text-xl mb-12 leading-relaxed">
            Workora gives you the tools to manage your clients, showcase high-definition proof of work, and handle payments securely.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { icon: IdentificationBadge, text: "Digital Identity" },
              { icon: Globe, text: "Marketplace Access" },
              { icon: Briefcase, text: "Secure Payments" },
              { icon: ShieldCheck, text: "Skill Certification" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-zinc-950 font-bold bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                <item.icon size={24} className="text-[#7000FF]" weight="bold" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative w-full aspect-video">
           <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden border border-zinc-100 shadow-2xl bg-white flex items-center justify-center">
              <div className="text-center">
                 <p className="text-zinc-950 font-black text-6xl mb-4 tracking-tighter">1,000+</p>
                 <p className="text-[#7000FF] text-lg font-bold uppercase tracking-widest">Verified Professionals</p>
              </div>
           </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-40 px-[5%]">
        <div className="bg-white rounded-[80px] p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden border border-zinc-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[#7000FF]/5 -skew-x-12 -translate-x-20" />
          <div className="relative z-10 text-zinc-950 lg:max-w-xl">
            <h2 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
              Start your pro <br />
              journey today.
            </h2>
            <p className="text-zinc-600 text-xl font-medium leading-relaxed">
              Join the network of the most trusted artisans in Africa. Turn your skills into a thriving digital business.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/login" 
                className="h-14 px-10 bg-[#7000FF] text-white rounded-xl font-black text-base flex items-center justify-center transition-all shadow-xl shadow-[#7000FF]/20 whitespace-nowrap"
              >
                Create Pro Account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/help" 
                className="h-14 px-10 bg-white border-2 border-zinc-100 text-zinc-950 rounded-xl font-black text-base flex items-center justify-center transition-all hover:bg-zinc-50 whitespace-nowrap"
              >
                Learn More <ArrowRight className="ml-2" weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-zinc-100 flex flex-col items-center gap-8">
        <Link href="/" className="relative h-12 w-12 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center">
           <div className="h-8 w-8 bg-black rounded-full" />
        </Link>
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">© 2026 Workora Business</p>
      </footer>

    </main>
  );
}
