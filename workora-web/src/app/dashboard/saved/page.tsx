'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookmarkSimple,
  Play,
  Heart,
  ChatCircleDots,
  FolderSimple,
  MagnifyingGlass,
  UserCircle,
  Layout,
} from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '@/lib/config';
import { SafeMediaThumb } from '@/components/SafeMediaThumb';

interface Gig {
  id: string;
  title: string;
  description: string;
  user_name: string;
  trade: string;
  verified: boolean;
  thumbnail_url: string;
  video_url: string;
  likes_count: number;
  comments_count: number;
  saved_at?: string;
  real_likes?: number;
  real_comments?: number;
}

interface Collection {
  id: string;
  title: string;
  description?: string;
  kind?: string;
  is_public?: boolean;
  cover_url?: string;
  item_count?: number;
  save_count?: number;
}

type LibraryTab = 'items' | 'collections' | 'profiles' | 'searches';

export default function SavedPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<LibraryTab>('items');
  const router = useRouter();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const [savedRes, collectionsRes] = await Promise.all([
          fetch(`/api/gigs/saved/${user.id}`),
          fetch('/api/profile/collections?kind=saved'),
        ]);

        const savedData = await savedRes.json();
        const collectionsData = await collectionsRes.json();

        setGigs(Array.isArray(savedData) ? savedData : []);
        setCollections(Array.isArray(collectionsData) ? collectionsData : []);
      } catch (err) {
        console.error('Saved fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [router]);

  const headerStats = useMemo(() => ([
    { label: 'Saved posts', value: gigs.length.toLocaleString(), icon: Play },
    { label: 'Saved collections', value: collections.length.toLocaleString(), icon: FolderSimple },
    { label: 'Saved searches', value: 'Live', icon: MagnifyingGlass },
    { label: 'Saved profiles', value: 'Live', icon: UserCircle },
  ]), [collections.length, gigs.length]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white dark:bg-black">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100 dark:border-zinc-900 dark:bg-black/95 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-950 dark:text-white">Saved</h1>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Live library items, collections, searches, and profiles.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/explore')}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-black text-zinc-950 dark:border-zinc-800 dark:text-white"
          >
            <Layout size={16} weight="bold" />
            Open explore
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
        <div className="max-w-[935px] mx-auto px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {headerStats.map((item) => (
              <div key={item.label} className="rounded-[16px] border border-zinc-100 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">{item.label}</p>
                  <item.icon size={16} weight="fill" className="text-[#0066FF]" />
                </div>
                <p className="mt-3 text-2xl font-black text-zinc-950 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: 'items', label: 'Saved items' },
              { key: 'collections', label: 'Collections' },
              { key: 'profiles', label: 'Profiles' },
              { key: 'searches', label: 'Searches' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key as LibraryTab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-colors ${tab === item.key ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-[2px] md:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square animate-pulse bg-zinc-100 dark:bg-zinc-900" />
              ))}
            </div>
          ) : tab === 'items' ? (
            gigs.length > 0 ? (
              <div className="grid grid-cols-3 gap-[2px] md:grid-cols-4">
                {gigs.map((gig, i) => (
                  <motion.div
                    key={gig.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-[12px] bg-black"
                    onClick={() => router.push(`/dashboard/post/${gig.id}`)}
                  >
                    <SafeMediaThumb
                      src={gig.thumbnail_url || APP_CONFIG.defaults.thumbnail}
                      alt={gig.description || gig.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/35" />
                    <div className="absolute top-2 right-2">
                      <Play size={16} weight="fill" className="text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-1 font-semibold text-white">
                        <Heart size={20} weight="fill" />
                        <span className="text-sm">{(gig.real_likes || gig.likes_count || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-white">
                        <ChatCircleDots size={20} weight="fill" />
                        <span className="text-sm">{(gig.real_comments || gig.comments_count || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center text-center gap-4 px-4">
                <div className="h-20 w-20 rounded-full border border-zinc-950 dark:border-white flex items-center justify-center">
                  <BookmarkSimple size={40} weight="regular" className="text-zinc-950 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-zinc-950 dark:text-white">No saved items yet</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[280px] mx-auto">
                    Save live posts, reels, and work examples from the feed and they will appear here.
                  </p>
                </div>
              </div>
            )
          ) : tab === 'collections' ? (
            collections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => router.push(`/dashboard/saved/collection-${collection.id}`)}
                    className="overflow-hidden rounded-[16px] border border-zinc-100 bg-white text-left dark:border-zinc-900 dark:bg-zinc-950"
                  >
                    <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-900">
                      {collection.cover_url ? (
                        <SafeMediaThumb src={collection.cover_url} alt={collection.title} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-black text-zinc-950 dark:text-white">{collection.title}</h3>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                          {collection.kind || 'collection'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{collection.description || 'Live collection data from the backend.'}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        <span>{collection.item_count || 0} items</span>
                        <span>{collection.save_count || 0} saves</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[16px] border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
                <FolderSimple size={32} weight="fill" className="mx-auto text-[#0066FF]" />
                <h3 className="mt-3 text-lg font-black text-zinc-950 dark:text-white">No collections yet</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Create public or private collections from live saved items.</p>
              </div>
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[16px] border border-zinc-100 bg-white p-6 dark:border-zinc-900 dark:bg-zinc-950">
                <UserCircle size={28} weight="fill" className="text-[#0066FF]" />
                <h3 className="mt-3 text-lg font-black text-zinc-950 dark:text-white">Saved profiles</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Profiles you save from discovery can be opened here once the profile save model is populated.</p>
                <button onClick={() => router.push('/dashboard/search')} className="mt-4 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-950 dark:border-zinc-800 dark:text-white">
                  Search profiles
                </button>
              </div>
              <div className="rounded-[16px] border border-zinc-100 bg-white p-6 dark:border-zinc-900 dark:bg-zinc-950">
                <MagnifyingGlass size={28} weight="fill" className="text-[#0066FF]" />
                <h3 className="mt-3 text-lg font-black text-zinc-950 dark:text-white">Saved searches</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Search queries can be persisted here once the saved-search backend endpoint is enabled.</p>
                <button onClick={() => router.push('/dashboard/search')} className="mt-4 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-950 dark:border-zinc-800 dark:text-white">
                  Open search
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
