'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';
import { ProfileTrustSurface } from '@/components/profile/ProfileTrustSurface';

type ProfileBundle = React.ComponentProps<typeof ProfileTrustSurface>['bundle'];

export default function ProfilePage() {
  const router = useRouter();
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!active) return;

      if (!user?.id) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch('/api/profile/me');
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            router.replace('/login');
            return;
          }
          throw new Error(data?.error || data?.message || 'Failed to load profile');
        }
        setBundle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-[#4F46E5]">
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-8 text-center dark:bg-black">
        <WarningCircle size={64} weight="duotone" className="text-rose-500" />
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Could not load your profile</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{error || 'The profile service did not return live data.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.location.reload()} className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
            Retry
          </button>
          <Link href="/login" className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-[5%] py-6 text-zinc-950 dark:bg-black dark:text-white md:px-[8%]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Profile</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Your trust surface</h1>
          </div>
          <Link href="/profile/edit" className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
            Edit profile
          </Link>
        </div>

        <ProfileTrustSurface mode="owner" bundle={bundle} />
      </div>
    </div>
  );
}
