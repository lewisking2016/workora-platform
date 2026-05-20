'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

export function MobileHeader() {
  const router = useRouter();

  return (
    <header className="lg:hidden flex h-16 w-full items-center justify-between px-6 bg-white/90 backdrop-blur-2xl border-b border-zinc-100/60 sticky top-0 z-[299] shrink-0">
      {/* Brand logo / wordmark on the left */}
      <Link href="/dashboard/feed" className="flex items-center gap-2 group">
        <div className="relative h-9 w-9 transform group-hover:scale-105 transition-transform">
          <Image 
            src="/logo/workora_logo.png" 
            alt="Workora Logo" 
            fill 
            sizes="36px" 
            className="object-contain" 
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
        className="h-10 w-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 active:scale-95 transition-all relative shadow-sm"
      >
        <PaperPlaneTilt size={20} weight="bold" />
        
        {/* Glowing Indicator Dot for Notifications */}
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#0066FF] border-2 border-white animate-pulse" />
      </button>
    </header>
  );
}
