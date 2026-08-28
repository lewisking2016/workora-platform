'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Suitcase,
  MapPin,
  Coins,
  PaperPlaneTilt,
  Check,
  UsersThree,
  SpinnerGap,
  SealCheck,
  Briefcase,
  ArrowRight,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';
import { useToast } from '@/components/Toast';

interface Job {
  id: string;
  title: string;
  description?: string;
  category?: string;
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string;
  location?: string;
  status: 'open' | 'closed';
  created_at: string;
  hirer_id: string;
  hirer_name: string;
  applications_count?: number;
  applied_by_me?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BrowseJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [applying, setApplying] = useState<Job | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justApplied, setJustApplied] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const res = await apiFetch('/api/jobs');
      if (!res.ok) {
        setJobs([]);
        return;
      }
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Jobs fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      if (!user) {
        router.replace('/login');
        return;
      }
      fetchJobs();
    };
    bootstrap();
    return () => { mounted = false; };
  }, [router]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(jobs.map((j) => j.category).filter(Boolean) as string[]))].slice(0, 8),
    [jobs]
  );

  const filtered = useMemo(
    () => (category === 'All' ? jobs : jobs.filter((j) => j.category === category)),
    [jobs, category]
  );

  const submitApplication = async () => {
    if (!applying || submitting) return;
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/jobs/${applying.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: applyMessage }),
      });
      if (res.ok) {
        setJustApplied(applying.id);
        setTimeout(() => setJustApplied(null), 2500);
        setApplying(null);
        setApplyMessage('');
        fetchJobs();
        toast('Application submitted');
      } else {
        toast('Could not submit application', 'error');
      }
    } catch (e) {
      console.error('Apply failed', e);
      toast('Network error — try again', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const formatBudget = (j: Job) => {
    const cur = j.currency || 'KSh';
    if (j.budget_min && j.budget_max) return `${cur} ${j.budget_min.toLocaleString()} – ${j.budget_max.toLocaleString()}`;
    if (j.budget_max) return `${cur} ${j.budget_max.toLocaleString()}`;
    if (j.budget_min) return `${cur} ${j.budget_min.toLocaleString()}+`;
    return 'Budget on request';
  };

  return (
    <div className="min-h-full w-full bg-[#0A0D16] text-white">
      <div className="pointer-events-none fixed -top-24 right-1/4 h-[300px] w-[300px] rounded-full bg-[#0066FF]/12 blur-[110px]" />

      {/* Header */}
      <div className="relative border-b border-white/[0.06] px-4 lg:px-8 pt-6 pb-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Browse Jobs</h1>
              <p className="mt-1 text-sm text-white/40">Open work posted by verified businesses across the platform</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/business')}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#7000FF] px-5 py-3 text-xs font-black text-white hover:brightness-110 transition-all"
            >
              <Briefcase size={16} weight="bold" /> Post a job
            </button>
          </div>

          {/* Category filter */}
          <div className="mt-5 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all ${
                  category === c
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white shadow-[0_4px_16px_rgba(0,102,255,0.35)]'
                    : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 pt-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <SpinnerGap size={32} className="text-[#4D9FFF] animate-spin" weight="bold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-14 text-center">
            <Suitcase size={44} weight="duotone" className="mx-auto mb-4 text-white/20" />
            <h2 className="text-lg font-black">No open jobs{category !== 'All' ? ` in ${category}` : ''} right now</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">New jobs appear here as businesses post them. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), ease: EASE }}
                className="flex flex-col rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 transition-colors hover:border-[#4D9FFF]/30 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {job.category && (
                        <span className="rounded-full bg-[#0066FF]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#4D9FFF]">
                          {job.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] font-bold text-white/30">
                        <UsersThree size={11} weight="fill" /> {job.applications_count || 0} applied
                      </span>
                    </div>
                    <h2 className="mt-2.5 text-base font-black leading-snug">{job.title}</h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                      <span className="flex items-center gap-1"><SealCheck size={12} weight="fill" className="text-[#0066FF]" /> {job.hirer_name}</span>
                      {job.location && <span className="flex items-center gap-1"><MapPin size={11} weight="fill" /> {job.location}</span>}
                      <span>{timeAgo(job.created_at)}</span>
                    </p>
                  </div>
                </div>

                {job.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">{job.description}</p>
                )}

                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/[0.03] px-4 py-3">
                  <Coins size={16} weight="fill" className="text-amber-400" />
                  <span className="text-sm font-black text-amber-300">{formatBudget(job)}</span>
                </div>

                <div className="mt-4 flex gap-2 pt-1">
                  <button
                    onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] py-3 text-xs font-black text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
                  >
                    Details <ArrowRight size={13} weight="bold" />
                  </button>
                  {job.applied_by_me || justApplied === job.id ? (
                    <button
                      disabled
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 py-3 text-xs font-black text-emerald-400"
                    >
                      <Check size={14} weight="bold" /> Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => setApplying(job)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#7000FF] py-3 text-xs font-black text-white hover:brightness-110 transition-all"
                    >
                      <PaperPlaneTilt size={14} weight="bold" /> Apply
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Apply modal ─── */}
      <AnimatePresence>
        {applying && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplying(null)}
              className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[410] rounded-t-3xl border-t border-white/10 bg-[#0D1120] p-6 pb-10 safe-area-bottom"
              role="dialog"
              aria-label="Apply to job"
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/15" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#7000FF]">
                  <Suitcase size={20} weight="bold" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{applying.title}</p>
                  <p className="text-xs text-white/40">{applying.hirer_name} · {applying.location || 'Remote'}</p>
                </div>
              </div>

              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                rows={3}
                placeholder="Introduce yourself — your trade, experience, and availability (optional)"
                className="mt-4 w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setApplying(null)}
                  className="flex-1 rounded-2xl bg-white/[0.06] py-3.5 text-sm font-black text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitApplication}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#7000FF] py-3.5 text-sm font-black text-white hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {submitting ? <SpinnerGap size={16} className="animate-spin" weight="bold" /> : <PaperPlaneTilt size={16} weight="bold" />}
                  {submitting ? 'Applying…' : 'Apply now'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
