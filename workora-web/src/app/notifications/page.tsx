'use client';

import { motion } from 'framer-motion';
import { 
  Rocket, ShieldCheck, Star, Zap, 
  TrendingUp, Bell, ChevronRight, Users, Sparkles 
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'launch',
    title: 'Workora is Live!',
    description: 'Welcome to the future of verified craftsmanship. Create your profile and start building your digital reputation today.',
    time: 'Just now',
    icon: Rocket,
    color: 'bg-blue-50 text-[#0066FF]',
    isNew: true,
  },
  {
    id: '2',
    type: 'trust',
    title: 'Trust Passport System Active',
    description: 'Our verification engine is now online. Get your skills, identity, and work history verified to unlock the blue badge.',
    time: '2 hours ago',
    icon: ShieldCheck,
    color: 'bg-emerald-50 text-emerald-600',
    isNew: true,
  },
  {
    id: '3',
    type: 'feature',
    title: 'Video Proof of Work',
    description: 'You can now upload high-definition videos showcasing your craftsmanship. Clients see your skill before they message you.',
    time: '5 hours ago',
    icon: Star,
    color: 'bg-amber-50 text-amber-600',
    isNew: true,
  },
  {
    id: '4',
    type: 'categories',
    title: '8 Skill Categories Available',
    description: 'From Construction and Automotive to Fashion and Logistics, find your craft and register under the right category.',
    time: '1 day ago',
    icon: Zap,
    color: 'bg-violet-50 text-violet-600',
    isNew: false,
  },
  {
    id: '5',
    type: 'growth',
    title: 'Early Adopters Welcome',
    description: 'Professionals who join during the launch phase will receive priority visibility in the discovery feed across all cities.',
    time: '1 day ago',
    icon: TrendingUp,
    color: 'bg-rose-50 text-rose-600',
    isNew: false,
  },
  {
    id: '6',
    type: 'community',
    title: 'Community Growing Fast',
    description: 'Workora is expanding across Nairobi, Mombasa, and Kisumu. More cities coming soon. Spread the word!',
    time: '2 days ago',
    icon: Users,
    color: 'bg-cyan-50 text-cyan-600',
    isNew: false,
  },
];

export default function NotificationsPage() {
  const newCount = NOTIFICATIONS.filter(n => n.isNew).length;

  return (
    <div className="flex flex-col gap-6 pt-24 lg:pt-28 pb-24 px-[5%] max-w-screen-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-zinc-950">Alerts</h1>
            {newCount > 0 && (
              <span className="h-6 min-w-6 px-2 rounded-full bg-zinc-950 text-white text-[10px] font-black flex items-center justify-center">
                {newCount}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-sm font-medium mt-1">Stay updated with Workora</p>
        </div>
        <button className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors relative">
          <Bell className="h-4 w-4 text-zinc-600" />
          {newCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#0066FF] border-2 border-white" />
          )}
        </button>
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {NOTIFICATIONS.map((note, i) => {
          const Icon = note.icon;
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group relative flex gap-4 p-4 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${note.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-zinc-950 truncate">{note.title}</h3>
                  <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap shrink-0">{note.time}</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {note.description}
                </p>
              </div>

              <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4 text-zinc-300" />
              </div>

              {note.isNew && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#0066FF]" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-2 p-5 rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-800 flex items-start gap-4"
      >
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-black text-sm text-white">Pro Tip</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Upload your first proof-of-work video to get 3x more visibility in the discovery feed. Clients trust what they can see.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
