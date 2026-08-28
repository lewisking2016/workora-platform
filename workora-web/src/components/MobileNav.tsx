'use client';

import React from 'react';
import {
  House,
  MagnifyingGlass,
  VideoCamera,
  UserCircle,
  PlusSquare
} from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: House, label: 'Home', href: '/dashboard/feed' },
    { icon: MagnifyingGlass, label: 'Search', href: '/dashboard/search' },
    { icon: PlusSquare, label: 'Create', href: '/dashboard/create', accent: true },
    { icon: VideoCamera, label: 'Works', href: '/dashboard/works' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0D16]/95 backdrop-blur-2xl z-[300] shadow-[0_-10px_40px_rgba(0,0,0,0.35)] border-t border-white/[0.06] safe-area-bottom">
      <div className="flex h-[60px] items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="relative flex h-full min-w-[52px] flex-col items-center justify-center gap-0.5 transition-all active:scale-90 group"
            >
              {isActive && !item.accent && (
                <motion.div
                  layoutId="activeMobileIndicator"
                  className="absolute -top-[1px] h-[3px] w-7 rounded-b-full bg-gradient-to-r from-[#0066FF] shadow-[0_4px_12px_rgba(0,102,255,0.5)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {item.accent ? (
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-[0_8px_24px_rgba(0,102,255,0.45)] -translate-y-2'
                    : 'bg-white/[0.06] text-white/70 group-hover:bg-white/[0.12] group-hover:text-white -translate-y-2'
                }`}>
                  <Icon size={22} weight={isActive ? 'fill' : 'bold'} />
                </span>
              ) : (
                <Icon
                  size={22}
                  weight={isActive ? 'fill' : 'regular'}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-[#4D9FFF]' : 'text-white/40 group-hover:text-white/70'
                  }`}
                />
              )}

              <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-200 ${
                isActive
                  ? 'bg-[#0066FF] bg-clip-text text-transparent'
                  : 'text-white/35 group-hover:text-white/60'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
