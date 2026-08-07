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
          ? 'bg-white/90 backdrop-blur-md border-b border-black/10' 
          : 'bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 flex items-center justify-between h-20">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-16">
          <Link href="/" className="relative flex items-center justify-center transition-transform hover:opacity-80">
            <div className="relative h-12 w-40 md:h-14 md:w-44">
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
          <div className="hidden lg:flex items-center gap-10">
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
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  pathname === tab.href ? 'text-[#0066FF]' : 'text-black hover:text-[#0066FF]'
                }`}>
                  {tab.name}
                </span>
                {pathname === tab.href && (
                  <motion.div 
                    layoutId="topNavActiveLine"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#0066FF]"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Utilities & CTA */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/blog" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-[#0066FF] transition-colors"
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
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-[#0066FF] transition-colors"
            >
              <Globe size={16} weight="thin" /> {isSwahili ? 'SW' : 'EN'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              data-analytics-label="Log in"
              data-analytics-event="topnav_sign_in"
              className="hidden sm:flex h-12 px-6 items-center justify-center text-sm font-semibold text-black hover:text-[var(--brand)] transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/join" 
              data-analytics-label="Get Started"
              data-analytics-event="topnav_get_started"
              className="h-12 px-8 bg-[var(--brand)] text-white font-bold text-sm flex items-center justify-center rounded-lg btn"
            >
              Get started
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              data-analytics-label="Open mobile menu"
              data-analytics-event="topnav_mobile_menu_open"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center border border-black/10 text-black hover:bg-zinc-50 transition-colors"
            >
              <List size={22} weight="thin" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col px-8 py-8"
          >
            <div className="flex items-center justify-between mb-20">
              <div className="relative h-10 w-32">
                <Image src="/logo/workora_logo.png" alt="Workora Logo" fill sizes="128px" className="object-contain" priority />
              </div>
              <button
                data-analytics-label="Close mobile menu"
                data-analytics-event="topnav_mobile_menu_close"
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 w-10 flex items-center justify-center border border-black/10 text-black"
              >
                <X size={22} weight="thin" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
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
                  className="text-4xl font-black uppercase tracking-tighter hover:text-[#0066FF] transition-colors"
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-6">
              <button
                data-analytics-label="Language toggle"
                data-analytics-event="mobile_language_toggle"
                onClick={() => {
                  const newValue = isSwahili ? '/en/en' : '/en/sw';
                  document.cookie = `googtrans=${newValue}; path=/`;
                  window.location.reload();
                }}
                className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-black"
              >
                <Globe size={24} weight="thin" /> {isSwahili ? 'Swahili' : 'English'}
              </button>
              <div className="h-px bg-black/10 w-full" />
                <Link 
                  href="/login" 
                  data-analytics-label="Log in"
                  data-analytics-event="mobile_sign_in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-16 flex items-center justify-center text-base font-bold text-white bg-[var(--brand)] hover:bg-blue-700 transition-colors rounded-lg"
                >
                  Log in
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
