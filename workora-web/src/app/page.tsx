'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import {
  Hammer, Car, DeviceMobile, TShirt, Broom, Scissors, Gear, Moped,
  ArrowRight, ShieldCheck, Star, CheckCircle, Users, Briefcase,
  Clock, VideoCamera, ChatCircleDots, Heart, MapPin, PlayCircle,
  TrendUp, SealCheck, Sparkle, TerminalWindow, Terminal, Cpu,
  HardDrive, Gauge, Database, Wrench, CaretRight
} from '@phosphor-icons/react';

/* ══════════════════════════════════════════════════════════
   ANIMATION HELPERS
══════════════════════════════════════════════════════════ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { show: { transition: { staggerChildren: 0.1 } } };
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Count-up number (runs when scrolled into view) ── */
function CountUp({ value, suffix = '', decimals = 0, duration = 1.6 }: { value: number; suffix?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setDisplay(value); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(eased * value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref}>
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ── Infinite marquee ── */
function Marquee({ children, speed = 28 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="relative flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center gap-12 pr-12"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const categories = [
  { name: 'Construction', sub: 'Masonry · Plumbing · Roofing', icon: Hammer },
  { name: 'Automotive', sub: 'Mechanics · Bodywork · Tyres', icon: Car },
  { name: 'Tech Repair', sub: 'Phones · Laptops · Appliances', icon: DeviceMobile },
  { name: 'Fashion', sub: 'Tailoring · Design · Alterations', icon: TShirt },
  { name: 'Domestic', sub: 'Cleaning · Cooking · Nanny', icon: Broom },
  { name: 'Beauty', sub: 'Hair · Makeup · Nails', icon: Scissors },
  { name: 'Industrial', sub: 'Welding · Fabrication', icon: Gear },
  { name: 'Logistics', sub: 'Delivery · Moving · Courier', icon: Moped },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Verified workers', icon: Users },
  { value: 50000, suffix: '+', label: 'Jobs completed', icon: Briefcase },
  { value: 4.9, suffix: '★', label: 'Average rating', icon: Star, decimals: 1 },
  { value: 2, suffix: 'h', label: 'Avg. response time', icon: Clock },
];

type Stat = { value: number; suffix: string; label: string; icon: React.ElementType; decimals?: number };

const steps = [
  {
    n: '01',
    title: 'Post or discover work',
    desc: 'Fundis post real videos of finished jobs. Clients browse a live feed of verified work near them.',
  },
  {
    n: '02',
    title: 'Verify the proof',
    desc: 'Watch the actual job, check ratings and trust scores, then chat directly with the professional.',
  },
  {
    n: '03',
    title: 'Hire with confidence',
    desc: 'Book, agree on the price, and get the job done — with a record of every completed project.',
  },
];

const testimonials = [
  { quote: 'Found a plumber in two minutes — watched his video, saw the quality, hired him same day.', name: 'Wanjiku M.', role: 'Homeowner, Nairobi', rating: 5 },
  { quote: 'My portfolio videos win me jobs I never had access to before. Clients trust the proof, not the talk.', name: 'Brian O.', role: 'Electrician, Nakuru', rating: 5 },
  { quote: 'The trust score changed everything. Serious clients find me now, and I get paid on time.', name: 'Fatuma A.', role: 'Tailor, Mombasa', rating: 5 },
  { quote: 'As a small business, I can finally find reliable vendors without word-of-mouth guesswork.', name: 'Daniel K.', role: 'Restaurant owner, Kisumu', rating: 5 },
];

const feedItems = [
  { video: '/videos/electrical2.mp4', name: 'Brian O.', trade: 'Electrician · Nakuru', likes: 248, loc: 'Nakuru' },
  { video: '/videos/plumbing1.mp4', name: 'Grace W.', trade: 'Plumber · Nairobi', likes: 186, loc: 'Kilimani' },
  { video: '/videos/construction3.mp4', name: 'Samuel T.', trade: 'Mason · Nairobi', likes: 312, loc: 'Westlands' },
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%']);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-8%']);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="flex flex-col bg-[#07090F] text-zinc-100 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO — cinematic parallax + live feed
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroImgY }} className="absolute inset-0 scale-110">
          <Image
            src="/landing/workora hero.jpeg"
            alt="Skilled professionals on Workora"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/95 via-[#07090F]/70 to-[#07090F]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-transparent to-[#07090F]/60" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-[#0066FF]/20 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-[420px] w-[420px] rounded-full bg-[#7000FF]/15 blur-[140px]" />

        <motion.div
          style={{ y: heroContentY, opacity: heroContentOpacity }}
          className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-28 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-36"
        >
          {/* ── Left: copy ── */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl space-y-7">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Trusted across East Africa
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
              Find a skilled
              <br />
              professional
              <br />
              <span className="bg-gradient-to-r from-[#4D9FFF] via-[#8B5CF6] to-[#4D9FFF] bg-[length:200%_auto] bg-clip-text text-transparent [animation:sweepGrad_6s_linear_infinite]">
                you can trust.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Workora is the proof-of-work passport for Africa&apos;s informal workforce —
              verified fundis, real video proof, and reviews that mean something.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link
                href="/join"
                id="hero-cta-primary"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#0066FF] px-8 text-base font-bold text-white shadow-[0_12px_40px_-8px_rgba(0,102,255,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-6px_rgba(0,102,255,0.85)]"
              >
                Get started — it&apos;s free
                <ArrowRight weight="bold" size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/search"
                id="hero-cta-secondary"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/[0.12]"
              >
                <PlayCircle size={20} weight="fill" className="text-emerald-400" />
                Browse workers
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {[
                { icon: ShieldCheck, text: 'ID-verified professionals' },
                { icon: Star, text: 'Real client reviews' },
                { icon: VideoCamera, text: 'Video proof of work' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[13px] font-medium text-white/60">
                  <Icon size={15} weight="fill" className="text-[#4D9FFF]" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: live feed phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 1, delay: 0.35, ease: EASE }}
            className="relative mx-auto hidden w-[300px] lg:block"
          >
            <div className="relative rounded-[2.6rem] border border-white/15 bg-[#0B0E17] p-2.5 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
              <div className="absolute left-1/2 top-4 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90" />
              <div className="relative h-[560px] overflow-hidden rounded-[2rem] bg-[#0B0E17]">
                {/* Mockup feed */}
                <div className="flex h-full flex-col gap-3 overflow-hidden p-3 pt-12">
                  {feedItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.4, duration: 0.7, ease: EASE }}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80"
                    >
                      <div className="flex items-center gap-2.5 px-3 py-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4D9FFF] to-[#7000FF] text-[11px] font-black text-white">
                          {item.name.charAt(0)}
                        </div>
                        <div className="flex-1 leading-tight">
                          <p className="text-[11px] font-bold text-white">{item.name}</p>
                          <p className="text-[9px] text-white/45">{item.trade}</p>
                        </div>
                        <SealCheck size={14} weight="fill" className="text-[#4D9FFF]" />
                      </div>
                      <div className="relative aspect-[4/3] bg-black">
                        <video
                          src={item.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[10px] font-bold text-white">
                          <MapPin size={10} weight="fill" className="text-emerald-400" /> {item.loc}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-white">
                          <Heart size={12} weight="fill" className="text-rose-500" /> {item.likes}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-white/70">
                          <ChatCircleDots size={12} weight="fill" /> 42
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Verified
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge — verified */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -left-16 top-24 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-xl"
            >
              <Image src="/landing/verified badge.jpeg" alt="Verified" width={34} height={34} className="h-9 w-9 rounded-full object-cover" />
              <div className="leading-tight">
                <p className="text-[11px] font-black text-white">Identity verified</p>
                <p className="text-[9px] text-white/50">Gov. ID + trade check</p>
              </div>
            </motion.div>

            {/* Floating badge — trust score */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.8 }}
              className="absolute -right-14 bottom-28 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                <TrendUp size={18} weight="fill" className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black text-white">Trust score 4.9</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={9} weight="fill" className="text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/40"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
            <motion.div
              animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="h-2 w-1 rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          TRADE MARQUEE
      ══════════════════════════════════════════ */}
      <section className="relative border-y border-white/10 bg-[#0A0D16] py-6">
        <Marquee speed={30}>
          {[...categories, ...categories].map((cat, i) => (
            <Link
              key={i}
              href="/dashboard/search"
              className="flex items-center gap-2.5 whitespace-nowrap text-sm font-bold text-white/60 transition-colors hover:text-white"
            >
              <cat.icon size={16} weight="fill" className="text-[#4D9FFF]" />
              {cat.name}
              <span className="ml-4 text-white/15">✦</span>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* ══════════════════════════════════════════
          PROOF OF WORK — signature section
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#7000FF]/10 blur-[130px]" />
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="order-2 space-y-7 lg:order-1"
          >
            <motion.span variants={fadeUp} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4D9FFF]/30 bg-[#4D9FFF]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#4D9FFF]">
              <Sparkle size={13} weight="fill" /> Proof of work
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              See the work before you hire.
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-md text-base leading-relaxed text-white/60">
              Every fundi on Workora uploads real video of completed jobs. No guesswork, no
              &quot;trust me&quot; — watch the exact quality you&apos;ll get before you book.
            </motion.p>
            <motion.ul variants={fadeUp} className="space-y-3.5">
              {[
                'Real media from actual paid jobs',
                'Authenticated by verified clients',
                'Trust score built from real reviews',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-white/75">
                  <CheckCircle size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-emerald-400" />
                  <span className="text-sm font-medium">{point}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/dashboard/search"
                id="proof-cta"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#07090F] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(255,255,255,0.4)]"
              >
                See live work
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/platform"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 text-sm font-bold text-white/85 transition-all hover:border-white/35 hover:bg-white/[0.1]"
              >
                How it works
              </Link>
            </motion.div>
          </motion.div>

          {/* Proof collage */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="relative order-1 lg:order-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
                className="relative aspect-[3/4] overflow-hidden rounded-3xl"
              >
                <Image src="/landing/workora 1.png" alt="Finished construction work" fill sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs font-black text-white">Before → After</p>
                  <p className="text-[10px] text-white/60">Verified job #4821</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
                className="relative mt-8 aspect-[3/4] overflow-hidden rounded-3xl"
              >
                <Image src="/landing/wiring-1.jpg" alt="Professional electrical work" fill sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="flex items-center gap-1.5 text-xs font-black text-white">
                    <SealCheck size={14} weight="fill" className="text-[#4D9FFF]" /> Client sign-off
                  </p>
                  <p className="text-[10px] text-white/60">Certificate on file</p>
                </div>
              </motion.div>
            </div>

            {/* Floating rating card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/15 bg-[#0E1220]/90 px-5 py-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="text-3xl font-black text-white">4.9</div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} weight="fill" className="text-yellow-400" />
                  ))}
                </div>
                <p className="mt-0.5 text-[10px] font-bold text-white/50">12,400 verified reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="relative border-y border-white/10 bg-[#0A0D16] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-xl text-center"
          >
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">How Workora works</h2>
            <p className="mt-3 text-white/55">From discovery to done — in three honest steps.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: EASE }}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#4D9FFF]/40 hover:bg-white/[0.06]"
              >
                <div className="text-5xl font-black text-white/10 transition-colors group-hover:text-[#4D9FFF]/25">{step.n}</div>
                <h3 className="mt-6 text-lg font-black text-white">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">{step.desc}</p>
                <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4D9FFF]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS — Linux terminal
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24">
        {/* subtle scanline backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)' }} />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#0066FF]/20 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6">
          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/12 bg-[#0B0E14] shadow-2xl shadow-black/50"
          >
            {/* Title bar */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-[#11151D] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="ml-2 flex items-center gap-2 text-[11px] font-bold tracking-wider text-white/45">
                <TerminalWindow size={14} className="text-[#4D9FFF]" />
                <span className="font-[family-name:var(--font-ubuntu-mono)]">workora@platform: ~/network</span>
              </div>
              <div className="ml-auto hidden items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 sm:flex">
                <span className="dot-pulse text-[#27C93F]" />
                <span className="font-[family-name:var(--font-ubuntu-mono)] text-[10px] font-bold uppercase tracking-[0.18em] text-[#27C93F]">online</span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-2 font-[family-name:var(--font-ubuntu-mono)] text-sm">
                  <span className="text-[#27C93F] font-bold">workora@platform</span>
                  <span className="text-white/40">:</span>
                  <span className="text-[#4D9FFF] font-bold">~/network</span>
                  <span className="text-white/40">$</span>
                  <span className="text-white/80">./verify --all</span>
                </div>

                {stats.map((stat: Stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: EASE }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition-colors duration-300 hover:border-[#4D9FFF]/40"
                  >
                    <stat.icon size={17} weight="bold" className="shrink-0 text-[#4D9FFF]" />
                    <span className="min-w-[10ch] font-[family-name:var(--font-ubuntu-mono)] text-[11px] uppercase tracking-[0.14em] text-white/50">
                      {stat.label}
                    </span>
                    <span className="ml-auto flex items-baseline gap-0.5 font-[family-name:var(--font-ubuntu-mono)] text-xl font-bold text-[#27C93F]">
                      <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                    </span>
                    <span className="hidden text-white/25 sm:block">ok</span>
                  </motion.div>
                ))}
              </div>

              {/* Right: system readout */}
              <div className="flex flex-col justify-between gap-6 rounded-xl border border-white/[0.07] bg-white/[0.03] p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    <Cpu size={14} className="text-[#27C93F]" />
                    system status
                  </div>
                  {[
                    { icon: HardDrive, label: 'Proof records', value: 'verified' },
                    { icon: Database, label: 'Trust ledger', value: 'synced' },
                    { icon: Gauge, label: 'Response time', value: '2h avg' },
                    { icon: Wrench, label: 'Active trades', value: '8 nodes' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2.5 font-[family-name:var(--font-ubuntu-mono)] text-xs">
                      <row.icon size={14} className="shrink-0 text-white/35" />
                      <span className="text-white/55">{row.label}</span>
                      <span className="ml-auto flex items-center gap-1.5 text-[#27C93F]">
                        <CaretRight size={11} weight="bold" />
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* blinking cursor line */}
                <div className="flex items-center gap-2 font-[family-name:var(--font-ubuntu-mono)] text-xs">
                  <span className="text-[#27C93F] font-bold">workora@platform</span>
                  <span className="text-white/40">:</span>
                  <span className="text-[#4D9FFF] font-bold">~</span>
                  <span className="text-white/40">$</span>
                  <span className="h-4 w-2 animate-pulse bg-[#27C93F]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS — marquee
      ══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto mb-14 max-w-xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Loved on both sides of the job</h2>
            <p className="mt-3 text-white/55">Workers and clients, from Nairobi to Mombasa.</p>
          </motion.div>
        </div>

        <Marquee speed={40}>
          {testimonials.map((t, i) => (
            <div key={i} className="w-[340px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} weight="fill" className="text-yellow-400" />
                ))}
              </div>
              <p className="mt-3.5 text-sm leading-relaxed text-white/75">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#4D9FFF] to-[#7000FF] text-xs font-black text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-[11px] text-white/45">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/15 blur-[160px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="space-y-7"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#4D9FFF]/30 bg-[#4D9FFF]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#4D9FFF]"
            >
              <Sparkle size={13} weight="fill" /> Free to join
            </motion.span>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              Ready to find your
              <br />
              <span className="bg-gradient-to-r from-[#4D9FFF] via-[#8B5CF6] to-[#4D9FFF] bg-[length:200%_auto] bg-clip-text text-transparent [animation:sweepGrad_6s_linear_infinite]">
                perfect professional?
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-white/60">
              Join thousands across East Africa already getting things done right — with proof.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/join"
                id="final-cta-primary"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#0066FF] px-10 text-base font-bold text-white shadow-[0_12px_40px_-8px_rgba(0,102,255,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-6px_rgba(0,102,255,0.85)]"
              >
                Create a free account
                <ArrowRight weight="bold" size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                id="final-cta-login"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-white/20 px-10 text-base font-bold text-white transition-all hover:border-white/45 hover:bg-white/[0.06]"
              >
                Log in
              </Link>
            </div>
            <p className="text-sm text-white/40">No credit card required. Built for East Africa&apos;s workforce.</p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
