'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookmarkSimple, FolderSimple, Play, UserCircle } from '@phosphor-icons/react';
import { fetchCurrentUser, apiFetch } from '@/lib/session';
import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { APP_CONFIG } from '@/lib/config';

interface CollectionItem {
  id: string;
  item_type?: string;
  gig_id?: string | null;
  profile_id?: string | null;
  position?: number;
  gig_title?: string | null;
  gig_description?: string | null;
  gig_thumbnail_url?: string | null;
  gig_video_url?: string | null;
  profile_full_name?: string | null;
  profile_display_name?: string | null;
  profile_avatar_url?: string | null;
  profile_trade?: string | null;
  profile_location?: string | null;
}

interface CollectionDetail {
  id: string;
  title: string;
  description?: string;
  kind?: string;
  is_public?: boolean;
  cover_url?: string;
  owner_user_id?: string;
  item_count?: number;
  save_count?: number;
  items?: CollectionItem[];
}

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams<{ collectionId: string }>();
  const collectionId = params?.collectionId;
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const user = await fetchCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const res = await apiFetch(`/api/profile/collections/${collectionId}`);
        if (!res.ok) throw new Error('Collection not found');
        const data = await res.json();
        setCollection(data);
      } catch (error) {
        console.error('Failed to load collection:', error);
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) void load();
  }, [collectionId, router]);

  const saveCollection = async () => {
    if (!collectionId) return;
    setSaving(true);
    try {
      await apiFetch(`/api/profile/collections/${collectionId}/save`, { method: 'POST' });
    } finally {
      setSaving(false);
    }
  };

  const itemCount = useMemo(() => collection?.items?.length || collection?.item_count || 0, [collection]);

  if (loading) {
    return <div className="min-h-full bg-zinc-50 dark:bg-[#0A0E17]" />;
  }

  if (!collection) {
    return (
      <div className="min-h-full bg-zinc-50 px-4 py-10 dark:bg-[#0A0E17]">
        <div className="mx-auto max-w-3xl rounded-[18px] border border-zinc-100 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Collection not found.</p>
          <button onClick={() => router.push('/dashboard/saved')} className="mt-5 rounded-xl bg-[#0066FF] px-5 py-3 text-sm font-black text-white">
            Back to saved
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-zinc-50 px-4 py-6 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <button onClick={() => router.back()} className="inline-flex w-fit items-center gap-2 text-sm font-black text-zinc-500 dark:text-zinc-400">
          <ArrowLeft size={16} weight="bold" />
          Back
        </button>

        <div className="overflow-hidden rounded-[18px] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="aspect-[16/7] bg-zinc-100 dark:bg-zinc-900">
            {collection.cover_url ? <SafeMediaThumb src={collection.cover_url} alt={collection.title} className="h-full w-full object-cover" /> : null}
          </div>
          <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Collection detail</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">{collection.title}</h1>
              <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">{collection.description || 'Live collection data from the backend.'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={saveCollection}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
              >
                <BookmarkSimple size={16} weight="bold" />
                {saving ? 'Saving' : 'Save collection'}
              </button>
              <div className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
                {itemCount} items
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(collection.items || []).map((item) => {
            const isProfile = Boolean(item.profile_id);
            const isGig = Boolean(item.gig_id);
            return (
              <div key={item.id} className="overflow-hidden rounded-[18px] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                  {isGig && item.gig_thumbnail_url ? (
                    <SafeMediaThumb src={item.gig_thumbnail_url} alt={item.gig_title || 'Collection item'} className="h-full w-full object-cover" />
                  ) : isProfile && item.profile_avatar_url ? (
                    <SafeMediaThumb src={item.profile_avatar_url} alt={item.profile_full_name || 'Profile'} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="truncate text-sm font-black text-zinc-950 dark:text-white">
                      {item.gig_title || item.profile_display_name || item.profile_full_name || 'Saved item'}
                    </h2>
                    {isGig ? <Play size={14} weight="fill" className="text-[#0066FF]" /> : <UserCircle size={14} weight="fill" className="text-[#0066FF]" />}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {item.gig_description || `${item.profile_trade || 'Professional'} ${item.profile_location ? `- ${item.profile_location}` : ''}`}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span>{item.item_type || 'item'}</span>
                    <span>Live backend</span>
                  </div>
                </div>
              </div>
            );
          })}

          {itemCount === 0 ? (
            <div className="rounded-[18px] border border-dashed border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <FolderSimple size={32} weight="fill" className="mx-auto text-[#0066FF]" />
              <h2 className="mt-3 text-lg font-black text-zinc-950 dark:text-white">No items yet</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Add live posts or profiles to build this collection.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
