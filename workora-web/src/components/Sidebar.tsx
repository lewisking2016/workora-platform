'use client';

import React from 'react';
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
  VideoCamera
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

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
    { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <aside
      data-analytics-section="sidebar_navigation"
      className="hidden lg:flex flex-col justify-between w-[240px] h-full flex-shrink-0 bg-white dark:bg-zinc-950 z-50 pt-8 border-r border-zinc-50 dark:border-zinc-900"
    >
      <div className="flex flex-col h-full">
        <Link href="/" className="flex items-center justify-center mb-10 px-6 group">
          <div className="relative h-14 w-14 transform group-hover:scale-110 transition-transform">
            <Image src="/logo/workora_logo.png" alt="Workora" fill sizes="40px" className="object-contain dark:invert" />
          </div>
        </Link>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <button
                  data-analytics-label={item.label}
                  data-analytics-event="sidebar_nav_clicked"
                  className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all text-[15px] ${isActive ? 'text-[#0066FF] dark:text-[#00D1FF]' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                >
                  <item.icon size={26} weight={isActive ? 'fill' : 'regular'} />
                  <span className={isActive ? 'font-black' : 'font-semibold'}>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            data-analytics-label="More"
            data-analytics-event="sidebar_more_clicked"
            className="flex items-center gap-4 w-full p-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-[15px] font-bold"
          >
            <List size={26} /> More
          </button>
        </div>
      </div>
    </aside>
  );
}
