'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderOpen, Heart } from '@phosphor-icons/react';
import { CollectionCardView, CollectionCard } from '@/components/discovery/cards';
import { apiFetch } from '@/lib/session';

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<CollectionCard[]>([]);
  const [savedCollections, setSavedCollections] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'public' | 'saved'>('public');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [publicRes, savedRes] = await Promise.all([
          apiFetch('/api/profile/collections'),
          apiFetch('/api/profile/collections?kind=saved'),
        ]);
        const publicData = await publicRes.json();
        const savedData = await savedRes.json();
        if (!mounted) return;
        setCollections(Array.isArray(publicData) ? publicData : []);
        setSavedCollections(Array.isArray(savedData) ? savedData : []);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const active = tab === 'public' ? collections : savedCollections;

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 pb-24 lg:px-6 lg:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/explore" className="rounded-xl bg-white p-2 text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF]">Nodes explorer</p>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <FolderOpen size={22} weight="fill" className="text-[#0066FF]" /> Collections
          </h1>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab('public')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${tab === 'public' ? 'bg-[#0057FF] text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
        >
          <FolderOpen size={16} /> Public · {collections.length}
        </button>
        <button
          onClick={() => setTab('saved')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${tab === 'saved' ? 'bg-[#0057FF] text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
        >
          <Heart size={16} /> Saved · {savedCollections.length}
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>
      ) : active.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {active.map(collection => <CollectionCardView key={collection.id} collection={collection} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-10 text-center dark:bg-zinc-950">
          <FolderOpen size={32} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-semibold">{tab === 'public' ? 'No public collections yet' : 'You have not saved any collections'}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {tab === 'public'
              ? 'Collections of saved work will appear here as creators publish them.'
              : 'Tap the bookmark on any collection to save it here.'}
          </p>
        </div>
      )}
    </div>
  );
}
