'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import {
  MapPin, VideoCamera, ChatCircle, CheckCircle,
  ArrowRight, ShieldCheck, Star, Clock, PhoneCall,
  Sparkle, UserCheck, CurrencyCircleDollar
} from '@phosphor-icons/react';

/* ── Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
};

/* ── Data ── */
const steps = [
  { icon: MapPin,       number: '01', title: 'Search nearby',           desc: 'Type what you need — plumber, electrician, cleaner — and see who\'s available in your area right now.'              },
  { icon: VideoCamera,  number: '02', title: 'Watch their work',        desc: 'Every professional shows real videos and photos of completed jobs. See quality before you commit.'                 },
  { icon: ChatCircle,   number: '03', title: 'Chat and agree',          desc: 'Message directly, get a quote, agree on price — all inside the app. No middleman involved.'                       },
  { icon: CheckCircle,  number: '04', title: 'Done. Leave a review.',   desc: 'Pay securely through the app. Leave a review that helps the next person hire with confidence.'                    },
];

const reasons = [
  { icon: ShieldCheck,         color: 'bg-blue-50   text-blue-600',    title: 'ID-verified workers',        desc: 'Every worker goes through identity verification and trade certification checks before they can work.' },
  { icon: Star,                color: 'bg-yellow-50 text-yellow-600',  title: 'Real ratings, real jobs',    desc: 'Every review is from a verified client who hired and paid through the platform. No fake reviews.'   },
  { icon: Clock,               color: 'bg-green-50  text-green-600',   title: 'Fast response',              desc: 'Most professionals reply within 2 hours. Many are available for same-day bookings.'                 },
  { icon: CurrencyCircleDollar,color: 'bg-purple-50 text-purple-600',  title: 'No surprise costs',          desc: 'Agree on the price before work starts. Pay only when you are fully satisfied with the result.'       },
  { icon: PhoneCall,           color: 'bg-indigo-50 text-indigo-600',  title: 'Direct contact',             desc: 'Talk straight to the professional — no call centres, no waiting in queues.'                        },
  { icon: UserCheck,           color: 'bg-rose-50   text-rose-600',    title: 'Hire again easily',          desc: 'Save favourites. Re-book your go-to professionals in one tap any time you need them.'              },
];

export default function PersonalPage() {
  return (
    <main className="min-h-screen bg-transparent text-zinc-900">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 -z-10" />
        {/* decorative circle */}
        <div className="absolute -right-48 -top-24 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-100/60 to-blue-100/40 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.11 } } }}
            initial="hidden"
            animate="show"
            className="space-y-7"
          >
            {/* Eyebrow */}
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkle size={13} weight="fill" />
                For homeowners &amp; individuals
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1 custom={1} variants={fadeUp} className="font-black text-zinc-900 leading-tight">
              Hire a trusted professional<br />
              <span className="text-emerald-600">you can actually rely on.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p custom={2} variants={fadeUp} className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
              Stop asking around. Stop guessing. Workora shows you verified workers nearby,
              with real reviews and proof of their work — so you hire right the first time.
            </motion.p>

            {/* CTAs */}
            <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/search"
                id="personal-hero-primary"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-8 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-500/25"
              >
                Find a professional
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link
                href="/join"
                id="personal-hero-secondary"
                className="btn inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-200 text-zinc-800 rounded-2xl font-bold text-base"
              >
                Create free account
              </Link>
            </motion.div>

            <motion.p custom={4} variants={fadeUp} className="text-sm text-zinc-400">
              Free to browse. No sign-up needed to search.
            </motion.p>

            {/* Stats row */}
            <motion.div custom={5} variants={fadeUp} className="flex flex-wrap justify-center gap-8 pt-4">
              {[
                { value: '10,000+', label: 'Verified workers' },
                { value: '4.9★',   label: 'Average rating'   },
                { value: '2 hrs',  label: 'Avg. response'    },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-emerald-600">{s.value}</div>
                  <div className="text-xs text-zinc-400 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — 4 steps
      ══════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-zinc-900 mb-4">How it works</h2>
            <p className="text-zinc-500 text-lg">Four steps and you&apos;re done.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="card p-7 flex flex-col gap-4 hover:border-emerald-200 hover:bg-emerald-50/30"
              >
                <span className="text-6xl font-black text-zinc-100 select-none leading-none">
                  {step.number}
                </span>
                <step.icon size={28} weight="bold" className="text-emerald-600 -mt-2" />
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{step.title}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY WORKORA — 6 reason cards
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-zinc-900 mb-4">Why people love Workora</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              We built the platform that genuinely protects you as a hirer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.5 }}
                className="card flex gap-4 p-6 hover:border-emerald-100"
              >
                <div className={`flex-shrink-0 h-11 w-11 rounded-xl ${r.color} flex items-center justify-center`}>
                  <r.icon size={22} weight="bold" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 mb-1">{r.title}</div>
                  <div className="text-sm text-zinc-500 leading-relaxed">{r.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SPLIT — image + checklist
      ══════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/landing/verified badge.jpeg"
                alt="Verified professional badge"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Fully protected
              </span>
              <h2 className="text-zinc-900">Hire with confidence,<br />every single time</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Every professional is backed by our trust guarantee. If something goes
                wrong, our support team has your back.
              </p>
              <ul className="space-y-3">
                {[
                  'No upfront fees until the job is done',
                  'Secure messaging with document support',
                  'Project tracking from start to finish',
                  'Payment held safely until work is approved',
                  'Dispute resolution by our dedicated team',
                ].map(point => (
                  <li key={point} className="flex items-center gap-3">
                    <CheckCircle size={18} weight="fill" className="text-emerald-600 flex-shrink-0" />
                    <span className="text-zinc-700 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — green gradient
      ══════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-white">Ready to hire someone you can trust?</h2>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto">
              Thousands of homeowners across East Africa hire through Workora every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/search"
                id="personal-final-cta"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-8 bg-white text-emerald-700 rounded-2xl font-bold text-base hover:bg-emerald-50"
              >
                Find a professional now
                <ArrowRight weight="bold" size={18} />
              </Link>
            </div>
            <p className="text-emerald-200/70 text-sm">Free to use. No hidden charges.</p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
