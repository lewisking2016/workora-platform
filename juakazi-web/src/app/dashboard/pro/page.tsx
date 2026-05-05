'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  House,
  UsersThree,
  Briefcase,
  ChatCircleDots,
  Bell,
  MagnifyingGlass,
  PencilSimple,
  Image as ImageIcon,
  VideoCamera,
  Article,
  BookmarkSimple,
  UsersThree as GroupIcon,
  Newspaper,
  ChartLineUp,
  ArrowRight,
  MapPin,
  Check,
  Moon,
  Sun,
  Crown
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';

const FEED_POSTS = [
  {
    user: 'Andrew Olubala',
    title: 'Community Engagement | Project Management',
    time: '16h',
    content: 'It was a great experience being part of University of Nairobi team at the Assistive Technology in Higher Education Conference held at the University of Lagos, Nigeria.',
    likes: 234,
    comments: 18,
    reposts: 5,
  },
  {
    user: 'Sarah Wambui',
    title: 'Senior Electrician | JuaKazi Verified',
    time: '1d',
    content: 'Just completed a major solar panel installation project in Nakuru County. 50KW system powering an entire commercial complex. This is the future of energy in Kenya!',
    likes: 567,
    comments: 42,
    reposts: 23,
  },
  {
    user: 'David Omondi',
    title: 'Master Plumber | 10+ Years Experience',
    time: '2d',
    content: 'Looking for reliable plumbing apprentices in the Nairobi area. Must be willing to learn and grow. DM me or apply through JuaKazi.',
    likes: 189,
    comments: 67,
    reposts: 12,
  },
];

const RECOMMENDATIONS = [
  { name: 'Tonee Ndungu', title: 'Founder: Kytabu & Tribbe | Driving AI...', },
  { name: 'Sundar Pichai', title: 'CEO at Google', },
  { name: 'Grace Wanjiku', title: 'Interior Design Lead | JuaKazi Elite', },
];

export default function BusinessDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState('Professional');

  useEffect(() => {
    const stored = localStorage.getItem('juakazi_username');
    if (stored) setUsername(stored);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-display ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-950'}`}>

      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 border-b shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-zinc-900/80 backdrop-blur-xl border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative h-9 w-9">
              <Image 
                src={isDarkMode ? "/logo/juakazi-white-removebg.png" : "/logo/juakazi-dark-removebg.png"} 
                alt="JuaKazi" 
                fill 
                className="object-contain" 
              />
            </Link>
            <div className="relative">
              <MagnifyingGlass size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                placeholder="Search" 
                className={`h-9 w-[260px] rounded-lg border-none pl-9 pr-4 text-xs font-bold outline-none transition-all ${
                  isDarkMode ? 'bg-zinc-800 text-white focus:bg-zinc-700' : 'bg-zinc-100 focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20'
                }`} 
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[
              { icon: House, label: 'Home', active: true },
              { icon: UsersThree, label: 'My Network', active: false },
              { icon: Briefcase, label: 'Jobs', active: false },
              { icon: ChatCircleDots, label: 'Messaging', active: false, badge: 2 },
              { icon: Bell, label: 'Notifications', active: false, badge: 5 },
            ].map((item) => (
              <button key={item.label} className={`flex flex-col items-center px-4 py-1 rounded-lg transition-all relative ${
                item.active 
                  ? (isDarkMode ? 'text-white' : 'text-zinc-950') 
                  : 'text-zinc-400 hover:text-zinc-500'
              }`}>
                <div className="relative">
                  <item.icon size={22} weight={item.active ? 'fill' : 'regular'} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 h-4 min-w-[16px] px-1 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center border-2 border-inherit">{item.badge}</span>
                  )}
                </div>
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
                {item.active && <div className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-zinc-950'}`} />}
              </button>
            ))}

            <div className={`w-px h-8 mx-2 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`flex flex-col items-center px-3 py-1 transition-all ${isDarkMode ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-700'}`}
            >
              {isDarkMode ? <Sun size={22} weight="fill" /> : <Moon size={22} weight="fill" />}
              <span className="text-[9px] font-bold mt-0.5">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            <div className={`w-px h-8 mx-2 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

            <button className="flex flex-col items-center px-3 py-1 text-zinc-400 hover:text-zinc-500 transition-all">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-[8px] font-black text-white uppercase">{username.charAt(0)}</div>
              <span className="text-[9px] font-bold mt-0.5">Me</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 pt-6 pb-20 grid grid-cols-12 gap-6">

        {/* Left Sidebar */}
        <aside className="col-span-3 space-y-4 sticky top-20 self-start">
          {/* Quick Nav */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="p-5 space-y-1">
              {[
                { icon: BookmarkSimple, label: 'Saved items' },
                { icon: GroupIcon, label: 'Groups' },
                { icon: Newspaper, label: 'Newsletters' },
              ].map(item => (
                <button key={item.label} className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all text-xs font-bold ${
                  isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-600 hover:bg-zinc-50'
                }`}>
                  <item.icon size={18} weight="regular" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className={`rounded-2xl border shadow-sm p-5 space-y-4 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Profile viewers</p>
              <span className="text-sm font-black text-[#0066FF]">14</span>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-[#0066FF] hover:underline">
              <ChartLineUp size={14} /> View all analytics
            </button>
          </div>

          {/* My Pages */}
          <div className={`rounded-2xl border shadow-sm p-5 space-y-4 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>My pages</p>
              <ArrowRight size={14} weight="bold" className="text-zinc-400" />
            </div>
            <div className="space-y-3">
              {['I MEAN TECH', 'BridgApp Africa'].map(page => (
                <div key={page} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[8px] font-black ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>{page.charAt(0)}</div>
                  <div>
                    <p className={`text-[11px] font-black ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>{page}</p>
                    <p className="text-[9px] text-zinc-400 font-bold">Visitors: 0</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="col-span-6 space-y-4">
          {/* Post Creator */}
          <div className={`rounded-2xl border shadow-sm p-5 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-sm font-black text-white uppercase">{username.charAt(0)}</div>
              <button className={`flex-1 h-12 rounded-full border px-5 text-left text-sm font-bold transition-all ${
                isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:bg-zinc-50'
              }`}>Start a post</button>
            </div>
            <div className={`flex items-center justify-around pt-2 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-50'}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-50/10 transition-colors text-xs font-bold text-zinc-500"><VideoCamera size={18} weight="fill" className="text-red-500" /> Video</button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-50/10 transition-colors text-xs font-bold text-zinc-500"><ImageIcon size={18} weight="fill" className="text-[#0066FF]" /> Photo</button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-50/10 transition-colors text-xs font-bold text-zinc-500"><Article size={18} weight="fill" className="text-[#FF6B00]" /> Write article</button>
            </div>
          </div>

          {/* Feed */}
          {FEED_POSTS.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-black ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500'}`}>{post.user.charAt(0)}</div>
                    <div>
                      <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>{post.user} <button className="text-[#0066FF] text-xs font-black ml-1">+ Follow</button></p>
                      <p className="text-[10px] text-zinc-400 font-bold">{post.title}</p>
                      <p className="text-[9px] text-zinc-400 font-bold">{post.time} &middot; <span className="text-zinc-500">Edited</span></p>
                    </div>
                  </div>
                  <button className="text-zinc-400 hover:text-zinc-500 text-lg">&middot;&middot;&middot;</button>
                </div>

                <p className={`text-sm font-bold leading-relaxed mb-4 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{post.content}</p>

                {/* Post Media Placeholder */}
                <div className={`aspect-video rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <ImageIcon size={32} weight="duotone" className={isDarkMode ? 'text-zinc-700' : 'text-zinc-300'} />
                </div>

                <div className={`flex items-center justify-between text-[10px] text-zinc-400 font-bold pb-3 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-50'}`}>
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments &middot; {post.reposts} reposts</span>
                </div>

                <div className="flex items-center justify-around pt-3">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-xs font-bold text-zinc-500 ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}>Like</button>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-xs font-bold text-zinc-500 ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}>Comment</button>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-xs font-bold text-zinc-500 ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}>Repost</button>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-xs font-bold text-zinc-500 ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}>Send</button>
                </div>
              </div>
            </motion.article>
          ))}
        </main>

        {/* Right Sidebar — Profile Card & Recommendations */}
        <aside className="col-span-3 space-y-4 sticky top-20 self-start">
          {/* Profile Card */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="h-16 bg-gradient-to-r from-[#0066FF] to-[#7000FF]" />
            <div className="px-5 pb-5">
              <div className="relative -mt-8 mb-3">
                <div className={`h-16 w-16 rounded-full border-2 shadow-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-white'}`}>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-xl font-black text-white uppercase">{username.charAt(0)}</div>
                </div>
              </div>
              <h3 className={`text-sm font-black flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>{username} <Check size={14} weight="bold" className="text-[#0066FF]" /></h3>
              <p className="text-[10px] text-zinc-500 font-bold mt-1">Professional | JuaKazi Verified</p>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-zinc-400 font-bold">
                <MapPin size={10} weight="fill" /> Nairobi, Kenya
              </div>
              <Link href="/profile/edit" className="mt-4 h-9 w-full bg-[#0066FF]/10 text-[#0066FF] rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-[#0066FF]/20 transition-colors">
                <PencilSimple size={12} weight="bold" className="mr-2" /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Advert Strategy - Sponsored Stories / Promotions */}
          <div className={`rounded-2xl border shadow-sm p-5 space-y-4 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Promote your work</p>
              <Crown size={16} weight="fill" className="text-yellow-500" />
            </div>
            <div className={`p-3 rounded-xl border border-dashed ${isDarkMode ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Boost Your Visibility</p>
              <p className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Appear in the stories feed for only <span className={isDarkMode ? 'text-white' : 'text-zinc-950'}>Ksh 150/week</span>.</p>
              <button className="mt-3 h-8 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-orange-500/20">Boost Now</button>
            </div>
          </div>

          {/* Add to your feed */}
          <div className={`rounded-2xl border shadow-sm p-5 space-y-4 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Add to your feed</p>
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-500'}`}>{rec.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black truncate ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>{rec.name}</p>
                  <p className="text-[9px] text-zinc-400 font-bold truncate">{rec.title}</p>
                  <button className={`mt-1.5 h-7 px-4 rounded-full border text-[9px] font-black transition-colors flex items-center gap-1 ${
                    isDarkMode ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                  }`}>+ Follow</button>
                </div>
              </div>
            ))}
            <button className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-[#0066FF] transition-colors">View all recommendations <ArrowRight size={12} /></button>
          </div>

          {/* Footer */}
          <div className="text-[9px] text-zinc-400 font-bold space-y-1 px-2">
            <p>About &middot; Help &middot; Privacy &middot; Terms</p>
            <p>&copy; 2026 JUAKAZI FROM IMEANTECH</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
