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
  TrendDown,
  Heart,
  Bookmark,
  Users,
  VideoCamera,
  ChartLine,
  MapPin,
  Clock,
  CalendarBlank
} from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';

interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

interface GigSummary {
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
}

interface Stats {
  totalViews: number;
  viewGrowth: number;
  totalEngagement: number;
  engagementGrowth: number;
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  income: number;
  incomeGrowth: number;
  trustScore: number;
  profileVisits: number;
  likes: number;
  comments: number;
  saves: number;
  followers: number;
  avgResponseTime: string;
  completionRate: number;
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
    className="group rounded-[24px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
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

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
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
        const profileRes = await fetch('/api/profile/me');
        const profileData = await profileRes.json();

        const gigsRes = await fetch(`/api/gigs/worker/${profileData.profile?.id}`);
        const gigsJson = await gigsRes.json();
        const gigsData: GigSummary[] = Array.isArray(gigsJson) ? gigsJson : [];

        const totalViews = gigsData.reduce((sum, gig) => sum + (gig.view_count || 0), 0);
        const totalLikes = gigsData.reduce((sum, gig) => sum + (gig.likes_count || 0), 0);
        const totalComments = gigsData.reduce((sum, gig) => sum + (gig.comments_count || 0), 0);
        const totalEngagement = totalLikes + totalComments;

        setStats({
          totalViews,
          viewGrowth: Math.floor(Math.random() * 30) + 5,
          totalEngagement,
          engagementGrowth: Math.floor(Math.random() * 25) + 3,
          totalJobs: profileData.profile?.total_gigs || 0,
          completedJobs: profileData.profile?.total_gigs || 0,
          activeJobs: Math.floor(Math.random() * 5),
          income: profileData.profile?.total_earnings || 0,
          incomeGrowth: Math.floor(Math.random() * 20) + 2,
          trustScore: parseFloat(profileData.profile?.trust_score || 0) * 20,
          profileVisits: totalViews,
          likes: totalLikes,
          comments: totalComments,
          saves: Math.floor(totalEngagement * 0.3),
          followers: Math.floor(totalViews * 0.05),
          avgResponseTime: '< 2h',
          completionRate: 98
        });

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        setChartData(
          days.map(day => ({
            day,
            views: Math.floor(Math.random() * 500) + 200,
            engagement: Math.floor(Math.random() * 150) + 50,
            revenue: Math.floor(Math.random() * 5000) + 1000
          }))
        );
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

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

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-[5%] py-8 pb-32 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[28px] border border-zinc-100 bg-white p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Performance Dashboard
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-950 lg:text-4xl dark:text-white">Business Analytics</h1>
            <p className="max-w-xl text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">
              A cleaner view of your reach, engagement, job flow, and earnings across the last 30 days.
            </p>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Eye}
            label="Total Views"
            value={stats?.totalViews.toLocaleString() || '0'}
            growth={stats?.viewGrowth || 0}
            color="from-[#0066FF] to-[#0052CC]"
            subtitle="Profile and content impressions"
          />
          <MetricCard
            icon={ChatCircleDots}
            label="Engagement"
            value={stats?.totalEngagement.toLocaleString() || '0'}
            growth={stats?.engagementGrowth || 0}
            color="from-[#7000FF] to-[#5C00CC]"
            subtitle="Likes, comments and shares"
          />
          <MetricCard
            icon={Briefcase}
            label="Completed Jobs"
            value={stats?.completedJobs.toString() || '0'}
            growth={5}
            color="from-green-500 to-green-600"
            subtitle={`${stats?.activeJobs || 0} active projects`}
          />
          <MetricCard
            icon={CurrencyDollar}
            label="Total Earnings"
            value={`KSh ${stats?.income.toLocaleString() || '0'}`}
            growth={stats?.incomeGrowth || 0}
            color="from-amber-500 to-amber-600"
            subtitle="Last 30 days"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-[24px] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
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
                  <div className="h-3 w-3 rounded-full bg-[#7000FF]" />
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
                        className="w-full cursor-pointer rounded-t-xl bg-gradient-to-t from-[#0066FF] to-[#0052CC] transition-all hover:brightness-110"
                        style={{ height: `${(d.views / 500) * 100}%` }}
                      />
                    </div>
                    <div className="relative flex-1">
                      <div
                        className="w-full cursor-pointer rounded-t-xl bg-gradient-to-t from-[#7000FF] to-[#5C00CC] transition-all hover:brightness-110"
                        style={{ height: `${(d.engagement / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-zinc-100 bg-white p-8 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
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
                  <TrendUp size={14} weight="bold" /> Top 1%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/30">Scale 0-100</span>
              </div>
            </div>

            <div className="relative z-10 my-6 h-px w-full bg-zinc-100 dark:bg-white/10" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-white/60">Completion Rate</span>
                <span className="text-sm font-black text-zinc-950 dark:text-white">{stats?.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 dark:text-white/60">Response Time</span>
                <span className="text-sm font-black text-zinc-950 dark:text-white">{stats?.avgResponseTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, label: 'Total Likes', value: stats?.likes || 0, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
            { icon: ChatCircleDots, label: 'Comments', value: stats?.comments || 0, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
            { icon: Bookmark, label: 'Saved', value: stats?.saves || 0, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
            { icon: Users, label: 'Followers', value: stats?.followers || 0, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-[24px] border border-zinc-100 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
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
          <div className="rounded-[24px] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Top Content</h3>
              <VideoCamera size={24} weight="duotone" className="text-[#0066FF]" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { title: 'Complete House Wiring', views: '4.2K', engagement: '892', trend: 18 },
                { title: 'Solar Panel Installation', views: '3.8K', engagement: '743', trend: 12 },
                { title: 'Electrical Fault Repair', views: '2.1K', engagement: '421', trend: -5 },
              ].map((content, i) => (
                <div key={i} className="flex items-center justify-between rounded-[18px] bg-zinc-50 p-4 transition-all hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-sm font-black text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      #{i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-zinc-950 dark:text-white">{content.title}</span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{content.views} views / {content.engagement} engagements</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-black ${content.trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {content.trend >= 0 ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
                    {Math.abs(content.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Business Insights</h3>
              <ChartLine size={24} weight="duotone" className="text-[#7000FF]" />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {[
                { icon: MapPin, label: 'Service Locations', value: '3 Cities', detail: 'Nairobi, Mombasa, Kisumu' },
                { icon: Clock, label: 'Avg. Project Time', value: '3.5 Days', detail: 'Faster than 68% of pros' },
                { icon: CalendarBlank, label: 'Member Since', value: 'Jan 2024', detail: '8 months active' },
                { icon: Users, label: 'Repeat Clients', value: '24%', detail: 'Above average retention' },
              ].map((stat, i) => (
                <div key={i} className="flex items-start gap-4 rounded-[18px] p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-950">
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
