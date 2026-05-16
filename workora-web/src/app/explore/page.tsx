'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, ChevronDown, SlidersHorizontal, 
  Hammer, Wrench, Paintbrush, Scissors, Zap, 
  Monitor, Truck, Sparkles, Grid3X3, TrendingUp
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Grid3X3 },
  { name: 'Construction', icon: Hammer },
  { name: 'Plumbing', icon: Wrench },
  { name: 'Electrical', icon: Zap },
  { name: 'Painting', icon: Paintbrush },
  { name: 'Tailoring', icon: Scissors },
  { name: 'Tech Repair', icon: Monitor },
  { name: 'Logistics', icon: Truck },
  { name: 'Cleaning', icon: Sparkles },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [location] = useState('Nairobi');

  return (
    <div className="flex flex-col gap-0 pb-24 pt-24 lg:pt-28 px-[5%] max-w-screen-2xl mx-auto">

      {/* Search Header */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-zinc-950">Explore</h1>
            <p className="text-zinc-400 text-sm font-medium mt-1">Discover verified professionals near you</p>
          </div>
          <button className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
            <SlidersHorizontal className="h-4 w-4 text-zinc-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-zinc-950" />
          <input 
            type="text" 
            placeholder="Search skills, services, or professionals..."
            className="h-13 w-full rounded-2xl bg-zinc-100 pl-11 pr-4 text-sm font-medium text-zinc-950 outline-none focus:ring-2 ring-zinc-950/10 transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* Location Bar */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-[#0066FF]" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-zinc-950">{location}</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </div>
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trending</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-6 -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-950/20' 
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-20 lg:py-32"
      >
        <div className="relative mb-8">
          <div className="h-28 w-28 rounded-full bg-zinc-100 flex items-center justify-center">
            <Search className="h-10 w-10 text-zinc-300" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-10 w-10 rounded-full bg-zinc-950 flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-zinc-950 mb-3 text-center">No professionals yet</h2>
        <p className="text-zinc-400 text-sm font-medium text-center max-w-sm leading-relaxed mb-8">
          Be among the first to join Workora. Verified professionals will appear here once they create their profiles.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="/join" 
            className="h-11 px-8 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95"
          >
            Join as a Pro
          </a>
          <a 
            href="/personal" 
            className="h-11 px-8 bg-zinc-100 text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95"
          >
            Learn More
          </a>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { label: 'Categories', value: '8+' },
          { label: 'Cities', value: '3' },
          { label: 'Coming Soon', value: '2026' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center gap-1 py-5 rounded-2xl bg-zinc-50 border border-zinc-100"
          >
            <span className="text-xl font-black text-zinc-950">{stat.value}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
