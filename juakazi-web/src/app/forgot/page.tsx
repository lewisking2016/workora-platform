'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CaretLeft,
  UserCircle
} from '@phosphor-icons/react';
import LinkNext from 'next/link';

export default function ForgotPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFindAccount = async () => {
    setLoading(true);
    // Simulate real backend check
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col items-center pt-20 px-[5%] overflow-x-hidden font-display relative pb-32">
      
      {/* Header Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <LinkNext href="/login" className="relative h-12 w-12 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 mx-auto">
          <CaretLeft size={24} weight="bold" className="text-zinc-950" />
        </LinkNext>
      </motion.div>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-950">Find your account</h1>
            <p className="text-zinc-500 font-bold text-sm">
              Enter your mobile number, username or email. <LinkNext href="#" className="text-[#0066FF]">Can&apos;t reset your password?</LinkNext>
            </p>
          </div>

          {!success ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Mobile number, username or email"
                  className="h-12 w-full rounded-xl bg-zinc-50 border border-zinc-200 px-4 outline-none focus:bg-white focus:border-[#0066FF] transition-all font-medium text-sm text-zinc-950"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <p className="text-[10px] text-zinc-400 font-bold leading-relaxed px-2">
                  You may receive WhatsApp and SMS notifications from us for security and login purposes.
                </p>
              </div>

              <button 
                disabled={!identifier || loading}
                onClick={handleFindAccount}
                className="h-12 w-full bg-[#0066FF] text-white rounded-full font-black text-sm flex items-center justify-center gap-4 disabled:opacity-50 transition-all shadow-lg shadow-[#0066FF]/20"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 text-center py-8">
               <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto border border-zinc-100">
                  <UserCircle size={48} weight="duotone" className="text-[#0066FF]" />
               </div>
               <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-black tracking-tight">Check your device</h2>
                  <p className="text-sm text-zinc-500 font-bold">We&apos;ve sent a security link to the mobile number associated with {identifier}.</p>
               </div>
               <LinkNext href="/login" className="text-sm font-black text-[#0066FF] hover:underline">
                  Back to Log In
               </LinkNext>
            </div>
          )}
        </motion.div>

        {/* Footer Meta Style Links */}
        <div className="mt-40 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
           <LinkNext href="#">ImeanTech</LinkNext>
           <LinkNext href="#">About</LinkNext>
           <LinkNext href="#">Blog</LinkNext>
           <LinkNext href="#">Jobs</LinkNext>
           <LinkNext href="#">Help</LinkNext>
           <LinkNext href="#">API</LinkNext>
           <LinkNext href="#">Privacy</LinkNext>
           <LinkNext href="#">Terms</LinkNext>
           <LinkNext href="#">Locations</LinkNext>
        </div>
        <div className="mt-8 text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] text-center">
           © 2026 JuaKazi Platform from ImeanTech
        </div>
      </div>
    </div>
  );
}
