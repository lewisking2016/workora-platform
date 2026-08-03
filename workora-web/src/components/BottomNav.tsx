'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Compass, UserPlus, Bell, UserCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: House, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/platform' },
  { icon: UserPlus, label: 'Join', href: '/join' },
  { icon: Bell, label: 'Alerts', href: '/login' },
  { icon: UserCircle, label: 'Profile', href: '/login' },
];

export function BottomNav() {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/join', '/forgot'].includes(pathname);
  const isDashboard = pathname.startsWith('/dashboard');

  if (isAuthPage || isDashboard) return null;

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
      <nav
        data-analytics-section="bottom_navigation"
        className="bg-white/90 dark:bg-[#0A0E17]/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden"
      >
        <div className="flex h-[72px] items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                data-analytics-label={item.label}
                data-analytics-event="bottom_nav_clicked"
                className="relative flex flex-col items-center justify-center w-full h-full gap-1 group"
              >
                {isActive && (
                  <motion.div 
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 w-8 h-1 bg-gradient-to-r from-[#0066FF] to-[#7000FF] rounded-b-full shadow-[0_4px_12px_rgba(0,102,255,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <Icon 
                  size={24} 
                  weight={isActive ? "fill" : "regular"} 
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? "text-[#0066FF] dark:text-[#00D1FF]" 
                      : "text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white"
                  }`} 
                />
                
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  isActive 
                    ? "text-zinc-950 dark:text-white" 
                    : "text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
