'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowClockwise, House, WarningCircle } from '@phosphor-icons/react';

import { trackError } from '@/lib/analytics';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackError('global_error', error.message, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)] backdrop-blur">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] text-white">
            <WarningCircle size={36} weight="bold" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#00D1FF]">Global error</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight">The app hit a critical issue</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
            We captured the error so we can inspect it. Reload the app or return home to continue.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-zinc-950 transition-transform hover:scale-[1.02]"
            >
              <ArrowClockwise size={18} weight="bold" />
              Reload app
            </button>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-black text-white transition-colors hover:bg-white/10"
            >
              <House size={18} weight="bold" />
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
