'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Heart,
  ChatCircleDots,
  BookmarkSimple,
  SealCheck,
  ShareFat,
  DotsThree,
  PaperPlaneTilt
} from '@phosphor-icons/react';
import { fetchCurrentUser, apiFetch } from '@/lib/session';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_CONFIG } from '@/lib/config';
import { useRouter } from 'next/navigation';

interface Work {
  id: string;
  user_id: string;
  worker_id: string;
  user_name: string;
  handle: string;
  trade: string;
  verified: boolean;
  description: string;
  likes_count: number;
  comments_count: number;
  video_url: string;
  thumbnail_url: string;
  saved_by_me?: boolean;
  liked_by_me?: boolean;
  real_likes?: number;
  real_comments?: number;
}

interface User {
  id: string;
  username: string;
  role: string;
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchWorks = async () => {
    try {
      const endpoints = [
        '/api/gigs/feed?scope=reels&page=1&limit=50',
        '/api/gigs/feed?scope=new&page=1&limit=50',
        '/api/gigs/explore?limit=50&page=1',
      ];
      let worksList: Work[] = [];
      for (const endpoint of endpoints) {
        const res = await apiFetch(endpoint);
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          worksList = data.filter((item: Work) => Boolean(item.video_url));
          if (worksList.length > 0) break;
        }
      }
      setWorks(worksList);
    } catch (err) {
      console.error('Works fetch failed:', err);
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (work: Work) => {
    if (!currentUser) return;
    try {
      const res = await apiFetch(`/api/gigs/${work.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      setWorks(prev => prev.map(item => item.id === work.id ? {
        ...item,
        likes_count: data.liked ? item.likes_count + 1 : item.likes_count - 1,
        liked_by_me: data.liked
      } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (work: Work) => {
    if (!currentUser) return;
    try {
      const res = await apiFetch(`/api/gigs/${work.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setWorks(prev => prev.map(item => item.id === work.id ? { ...item, saved_by_me: data.saved } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const startConversation = async (otherUserId: string) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    try {
      const res = await apiFetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, other_user_id: otherUserId })
      });
      await res.json();
      router.push('/dashboard/messages');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      setCurrentUser(user);
      fetchWorks();
    };
    bootstrap();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      setCurrentIndex(newIndex);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white gap-4 px-8">
        <Heart size={48} weight="duotone" className="text-white/20" />
        <p className="text-sm font-medium text-center text-white/60">
          No videos available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {works.map((work, idx) => (
        <section 
          key={work.id} 
          className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
        >
          {/* Video Background */}
          <div className="absolute inset-0">
            <VideoPlayer 
              src={work.video_url}
              poster={work.thumbnail_url || APP_CONFIG.defaults.thumbnail}
              className="w-full h-full object-cover"
              autoPlay={idx === currentIndex}
              loop
              muted
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

          {/* Top Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-10">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center text-sm font-bold text-white">
                {work.user_name?.charAt(0) || '?'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold text-sm">{work.user_name}</span>
                  {work.verified && <SealCheck size={14} weight="fill" className="text-[#0066FF]" />}
                </div>
                <p className="text-white/70 text-xs">{work.trade}</p>
              </div>
            </div>
            <DotsThree size={24} weight="bold" className="text-white" />
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 pointer-events-auto z-10">
            {/* Profile */}
            <button 
              onClick={() => startConversation(work.user_id || work.worker_id)}
              className="relative group"
            >
              <div className="h-12 w-12 rounded-full border-2 border-white bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                {work.user_name?.charAt(0) || '?'}
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-[#FF0050] flex items-center justify-center">
                <PaperPlaneTilt size={12} weight="fill" className="text-white" />
              </div>
            </button>

            {/* Like */}
            <button onClick={() => handleLike(work)} className="flex flex-col items-center gap-1">
              <Heart 
                size={32} 
                weight={work.liked_by_me ? "fill" : "regular"} 
                className={`${work.liked_by_me ? 'text-red-500' : 'text-white'} transition-colors`} 
              />
              <span className="text-white text-xs font-semibold">
                {(work.real_likes || work.likes_count || 0).toLocaleString()}
              </span>
            </button>

            {/* Comment */}
            <button className="flex flex-col items-center gap-1">
              <ChatCircleDots size={32} weight="regular" className="text-white" />
              <span className="text-white text-xs font-semibold">
                {(work.real_comments || work.comments_count || 0).toLocaleString()}
              </span>
            </button>

            {/* Save */}
            <button onClick={() => handleSave(work)} className="flex flex-col items-center gap-1">
              <BookmarkSimple
                size={32}
                weight={work.saved_by_me ? "fill" : "regular"}
                className={`${work.saved_by_me ? 'text-yellow-400' : 'text-white'} transition-colors`}
              />
            </button>

            {/* Share */}
            <button className="flex flex-col items-center gap-1">
              <ShareFat size={32} weight="regular" className="text-white" />
            </button>
          </div>

          {/* Bottom Content */}
          <div className="absolute left-4 bottom-10 right-20 pointer-events-none z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold text-base">{work.handle || work.user_name}</span>
              {work.verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
            </div>
            <p className="text-white text-sm font-normal leading-relaxed line-clamp-2">
              {work.description || 'Check out this amazing work!'}
            </p>
            <div className="mt-3 text-white/60 text-xs">
              #{work.trade.toLowerCase().replace(' ', '')} #workora #professional
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
