'use client';

import { motion } from 'framer-motion';
import { Briefcase, ShieldCheck, Star, MessageSquare } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'hire',
    title: 'New Hiring Interest',
    description: 'A client in Lavington just viewed your "Burst Pipe" video.',
    time: '2 mins ago',
    icon: Briefcase,
    color: 'bg-brand/10 text-brand',
  },
  {
    id: '2',
    type: 'trust',
    title: 'Trust Score Increased',
    description: 'Your rating is now 4.85 after your last gig completion.',
    time: '1 hour ago',
    icon: Star,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    id: '3',
    type: 'verify',
    title: 'Verification Success',
    description: 'Your National ID has been verified. You now have the blue badge.',
    time: '5 hours ago',
    icon: ShieldCheck,
    color: 'bg-green-500/10 text-green-600',
  },
  {
    id: '4',
    type: 'message',
    title: 'Client Message',
    description: 'Jane asked: "Are you available for a site visit tomorrow?"',
    time: '1 day ago',
    icon: MessageSquare,
    color: 'bg-purple-500/10 text-purple-600',
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8 pt-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alerts</h1>
        <button className="text-xs font-bold text-brand uppercase tracking-widest">Mark All Read</button>
      </div>

      <div className="flex flex-col gap-4">
        {NOTIFICATIONS.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex gap-4 p-4 rounded-3xl bg-card border border-border/50 hover:border-brand/30 transition-all active:scale-[0.98]"
          >
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${note.color}`}>
              <note.icon className="h-6 w-6" />
            </div>
            
            <div className="flex flex-col gap-1 pr-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">{note.title}</h3>
                <span className="text-[10px] text-muted-foreground font-medium">{note.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {note.description}
              </p>
            </div>

            {i < 2 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-brand shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-6 rounded-3xl bg-brand/5 border border-brand/20 flex flex-col gap-2">
        <h3 className="font-bold text-sm text-brand">Stay Verified</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Regularly uploading proof of work keeps your trust score high and ensures you stay at the top of the discovery feed.
        </p>
      </div>
    </div>
  );
}
