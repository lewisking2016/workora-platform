'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, Bell, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: PlusCircle, label: 'Join', href: '/join' },
  { icon: Bell, label: 'Alerts', href: '/notifications' },
  { icon: User, label: 'Passport', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/join', '/forgot'].includes(pathname);

  if (isAuthPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/60 backdrop-blur-xl lg:hidden safe-area-bottom">
      <div className="flex h-20 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative',
                isActive ? 'text-brand scale-110' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-6 w-6 transition-all', isActive && 'stroke-[2.5px]')} />
              <span className={cn(
                'text-[9px] font-bold uppercase tracking-wider transition-all',
                isActive ? 'opacity-100' : 'opacity-60'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-2 h-1 w-1 rounded-full bg-brand shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
