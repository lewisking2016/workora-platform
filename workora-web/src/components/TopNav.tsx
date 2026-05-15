'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CaretDown, Globe } from '@phosphor-icons/react';

import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();

  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl px-[5%] py-4 border-b border-gray-100">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        
        {/* Left Side: Logo & Primary Tabs */}
        <div className="flex items-center gap-12">
          <Link href="/" className="relative h-16 w-16 bg-zinc-200/50 backdrop-blur-xl border border-white/50 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
            <div className="relative h-11 w-11">
              <Image 
                src="/logo/workora_logo.png"
                alt="Workora Logo"
                fill
                className="object-contain brightness-0"
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              { name: 'Personal', href: '/personal' },
              { name: 'Business', href: '/business' },
              { name: 'Platform', href: '/platform' }
            ].map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative flex flex-col items-center group"
              >
                <span className={`text-sm font-bold transition-colors ${
                  pathname === tab.href ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}>
                  {tab.name}
                </span>
                {pathname === tab.href && (
                  <motion.div 
                    layoutId="activeTabDot"
                    className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-[#0066FF]"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Utilities & CTA */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-black transition-colors">
              Features <CaretDown weight="bold" />
            </button>
            <Link href="/blog" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
              Blog
            </Link>
            <Link href="/help" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
              Help
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="h-12 px-8 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
            >
              Get started
            </Link>
            
            <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
              <Globe size={18} />
              <span>EN</span>
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}
