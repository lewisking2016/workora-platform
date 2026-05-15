'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  House,
  ShieldCheck,
  Eye,
  EyeSlash
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { EliteErrorCard } from '@/components/EliteErrorCard';
import WorkoraLoader from '@/components/WorkoraLoader';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) return;
    
    setLoading(true);
    setAuthError(null);
    try {
      // Artificial delay to showcase the 3-stage loading animation (4 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('The credentials provided do not match our records. Please verify your phone number or password.');
      }

      // Store Auth Data
      localStorage.setItem('workora_token', data.token);
      localStorage.setItem('workora_user', JSON.stringify(data.user));

      // Redirect to Dashboard
      window.location.href = '/dashboard/feed';
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'The credentials provided do not match our records. Please verify your phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-display relative overflow-hidden">
      
      {/* 0. Fullscreen Loader overlay */}
      {loading && <WorkoraLoader fullScreen />}
      
      {/* 1. Cinematic Left Side (1:1 Image Strategy) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center p-12">
        <div className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-white/5">
          <Image 
            src="/login images/workora login.png"
            alt="Workora Cinematic"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {/* Deep Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 left-12 z-10"
          >
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">
              See everyday moments <br />
              from your <span className="bg-gradient-to-r from-[#0066FF] to-[#7000FF] bg-clip-text text-transparent italic">local pros.</span>
            </h1>
            <div className="mt-6 flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">
               <div className="h-px w-8 bg-white/20" />
               Verified by ImeanTech Trust Systems
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. Elite Gateway Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-[5%] relative bg-white">
        
        {/* Navigation Portal */}
        <div className="absolute top-8 left-8 lg:left-auto lg:right-12 flex items-center gap-4">
           <Link href="/" className="h-12 w-12 bg-zinc-50 border border-zinc-100 text-zinc-950 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
              <House size={20} weight="fill" />
           </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[360px] flex flex-col items-center"
        >
          {/* Header Branding */}
          <div className="mb-12">
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
          </div>

          {/* CUSTOM ERROR GATEWAY */}
          <EliteErrorCard 
            message={authError} 
            onClose={() => setAuthError(null)} 
          />

          <div className="flex flex-col gap-2 text-center mb-10">
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 leading-none">Log into Workora</h2>
            <p className="text-zinc-500 font-bold text-sm">WELCOME BACK TO THE ELITE TRUST NETWORK.</p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Phone number, username or email"
                className="h-12 w-full rounded-xl bg-zinc-50 border border-zinc-200 px-4 outline-none focus:bg-white focus:border-[#0066FF] transition-all font-bold text-xs text-zinc-950"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setAuthError(null);
                }}
              />
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-12 w-full rounded-xl bg-zinc-50 border border-zinc-200 px-4 outline-none focus:bg-white focus:border-[#0066FF] transition-all font-bold text-xs text-zinc-950"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setAuthError(null);
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                </button>
              </div>
            </div>

            <motion.button 
              disabled={!formData.phone || !formData.password || loading}
              onClick={handleLogin}
              animate={formData.phone && formData.password ? {
                boxShadow: [
                  "0 10px 20px -5px rgba(0, 102, 255, 0.3)",
                  "0 10px 40px 0px rgba(0, 102, 255, 0.6)",
                  "0 10px 20px -5px rgba(0, 102, 255, 0.3)"
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-12 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-50 transition-all mt-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Log in"
              )}
            </motion.button>

            <div className="flex flex-col gap-3 mt-6 items-center">
               <Link href="/forgot" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">
                 Forgot password?
               </Link>
               <Link href="/forgot" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">
                 Forgot account username?
               </Link>
            </div>
          </div>

          <div className="w-full mt-12 pt-12 border-t border-zinc-100 flex flex-col gap-8">
             <Link href="/join" className="h-12 w-full border border-zinc-200 rounded-full flex items-center justify-center text-xs font-black text-zinc-950 hover:bg-zinc-50 transition-colors shadow-sm">
               Create new account
             </Link>
             <div className="flex items-center justify-center gap-2 text-zinc-300 font-black tracking-tight text-[10px] uppercase tracking-[0.2em]">
               <ShieldCheck size={16} weight="fill" /> Secured by ImeanTech Trust
             </div>
          </div>
        </motion.div>

        {/* Support Links Footer */}
        <div className="mt-20 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
           <Link href="#" className="hover:text-zinc-950 transition-colors">ImeanTech</Link>
           <Link href="#" className="hover:text-zinc-950 transition-colors">About</Link>
           <Link href="#" className="hover:text-zinc-950 transition-colors">Blog</Link>
           <Link href="#" className="hover:text-zinc-950 transition-colors">Help</Link>
           <Link href="#" className="hover:text-zinc-950 transition-colors">Privacy</Link>
           <Link href="#" className="hover:text-zinc-950 transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  );
}
