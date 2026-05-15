'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProfileHero } from '@/components/ProfileHero';
import { ProfileStats } from '@/components/ProfileStats';
import { ProofUpload } from '@/components/ProofUpload';
import { 
  ChatCircleText, 
  ShieldCheck, 
  CaretRight, 
  SpinnerGap,
  WarningCircle,
  VideoCamera
} from '@phosphor-icons/react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  full_name: string;
  trade: string;
  location: string;
  bio: string;
  profile_image_url: string;
  is_verified: boolean;
  rating: string;
  jobs_completed: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile/me');
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = '/login';
            return;
          }
          throw new Error(data.error || 'Failed to fetch profile');
        }

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-[#0066FF]"
        >
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center gap-6">
        <WarningCircle size={64} weight="duotone" className="text-red-500" />
        <div className="flex flex-col gap-2">
           <h1 className="text-2xl font-black tracking-tight text-zinc-950">Oops! Something went wrong.</h1>
           <p className="text-zinc-500 font-bold">{error || 'We couldn\'t load your passport.'}</p>
        </div>
        <Link href="/login" className="h-14 px-8 bg-zinc-950 text-white rounded-full font-black text-sm flex items-center justify-center shadow-xl">
           Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-40 bg-white min-h-screen px-[5%] md:px-[10%] pt-10">
      
      {/* 1. Elite Hero (Live Data) */}
      <ProfileHero
        name={profile.full_name}
        trade={profile.trade}
        location={profile.location || 'Nairobi, Kenya'}
        imageUrl={profile.profile_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'}
        isVerified={profile.is_verified}
      />

      {/* 2. Stats Bar (Live Data) */}
      <ProfileStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Column: About & Verification */}
        <div className="lg:col-span-2 flex flex-col gap-16">
          
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black tracking-tighter text-zinc-950 italic underline decoration-[#0066FF] decoration-4 underline-offset-8">Mission</h2>
            <p className="text-lg leading-relaxed text-zinc-600 font-medium">
              {profile.bio || `Master ${profile.trade} specialized in high-end installations and verified craftsmanship. Committed to the Workora standard of excellence and safety in every project.`}
            </p>
          </div>

          {/* Proof of Work Gallery (Future Proofed) */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tighter text-zinc-950 italic underline decoration-[#7000FF] decoration-4 underline-offset-8">Proof of Work</h2>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7000FF]">
                <VideoCamera size={18} weight="fill" /> Verified Reels
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2].map((i) => (
                 <div key={i} className="group relative aspect-video bg-zinc-100 rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm">
                   <Image 
                     src={`https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600&sig=${i}`}
                     alt="Proof Thumbnail"
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <span className="text-white text-xs font-black uppercase tracking-widest">Job #00{i} • Verified</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Trust Hub & Actions */}
        <div className="flex flex-col gap-12">
           
           {/* Add Proof Action */}
           <div className="flex flex-col gap-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Expand Passport</h3>
              <ProofUpload />
           </div>

           {/* Trust & Safety Dashboard */}
           <div className="flex flex-col gap-6">
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Trust Metrics</h3>
             <div className="flex flex-col gap-3">
                {[
                  { icon: ShieldCheck, label: 'Identity', detail: 'Government Verified', color: 'text-[#0066FF]' },
                  { icon: ShieldCheck, label: 'Skills', detail: `${profile.trade} Certified`, color: 'text-[#7000FF]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 border border-zinc-100 rounded-[24px] group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center ${item.color}`}>
                        <item.icon size={24} weight="duotone" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-950 uppercase tracking-widest">{item.label}</p>
                        <p className="text-[10px] text-zinc-400 font-bold">{item.detail}</p>
                      </div>
                    </div>
                    <CaretRight size={18} weight="bold" className="text-zinc-200 group-hover:text-zinc-950" />
                  </div>
                ))}
             </div>
           </div>

        </div>

      </div>

      {/* 6. Sticky Bottom Elite Action Bar */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-[5%] pointer-events-none">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="mx-auto flex max-w-lg gap-4 rounded-[32px] border border-white/40 bg-white/80 p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl pointer-events-auto"
        >
          <button className="flex h-14 flex-1 items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-[#0066FF] to-[#7000FF] font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0066FF]/20">
            Book Service <CaretRight size={20} weight="bold" />
          </button>
          <button className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-zinc-950 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            <ChatCircleText size={24} weight="duotone" />
          </button>
        </motion.div>
      </div>

    </div>
  );
}
