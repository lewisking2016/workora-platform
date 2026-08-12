'use client';

import React from 'react';
import {
  House,
  VideoCamera,
  Compass,
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
    { icon: VideoCamera, label: 'Works', href: '/dashboard/works' },
    { icon: PlusSquare, label: 'Create', href: '/dashboard/create' },
    { icon: Compass, label: 'Explore', href: '/dashboard/explore' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0D16]/95 backdrop-blur-2xl py-3 px-6 flex justify-around items-center z-[300] shadow-[0_-10px_40px_rgba(0,0,0,0.35)] border-t border-white/[0.06] safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 py-1.5 px-3 relative transition-all active:scale-95 group"
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeMobileIndicator"
                className="absolute -top-3 h-1 w-6 bg-gradient-to-r from-[#4D9FFF] to-[#7000FF] rounded-full shadow-[0_4px_12px_rgba(0,102,255,0.5)]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            <item.icon
              size={24}
              weight={isActive ? 'fill' : 'regular'}
              className={`transition-colors duration-200 ${
                isActive
                  ? 'text-[#4D9FFF]'
                  : 'text-white/40 group-hover:text-white/70'
              }`}
            />

            <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-[#4D9FFF] to-[#A78BFA] bg-clip-text text-transparent'
                : 'text-white/35 group-hover:text-white/60'
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
