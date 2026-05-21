'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

export function MobileHeader() {
  const router = useRouter();

  return (
    <header className="lg:hidden flex h-16 w-full items-center justify-between px-6 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-100/60 dark:border-zinc-800 sticky top-0 z-[299] shrink-0">
      {/* Brand logo / wordmark on the left */}
      <Link href="/dashboard/feed" className="flex items-center gap-2 group">
        <div className="relative h-9 w-9 transform group-hover:scale-105 transition-transform">
          <Image 
            src="/logo/workora_logo.png" 
            alt="Workora Logo" 
            fill 
            sizes="36px" 
            className="object-contain dark:invert" 
            priority
          />
        </div>
        <span className="font-display font-black text-xl tracking-tighter bg-gradient-to-r from-[#0066FF] to-[#7000FF] bg-clip-text text-transparent italic">
          Workora
        </span>
      </Link>

      {/* Messages/Notifications button on the top right */}
      <button 
        onClick={() => router.push('/dashboard/notifications')}
        className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 active:scale-95 transition-all relative shadow-sm"
      >
        <PaperPlaneTilt size={20} weight="bold" />
        
        {/* Glowing Indicator Dot for Notifications */}
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#0066FF] border-2 border-white dark:border-zinc-950 animate-pulse" />
      </button>
    </header>
  );
}
