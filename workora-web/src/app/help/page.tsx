'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Question, 
  ChatTeardropText, 
  EnvelopeSimple, 
  Phone, 
  MagnifyingGlass,
  Plus,
  Minus,
  PaperPlaneRight,
  ShieldCheck,
  UserCircle,
  Briefcase
} from '@phosphor-icons/react';

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      category: "For Pros (Artisans)",
      icon: Briefcase,
      questions: [
        { q: "How do I create a Pro profile?", a: "Go to the Business page and click 'Create Pro Profile'. You will need to provide your ID and proof-of-work videos." },
        { q: "What is the Trust Passport?", a: "The Trust Passport is your digital identity on Workora. It showcases your verified skills, ID, and customer reviews." },
        { q: "How do I get paid?", a: "Payments are made via our secure escrow system. Once the client confirms work is done, funds are released to your wallet." }
      ]
    },
    {
      category: "For Clients",
      icon: UserCircle,
      questions: [
        { q: "How do I find a verified master?", a: "Use the search bar on the Home or Explore page. Look for the 'Verified' badge and Trust Passport details." },
        { q: "Is my payment safe?", a: "Yes. Workora uses an escrow system. Your money is only released to the Pro after you approve the completed work." },
        { q: "What if the work is not done correctly?", a: "You can open a dispute through the 'Dispute Resolution' section in your account dashboard." }
      ]
    },
    {
      category: "Safety & Privacy",
      icon: ShieldCheck,
      questions: [
        { q: "How do you verify professionals?", a: "We conduct multi-layer checks including ID verification, technical skill assessments, and previous work history audits." },
        { q: "Is my data private?", a: "Absolutely. We encrypt all sensitive data and never share it with third parties without your consent." }
      ]
    }
  ];

  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white text-zinc-950 overflow-x-hidden font-display">
      
      {/* Help Hero */}
      <section className="relative h-[55vh] w-full mt-4 rounded-[60px] overflow-hidden group bg-white border border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0066FF]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#7000FF]/5 blur-[120px] rounded-full" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center max-w-[900px]"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-20 w-20 rounded-[32px] bg-zinc-50 shadow-inner flex items-center justify-center mb-10 border border-zinc-100"
            >
              <Question size={40} weight="duotone" className="text-[#0066FF]" />
            </motion.div>
            
            <p className="text-[#0066FF] font-black uppercase tracking-[0.4em] text-[11px] mb-8">Workora Concierge</p>
            
            <h1 className="text-[80px] font-black tracking-tighter text-zinc-950 mb-10 leading-[0.95]">
              How can we <br />
              <span className="italic text-[#0066FF]">assist</span> you?
            </h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full max-w-xl group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0066FF]/20 to-[#7000FF]/20 rounded-[24px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <MagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0066FF] transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search for articles, guides, or keywords..." 
                  className="h-16 w-full bg-white border border-zinc-200 rounded-[22px] pl-16 pr-8 text-lg font-medium outline-none focus:border-[#0066FF] transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]"
                />
              </div>
            </motion.div>
            
            <div className="flex gap-8 mt-10">
              <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live Status: Operational
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-32 px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-1">
             <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Frequently Asked <br /> Questions.</h2>
             <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-12">
               Find quick answers to common questions about accounts, payments, and platform safety.
             </p>
             <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <ChatTeardropText size={32} weight="duotone" className="text-[#0066FF]" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Live Support</p>
                    <p className="font-bold">Available 24/7</p>
                  </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-12">
             {faqs.map((cat, idx) => (
               <div key={idx} className="flex flex-col gap-6">
                 <div className="flex items-center gap-3 mb-2">
                   <cat.icon size={24} weight="bold" className="text-[#0066FF]" />
                   <h3 className="text-xl font-black uppercase tracking-widest text-zinc-950">{cat.category}</h3>
                 </div>
                 <div className="flex flex-col gap-4">
                   {cat.questions.map((faq, fIdx) => {
                     const isOpened = openFaq === (idx * 10 + fIdx);
                     return (
                       <div key={fIdx} className="border-b border-zinc-100 pb-4">
                         <button 
                           onClick={() => setOpenFaq(isOpened ? null : idx * 10 + fIdx)}
                           className="w-full flex items-center justify-between text-left group"
                         >
                           <span className={`text-lg font-bold transition-colors ${isOpened ? 'text-[#0066FF]' : 'text-zinc-700 group-hover:text-zinc-950'}`}>{faq.q}</span>
                           {isOpened ? <Minus weight="bold" /> : <Plus weight="bold" />}
                         </button>
                         {isOpened && (
                           <motion.div 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className="pt-4 text-zinc-500 font-medium leading-relaxed"
                           >
                             {faq.a}
                           </motion.div>
                         )}
                       </div>
                     );
                   })}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 bg-zinc-50 rounded-[80px] mx-[2%] px-[10%] flex flex-col lg:flex-row items-start gap-24 overflow-hidden relative border border-zinc-100 mb-40">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        <div className="flex-1 z-10">
          <h2 className="text-6xl font-black tracking-tighter text-zinc-950 mb-8 leading-tight">
            Still have <br />
            <span className="text-[#0066FF]">Questions?</span>
          </h2>
          <p className="text-zinc-600 text-xl mb-12 leading-relaxed">
            If you couldn&apos;t find what you were looking for, send us a message and our support team will get back to you within 24 hours.
          </p>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                <EnvelopeSimple size={24} weight="duotone" className="text-[#0066FF]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Email Us</p>
                <p className="font-bold">info@imeantech.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                <Phone size={24} weight="duotone" className="text-[#0066FF]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Call Us</p>
                <p className="font-bold">+254 114 971 070</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full z-10">
          <form className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-zinc-100 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-1">Name</label>
                <input type="text" placeholder="John Doe" className="h-14 w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 outline-none focus:ring-4 ring-[#0066FF]/5 font-medium transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                <input type="email" placeholder="john@example.com" className="h-14 w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 outline-none focus:ring-4 ring-[#0066FF]/5 font-medium transition-all" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-1">Subject</label>
              <input type="text" placeholder="How can we help?" className="h-14 w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 outline-none focus:ring-4 ring-[#0066FF]/5 font-medium transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-1">Message</label>
              <textarea placeholder="Tell us more about your issue..." rows={4} className="w-full bg-zinc-50 border border-zinc-100 rounded-3xl p-6 outline-none focus:ring-4 ring-[#0066FF]/5 font-medium transition-all resize-none"></textarea>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="h-14 w-full bg-[#0066FF] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#0066FF]/20 transition-all whitespace-nowrap"
            >
              Send Message <PaperPlaneRight weight="bold" />
            </motion.button>
          </form>
        </div>
      </section>

      <footer className="py-20 border-t border-zinc-100 flex flex-col items-center gap-8">
        <Link href="/" className="relative h-12 w-12 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center">
           <div className="h-8 w-8 bg-black rounded-full" />
        </Link>
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">© 2026 Workora Help Center</p>
      </footer>

    </main>
  );
}
