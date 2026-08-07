'use client';

import React from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  MagnifyingGlass, ChatCircleDots, TrendUp, UploadSimple,
  ShieldCheck, Lightning, Bell, Globe, DeviceMobile,
  ArrowRight, Sparkle, CheckCircle, Users
} from '@phosphor-icons/react';
import { ReelsStrip } from '@/components/ReelsStrip';

/* ── Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
};

/* ── Data ── */
const features = [
  { icon: MagnifyingGlass, bg: 'bg-blue-50',    text: 'text-blue-600',    title: 'Smart search',           desc: 'Find verified pros by trade, location, rating, and live availability — instantly.'          },
  { icon: UploadSimple,    bg: 'bg-emerald-50',  text: 'text-emerald-600', title: 'Proof of work',          desc: 'Workers upload real photos and videos of jobs. You see quality before you book.'           },
  { icon: ChatCircleDots,  bg: 'bg-purple-50',   text: 'text-purple-600',  title: 'Direct messaging',       desc: 'Chat straight with workers. No middleman. Share documents, agree terms, track progress.'   },
  { icon: ShieldCheck,     bg: 'bg-indigo-50',   text: 'text-indigo-600',  title: 'Trust Passport',         desc: 'Verified identity, certified skills, and a real reputation score from actual jobs done.'   },
  { icon: TrendUp,         bg: 'bg-orange-50',   text: 'text-orange-600',  title: 'Live analytics',         desc: 'Workers see profile views, job requests, and earnings data in real-time dashboards.'       },
  { icon: Lightning,       bg: 'bg-yellow-50',   text: 'text-yellow-600',  title: 'Fast verification',      desc: 'Workers get verified within 24 hours — government ID, trade certs, peer reviews.'         },
  { icon: Bell,            bg: 'bg-pink-50',     text: 'text-pink-600',    title: 'Instant job alerts',     desc: 'Hirers get notified the moment a matching professional becomes available nearby.'         },
  { icon: Globe,           bg: 'bg-teal-50',     text: 'text-teal-600',    title: 'Multi-language',         desc: 'Available in English and Swahili — reaching the widest professional network possible.'    },
  { icon: DeviceMobile,    bg: 'bg-cyan-50',     text: 'text-cyan-600',    title: 'Mobile-first',           desc: 'Fully optimised for phones. Everything works smoothly, even on slow connections.'         },
];

export default function PlatformPage() {
  return (
    <main className="min-h-screen bg-transparent text-zinc-900">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 -z-10" />
        <div className="absolute -left-32 -bottom-16 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/50 to-purple-100/30 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.11 } } }}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkle size={13} weight="fill" className="text-blue-600" />
                The platform
              </span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-black text-zinc-900 leading-tight">
              One platform.<br />
              <span className="animated-text">Every tool you need.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Search, verify, message, pay, and track — all in one place. The complete
              professional hiring platform built for East Africa.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/join"
                id="platform-hero-primary"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-8 bg-[#0066FF] text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/25"
              >
                Create free account
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link
                href="/dashboard/feed"
                id="platform-hero-secondary"
                className="btn inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-200 text-zinc-800 rounded-2xl font-bold text-base"
              >
                Browse the platform
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — white bar
      ══════════════════════════════════════ */}
      <section className="bg-white border-y border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10K+',  label: 'Verified professionals' },
            { value: '50K+',  label: 'Projects completed'     },
            { value: '4.9★',  label: 'Average rating'         },
            { value: '24/7',  label: 'Platform uptime'        },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-black text-zinc-900 mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — 9-card grid
      ══════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-zinc-900 mb-4">Everything works together</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Every feature is designed to make hiring faster, safer, and more trustworthy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="card p-6 flex flex-col gap-4 hover:border-blue-200"
              >
                <div className={`h-11 w-11 rounded-xl ${f.bg} ${f.text} flex items-center justify-center`}>
                  <f.icon size={22} weight="bold" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{f.title}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REELS — dark section (see real work)
      ══════════════════════════════════════ */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/70 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              <span className="dot-pulse text-green-400" />
              Live on the platform
            </span>
            <h2 className="text-white mb-3">
              See real work from real pros
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              These are professionals already on the platform — log in to connect with them directly.
            </p>
          </div>

          {/* Reels strip */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <ReelsStrip />
          </div>

          <div className="text-center mt-10">
            <Link
              href="/join"
              id="platform-reels-cta"
              className="btn inline-flex items-center justify-center gap-2 h-12 px-8 bg-[#0066FF] text-white rounded-xl font-bold text-sm"
            >
              Join to see more
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHO IS IT FOR — 3 cards
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-zinc-900 mb-4">Built for everyone</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Whether you hire or do the work — Workora is for you.
            </p>
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
                transition={{ delay: i * 0.12 }}
                className={`card p-7 bg-gradient-to-br ${c.color} ${c.border} flex flex-col gap-5`}
              >
                <div className="text-4xl">{c.emoji}</div>
                <div>
                  <h3 className="text-zinc-900 mb-2">{c.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{c.desc}</p>
                </div>
                <Link
                  href={c.href}
                  className={`btn mt-auto inline-flex items-center gap-2 h-10 px-5 ${c.btn} rounded-xl font-bold text-sm w-fit`}
                >
                  {c.label} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-28 bg-zinc-50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-zinc-900">
              Ready to experience<br />
              <span className="gradient-text">the full platform?</span>
            </h2>
            <p className="text-zinc-500 text-xl max-w-xl mx-auto">
              Create a free account and explore everything Workora has to offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/join"
                id="platform-final-cta"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-10 bg-[#0066FF] text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/20"
              >
                Create free account
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link
                href="/login"
                id="platform-login-cta"
                className="btn inline-flex items-center justify-center h-14 px-10 border-2 border-zinc-200 text-zinc-800 rounded-2xl font-bold text-base"
              >
                Log in
              </Link>
            </div>
            <p className="text-sm text-zinc-400">Free to join. No credit card required.</p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
