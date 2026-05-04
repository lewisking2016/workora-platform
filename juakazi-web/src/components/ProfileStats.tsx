import React from 'react';
import { Briefcase, Clock, DollarSign, Star } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const StatItem = ({ icon: Icon, label, value }: StatItemProps) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-bold">{value}</span>
  </div>
);

export function ProfileStats() {
  return (
    <div className="grid grid-cols-4 divide-x border-y py-4 dark:divide-white/10 dark:border-white/10">
      <StatItem icon={DollarSign} label="Earnings" value="$1K+" />
      <StatItem icon={Briefcase} label="Jobs" value="45" />
      <StatItem icon={Clock} label="Hours" value="120" />
      <StatItem icon={Star} label="Rating" value="4.9" />
    </div>
  );
}
