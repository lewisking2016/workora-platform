'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, TrendUp, UsersThree, Lightbulb,
  CaretRight, Sparkle, ShieldCheck, Play, Heart, ChatCircle, ChartBar
} from '@phosphor-icons/react';

import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_DEFAULTS, PublicGig, PublicSurfaceData } from '@/lib/public-surface';

const EASE = [0.22, 1, 0.36, 1] as const;

const insights = [
  {
    icon: TrendUp,
    tag: 'Market',
    accent: 'bg-blue-50 text-blue-600',
    bar: 'from-blue-500 to-cyan-400',
    title: 'The informal workforce is the majority — and it is invisible',
    body: 'Across East Africa, over 80% of workers earn their living outside formal employment. They have skills, clients, and reputation — but none of it is recorded anywhere a hirer can verify. Workora exists to change that one proof-of-work post at a time.',
    stat: '80%+',
    statLabel: 'of the workforce is informal',
  },
  {
    icon: ShieldCheck,
    tag: 'Trust',
    accent: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-500 to-teal-400',
    title: 'Trust is the product. Proof is the currency.',
    body: 'Ratings alone can be gamed. Video proof of actual work — timestamped, attached to a verified identity — is the closest thing the informal economy has to a reference letter. Every verified post on the feed is evidence a future client can see before they commit.',
    stat: '100%',
    statLabel: 'proof-of-work posts are visible',
  },
  {
    icon: UsersThree,
    tag: 'Network',
    accent: 'bg-violet-50 text-violet-600',
    bar: 'from-blue-500',
    title: 'Community beats directory',
    body: 'A directory lists names. A community carries reputation. When workers follow each other, leave reviews, and share live work, hiring stops being a gamble and starts being a referral — at platform scale.',
    stat: '1:1',
    statLabel: 'work shown is work proven',
  },
  {
    icon: Lightbulb,
    tag: 'Product',
    accent: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-500 to-orange-400',
    title: 'The phone is the workbench',
    body: 'Most tradespeople run their entire business from one phone — photos of finished jobs, client messages, price negotiations. The platform that mirrors that workflow wins. That is why Workora is mobile-first, works on slow connections, and treats a 3-minute video as a first-class asset.',
    stat: '1 phone',
    statLabel: 'is the entire business toolkit',
  },
];

function GigCard({ gig }: { gig: PublicGig }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200">
      <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
        {gig.video_url ? (
          <VideoPlayer src={gig.video_url} poster={gig.thumbnail_url || undefined} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" autoPlay intersectionThreshold={0.4} />
        ) : (
          <SafeMediaThumb src={gig.thumbnail_url || APP_DEFAULTS.thumbnail} alt={gig.title || 'Workora post'} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
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
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 text-[8px] font-black text-white">
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

export function InsightsClient({ data }: { data: PublicSurfaceData }) {
  const feed = data.feed.length ? data.feed : data.explore;

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07090F] text-white">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 opacity-[0.15] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-36 md:pt-44">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-3xl space-y-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-400">
              <Sparkle size={13} weight="fill" />
              Insights
            </span>
            <h1 className="text-white font-black leading-[1.05] tracking-tight">
              The thinking behind{' '}
              <span className="bg-gradient-to-r from-blue-500 bg-clip-text text-transparent">
                the platform
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl">
              Notes on the informal economy, trust infrastructure, and building the proof-of-work layer for East Africa.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/join" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-zinc-950 shadow-xl transition-all duration-300 hover:scale-[1.03]">
                Join the platform
                <ArrowRight size={17} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live stats strip */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Trades live', value: String(data.stats.tradeCount), icon: UsersThree },
            { label: 'Proof posts', value: String(data.stats.feedCount + data.stats.exploreCount), icon: Play },
            { label: 'Verified posts', value: String(data.stats.verifiedCount), icon: ShieldCheck },
            { label: 'Feed capacity', value: String(Math.max(data.stats.feedCount * 25, 50)), icon: ChartBar, suffix: 'K' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <s.icon size={19} weight="bold" />
              </span>
              <div>
                <div className="text-xl font-black text-zinc-900 tracking-tight">{s.value}{s.suffix || ''}</div>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insight articles */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid lg:grid-cols-2 gap-6">
          {insights.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6, ease: EASE }}
              className="group flex flex-col rounded-3xl border border-zinc-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-900/[0.07]"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${item.accent}`}>
                  <item.icon size={12} weight="bold" />
                  {item.tag}
                </span>
                <span className={`text-3xl font-black tracking-tight bg-gradient-to-r ${item.bar} bg-clip-text text-transparent`}>
                  {item.stat}
                </span>
              </div>
              <h2 className="mt-5 text-xl md:text-2xl font-black text-zinc-900 tracking-tight leading-snug">
                {item.title}
              </h2>
              <p className="mt-3 text-[15px] text-zinc-500 leading-relaxed flex-1">
                {item.body}
              </p>
              <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{item.statLabel}</span>
                <Link href="/platform" className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-600">
                  Explore platform <CaretRight size={12} weight="bold" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Live proof stream — real data */}
      <section className="bg-zinc-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Live on the platform</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Proof, in motion</h2>
              <p className="mt-3 text-zinc-500 max-w-md">Real posts from the feed — this is what verifiable work looks like.</p>
            </div>
            <Link href="/dashboard/feed" className="group inline-flex items-center gap-2 rounded-xl border-2 border-zinc-200 px-5 py-3 text-sm font-black text-zinc-800 transition-all duration-300 hover:border-blue-300 hover:text-blue-700">
              Open live feed
              <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {feed.slice(0, 6).map((gig, idx) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.5, ease: EASE }}
              >
                <GigCard gig={gig} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-[#07090F] p-10 md:p-16 text-white"
        >
          <div className="absolute -top-32 left-1/4 h-[360px] w-[560px] rounded-full bg-gradient-to-r from-blue-500 opacity-20 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-xl space-y-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span className="dot-pulse text-blue-400" />
                Start building yours
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Your work is your <span className="bg-gradient-to-r from-blue-500 bg-clip-text text-transparent">evidence</span>
              </h2>
              <p className="text-white/55 text-base md:text-lg leading-relaxed">
                Join Workora, post your proof, and let verified work speak for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-zinc-950 transition-all duration-300 hover:scale-[1.03]">
                Create account
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
