'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  PencilSimple,
  SealCheck,
  SpinnerGap,
  VideoCamera,
  WarningCircle,
  Sparkle,
  Heart,
  Eye,
  ChatCircleDots,
  ShareNetwork,
  Star,
  ShieldCheck,
  Briefcase,
  CalendarBlank,
  Wallet,
  Lightning,
  ArrowUpRight,
  Users,
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser, getStoredToken } from '@/lib/session';
import { resolveMediaUrl } from '@/lib/media';

type ProfileData = {
  id?: string;
  full_name?: string | null;
  title?: string | null;
  trade?: string | null;
  bio?: string | null;
  location?: string | null;
  trust_score?: number | string | null;
  total_gigs?: number | null;
  is_verified?: boolean | null;
  pricing_from?: number | string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  availability_status?: string | null;
  created_at?: string | null;
  total_earnings?: number | null;
};

type PortfolioItem = {
  id: string;
  title?: string;
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  likes_count?: number;
  view_count?: number;
  comments_count?: number;
};

type SkillItem = { id: string; skill_name: string; skill_level?: string };

type ReviewItem = {
  id?: string;
  score?: number;
  comment?: string | null;
  reviewer_username?: string;
  created_at?: string;
};

type Tab = 'works' | 'about' | 'reviews';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DashboardProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [social, setSocial] = useState({ followers: 0, following: 0 });
  const [reliability, setReliability] = useState({ score: 0, ratingAverage: 0, worksCount: 0, engagement: 0 });
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [ratingBreakdown, setRatingBreakdown] = useState<{ score: number; count: number }[]>([]);
  const [tab, setTab] = useState<Tab>('works');
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      let user = await fetchCurrentUser();
      if (!user) {
        const legacy = typeof window !== 'undefined'
          ? (() => {
              try {
                const raw = window.localStorage.getItem('workora_user');
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (!parsed?.id) return null;
                return {
                  id: String(parsed.id),
                  username: String(parsed.username || ''),
                  role: String(parsed.role || 'worker'),
                };
              } catch {
                return null;
              }
            })()
          : null;
        if (legacy && getStoredToken()) {
          user = legacy;
        }
      }

      if (!active) return;

      if (!user?.id) {
        router.replace('/login');
        return;
      }

      setUsername(user.username);

      try {
        const res = await apiFetch('/api/profile/me');
        const data = await res.json();
        if (!res.ok) {
          if ((res.status === 401 || res.status === 403) && !getStoredToken()) {
            router.replace('/login');
            return;
          }
          if (res.status === 401 || res.status === 403) {
            setError('Session expired. Please log in again.');
            return;
          }
          throw new Error(data?.error || data?.message || 'Failed to load profile');
        }

        setProfile(data.profile || null);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setSocial({
          followers: Number(data.social?.followers || 0),
          following: Number(data.social?.following || 0),
        });
        setReliability({
          score: Number(data.reliability?.score || 0),
          ratingAverage: Number(data.reliability?.ratingAverage || 0),
          worksCount: Number(data.reliability?.worksCount || 0),
          engagement: Number(data.reliability?.engagement || 0),
        });
        setReviews(Array.isArray(data.ratings) ? data.ratings : []);
        setRatingBreakdown(Array.isArray(data.ratingBreakdown) ? data.ratingBreakdown : []);

        const items = Array.isArray(data.portfolio) ? data.portfolio : [];
        if (items.length > 0) {
          setPortfolio(items.filter((g: PortfolioItem) => Boolean(g.video_url || g.thumbnail_url)));
        } else if (data.profile?.id) {
          const gRes = await apiFetch(`/api/gigs/worker/${data.profile.id}`);
          const gData = await gRes.json();
          setPortfolio(Array.isArray(gData) ? gData.filter((g: PortfolioItem) => Boolean(g.video_url || g.thumbnail_url)) : []);
        }
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (active) setLoading(false);
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, [router]);

  const displayName = profile?.full_name || username || 'Professional';
  const initials = displayName
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarSrc = profile?.avatar_url ? resolveMediaUrl(profile.avatar_url) : '';
  const coverSrc = profile?.cover_url ? resolveMediaUrl(profile.cover_url) : '';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  const averageRating = useMemo(() => {
    if (ratingBreakdown.length === 0) return reliability.ratingAverage || 0;
    const total = ratingBreakdown.reduce((s, r) => s + r.count, 0);
    if (total === 0) return 0;
    return ratingBreakdown.reduce((s, r) => s + r.score * r.count, 0) / total;
  }, [ratingBreakdown, reliability.ratingAverage]);

  const statItems = [
    { label: 'Works', value: String(portfolio.length || profile?.total_gigs || 0) },
    { label: 'Followers', value: social.followers.toLocaleString() },
    { label: 'Following', value: social.following.toLocaleString() },
    { label: 'Trust', value: profile?.trust_score ? Number(profile.trust_score).toFixed(1) : '—' },
  ];

  const ratingBars = [5, 4, 3, 2, 1].map((score) => {
    const count = ratingBreakdown.find((r) => r.score === score)?.count || 0;
    const total = ratingBreakdown.reduce((s, r) => s + r.count, 0);
    return { score, count, pct: total > 0 ? (count / total) * 100 : 0 };
  });

  const [shareCopied, setShareCopied] = React.useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1600);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${displayName} on Workora — ${url}`)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 dark:bg-[#0A0E17]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <SpinnerGap size={40} className="text-[#0066FF]" weight="bold" />
        </motion.div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <WarningCircle size={48} className="text-rose-500" weight="duotone" />
        <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Could not load profile</h1>
        <p className="text-sm text-zinc-500">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-zinc-950 px-5 py-3 text-xs font-bold text-white dark:bg-white dark:text-zinc-950"
          >
            Retry
          </button>
          <Link href="/login" className="rounded-full border border-zinc-200 px-5 py-3 text-xs font-bold dark:border-zinc-700">
            Log in again
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'works', label: 'Works', count: portfolio.length },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews', count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 dark:bg-[#0A0E17]">
      {/* ═══ COVER + IDENTITY — LinkedIn-style banner, Instagram-grade polish ═══ */}
      <header className="relative">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden sm:h-48">
          {coverSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverSrc} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(0,102,255,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(112,0,255,0.45),transparent_55%),linear-gradient(135deg,#0B1120,#101A33)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          {/* subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        {/* Identity row */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between"
          >
            {/* Avatar + name */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
              <div className="relative w-fit">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-[#4D9FFF] to-[#7000FF] shadow-xl dark:border-[#0A0E17] sm:h-32 sm:w-32">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#4D9FFF] to-[#7000FF] text-4xl font-black text-white">
                      {initials}
                    </div>
                  )}
                </div>
                {profile?.availability_status === 'available' && (
                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0A0E17]" />
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                    {displayName}
                  </h1>
                  {profile?.is_verified ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#0066FF]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0066FF]">
                      <SealCheck size={12} weight="fill" /> Verified
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {profile?.title || profile?.trade || 'Workora professional'}
                  <span className="mx-2 text-zinc-300 dark:text-zinc-600">·</span>
                  <span className="text-zinc-500 dark:text-zinc-400">@{username}</span>
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><MapPin size={13} weight="fill" /> {profile?.location || 'Kenya'}</span>
                  <span className="flex items-center gap-1"><CalendarBlank size={13} weight="fill" /> Joined {memberSince}</span>
                  {Number(profile?.pricing_from) > 0 ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Wallet size={13} weight="fill" /> From KSh {Number(profile?.pricing_from).toLocaleString()} per job
                    </span>
                  ) : null}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <button
                onClick={handleShare}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ShareNetwork size={14} weight="bold" />
                {shareCopied ? 'Copied!' : 'Share'}
              </button>
              <Link
                href="/profile/edit"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-800 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <PencilSimple size={14} weight="bold" /> Edit profile
              </Link>
              <Link
                href="/dashboard/create"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0066FF] px-5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40"
              >
                <VideoCamera size={14} weight="bold" /> Upload work
              </Link>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"
          >
            {profile?.bio || 'Add a short bio so clients know what you do best.'}
          </motion.p>

          {/* Stats row — LinkedIn-style, clickable */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            className="mt-5 grid grid-cols-4 gap-2 sm:max-w-md"
          >
            {statItems.map((stat) => (
              <button
                key={stat.label}
                className="group flex flex-col items-center rounded-2xl border border-transparent px-2 py-2.5 text-center transition-all hover:border-zinc-200 hover:bg-white dark:hover:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <span className="text-lg font-black tracking-tight text-zinc-950 transition-colors group-hover:text-[#0066FF] dark:text-white sm:text-xl">
                  {stat.value}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            ref={tabRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="sticky top-0 z-30 -mx-4 mt-5 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-lg dark:border-zinc-800 dark:bg-[#0A0E17]/90 sm:-mx-6 sm:px-6"
          >
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 px-4 py-3.5 text-[13px] font-black transition-colors ${
                    tab === t.id
                      ? 'text-zinc-950 dark:text-white'
                      : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                  {typeof t.count === 'number' && t.count > 0 ? (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-black text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {t.count}
                    </span>
                  ) : null}
                  {tab === t.id && (
                    <motion.span
                      layoutId="profile-tab-underline"
                      className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-[#0066FF]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_300px]">
        <main>
          {/* ── WORKS TAB — Instagram grid ── */}
          {tab === 'works' && (
            <motion.section
              key="works"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
                  {portfolio.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4, ease: EASE }}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 dark:bg-zinc-900"
                    >
                      <Link href={`/dashboard/post/${item.id}`} className="absolute inset-0">
                        {item.video_url ? (
                          <video
                            src={resolveMediaUrl(item.video_url)}
                            poster={item.thumbnail_url ? resolveMediaUrl(item.thumbnail_url) : undefined}
                            preload="metadata"
                            muted
                            playsInline
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : item.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveMediaUrl(item.thumbnail_url)}
                            alt={item.title || 'Work'}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                        {/* Hover overlay — Instagram style */}
                        <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <span className="flex items-center gap-1.5 text-sm font-black text-white">
                            <Heart size={18} weight="fill" /> {Number(item.likes_count || 0)}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm font-black text-white">
                            <ChatCircleDots size={18} weight="fill" /> {Number(item.comments_count || 0)}
                          </span>
                        </div>
                        {item.video_url ? (
                          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                            <VideoCamera size={13} weight="fill" />
                          </span>
                        ) : null}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4D9FFF]/15 to-[#7000FF]/15">
                    <VideoCamera size={30} className="text-[#4D9FFF]" weight="duotone" />
                  </div>
                  <p className="mt-4 text-base font-black text-zinc-950 dark:text-white">No work on this profile yet</p>
                  <p className="mt-1 max-w-xs text-xs text-zinc-500">
                    Upload a short video of a finished job to attract clients.
                  </p>
                  <Link href="/dashboard/create" className="mt-5 rounded-full bg-[#0066FF] px-5 py-2.5 text-xs font-bold text-white">
                    Upload your first video
                  </Link>
                </div>
              )}
            </motion.section>
          )}

          {/* ── ABOUT TAB ── */}
          {tab === 'about' && (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="flex items-center gap-2 text-sm font-black text-zinc-950 dark:text-white">
                  <Lightning size={16} weight="fill" className="text-[#0066FF]" /> About
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {profile?.bio || 'No bio yet — tell clients what you do best.'}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="flex items-center gap-2 text-sm font-black text-zinc-950 dark:text-white">
                  <Briefcase size={16} weight="fill" className="text-emerald-500" /> Trade
                </h3>
                <p className="mt-3 text-sm font-bold text-zinc-700 dark:text-zinc-200">{profile?.trade || 'Not set'}</p>
                {profile?.title ? (
                  <p className="mt-1 text-sm text-zinc-500">{profile.title}</p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="flex items-center gap-2 text-sm font-black text-zinc-950 dark:text-white">
                  <Sparkle size={16} weight="fill" className="text-[#7000FF]" /> Skills
                </h3>
                {skills.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {skill.skill_name}
                        {skill.skill_level ? <span className="ml-1 text-zinc-400">· {skill.skill_level}</span> : null}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-zinc-400">No skills listed yet. Add them from your pro dashboard.</p>
                )}
              </div>
            </motion.section>
          )}

          {/* ── REVIEWS TAB ── */}
          {tab === 'reviews' && (
            <motion.section
              key="reviews"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-black tracking-tight text-zinc-950 dark:text-white">
                      {averageRating ? averageRating.toFixed(1) : '—'}
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={16}
                          weight={j < Math.round(averageRating) ? 'fill' : 'regular'}
                          className={j < Math.round(averageRating) ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] font-bold text-zinc-400">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingBars.map((bar) => (
                      <div key={bar.score} className="flex items-center gap-2.5">
                        <span className="w-3 text-xs font-black text-zinc-400">{bar.score}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.pct}%` }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                          />
                        </div>
                        <span className="w-6 text-right text-[11px] font-bold text-zinc-400">{bar.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4D9FFF] to-[#7000FF] text-[11px] font-black text-white">
                            {(review.reviewer_username || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div className="leading-tight">
                            <p className="text-xs font-black text-zinc-900 dark:text-white">{review.reviewer_username || 'Verified client'}</p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  size={10}
                                  weight={j < (review.score || 0) ? 'fill' : 'regular'}
                                  className={j < (review.score || 0) ? 'text-yellow-400' : 'text-zinc-200 dark:text-zinc-700'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.created_at ? (
                          <span className="text-[10px] font-bold text-zinc-400">
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ) : null}
                      </div>
                      {review.comment ? (
                        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{review.comment}</p>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <Star size={28} className="text-zinc-300" />
                  <p className="mt-3 text-sm font-black text-zinc-950 dark:text-white">No reviews yet</p>
                  <p className="mt-1 text-xs text-zinc-500">Reviews from verified clients appear here.</p>
                </div>
              )}
            </motion.section>
          )}
        </main>

        {/* ── RIGHT RAIL ── */}
        <aside className="space-y-4">
          {/* Reliability — the differentiator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-black text-zinc-950 dark:text-white">
                <ShieldCheck size={16} weight="fill" className="text-emerald-500" /> Reliability
              </h3>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                reliability.score >= 70
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'
                  : reliability.score >= 40
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {reliability.score >= 70 ? 'Strong' : reliability.score >= 40 ? 'Building' : 'New'}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" strokeWidth="7" className="stroke-zinc-100 dark:stroke-zinc-800" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    strokeWidth="7"
                    strokeLinecap="round"
                    stroke="url(#reliabilityGrad)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: reliability.score / 100 }}
                    transition={{ duration: 1.2, ease: EASE }}
                  />
                  <defs>
                    <linearGradient id="reliabilityGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-xl font-black text-zinc-950 dark:text-white">{reliability.score}</div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Rating</span>
                  <span className="text-xs font-black text-zinc-950 dark:text-white">
                    {reliability.ratingAverage ? reliability.ratingAverage.toFixed(1) : '—'} / 5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Works</span>
                  <span className="text-xs font-black text-zinc-950 dark:text-white">{reliability.worksCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Engagement</span>
                  <span className="text-xs font-black text-zinc-950 dark:text-white">{reliability.engagement.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[11px] leading-relaxed text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
              Reliability is computed from real reviews, completed work, and audience engagement.
            </p>
          </motion.div>

          {/* Trust score */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#0066FF]" weight="fill" />
              <h3 className="text-sm font-black text-zinc-950 dark:text-white">Trust score</h3>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
                {profile?.trust_score ? Number(profile.trust_score).toFixed(1) : '0.0'}
              </span>
              <span className="pb-1 text-xs font-bold text-zinc-400">/ 5.0</span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Number(profile?.trust_score || 0) * 20)}%` }}
                transition={{ duration: 0.8, ease: EASE }}
                className="h-full rounded-full bg-gradient-to-r from-[#4D9FFF] to-[#7000FF]"
              />
            </div>
          </div>

          {/* Earnings */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-emerald-500" weight="fill" />
              <h3 className="text-sm font-black text-zinc-950 dark:text-white">Total earnings</h3>
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
              KSh {Number(profile?.total_earnings || 0).toLocaleString()}
            </p>
            <Link href="/dashboard/analytics" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0066FF] hover:underline">
              View analytics <ArrowUpRight size={12} weight="bold" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
