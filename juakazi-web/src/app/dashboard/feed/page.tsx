'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  House,
  MagnifyingGlass,
  Compass,
  Heart,
  ChatCircleDots,
  PlusSquare,
  BookmarkSimple,
  ChartBar,
  UserCircle,
  List,
  Play
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';

const STORIES = [
  { name: 'Kibe Electric', trade: 'Electrician', promoted: true },
  { name: 'Mama Fua', trade: 'Laundry', promoted: true },
  { name: 'AutoFix KE', trade: 'Mechanic', promoted: false },
  { name: 'TechDoc', trade: 'Phone Repair', promoted: false },
  { name: 'BuildRight', trade: 'Construction', promoted: true },
  { name: 'StyleCut', trade: 'Barber', promoted: false },
  { name: 'CleanPro', trade: 'Cleaning', promoted: false },
];

const FEED_POSTS = [
  {
    user: 'James Kamau',
    handle: '@jameskamau',
    trade: 'Master Electrician',
    time: '2h',
    description: 'Full house wiring completed in Kilimani. 3-bedroom apartment, modern switchboard installation.',
    likes: 847,
    comments: 63,
    views: '2.4K',
  },
  {
    user: 'Grace Wanjiku',
    handle: '@gracewanjiku',
    trade: 'Interior Designer',
    time: '5h',
    description: 'Before and after transformation of a client office in Westlands. Modern minimalist approach.',
    likes: 1200,
    comments: 89,
    views: '5.1K',
  },
  {
    user: 'Peter Ochieng',
    handle: '@peterochieng',
    trade: 'Plumber',
    time: '8h',
    description: 'Emergency pipe repair in Karen. 2-hour turnaround, zero leaks guaranteed.',
    likes: 432,
    comments: 28,
    views: '1.8K',
  },
];

const SUGGESTED_PROS = [
  { name: 'Diana Mutua', trade: 'Tailor', mutual: 3 },
  { name: 'Brian Kipchoge', trade: 'Welder', mutual: 5 },
  { name: 'Faith Akinyi', trade: 'Chef', mutual: 2 },
  { name: 'Samuel Njoroge', trade: 'Painter', mutual: 7 },
];

export default function PersonalDashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-display flex">

      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-[240px] border-r border-white/5 p-6 sticky top-0 h-screen">
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="relative h-10 w-10">
              <Image src="/logo/juakazi-white-removebg.png" alt="JuaKazi" fill className="object-contain" />
            </div>
            <span className="font-black text-lg tracking-tight">JuaKazi</span>
          </Link>

          {[
            { icon: House, label: 'Home', active: true },
            { icon: MagnifyingGlass, label: 'Search', active: false },
            { icon: Compass, label: 'Explore', active: false },
            { icon: Play, label: 'Reels', active: false },
            { icon: ChatCircleDots, label: 'Messages', active: false, badge: 3 },
            { icon: Heart, label: 'Notifications', active: false, badge: 12 },
            { icon: PlusSquare, label: 'Create', active: false },
            { icon: BookmarkSimple, label: 'Saved', active: false },
            { icon: ChartBar, label: 'Dashboard', active: false },
            { icon: UserCircle, label: 'Profile', active: false },
          ].map((item) => (
            <button key={item.label} className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all text-sm font-bold ${item.active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
              <div className="relative">
                <item.icon size={24} weight={item.active ? 'fill' : 'regular'} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[8px] font-black flex items-center justify-center">{item.badge}</span>
                )}
              </div>
              {item.label}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-4 w-full p-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all text-sm font-bold">
          <List size={24} /> More
        </button>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 max-w-[630px] mx-auto px-4 pt-8 pb-32">

        {/* Stories Ring */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-8 border-b border-white/5 scrollbar-hide">
          {STORIES.map((story, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 min-w-[80px]"
            >
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${story.promoted ? 'bg-gradient-to-br from-[#FFD700] via-[#FF6B00] to-[#E91E63]' : 'bg-gradient-to-br from-[#0066FF] to-[#7000FF]'} p-[2px]`}>
                <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-lg font-black text-white/60 p-[2px]">
                  <div className="h-full w-full rounded-full bg-zinc-800 flex items-center justify-center">
                    {story.name.charAt(0)}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 truncate max-w-[70px]">{story.name}</span>
              {story.promoted && <span className="text-[7px] font-black text-[#FFD700] uppercase tracking-widest -mt-1">Sponsored</span>}
            </motion.button>
          ))}
        </div>

        {/* Feed Posts */}
        <div className="space-y-8">
          {FEED_POSTS.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-white/5 rounded-[24px] overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-sm font-black">{post.user.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-black">{post.user} <span className="text-zinc-500 font-bold text-xs">&middot; {post.time}</span></p>
                    <p className="text-[10px] text-zinc-500 font-bold">{post.trade}</p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white text-lg font-black">&middot;&middot;&middot;</button>
              </div>

              {/* Post Media Placeholder */}
              <div className="aspect-square bg-zinc-900 flex items-center justify-center relative group cursor-pointer">
                <div className="text-center space-y-3">
                  <Play size={48} weight="fill" className="text-zinc-700 mx-auto group-hover:text-white/20 transition-colors" />
                  <p className="text-zinc-600 text-xs font-bold">{post.views} views</p>
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="text-white hover:text-red-500 transition-colors"><Heart size={24} weight="regular" /></button>
                    <button className="text-white hover:text-[#0066FF] transition-colors"><ChatCircleDots size={24} weight="regular" /></button>
                  </div>
                  <button className="text-white hover:text-[#FFD700] transition-colors"><BookmarkSimple size={24} weight="regular" /></button>
                </div>
                <p className="text-sm font-black">{post.likes.toLocaleString()} likes</p>
                <p className="text-sm"><span className="font-black">{post.handle}</span> <span className="text-zinc-400 font-bold">{post.description}</span></p>
                <button className="text-zinc-500 text-xs font-bold">View all {post.comments} comments</button>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-[320px] p-8 sticky top-0 h-screen overflow-y-auto">
        {/* User Card */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-sm font-black">U</div>
          <div className="flex-1">
            <p className="text-sm font-black">Your Account</p>
            <p className="text-xs text-zinc-500 font-bold">Personal</p>
          </div>
          <button className="text-[#0066FF] text-xs font-black">Switch</button>
        </div>

        {/* Suggested Pros */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Suggested for you</p>
            <button className="text-xs font-black text-white">See All</button>
          </div>
          <div className="space-y-4">
            {SUGGESTED_PROS.map((pro, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-500">{pro.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-xs font-black">{pro.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold">{pro.trade} &middot; {pro.mutual} mutual</p>
                </div>
                <button className="text-[#0066FF] text-[10px] font-black">Follow</button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Trades */}
        <div className="mb-8">
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Trending Trades</p>
          <div className="flex flex-wrap gap-2">
            {['Electricians', 'Plumbers', 'Mechanics', 'Tailors', 'Barbers', 'Welders'].map(trade => (
              <span key={trade} className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">{trade}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-[9px] text-zinc-600 font-bold space-y-1 leading-relaxed">
          <p>About &middot; Help &middot; Press &middot; API &middot; Jobs &middot; Privacy &middot; Terms</p>
          <p>&copy; 2026 JUAKAZI FROM IMEANTECH</p>
        </div>
      </aside>
    </div>
  );
}
