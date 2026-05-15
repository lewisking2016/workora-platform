'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sidebar } from '@/components/Sidebar';
import { Play, Heart, ChatCircleDots } from '@phosphor-icons/react';

interface Gig {
  id: string;
  title: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
}

export default function ExplorePage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExplore = async () => {
    try {
      const res = await fetch('/api/gigs/explore');
      const data = await res.json();
      if (Array.isArray(data)) {
        setGigs(data);
      } else {
        console.warn('Explore data is not an array:', data);
        setGigs([]);
      }
    } catch (err) {
      console.error('Explore fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExplore();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto bg-white pt-8 px-[5%] lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-32">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Explore the Network</h1>
            <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase">Trending proof-of-work from the elite pros.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="aspect-[4/5] bg-zinc-50 animate-pulse rounded-[24px]" />
              ))}
            </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gigs.map((gig, i) => (
                <motion.div 
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-[4/5] bg-zinc-100 rounded-[24px] overflow-hidden cursor-pointer shadow-sm"
                >
                  <Image 
                    src={gig.thumbnail_url || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'}
                    alt={gig.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
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
            <div className="text-center py-40 text-zinc-300 font-black uppercase tracking-widest text-xs">
              The network is quiet. Be the first to post.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
