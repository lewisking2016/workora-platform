"use client";

import React, { useEffect, useState } from 'react';
import { VideoCard } from '@/components/VideoCard';
import { getBackendBaseUrl } from '@/lib/backend-url';

interface Reel {
  id: string;
  thumbnail_url?: string;
  video_url?: string;
  avatar_url?: string;
  user_name?: string;
  title?: string;
  view_count?: number;
}

const MOCK_REELS: Reel[] = [
  {
    id: 'mock-1',
    thumbnail_url: '/landing/wiring-1.jpg',
    video_url: '',
    avatar_url: '/logo/workora_logo.png',
    user_name: 'David Mwangi',
    title: 'Professional House Wiring in Nairobi',
    view_count: 1420
  },
  {
    id: 'mock-2',
    thumbnail_url: '/landing/verified badge.jpeg',
    video_url: '',
    avatar_url: '/logo/workora_logo.png',
    user_name: 'Grace Amina',
    title: 'High Precision Steel Fabrication',
    view_count: 980
  },
  {
    id: 'mock-3',
    thumbnail_url: '/landing/The Video Feedback.png',
    video_url: '',
    avatar_url: '/logo/workora_logo.png',
    user_name: 'Joseph Ochieng',
    title: 'Cabinetry and Woodwork Installation',
    view_count: 2310
  },
  {
    id: 'mock-4',
    thumbnail_url: '/landing/workora 1.png',
    video_url: '',
    avatar_url: '/logo/workora_logo.png',
    user_name: 'Sarah Kamau',
    title: 'Modern Plumbing and Piping Design',
    view_count: 3120
  }
];

export function ReelsStrip() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchReels() {
      try {
        const base = getBackendBaseUrl();
        const res = await fetch(`${base}/gigs/feed?page=1&limit=8`);
        if (!res.ok) throw new Error('Failed fetching');
        const data = await res.json();
        if (mounted) {
          if (data && data.length > 0) {
            setReels(data);
          } else {
            setReels(MOCK_REELS);
          }
        }
      } catch (e) {
        console.error('Reels fetch error, falling back to mock reels', e);
        if (mounted) setReels(MOCK_REELS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchReels();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="flex gap-4">{Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="w-64 shrink-0 h-[360px] bg-zinc-100 rounded-2xl animate-pulse" />
    ))}</div>;
  }

  const displayReels = reels.length > 0 ? reels : MOCK_REELS;

  return (
    <>
      {displayReels.map((r) => (
        <div key={r.id} className="w-64 shrink-0 hover:scale-[1.02] transition-transform duration-200">
          <VideoCard
            id={r.id}
            thumbnailUrl={r.thumbnail_url ?? r.video_url ?? '/landing/workora 1.png'}
            workerAvatar={r.avatar_url && r.avatar_url !== '' ? r.avatar_url : '/logo/workora_logo.png'}
            workerName={r.user_name ?? 'Worker'}
            title={r.title ?? 'Untitled'}
            views={String(r.view_count ?? 0)}
          />
          <div className="mt-3 text-sm font-semibold line-clamp-1">{r.title ?? 'Untitled'}</div>
        </div>
      ))}
    </>
  );
}
