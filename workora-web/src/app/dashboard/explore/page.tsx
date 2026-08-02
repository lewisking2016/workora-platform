'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Heart, ChatCircleDots } from '@phosphor-icons/react';

interface Gig {
  id: string;
  title: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
}

export default function ExplorePage() {
  const EXPLORE_PAGE_SIZE = 30;
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
        console.warn('Explore data is not an array:', data);
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
    const timer = setTimeout(() => {
      fetchExplore(1, false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    await fetchExplore(page + 1, true);
  };

  return (
    <div className="h-full bg-white dark:bg-[#0A0E17] pt-8 px-[5%] lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 pb-32">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase">Explore the Network</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm tracking-tight uppercase">Trending proof-of-work from the elite pros.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-[24px]" />
            ))}
          </div>
        ) : gigs.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gigs.map((gig, i) => (
                <motion.div 
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-[24px] overflow-hidden cursor-pointer shadow-sm"
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
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="h-12 px-6 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading more' : 'Load more work'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-40 text-zinc-300 dark:text-zinc-700 font-black uppercase tracking-widest text-xs">
            The network is quiet. Be the first to post.
          </div>
        )}
      </div>
    </div>
  );
}
