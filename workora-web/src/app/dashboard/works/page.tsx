'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { 
  Heart, 
  ChatCircleDots, 
  BookmarkSimple,
  SealCheck,
  MusicNotes,
  UserCirclePlus
} from '@phosphor-icons/react';

interface Work {
  id: string;
  user_name: string;
  trade: string;
  verified: boolean;
  description: string;
  likes_count: number;
  comments_count: number;
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/gigs/feed');
      const data = await res.json();
      if (Array.isArray(data)) {
        setWorks(data);
      } else {
        console.warn('Works data is not an array:', data);
        setWorks([]);
      }
    } catch {
      console.error('Works fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Defer initialization to avoid cascading render warning in strict environments
    const timer = setTimeout(() => {
      fetchWorks();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-zinc-950 text-white font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
             <div className="h-10 w-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : works.length > 0 ? (
          works.map((work) => (
            <section key={work.id} className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden">
               {/* Background Video Placeholder */}
               <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-4">
                  <div className="h-20 w-20 rounded-full border-2 border-white/10 flex items-center justify-center opacity-40">
                     <Heart size={40} weight="fill" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Proof of Work Active</p>
               </div>

               {/* UI Overlays */}
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

               {/* Right Side Actions */}
               <div className="absolute right-6 bottom-32 flex flex-col items-center gap-8 pointer-events-auto">
                  <div className="relative group">
                    <div className="h-12 w-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800">
                       <span className="h-full w-full flex items-center justify-center text-xs font-black">{work.user_name.charAt(0)}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF0069] h-5 w-5 rounded-full flex items-center justify-center text-white">
                       <UserCirclePlus size={14} weight="bold" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Heart size={34} weight="fill" className="text-white hover:text-red-500 transition-colors cursor-pointer" />
                    <span className="text-[11px] font-black">{work.likes_count}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <ChatCircleDots size={34} weight="fill" className="text-white hover:text-[#0066FF] transition-colors cursor-pointer" />
                    <span className="text-[11px] font-black">{work.comments_count}</span>
                  </div>

                  <BookmarkSimple size={34} weight="fill" className="text-white hover:text-yellow-500 transition-colors cursor-pointer" />
                  
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-2 border-white/20 p-1 mt-4"
                  >
                    <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#FFD600] to-[#FF0069] flex items-center justify-center">
                       <MusicNotes size={20} weight="fill" />
                    </div>
                  </motion.div>
               </div>

               {/* Bottom Content */}
               <div className="absolute left-6 bottom-10 right-24 pointer-events-none">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-black tracking-tight">{work.user_name}</span>
                    {work.verified && <SealCheck size={18} weight="fill" className="text-[#0066FF]" />}
                    <span className="text-white/40 font-bold text-xs">&bull; {work.trade}</span>
                  </div>
                  <p className="text-[14px] font-medium leading-relaxed text-white/80 line-clamp-2">
                    {work.description}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-[11px] font-black text-white/40 uppercase tracking-widest">
                     <MusicNotes size={16} weight="fill" />
                     <span>Original Audio • Workora Trust Network</span>
                  </div>
               </div>
            </section>
          ))
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-500 font-black uppercase tracking-widest text-xs">
            No proof-of-work reels available.
          </div>
        )}
      </main>
    </div>
  );
}
