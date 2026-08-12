'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PaperPlaneTilt,
  MapPin,
  Coins,
  SpinnerGap,
  SealCheck,
  Check,
  X,
  ClockCountdown,
  ArrowRight,
  Suitcase
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';

interface Application {
  application_id: string;
  application_status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  applied_at: string;
  id: string;
  title: string;
  description?: string;
  category?: string;
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string;
  location?: string;
  status: 'open' | 'closed';
  hirer_id: string;
  hirer_name: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_STYLE: Record<string, { chip: string; icon: React.ElementType; label: string }> = {
  pending: { chip: 'bg-amber-500/15 text-amber-400', icon: ClockCountdown, label: 'Under review' },
  accepted: { chip: 'bg-emerald-500/15 text-emerald-400', icon: Check, label: 'Accepted' },
  rejected: { chip: 'bg-red-500/10 text-red-400', icon: X, label: 'Not selected' },
};

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      if (!user) {
        router.replace('/login');
        return;
      }
      try {
        const res = await apiFetch('/api/jobs/my-applications');
        const data = await res.json();
        if (Array.isArray(data)) setApplications(data);
      } catch (e) {
        console.error('Applications fetch failed', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    bootstrap();
    return () => { mounted = false; };
  }, [router]);

  const formatBudget = (a: Application) => {
    const cur = a.currency || 'KSh';
    if (a.budget_min && a.budget_max) return `${cur} ${a.budget_min.toLocaleString()} – ${a.budget_max.toLocaleString()}`;
    if (a.budget_max) return `${cur} ${a.budget_max.toLocaleString()}`;
    if (a.budget_min) return `${cur} ${a.budget_min.toLocaleString()}+`;
    return 'Budget on request';
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0A0D16]">
        <SpinnerGap size={34} className="text-[#4D9FFF] animate-spin" weight="bold" />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#0A0D16] text-white">
      <div className="pointer-events-none fixed -top-24 left-1/4 h-[280px] w-[280px] rounded-full bg-[#0066FF]/12 blur-[110px]" />

      <div className="relative border-b border-white/[0.06] px-4 lg:px-8 pt-6 pb-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#7000FF] shadow-[0_8px_24px_rgba(0,102,255,0.35)]">
              <PaperPlaneTilt size={20} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">My Applications</h1>
              <p className="text-xs font-medium text-white/40">Track every job you've applied to</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 pt-6 pb-24">
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-14 text-center">
            <Suitcase size={44} weight="duotone" className="mx-auto mb-4 text-white/20" />
            <h2 className="text-lg font-black">No applications yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
              Browse open jobs and apply — your applications and their status will show up here.
            </p>
            <button
              onClick={() => router.push('/dashboard/jobs')}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#7000FF] px-6 py-3 text-sm font-black text-white hover:brightness-110 transition-all"
            >
              Browse jobs <ArrowRight size={15} weight="bold" />
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((app, i) => {
              const meta = STATUS_STYLE[app.application_status] || STATUS_STYLE.pending;
              const StatusIcon = meta.icon;
              return (
                <motion.div
                  key={app.application_id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3), ease: EASE }}
                  className="flex flex-col rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 transition-colors hover:border-[#4D9FFF]/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {app.category && (
                          <span className="rounded-full bg-[#0066FF]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#4D9FFF]">
                            {app.category}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${meta.chip}`}>
                          <StatusIcon size={11} weight="bold" /> {meta.label}
                        </span>
                      </div>
                      <h2 className="mt-2.5 text-base font-black leading-snug">{app.title}</h2>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                        <span className="flex items-center gap-1"><SealCheck size={12} weight="fill" className="text-[#0066FF]" /> {app.hirer_name}</span>
                        {app.location && <span className="flex items-center gap-1"><MapPin size={11} weight="fill" /> {app.location}</span>}
                        <span>Applied {timeAgo(app.applied_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/[0.03] px-4 py-3">
                    <Coins size={16} weight="fill" className="text-amber-400" />
                    <span className="text-sm font-black text-amber-300">{formatBudget(app)}</span>
                  </div>

                  <div className="mt-4 flex gap-2 pt-1">
                    <button
                      onClick={() => router.push(`/dashboard/jobs/${app.id}`)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] py-3 text-xs font-black text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
                    >
                      View job <ArrowRight size={13} weight="bold" />
                    </button>
                    {app.application_status === 'accepted' && (
                      <button
                        onClick={() => router.push('/dashboard/messages')}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7000FF] py-3 text-xs font-black text-white hover:brightness-110 transition-all"
                      >
                        <PaperPlaneTilt size={14} weight="bold" /> Message hirer
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
