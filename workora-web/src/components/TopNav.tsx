'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe } from '@phosphor-icons/react';

import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();

  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-[5%] py-5 transition-all duration-300">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between rounded-full bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-3">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="relative flex items-center justify-center transition-transform hover:opacity-70">
            <div className="relative h-10 w-28">
              <Image 
                src="/logo/workora_logo.png"
                alt="Workora Logo"
                fill
                className="object-contain brightness-0"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
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
                <span className={`text-[13px] font-bold tracking-wide transition-colors ${
                  pathname === tab.href ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-950'
                }`}>
                  {tab.name}
                </span>
                {pathname === tab.href && (
                  <motion.div 
                    layoutId="activeTabDot"
                    className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-zinc-950"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Utilities & CTA */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link href="/blog" className="text-[13px] font-bold tracking-wide text-zinc-400 hover:text-zinc-950 transition-colors">
              Insights
            </Link>
            <button className="flex items-center gap-1 text-[13px] font-bold tracking-wide text-zinc-400 hover:text-zinc-950 transition-colors">
              <Globe size={16} /> EN
            </button>
          </div>

          <Link 
            href="/login" 
            className="group relative h-10 px-6 bg-zinc-950 text-white rounded-full font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] opacity-0 blur transition-opacity group-hover:opacity-40" />
            <span className="relative z-10">Get started</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
