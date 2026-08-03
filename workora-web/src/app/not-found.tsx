'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { House, MagnifyingGlass, WarningCircle } from '@phosphor-icons/react';

import { trackAnalyticsEvent } from '@/lib/analytics';

export default function NotFound() {
  useEffect(() => {
    trackAnalyticsEvent('screen_not_found', {
      reason: 'route_missing',
    });
  }, []);

  return (
    <div className="min-h-[70vh] px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[28px] border border-zinc-200 bg-white p-8 text-center shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] text-white">
          <WarningCircle size={36} weight="bold" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#0066FF] dark:text-[#00D1FF]">Page not found</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">This screen does not exist</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          The link may be outdated or the page may have moved. Search for what you need or return home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-black text-white transition-transform hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
          >
            <House size={18} weight="bold" />
            Home
          </Link>
          <Link
            href="/dashboard/search"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
          >
            <MagnifyingGlass size={18} weight="bold" />
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
