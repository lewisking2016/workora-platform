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
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';
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
      const user = await fetchCurrentUser();
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
          if (res.status === 401 || res.status === 403) {
            router.replace('/login');
            return;
          }
          throw new Error(data?.error || data?.message || 'Failed to load profile');
        }

        setProfile(data.profile || null);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        const items = Array.isArray(data.portfolio) ? data.portfolio : [];
        if (items.length > 0) {
          setPortfolio(items);
        } else if (data.profile?.id) {
          const gRes = await apiFetch(`/api/gigs/worker/${data.profile.id}`);
          const gData = await gRes.json();
          setPortfolio(Array.isArray(gData) ? gData : []);
        }
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
      { label: 'Works', value: String(profile?.total_gigs ?? portfolio.length ?? 0) },
      { label: 'From', value: profile?.pricing_from ? `KSh ${Number(profile.pricing_from).toLocaleString()}` : '—' },
    ],
    [portfolio.length, profile]
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <SpinnerGap size={40} className="text-[#0066FF]" weight="bold" />
        </motion.div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <WarningCircle size={48} className="text-rose-500" weight="duotone" />
        <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Could not load profile</h1>
        <p className="text-sm text-zinc-500">{error || 'Try again in a moment.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-zinc-950 px-5 py-3 text-xs font-bold text-white dark:bg-white dark:text-zinc-950"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 lg:px-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="relative h-40 bg-[radial-gradient(circle_at_20%_20%,rgba(0,102,255,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.25),transparent_40%),linear-gradient(135deg,#0b1220,#111827)]">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="relative px-6 pb-8 pt-0 sm:px-8">
          <div className="-mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-zinc-900 text-3xl font-black text-white dark:border-zinc-950">
                {(profile.full_name || username || 'W').slice(0, 1).toUpperCase()}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                    {profile.full_name || username}
                  </h1>
                  {profile.is_verified ? <SealCheck size={22} weight="fill" className="text-[#0066FF]" /> : null}
                </div>
                <p className="text-sm font-semibold text-zinc-500">
                  {profile.title || profile.trade || 'Workora professional'} · @{username}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-zinc-400">
                  <MapPin size={14} /> {profile.location || 'Kenya'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white dark:bg-white dark:text-zinc-950"
              >
                <PencilSimple size={14} weight="bold" /> Edit profile
              </Link>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-950 dark:border-zinc-700 dark:text-white"
              >
                <VideoCamera size={14} weight="bold" /> Upload work
              </Link>
            </div>
          </div>

          {profile.bio ? (
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{profile.bio}</p>
          ) : (
            <p className="mt-6 text-sm text-zinc-400">Add a short bio so clients know what you do best.</p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{stat.label}</p>
                <p className="mt-1 text-lg font-black text-zinc-950 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">Proof of work</h2>
            <Link href="/dashboard/works" className="text-xs font-bold text-[#0066FF]">
              Open works <ArrowRight size={12} className="inline" />
            </Link>
          </div>

          {portfolio.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {portfolio.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800"
                >
                  <div className="aspect-[9/14] sm:aspect-video">
                    {item.video_url ? (
                      <VideoPlayer src={item.video_url} poster={item.thumbnail_url} className="h-full w-full" autoPlay />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-500">No media</div>
                    )}
                  </div>
                  <div className="bg-white p-4 dark:bg-zinc-950">
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 py-16 text-center dark:border-zinc-800">
              <VideoCamera size={36} className="text-zinc-300" />
              <p className="mt-3 text-sm font-bold text-zinc-950 dark:text-white">No work on this profile yet</p>
              <Link href="/dashboard/create" className="mt-4 rounded-full bg-[#0066FF] px-4 py-2 text-xs font-bold text-white">
                Upload your first video
              </Link>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-black text-zinc-950 dark:text-white">Skills</h3>
            {skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-400">No skills listed yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-black text-zinc-950 dark:text-white">Trade</h3>
            <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">{profile.trade || 'Not set'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
