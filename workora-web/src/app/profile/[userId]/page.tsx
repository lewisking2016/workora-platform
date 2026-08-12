'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProfileTrustSurface } from '@/components/profile/ProfileTrustSurface';
import { ProfileStateScreen } from '@/components/system/StatusScreens';
import { BookmarkSimple } from '@phosphor-icons/react';
import { apiFetch } from '@/lib/session';

type ProfileState =
  | 'ready'
  | 'empty'
  | 'not_found'
  | 'private'
  | 'restricted'
  | 'suspended'
  | 'verification_pending';

type ProfileBundle = React.ComponentProps<typeof ProfileTrustSurface>['bundle'] & {
  profile_state?: ProfileState;
};

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallbackState, setFallbackState] = useState<Exclude<ProfileState, 'ready'> | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!userId) {
        setFallbackState('not_found');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/profile/public/${userId}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 404) {
            if (active) setFallbackState('not_found');
            return;
          }

          if (active) {
            setFallbackState((data?.profile_state as Exclude<ProfileState, 'ready'>) || 'restricted');
          }
          return;
        }

        if (active) {
          const nextBundle = data as ProfileBundle;
          setBundle(nextBundle);
          if (nextBundle.profile_state && nextBundle.profile_state !== 'ready') {
            setFallbackState(nextBundle.profile_state);
          }
        }
      } catch {
        if (active) setFallbackState('restricted');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return <ProfileStateScreen state="loading" title="Loading public profile" description="We are fetching the latest public profile data from the backend." />;
  }

  const effectiveState = fallbackState || bundle?.profile_state || 'ready';

  if (effectiveState === 'not_found') return <ProfileStateScreen state="not_found" />;
  if (effectiveState === 'private') return <ProfileStateScreen state="private" />;
  if (effectiveState === 'restricted') return <ProfileStateScreen state="restricted" />;
  if (effectiveState === 'suspended') return <ProfileStateScreen state="suspended" />;
  if (effectiveState === 'verification_pending') return <ProfileStateScreen state="verification_pending" />;
  if (effectiveState === 'empty') return <ProfileStateScreen state="empty" />;

  if (!bundle) {
    return <ProfileStateScreen state="not_found" />;
  }

  const saveProfile = async () => {
    if (!bundle.profile?.id) return;
    setSavingProfile(true);
    try {
      await apiFetch('/api/profile/saved/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: bundle.profile.id }),
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-[5%] py-6 text-zinc-950 dark:bg-black dark:text-white md:px-[8%]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Public profile</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Live trust details</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white disabled:opacity-60"
            >
              <BookmarkSimple size={16} weight="bold" />
              {savingProfile ? 'Saving' : 'Save profile'}
            </button>
            <button onClick={() => router.back()} className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
              Back
            </button>
          </div>
        </div>

        <ProfileTrustSurface mode="public" bundle={bundle} />
      </div>
    </div>
  );
}
