'use client';

import React, { useEffect, useState } from 'react';
import {
  House,
  MagnifyingGlass,
  Compass,
  Heart,
  ChatCircleDots,
  PlusSquare,
  BookmarkSimple,
  ChartBar,
  UserCircle,
  List,
  VideoCamera,
  SignOut,
  CaretRight,
  Briefcase,
  Suitcase,
  GearSix,
  PaperPlaneTilt
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { clearLegacySession, fetchCurrentUser } from '@/lib/session';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchCurrentUser().then((user) => {
      if (mounted && user) {
        setUsername(user.username || '');
        setRole(user.role || '');
      }
    });
    return () => { mounted = false; };
  }, []);

  // Only professionals get the "Pro" label; verification is never claimed
  // here because this surface doesn't carry the verified state.
  const isPro = ['worker', 'pro'].includes(role.toLowerCase());
  const badgeLabel = isPro ? 'Pro' : 'Member';

  const menuItems = [
    { icon: House, label: 'Home', href: '/dashboard/feed' },
    { icon: MagnifyingGlass, label: 'Search', href: '/dashboard/search' },
    { icon: Compass, label: 'Explore', href: '/dashboard/explore' },
    { icon: VideoCamera, label: 'Works', href: '/dashboard/works' },
    { icon: ChatCircleDots, label: 'Messages', href: '/dashboard/messages' },
    { icon: Heart, label: 'Notifications', href: '/dashboard/notifications' },
    { icon: PlusSquare, label: 'Create', href: '/dashboard/create' },
    { icon: BookmarkSimple, label: 'Saved', href: '/dashboard/saved' },
    { icon: ChartBar, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Briefcase, label: 'Business', href: '/dashboard/business' },
    { icon: Suitcase, label: 'My Applications', href: '/dashboard/my-applications' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <aside
      data-analytics-section="sidebar_navigation"
      className="hidden lg:flex flex-col justify-between w-[248px] h-full flex-shrink-0 bg-[#0A0D16] text-white z-50 border-r border-white/5 relative overflow-hidden"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-[280px] w-[280px] rounded-full bg-[#0066FF]/15 blur-[90px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

      <div className="relative flex flex-col h-full">
        {/* Brand */}
        <Link href="/" className="flex items-center px-6 pt-7 pb-8 group w-fit">
          <Image
            src="/logo/workora_logo_white.png"
            alt="Workora"
            width={120}
            height={29}
            className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}>
                <motion.button
                  data-analytics-label={item.label}
                  data-analytics-event="sidebar_nav_clicked"
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={`relative flex items-center gap-3.5 w-full p-3 rounded-xl transition-colors text-[14px] ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0066FF]/25 to-[#7000FF]/15 ring-1 ring-[#4D9FFF]/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    size={22}
                    weight={isActive ? 'fill' : 'regular'}
                    className={`relative shrink-0 ${isActive ? 'text-[#4D9FFF]' : ''}`}
                  />
                  <span className={`relative ${isActive ? 'font-black' : 'font-semibold'}`}>{item.label}</span>
                  {isActive && <CaretRight size={12} weight="bold" className="relative ml-auto text-[#4D9FFF]" />}
                </motion.button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + more */}
        <div className="relative p-3 space-y-2 border-t border-white/5 mt-4">
          <AnimatePresence>
            {moreOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMoreOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-3 mb-2 z-50 w-64 rounded-2xl border border-white/[0.08] bg-[#0D1120] p-1.5 shadow-2xl"
                >
                  {[
                    { icon: Suitcase, label: 'Browse Jobs', href: '/dashboard/jobs' },
                    { icon: PaperPlaneTilt, label: 'My Applications', href: '/dashboard/my-applications' },
                    { icon: Briefcase, label: 'Business Hub', href: '/dashboard/business' },
                    { icon: GearSix, label: 'Notification settings', href: '/dashboard/notifications/settings' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <item.icon size={18} className="text-[#4D9FFF]" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-white/[0.06]" />
                  <button
                    onClick={() => {
                      clearLegacySession();
                      document.cookie = 'token=; Max-Age=0; path=/';
                      router.push('/login');
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <SignOut size={18} />
                    Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <button
            data-analytics-label="More"
            data-analytics-event="sidebar_more_clicked"
            onClick={() => setMoreOpen((v) => !v)}
            className="flex items-center gap-3.5 w-full p-3 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors text-[14px] font-bold"
          >
            <List size={22} /> More
            <CaretRight size={12} className={`ml-auto transition-transform ${moreOpen ? 'rotate-90' : ''}`} />
          </button>

          <Link href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4D9FFF] to-[#7000FF] flex items-center justify-center text-sm font-black text-white shrink-0">
              {username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black truncate">{username || 'Member'}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{badgeLabel}</p>
            </div>
            <SignOut size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
