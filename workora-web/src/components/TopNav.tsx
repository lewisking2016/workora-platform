'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, List, X } from '@phosphor-icons/react';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isSwahili] = useState(() => typeof document !== 'undefined' && document.cookie.includes('googtrans=/en/sw'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) return null;

  return (
    <nav
      data-analytics-section="top_navigation"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-zinc-200' 
          : 'bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 flex items-center justify-between h-20">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="relative flex items-center justify-center transition-transform hover:opacity-80">
            <div className="relative h-10 w-32 md:h-12 md:w-36">
              <Image 
                src="/logo/workora_logo.png"
                alt="Workora Logo"
                fill
                className="object-contain"
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
                data-analytics-label={tab.name}
                data-analytics-event="topnav_link_clicked"
                className="relative group py-2"
              >
                <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                  pathname === tab.href ? 'text-[#0066FF]' : 'text-zinc-700 hover:text-[#0066FF]'
                }`}>
                  {tab.name}
                </span>
                {pathname === tab.href && (
                  <motion.div 
                    layoutId="topNavActiveLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#7000FF]"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Utilities & CTA */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/blog" 
              className="text-sm font-bold tracking-wide text-zinc-700 hover:text-[#0066FF] transition-colors"
            >
              Insights
            </Link>
            <button
              data-analytics-label="Language toggle"
              data-analytics-event="topnav_language_toggle"
              onClick={() => {
                const newValue = isSwahili ? '/en/en' : '/en/sw';
                document.cookie = `googtrans=${newValue}; path=/`;
                window.location.reload();
              }}
              className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-zinc-700 hover:text-[#0066FF] transition-colors"
            >
              <Globe size={18} weight="bold" /> {isSwahili ? 'SW' : 'EN'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              data-analytics-label="Sign in"
              data-analytics-event="topnav_sign_in"
              className="hidden sm:flex h-10 px-6 items-center justify-center text-sm font-bold text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/join" 
              data-analytics-label="Get Started"
              data-analytics-event="topnav_get_started"
              className="h-10 px-6 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-bold text-sm flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              Get Started
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              data-analytics-label="Open mobile menu"
              data-analytics-event="topnav_mobile_menu_open"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              <List size={22} weight="bold" />
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
            className="fixed inset-0 z-[200] bg-white flex flex-col px-6 py-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="relative h-10 w-32">
                <Image src="/logo/workora_logo.png" alt="Workora Logo" fill className="object-contain" priority />
              </div>
              <button
                data-analytics-label="Close mobile menu"
                data-analytics-event="topnav_mobile_menu_close"
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-950"
              >
                <X size={22} weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-2xl font-black tracking-tight">
              {[
                { name: 'Personal', href: '/personal' },
                { name: 'Business', href: '/business' },
                { name: 'Platform', href: '/platform' },
                { name: 'Insights', href: '/blog' }
              ].map((tab) => (
                <Link 
                  key={tab.name} 
                  href={tab.href} 
                  data-analytics-label={tab.name}
                  data-analytics-event="mobile_nav_link_clicked"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-950 hover:text-[#0066FF] transition-colors"
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-6">
              <button
                data-analytics-label="Language toggle"
                data-analytics-event="mobile_language_toggle"
                onClick={() => {
                  const newValue = isSwahili ? '/en/en' : '/en/sw';
                  document.cookie = `googtrans=${newValue}; path=/`;
                  window.location.reload();
                }}
                className="flex items-center gap-2 text-lg font-bold tracking-wide text-zinc-950"
              >
                <Globe size={24} weight="bold" /> {isSwahili ? 'Swahili' : 'English'}
              </button>
              <hr className="border-zinc-200" />
              <Link 
                href="/login" 
                data-analytics-label="Sign in"
                data-analytics-event="mobile_sign_in"
                onClick={() => setMobileMenuOpen(false)}
                className="h-14 flex items-center justify-center text-lg font-bold text-zinc-950 bg-zinc-100 rounded-2xl hover:bg-zinc-200 transition-colors"
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
