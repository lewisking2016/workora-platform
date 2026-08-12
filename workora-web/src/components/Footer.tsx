'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, CheckCircle, TwitterLogo, InstagramLogo,
  FacebookLogo, YoutubeLogo, GithubLogo, Lock, ShieldCheck, Heart,
  CaretRight
} from '@phosphor-icons/react';

const EASE = [0.22, 1, 0.36, 1] as const;

const linkColumns = [
  {
    title: 'Platform',
    accent: 'text-[#4D9FFF]',
    links: [
      { label: 'Live feed', href: '/dashboard/feed' },
      { label: 'Nodes Explorer', href: '/explore' },
      { label: 'Trust Ledger', href: '/trust' },
      { label: 'Security Protocol', href: '/safety' },
      { label: 'Insights', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    accent: 'text-[#A78BFA]',
    links: [
      { label: 'About System', href: '/about' },
      { label: 'Engineering', href: '/careers' },
      { label: 'Interface', href: '/contact' },
      { label: 'Personal', href: '/personal' },
      { label: 'Business', href: '/business' },
    ],
  },
  {
    title: 'Legal',
    accent: 'text-[#34D399]',
    links: [
      { label: 'Documentation', href: '/help' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Safety Checklist', href: '/safety' },
      { label: 'Platform Overview', href: '/platform' },
    ],
  },
];

const socials = [
  { icon: TwitterLogo, label: 'Twitter / X' },
  { icon: InstagramLogo, label: 'Instagram' },
  { icon: FacebookLogo, label: 'Facebook' },
  { icon: YoutubeLogo, label: 'YouTube' },
  { icon: GithubLogo, label: 'GitHub' },
];

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hide the marketing footer on auth and dashboard pages
  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) {
    return null;
  }

  const dark = pathname === '/';

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className={`relative overflow-hidden transition-colors duration-500 ${dark ? 'bg-[#07090F]' : 'bg-[#0A0D16]'}`}>
      {/* ambient gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[720px] rounded-full bg-gradient-to-r from-[#4D9FFF]/12 to-[#7000FF]/12 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 right-0 h-[400px] w-[600px] rounded-full bg-[#0066FF]/8 blur-[120px]" />
      {/* dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* top hairline gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4D9FFF]/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-10 md:px-8">
        {/* ═══════════ CTA / NEWSLETTER BAND ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10 mb-16 backdrop-blur-sm"
        >
          <div className="absolute -top-24 right-10 h-[220px] w-[320px] rounded-full bg-gradient-to-r from-[#4D9FFF]/25 to-[#7000FF]/25 blur-[80px]" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span className="dot-pulse text-[#34D399]" />
                Network status · operational
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Build your proof. <span className="bg-gradient-to-r from-[#4D9FFF] to-[#A78BFA] bg-clip-text text-transparent">Own your reputation.</span>
              </h2>
              <p className="text-sm text-white/50 max-w-md">
                Join the platform — or get platform updates straight to your inbox.
              </p>
            </div>
            <div className="w-full max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-2xl border border-[#34D399]/30 bg-[#34D399]/10 px-5 py-4">
                  <CheckCircle size={20} weight="fill" className="text-[#34D399] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-black text-white">You&apos;re on the list.</p>
                    <p className="text-xs text-white/50">We&apos;ll only send signal, never noise.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className="h-12 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 font-[family-name:var(--font-ubuntu-mono)] text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-[#4D9FFF]/60 focus:bg-white/[0.08]"
                  />
                  <button
                    type="submit"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-zinc-950 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Subscribe
                    <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══════════ LINK COLUMNS ═══════════ */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 md:gap-8 pb-14">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-6 md:pr-8">
            <Link href="/" className="group relative flex w-fit items-center transition-transform duration-300 hover:opacity-90 origin-left" aria-label="Workora home">
              <Image
                src="/logo/workora_logo_white.png"
                alt="Workora Logo"
                width={132}
                height={32}
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </Link>
            <p className="text-[15px] leading-relaxed text-white/50 max-w-xs">
              The digital trust layer for Africa&apos;s informal workforce. Reputation is the protocol.
            </p>

            {/* Terminal status line */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-[family-name:var(--font-ubuntu-mono)] text-xs">
              <div className="flex items-center gap-2 text-white/50">
                <span className="text-[#34D399] font-bold">workora@network</span>
                <span className="text-white/30">:</span>
                <span className="text-[#4D9FFF] font-bold">~</span>
                <span className="text-white/30">$</span>
                <span className="text-white/70">status --live</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40">
                <span className="flex items-center gap-1.5"><span className="dot-pulse text-[#34D399]" /> 24/7 uptime</span>
                <span className="flex items-center gap-1.5"><Lock size={11} className="text-white/30" /> encrypted</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-[#4D9FFF]" /> verified nodes</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4D9FFF]/50 hover:text-white hover:bg-white/[0.08]"
                >
                  <s.icon size={16} weight="bold" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h4 className={`mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${col.accent}`}>
                <CaretRight size={12} weight="bold" />
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-[13px] font-semibold text-white/50 transition-colors duration-200 hover:text-white"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#4D9FFF] to-[#A78BFA] transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#4D9FFF]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ═══════════ BOTTOM BAR ═══════════ */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-[family-name:var(--font-ubuntu-mono)] text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            © 2026 workora os · powered by imeantech core
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition-colors duration-200 hover:text-white">
              <span className="dot-pulse text-[#34D399]" /> Terminal
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition-colors duration-200 hover:text-white">
              Network
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/35 transition-colors duration-200 hover:text-white">
              Status
            </Link>
          </div>
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            Built with <Heart size={10} weight="fill" className="text-[#F43F5E]" /> in East Africa
          </p>
        </div>
      </div>
    </footer>
  );
}
