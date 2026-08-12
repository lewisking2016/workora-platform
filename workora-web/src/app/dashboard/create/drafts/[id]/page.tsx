'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ClockCounterClockwise, Trash, PaperPlaneTilt } from '@phosphor-icons/react';
import { fetchCurrentUser, apiFetch } from '@/lib/session';
import { SafeMediaThumb } from '@/components/SafeMediaThumb';

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
}

export default function DraftDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const draftId = params?.id;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await fetchCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const res = await apiFetch(`/api/profile/drafts/${draftId}`);
        if (!res.ok) throw new Error('Draft not found');
        const data = await res.json();
        setDraft(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (draftId) void load();
  }, [draftId, router]);

  const publishDraft = async () => {
    if (!draft) return;
    const user = await fetchCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const profileRes = await apiFetch('/api/profile/me');
    const profileData = await profileRes.json().catch(() => ({}));
    const profileId = profileData?.profile?.id;
    if (!profileId) return;

    await apiFetch('/api/gigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        worker_id: profileId,
        user_id: user.id,
        title: draft.title || 'Draft work',
        description: draft.description || '',
        video_url: draft.media_url || draft.thumbnail_url || '',
        thumbnail_url: draft.thumbnail_url || draft.media_url || '',
        category: draft.trade || 'work',
      }),
    });

    await apiFetch(`/api/profile/drafts/${draft.id}`, { method: 'DELETE' });
    router.push('/dashboard/create/published-success');
  };

  const removeDraft = async () => {
    if (!draft) return;
    await apiFetch(`/api/profile/drafts/${draft.id}`, { method: 'DELETE' });
    router.push('/dashboard/create/drafts');
  };

  if (loading) {
    return <div className="min-h-full bg-zinc-50 dark:bg-[#0A0E17]" />;
  }

  if (!draft) {
    return (
      <div className="min-h-full bg-zinc-50 px-4 py-10 dark:bg-[#0A0E17]">
        <div className="mx-auto max-w-3xl rounded-[18px] border border-zinc-100 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Draft not found.</p>
          <button onClick={() => router.push('/dashboard/create/drafts')} className="mt-5 rounded-xl bg-[#0066FF] px-5 py-3 text-sm font-black text-white">
            Back to drafts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-zinc-50 px-4 py-6 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <button onClick={() => router.back()} className="inline-flex w-fit items-center gap-2 text-sm font-black text-zinc-500 dark:text-zinc-400">
          <ArrowLeft size={16} weight="bold" />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[18px] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="aspect-video bg-zinc-100 dark:bg-zinc-900">
              {draft.thumbnail_url ? (
                <SafeMediaThumb src={draft.thumbnail_url} alt={draft.title || draft.draft_type} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-zinc-950 dark:text-white">{draft.title || `${draft.draft_type} draft`}</h1>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  {draft.status || 'draft'}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">{draft.description || 'Saved live draft content.'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[18px] border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Draft metadata</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400">Type</span>
                  <span className="font-black text-zinc-950 dark:text-white">{draft.draft_type}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400">Trade</span>
                  <span className="font-black text-zinc-950 dark:text-white">{draft.trade || '-'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400">Location</span>
                  <span className="font-black text-zinc-950 dark:text-white">{draft.location || '-'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500 dark:text-zinc-400">Audience</span>
                  <span className="font-black text-zinc-950 dark:text-white">{draft.audience || 'public'}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <button onClick={publishDraft} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
                <PaperPlaneTilt size={16} weight="bold" />
                Publish draft
              </button>
              <button onClick={removeDraft} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
                <Trash size={16} weight="bold" />
                Delete draft
              </button>
              <button onClick={() => router.push('/dashboard/create/new')} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
                <ClockCounterClockwise size={16} weight="bold" />
                Continue editing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
