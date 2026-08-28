'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  House,
  ShieldCheck,
  Eye,
  EyeSlash,
  Check
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { EliteErrorCard } from '@/components/EliteErrorCard';
import WorkoraLoader from '@/components/WorkoraLoader';
import { fetchCurrentUser, persistLegacySession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      if (!user) {
        // Explicitly clear session storage/localstorage to avoid loops
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('workora_user');
          window.localStorage.removeItem('workora_username');
          window.localStorage.removeItem('workora_role');
        }
        return;
      }

      window.location.href = user.role === 'hirer' ? '/dashboard/feed' : '/dashboard/pro';
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const normalizeIdentifier = (raw: string) => {
    const value = raw.trim();
    // Kenyan local format 07XXXXXXXX → +2547XXXXXXXX
    if (/^0[17]\d{8}$/.test(value)) {
      return `+254${value.slice(1)}`;
    }
    // Bare 7XXXXXXXX without country code
    if (/^[17]\d{8}$/.test(value)) {
      return `+254${value}`;
    }
    return value;
  };

  const handleLogin = async () => {
    const identifier = normalizeIdentifier(formData.identifier);
    if (!identifier || !formData.password) return;
    
    setLoading(true);
    setLoadingStartTime(Date.now());
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          identifier,
          phone_number: identifier,
          password: formData.password,
          rememberMe: rememberMe
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend error message inline so user sees exact reason (disabled, locked, etc.)
        const message = String(data?.message || data?.error || data?.code || 'Invalid credentials');
        setAuthError(message);
        return;
      }

      // Persist user + JWT so dashboard /auth/me works even if Set-Cookie is dropped by the host
      persistLegacySession(
        {
          id: String(data.user?.id || ''),
          username: String(data.user?.username || ''),
          role: String(data.user?.role || 'worker'),
        },
        data.token ? String(data.token) : undefined
      );

      const nextRoute = String(data.user?.role || 'worker') === 'hirer' ? '/dashboard/feed' : '/dashboard/pro';
      window.location.href = nextRoute;
    } catch (err: unknown) {
      router.push('/auth/error/network_error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E17] flex flex-col lg:flex-row font-display relative overflow-hidden">
      
      {/* 0. Fullscreen Loader overlay */}
      {loading && <WorkoraLoader fullScreen startTime={loadingStartTime} />}
      
      {/* 1. Cinematic Left Side (1:1 Image Strategy) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center p-12">
        <div className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(0,102,255,0.35),_transparent_38%),radial-gradient(circle_at_80%_20%,_rgba(0,102,255,0.3),_transparent_30%),linear-gradient(145deg,_#050816,_#0b1020_45%,_#111827)]">
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_55%)]" />
          <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-[#0066FF]/20 blur-3xl" />
          <div className="absolute -right-8 bottom-12 h-64 w-64 rounded-full bg-[#0066FF]/20 blur-3xl" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[28rem] w-[28rem] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="absolute inset-10 rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_62%)]" />
              <div className="absolute inset-24 rounded-full border border-white/10 bg-[linear-gradient(145deg,_rgba(0,102,255,0.16),_rgba(0,82,204,0.18))]" />
              <div className="absolute inset-36 rounded-full bg-gradient-to-br from-[#0066FF] opacity-35 blur-2xl" />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 left-12 z-10 max-w-[24rem]"
          >
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">
              See everyday moments <br />
              from your <span className="bg-[#0066FF] bg-clip-text text-transparent italic">local pros.</span>
            </h1>
            <div className="mt-6 flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">
               <div className="h-px w-8 bg-white/20" />
               Verified by ImeanTech Trust Systems
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. Elite Gateway Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-[5%] relative bg-white dark:bg-[#0A0E17]">
        
        {/* Navigation Portal */}
        <div className="absolute top-8 left-8 lg:left-auto lg:right-12 flex items-center gap-4">
           <Link href="/" className="h-12 w-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-950 dark:text-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
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
                  sizes="80px"
                  className="object-contain brightness-0 dark:invert"
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
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">Log into Workora</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">WELCOME BACK TO THE ELITE TRUST NETWORK.</p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Phone number, username or email"
                className="h-12 w-full rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#0066FF] transition-all font-bold text-xs text-zinc-950 dark:text-white dark:placeholder-zinc-500"
                value={formData.identifier}
                onChange={(e) => {
                  setFormData({ ...formData, identifier: e.target.value });
                  setAuthError(null);
                }}
              />
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-12 w-full rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#0066FF] transition-all font-bold text-xs text-zinc-950 dark:text-white dark:placeholder-zinc-500"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setAuthError(null);
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 rounded-[6px] checked:border-[#0066FF] checked:bg-[#0066FF] transition-all cursor-pointer"
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                  <Check size={12} weight="bold" />
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                Remember me for 30 days
              </span>
            </label>

            <motion.button 
              disabled={!formData.identifier.trim() || !formData.password || loading}
              onClick={handleLogin}
              animate={formData.identifier.trim() && formData.password ? {
                boxShadow: [
                  "0 10px 20px -5px rgba(0, 102, 255, 0.3)",
                  "0 10px 40px 0px rgba(0, 102, 255, 0.6)",
                  "0 10px 20px -5px rgba(0, 102, 255, 0.3)"
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-12 w-full bg-[#0066FF] text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-50 transition-all mt-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Log in"
              )}
            </motion.button>

            <div className="flex flex-col gap-3 mt-6 items-center">
               <Link href="/forgot" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                 Forgot password?
               </Link>
               <Link href="/forgot" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                 Forgot account username?
               </Link>
            </div>
          </div>

          <div className="w-full mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-8">
             <Link href="/join" className="h-12 w-full border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-xs font-black text-zinc-950 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm">
               Create new account
             </Link>
             <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">
               <ShieldCheck size={16} weight="fill" /> Secured by ImeanTech Trust
             </div>
          </div>
        </motion.div>

        {/* Support Links Footer */}
        <div className="mt-20 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
           <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">ImeanTech</Link>
           <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">About</Link>
           <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Blog</Link>
           <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Help</Link>
           <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy</Link>
           <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  );
}
