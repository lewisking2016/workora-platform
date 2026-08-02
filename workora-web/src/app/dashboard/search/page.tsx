'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlass, 
  SealCheck, 
  Star, 
  MapPin, 
  CaretRight,
  FadersHorizontal
} from '@phosphor-icons/react';

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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch('/api/trades');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCategories(['All', ...data]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trades:', err);
      }
    }
    fetchTrades();
  }, []);

  const handleSearch = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`);
      const data = await res.json();
      
      let filtered = data;

      if (selectedCategory !== 'All') {
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
    }, 250);
    return () => clearTimeout(timer);
  }, [query, selectedCategory, handleSearch]);

  return (
    <div className="h-full w-full">
      <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-[#0A0E17] pt-8 px-[5%] lg:px-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-32">
          
          {/* Search Header */}
          <div className="flex flex-col gap-8">
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
                <MagnifyingGlass size={24} weight="bold" />
              </div>
              <input 
                type="text" 
                placeholder="Search trades, pros or skills..." 
                className="w-full h-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[24px] pl-16 pr-6 font-bold text-lg text-zinc-950 dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-blue-100 outline-none transition-all shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                <FadersHorizontal size={24} weight="bold" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 shadow-lg' : 'bg-white dark:bg-[#0A0E17] text-zinc-400 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                {loading ? 'Searching...' : `${results.length} Professionals Found`}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(results) && results.map((pro, i) => (
                <motion.div 
                  key={pro.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] flex items-center justify-between group hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-xl font-black text-zinc-300 dark:text-zinc-700 shadow-sm uppercase">
                      {pro.user_name.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-zinc-900 dark:text-white tracking-tight">{pro.user_name}</span>
                        {pro.is_verified && <SealCheck size={18} weight="fill" className="text-brand" />}
                      </div>
                      <p className="text-[10px] font-black text-brand uppercase tracking-widest">{pro.trade}</p>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-500"><Star size={12} weight="fill" /> {Number(pro.trust_score || 0).toFixed(1)}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {pro.location || 'Kenya'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors shadow-sm">
                    <CaretRight size={20} weight="bold" />
                  </div>
                </motion.div>
              ))}

              {results.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                   <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-200 dark:text-zinc-700">
                      <MagnifyingGlass size={32} />
                   </div>
                   <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No professionals found for &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
