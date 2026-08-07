'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  PencilSimple,
  SealCheck,
  SpinnerGap,
  VideoCamera,
  WarningCircle,
  Briefcase,
  Sparkle,
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser, getStoredToken } from '@/lib/session';
import { VideoPlayer } from '@/components/VideoPlayer';

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
};

type PortfolioItem = {
  id: string;
  title?: string;
  video_url?: string;
  thumbnail_url?: string;
  likes_count?: number;
  view_count?: number;
};

type SkillItem = { id: string; skill_name: string };

export default function DashboardProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      // Prefer live /me, but don't bounce to login if we already have a local session + token
      let user = await fetchCurrentUser();
      if (!user) {
        const legacy = typeof window !== 'undefined' ? (
          // readLegacyUser may not be exported — fallback via localStorage
          (() => {
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
        ) : null;
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
          // Soft fail: keep page usable with username if profile endpoint flakes
          if (res.status === 401 || res.status === 403) {
            setError('Session expired. Please log in again.');
            return;
          }
          throw new Error(data?.error || data?.message || 'Failed to load profile');
        }

        setProfile(data.profile || null);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        const items = Array.isArray(data.portfolio) ? data.portfolio : [];
        if (items.length > 0) {
          setPortfolio(items.filter((g: PortfolioItem) => Boolean(g.video_url)));
        } else if (data.profile?.id) {
          const gRes = await apiFetch(`/api/gigs/worker/${data.profile.id}`);
          const gData = await gRes.json();
          setPortfolio(Array.isArray(gData) ? gData.filter((g: PortfolioItem) => Boolean(g.video_url)) : []);
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

  const stats = useMemo(
    () => [
      { label: 'Trust', value: profile?.trust_score ? Number(profile.trust_score).toFixed(1) : '—' },
      { label: 'Works', value: String(portfolio.length || profile?.total_gigs || 0) },
      { label: 'From', value: profile?.pricing_from ? `KSh ${Number(profile.pricing_from).toLocaleString()}` : 'Set price' },
    ],
    [portfolio.length, profile]
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
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

  const displayName = profile?.full_name || username || 'Professional';

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-24 dark:bg-zinc-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,102,255,0.45),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.25),_transparent_45%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 text-4xl font-black backdrop-blur-md">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{displayName}</h1>
                  {profile?.is_verified ? <SealCheck size={26} weight="fill" className="text-[#3B82F6]" /> : null}
                </div>
                <p className="mt-1 text-sm font-semibold text-white/70">
                  {profile?.title || profile?.trade || 'Workora professional'} · @{username}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-white/50">
                  <MapPin size={14} /> {profile?.location || 'Kenya'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/pro"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-zinc-950"
              >
                <PencilSimple size={14} weight="bold" /> Edit profile
              </Link>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur"
              >
                <VideoCamera size={14} weight="bold" /> Upload work
              </Link>
            </div>
          </motion.div>

          <p className="relative mt-6 max-w-2xl text-sm leading-relaxed text-white/75">
            {profile?.bio || 'Add a short bio so clients know what you do best.'}
          </p>

          <div className="relative mt-8 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
                <p className="mt-1 text-xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Proof of work</h2>
              <p className="text-xs font-semibold text-zinc-500">Videos that show what you deliver</p>
            </div>
            <Link href="/dashboard/works" className="text-xs font-bold text-[#0066FF]">
              Open works <ArrowRight size={12} className="inline" />
            </Link>
          </div>

          {portfolio.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {portfolio.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="aspect-[9/14] bg-zinc-950 sm:aspect-video">
                    {item.video_url ? (
                      <VideoPlayer
                        src={item.video_url}
                        poster={item.thumbnail_url}
                        className="h-full w-full"
                        autoPlay
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-500">No media</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                      {item.title || 'Untitled work'}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-zinc-400">
                      {Number(item.view_count || 0).toLocaleString()} views · {Number(item.likes_count || 0)} likes
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <VideoCamera size={40} className="text-zinc-300" />
              <p className="mt-3 text-base font-black text-zinc-950 dark:text-white">No work on this profile yet</p>
              <p className="mt-1 max-w-xs text-xs text-zinc-500">Upload a short video of a finished job to attract clients.</p>
              <Link href="/dashboard/create" className="mt-5 rounded-full bg-[#0066FF] px-5 py-2.5 text-xs font-bold text-white">
                Upload your first video
              </Link>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <Sparkle size={16} className="text-[#0066FF]" weight="fill" />
              <h3 className="text-sm font-black text-zinc-950 dark:text-white">Skills</h3>
            </div>
            {skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-400">No skills listed yet. Add them from your pro dashboard.</p>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-500" weight="fill" />
              <h3 className="text-sm font-black text-zinc-950 dark:text-white">Trade</h3>
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">{profile?.trade || 'Not set'}</p>
          </div>

          <Link
            href="/dashboard/feed"
            className="flex items-center justify-between rounded-3xl bg-zinc-950 px-5 py-4 text-white dark:bg-white dark:text-zinc-950"
          >
            <span className="text-xs font-black uppercase tracking-wider">Back to home feed</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
