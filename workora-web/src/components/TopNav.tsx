'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, List, X } from '@phosphor-icons/react';
import { AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isSwahili, setIsSwahili] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsSwahili(document.cookie.includes('googtrans=/en/sw'));
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out ${scrolled ? 'bg-white/40 dark:bg-[#0A0E17]/40 backdrop-blur-2xl saturate-150 py-3' : 'bg-transparent py-6'}`}>
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 flex items-center justify-between">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-16">
          <Link href="/" className="relative flex items-center justify-center transition-transform hover:opacity-80">
            <div className="relative h-12 w-36 md:h-14 md:w-40">
              <Image 
                src="/logo/workora_logo.png"
                alt="Workora Logo"
                fill
                className="object-contain drop-shadow-sm dark:brightness-0 dark:invert"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { name: 'Personal', href: '/personal' },
              { name: 'Business', href: '/business' },
              { name: 'Platform', href: '/platform' }
            ].map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative group py-2"
              >
                <span className={`text-sm font-black tracking-wide drop-shadow-sm transition-colors duration-300 ${
                  pathname === tab.href ? 'text-[#0066FF] dark:text-[#00D1FF]' : 'text-zinc-900 hover:text-[#0066FF] dark:text-zinc-100 dark:hover:text-[#00D1FF]'
                }`}>
                  {tab.name}
                </span>
                {pathname === tab.href && (
                  <motion.div 
                    layoutId="topNavActiveLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#0066FF] to-[#7000FF]"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Utilities & CTA */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 mr-2">
            <Link href="/blog" className="text-sm font-black tracking-wide drop-shadow-sm text-zinc-900 hover:text-[#0066FF] dark:text-zinc-100 dark:hover:text-[#00D1FF] transition-colors">
              Insights
            </Link>
            <ThemeToggle />
            <button 
              onClick={() => {
                const newValue = isSwahili ? '/en/en' : '/en/sw';
                document.cookie = `googtrans=${newValue}; path=/`;
                window.location.reload();
              }}
              className="flex items-center gap-1.5 text-sm font-black tracking-wide drop-shadow-sm text-zinc-900 hover:text-[#0066FF] dark:text-zinc-100 dark:hover:text-[#00D1FF] transition-colors"
            >
              <Globe size={18} /> {isSwahili ? 'SW' : 'EN'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="hidden sm:flex h-10 px-6 items-center justify-center text-sm font-black text-zinc-900 drop-shadow-sm dark:text-white hover:opacity-70 transition-opacity"
            >
              Sign in
            </Link>
            <Link 
              href="/join" 
              className="group relative h-10 px-6 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-lg font-black text-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
            >
              <span className="relative z-10">Get Started</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden ml-2 h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white border border-zinc-100 dark:border-zinc-700"
            >
              <List size={24} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[200] bg-white dark:bg-[#0A0E17] flex flex-col px-6 py-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="relative h-12 w-36">
                <Image src="/logo/workora_logo.png" alt="Workora Logo" fill className="object-contain dark:brightness-0 dark:invert" priority />
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-white border border-zinc-100 dark:border-zinc-700"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-2xl font-black tracking-tighter">
              {[
                { name: 'Personal', href: '/personal' },
                { name: 'Business', href: '/business' },
                { name: 'Platform', href: '/platform' },
                { name: 'Insights', href: '/blog' }
              ].map((tab) => (
                <Link 
                  key={tab.name} 
                  href={tab.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-950 dark:text-white hover:text-[#0066FF] dark:hover:text-[#00D1FF] transition-colors"
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <ThemeToggle />
                <button 
                  onClick={() => {
                    const newValue = isSwahili ? '/en/en' : '/en/sw';
                    document.cookie = `googtrans=${newValue}; path=/`;
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 text-lg font-black tracking-wide text-zinc-950 dark:text-white"
                >
                  <Globe size={24} /> {isSwahili ? 'Swahili' : 'English'}
                </button>
              </div>
              <hr className="border-zinc-100 dark:border-zinc-800" />
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="h-14 flex items-center justify-center text-lg font-black text-zinc-950 dark:text-white bg-zinc-50 dark:bg-zinc-900 rounded-xl"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
