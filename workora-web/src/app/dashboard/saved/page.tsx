'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkSimple, Play, Heart, ChatCircleDots } from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/lib/config';

interface Gig {
  id: string;
  title: string;
  description: string;
  user_name: string;
  trade: string;
  verified: boolean;
  thumbnail_url: string;
  video_url: string;
  likes_count: number;
  comments_count: number;
  saved_at?: string;
  real_likes?: number;
  real_comments?: number;
}

export default function SavedPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/gigs/saved/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setGigs(data);
        } else {
          setGigs([]);
        }
      } catch (err) {
        console.error('Saved fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [router]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white dark:bg-black">
      
      {/* Instagram-style Top Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Saved</h1>
      </div>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
        <div className="max-w-[935px] mx-auto px-1 py-1">

          {loading ? (
            <div className="grid grid-cols-3 gap-[2px]">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-3 gap-[2px]">
              {gigs.map((gig, i) => (
                <motion.div 
                  key={gig.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="group relative aspect-square bg-black cursor-pointer overflow-hidden"
                  onClick={() => router.push('/dashboard/feed')}
                >
                  <img 
                    src={gig.thumbnail_url || APP_CONFIG.defaults.thumbnail}
                    alt={gig.description || gig.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                  <div className="absolute top-2 right-2">
                    <Play size={16} weight="fill" className="text-white drop-shadow-lg" />
                  </div>
                  {/* Stats on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-white font-semibold">
                      <Heart size={20} weight="fill" />
                      <span className="text-sm">{(gig.real_likes || gig.likes_count || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white font-semibold">
                      <ChatCircleDots size={20} weight="fill" />
                      <span className="text-sm">{(gig.real_comments || gig.comments_count || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center text-center gap-4 px-4">
              <div className="h-20 w-20 rounded-full border-2 border-zinc-950 dark:border-white flex items-center justify-center">
                <BookmarkSimple size={40} weight="regular" className="text-zinc-950 dark:text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-zinc-950 dark:text-white">Save</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[280px] mx-auto">
                  Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
