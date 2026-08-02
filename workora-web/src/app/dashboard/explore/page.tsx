'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, ChatCircleDots, SealCheck } from '@phosphor-icons/react';
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
  view_count: number;
  real_likes?: number;
  real_comments?: number;
}

export default function ExplorePage() {
  const EXPLORE_PAGE_SIZE = 30;
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchExplore = async (nextPage = 1, append = false) => {
    try {
      if (nextPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`/api/gigs/explore?page=${nextPage}&limit=${EXPLORE_PAGE_SIZE}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setGigs(prev => append ? [...prev, ...data] : data);
        setHasMore(data.length === EXPLORE_PAGE_SIZE);
        setPage(nextPage);
      } else {
        setGigs([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Explore fetch failed:', err);
    } finally {
      if (nextPage === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchExplore(1, false);
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    await fetchExplore(page + 1, true);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white dark:bg-black">
      
      {/* Instagram-style Top Header - Mobile Only */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Explore</h1>
      </div>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
        <div className="max-w-[935px] mx-auto px-1 py-1">

          {loading ? (
            <div className="grid grid-cols-3 gap-[2px]">
              {[1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : gigs.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-[2px]">
                {gigs.map((gig, i) => (
                  <motion.div 
                    key={gig.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                    {/* Trade Badge */}
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1.5 text-white">
                        <div className="h-6 w-6 rounded-full bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                          {gig.user_name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{gig.user_name}</p>
                          <p className="text-[10px] text-white/80">{gig.trade}</p>
                        </div>
                        {gig.verified && <SealCheck size={14} weight="fill" className="text-[#0066FF]" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center py-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="text-[#0066FF] text-sm font-semibold disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Play size={32} className="text-zinc-300 dark:text-zinc-700" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                No posts to explore yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
