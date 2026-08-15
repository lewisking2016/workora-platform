'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FloppyDisk,
  SpinnerGap,
  WarningCircle,
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser, authedUpload } from '@/lib/session';

type ProfileBundle = {
  user?: { id?: string; username?: string } | null;
  profile?: {
    id?: string;
    display_name?: string | null;
    full_name?: string | null;
    title?: string | null;
    trade?: string | null;
    bio?: string | null;
    location?: string | null;
    availability_status?: string | null;
    service_areas?: string | null;
    pricing_from?: number | string | null;
    cover_url?: string | null;
    avatar_url?: string | null;
    identity_status?: string | null;
    identity_document_url?: string | null;
  } | null;
  skills?: Array<{ id?: string; skill_name?: string; skill_level?: string }>;
  languages?: Array<{ id?: string; language?: string; proficiency?: string }>;
  experience?: Array<{ id?: string; company?: string; role_title?: string }>;
  education?: Array<{ id?: string; institution?: string; degree?: string }>;
  certifications?: Array<{ id?: string; cert_name?: string; issuing_org?: string }>;
};

const AVAILABILITY_OPTIONS = ['available', 'busy', 'away'] as const;

export default function EditProfilePage() {
  const router = useRouter();
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const identityInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    display_name: '',
    title: '',
    bio: '',
    location: '',
    availability_status: 'available',
    service_areas: '',
    pricing_from: '',
    cover_url: '',
    identity_status: '',
    identity_document_url: '',
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      const user = await fetchCurrentUser();
      if (!active) return;

      if (!user?.id) {
        router.replace('/login');
        return;
      }

      try {
        const res = await apiFetch('/api/profile/me');
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            router.replace('/login');
            return;
          }
          throw new Error(data?.error || data?.message || 'Failed to load profile');
        }

        if (active) {
          setBundle(data);
          setForm({
            display_name: data?.profile?.display_name || data?.profile?.full_name || user.username || '',
            title: data?.profile?.title || '',
            bio: data?.profile?.bio || '',
            location: data?.profile?.location || '',
            availability_status: data?.profile?.availability_status || 'available',
            service_areas: data?.profile?.service_areas || '',
            pricing_from: data?.profile?.pricing_from ? String(data.profile.pricing_from) : '',
            cover_url: data?.profile?.cover_url || '',
            identity_status: data?.profile?.identity_status || 'unverified',
            identity_document_url: data?.profile?.identity_document_url || '',
          });
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [router]);

  const profileId = bundle?.profile?.id;

  const canSave = useMemo(() => {
    return Boolean(bundle?.user?.id && profileId);
  }, [bundle?.user?.id, profileId]);

  const uploadAsset = async (kind: 'avatar' | 'cover' | 'identity', file: File) => {
    setSaving(true);
    setNotice('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authedUpload(`/api/upload/${kind}`, formData);
      if (!res.ok) {
        const data = (res.data || {}) as { error?: string; message?: string };
        throw new Error(data?.error || data?.message || 'Upload failed');
      }
      const data = (res.data as { url?: string }) || {};
      const uploadedUrl = data.url || '';

      setBundle(prev => {
        if (!prev) return prev;
        const nextProfile = { ...(prev.profile || {}) };
        if (kind === 'avatar') nextProfile.avatar_url = data.url;
        if (kind === 'cover') nextProfile.cover_url = data.url;
        if (kind === 'identity') {
          nextProfile.identity_document_url = data.url;
          nextProfile.identity_status = 'pending';
        }
        return { ...prev, profile: nextProfile };
      });

      setForm(prev => ({
        ...prev,
        cover_url: kind === 'cover' ? uploadedUrl : prev.cover_url,
        identity_document_url: kind === 'identity' ? uploadedUrl : prev.identity_document_url,
        identity_status: kind === 'identity' ? 'pending' : prev.identity_status,
      }));

      setNotice(`${kind[0].toUpperCase()}${kind.slice(1)} uploaded`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload file');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!bundle?.user?.id) return;
    setSaving(true);
    setNotice('');
    setError('');

    try {
      const res = await apiFetch(`/api/profile/update/${bundle.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: form.display_name || null,
          title: form.title || null,
          bio: form.bio || null,
          location: form.location || null,
          availability_status: form.availability_status || null,
          service_areas: form.service_areas || null,
          pricing_from: form.pricing_from ? Number(form.pricing_from) : null,
          cover_url: form.cover_url || null,
          identity_status: form.identity_status || null,
          identity_document_url: form.identity_document_url || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Failed to update profile');
      }

      setNotice('Profile saved');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-[#4F46E5]">
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  if (error && !bundle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-8 text-center dark:bg-black">
        <WarningCircle size={64} weight="duotone" className="text-rose-500" />
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Could not load editor</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{error}</p>
        </div>
        <Link href="/profile" className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-[5%] py-6 text-zinc-950 dark:bg-black dark:text-white md:px-[8%]">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
            <ArrowLeft size={16} />
            Back to profile
          </Link>
          <button
            onClick={saveProfile}
            disabled={!canSave || saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
          >
            {saving ? <SpinnerGap size={16} className="animate-spin" /> : <FloppyDisk size={16} />}
            Save changes
          </button>
        </div>

        <section className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Profile settings</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">Edit your live profile</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Every field here is written back to the backend, so the public profile, discovery, and trust surfaces stay in sync.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
              {[
                { label: 'Skills', value: bundle?.skills?.length || 0 },
                { label: 'Languages', value: bundle?.languages?.length || 0 },
                { label: 'Experience', value: bundle?.experience?.length || 0 },
                { label: 'Certifications', value: bundle?.certifications?.length || 0 },
              ].map(item => (
                <div key={item.label} className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                  <p className="mt-1 text-xl font-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {notice ? (
            <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle size={16} className="mr-2 inline" />
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          ) : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Identity</p>
              <h2 className="mt-1 text-xl font-black">Public profile basics</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Display name</span>
                <input
                  value={form.display_name}
                  onChange={(event) => setForm(prev => ({ ...prev, display_name: event.target.value }))}
                  className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm(prev => ({ ...prev, title: event.target.value }))}
                  className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Location</span>
                <input
                  value={form.location}
                  onChange={(event) => setForm(prev => ({ ...prev, location: event.target.value }))}
                  className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Availability</span>
                <select
                  value={form.availability_status}
                  onChange={(event) => setForm(prev => ({ ...prev, availability_status: event.target.value }))}
                  className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none dark:bg-zinc-900"
                >
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Bio</span>
              <textarea
                value={form.bio}
                onChange={(event) => setForm(prev => ({ ...prev, bio: event.target.value }))}
                rows={7}
                className="w-full rounded-xl bg-zinc-50 p-4 text-sm leading-7 outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Service areas</span>
              <input
                value={form.service_areas}
                onChange={(event) => setForm(prev => ({ ...prev, service_areas: event.target.value }))}
                placeholder="Nairobi, Mombasa, remote"
                className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Starting price</span>
              <input
                value={form.pricing_from}
                onChange={(event) => setForm(prev => ({ ...prev, pricing_from: event.target.value }))}
                inputMode="decimal"
                placeholder="0"
                className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
              />
            </label>
          </section>

          <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Trust assets</p>
              <h2 className="mt-1 text-xl font-black">Profile media and verification</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Avatar</p>
                  <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{bundle?.profile?.avatar_url || 'No avatar uploaded'}</p>
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950"
                >
                  Upload avatar
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Cover</p>
                  <p className="mt-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{form.cover_url || 'No cover uploaded'}</p>
                </div>
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950"
                >
                  Upload cover
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Identity</p>
                  <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{form.identity_status || 'unverified'}</p>
                </div>
                <button
                  onClick={() => identityInputRef.current?.click()}
                  className="rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950"
                >
                  Upload document
                </button>
              </div>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadAsset('avatar', file);
                event.target.value = '';
              }}
            />
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadAsset('cover', file);
                event.target.value = '';
              }}
            />
            <input
              ref={identityInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadAsset('identity', file);
                event.target.value = '';
              }}
            />

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Cover URL</span>
              <input
                value={form.cover_url}
                onChange={(event) => setForm(prev => ({ ...prev, cover_url: event.target.value }))}
                placeholder="Live cover URL from upload"
                className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Identity document URL</span>
              <input
                value={form.identity_document_url}
                onChange={(event) => setForm(prev => ({ ...prev, identity_document_url: event.target.value }))}
                placeholder="Live document URL from upload"
                className="h-12 w-full rounded-xl bg-zinc-50 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900"
              />
            </label>

            <div className="rounded-xl bg-zinc-50 px-4 py-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-0.5 text-[#4F46E5]" />
                <p>
                  Uploads go straight to your profile record — pick a file and it uploads immediately, then press Save changes to publish.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Live snapshot</p>
              {[
                { label: 'Skills', value: bundle?.skills?.length || 0 },
                { label: 'Languages', value: bundle?.languages?.length || 0 },
                { label: 'Experience', value: bundle?.experience?.length || 0 },
                { label: 'Education', value: bundle?.education?.length || 0 },
                { label: 'Certifications', value: bundle?.certifications?.length || 0 },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
                  <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
