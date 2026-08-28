'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  UsersThree,
  ClockCountdown,
  Coins,
  Plus,
  PaperPlaneTilt,
  SealCheck,
  Check,
  X,
  Suitcase,
  MapPin,
  CaretRight,
  SpinnerGap,
  BuildingOffice,
  ArrowRight
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';
import { openConversationWith } from '@/lib/conversations';

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
  applications_count?: number;
  pending_count?: number;
}

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  worker_id: string;
  worker_name: string;
  worker_trade?: string;
  worker_verified?: boolean;
  worker_trust?: number | string | null;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string;
}

type Tab = 'overview' | 'post' | 'jobs' | 'applications';

const CATEGORIES = [
  'Construction', 'Plumbing', 'Electrical', 'Carpentry', 'Painting',
  'Cleaning', 'Delivery', 'Catering', 'Tailoring', 'Mechanics',
  'Digital & Design', 'Other',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BusinessHubPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [username, setUsername] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [postError, setPostError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    budget_min: '',
    budget_max: '',
    location: '',
    description: '',
  });
  const [busyApp, setBusyApp] = useState<string | null>(null);
  const [busyJob, setBusyJob] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const res = await apiFetch('/api/jobs/mine');
      if (!res.ok) return;
      const data = await res.json();
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      setApplications(Array.isArray(data.applications) ? data.applications : []);
    } catch (e) {
      console.error('Business fetch failed', e);
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
      setUsername(user.username);
      fetchAll();
    };
    bootstrap();
    return () => { mounted = false; };
  }, [router]);

  const postJob = async () => {
    if (!form.title.trim() || posting) return;
    setPosting(true);
    setPostError('');
    try {
      const res = await apiFetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          category: form.category || null,
          budget_min: form.budget_min ? Number(form.budget_min) : null,
          budget_max: form.budget_max ? Number(form.budget_max) : null,
          location: form.location || null,
          description: form.description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string; message?: string };
        setPostError(data?.error || data?.message || 'Could not post the job. Please try again.');
        return;
      }
      setForm({ title: '', category: '', budget_min: '', budget_max: '', location: '', description: '' });
      setPosted(true);
      setTimeout(() => setPosted(false), 2200);
      await fetchAll();
      setTab('jobs');
    } catch (e) {
      console.error(e);
      setPostError('Network error — could not post the job. Check your connection and try again.');
    } finally {
      setPosting(false);
    }
  };

  const toggleJobStatus = async (job: Job) => {
    setBusyJob(job.id);
    try {
      await apiFetch(`/api/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: job.status === 'open' ? 'closed' : 'open' }),
      });
      await fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setBusyJob(null);
    }
  };

  const decideApplication = async (app: Application, status: 'accepted' | 'rejected') => {
    setBusyApp(app.id);
    try {
      await apiFetch(`/api/jobs/${app.job_id}/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setBusyApp(null);
    }
  };

  const openJob = (id: string) => router.push(`/dashboard/jobs/${id}`);

  const stats = useMemo(() => {
    const openJobs = jobs.filter((j) => j.status === 'open').length;
    const pending = applications.filter((a) => a.status === 'pending').length;
    const budgetCommitted = jobs.reduce((sum, j) => sum + (Number(j.budget_max) || 0), 0);
    return { totalJobs: jobs.length, openJobs, applications: applications.length, pending, budgetCommitted };
  }, [jobs, applications]);

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const formatBudget = (j: { budget_min?: number | null; budget_max?: number | null; currency?: string }) => {
    const cur = j.currency || 'KSh';
    if (j.budget_min && j.budget_max) return `${cur} ${j.budget_min.toLocaleString()} – ${j.budget_max.toLocaleString()}`;
    if (j.budget_max) return `${cur} ${j.budget_max.toLocaleString()}`;
    if (j.budget_min) return `${cur} ${j.budget_min.toLocaleString()}+`;
    return 'Budget on request';
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0A0D16]">
        <SpinnerGap size={36} className="text-[#4D9FFF] animate-spin" weight="bold" />
      </div>
    );
  }

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'post', label: 'Post a Job' },
    { key: 'jobs', label: 'My Jobs', badge: jobs.length },
    { key: 'applications', label: 'Applications', badge: stats.pending },
  ];

  return (
    <div className="min-h-full w-full bg-[#0A0D16] text-white">
      {/* ambient glows */}
      <div className="pointer-events-none fixed -top-32 left-1/4 h-[320px] w-[320px] rounded-full bg-[#0066FF]/15 blur-[110px]" />
      <div className="pointer-events-none fixed top-1/3 -right-24 h-[280px] w-[280px] rounded-full bg-[#0066FF]/10 blur-[100px]" />

      {/* Header */}
      <div className="relative border-b border-white/[0.06] px-4 lg:px-8 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0066FF] shadow-[0_8px_24px_rgba(0,102,255,0.35)]">
              <BuildingOffice size={22} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Business Hub</h1>
              <p className="text-xs font-medium text-white/40">Post jobs · review talent · hire with trust</p>
            </div>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-[13px] font-black transition-colors ${
                  tab === t.key ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t.label}
                {typeof t.badge === 'number' && t.badge > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${tab === t.key ? 'bg-[#0066FF] text-white' : 'bg-white/10 text-white/50'}`}>
                    {t.badge}
                  </span>
                )}
                {tab === t.key && (
                  <motion.span
                    layoutId="business-tab-underline"
                    className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-[#0066FF]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 pt-6 pb-24">

        {/* ═══ OVERVIEW ═══ */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Jobs posted', value: stats.totalJobs, icon: Briefcase, color: 'text-[#4D9FFF]', bg: 'from-[#0066FF]/20 to-transparent' },
                { label: 'Open now', value: stats.openJobs, icon: ClockCountdown, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-transparent' },
                { label: 'Applications', value: stats.applications, icon: UsersThree, color: 'text-violet-400', bg: 'from-[#0066FF]/20 to-transparent' },
                { label: 'Budget committed', value: stats.budgetCommitted ? `KSh ${stats.budgetCommitted.toLocaleString()}` : '—', icon: Coins, color: 'text-amber-400', bg: 'from-amber-500/15 to-transparent' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, ease: EASE }}
                  className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b ${s.bg} p-4`}
                >
                  <s.icon size={20} weight="fill" className={s.color} />
                  <p className="mt-3 text-xl font-black tracking-tight">{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {stats.totalJobs === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: EASE }}
                className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-10 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF]/20 to-[#0052CC]/20">
                  <Suitcase size={30} weight="duotone" className="text-[#4D9FFF]" />
                </div>
                <h2 className="text-lg font-black">Post your first job</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
                  Describe the work, set a budget, and let verified professionals apply. You review, accept, and hire — all on Workora.
                </p>
                <button
                  onClick={() => setTab('post')}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#0066FF] px-6 py-3 text-sm font-black text-white hover:brightness-110 transition-all"
                >
                  <Plus size={16} weight="bold" /> Post a job
                </button>
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black">Recent jobs</h3>
                  <button onClick={() => setTab('jobs')} className="flex items-center gap-1 text-xs font-bold text-[#4D9FFF] hover:text-white transition-colors">
                    View all <ArrowRight size={12} weight="bold" />
                  </button>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 4).map((job) => (
                    <button
                      key={job.id}
                      onClick={() => openJob(job.id)}
                      className="flex w-full items-center gap-4 rounded-2xl bg-white/[0.03] p-4 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black">{job.title}</p>
                        <p className="mt-0.5 text-xs text-white/40">{formatBudget(job)} · {timeAgo(job.created_at)}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                        job.status === 'open' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${job.status === 'open' ? 'bg-emerald-400' : 'bg-white/30'}`} />
                        {job.status}
                      </span>
                      <CaretRight size={14} className="text-white/25" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ POST A JOB ═══ */}
        {tab === 'post' && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE }}
            className="mx-auto max-w-2xl rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 lg:p-8"
          >
            <h2 className="text-lg font-black">Post a job</h2>
            <p className="mt-1 text-xs text-white/40">Details go straight to the talent feed — verified professionals apply instantly.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-white/50">Job title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Need a qualified plumber for bathroom renovation"
                  className="mt-1.5 h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-white/50">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1.5 h-12 w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none focus:border-[#4D9FFF]/60 transition-colors"
                  >
                    <option value="" className="bg-[#0D1120]">Any trade</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0D1120]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-white/50">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Nairobi, Westlands"
                    className="mt-1.5 h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-white/50">Budget min (KSh)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.budget_min}
                    onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                    placeholder="e.g. 5000"
                    className="mt-1.5 h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-white/50">Budget max (KSh)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.budget_max}
                    onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                    placeholder="e.g. 15000"
                    className="mt-1.5 h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-white/50">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Scope, timeline, requirements — anything that helps applicants know if they're a fit."
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
                />
              </div>

              <button
                onClick={postJob}
                disabled={!form.title.trim() || posting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-sm font-black text-white hover:brightness-110 transition-all disabled:opacity-40 disabled:hover:brightness-100"
              >
                {posting ? <SpinnerGap size={18} className="animate-spin" weight="bold" /> : <Plus size={18} weight="bold" />}
                {posting ? 'Posting…' : 'Post job'}
              </button>

              {postError ? (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">
                  <X size={16} weight="bold" /> {postError}
                </div>
              ) : null}

              <AnimatePresence>
                {posted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400"
                  >
                    <Check size={16} weight="bold" /> Job posted — it's now live in the talent feed!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ MY JOBS ═══ */}
        {tab === 'jobs' && (
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-10 text-center">
                <p className="text-sm font-bold text-white/40">No jobs posted yet.</p>
                <button onClick={() => setTab('post')} className="mt-4 text-sm font-black text-[#4D9FFF] hover:text-white transition-colors">
                  Post your first job →
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black">{job.title}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          job.status === 'open' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'
                        }`}>{job.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/40">
                        {job.category || 'Any trade'}
                        {job.location ? <span className="inline-flex items-center gap-0.5"><MapPin size={10} weight="fill" /> {job.location}</span> : null}
                        {' · '}{timeAgo(job.created_at)}
                      </p>
                      <p className="mt-2 text-sm font-bold text-[#4D9FFF]">{formatBudget(job)}</p>
                    </div>
                    <button
                      onClick={() => toggleJobStatus(job)}
                      disabled={busyJob === job.id}
                      className={`shrink-0 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all ${
                        job.status === 'open'
                          ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white'
                          : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                      }`}
                    >
                      {busyJob === job.id ? '…' : job.status === 'open' ? 'Close' : 'Reopen'}
                    </button>
                  </div>

                  {job.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-white/50">{job.description}</p>
                  )}

                  <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-3">
                    <button
                      onClick={() => { setTab('applications'); }}
                      className="flex items-center gap-1.5 text-xs font-black text-white/60 hover:text-white transition-colors"
                    >
                      <UsersThree size={15} weight="fill" className="text-violet-400" />
                      {job.applications_count || 0} applications
                    </button>
                    {Number(job.pending_count) > 0 && (
                      <span className="flex items-center gap-1 text-xs font-black text-amber-400">
                        <ClockCountdown size={14} weight="fill" /> {job.pending_count} pending
                      </span>
                    )}
                    <button onClick={() => openJob(job.id)} className="ml-auto flex items-center gap-1 text-xs font-bold text-[#4D9FFF] hover:text-white transition-colors">
                      View <ArrowRight size={11} weight="bold" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ═══ APPLICATIONS ═══ */}
        {tab === 'applications' && (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-10 text-center">
                <UsersThree size={40} weight="duotone" className="mx-auto mb-3 text-white/20" />
                <p className="text-sm font-bold text-white/40">No applications yet. Post a job to start receiving them.</p>
              </div>
            ) : (
              applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-sm font-black uppercase">
                      {app.worker_name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black">{app.worker_name}</p>
                        {app.worker_verified && <SealCheck size={14} weight="fill" className="text-[#0066FF]" />}
                        {typeof app.worker_trust === 'number' && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                            ★ {Number(app.worker_trust).toFixed(1)} trust
                          </span>
                        )}
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          app.status === 'pending' ? 'bg-amber-500/15 text-amber-400'
                          : app.status === 'accepted' ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                        }`}>{app.status}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-white/40">
                        {app.worker_trade || 'Professional'} · applied to <span className="font-bold text-white/60">{app.job_title}</span> · {timeAgo(app.created_at)}
                      </p>
                      {app.message && (
                        <p className="mt-2 rounded-xl bg-white/[0.03] p-3 text-sm text-white/60">“{app.message}”</p>
                      )}
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3">
                      <button
                        onClick={() => decideApplication(app, 'accepted')}
                        disabled={busyApp === app.id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 py-2.5 text-xs font-black text-white hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {busyApp === app.id ? '…' : <><Check size={14} weight="bold" /> Accept</>}
                      </button>
                      <button
                        onClick={() => decideApplication(app, 'rejected')}
                        disabled={busyApp === app.id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] py-2.5 text-xs font-black text-white/60 hover:bg-white/[0.1] hover:text-white transition-all disabled:opacity-50"
                      >
                        {busyApp === app.id ? '…' : <><X size={14} weight="bold" /> Decline</>}
                      </button>
                    </div>
                  )}

                  {app.status !== 'pending' && (
                    <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-xs font-black">
                      <PaperPlaneTilt size={14} className="text-[#4D9FFF]" />
                      <button
                        onClick={() => void openConversationWith(app.worker_id, router)}
                        className="text-[#4D9FFF] hover:text-white transition-colors"
                      >
                        Start a conversation
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
