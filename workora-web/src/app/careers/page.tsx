'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Rocket,
  Heart,
  GlobeHemisphereWest,
  HandHeart,
  Lightning,
  ArrowRight,
  EnvelopeSimple
} from '@phosphor-icons/react';

export default function CareersPage() {
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
            
            <p className="text-[#0066FF] font-black uppercase tracking-[0.4em] text-[11px] mb-8">Volunteer With Us</p>
            
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white mb-10 leading-[0.95]">
              Shape the <br />
              <span className="italic text-[#0066FF]">future of work.</span>
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              We&apos;re a startup building something meaningful. Join our volunteer team and help empower Africa&apos;s informal workforce — one craftsman at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-20 lg:py-32 px-[5%]">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none mb-6">Why volunteer with Workora?</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            This isn&apos;t just volunteering — it&apos;s building a movement from the ground up.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Heart, title: 'Make Real Impact', desc: 'Your contribution directly affects the lives of thousands of skilled workers across Africa.' },
            { icon: Lightning, title: 'Gain Experience', desc: 'Work on a real product with a passionate team. Perfect for building your portfolio.' },
            { icon: GlobeHemisphereWest, title: 'Be Part of a Mission', desc: 'Help build the digital trust infrastructure for Africa\'s largest untapped workforce.' },
            { icon: HandHeart, title: 'Community First', desc: 'We especially welcome female volunteers to bring diverse perspectives to our platform.' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-50 dark:bg-zinc-900 p-8 lg:p-10 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700 text-[#0066FF]">
                <item.icon size={28} weight="duotone" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Volunteer Roles */}
      <section className="py-20 lg:py-32 bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] mx-[2%] px-[5%] lg:px-[10%] border border-zinc-100 dark:border-zinc-800">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-zinc-800 text-[#0066FF] text-[11px] font-black uppercase tracking-[0.2em] border border-zinc-100 dark:border-zinc-700 mb-8 mx-auto">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Now Accepting Volunteers
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none mb-6">Join the team.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            We&apos;re looking for passionate individuals who believe in our mission. No experience required — just heart and dedication.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {[
            { role: 'Community Ambassador', type: 'Volunteer · Remote', desc: 'Help spread the word about Workora in your local community and onboard new artisans.' },
            { role: 'Content Creator', type: 'Volunteer · Remote', desc: 'Create compelling social media content that tells the stories of Africa\'s skilled workers.' },
            { role: 'UX Research Volunteer', type: 'Volunteer · Remote / On-site', desc: 'Conduct user interviews and usability testing with artisans and clients.' },
            { role: 'Operations Support', type: 'Volunteer · On-site (Nairobi)', desc: 'Assist with day-to-day operations, onboarding events, and artisan verification.' },
          ].map((role, i) => (
            <motion.div
              key={role.role}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#0A0E17] p-8 rounded-[24px] border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 transition-transform duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-black/40"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">{role.role}</h3>
                <p className="text-[#0066FF] font-bold text-xs uppercase tracking-wider">{role.type}</p>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm mt-1">{role.desc}</p>
              </div>
              <Link
                href="mailto:careers@imeantech.com"
                className="h-11 px-8 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center whitespace-nowrap hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                Apply <ArrowRight weight="bold" className="ml-2" size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-40 px-[5%]">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] p-8 lg:p-24 flex flex-col items-center text-center gap-8 lg:gap-12 relative overflow-hidden border border-zinc-100 dark:border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/5 to-transparent" />
          <h2 className="text-4xl md:text-6xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white relative z-10 leading-[0.9]">
            Don&apos;t see a fit?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed relative z-10">
            We&apos;re always looking for passionate people. Send us your resume or portfolio and tell us how you&apos;d like to contribute.
          </p>
          <Link 
            href="mailto:careers@imeantech.com"
            className="group/btn h-14 px-10 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-2xl font-black text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10 whitespace-nowrap"
          >
            <EnvelopeSimple weight="bold" size={20} className="mr-2" /> careers@imeantech.com
          </Link>
        </div>
      </section>
    </main>
  );
}
