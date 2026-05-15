'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sidebar } from '@/components/Sidebar';
import { BookmarkSimple, Play, Heart, ChatCircleDots } from '@phosphor-icons/react';

interface Gig {
  id: string;
  title: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
}

export default function SavedPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        // For now we'll show some sample gigs as "Saved"
        const res = await fetch('/api/gigs/feed');
        const data = await res.json();
        if (Array.isArray(data)) {
          setGigs(data.slice(0, 2)); // Just a couple of items for the mock-to-live transition
        } else {
          setGigs([]);
        }
      } catch {
        console.error('Saved fetch failed');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSaved();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto bg-white pt-8 px-[5%] lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-32">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-[#0066FF] shadow-sm">
                  <BookmarkSimple size={24} weight="fill" />
               </div>
               <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Saved Gigs</h1>
            </div>
            <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase">Your curated collection of elite craftsmanship.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2].map(i => (
                <div key={i} className="aspect-[4/5] bg-zinc-50 animate-pulse rounded-[24px]" />
              ))}
            </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gigs.map((gig, i) => (
                <motion.div 
                  key={gig.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-[4/5] bg-zinc-100 rounded-[24px] overflow-hidden cursor-pointer shadow-sm"
                >
                  <Image 
                    src={gig.thumbnail_url || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'}
                    alt={gig.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-white font-black">
                      <Heart size={24} weight="fill" />
                      <span>{gig.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-black">
                      <ChatCircleDots size={24} weight="fill" />
                      <span>{gig.comments_count}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-white drop-shadow-lg">
                    <Play size={20} weight="fill" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-60 border-2 border-dashed border-zinc-100 rounded-[40px] flex flex-col items-center justify-center gap-4 text-zinc-300">
               <BookmarkSimple size={48} weight="duotone" />
               <p className="text-[10px] font-black uppercase tracking-widest text-center">No bookmarked work yet. <br /> Explore the network to find inspiration.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
