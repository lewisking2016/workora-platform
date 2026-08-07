'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, House, ShieldCheck, Sparkle, UsersThree,
  VideoCamera, PhoneCall, EnvelopeSimple, BookOpen, Key
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{label}</p>
      <p className="mt-2 text-3xl font-black text-zinc-900 tracking-tight">{value}</p>
    </div>
  );
}

function GigPreview({ gig }: { gig: PublicGig }) {
  return (
    <article className="card overflow-hidden">
      <div className="relative aspect-[16/10] bg-zinc-100">
        {gig.video_url ? (
          <VideoPlayer src={gig.video_url} poster={gig.thumbnail_url || undefined} className="h-full w-full object-cover" autoPlay intersectionThreshold={0.4} />
        ) : (
          <SafeMediaThumb src={gig.thumbnail_url || APP_DEFAULTS.thumbnail} alt={gig.title || 'Workora post'} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <ShieldCheck size={16} weight="fill" />
          {gig.trade || gig.category || 'Member'}
        </div>
        <h3 className="mt-3 text-lg font-bold text-zinc-900 tracking-tight leading-snug">{gig.title || 'Live proof-of-work post'}</h3>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-2">{gig.description || 'A live post from the feed.'}</p>
        <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase">
          <span>{gig.user_name || gig.handle || 'Member'}</span>
          <span>{Number(gig.likes_count || 0)} likes</span>
        </div>
      </div>
    </article>
  );
}

function LegalPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-8 md:p-10 space-y-6">
      <h2 className="text-zinc-900 text-3xl leading-tight font-black">{title}</h2>
      <div className="space-y-4 text-zinc-500 leading-relaxed text-base">{children}</div>
    </section>
  );
}

export function PublicSurface({ variant, data }: { variant: SurfaceVariant; data: PublicSurfaceData }) {
  const config = SURFACE_CONFIG[variant];
  const topTrades = countByTrade(data.feed.length ? data.feed : data.explore);
  const spotlight = (data.feed.length ? data.feed : data.explore).slice(0, 3);
  const supportMode = ['help', 'contact', 'careers'].includes(variant);
  const legalMode = ['privacy', 'terms', 'safety'].includes(variant);

  return (
    <main className="min-h-screen bg-transparent text-zinc-900 pt-28 pb-20">
      
      {/* 1. Header Hero section */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
              <Sparkle size={14} weight="fill" />
              {config.kicker}
            </span>
            <h1 className="text-zinc-900 font-black leading-tight tracking-tight">
              {config.title}
            </h1>
            <p className="text-zinc-500 text-xl leading-relaxed max-w-2xl">
              {config.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={config.primaryCta.href} className="btn inline-flex h-14 items-center justify-center gap-2 bg-[#0066FF] px-8 text-sm font-bold text-white rounded-2xl shadow-xl shadow-blue-500/25">
                {config.primaryCta.label}
                <ArrowRight size={18} weight="bold" />
              </Link>
              <Link href={config.secondaryCta.href} className="btn inline-flex h-14 items-center justify-center gap-2 border-2 border-zinc-200 px-8 text-sm font-bold text-zinc-800 rounded-2xl bg-white">
                {config.secondaryCta.label}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-4 bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100"
          >
            <div className="col-span-2 pb-2">
              <span className="dot-pulse text-green-500 mr-2" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Platform Data</span>
            </div>
            <StatCard label="Active trades" value={String(data.stats.tradeCount)} />
            <StatCard label="Verified posts" value={String(data.stats.verifiedCount)} />
            <StatCard label="Explore feed" value={String(data.stats.exploreCount)} />
            <StatCard label="Work records" value={String(data.stats.feedCount)} />
          </motion.div>
        </div>
      </section>

      {/* 2. Grid split section */}
      <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_0.85fr] gap-12 mb-20">
        
        {/* Left: Active Capabilities / Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Capability Nodes</span>
              <h2 className="mt-1 text-zinc-900 text-2xl font-black">Trade distribution</h2>
            </div>
            <UsersThree size={32} weight="thin" className="text-zinc-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {data.trades.length > 0 ? data.trades.slice(0, 10).map((trade) => (
              <span key={trade} className="px-3.5 py-1.5 border border-zinc-200/80 rounded-xl text-xs font-bold text-zinc-600 bg-white">
                {trade}
              </span>
            )) : (
              <span className="text-xs font-medium text-zinc-400">Scanning network for active nodes...</span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {topTrades.map((item) => (
              <div key={item.trade} className="bg-zinc-50/50 border border-zinc-100 p-5 rounded-2xl">
                <p className="text-sm font-black text-zinc-800 tracking-tight">{item.trade}</p>
                <p className="mt-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">{item.count} members active</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Data Stream Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="dot-pulse text-[#0066FF]" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Proof Stream</span>
          </div>
          <div className="grid gap-6">
            {spotlight.length > 0 ? (
              spotlight.map((gig) => <GigPreview key={gig.id} gig={gig} />)
            ) : (
              <div className="p-12 border-2 border-dashed border-zinc-200 rounded-3xl text-center">
                <p className="text-sm text-zinc-400">Waiting for live data transmission...</p>
              </div>
            )}
          </div>
        </motion.div>

      </section>

      {/* 3. Support/Escalation details */}
      {supportMode && (
        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 mb-20">
          {config.highlights.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card p-8 flex flex-col gap-4 hover:border-blue-100"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                {idx === 0 ? <Key size={20} weight="bold" /> : idx === 1 ? <PhoneCall size={20} weight="bold" /> : <EnvelopeSimple size={20} weight="bold" />}
              </div>
              <h4 className="font-bold text-zinc-900">{item}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {variant === 'help' && 'Step-by-step resolution paths and direct verification verification options.'}
                {variant === 'contact' && 'Secure communications link directly routed to verification administrators.'}
                {variant === 'careers' && 'Build modern frameworks, infrastructure platforms, and trust registries.'}
              </p>
            </motion.div>
          ))}
        </section>
      )}

      {/* 4. Legal / Documentation text */}
      {legalMode && (
        <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.25fr_0.75fr] gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <LegalPanel title={config.title}>
              <p className="text-zinc-600">{config.body}</p>
              <p className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-medium text-sm text-zinc-500 flex items-start gap-3">
                <BookOpen size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span>All documents, records, verification logs, and user identity credentials are handled in accordance with privacy-first standards.</span>
              </p>
            </LegalPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8 space-y-6"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Linked Protocols</span>
            <div className="space-y-3">
              {config.highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 bg-zinc-50/50 border border-zinc-100 rounded-xl">
                  <CheckCircle size={18} weight="fill" className="text-blue-600" />
                  <span className="text-sm font-bold text-zinc-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 5. Execute action strip */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 md:p-14 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-8"
        >
          <div className="space-y-2">
            <span className="dot-pulse text-green-400 mr-2" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Execute verification</span>
            <h2 className="text-white text-3xl md:text-4xl leading-tight font-black">Join Workora today</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/feed" className="btn inline-flex h-12 items-center justify-center bg-[#0066FF] px-6 text-sm font-bold text-white rounded-xl">
              Open feed
            </Link>
            <Link href="/login" className="btn inline-flex h-12 items-center justify-center border border-zinc-750 px-6 text-sm font-bold text-zinc-200 rounded-xl bg-zinc-800 hover:bg-zinc-700">
              Sign in
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
