'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Globe, List, X, ArrowRight } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Personal', href: '/personal' },
  { name: 'Business', href: '/business' },
  { name: 'Platform', href: '/platform' },
];

// Pages with a dark hero — the nav must render light text/logo over them.
const DARK_HERO_ROUTES = new Set([
  '/',
  '/personal',
  '/business',
  '/platform',
  '/blog',
  '/trust',
  '/safety',
  '/about',
  '/careers',
  '/contact',
  '/help',
  '/terms',
  '/privacy',
]);

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Wordmark: gradient mark + wordmark text, theme-aware ── */
function Wordmark({ dark }: { dark: boolean }) {
  return (
    <Link href="/" className="group relative flex items-center" aria-label="Workora home">
      {/* eslint-disable-next-line @next/next/no-img-element -- legacy PNG logo */}
      <img
        src={dark ? '/logo/workora_logo_white.png' : '/logo/workora_logo.png'}
        alt="Workora"
        className="h-8 w-auto select-none transition-transform duration-300 group-hover:scale-[1.04] md:h-9"
        draggable={false}
      />
    </Link>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isSwahili] = useState(() => typeof document !== 'undefined' && document.cookie.includes('googtrans=/en/sw'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dark variant over any page with a dark hero (these heroes are always
  // dark regardless of theme, so white nav text is correct in both modes)
  const dark = DARK_HERO_ROUTES.has(pathname);

  // Scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) return null;

  const navBg = dark
    ? scrolled
      ? 'bg-[#07090F]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]'
      : 'bg-transparent'
    : scrolled
      ? 'bg-white/90 backdrop-blur-xl border-b border-zinc-200/70 shadow-[0_8px_40px_-16px_rgba(15,23,42,0.15)]'
      : 'bg-white/40 backdrop-blur-sm border-b border-transparent';

  const textBase = dark ? 'text-white/75 hover:text-white' : 'text-zinc-600 hover:text-zinc-950';
  const activeText = dark ? 'text-white' : 'text-[#0066FF]';
  const underlineColor = dark ? 'bg-white' : 'bg-[#0066FF]';
  const ghostBorder = dark ? 'border-white/20 text-white/90 hover:border-white/45 hover:bg-white/[0.06]' : 'border-zinc-300 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50';

  return (
    <>
      <nav
        data-analytics-section="top_navigation"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${navBg}`}
      >
        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[#4D9FFF] via-[#7000FF] to-[#4D9FFF]"
        />

        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
          <Wordmark dark={dark} />

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  data-analytics-label={tab.name}
                  data-analytics-event="topnav_link_clicked"
                  className="group relative rounded-full px-4 py-2.5"
                >
                  <span className={`relative text-[11px] font-black uppercase tracking-[0.18em] transition-colors duration-300 ${active ? activeText : textBase}`}>
                    {tab.name}
                    {/* hover underline */}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current opacity-60 transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                  {active && (
                    <motion.span
                      layoutId="topnav-active-pill"
                      className={`absolute inset-0 rounded-full ${dark ? 'bg-white/[0.08] ring-1 ring-white/15' : 'bg-[#0066FF]/[0.07] ring-1 ring-[#0066FF]/15'}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/blog"
              className={`hidden text-[11px] font-black uppercase tracking-[0.18em] transition-colors md:block ${textBase}`}
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
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                dark ? 'border-white/15 text-white/80 hover:border-white/40 hover:text-white' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
              }`}
              aria-label="Toggle language"
            >
              <Globe size={14} weight="bold" />
              {isSwahili ? 'SW' : 'EN'}
            </button>

            <div className={`hidden h-6 w-px sm:block ${dark ? 'bg-white/15' : 'bg-zinc-200'}`} />

            <Link
              href="/login"
              data-analytics-label="Log in"
              data-analytics-event="topnav_sign_in"
              className={`hidden text-sm font-bold transition-colors sm:block ${dark ? 'text-white/85 hover:text-white' : 'text-zinc-800 hover:text-[#0066FF]'}`}
            >
              Log in
            </Link>

            <Link
              href="/join"
              data-analytics-label="Get Started"
              data-analytics-event="topnav_get_started"
              className="group hidden h-11 items-center gap-2 rounded-full bg-[#0066FF] px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a75ff] hover:shadow-blue-500/45 sm:inline-flex"
            >
              Get started
              <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            {/* Mobile toggle */}
            <button
              data-analytics-label="Open mobile menu"
              data-analytics-event="topnav_mobile_menu_open"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden ${
                dark ? 'border-white/15 text-white hover:bg-white/[0.08]' : 'border-zinc-200 text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile sheet ── */}
      <AnimatePresence>
        {mobileOpen && mounted && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className={`fixed right-0 top-0 z-[200] flex h-full w-[86%] max-w-sm flex-col border-l p-7 lg:hidden ${
                dark
                  ? 'border-white/10 bg-[#0B0E17]/95 text-white backdrop-blur-2xl'
                  : 'border-zinc-200 bg-white/95 text-zinc-950 backdrop-blur-2xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <Wordmark dark={dark} />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${dark ? 'border-white/15 hover:bg-white/[0.08]' : 'border-zinc-200 hover:bg-zinc-100'}`}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="mt-12 flex flex-col">
                {[...NAV_LINKS, { name: 'Insights', href: '/blog' }].map((tab, i) => (
                  <motion.div
                    key={tab.name}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: EASE }}
                    className={`border-b last:border-0 ${dark ? 'border-white/10' : 'border-zinc-100'}`}
                  >
                    <Link
                      href={tab.href}
                      data-analytics-label={tab.name}
                      data-analytics-event="mobile_nav_link_clicked"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between py-5"
                    >
                      <span className={`text-3xl font-black tracking-tight transition-colors ${pathname === tab.href ? (dark ? 'text-white' : 'text-[#0066FF]') : `${dark ? 'text-white/60' : 'text-zinc-500'} group-hover:${dark ? 'text-white' : 'text-zinc-950'}`}`}>
                        {tab.name}
                      </span>
                      <ArrowRight
                        size={20}
                        className={`transition-all duration-300 group-hover:translate-x-1 ${dark ? 'text-white/30' : 'text-zinc-300'}`}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45, ease: EASE }}
                className="mt-auto space-y-3"
              >
                <button
                  data-analytics-label="Language toggle"
                  data-analytics-event="mobile_language_toggle"
                  onClick={() => {
                    const newValue = isSwahili ? '/en/en' : '/en/sw';
                    document.cookie = `googtrans=${newValue}; path=/`;
                    window.location.reload();
                  }}
                  className={`flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.2em] ${dark ? 'text-white/70' : 'text-zinc-500'}`}
                >
                  <Globe size={18} weight="bold" /> {isSwahili ? 'Swahili' : 'English'}
                </button>

                <div className={`h-px w-full ${dark ? 'bg-white/10' : 'bg-zinc-200'}`} />

                <Link
                  href="/login"
                  data-analytics-label="Log in"
                  data-analytics-event="mobile_sign_in"
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-12 items-center justify-center rounded-xl border text-sm font-bold ${ghostBorder}`}
                >
                  Log in
                </Link>
                <Link
                  href="/join"
                  data-analytics-label="Get Started"
                  data-analytics-event="mobile_get_started"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-sm font-bold text-white shadow-lg shadow-blue-500/30"
                >
                  Get started <ArrowRight size={15} weight="bold" />
                </Link>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
