'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  ChatCircleDots,
  Briefcase,
  CurrencyDollar,
  ArrowUp,
  ArrowDown,
  SpinnerGap,
  ShieldCheck,
  TrendUp,
  Heart,
  Bookmark,
  Users,
  UsersThree,
  ClockCountdown,
  VideoCamera,
  ChartLine,
  MapPin,
  Clock,
  CalendarBlank
} from '@phosphor-icons/react';
import Link from 'next/link';
import { fetchCurrentUser, apiFetch } from '@/lib/session';

interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

interface GigSummary {
  id?: string;
  title?: string;
  description?: string;
  created_at?: string;
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  price?: string | number;
}

interface Stats {
  totalViews: number;
  viewGrowth: number;
  totalEngagement: number;
  engagementGrowth: number;
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  jobsGrowth: number;
  income: number;
  incomeGrowth: number;
  trustScore: number;
  likes: number;
  comments: number;
  saves: number;
  followers: number;
  replyTime: string | null;
  replySamples: number;
  completionRate: number;
  ratings: number;
}

interface BusinessStats {
  jobsPosted: number;
  openJobs: number;
  applications: number;
  pending: number;
}

interface ChartData {
  day: string;
  views: number;
  engagement: number;
  revenue: number;
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  growth: number;
  color: string;
  subtitle?: string;
}

const MetricCard = ({ icon: Icon, label, value, growth, color, subtitle }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group rounded-[16px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-sm`}>
          <Icon size={20} weight="regular" className="text-white" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-500">{label}</p>
          <p className="mt-1 text-3xl font-black tracking-tighter text-zinc-950 lg:text-[2.15rem] dark:text-white">{value}</p>
          {subtitle && <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
        </div>
      </div>
      <div
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${
          growth >= 0
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300'
            : 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300'
        }`}
      >
        {growth >= 0 ? <ArrowUp size={14} weight="bold" /> : <ArrowDown size={14} weight="bold" />}
        {Math.abs(growth)}%
      </div>
    </div>
  </motion.div>
);

const DAY_MS = 24 * 60 * 60 * 1000;

const rangeConfig = {
  '7d': { days: 7, buckets: 7 },
  '30d': { days: 30, buckets: 6 },
  '90d': { days: 90, buckets: 9 },
} as const;

const toNumber = (value: unknown) => Number(value || 0);

const calculateGrowth = (current: number, previous: number) => {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const buildChartData = (gigs: GigSummary[], timeRange: '7d' | '30d' | '90d') => {
  const { days, buckets } = rangeConfig[timeRange];
  const bucketSize = Math.max(1, Math.ceil(days / buckets));
  const now = Date.now();

  const data = Array.from({ length: buckets }, (_, index) => {
    const startAge = days - (index + 1) * bucketSize;
    const labelDate = new Date(now - Math.max(0, startAge) * DAY_MS);
    return {
      day: labelDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: 0,
      engagement: 0,
      revenue: 0,
    };
  });

  gigs.forEach((gig) => {
    if (!gig.created_at) return;
    const createdAt = new Date(gig.created_at).getTime();
    if (Number.isNaN(createdAt)) return;

    const ageDays = Math.floor((now - createdAt) / DAY_MS);
    if (ageDays < 0 || ageDays >= days) return;

    const bucketIndex = Math.min(buckets - 1, Math.floor(ageDays / bucketSize));
    const bucket = data[buckets - 1 - bucketIndex];
    bucket.views += toNumber(gig.view_count);
    bucket.engagement += toNumber(gig.likes_count) + toNumber(gig.comments_count);
    bucket.revenue += toNumber(gig.price);
  });

  return data;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [gigs, setGigs] = useState<GigSummary[]>([]);
  const [profile, setProfile] = useState<{ id: string; location?: string; created_at?: string; full_name?: string; title?: string; trade?: string; avatar_url?: string } | null>(null);
  const [ratingAverage, setRatingAverage] = useState('0.0');
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    async function loadAnalytics() {
      const user: CurrentUser | null = await fetchCurrentUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      try {
        const profileRes = await apiFetch('/api/profile/me');
        const profileData = await profileRes.json();
        setProfile(profileData.profile || null);

        const profileId = profileData.profile?.id || '';
        const [gigsRes, ratingsRes, savedRes, replyRes, jobsRes] = await Promise.all([
          profileId ? apiFetch(`/api/gigs/worker/${profileId}`) : Promise.resolve(null),
          profileId ? apiFetch(`/api/profile/ratings/${profileId}`) : Promise.resolve(null),
          apiFetch(`/api/gigs/saved/${user.id}`),
          apiFetch('/api/analytics/reply-time'),
          apiFetch('/api/jobs/mine').catch(() => null),
        ]);

        const gigsJson = gigsRes ? await gigsRes.json() : [];
        const ratingsJson = ratingsRes ? await ratingsRes.json() : { ratings: [], average: '0.0', breakdown: [] };
        const savedJson = await savedRes.json();
        const replyJson = replyRes.ok ? await replyRes.json().catch(() => null) : null;
        const jobsJson = jobsRes?.ok ? await jobsRes.json().catch(() => null) : null;

        const gigsData: GigSummary[] = Array.isArray(gigsJson) ? gigsJson : [];
        const ratingsData = ratingsJson && typeof ratingsJson === 'object' ? ratingsJson : { ratings: [], average: '0.0', breakdown: [] };
        const savedGigs = Array.isArray(savedJson) ? savedJson : [];
        setGigs(gigsData);
        setRatingAverage(String(ratingsData.average || '0.0'));

        if (jobsJson && Array.isArray(jobsJson.jobs)) {
          setBusinessStats({
            jobsPosted: jobsJson.jobs.length,
            openJobs: jobsJson.jobs.filter((j: { status?: string }) => j.status === 'open').length,
            applications: Array.isArray(jobsJson.applications) ? jobsJson.applications.length : 0,
            pending: Array.isArray(jobsJson.applications)
              ? jobsJson.applications.filter((a: { status?: string }) => a.status === 'pending').length
              : 0,
          });
        }

        const totalViews = gigsData.reduce((sum, gig) => sum + toNumber(gig.view_count), 0);
        const totalLikes = gigsData.reduce((sum, gig) => sum + toNumber(gig.likes_count), 0);
        const totalComments = gigsData.reduce((sum, gig) => sum + toNumber(gig.comments_count), 0);
        const totalEngagement = totalLikes + totalComments;

        const { days } = rangeConfig[timeRange];
        const halfWindow = Math.max(1, Math.floor(days / 2));
        const now = Date.now();

        let recentViews = 0;
        let previousViews = 0;
        let recentEngagement = 0;
        let previousEngagement = 0;
        let recentIncome = 0;
        let previousIncome = 0;
        let activeJobs = 0;

        gigsData.forEach((gig) => {
          if (!gig.created_at) return;
          const createdAt = new Date(gig.created_at).getTime();
          if (Number.isNaN(createdAt)) return;

          const ageDays = Math.floor((now - createdAt) / DAY_MS);
          if (ageDays < 0 || ageDays >= days) return;

          const views = toNumber(gig.view_count);
          const engagement = toNumber(gig.likes_count) + toNumber(gig.comments_count);
          const income = toNumber(gig.price);

          if (ageDays < halfWindow) {
            recentViews += views;
            recentEngagement += engagement;
            recentIncome += income;
          } else {
            previousViews += views;
            previousEngagement += engagement;
            previousIncome += income;
          }

          if (ageDays < 14) {
            activeJobs += 1;
          }
        });

        const totalJobs = profileData.profile?.total_gigs || gigsData.length;
        const completedJobs = Math.max(0, totalJobs - activeJobs);
        const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
        // Real response time from the messages backend (null = not enough data).
        const replyTime = replyJson?.label || null;
        const replySamples = Number(replyJson?.samples || 0);
        // Real followers from the social graph, not derived from ratings.
        const followers = Number(profileData.social?.followers || 0);
        const chart = buildChartData(gigsData, timeRange);

        setStats({
          totalViews,
          viewGrowth: calculateGrowth(recentViews, previousViews),
          totalEngagement,
          engagementGrowth: calculateGrowth(recentEngagement, previousEngagement),
          totalJobs,
          completedJobs,
          activeJobs,
          jobsGrowth: calculateGrowth(activeJobs, Math.max(0, totalJobs - activeJobs)),
          income: profileData.profile?.total_earnings || gigsData.reduce((sum, gig) => sum + toNumber(gig.price), 0),
          incomeGrowth: calculateGrowth(recentIncome, previousIncome),
          trustScore: toNumber(profileData.profile?.trust_score) * 20,
          likes: totalLikes,
          comments: totalComments,
          saves: savedGigs.length,
          followers,
          replyTime,
          replySamples,
          completionRate,
          ratings: Array.isArray(ratingsData.ratings) ? ratingsData.ratings.length : 0,
        });

        setChartData(chart);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-[#0A0E17]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-[#0066FF]"
        >
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  const maxViews = Math.max(1, ...chartData.map((item) => item.views));
  const maxEngagement = Math.max(1, ...chartData.map((item) => item.engagement));
  const topGigs = [...gigs].sort((a, b) => toNumber(b.view_count) - toNumber(a.view_count)).slice(0, 3);
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';
  const isBusiness = !profile;
  // Reputation label derived from the real trust score — never hardcoded.
  const trustLabel = !stats ? '…' : stats.trustScore >= 80 ? 'Elite verified reputation' : stats.trustScore >= 60 ? 'Strong reputation' : stats.trustScore > 0 ? 'Building trust' : 'No trust data yet';

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-[5%] py-8 pb-32 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[16px] border border-zinc-100 bg-white p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0066FF] text-lg font-black text-white shadow-lg">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                String(profile?.full_name || 'Y').charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex max-w-md flex-col gap-1.5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Creator analytics
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-950 lg:text-3xl dark:text-white">
                {isBusiness ? 'Your business performance' : `${profile?.full_name || 'Your'} performance`}
              </h1>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {isBusiness ? 'Jobs, applications and hiring activity' : profile?.title || profile?.trade || 'Workora professional'}
                {!isBusiness && profile?.location ? <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span> : null}
                {!isBusiness && profile?.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 p-1.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-[0.22em] transition-all ${
                  timeRange === range
                    ? 'bg-white text-zinc-950 shadow-md dark:bg-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {isBusiness && (
          <div className="rounded-2xl border border-[#0066FF]/20 bg-[#0066FF]/5 px-5 py-4 text-sm dark:bg-[#0066FF]/10">
            <p className="font-bold text-zinc-950 dark:text-white">
              You don't have a creator profile yet — this view shows your hiring activity.
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Post a job, review applications and manage hires from the{' '}
              <Link href="/dashboard/business" className="font-black text-[#0066FF] underline-offset-2 hover:underline">Business Hub</Link>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isBusiness ? (
            <>
              <MetricCard icon={Briefcase} label="Jobs Posted" value={String(businessStats?.jobsPosted || 0)} growth={0} color="bg-[#0066FF]" subtitle="Live across the platform" />
              <MetricCard icon={Clock} label="Open Jobs" value={String(businessStats?.openJobs || 0)} growth={0} color="from-emerald-500 to-emerald-600" subtitle="Accepting applications" />
              <MetricCard icon={UsersThree} label="Applications" value={String(businessStats?.applications || 0)} growth={0} color="from-[#0066FF] to-[#004AAD]" subtitle="Received in total" />
              <MetricCard icon={ClockCountdown} label="Pending Review" value={String(businessStats?.pending || 0)} growth={0} color="from-amber-500 to-amber-600" subtitle="Awaiting your decision" />
            </>
          ) : (
            <>
              <MetricCard
                icon={Eye}
                label="Total Views"
                value={stats?.totalViews.toLocaleString() || '0'}
                growth={stats?.viewGrowth || 0}
                color="bg-[#0066FF]"
                subtitle="Views across your works"
              />
              <MetricCard
                icon={ChatCircleDots}
                label="Engagement"
                value={stats?.totalEngagement.toLocaleString() || '0'}
                growth={stats?.engagementGrowth || 0}
                color="from-[#0066FF] to-[#004AAD]"
                subtitle="Likes and comments"
              />
              <MetricCard
                icon={Briefcase}
                label="Completed Jobs"
                value={stats?.completedJobs.toString() || '0'}
                growth={stats?.jobsGrowth || 0}
                color="from-green-500 to-green-600"
                subtitle={`${stats?.activeJobs || 0} active in the last 14 days`}
              />
              <MetricCard
                icon={CurrencyDollar}
                label="Total Earnings"
                value={`KSh ${stats?.income.toLocaleString() || '0'}`}
                growth={stats?.incomeGrowth || 0}
                color="from-amber-500 to-amber-600"
                subtitle="Across all published works"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-[16px] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Performance Overview</h3>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Weekly trends and patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#0066FF]" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Views</span>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#0066FF]" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Engagement</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex h-64 items-end gap-3 border-b border-l border-zinc-100 pb-4 pl-4 dark:border-zinc-800">
              {chartData.map((d, i) => (
                <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end gap-1">
                    <div className="relative flex-1">
                      <div
                        className="w-full cursor-pointer rounded-t-xl bg-[#0066FF] transition-all hover:brightness-110"
                        style={{ height: `${Math.max(10, (d.views / maxViews) * 100)}%` }}
                      />
                    </div>
                    <div className="relative flex-1">
                      <div
                        className="w-full cursor-pointer rounded-t-xl bg-gradient-to-t from-[#0066FF] to-[#004AAD] transition-all hover:brightness-110"
                        style={{ height: `${Math.max(10, (d.engagement / maxEngagement) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-zinc-100 bg-white p-8 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#0066FF]">
                <ShieldCheck size={20} weight="fill" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Elite Trust Score</span>
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Your Reputation</h3>
            </div>

            <div className="relative z-10 mt-6 flex items-end gap-3">
              <span className="bg-gradient-to-br from-zinc-950 to-zinc-600 bg-clip-text text-7xl font-black leading-none tracking-tighter text-transparent dark:from-white dark:to-white/60">
                {Math.round(stats?.trustScore || 0)}
              </span>
              <div className="flex flex-col gap-1 pb-2">
                <span className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-300">
                  <ShieldCheck size={14} weight="fill" /> {trustLabel}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/30">Scale 0-100</span>
              </div>
            </div>

            <div className="relative z-10 my-6 h-px w-full bg-zinc-100 dark:bg-white/10" />              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-white/60">Completion Rate</span>
                  <span className="text-sm font-black text-zinc-950 dark:text-white">{stats?.completionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-white/60">Response Time</span>
                  <span className="text-sm font-black text-zinc-950 dark:text-white">
                    {stats?.replyTime ?? (stats && stats.replySamples === 0 ? '—' : '…')}
                  </span>
                </div>
                {stats && stats.replySamples === 0 && (
                  <p className="text-[10px] font-medium text-zinc-400 dark:text-white/30">
                    Based on {stats.replySamples} conversations — reply to messages to unlock this.
                  </p>
                )}
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, label: 'Total Likes', value: stats?.likes || 0, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
            { icon: ChatCircleDots, label: 'Comments', value: stats?.comments || 0, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
            { icon: Bookmark, label: 'Saved Works', value: stats?.saves || 0, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
            { icon: Users, label: 'Followers', value: stats?.followers || 0, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-[16px] border border-zinc-100 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon size={24} weight="fill" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">{item.label}</span>
                <span className="text-2xl font-black text-zinc-950 dark:text-white">{item.value.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[16px] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Top Content</h3>
              <VideoCamera size={24} weight="duotone" className="text-[#0066FF]" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {topGigs.map((content, i) => (
                <div key={content.id || i} className="flex items-center justify-between rounded-[14px] bg-zinc-50 p-4 transition-all hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-sm font-black text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      #{i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-zinc-950 dark:text-white">{content.title || content.description?.slice(0, 48) || 'Untitled gig'}</span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{toNumber(content.view_count).toLocaleString()} views / {(toNumber(content.likes_count) + toNumber(content.comments_count)).toLocaleString()} engagements</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Business Insights</h3>
              <ChartLine size={24} weight="duotone" className="text-[#0066FF]" />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {[
                { icon: MapPin, label: 'Service Location', value: profile?.location || 'Not set', detail: 'Pulled from your profile' },
                { icon: Clock, label: 'Member Since', value: memberSince, detail: `${stats?.totalJobs || 0} gigs published` },
                { icon: CalendarBlank, label: 'Active Jobs', value: String(stats?.activeJobs || 0), detail: 'Published in the last 14 days' },
                { icon: Users, label: 'Ratings Received', value: String(stats?.ratings || 0), detail: `${ratingAverage}/5 average rating` },
              ].map((stat, i) => (
                <div key={i} className="flex items-start gap-4 rounded-[14px] p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-950">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    <stat.icon size={20} weight="duotone" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">{stat.label}</span>
                      <span className="text-sm font-black text-zinc-950 dark:text-white">{stat.value}</span>
                    </div>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
