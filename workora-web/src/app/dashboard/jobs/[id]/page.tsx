'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Coins,
  PaperPlaneTilt,
  Check,
  UsersThree,
  SpinnerGap,
  SealCheck,
  Briefcase,
  WarningCircle
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';

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
  is_owner?: boolean;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = String(params?.id || '');
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

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
        const res = await apiFetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          setError('Job not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setJob(data);
      } catch {
        setError('Could not load this job');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    bootstrap();
    return () => { mounted = false; };
  }, [jobId, router]);

  const submitApplication = async () => {
    if (!job || submitting) return;
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        setJustApplied(true);
        setApplying(false);
        setJob({ ...job, applied_by_me: true });
      }
    } catch (e) {
      console.error('Apply failed', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0A0D16]">
        <SpinnerGap size={34} className="text-[#4D9FFF] animate-spin" weight="bold" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0A0D16] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.07] bg-white/[0.03] p-8 text-center">
          <WarningCircle size={36} className="mx-auto mb-4 text-white/25" weight="duotone" />
          <h1 className="text-lg font-black text-white">Job not found</h1>
          <button
            onClick={() => router.push('/dashboard/jobs')}
            className="mt-5 w-full rounded-xl bg-[#0066FF] py-3 text-sm font-black text-white"
          >
            Browse jobs
          </button>
        </div>
      </div>
    );
  }

  const formatBudget = () => {
    const cur = job.currency || 'KSh';
    if (job.budget_min && job.budget_max) return `${cur} ${job.budget_min.toLocaleString()} – ${job.budget_max.toLocaleString()}`;
    if (job.budget_max) return `${cur} ${job.budget_max.toLocaleString()}`;
    if (job.budget_min) return `${cur} ${job.budget_min.toLocaleString()}+`;
    return 'Budget on request';
  };

  const canApply = job.status === 'open' && !job.is_owner && !job.applied_by_me && !justApplied;

  return (
    <div className="min-h-full w-full bg-[#0A0D16] text-white">
      <div className="pointer-events-none fixed -top-24 right-1/4 h-[280px] w-[280px] rounded-full bg-[#0066FF]/12 blur-[110px]" />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0D16]/95 backdrop-blur-xl px-4 py-3">
        <button onClick={() => router.back()} aria-label="Back" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={20} weight="bold" />
          <span className="text-sm font-black">Back to jobs</span>
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-4 lg:px-8 pt-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 lg:p-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            {job.category && (
              <span className="rounded-full bg-[#0066FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#4D9FFF]">
                {job.category}
              </span>
            )}
            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              job.status === 'open' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/40'
            }`}>
              {job.status}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-[10px] font-bold text-white/50">
              <UsersThree size={11} weight="fill" /> {job.applications_count || 0} applications
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight">{job.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <SealCheck size={14} weight="fill" className="text-[#0066FF]" />
              <span className="font-bold text-white/70">{job.hirer_name}</span>
              <span className="text-white/30">posted</span>
            </span>
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} weight="fill" /> {job.location}
              </span>
            )}
            <span>{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-amber-500/[0.08] px-5 py-4">
            <Coins size={22} weight="fill" className="text-amber-400" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Budget</p>
              <p className="text-lg font-black text-amber-300">{formatBudget()}</p>
            </div>
          </div>

          {job.description && (
            <div className="mt-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-white/40">About the job</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-white/70">{job.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 border-t border-white/[0.06] pt-6">
            {job.is_owner ? (
              <button
                onClick={() => router.push('/dashboard/business')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0066FF] py-4 text-sm font-black text-white hover:brightness-110 transition-all"
              >
                <Briefcase size={16} weight="bold" /> Manage in Business Hub
              </button>
            ) : job.applied_by_me || justApplied ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 py-4 text-sm font-black text-emerald-400">
                <Check size={16} weight="bold" /> You've applied — the hirer can now review your application
              </div>
            ) : canApply ? (
              <button
                onClick={() => setApplying(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0066FF] py-4 text-sm font-black text-white hover:brightness-110 transition-all"
              >
                <PaperPlaneTilt size={16} weight="bold" /> Apply for this job
              </button>
            ) : (
              <div className="flex w-full items-center justify-center rounded-2xl bg-white/[0.05] py-4 text-sm font-black text-white/40">
                This job is no longer accepting applications
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Apply modal */}
      {applying && (
        <>
          <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm" onClick={() => setApplying(false)} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-[410] rounded-t-3xl border-t border-white/10 bg-[#0D1120] p-6 pb-10 safe-area-bottom"
            role="dialog"
            aria-label="Apply"
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/15" />
            <p className="text-sm font-black">Apply — {job.title}</p>
            <p className="mt-1 text-xs text-white/40">{job.hirer_name} will review your application directly.</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Your trade, experience, availability… (optional)"
              className="mt-4 w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-[#4D9FFF]/60 transition-colors"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setApplying(false)}
                className="flex-1 rounded-2xl bg-white/[0.06] py-3.5 text-sm font-black text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0066FF] py-3.5 text-sm font-black text-white hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submitting ? <SpinnerGap size={16} className="animate-spin" weight="bold" /> : <PaperPlaneTilt size={16} weight="bold" />}
                {submitting ? 'Applying…' : 'Submit application'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
