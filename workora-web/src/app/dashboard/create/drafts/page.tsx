'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookmarkSimple, ClockCounterClockwise, PencilSimple, Sparkle } from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';
import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { APP_CONFIG } from '@/lib/config';

interface Draft {
  id: string;
  draft_type: string;
  title?: string;
  description?: string;
  media_url?: string;
  thumbnail_url?: string;
  trade?: string;
  location?: string;
  audience?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await fetchCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/profile/drafts');
        const data = await res.json();
        setDrafts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  return (
    <div className="min-h-full bg-zinc-50 px-4 py-6 dark:bg-[#0A0E17] lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-[18px] border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-400">Drafts</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">Live drafts from the backend</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Save an in-progress post, reel, story, gig, or proof-of-work item and continue publishing from here.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-40 animate-pulse rounded-[18px] bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : drafts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {drafts.map((draft, index) => (
              <motion.button
                key={draft.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => router.push(`/dashboard/create/drafts/${draft.id}`)}
                className="overflow-hidden rounded-[18px] border border-zinc-100 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-900">
                  {draft.thumbnail_url ? (
                    <SafeMediaThumb src={draft.thumbnail_url} alt={draft.title || draft.draft_type} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Sparkle size={32} weight="fill" className="text-zinc-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-black text-zinc-950 dark:text-white">{draft.title || `${draft.draft_type} draft`}</h2>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                      {draft.status || 'draft'}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{draft.description || 'Saved live draft content.'}</p>
                  <div className="mt-4 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span>{draft.trade || 'Any trade'}</span>
                    <span>{draft.location || 'Any location'}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <BookmarkSimple size={36} weight="fill" className="mx-auto text-[#0066FF]" />
            <h2 className="mt-4 text-xl font-black text-zinc-950 dark:text-white">No drafts yet</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Save a draft from the creation flow and it will show up here.</p>
            <button onClick={() => router.push('/dashboard/create/new')} className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
              Open creation flow
            </button>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard/create/new')}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          <PencilSimple size={16} weight="bold" />
          Create new draft
        </button>
      </div>
    </div>
  );
}
