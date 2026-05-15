'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { 
  TrendUp, 
  Eye, 
  ChatCircleDots,
  ShieldCheck,
  Briefcase
} from '@phosphor-icons/react';

interface Stats {
  totalViews: string;
  viewGrowth: string;
  totalEngagement: string;
  engagementGrowth: string;
  totalJobs: string;
  income: string;
  incomeGrowth: string;
  trustScore: string;
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  growth: string;
  color: string;
}

const MetricCard = ({ icon: Icon, label, value, growth, color }: MetricCardProps) => (
  <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[40px] flex flex-col gap-6 group hover:bg-white hover:shadow-xl transition-all">
    <div className="flex items-center justify-between">
      <div className={`h-12 w-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={24} weight="fill" />
      </div>
      <div className="flex items-center gap-1 text-green-500 font-black text-xs uppercase tracking-widest">
         <TrendUp size={16} weight="bold" /> {growth}
      </div>
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-3xl font-black text-zinc-950 tracking-tighter">{value}</p>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics
    setTimeout(() => {
      setStats({
        totalViews: '12.4K',
        viewGrowth: '+18%',
        totalEngagement: '2.8K',
        engagementGrowth: '+12%',
        totalJobs: '45',
        income: 'KSh 120,000',
        incomeGrowth: '+5%',
        trustScore: '98',
      });
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto bg-white pt-8 px-[5%] lg:px-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-10 pb-32">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Network Analytics</h1>
            <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase">Master your professional reach and growth velocity.</p>
          </div>

          {loading || !stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-zinc-50 animate-pulse rounded-[40px]" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard icon={Eye} label="Network Views" value={stats.totalViews} growth={stats.viewGrowth} color="text-[#0066FF]" />
                <MetricCard icon={ChatCircleDots} label="Total Engagement" value={stats.totalEngagement} growth={stats.engagementGrowth} color="text-[#7000FF]" />
                <MetricCard icon={Briefcase} label="Net Income" value={stats.income} growth={stats.incomeGrowth} color="text-green-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="p-10 bg-zinc-950 rounded-[48px] text-white flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                       <ShieldCheck size={200} weight="fill" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <h3 className="text-xl font-black italic tracking-tighter">Elite Trust Rank</h3>
                       <p className="text-white/40 text-xs font-black uppercase tracking-widest">Calculated by ImeanTech AI Systems</p>
                    </div>
                    <div className="flex items-end gap-4">
                       <span className="text-8xl font-black tracking-tighter leading-none">{stats.trustScore}</span>
                       <div className="flex flex-col gap-1 pb-2">
                          <span className="text-green-500 font-black text-xs uppercase tracking-widest flex items-center gap-1">
                             <TrendUp size={16} weight="bold" /> Global Top 1%
                          </span>
                          <span className="text-white/20 font-black text-xs uppercase tracking-widest">Scale 0-100</span>
                       </div>
                    </div>
                    <p className="text-sm font-medium text-white/60 leading-relaxed max-w-sm">
                      Your trust rank is in the top 1% of the network. This increases your profile visibility by 300% in the Search Portal.
                    </p>
                 </div>

                 <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Engagement Insights</h3>
                    <div className="flex flex-col gap-3">
                       {[
                         { label: 'Most Viewed Gig', value: 'Full House Wiring', count: '4.2K' },
                         { label: 'Top Trade Category', value: 'Electrical', count: '92%' },
                         { label: 'Repeat Client Rate', value: '15%', count: 'Elite' },
                       ].map((item, i) => (
                         <div key={i} className="p-6 bg-zinc-50 border border-zinc-100 rounded-[24px] flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                            <div className="flex flex-col gap-1">
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</p>
                               <p className="text-base font-black text-zinc-900 tracking-tight">{item.value}</p>
                            </div>
                            <span className="text-xs font-black text-zinc-950 uppercase tracking-widest">{item.count}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
