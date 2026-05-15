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
    <aside className="hidden lg:flex flex-col justify-between w-[240px] h-full flex-shrink-0 bg-white z-50 pt-8 border-r border-zinc-50">
      <div className="flex flex-col h-full">
        <Link href="/" className="flex items-center gap-3 mb-10 px-6 group">
          <div className="relative h-14 w-14 transform group-hover:scale-110 transition-transform">
            <Image src="/logo/workora_logo.png" alt="Workora" fill sizes="40px" className="object-contain" />
          </div>
          <span className="font-black text-xl tracking-tighter text-[#0066FF]">Workora</span>
        </Link>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <button className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all text-[15px] ${isActive ? 'text-[#0066FF]' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}>
                  <item.icon size={26} weight={isActive ? 'fill' : 'regular'} />
                  <span className={isActive ? 'font-black' : 'font-semibold'}>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button className="flex items-center gap-4 w-full p-3 rounded-xl text-zinc-500 hover:bg-zinc-50 transition-all text-[15px] font-bold">
            <List size={26} /> More
          </button>
        </div>
      </div>
    </aside>
  );
}
