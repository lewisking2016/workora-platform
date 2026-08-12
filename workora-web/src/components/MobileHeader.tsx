'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  PaperPlaneTilt,
  Bell,
  List,
  Compass,
  BookmarkSimple,
  ChartBar,
  Briefcase,
  Suitcase,
  GearSix,
  SignOut,
  X,
  CaretRight
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch, clearLegacySession } from '@/lib/session';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Pages that stay immersive (fullscreen video) — no chrome on top. */
const IMMERSIVE_PREFIXES = ['/dashboard/works', '/dashboard/stories', '/dashboard/reels'];

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isImmersive = IMMERSIVE_PREFIXES.some((p) => pathname?.startsWith(p));
  if (isImmersive) return null;

  const refreshUnread = useCallback(async () => {
    try {
      const res = await apiFetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setUnread(data.filter((n: { is_read?: boolean }) => !n.is_read).length);
      }
    } catch {
      /* silent — bell dot is progressive enhancement */
    }
  }, []);

  useEffect(() => {
    refreshUnread();
    const t = setInterval(refreshUnread, 45000);
    return () => clearInterval(t);
  }, [refreshUnread]);

  const signOut = () => {
    clearLegacySession();
    document.cookie = 'token=; Max-Age=0; path=/; domain=.imeantech.com';
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/login');
  };

  const moreItems = [
    { icon: Compass, label: 'Explore', href: '/dashboard/explore', desc: 'Discover professionals near you' },
    { icon: Suitcase, label: 'Browse Jobs', href: '/dashboard/jobs', desc: 'Find work posted by businesses' },
    { icon: Briefcase, label: 'Business Hub', href: '/dashboard/business', desc: 'Post a job · manage hires' },
    { icon: BookmarkSimple, label: 'Saved', href: '/dashboard/saved', desc: 'Your library & collections' },
    { icon: ChartBar, label: 'Analytics', href: '/dashboard/analytics', desc: 'Performance & reach' },
    { icon: GearSix, label: 'Notification settings', href: '/dashboard/notifications/settings', desc: 'Control what you get alerted on' },
  ];

  return (
    <>
      <header className="lg:hidden relative z-[290] flex h-14 w-full shrink-0 items-center justify-between bg-[#0A0D16]/95 px-4 backdrop-blur-2xl border-b border-white/[0.06] safe-area-top">
        {/* Brand */}
        <Link href="/dashboard/feed" className="flex items-center group">
          <Image
            src="/logo/workora_logo_white.png"
            alt="Workora"
            width={110}
            height={27}
            className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            priority
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => router.push('/dashboard/messages')}
            aria-label="Messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/70 transition-all hover:bg-white/[0.1] hover:text-white active:scale-95"
          >
            <PaperPlaneTilt size={20} weight="bold" />
          </button>

          <button
            onClick={() => router.push('/dashboard/notifications')}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/70 transition-all hover:bg-white/[0.1] hover:text-white active:scale-95"
          >
            <Bell size={20} weight="bold" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#FF0050] to-[#FF8A00] px-1 text-[9px] font-black text-white shadow-[0_2px_8px_rgba(255,0,80,0.5)]">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          <button
            onClick={() => setSheetOpen(true)}
            aria-label="More"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/70 transition-all hover:bg-white/[0.1] hover:text-white active:scale-95"
          >
            <List size={22} weight="bold" />
          </button>
        </div>
      </header>

      {/* ─── More bottom sheet ─── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="lg:hidden fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[410] rounded-t-3xl border-t border-white/10 bg-[#0D1120] pb-6 safe-area-bottom shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
              role="dialog"
              aria-label="More"
            >
              <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-white/15" />
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <p className="text-sm font-black uppercase tracking-widest text-white/50">More</p>
                <button
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 hover:text-white active:scale-95"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              <div className="px-3">
                {moreItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF]/20 to-[#7000FF]/20 text-[#4D9FFF]">
                        <item.icon size={20} weight="bold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-white group-hover:text-[#4D9FFF] transition-colors">{item.label}</p>
                        <p className="text-[11px] font-medium text-white/40">{item.desc}</p>
                      </div>
                      <CaretRight size={16} className="text-white/25 group-hover:text-white/60 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mx-3 mt-2 border-t border-white/[0.06] pt-2">
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-red-500/[0.08]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                    <SignOut size={20} weight="bold" />
                  </div>
                  <p className="text-sm font-black text-red-400">Sign out</p>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
