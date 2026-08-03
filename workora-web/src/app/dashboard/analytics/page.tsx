'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendUp, 
  TrendDown,
  Eye, 
  ChatCircleDots,
  ShieldCheck,
  Briefcase,
  VideoCamera,
  Heart,
  Bookmark,
  Users,
  CalendarBlank,
  MapPin,
  Clock,
  CurrencyDollar,
  ChartLine,
  ArrowUp,
  ArrowDown,
  SpinnerGap
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
    className="p-6 lg:p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] flex flex-col gap-5 group hover:shadow-xl transition-all"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`h-14 w-14 rounded-[20px] bg-gradient-to-br ${color} p-[1px] shadow-[0_14px_30px_-12px_rgba(15,23,42,0.45)] group-hover:scale-105 transition-transform`}>
          <div className="flex h-full w-full items-center justify-center rounded-[19px] bg-white/95 dark:bg-zinc-950/90 backdrop-blur-sm">
            <Icon size={22} weight="regular" className="text-zinc-950 dark:text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em]">{label}</p>
          <p className="text-4xl font-black text-zinc-950 dark:text-white tracking-tighter">{value}</p>
          {subtitle && <p className="text-xs font-bold text-zinc-400">{subtitle}</p>}
        </div>
      </div>
      <div className={`flex items-center gap-1.5 ${growth >= 0 ? 'text-green-500' : 'text-red-500'} font-black text-sm px-3 py-1.5 rounded-full ${growth >= 0 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
         {growth >= 0 ? <ArrowUp size={16} weight="bold" /> : <ArrowDown size={16} weight="bold" />}
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
        const mockChartData = days.map(day => ({
          day,
          views: Math.floor(Math.random() * 500) + 200,
          engagement: Math.floor(Math.random() * 150) + 50,
          revenue: Math.floor(Math.random() * 5000) + 1000
        }));
        setChartData(mockChartData);

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
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0A0E17]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-[#0066FF]">
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-50 dark:bg-[#0A0E17] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-[5%] lg:px-8 py-8 flex flex-col gap-8 pb-32">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tighter text-zinc-950 dark:text-white">Business Analytics</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">Your professional performance dashboard</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  timeRange === range
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            icon={Eye} 
            label="Total Views" 
            value={stats?.totalViews.toLocaleString() || '0'} 
            growth={stats?.viewGrowth || 0} 
            color="from-[#0066FF] to-[#0052CC]"
            subtitle="Profile & content impressions"
          />
          <MetricCard 
            icon={ChatCircleDots} 
            label="Engagement" 
            value={stats?.totalEngagement.toLocaleString() || '0'} 
            growth={stats?.engagementGrowth || 0} 
            color="from-[#7000FF] to-[#5C00CC]"
            subtitle="Likes, comments & shares"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">Performance Overview</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Weekly trends and patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#0066FF]" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Views</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="h-3 w-3 rounded-full bg-[#7000FF]" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Engagement</span>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-3 h-64 border-b border-l border-zinc-100 dark:border-zinc-800 pb-4 pl-4">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="flex-1 relative">
                      <div 
                        className="w-full bg-gradient-to-t from-[#0066FF] to-[#0052CC] rounded-t-xl transition-all hover:brightness-110 cursor-pointer"
                        style={{ height: `${(d.views / 500) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className="w-full bg-gradient-to-t from-[#7000FF] to-[#5C00CC] rounded-t-xl transition-all hover:brightness-110 cursor-pointer"
                        style={{ height: `${(d.engagement / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 rounded-[32px] p-8 text-white flex flex-col gap-6 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute -top-10 -right-10 opacity-5">
              <ShieldCheck size={200} weight="fill" />
            </div>
            
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2 text-[#0066FF]">
                <ShieldCheck size={20} weight="fill" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Elite Trust Score</span>
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Your Reputation</h3>
            </div>

            <div className="flex items-end gap-3 relative z-10">
              <span className="text-7xl font-black tracking-tighter leading-none bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                {Math.round(stats?.trustScore || 0)}
              </span>
              <div className="flex flex-col gap-1 pb-2">
                <span className="text-green-400 font-black text-xs uppercase tracking-widest flex items-center gap-1">
                  <TrendUp size={14} weight="bold" /> Top 1%
                </span>
                <span className="text-white/30 font-bold text-[10px] uppercase tracking-widest">Scale 0-100</span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 relative z-10" />

            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">Completion Rate</span>
                <span className="text-sm font-black text-white">{stats?.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">Response Time</span>
                <span className="text-sm font-black text-white">{stats?.avgResponseTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[24px] p-6 flex items-center gap-4 hover:shadow-lg transition-all"
            >
              <div className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}>
                <item.icon size={24} weight="fill" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{item.label}</span>
                <span className="text-2xl font-black text-zinc-950 dark:text-white">{item.value.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">Top Content</h3>
              <VideoCamera size={24} weight="duotone" className="text-[#0066FF]" />
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { title: 'Complete House Wiring', views: '4.2K', engagement: '892', trend: 18 },
                { title: 'Solar Panel Installation', views: '3.8K', engagement: '743', trend: 12 },
                { title: 'Electrical Fault Repair', views: '2.1K', engagement: '421', trend: -5 },
              ].map((content, i) => (
                <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between group hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 font-black text-sm">
                      #{i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-zinc-950 dark:text-white">{content.title}</span>
                      <span className="text-xs font-bold text-zinc-400">{content.views} views · {content.engagement} engagements</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-black ${content.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {content.trend >= 0 ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
                    {Math.abs(content.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">Business Insights</h3>
              <ChartLine size={24} weight="duotone" className="text-[#7000FF]" />
            </div>
            
            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin, label: 'Service Locations', value: '3 Cities', detail: 'Nairobi, Mombasa, Kisumu' },
                { icon: Clock, label: 'Avg. Project Time', value: '3.5 Days', detail: 'Faster than 68% of pros' },
                { icon: CalendarBlank, label: 'Member Since', value: 'Jan 2024', detail: '8 months active' },
                { icon: Users, label: 'Repeat Clients', value: '24%', detail: 'Above average retention' },
              ].map((stat, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <stat.icon size={20} weight="duotone" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</span>
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
