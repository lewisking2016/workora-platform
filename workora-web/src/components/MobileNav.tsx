'use client';

import React from 'react';
import { 
  House, 
  VideoCamera,
  Compass, 
  UserCircle 
} from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: House, label: 'Home', href: '/dashboard/feed' },
    { icon: VideoCamera, label: 'Works', href: '/dashboard/works' },
    { icon: Compass, label: 'Explore', href: '/dashboard/explore' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl py-3 px-6 flex justify-around items-center z-[300] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] border-t border-zinc-100/60 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.label} 
            href={item.href} 
            className="flex flex-col items-center gap-1 py-1.5 px-3 relative transition-all active:scale-95 group"
          >
            {/* Active Glow/Indicator Pill at the bottom */}
            {isActive && (
              <motion.div 
                layoutId="activeMobileIndicator"
                className="absolute -top-3 h-1 w-6 bg-gradient-to-r from-[#0066FF] to-[#7000FF] rounded-full shadow-[0_4px_12px_rgba(0,102,255,0.4)]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}

            {/* Icon representation */}
            <item.icon 
              size={24} 
              weight={isActive ? "fill" : "regular"} 
              className={`transition-colors duration-200 ${
                isActive 
                  ? "text-[#0066FF]" 
                  : "text-zinc-400 group-hover:text-zinc-600"
              }`} 
            />

            {/* Label */}
            <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-200 ${
              isActive 
                ? "bg-gradient-to-r from-[#0066FF] to-[#7000FF] bg-clip-text text-transparent" 
                : "text-zinc-400 group-hover:text-zinc-600"
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
