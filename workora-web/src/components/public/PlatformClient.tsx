'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MagnifyingGlass, ChatCircleDots, TrendUp, UploadSimple,
  ShieldCheck, Lightning, Bell, Globe, DeviceMobile,
  ArrowRight, Sparkle, Play, Heart, ChatCircle
} from '@phosphor-icons/react';

import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_DEFAULTS, PublicGig, PublicSurfaceData } from '@/lib/public-surface';

const EASE = [0.22, 1, 0.36, 1] as const;

const features = [
  { icon: MagnifyingGlass, bg: 'bg-blue-50',     text: 'text-blue-600',     title: 'Smart search',        desc: 'Find verified pros by trade, location, rating, and live availability — instantly.' },
  { icon: UploadSimple,    bg: 'bg-emerald-50',  text: 'text-emerald-600',  title: 'Proof of work',       desc: 'Workers upload real photos and videos of jobs. You see quality before you book.' },
  { icon: ChatCircleDots,  bg: 'bg-purple-50',   text: 'text-purple-600',   title: 'Direct messaging',    desc: 'Chat straight with workers. No middleman. Share documents, agree terms, track progress.' },
  { icon: ShieldCheck,     bg: 'bg-indigo-50',   text: 'text-indigo-600',   title: 'Trust Passport',      desc: 'Verified identity, certified skills, and a real reputation score from actual jobs done.' },
  { icon: TrendUp,         bg: 'bg-orange-50',   text: 'text-orange-600',   title: 'Live analytics',      desc: 'Workers see profile views, job requests, and earnings data in real-time dashboards.' },
  { icon: Lightning,       bg: 'bg-yellow-50',   text: 'text-yellow-600',   title: 'Fast verification',   desc: 'Workers get verified within 24 hours — government ID, trade certs, peer reviews.' },
  { icon: Bell,            bg: 'bg-pink-50',     text: 'text-pink-600',     title: 'Instant job alerts',  desc: 'Hirers get notified the moment a matching professional becomes available nearby.' },
  { icon: Globe,           bg: 'bg-teal-50',     text: 'text-teal-600',     title: 'Multi-language',      desc: 'Available in English and Swahili — reaching the widest professional network possible.' },
  { icon: DeviceMobile,    bg: 'bg-cyan-50',     text: 'text-cyan-600',     title: 'Mobile-first',        desc: 'Fully optimised for phones. Everything works smoothly, even on slow connections.' },
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

export function PlatformClient({ data }: { data: PublicSurfaceData }) {
  const feed = data.feed.length ? data.feed : data.explore;

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-clip">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[#07090F] text-white">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-[0.16] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-36 md:pt-44 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="space-y-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-blue-400">
              <Sparkle size={13} weight="fill" />
              The platform
            </span>
            <h1 className="mx-auto max-w-4xl text-white font-black leading-[1.05] tracking-tight">
              One platform.{' '}
              <span className="animated-text">
                Every tool you need.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed">
              Search, verify, message, and track — all in one place. The complete
              professional hiring platform built for East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <Link
                href="/join"
                id="platform-hero-primary"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-zinc-950 shadow-xl transition-all duration-300 hover:scale-[1.03]"
              >
                Create free account
                <ArrowRight size={17} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/feed"
                id="platform-hero-secondary"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]"
              >
                Browse the platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ LIVE DATA STRIP ═══════════ */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Trades live', value: String(data.stats.tradeCount), icon: Globe },
            { label: 'Proof posts', value: String(data.stats.feedCount + data.stats.exploreCount), icon: Play },
            { label: 'Verified posts', value: String(data.stats.verifiedCount), icon: ShieldCheck },
            { label: 'Work records', value: String(data.stats.feedCount), icon: TrendUp },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <s.icon size={19} weight="bold" />
              </span>
              <div>
                <div className="text-xl font-black text-zinc-900 tracking-tight">{s.value}</div>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Capabilities</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Everything works together</h2>
            <p className="mt-3 text-zinc-500 text-lg max-w-xl mx-auto">Every feature is designed to make hiring faster, safer, and more trustworthy.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                className="group rounded-3xl border border-zinc-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/[0.07]"
              >
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${f.bg} ${f.text} transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon size={22} weight="bold" />
                </div>
                <h4 className="font-black text-zinc-900">{f.title}</h4>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LIVE PROOF ═══════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                <span className="dot-pulse text-emerald-500" />
                Live on the platform
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">See real work from real pros</h2>
              <p className="mt-3 text-zinc-500 max-w-md">These are professionals already on the platform — log in to connect with them directly.</p>
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

      {/* ═══════════ WHO IS IT FOR ═══════════ */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Who it&apos;s for</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Built for everyone</h2>
            <p className="mt-3 text-zinc-500 text-lg max-w-xl mx-auto">Whether you hire or do the work — Workora is for you.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: '🏠',
                title: 'Homeowners',
                desc:  'Find verified professionals for home repairs, maintenance, and improvement projects.',
                href:  '/personal',
                color: 'from-emerald-50 to-teal-50',
                border: 'hover:border-emerald-200',
                btn:   'bg-emerald-600 text-white',
                label: 'Learn more',
              },
              {
                emoji: '🏢',
                title: 'Businesses',
                desc:  'Hire skilled workers at scale with bulk tools, dashboards, and enterprise support.',
                href:  '/business',
                color: 'from-blue-50 to-indigo-50',
                border: 'hover:border-blue-200',
                btn:   'bg-blue-600 text-white',
                label: 'Learn more',
              },
              {
                emoji: '👷',
                title: 'Professionals',
                desc:  'Showcase your work, build your reputation, and get hired directly by clients who trust you.',
                href:  '/join',
                color: 'from-violet-50 to-purple-50',
                border: 'hover:border-violet-200',
                btn:   'bg-violet-600 text-white',
                label: 'Join as a worker',
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                className={`group rounded-3xl border border-zinc-100 bg-gradient-to-br ${c.color} ${c.border} p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}
              >
                <div className="text-4xl transition-transform duration-300 group-hover:scale-110 origin-left">{c.emoji}</div>
                <div>
                  <h3 className="text-zinc-900 mb-2">{c.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{c.desc}</p>
                </div>
                <Link
                  href={c.href}
                  className={`mt-auto inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black ${c.btn} transition-all duration-300 hover:scale-[1.03]`}
                >
                  {c.label} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-[#07090F] p-10 md:p-16 text-white"
        >
          <div className="absolute -top-32 left-1/4 h-[360px] w-[560px] rounded-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-20 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-xl space-y-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span className="dot-pulse text-blue-400" />
                The full system
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Experience the <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">full platform</span>
              </h2>
              <p className="text-white/55 text-base md:text-lg leading-relaxed">
                Create a free account and explore everything Workora has to offer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-zinc-950 transition-all duration-300 hover:scale-[1.03]">
                Create free account
                <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]">
                Log in
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
