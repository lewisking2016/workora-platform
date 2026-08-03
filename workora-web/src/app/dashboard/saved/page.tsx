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

interface SavedProfile {
  id: string;
  profile_id: string;
  full_name: string;
  display_name?: string;
  trade?: string;
  location?: string;
  avatar_url?: string;
  is_verified?: boolean;
  trust_score?: string | number;
  username?: string;
}

interface SavedSearch {
  id: string;
  query: string;
  filters?: Record<string, unknown>;
  created_at?: string;
}

type LibraryTab = 'items' | 'collections' | 'profiles' | 'searches';

export default function SavedPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<LibraryTab>('items');
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [collectionKind, setCollectionKind] = useState('custom');
  const [collectionPublic, setCollectionPublic] = useState(false);
  const [collectionSaving, setCollectionSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const [savedRes, collectionsRes, savedProfilesRes, savedSearchesRes] = await Promise.all([
          fetch(`/api/gigs/saved/${user.id}`),
          fetch('/api/profile/collections?kind=saved'),
          fetch('/api/profile/saved/profiles'),
          fetch('/api/profile/saved/searches'),
        ]);

        const savedData = await savedRes.json();
        const collectionsData = await collectionsRes.json();
        const savedProfilesData = await savedProfilesRes.json();
        const savedSearchesData = await savedSearchesRes.json();

        setGigs(Array.isArray(savedData) ? savedData : []);
        setCollections(Array.isArray(collectionsData) ? collectionsData : []);
        setSavedProfiles(Array.isArray(savedProfilesData) ? savedProfilesData : []);
        setSavedSearches(Array.isArray(savedSearchesData) ? savedSearchesData : []);
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
    { label: 'Saved searches', value: savedSearches.length.toLocaleString(), icon: MagnifyingGlass },
    { label: 'Saved profiles', value: savedProfiles.length.toLocaleString(), icon: UserCircle },
  ]), [collections.length, gigs.length, savedProfiles.length, savedSearches.length]);

  const createCollection = async () => {
    const title = collectionTitle.trim();
    if (!title) return;

    setCollectionSaving(true);
    try {
      const res = await fetch('/api/profile/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: collectionDescription.trim(),
          kind: collectionKind,
          is_public: collectionPublic,
        }),
      });

      if (!res.ok) throw new Error('Failed to create collection');

      setShowCreateCollection(false);
      setCollectionTitle('');
      setCollectionDescription('');
      setCollectionKind('custom');
      setCollectionPublic(false);
      const next = await fetch('/api/profile/collections');
      const nextData = await next.json();
      setCollections(Array.isArray(nextData) ? nextData : []);
      setTab('collections');
    } catch (error) {
      console.error('Create collection failed:', error);
    } finally {
      setCollectionSaving(false);
    }
  };

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

          {tab === 'collections' ? (
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateCollection(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-black text-white dark:bg-white dark:text-zinc-950"
              >
                Create collection
              </button>
            </div>
          ) : null}

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
                    onClick={() => router.push(`/dashboard/saved/collection/${collection.id}`)}
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
            tab === 'profiles' ? (
              savedProfiles.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => router.push(`/profile/${profile.profile_id}`)}
                      className="flex items-center gap-4 rounded-[16px] border border-zinc-100 bg-white p-4 text-left dark:border-zinc-900 dark:bg-zinc-950"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                        {profile.avatar_url ? <SafeMediaThumb src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-black text-zinc-950 dark:text-white">{profile.display_name || profile.full_name}</h3>
                          {profile.is_verified ? <BookmarkSimple size={14} weight="fill" className="text-[#0066FF]" /> : null}
                        </div>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{profile.trade || 'Profile'} - {profile.location || 'Kenya'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-[16px] border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
                  <UserCircle size={32} weight="fill" className="mx-auto text-[#0066FF]" />
                  <h3 className="mt-3 text-lg font-black text-zinc-950 dark:text-white">No saved profiles yet</h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Save a public profile from discovery or profile pages to populate this view.</p>
                </div>
              )
            ) : savedSearches.length > 0 ? (
              <div className="grid gap-3">
                {savedSearches.map((search) => (
                  <div key={search.id} className="rounded-[16px] border border-zinc-100 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
                    <p className="text-sm font-black text-zinc-950 dark:text-white">{search.query}</p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {search.created_at ? new Date(search.created_at).toLocaleString() : 'Saved live'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[16px] border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
                <MagnifyingGlass size={32} weight="fill" className="mx-auto text-[#0066FF]" />
                <h3 className="mt-3 text-lg font-black text-zinc-950 dark:text-white">No saved searches yet</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Searches performed in the live discovery view will be stored here.</p>
              </div>
            )
          )}
        </div>
      </main>

      {showCreateCollection ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-xl rounded-[18px] border border-zinc-100 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">New collection</p>
                <h3 className="mt-2 text-xl font-black text-zinc-950 dark:text-white">Create a live collection</h3>
              </div>
              <button onClick={() => setShowCreateCollection(false)} className="text-sm font-black text-zinc-500 dark:text-zinc-400">Close</button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Title</label>
                <input
                  value={collectionTitle}
                  onChange={(e) => setCollectionTitle(e.target.value)}
                  placeholder="Collection title"
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Description</label>
                <textarea
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                  placeholder="What lives in this collection?"
                  className="mt-2 min-h-28 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Type</label>
                  <select
                    value={collectionKind}
                    onChange={(e) => setCollectionKind(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  >
                    <option value="custom">Custom</option>
                    <option value="saved">Saved</option>
                    <option value="portfolio">Portfolio</option>
                  </select>
                </div>
                <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-950 dark:text-white">Public collection</span>
                  <input type="checkbox" checked={collectionPublic} onChange={(e) => setCollectionPublic(e.target.checked)} className="h-5 w-5" />
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setShowCreateCollection(false)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
                Cancel
              </button>
              <button
                onClick={createCollection}
                disabled={collectionSaving || !collectionTitle.trim()}
                className="rounded-xl bg-[#0066FF] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {collectionSaving ? 'Creating...' : 'Create collection'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
