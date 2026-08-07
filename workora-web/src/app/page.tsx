'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  Hammer, Car, DeviceMobile, TShirt, Broom, Scissors, Gear, Moped,
  ArrowRight, ShieldCheck, Star, CheckCircle, Users, Briefcase,
  Clock, VideoCamera
} from '@phosphor-icons/react';

/* ── Animation helpers ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger: Variants = { show: { transition: { staggerChildren: 0.12 } } };

const categories = [
  { name: 'Construction', sub: 'Masonry · Plumbing · Roofing',   icon: Hammer     },
  { name: 'Automotive',   sub: 'Mechanics · Bodywork · Tyres',   icon: Car        },
  { name: 'Tech Repair',  sub: 'Phones · Laptops · Appliances',  icon: DeviceMobile },
  { name: 'Fashion',      sub: 'Tailoring · Design · Alterations', icon: TShirt   },
  { name: 'Domestic',     sub: 'Cleaning · Cooking · Nanny',     icon: Broom      },
  { name: 'Beauty',       sub: 'Hair · Makeup · Nails',          icon: Scissors   },
  { name: 'Industrial',   sub: 'Welding · Fabrication',          icon: Gear       },
  { name: 'Logistics',    sub: 'Delivery · Moving · Courier',    icon: Moped      },
];

const trustPillars = [
  {
    icon: ShieldCheck,
    title: 'Every worker is verified',
    desc:  'Government ID, trade certificates, and work history checked before anyone can accept jobs.',
  },
  {
    icon: Star,
    title: 'Real reviews only',
    desc:  'Reviews come exclusively from verified clients who hired and paid through Workora.',
  },
  {
    icon: VideoCamera,
    title: 'See proof of work first',
    desc:  'Real photos and videos of completed projects — see the quality before you book.',
  },
];

export default function Home() {
  return (
    <main className="flex flex-col bg-transparent text-zinc-900 overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO — full-bleed image, dark overlay
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end sm:items-center pt-16">
        <Image
          src="/landing/workora hero.jpeg"
          alt="Skilled professionals on Workora"
          fill
          className="object-cover object-center"
          priority
        />
        {/* layered overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 sm:py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-2xl space-y-7"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase">
                <span className="dot-pulse text-green-400" />
                Trusted across East Africa
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={fadeUp} className="text-white font-black leading-[1.05]">
              Find a skilled professional<br />
              <span className="animated-text">you can actually trust.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeUp} className="text-white/75 text-lg sm:text-xl max-w-lg leading-relaxed">
              Workora connects you with verified, rated workers — plumbers, electricians,
              tailors, chefs, and more. Real reviews. Real proof of work.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/join"
                id="hero-cta-primary"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-8 bg-[#0066FF] text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-600/30"
              >
                Get started — it&apos;s free
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link
                href="/dashboard/search"
                id="hero-cta-secondary"
                className="btn inline-flex items-center justify-center h-14 px-8 glass text-white rounded-2xl font-bold text-base border-white/25"
              >
                Browse workers
              </Link>
            </motion.div>

            {/* Social proof strip */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Users,    label: '10,000+ verified workers'  },
                { icon: Briefcase,label: '50,000+ jobs completed'    },
                { icon: Clock,    label: 'Avg. 2-hour response time' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/65 text-sm font-medium">
                  <Icon size={15} className="text-blue-400" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST PILLARS — white bar
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-10">
          {trustPillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <p.icon size={22} weight="fill" className="text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 mb-1">{p.title}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="text-zinc-900 mb-4">What do you need done?</h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Browse professionals across every trade and service category.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <Link
                  href="/dashboard/search"
                  id={`category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="card flex flex-col gap-4 p-6 cursor-pointer group block hover:bg-blue-50/40"
                >
                  <cat.icon
                    size={28}
                    className="text-zinc-400 group-hover:text-blue-600 transition-colors duration-200"
                  />
                  <div>
                    <div className="font-bold text-zinc-900 text-base mb-1">{cat.name}</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">{cat.sub}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SPLIT — proof of work
      ══════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/landing/The Video Feedback.png"
                alt="Proof of work example"
                fill
                className="object-cover"
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 glass rounded-xl p-4 shadow-lg max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="dot-pulse text-green-500" />
                  <span className="text-xs font-bold text-zinc-800">Live & Verified</span>
                </div>
                <div className="font-black text-zinc-900 text-sm">Mastery score 5.0</div>
                <div className="flex gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={11} weight="fill" className="text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="space-y-6"
            >
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Proof of work
              </span>
              <h2 className="text-zinc-900">
                See the work before<br />you hire
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Every worker on Workora uploads real photos and videos of completed jobs.
                No guessing — see exactly what quality to expect before you commit.
              </p>
              <ul className="space-y-3">
                {[
                  'Real media from actual paid jobs',
                  'Authenticated by verified clients',
                  'Trust score built from real reviews',
                ].map(point => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-600">{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/platform"
                id="proof-cta"
                className="btn inline-flex items-center gap-2 h-12 px-6 bg-zinc-900 text-white rounded-xl font-bold text-sm"
              >
                See how it works
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — blue band
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#0066FF]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
            {[
              { value: '10K+', label: 'Verified Workers'    },
              { value: '50K+', label: 'Jobs Completed'      },
              { value: '4.9★', label: 'Average Rating'      },
              { value: '2hrs', label: 'Avg. Response Time'  },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SPLIT — wiring / craft image
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Quality guaranteed
              </span>
              <h2 className="text-zinc-900">
                Precision in<br />every connection
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                We vet professionals for technical excellence. From complex wiring to structural
                work — only the best make it onto the platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/personal"
                  id="personal-cta"
                  className="btn inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#0066FF] text-white rounded-xl font-bold text-sm"
                >
                  Hire for home <ArrowRight size={16} />
                </Link>
                <Link
                  href="/business"
                  id="business-cta"
                  className="btn inline-flex items-center justify-center gap-2 h-12 px-6 border-2 border-zinc-200 text-zinc-800 rounded-xl font-bold text-sm"
                >
                  Hire for business <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2"
            >
              <Image
                src="/landing/wiring-1.jpg"
                alt="Professional electrical work"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-zinc-50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="space-y-6"
          >
            <h2 className="text-zinc-900">
              Ready to find your<br />
              <span className="gradient-text">perfect professional?</span>
            </h2>
            <p className="text-zinc-500 text-xl max-w-xl mx-auto">
              Join thousands of people across East Africa already getting things done right with Workora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/join"
                id="final-cta-primary"
                className="btn inline-flex items-center justify-center gap-2 h-14 px-10 bg-[#0066FF] text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/20"
              >
                Create a free account
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link
                href="/login"
                id="final-cta-login"
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
