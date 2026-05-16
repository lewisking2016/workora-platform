'use client';

import React from 'react';
import { 
  House, 
  MagnifyingGlass, 
  PlusSquare, 
  ChatCircleDots, 
  UserCircle 
} from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: House, label: 'Home', href: '/dashboard/feed' },
    { icon: MagnifyingGlass, label: 'Search', href: '/dashboard/search' },
    { icon: PlusSquare, label: 'Create', href: '/dashboard/create', isCenter: true },
    { icon: ChatCircleDots, label: 'Chat', href: '/dashboard/messages' },
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl p-4 px-8 flex justify-between items-center z-[300] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-zinc-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        if (item.isCenter) {
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className="bg-[#0066FF] h-12 w-12 rounded-[20px] shadow-lg shadow-blue-500/40 flex items-center justify-center transform -translate-y-6 rotate-45 border-4 border-white transition-transform active:scale-90"
            >
              <item.icon size={26} weight="bold" className="text-white -rotate-45" />
            </Link>
          );
        }

        return (
          <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1">
            <item.icon 
              size={26} 
              weight={isActive ? "fill" : "regular"} 
              className={isActive ? "text-[#0066FF]" : "text-zinc-400"} 
            />
            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "text-[#0066FF]" : "text-zinc-400"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
