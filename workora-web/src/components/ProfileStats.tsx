import React from 'react';
import { Briefcase, Clock, CurrencyCircleDollar, Star } from '@phosphor-icons/react';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => (
  <div className="flex flex-col items-center gap-2 px-4">
    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-800 dark:from-white dark:to-zinc-300 p-[1px] shadow-[0_12px_28px_-16px_rgba(15,23,42,0.45)]">
      <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-white dark:bg-zinc-900">
        <Icon size={18} weight="regular" className={color} />
      </div>
    </div>
    <div className="text-center">
      <span className="block text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">{label}</span>
      <span className="mt-1 block text-base font-black tracking-tight text-zinc-950 dark:text-white">{value}</span>
    </div>
  </div>
);

interface ProfileStatsProps {
  income?: string;
  jobs?: number;
  trust?: string;
  rating?: string;
}

export function ProfileStats({ income = "KSh 0", jobs = 0, trust = "0%", rating = "0.0" }: ProfileStatsProps) {
  return (
    <div className="w-full bg-zinc-50 border border-zinc-100 rounded-[32px] py-8 grid grid-cols-4 divide-x divide-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:divide-zinc-800">
      <StatItem icon={CurrencyCircleDollar} label="Income" value={income} color="text-green-500" />
      <StatItem icon={Briefcase} label="Jobs" value={jobs.toString()} color="text-[#0066FF]" />
      <StatItem icon={Clock} label="Trust" value={trust} color="text-[#7000FF]" />
      <StatItem icon={Star} label="Rating" value={rating} color="text-yellow-500" />
    </div>
  );
}
