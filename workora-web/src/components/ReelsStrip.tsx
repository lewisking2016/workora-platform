"use client";

import React, { useEffect, useState } from 'react';
import { VideoCard } from '@/components/VideoCard';

interface Reel {
  id: string;
  thumbnail_url?: string;
  video_url?: string;
  avatar_url?: string;
  user_name?: string;
  title?: string;
  view_count?: number;
}

export function ReelsStrip() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchReels() {
      try {
        // Use the same-origin proxy so auth and environment config are consistent.
        const res = await fetch('/api/gigs/feed?page=1&limit=8');
        if (!res.ok) throw new Error('Failed fetching');
        const data = await res.json();
        // No demo fallback: empty/error states render as empty.
        if (mounted && Array.isArray(data)) {
          setReels(data);
        }
      } catch (e) {
        console.error('Reels fetch error', e);
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

  if (reels.length === 0) {
    return null;
  }

  return (
    <>
      {reels.map((r) => (
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
