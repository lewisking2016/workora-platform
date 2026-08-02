'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlass, 
  SealCheck, 
  Star, 
  MapPin, 
  CaretRight,
  FadersHorizontal,
  Play
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/lib/config';

interface Gig {
  id: string;
  user_id: string;
  worker_id: string;
  user_name: string;
  trade: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  view_count: number;
  likes_count: number;
  is_verified?: boolean;
}

interface SearchResult {
  id: string;
  user_name: string;
  trade: string;
  is_verified: boolean;
  trust_score: number | string;
  location: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For you');
  const [categories, setCategories] = useState<string[]>(['For you']);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch('/api/trades');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCategories(['For you', ...data]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trades:', err);
      }
    }
    fetchTrades();
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gigs/feed?page=1&limit=100');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Shuffle for algorithmic feel
        const shuffled = data.sort(() => Math.random() - 0.5);
        setGigs(shuffled);
      }
    } catch (err) {
      console.error('Failed to fetch gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [selectedCategory]);

  const handleSearch = React.useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setViewMode('grid');
      return;
    }

    setLoading(true);
    setViewMode('list');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      
      let filtered = data;

      if (selectedCategory !== 'For you') {
        filtered = data.filter((p: SearchResult) => p.trade.includes(selectedCategory));
      }
      if (query) {
        filtered = data.filter((p: SearchResult) => 
          p.user_name.toLowerCase().includes(query.toLowerCase()) || 
          p.trade.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const filteredGigs = selectedCategory === 'For you' 
    ? gigs 
    : gigs.filter(g => g.trade.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white dark:bg-black">
      
      {/* Instagram-style Top Header - Mobile Only */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Search</h1>
      </div>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
        <div className="max-w-[660px] mx-auto">
          
          {/* Search Bar - Sticky */}
          <div className="sticky top-0 z-40 bg-white dark:bg-black pt-4 pb-3 px-4 border-b border-zinc-100 dark:border-zinc-900">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <MagnifyingGlass size={18} weight="bold" />
              </div>
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full h-10 bg-zinc-100 dark:bg-zinc-900 rounded-lg pl-11 pr-4 text-sm font-normal text-zinc-950 dark:text-white placeholder:text-zinc-500 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* Categories Pills */}
          <div className="sticky top-[60px] z-30 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' 
                      : 'bg-transparent text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {viewMode === 'grid' && !query.trim() ? (
            /* Instagram Grid View */
            <div className="grid grid-cols-3 gap-[2px] bg-zinc-100 dark:bg-zinc-900">
              {filteredGigs.map((gig, i) => (
                <motion.div 
                  key={gig.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="aspect-square bg-black relative group cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/dashboard/post/${gig.id}`)}
                >
                  <img 
                    src={gig.thumbnail_url || APP_CONFIG.defaults.thumbnail}
                    alt={gig.description}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  <div className="absolute top-2 right-2">
                    <Play size={16} weight="fill" className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold flex items-center gap-1">
                      <Play size={14} weight="fill" />
                      {gig.view_count?.toLocaleString() || '0'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List View for Search Results */
            <div className="px-4 py-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3 py-2">
                      <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((pro, i) => (
                    <motion.div 
                      key={pro.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg px-2 -mx-2 transition-colors"
                      onClick={() => router.push(`/dashboard/feed`)}
                    >
                      <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-950 dark:text-white uppercase shrink-0">
                        {pro.user_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                            {pro.user_name.toLowerCase().replace(' ', '')}
                          </p>
                          {pro.is_verified && <SealCheck size={14} weight="fill" className="text-[#0066FF] shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{pro.trade}</span>
                          {pro.trust_score && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Star size={12} weight="fill" className="text-amber-500" />
                                {Number(pro.trust_score || 0).toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button className="h-8 px-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg text-xs font-semibold">
                        View
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <MagnifyingGlass size={32} className="text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    No results found for &quot;{query}&quot;
                  </p>
                </div>
              ) : null}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
