'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkle, ShieldCheck, Star, Clock, PhoneCall,
  UserCheck, ChatCircle, MapPin, VideoCamera, CheckCircle,
  Play, Heart
} from '@phosphor-icons/react';

import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_DEFAULTS, PublicGig, PublicSurfaceData } from '@/lib/public-surface';

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  { number: '01', title: 'Search nearby', desc: 'Type what you need — plumber, electrician, cleaner — and see who\'s available in your area right now.', icon: MapPin },
  { number: '02', title: 'Watch their work', desc: 'Every professional shows real videos and photos of completed jobs. See quality before you commit.', icon: VideoCamera },
  { number: '03', title: 'Chat and agree', desc: 'Message directly, get a quote, agree on price — all inside the app. No middleman involved.', icon: ChatCircle },
  { number: '04', title: 'Done. Leave a review.', desc: 'Leave a review that helps the next person hire with confidence — the proof stays public.', icon: CheckCircle },
];

const reasons = [
  { icon: ShieldCheck,         color: 'bg-emerald-50   text-emerald-600', title: 'ID-verified workers',     desc: 'Identity verification and trade checks happen before anyone can be hired.' },
  { icon: Star,                color: 'bg-yellow-50 text-yellow-600',     title: 'Real ratings, real jobs', desc: 'Every review ties back to a visible proof-of-work post. No fake reviews.' },
  { icon: Clock,               color: 'bg-green-50  text-green-600',      title: 'Fast response',           desc: 'Most professionals reply within hours — many are same-day available.' },
  { icon: VideoCamera,         color: 'bg-purple-50 text-purple-600',     title: 'See the work first',      desc: 'Before/after video proof means you judge quality, not promises.' },
  { icon: PhoneCall,           color: 'bg-indigo-50 text-indigo-600',     title: 'Direct contact',          desc: 'Talk straight to the professional — no call centres, no queues.' },
  { icon: UserCheck,           color: 'bg-rose-50   text-rose-600',       title: 'Hire again easily',       desc: 'Save favourites and re-book your go-to professionals in one tap.' },
];

function GigCard({ gig }: { gig: PublicGig }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200">
      <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
        {gig.video_url ? (
          <VideoPlayer src={gig.video_url} poster={gig.thumbnail_url || undefined} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" autoPlay intersectionThreshold={0.4} />
        ) : (
          <SafeMediaThumb src={gig.thumbnail_url || APP_DEFAULTS.thumbnail} alt={gig.title || 'Workora post'} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-700 backdrop-blur">
            <Play size={11} weight="fill" className="text-emerald-600" /> Watch
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
          <ShieldCheck size={13} weight="fill" />
          {gig.trade || gig.category || 'Member'}
        </div>
        <h3 className="mt-2 text-[15px] font-bold text-zinc-900 tracking-tight leading-snug line-clamp-1">{gig.title || 'Live proof-of-work post'}</h3>
        <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">{gig.description || 'A live post from the feed.'}</p>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-50 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 text-[8px] font-black text-white">
              {(gig.user_name || gig.handle || 'M').charAt(0).toUpperCase()}
            </span>
            {gig.user_name || gig.handle || 'Member'}
          </span>
          <span className="flex items-center gap-2.5 text-[11px] font-bold text-zinc-400">
            <span className="inline-flex items-center gap-1"><Heart size={12} weight="fill" className="text-rose-400" />{Number(gig.likes_count || 0)}</span>
            <span className="inline-flex items-center gap-1"><ChatCircle size={12} weight="fill" className="text-emerald-400" />{Number(gig.comments_count || 0)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function PersonalClient({ data }: { data: PublicSurfaceData }) {
  const feed = data.feed.length ? data.feed : data.explore;

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-clip">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[#07090F] text-white">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 opacity-[0.14] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-36 md:pt-44 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="space-y-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-400">
              <Sparkle size={13} weight="fill" />
              For homeowners &amp; individuals
            </span>
            <h1 className="mx-auto max-w-4xl text-white font-black leading-[1.05] tracking-tight">
              Hire a trusted professional{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                you can actually rely on.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed">
              Stop asking around. Stop guessing. Workora shows you verified workers nearby,
              with real reviews and proof of their work — so you hire right the first time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <Link
                href="/dashboard/search"
                id="personal-hero-primary"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-zinc-950 shadow-xl transition-all duration-300 hover:scale-[1.03]"
              >
                Find a professional
                <ArrowRight size={17} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/join"
                id="personal-hero-secondary"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]"
              >
                Create free account
              </Link>
            </div>
            <p className="text-sm text-white/35">Free to browse. No sign-up needed to search.</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ LIVE DATA STRIP ═══════════ */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Trades to search', value: String(data.stats.tradeCount), icon: MapPin },
            { label: 'Proof posts live', value: String(data.stats.feedCount + data.stats.exploreCount), icon: Play },
            { label: 'Verified posts', value: String(data.stats.verifiedCount), icon: ShieldCheck },
            { label: 'Pros with reviews', value: String(data.stats.feedCount), icon: Star },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">How it works</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Four steps and you&apos;re done.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: EASE }}
                className="group relative rounded-3xl border border-zinc-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/[0.08]"
              >
                <span className="absolute right-6 top-5 text-5xl font-black text-zinc-200 select-none leading-none transition-colors duration-300 group-hover:text-emerald-300">
                  {step.number}
                </span>
                <div className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                    <step.icon size={22} weight="bold" />
                  </div>
                  <h4 className="text-lg font-black text-zinc-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY WORKORA ═══════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Why Workora</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">We protect you as the hirer</h2>
            <p className="mt-3 text-zinc-500 text-lg max-w-xl mx-auto">
              Proof before promises — that&apos;s the whole difference.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                className="group flex gap-4 rounded-3xl border border-zinc-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/[0.06]"
              >
                <div className={`flex-shrink-0 h-11 w-11 rounded-xl ${r.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <r.icon size={22} weight="bold" />
                </div>
                <div>
                  <div className="font-black text-zinc-900 mb-1">{r.title}</div>
                  <div className="text-sm text-zinc-500 leading-relaxed">{r.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LIVE PROOF ═══════════ */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Live on the platform</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">See the work before you hire</h2>
              <p className="mt-3 text-zinc-500 max-w-md">Real proof-of-work posts from professionals already on Workora.</p>
            </div>
            <Link href="/dashboard/search" className="group inline-flex items-center gap-2 rounded-xl border-2 border-zinc-200 px-5 py-3 text-sm font-black text-zinc-800 transition-all duration-300 hover:border-emerald-300 hover:text-emerald-700">
              Search professionals
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

      {/* ═══════════ CTA ═══════════ */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-[#07090F] p-10 md:p-16 text-white"
        >
          <div className="absolute -top-32 left-1/4 h-[360px] w-[560px] rounded-full bg-gradient-to-r from-emerald-500 opacity-20 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-xl space-y-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span className="dot-pulse text-emerald-400" />
                Ready when you are
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Hire someone you can <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">actually trust</span>
              </h2>
              <p className="text-white/55 text-base md:text-lg leading-relaxed">
                Verified workers, visible proof, and reviews that come from real jobs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/search" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-zinc-950 transition-all duration-300 hover:scale-[1.03]">
                Find a professional now
                <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/join" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]">
                Create free account
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
