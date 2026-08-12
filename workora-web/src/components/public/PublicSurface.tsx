'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight, CheckCircle, House, ShieldCheck, Sparkle,
  VideoCamera, PhoneCall, EnvelopeSimple, BookOpen, Key, CaretRight,
  Play, Heart, ChatCircle
} from '@phosphor-icons/react';

import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_DEFAULTS, PublicGig, PublicSurfaceData } from '@/lib/public-surface';

type SurfaceVariant =
  | 'about'
  | 'business'
  | 'careers'
  | 'contact'
  | 'help'
  | 'personal'
  | 'platform'
  | 'privacy'
  | 'safety'
  | 'terms'
  | 'trust';

type SurfaceConfig = {
  title: string;
  subtitle: string;
  kicker: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  highlights: string[];
  body: string;
};

const SURFACE_CONFIG: Record<SurfaceVariant, SurfaceConfig> = {
  about: {
    kicker: 'About system',
    title: 'Making proof visible across East Africa',
    subtitle: 'We turn local work, trust, and reputation into something people can verify instantly.',
    primaryCta: { label: 'Join as helper', href: '/join' },
    secondaryCta: { label: 'How it works', href: '/platform' },
    highlights: ['Verified identity checks', 'Proof-of-work captures', 'Direct-to-client connections'],
    body: 'We are building the trust infrastructure where workers, businesses, and hirers meet without guesswork.',
  },
  business: {
    kicker: 'For business',
    title: 'Find the right specialist faster',
    subtitle: 'Browse live work, compare trade specialists, and start with evidence instead of assumptions.',
    primaryCta: { label: 'Search workers', href: '/dashboard/search' },
    secondaryCta: { label: 'Platform details', href: '/platform' },
    highlights: ['Trust-first discovery', 'Live availability', 'Workforce analytics'],
    body: 'Business users need short paths to trusted people, clear signals, and fewer dead ends.',
  },
  careers: {
    kicker: 'Careers & Team',
    title: 'Build the trust layer for the informal economy',
    subtitle: 'We build products, systems, and workflows that help people get seen for their real skills.',
    primaryCta: { label: 'Contact engineering', href: '/contact' },
    secondaryCta: { label: 'About system', href: '/about' },
    highlights: ['Product engineering', 'Trust protocols', 'Distributed platforms'],
    body: 'If you care about useful software for real users, this is the kind of problem space that matters.',
  },
  contact: {
    kicker: 'Get in touch',
    title: 'Talk to the team behind the platform',
    subtitle: 'Support, product questions, partnerships, and verification issues all belong here.',
    primaryCta: { label: 'Get support', href: '/help' },
    secondaryCta: { label: 'Safety checklist', href: '/safety' },
    highlights: ['Direct support routing', 'Verification help', 'Business queries'],
    body: 'Contact should be fast, traceable, and clearly routed to the right human.',
  },
  help: {
    kicker: 'Help & Support',
    title: 'Get unstuck without hunting',
    subtitle: 'Answers, recovery paths, and escalation steps for the most common account and platform issues.',
    primaryCta: { label: 'Reset password', href: '/forgot' },
    secondaryCta: { label: 'Terms of service', href: '/terms' },
    highlights: ['Login help', 'Media upload issues', 'Trust score questions'],
    body: 'Support content should not waste time. It should get you to the next safe step.',
  },
  personal: {
    kicker: 'For hirers',
    title: 'Find a person you can trust',
    subtitle: 'See work history, proof, and reviews before you commit to a conversation.',
    primaryCta: { label: 'Find a helper', href: '/dashboard/search' },
    secondaryCta: { label: 'Trust protocols', href: '/trust' },
    highlights: ['Public profiles', 'Proof-of-work streams', 'Direct messaging'],
    body: 'This side of the product should feel calm, confident, and easy to compare.',
  },
  platform: {
    kicker: 'Platform',
    title: 'The complete system in one place',
    subtitle: 'Discovery, identity, messaging, uploads, and analytics all sit on the same live platform.',
    primaryCta: { label: 'Open feed', href: '/dashboard/feed' },
    secondaryCta: { label: 'Search workers', href: '/dashboard/search' },
    highlights: ['Live feed', 'Advanced search', 'Protected messaging'],
    body: 'The platform page explains the whole product without drifting into marketing filler.',
  },
  privacy: {
    kicker: 'Privacy policy',
    title: 'How your data is handled',
    subtitle: 'Clear, direct details about identity, content, analytics, and support data handling.',
    primaryCta: { label: 'Terms of use', href: '/terms' },
    secondaryCta: { label: 'Contact team', href: '/contact' },
    highlights: ['Secure encryption', 'Minimal data retention', 'Event logging transparency'],
    body: 'Privacy content is readable, direct, and attached to real behavior in the product.',
  },
  safety: {
    kicker: 'Safety protocol',
    title: 'Trust, reporting, and escalation',
    subtitle: 'Paths for abuse reports, block requests, and platform recovery.',
    primaryCta: { label: 'Report issue', href: '/contact' },
    secondaryCta: { label: 'Trust ledger', href: '/trust' },
    highlights: ['Report abuse', 'Block users', 'Vetting validation'],
    body: 'Safety content helps you act quickly when something feels wrong.',
  },
  terms: {
    kicker: 'Terms of use',
    title: 'The rules for using Workora',
    subtitle: 'Permissions, obligations, and responsibilities for everyone using the platform.',
    primaryCta: { label: 'Privacy policy', href: '/privacy' },
    secondaryCta: { label: 'Get help', href: '/help' },
    highlights: ['User obligations', 'Content rules', 'Service limits'],
    body: 'Terms are organized, clear, and connected to the real flows users take.',
  },
  trust: {
    kicker: 'Trust ledger',
    title: 'What makes a profile believable',
    subtitle: 'Verification, media, ratings, and consistent activity are what turn a page into evidence.',
    primaryCta: { label: 'Open dashboard', href: '/dashboard/pro' },
    secondaryCta: { label: 'Create account', href: '/join' },
    highlights: ['Verified identity', 'Public work history', 'Authenticated ratings'],
    body: 'The trust page explains the data model that gives the product its point of view.',
  },
};

/* ── Per-variant accent system ── */
const ACCENTS: Record<SurfaceVariant, {
  hex: string; text: string; bgSoft: string; ring: string; chip: string;
  gradient: string; bar: string; dot: string;
}> = {
  trust:    { hex: '#10B981', text: 'text-emerald-600', bgSoft: 'bg-emerald-50', ring: 'ring-emerald-500/20', chip: 'border-emerald-200/70 text-emerald-700 bg-emerald-50/60', gradient: 'from-emerald-500 to-teal-500', bar: 'bg-gradient-to-r from-emerald-500 to-teal-400', dot: 'text-emerald-500' },
  safety:   { hex: '#F43F5E', text: 'text-rose-600',     bgSoft: 'bg-rose-50',     ring: 'ring-rose-500/20',     chip: 'border-rose-200/70 text-rose-700 bg-rose-50/60',     gradient: 'from-rose-500 to-orange-500', bar: 'bg-gradient-to-r from-rose-500 to-orange-400', dot: 'text-rose-500' },
  about:    { hex: '#0066FF', text: 'text-blue-600',     bgSoft: 'bg-blue-50',     ring: 'ring-blue-500/20',     chip: 'border-blue-200/70 text-blue-700 bg-blue-50/60',     gradient: 'from-blue-500 to-cyan-500', bar: 'bg-gradient-to-r from-blue-500 to-cyan-400', dot: 'text-blue-500' },
  careers:  { hex: '#8B5CF6', text: 'text-violet-600',   bgSoft: 'bg-violet-50',   ring: 'ring-violet-500/20',   chip: 'border-violet-200/70 text-violet-700 bg-violet-50/60', gradient: 'from-violet-500 to-fuchsia-500', bar: 'bg-gradient-to-r from-violet-500 to-fuchsia-400', dot: 'text-violet-500' },
  contact:  { hex: '#0066FF', text: 'text-blue-600',     bgSoft: 'bg-blue-50',     ring: 'ring-blue-500/20',     chip: 'border-blue-200/70 text-blue-700 bg-blue-50/60',     gradient: 'from-blue-500 to-cyan-500', bar: 'bg-gradient-to-r from-blue-500 to-cyan-400', dot: 'text-blue-500' },
  help:     { hex: '#F59E0B', text: 'text-amber-600',    bgSoft: 'bg-amber-50',    ring: 'ring-amber-500/20',    chip: 'border-amber-200/70 text-amber-700 bg-amber-50/60',  gradient: 'from-amber-500 to-orange-500', bar: 'bg-gradient-to-r from-amber-500 to-orange-400', dot: 'text-amber-500' },
  privacy:  { hex: '#64748B', text: 'text-slate-600',    bgSoft: 'bg-slate-100',   ring: 'ring-slate-500/20',    chip: 'border-slate-200/70 text-slate-700 bg-slate-50/60',   gradient: 'from-slate-500 to-slate-400', bar: 'bg-gradient-to-r from-slate-500 to-slate-400', dot: 'text-slate-500' },
  terms:    { hex: '#64748B', text: 'text-slate-600',    bgSoft: 'bg-slate-100',   ring: 'ring-slate-500/20',    chip: 'border-slate-200/70 text-slate-700 bg-slate-50/60',   gradient: 'from-slate-500 to-slate-400', bar: 'bg-gradient-to-r from-slate-500 to-slate-400', dot: 'text-slate-500' },
  personal: { hex: '#10B981', text: 'text-emerald-600',  bgSoft: 'bg-emerald-50',  ring: 'ring-emerald-500/20',  chip: 'border-emerald-200/70 text-emerald-700 bg-emerald-50/60', gradient: 'from-emerald-500 to-teal-500', bar: 'bg-gradient-to-r from-emerald-500 to-teal-400', dot: 'text-emerald-500' },
  business: { hex: '#0066FF', text: 'text-blue-600',     bgSoft: 'bg-blue-50',     ring: 'ring-blue-500/20',     chip: 'border-blue-200/70 text-blue-700 bg-blue-50/60',     gradient: 'from-blue-500 to-indigo-500', bar: 'bg-gradient-to-r from-blue-500 to-indigo-400', dot: 'text-blue-500' },
  platform: { hex: '#0066FF', text: 'text-blue-600',     bgSoft: 'bg-blue-50',     ring: 'ring-blue-500/20',     chip: 'border-blue-200/70 text-blue-700 bg-blue-50/60',     gradient: 'from-blue-500 to-violet-500', bar: 'bg-gradient-to-r from-blue-500 to-violet-400', dot: 'text-blue-500' },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Animated count-up stat ── */
function CountUp({ value, accent }: { value: number; accent: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(String(Math.round(v))));
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className={`text-4xl md:text-5xl font-black tracking-tight ${accent}`}>
      {display}
    </span>
  );
}

/* ── Live data stat card ── */
function StatCard({ label, value, accent, sub }: { label: string; value: number; accent: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.08]"
    >
      <div className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`} />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</p>
      <div className="mt-2">
        <CountUp value={value} accent={accent} />
      </div>
      {sub && <p className="mt-1 text-xs font-semibold text-white/35">{sub}</p>}
    </motion.div>
  );
}

/* ── Trade distribution bars (real data) ── */
function TradeBars({ items, accent }: { items: { trade: string; count: number }[]; accent: (typeof ACCENTS)['about'] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.trade} className="group">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-800">{item.trade}</span>
            <span className="text-xs font-black text-zinc-400">{item.count} <span className="font-semibold text-zinc-400 dark:text-zinc-500">members</span></span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max((item.count / max) * 100, 8)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.08, ease: EASE }}
              className={`h-full rounded-full ${accent.bar}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Gig preview card with hover overlay ── */
function GigPreview({ gig }: { gig: PublicGig }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200">
      <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
        {gig.video_url ? (
          <VideoPlayer src={gig.video_url} poster={gig.thumbnail_url || undefined} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" autoPlay intersectionThreshold={0.4} />
        ) : (
          <SafeMediaThumb src={gig.thumbnail_url || APP_DEFAULTS.thumbnail} alt={gig.title || 'Workora post'} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-700 backdrop-blur">
            <Play size={11} weight="fill" className="text-blue-600" /> Watch
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-blue-600">
          <ShieldCheck size={13} weight="fill" />
          {gig.trade || gig.category || 'Member'}
        </div>
        <h3 className="mt-2 text-[15px] font-bold text-zinc-900 tracking-tight leading-snug line-clamp-1">{gig.title || 'Live proof-of-work post'}</h3>
        <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">{gig.description || 'A live post from the feed.'}</p>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-50 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-[8px] font-black text-white">
              {(gig.user_name || gig.handle || 'M').charAt(0).toUpperCase()}
            </span>
            {gig.user_name || gig.handle || 'Member'}
          </span>
          <span className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-400">
            <span className="inline-flex items-center gap-1"><Heart size={12} weight="fill" className="text-rose-400" />{Number(gig.likes_count || 0)}</span>
            <span className="inline-flex items-center gap-1"><ChatCircle size={12} weight="fill" className="text-blue-400" />{Number(gig.comments_count || 0)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Legal/support panel ── */
function LegalPanel({ title, children, accent }: { title: string; children: React.ReactNode; accent: (typeof ACCENTS)['about'] }) {
  return (
    <section className="rounded-3xl border border-zinc-100 bg-white p-8 md:p-12 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent.bgSoft}`}>
          <BookOpen size={18} weight="bold" className={accent.text} />
        </span>
        <h2 className="text-zinc-900 text-2xl md:text-3xl leading-tight font-black">{title}</h2>
      </div>
      <div className="space-y-4 text-zinc-500 leading-relaxed text-base">{children}</div>
    </section>
  );
}

export function PublicSurface({ variant, data }: { variant: SurfaceVariant; data: PublicSurfaceData }) {
  const config = SURFACE_CONFIG[variant];
  const accent = ACCENTS[variant];
  const topTrades = countByTrade(data.feed.length ? data.feed : data.explore);
  const spotlight = (data.feed.length ? data.feed : data.explore).slice(0, 3);
  const supportMode = ['help', 'contact', 'careers'].includes(variant);
  const legalMode = ['privacy', 'terms', 'safety'].includes(variant);

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-clip">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[#07090F] text-white">
        {/* ambient gradients */}
        <div className={`absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r ${accent.gradient} opacity-[0.14] blur-[120px]`} />
        <div className="absolute -right-32 top-1/3 h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_45%)]" />
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-36 md:pt-44">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="space-y-7"
            >
              <span className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] ${accent.text}`}>
                <Sparkle size={13} weight="fill" />
                {config.kicker}
              </span>
              <h1 className="text-white font-black leading-[1.05] tracking-tight">
                {config.title.split(' ').slice(0, -2).join(' ')}{' '}
                <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
                  {config.title.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl">
                {config.subtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={config.primaryCta.href}
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-zinc-950 shadow-xl transition-all duration-300 hover:scale-[1.03]"
                >
                  {config.primaryCta.label}
                  <ArrowRight size={17} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={config.secondaryCta.href}
                  className={`inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 px-7 py-4 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]`}
                >
                  {config.secondaryCta.label}
                </Link>
              </div>
            </motion.div>

            {/* Live data panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
              className="relative"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                    <span className={`dot-pulse ${accent.dot}`} />
                    Live platform data
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white/35">Real-time</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Active trades" value={data.stats.tradeCount} accent={accent.gradient} />
                  <StatCard label="Verified posts" value={data.stats.verifiedCount} accent={accent.gradient} />
                  <StatCard label="Explore feed" value={data.stats.exploreCount} accent={accent.gradient} />
                  <StatCard label="Work records" value={data.stats.feedCount} accent={accent.gradient} />
                </div>
              </div>
              {/* floating chip */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-6 -bottom-6 hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0D1120]/90 px-4 py-3 shadow-2xl backdrop-blur"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${accent.bgSoft}`}>
                  <House size={16} weight="bold" className={accent.text} />
                </span>
                <div>
                  <p className="text-xs font-black text-white">Proof of work</p>
                  <p className="text-[10px] font-semibold text-white/40">Verified on-platform</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRADE MARQUEE ═══════════ */}
      {data.trades.length > 0 && (
        <div className="border-b border-zinc-100 bg-white py-5">
          <div className="relative overflow-hidden">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-3">
              {[...data.trades, ...data.trades, ...data.trades].map((trade, idx) => (
                <span key={`${trade}-${idx}`} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] ${accent.chip}`}>
                  <span className={`dot-pulse ${accent.dot}`} />
                  {trade}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TRADE BARS + LIVE STREAM ═══════════ */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-14">
          {/* Left: trade distribution */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="mb-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.text}`}>Active capability nodes</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Trade distribution</h2>
              <p className="mt-3 text-zinc-500 max-w-md">Live membership spread across the trades on the platform right now.</p>
            </div>
            <div className="rounded-3xl border border-zinc-100 bg-white p-7 shadow-sm">
              {topTrades.length > 0 ? (
                <TradeBars items={topTrades} accent={accent} />
              ) : (
                <div className="flex items-center gap-3 py-10 text-zinc-400">
                  <span className="dot-pulse text-zinc-300" />
                  <span className="text-sm font-semibold">Scanning network for active nodes...</span>
                </div>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {['Verified identity checks', 'Authenticated ratings', 'Public work history', 'Direct-to-client'].map((item) => (
                <div key={item} className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3">
                  <CheckCircle size={16} weight="fill" className={`${accent.text} flex-shrink-0`} />
                  <span className="text-xs font-bold text-zinc-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: live proof stream */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <div className="mb-8 flex items-center gap-3">
              <span className={`dot-pulse ${accent.dot}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.text}`}>Live proof stream</span>
            </div>
            <div className="grid gap-6">
              {spotlight.length > 0 ? (
                spotlight.map((gig) => <GigPreview key={gig.id} gig={gig} />)
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-zinc-200 p-14 text-center">
                  <VideoCamera size={32} weight="thin" className="mx-auto text-zinc-300" />
                  <p className="mt-3 text-sm font-semibold text-zinc-400">Waiting for live data transmission...</p>
                </div>
              )}
            </div>
            <Link href="/dashboard/feed" className="group mt-6 inline-flex items-center gap-2 text-sm font-black text-zinc-800 hover:text-zinc-950">
              Open the live feed
              <CaretRight size={14} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SUPPORT MODE ═══════════ */}
      {supportMode && (
        <section className="bg-zinc-50 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.text}`}>Resolution paths</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">How we help</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {config.highlights.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: EASE }}
                  className="group rounded-3xl border border-zinc-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-900/[0.06]"
                >
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft} transition-transform duration-300 group-hover:scale-110`}>
                    {idx === 0 ? <Key size={22} weight="bold" className={accent.text} /> : idx === 1 ? <PhoneCall size={22} weight="bold" className={accent.text} /> : <EnvelopeSimple size={22} weight="bold" className={accent.text} />}
                  </div>
                  <h4 className="text-lg font-black text-zinc-900">{item}</h4>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                    {variant === 'help' && 'Step-by-step resolution paths and direct verification options to get you back on track fast.'}
                    {variant === 'contact' && 'Secure communications link directly routed to the right verification administrators.'}
                    {variant === 'careers' && 'Build modern frameworks, infrastructure platforms, and trust registries that matter.'}
                  </p>
                  <span className={`mt-5 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider ${accent.text}`}>
                    Get started <CaretRight size={12} weight="bold" />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ LEGAL MODE ═══════════ */}
      {legalMode && (
        <section className="bg-zinc-50 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <LegalPanel title={config.title} accent={accent}>
                <p className="text-zinc-600">{config.body}</p>
                <p className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 font-medium text-sm text-zinc-500 flex items-start gap-3">
                  <BookOpen size={20} className={`${accent.text} flex-shrink-0 mt-0.5`} />
                  <span>All documents, records, verification logs, and user identity credentials are handled in accordance with privacy-first standards.</span>
                </p>
              </LegalPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="lg:sticky lg:top-28"
            >
              <div className="rounded-3xl border border-zinc-100 bg-white p-7 shadow-sm">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.text}`}>Linked protocols</span>
                <div className="mt-5 space-y-3">
                  {config.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 transition-colors hover:border-zinc-200">
                      <CheckCircle size={18} weight="fill" className={`${accent.text} flex-shrink-0`} />
                      <span className="text-sm font-bold text-zinc-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA ═══════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-[#07090F] p-10 md:p-16 text-white"
        >
          <div className={`absolute -top-32 left-1/4 h-[360px] w-[560px] rounded-full bg-gradient-to-r ${accent.gradient} opacity-20 blur-[100px]`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-xl space-y-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span className={`dot-pulse ${accent.dot}`} />
                Execute verification
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Join Workora <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>today</span>
              </h2>
              <p className="text-white/55 text-base md:text-lg leading-relaxed">
                {variant === 'trust' ? 'Build a profile that proves your work — not just promises it.'
                  : variant === 'safety' ? 'Know exactly what to do when something feels wrong.'
                  : 'Turn your work into proof that people can verify instantly.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/feed" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-zinc-950 transition-all duration-300 hover:scale-[1.03]">
                Open feed
                <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function countByTrade(items: PublicGig[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = item.trade || item.category || 'Other';
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([trade, count]) => ({ trade, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
