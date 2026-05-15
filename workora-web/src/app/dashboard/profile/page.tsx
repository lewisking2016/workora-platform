'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProfileHero } from '@/components/ProfileHero';
import { ProfileStats } from '@/components/ProfileStats';
import { UberRating } from '@/components/UberRating';
import { 
  ShieldCheck, 
  SpinnerGap,
  VideoCamera,
  House,
  MagnifyingGlass,
  PlusSquare,
  Heart
} from '@phosphor-icons/react';
import Link from 'next/link';

import { Sidebar } from '@/components/Sidebar';

interface User {
  id: string;
  username: string;
  role: string;
}

interface Profile {
  id: string;
  full_name: string;
  trade: string;
  location: string;
  avatar_url: string;
  is_verified: boolean;
  total_gigs: number;
  trust_score: string;
  bio: string;
}

interface Gig {
  id: string;
  title: string;
  thumbnail_url: string;
  view_count: number;
  likes_count: number;
}

interface Rating {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Breakdown {
  score: number;
  count: number;
}

interface RatingData {
  average: string;
  ratings: Rating[];
  breakdown: Breakdown[];
}

export default function DashboardProfile() {
  const [profile, setProfile] = useState<{ profile: Profile } | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchData = async (userId: string) => {
    try {
      // 1. Fetch Profile
      const profileRes = await fetch(`/api/profile/me/${userId}`);
      const profileData = await profileRes.json();
      setProfile(profileData);

      if (profileData.profile) {
        const profileId = profileData.profile.id;
        
        // 2. Fetch Ratings
        const ratingsRes = await fetch(`/api/profile/ratings/${profileId}`);
        const ratingsData = await ratingsRes.json();
        setRatingData(ratingsData);

        // 3. Fetch Gigs
        const gigsRes = await fetch(`/api/gigs/worker/${profileId}`);
        const gigsData = await gigsRes.json();
        setGigs(gigsData);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Defer initialization to avoid cascading render warning in strict environments
    const timer = setTimeout(() => {
      const userStr = localStorage.getItem('workora_user');
      if (!userStr) {
        window.location.href = '/login';
        return;
      }
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchData(user.id);
      } catch {
        console.error('Failed to parse user session');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-[#0066FF]">
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      
      <Sidebar />

      {/* 2. Main Profile Content */}
      <main className="flex-1 h-full overflow-y-auto bg-white pt-8 px-[5%] lg:px-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-12 pb-32">
          
          <ProfileHero
            name={profile?.profile?.full_name || currentUser?.username || ''}
            trade={profile?.profile?.trade || 'Workora Pro'}
            location={profile?.profile?.location || 'Kenya'}
            imageUrl={profile?.profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'}
            isVerified={profile?.profile?.is_verified || false}
            rating={ratingData?.average || profile?.profile?.trust_score || '0.0'}
          />

          <ProfileStats 
            jobs={profile?.profile?.total_gigs || 0}
            rating={ratingData?.average || profile?.profile?.trust_score || '0.0'}
            trust={profile?.profile?.is_verified ? '100%' : '70%'}
            income={`KSh ${((profile?.profile?.total_gigs || 0) * 2500).toLocaleString()}`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 flex flex-col gap-12">
               <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Professional Bio</h2>
                  <p className="text-[15px] leading-relaxed text-zinc-600 font-medium">
                    {profile?.profile?.bio || 'No bio provided yet. Add a bio to help hirers understand your expertise.'}
                  </p>
               </div>

               <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Proof of Work</h2>
                    <div className="bg-zinc-50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-zinc-400">
                      {gigs.length} Gigs
                    </div>
                  </div>
                  
                  {gigs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gigs.map((gig) => (
                        <div key={gig.id} className="group relative aspect-video bg-zinc-100 rounded-[24px] overflow-hidden shadow-sm border border-zinc-100">
                          <Image 
                            src={gig.thumbnail_url || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'}
                            alt={gig.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5">
                             <p className="text-white text-[13px] font-black truncate">{gig.title}</p>
                             <div className="flex items-center gap-3 mt-1 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                <span>{gig.view_count} Views</span>
                                <span>&bull;</span>
                                <span>{gig.likes_count} Likes</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 border-2 border-dashed border-zinc-100 rounded-[24px] flex flex-col items-center justify-center gap-3 text-zinc-300">
                       <VideoCamera size={32} weight="duotone" />
                       <span className="text-[10px] font-black uppercase tracking-widest">No gigs uploaded yet</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex flex-col gap-8">
               <UberRating 
                 average={ratingData?.average || '0.0'}
                 totalReviews={ratingData?.ratings?.length || 0}
                 breakdown={ratingData?.breakdown || []}
               />

               <div className="p-6 bg-zinc-950 rounded-[32px] text-white flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#0066FF]">
                      <ShieldCheck size={24} weight="fill" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest opacity-60">Elite Status</p>
                      <p className="text-sm font-black italic tracking-tight">Verified Professional</p>
                    </div>
                  </div>
                  <button className="h-12 w-full bg-white text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest mt-2 hover:bg-zinc-100 transition-colors">
                    Edit Profile
                  </button>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-4 px-8 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <Link href="/dashboard/feed"><House size={28} /></Link>
        <Link href="/dashboard/search"><MagnifyingGlass size={28} /></Link>
        <div className="bg-[#0066FF] p-2 rounded-xl shadow-lg">
          <PlusSquare size={28} weight="bold" className="text-white" />
        </div>
        <Link href="/notifications"><Heart size={28} /></Link>
        <Link href="/dashboard/profile" className="h-8 w-8 rounded-full bg-zinc-950 flex items-center justify-center font-black text-[10px] uppercase text-white border-2 border-[#0066FF]">{currentUser?.username?.charAt(0) || 'U'}</Link>
      </nav>

    </div>
  );
}
