'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  Certificate,
  ChartLine,
  ChatCircleText,
  CheckCircle,
  Crown,
  Download,
  Eye,
  FileText,
  Globe,
  Heart,
  MapPin,
  PencilSimple,
  Share,
  ShieldCheck,
  Sparkle,
  Star,
  UserCircle,
  Users,
  WarningCircle,
} from '@phosphor-icons/react';
import { APP_CONFIG } from '@/lib/config';
import { apiFetch } from '@/lib/session';
import { openConversationWith } from '@/lib/conversations';

type ProfileBundle = {
  user?: { id?: string | null; username?: string | null; role?: string | null } | null;
  profile?: {
    id?: string;
    full_name?: string | null;
    display_name?: string | null;
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
    is_verified?: boolean | null;
    trust_score?: number | string | null;
    total_gigs?: number | null;
    total_earnings?: number | null;
    created_at?: string | null;
  } | null;
  skills?: Array<{ id?: string; skill_name?: string; skill_level?: string }>;
  languages?: Array<{ id?: string; language?: string; proficiency?: string }>;
  experience?: Array<{
    id?: string;
    company?: string;
    role_title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
  }>;
  education?: Array<{
    id?: string;
    institution?: string;
    degree?: string;
    field_of_study?: string;
    start_year?: number;
    end_year?: number;
  }>;
  certifications?: Array<{
    id?: string;
    cert_name?: string;
    issuing_org?: string;
    issue_date?: string;
    expiry_date?: string;
    credential_url?: string;
  }>;
  portfolio?: Array<{
    id?: string;
    title?: string;
    description?: string;
    video_url?: string;
    thumbnail_url?: string;
    preview_url?: string;
    view_count?: number;
    likes_count?: number;
    created_at?: string;
  }>;
  ratings?: Array<{
    id?: string;
    score?: number;
    rating?: number;
    comment?: string;
    reviewer_username?: string;
    created_at?: string;
  }>;
  ratingBreakdown?: Array<{ score?: number; count?: number }>;
  trustAverage?: number | string;
  totalEarnings?: number | string;
};

interface ProfileTrustSurfaceProps {
  mode: 'owner' | 'public';
  bundle: ProfileBundle;
}

const parseScore = (value?: number | string | null) => Number(value || 0);

const formatCurrency = (value?: number | string | null) => {
  const amount = Number(value || 0);
  return `KSh ${amount.toLocaleString()}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

const safeList = <T,>(value?: T[] | null) => (Array.isArray(value) ? value : []);

export function ProfileTrustSurface({ mode, bundle }: ProfileTrustSurfaceProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [followState, setFollowState] = useState<'idle' | 'following'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const user = bundle.user || {};
  const profile = bundle.profile || {};
  const skills = safeList(bundle.skills);
  const languages = safeList(bundle.languages);
  const experience = safeList(bundle.experience);
  const education = safeList(bundle.education);
  const certifications = safeList(bundle.certifications);
  const portfolio = safeList(bundle.portfolio);
  const ratings = safeList(bundle.ratings);
  const ratingBreakdown = safeList(bundle.ratingBreakdown);

  const displayName = profile.display_name || profile.full_name || user.username || 'Workora profile';
  const title = profile.title || profile.trade || 'Professional';
  const location = profile.location || 'Kenya';
  const trustScore = parseScore(profile.trust_score ?? bundle.trustAverage);
  const totalEarnings = Number(profile.total_earnings ?? bundle.totalEarnings ?? 0);
  const totalJobs = Number(profile.total_gigs ?? portfolio.length ?? 0);
  const availability = profile.availability_status || 'available';
  const serviceAreas = String(profile.service_areas || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  const isOwner = mode === 'owner';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const createdAtLabel = formatDate(profile.created_at);

  const shareProfile = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;
    if (navigator.share) {
      await navigator.share({ title: displayName, text: title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setStatusMessage('Profile link copied');
  };

  const toggleFollow = async () => {
    if (!user.id) return;
    startTransition(async () => {
      const res = await apiFetch(`/api/profile/follow/${user.id}`, { method: 'POST' });
      if (!res.ok) {
        setStatusMessage('Could not update follow state');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setFollowState(data.following ? 'following' : 'idle');
      setStatusMessage(data.following ? 'Following now' : 'Follow removed');
    });
  };

  const submitModerationAction = async (kind: 'report' | 'block') => {
    if (!user.id) return;
    const reason = window.prompt(`Why are you ${kind}ing this profile?`, 'other');
    if (!reason) return;
    const details = window.prompt('Add a little more detail', '') || '';
    const res = await apiFetch(`/api/profile/${kind}/${user.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reason, details }),
    });
    if (res.ok) {
      setStatusMessage(kind === 'report' ? 'Report submitted' : 'Profile blocked');
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {profile.cover_url ? (
            <Image src={profile.cover_url} alt={displayName} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1D4ED8] to-[#6D28D9]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Trust profile</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight">{displayName}</h1>
              <p className="mt-1 text-sm text-white/75">{title}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/12 px-3 py-2 backdrop-blur-md">
              <ShieldCheck size={18} weight="fill" className="text-white" />
              <span className="text-sm font-semibold">{profile.identity_status || 'unverified'}</span>
            </div>
          </div>
        </div>

        <div className="-mt-10 px-5 pb-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="rounded-xl bg-white p-1 shadow-sm shadow-black/10 dark:bg-zinc-900">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={displayName}
                    width={112}
                    height={112}
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-zinc-950 text-4xl font-black text-white">
                    {avatarInitial}
                  </div>
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">@{user.username || displayName}</p>
                  {profile.is_verified ? <ShieldCheck size={18} weight="fill" className="text-[#4F46E5]" /> : null}
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    {availability}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} />
                    {location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={16} weight="fill" className="text-amber-500" />
                    {trustScore.toFixed(1)} trust
                  </span>
                  {createdAtLabel ? <span>Joined {createdAtLabel}</span> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwner ? (
                <>
                  <Link href="/profile/edit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
                    <PencilSimple size={16} />
                    Edit profile
                  </Link>
                  <Link href="/dashboard/create" className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    <Briefcase size={16} />
                    Add work
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleFollow}
                    disabled={isPending}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                  >
                    <Heart size={16} weight={followState === 'following' ? 'fill' : 'regular'} />
                    {followState === 'following' ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={() => void openConversationWith(user.id, router)}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white"
                  >
                    <ChatCircleText size={16} />
                    Message
                  </button>
                </>
              )}
              <button onClick={shareProfile} className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                <Share size={16} />
                Share
              </button>
              {!isOwner ? (
                <>
                  <button onClick={() => void submitModerationAction('report')} className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    <WarningCircle size={16} />
                    Report
                  </button>
                  <button onClick={() => void submitModerationAction('block')} className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    <Users size={16} />
                    Block
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {statusMessage ? (
            <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {statusMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Trust score', value: trustScore.toFixed(1), icon: ShieldCheck, color: 'text-[#4F46E5]' },
          { label: 'Jobs', value: String(totalJobs), icon: Briefcase, color: 'text-emerald-500' },
          { label: 'Reviews', value: String(ratings.length), icon: Star, color: 'text-amber-500' },
          { label: 'Earnings', value: formatCurrency(totalEarnings), icon: Crown, color: 'text-fuchsia-500' },
        ].map(item => (
          <div key={item.label} className="rounded-xl bg-white px-4 py-4 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{item.value}</p>
              </div>
              <div className="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-900">
                <item.icon size={18} weight="fill" className={item.color} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">About</p>
                <h2 className="mt-1 text-xl font-black text-zinc-950 dark:text-white">Work style and focus</h2>
              </div>
              <FileText size={18} className="text-[#4F46E5]" />
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {profile.bio || 'No bio has been added yet.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              {serviceAreas.length > 0 ? serviceAreas.map(area => (
                <span key={area} className="rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">{area}</span>
              )) : (
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">No service areas listed</span>
              )}
              <span className="rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
                {profile.pricing_from ? `${formatCurrency(profile.pricing_from)} from` : 'Pricing not set'}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Portfolio</p>
                <h2 className="mt-1 text-xl font-black text-zinc-950 dark:text-white">Recent proof of work</h2>
              </div>
              <Link href={isOwner ? '/dashboard/create' : `/dashboard/messages`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5]">
                Upload <ArrowRight size={16} />
              </Link>
            </div>
            {portfolio.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {portfolio.map(item => (
                  <Link key={item.id} href={`/dashboard/post/${item.id}`} className="overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    <div className="relative aspect-video">
                      <Image
                        src={item.thumbnail_url || item.preview_url || APP_CONFIG.defaults.thumbnail}
                        alt={item.title || 'Portfolio item'}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="truncate text-sm font-semibold">{item.title || 'Untitled work'}</p>
                        <p className="truncate text-xs text-white/75">{item.description || 'Live portfolio item'}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                No portfolio items are published yet.
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Reviews</p>
                <h2 className="mt-1 text-xl font-black text-zinc-950 dark:text-white">Client feedback</h2>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-semibold dark:bg-zinc-900">
                <Star size={16} weight="fill" className="text-amber-500" />
                {parseScore(bundle.trustAverage).toFixed(1)}
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-3">
                {ratingBreakdown.length > 0 ? ratingBreakdown
                  .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
                  .map(item => (
                    <div key={item.score} className="flex items-center gap-3 text-sm">
                      <span className="w-4 font-semibold text-zinc-500">{item.score}</span>
                      <div className="h-2 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-zinc-950 dark:bg-white"
                          style={{ width: `${Math.max(Number(item.count || 0), 0) * 18}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-zinc-500">{item.count}</span>
                    </div>
                  )) : (
                  <div className="rounded-xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    No ratings yet.
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {ratings.length > 0 ? ratings.slice(0, 4).map(review => (
                  <div key={review.id} className="rounded-xl bg-zinc-50 px-4 py-4 dark:bg-zinc-900">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-950 dark:text-white">{review.reviewer_username || 'Client'}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <Star size={14} weight="fill" />
                        {review.score ?? review.rating ?? 0}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {review.comment || 'No written comment.'}
                    </p>
                  </div>
                )) : (
                  <div className="rounded-xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    Reviews will appear here once clients leave feedback.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: 'Skills', icon: Sparkle, items: skills.map(skill => `${skill.skill_name}${skill.skill_level ? ` - ${skill.skill_level}` : ''}`) },
              { title: 'Languages', icon: Globe, items: languages.map(language => `${language.language}${language.proficiency ? ` - ${language.proficiency}` : ''}`) },
              { title: 'Experience', icon: Briefcase, items: experience.map(item => `${item.role_title || 'Role'} at ${item.company || 'Company'}`) },
              { title: 'Education', icon: Users, items: education.map(item => `${item.degree || 'Degree'}${item.institution ? ` - ${item.institution}` : ''}`) },
              { title: 'Certifications', icon: Certificate, items: certifications.map(item => item.cert_name || 'Certification') },
            ].map(section => (
              <div key={section.title} className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{section.title}</p>
                  <section.icon size={18} className="text-[#4F46E5]" />
                </div>
                <div className="mt-4 space-y-2">
                  {section.items.length > 0 ? section.items.slice(0, 4).map(item => (
                    <div key={item} className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                      {item}
                    </div>
                  )) : (
                    <div className="rounded-xl bg-zinc-50 px-4 py-4 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                      Nothing added yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Trust details</p>
              <ShieldCheck size={18} className="text-[#4F46E5]" />
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Identity', value: profile.identity_status || 'unverified' },
                { label: 'Verification', value: profile.is_verified ? 'Approved' : 'Pending' },
                { label: 'Availability', value: availability },
                { label: 'Pricing from', value: profile.pricing_from ? formatCurrency(profile.pricing_from) : 'Not set' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
                  <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                  <span className="font-semibold text-zinc-950 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Contact actions</p>
              <ChatCircleText size={18} className="text-[#4F46E5]" />
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => void openConversationWith(user.id, router)}
                className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white"
              >
                Send message
                <ArrowRight size={16} />
              </button>
              <button onClick={shareProfile} className="flex w-full items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                Share profile
                <Share size={16} />
              </button>
              {isOwner ? (
                <>
                  <Link href="/profile/edit" className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    Edit profile
                    <PencilSimple size={16} />
                  </Link>
                  <Link href="/dashboard/analytics" className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    Open analytics
                    <ChartLine size={16} />
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={toggleFollow} className="flex w-full items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    {followState === 'following' ? 'Following' : 'Follow'}
                    <Heart size={16} weight={followState === 'following' ? 'fill' : 'regular'} />
                  </button>
                  <button onClick={() => void submitModerationAction('report')} className="flex w-full items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
                    Report profile
                    <WarningCircle size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Trust history</p>
              <Sparkle size={18} className="text-[#4F46E5]" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                {ratings.length} public reviews
              </div>
              <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                {portfolio.length} portfolio items
              </div>
              <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                {serviceAreas.length} service areas
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950 p-5 text-white shadow-sm shadow-black/10">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <CheckCircle size={18} weight="fill" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Status</p>
                <p className="mt-1 text-lg font-black">{profile.is_verified ? 'Live and verified' : 'Live and building trust'}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              {profile.identity_document_url ? 'Identity documentation has been uploaded and is visible to the trust system.' : 'Identity documentation has not been uploaded yet.'}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
