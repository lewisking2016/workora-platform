'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { VideoCard } from '@/components/VideoCard';
import { Search, MapPin, CheckCircle, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Electricians', 'Plumbers', 'Carpenters', 'Mechanics', 'Tailors', 'Electronics', 'Painters', 'Domestic'];

const MOCK_GIGS = [
  {
    id: '1',
    workerName: 'John Doe',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',
    title: 'Fixing a burst pipe with seamless finish',
    views: '2.6K',
  },
  {
    id: '2',
    workerName: 'Jane Smith',
    workerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    title: 'Solar panel installation in high-density area',
    views: '1.1K',
  },
  {
    id: '5',
    workerName: 'Peter M.',
    workerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517646272486-a28f99c01a4a?auto=format&fit=crop&q=80&w=400',
    title: 'Engine overhaul for Toyota Landcruiser',
    views: '5.2K',
  },
  {
    id: '6',
    workerName: 'Sarah J.',
    workerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=400',
    title: 'Custom wedding gown stitching and fitting',
    views: '8.4K',
  },
  {
    id: '3',
    workerName: 'David K.',
    workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=400',
    title: 'Full house deep cleaning and sanitization',
    views: '3.9K',
  },
  {
    id: '4',
    workerName: 'Mary W.',
    workerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400',
    title: 'Custom kitchen cabinet build and installation',
    views: '756',
  },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [location] = useState('Nairobi');

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4">
      {/* Search Header */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-brand" />
          <input 
            type="text" 
            placeholder="Search proof of work..."
            className="h-12 w-full rounded-2xl bg-card border border-border/50 pl-11 pr-4 text-sm outline-none focus:ring-2 ring-brand/50 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
          className={`h-12 px-4 rounded-2xl border transition-all flex items-center gap-2 ${
            isVerifiedOnly ? 'bg-brand/10 border-brand text-brand' : 'bg-card border-border/50 text-muted-foreground'
          }`}
        >
          <CheckCircle className={`h-4 w-4 ${isVerifiedOnly ? 'fill-brand text-white' : ''}`} />
          <span className="text-xs font-bold whitespace-nowrap">Verified</span>
        </button>
      </div>

      {/* Location & Sort Bar */}
      <div className="flex items-center justify-between px-1">
        <button className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-brand" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">{location}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sort By</span>
          <button className="h-8 px-3 rounded-lg bg-card border border-border/50 text-xs font-bold flex items-center gap-1">
            Newest <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'bg-card text-muted-foreground border border-border/50 hover:border-brand/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discovery Grid */}
      <div className="grid grid-cols-2 gap-4">
        {MOCK_GIGS.map((gig, i) => (
          <motion.div
            key={gig.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <VideoCard {...gig} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
