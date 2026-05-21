'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeSimple, 
  Phone,
  MapPin,
  PaperPlaneRight,
  ChatTeardropText,
  Globe
} from '@phosphor-icons/react';

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white dark:bg-[#0A0E17] text-zinc-950 dark:text-zinc-50 overflow-x-hidden font-display min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[400px] w-full mt-4 rounded-[60px] overflow-hidden group bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
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
              <ChatTeardropText size={40} weight="duotone" className="text-[#0066FF]" />
            </motion.div>
            
            <p className="text-[#0066FF] font-black uppercase tracking-[0.4em] text-[11px] mb-8">Get In Touch</p>
            
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white mb-10 leading-[0.95]">
              Let&apos;s <span className="italic text-[#0066FF]">talk.</span>
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              Have a question, partnership inquiry, or just want to say hello? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 lg:py-32 px-[5%] flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left: Contact Info */}
        <div className="flex-1 flex flex-col gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-950 dark:text-white mb-6">Contact Information</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium leading-relaxed">
              Reach out to us through any of the channels below and our team will respond within 24 hours.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {[
              { icon: EnvelopeSimple, label: 'Email', value: 'info@imeantech.com', href: 'mailto:info@imeantech.com' },
              { icon: Phone, label: 'Phone', value: '+254 114 971 070', href: 'tel:+254114971070' },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', href: '#' },
              { icon: Globe, label: 'Website', value: 'imeantech.com', href: 'https://imeantech.com' },
            ].map((item) => (
              <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} className="flex items-center gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:border-[#0066FF]/30 transition-colors">
                  <item.icon size={26} weight="duotone" className="text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{item.label}</p>
                  <p className="font-bold text-zinc-950 dark:text-white group-hover:text-[#0066FF] transition-colors">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[24px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Support Status</span>
            </div>
            <p className="font-bold text-zinc-950 dark:text-white">We&apos;re online and ready to help.</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">Average response time: under 24 hours</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 w-full">
          <form className="bg-zinc-50 dark:bg-zinc-900 p-8 lg:p-12 rounded-[40px] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] dark:shadow-black/40">
            <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white mb-2">Send us a message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Name</label>
                <input type="text" placeholder="Your full name" className="h-14 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 outline-none focus:ring-4 ring-[#0066FF]/5 dark:ring-[#0066FF]/10 text-zinc-950 dark:text-white font-medium transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Email</label>
                <input type="email" placeholder="your@email.com" className="h-14 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 outline-none focus:ring-4 ring-[#0066FF]/5 dark:ring-[#0066FF]/10 text-zinc-950 dark:text-white font-medium transition-all" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Subject</label>
              <input type="text" placeholder="How can we help?" className="h-14 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 outline-none focus:ring-4 ring-[#0066FF]/5 dark:ring-[#0066FF]/10 text-zinc-950 dark:text-white font-medium transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Message</label>
              <textarea placeholder="Tell us more..." rows={5} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-6 outline-none focus:ring-4 ring-[#0066FF]/5 dark:ring-[#0066FF]/10 text-zinc-950 dark:text-white font-medium transition-all resize-none"></textarea>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="h-14 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#0066FF]/20 transition-all whitespace-nowrap"
            >
              Send Message <PaperPlaneRight weight="bold" size={20} />
            </motion.button>
          </form>
        </div>
      </section>
    </main>
  );
}
