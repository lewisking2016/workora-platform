'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MagnifyingGlass, ChartLine, UserCheck, Clock, ShieldCheck, TrendUp,
  CheckCircle, ArrowRight, Sparkle, UsersThree, PhoneCall, Briefcase, Receipt,
  Play, Heart, ChatCircle
} from '@phosphor-icons/react';

import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_DEFAULTS, PublicGig, PublicSurfaceData } from '@/lib/public-surface';

const EASE = [0.22, 1, 0.36, 1] as const;

const features = [
  { icon: MagnifyingGlass, color: 'bg-blue-50 text-blue-600',      title: 'Filtered search',       desc: 'Search by trade, location, rating, and availability. Find exactly who you need in seconds.' },
  { icon: UserCheck,       color: 'bg-emerald-50 text-emerald-600', title: 'Pre-vetted workers',   desc: 'Every candidate has passed ID checks, trade certification, and full background review.' },
  { icon: ChartLine,       color: 'bg-purple-50 text-purple-600',  title: 'Hiring dashboard',     desc: 'Track all active hires, pending requests, and completed jobs in one simple view.' },
  { icon: Clock,           color: 'bg-orange-50 text-orange-600',  title: 'Real-time availability', desc: 'See who is free right now. No back-and-forth scheduling calls or waiting.' },
  { icon: ShieldCheck,     color: 'bg-rose-50 text-rose-600',      title: 'Payment protection',   desc: 'Funds held safely until work is approved. Dispute resolution and refunds covered.' },
  { icon: TrendUp,         color: 'bg-indigo-50 text-indigo-600',  title: 'Workforce insights',   desc: 'Reports on spend, job completion rates, and top performer tracking — all exportable.' },
];

const enterprisePerks = [
  'Priority 24/7 support',
  'Bulk hiring discounts',
  'Team collaboration tools',
  'Custom invoicing & purchase orders',
  'Dedicated account manager',
  'Advanced reporting & exports',
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

export function BusinessClient({ data }: { data: PublicSurfaceData }) {
  const feed = data.feed.length ? data.feed : data.explore;

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-clip">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[#07090F] text-white">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-[0.15] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
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
              For businesses &amp; companies
            </span>
            <h1 className="mx-auto max-w-4xl text-white font-black leading-[1.05] tracking-tight">
              Hire skilled workers at scale{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                without the risk.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed">
              Whether you need one plumber or fifty construction workers, Workora gives your
              team instant access to verified, rated professionals ready to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <Link
                href="/join?type=business"
                id="business-hero-primary"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-zinc-950 shadow-xl transition-all duration-300 hover:scale-[1.03]"
              >
                Start hiring today
                <ArrowRight size={17} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/search"
                id="business-hero-secondary"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold text-white/85 transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]"
              >
                Browse workers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ LIVE DATA STRIP ═══════════ */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Trades to hire', value: String(data.stats.tradeCount), icon: UsersThree },
            { label: 'Proof posts live', value: String(data.stats.feedCount + data.stats.exploreCount), icon: Play },
            { label: 'Verified posts', value: String(data.stats.verifiedCount), icon: ShieldCheck },
            { label: 'Work records', value: String(data.stats.feedCount), icon: Briefcase },
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">The toolkit</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Everything your team needs</h2>
            <p className="mt-3 text-zinc-500 text-lg max-w-xl mx-auto">A complete hiring toolkit built for businesses that cannot afford mistakes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                className="group rounded-3xl border border-zinc-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/[0.07]"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon size={24} weight="bold" />
                </div>
                <h4 className="text-lg font-black text-zinc-900">{f.title}</h4>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ENTERPRISE ═══════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                <Briefcase size={13} weight="bold" />
                Business plan
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                Built for teams that<br />need reliability.
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Get everything in the standard plan, plus enterprise-grade controls,
                volume pricing, and dedicated support.
              </p>
              <ul className="space-y-3">
                {enterprisePerks.map(perk => (
                  <li key={perk} className="flex items-center gap-3">
                    <CheckCircle size={18} weight="fill" className="text-blue-600 flex-shrink-0" />
                    <span className="text-zinc-700 font-medium">{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard/search"
                id="business-enterprise-cta"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                Start hiring now <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-3xl border border-zinc-100 bg-zinc-50/60 p-8 space-y-6"
            >
              {[
                { icon: UsersThree, title: 'Live network',        sub: 'trades with verified members' },
                { icon: Briefcase,  title: 'Any team size',       sub: 'from 2 to 2,000 employees' },
                { icon: PhoneCall,  title: '24/7 support',        sub: 'dedicated account management' },
                { icon: Receipt,    title: 'Custom contracts',    sub: 'tailored billing and invoicing' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-black text-zinc-900">{item.title}</div>
                    <div className="text-sm text-zinc-400">{item.sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ LIVE PROOF ═══════════ */}
      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Live on the platform</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Work you can vet before you hire</h2>
              <p className="mt-3 text-zinc-500 max-w-md">Real posts from the feed — proof of capability, not promises.</p>
            </div>
            <Link href="/dashboard/search" className="group inline-flex items-center gap-2 rounded-xl border-2 border-zinc-200 px-5 py-3 text-sm font-black text-zinc-800 transition-all duration-300 hover:border-blue-300 hover:text-blue-700">
              Browse workers
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
          <div className="absolute -top-32 left-1/4 h-[360px] w-[560px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-xl space-y-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <span className="dot-pulse text-blue-400" />
                Scale with proof
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Transform how your business <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">hires</span>
              </h2>
              <p className="text-white/55 text-base md:text-lg leading-relaxed">
                Verified workers, visible proof, and a network you can scale with.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join?type=business" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-zinc-950 transition-all duration-300 hover:scale-[1.03]">
                Start hiring
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
