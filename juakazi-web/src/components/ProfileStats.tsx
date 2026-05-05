import React from 'react';
import { Briefcase, Clock, CurrencyCircleDollar, Star } from '@phosphor-icons/react';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => (
  <div className="flex flex-col items-center gap-1.5 px-4">
    <div className="flex items-center gap-1.5 text-zinc-400">
      <Icon size={16} weight="duotone" className={color} />
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <span className="text-base font-black tracking-tight text-zinc-950">{value}</span>
  </div>
);

export function ProfileStats() {
  return (
    <div className="w-full bg-zinc-50 border border-zinc-100 rounded-[32px] py-8 grid grid-cols-4 divide-x divide-zinc-200 shadow-sm">
      <StatItem icon={CurrencyCircleDollar} label="Income" value="KSh 120K" color="text-green-500" />
      <StatItem icon={Briefcase} label="Jobs" value="45" color="text-[#0066FF]" />
      <StatItem icon={Clock} label="Trust" value="100%" color="text-[#7000FF]" />
      <StatItem icon={Star} label="Rating" value="4.9" color="text-yellow-500" />
    </div>
  );
}
