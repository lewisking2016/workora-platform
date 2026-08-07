'use client';

import React from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  MagnifyingGlass, ChartLine, UserCheck, Clock, Shield, TrendUp,
  CheckCircle, ArrowRight, Sparkle, UsersThree, PhoneCall, Briefcase, Receipt
} from '@phosphor-icons/react';

/* ── Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
};

/* ── Data ── */
const features = [
  { icon: MagnifyingGlass, color: 'bg-blue-50 text-blue-600',    title: 'Filtered search',       desc: 'Search by trade, location, rating, and availability. Find exactly who you need in seconds.'       },
  { icon: UserCheck,       color: 'bg-emerald-50 text-emerald-600', title: 'Pre-vetted workers', desc: 'Every candidate has passed ID checks, trade certification, and full background review.'           },
  { icon: ChartLine,       color: 'bg-purple-50 text-purple-600', title: 'Hiring dashboard',     desc: 'Track all active hires, pending requests, and completed jobs in one simple view.'                 },
  { icon: Clock,           color: 'bg-orange-50 text-orange-600', title: 'Real-time availability', desc: 'See who is free right now. No back-and-forth scheduling calls or waiting.'                     },
  { icon: Shield,          color: 'bg-rose-50 text-rose-600',    title: 'Payment protection',    desc: 'Funds held safely until work is approved. Dispute resolution and refunds covered.'                },
  { icon: TrendUp,         color: 'bg-indigo-50 text-indigo-600', title: 'Workforce insights',   desc: 'Reports on spend, job completion rates, and top performer tracking — all exportable.'            },
];

const enterprisePerks = [
  'Priority 24/7 support',
  'Bulk hiring discounts',
  'Team collaboration tools',
  'Custom invoicing & purchase orders',
  'Dedicated account manager',
  'Advanced reporting & exports',
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-transparent text-zinc-900">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div className="absolute -right-48 -top-24 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-100/60 to-purple-100/40 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.11 } } }}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkle size={13} weight="fill" />
                For businesses &amp; companies
              </span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-black text-zinc-900 leading-tight">
              Hire skilled workers at scale<br />
              <span className="text-blue-600">without the risk.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Whether you need one plumber or fifty construction workers, Workora gives your
              team instant access to verified, rated professionals ready to start.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/join?type=business"
                id="business-hero-primary"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-8 bg-blue-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/25"
              >
                Start hiring today
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link
                href="/dashboard/search"
                id="business-hero-secondary"
                className="btn inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-200 text-zinc-800 rounded-2xl font-bold text-base"
              >
                Browse workers
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div custom={4} variants={fadeUp} className="flex flex-wrap justify-center gap-8 pt-4">
              {[
                { value: '10,000+', label: 'Verified workers'  },
                { value: '98%',     label: 'Satisfaction rate' },
                { value: '50K+',    label: 'Jobs completed'    },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-blue-600">{s.value}</div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR — white
      ══════════════════════════════════════ */}
      <section className="bg-white border-y border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10K+',  label: 'Verified workers'  },
            { value: '98%',   label: 'Satisfaction rate' },
            { value: '50K+',  label: 'Jobs completed'    },
            { value: '4.9★',  label: 'Avg. worker rating'},
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-black text-blue-600 mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — 6 cards
      ══════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-zinc-900 mb-4">Everything your team needs</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              A complete hiring toolkit built for businesses that cannot afford mistakes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card p-7 flex flex-col gap-4 hover:border-blue-200 hover:bg-blue-50/20"
              >
                <div className={`h-12 w-12 rounded-xl ${f.color} flex items-center justify-center`}>
                  <f.icon size={24} weight="bold" />
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
          ENTERPRISE — split layout
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: checklist */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Business plan
              </span>
              <h2 className="text-zinc-900 leading-tight">
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
                className="btn inline-flex items-center gap-2 h-12 px-6 bg-blue-600 text-white rounded-xl font-bold text-sm"
              >
                Start hiring now <ArrowRight size={16} weight="bold" />
              </Link>
            </motion.div>

            {/* Right: info cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-8 space-y-6"
            >
              {[
                { icon: UsersThree, title: '10,000+ businesses',    sub: 'already using Workora'         },
                { icon: Briefcase,  title: 'Any team size',         sub: 'from 2 to 2,000 employees'     },
                { icon: PhoneCall,  title: '24/7 support',          sub: 'dedicated account management'  },
                { icon: Receipt,    title: 'Custom contracts',      sub: 'tailored billing and invoicing' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{item.title}</div>
                    <div className="text-sm text-zinc-400">{item.sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — blue→purple gradient
      ══════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <h2 className="text-white">Transform how your business hires.</h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto">
              Join thousands of companies using Workora to hire faster, smarter, and safer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/join?type=business"
                id="business-final-cta"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-8 bg-white text-blue-700 rounded-2xl font-bold text-base hover:bg-blue-50"
              >
                Start hiring
                <ArrowRight weight="bold" size={18} />
              </Link>
            </div>
            <p className="text-blue-200/70 text-sm">Free to start. No card needed.</p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
