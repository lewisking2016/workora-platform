'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { 
  Heart, 
  ChatCircleDots, 
  UserCirclePlus, 
  Star,
  SealCheck,
  CaretRight
} from '@phosphor-icons/react';

interface Notification {
  id: number;
  type: string;
  actor: string;
  text: string;
  time: string;
  trade: string;
  verified: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    // In Phase 5 we'll connect this to the real notifications table
    setTimeout(() => {
      setNotifications([
        { id: 1, type: 'like', actor: 'James Kamau', text: 'liked your "Full House Wiring" gig', time: '2m', trade: 'Electrician', verified: true },
        { id: 2, type: 'comment', actor: 'Grace Wanjiku', text: 'commented: "Amazing work! Available for a consult?"', time: '1h', trade: 'Interior Designer', verified: true },
        { id: 3, type: 'follow', actor: 'Brian Kipchoge', text: 'started following you', time: '3h', trade: 'Welder', verified: false },
        { id: 4, type: 'rating', actor: 'Samuel Njoroge', text: 'gave you a 5-star rating', time: '5h', trade: 'Painter', verified: false },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={20} weight="fill" className="text-red-500" />;
      case 'comment': return <ChatCircleDots size={20} weight="fill" className="text-[#0066FF]" />;
      case 'follow': return <UserCirclePlus size={20} weight="fill" className="text-[#7000FF]" />;
      case 'rating': return <Star size={20} weight="fill" className="text-yellow-500" />;
      default: return <SealCheck size={20} weight="fill" className="text-[#0066FF]" />;
    }
  };

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto bg-white pt-8 px-[5%] lg:px-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-10 pb-32">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Activity</h1>
            <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase">Every interaction counts in the elite network.</p>
          </div>

          <div className="flex flex-col gap-1">
            {loading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="h-24 w-full bg-zinc-50 animate-pulse rounded-[24px] mb-2" />
              ))
            ) : notifications.length > 0 ? notifications.map((notif, i) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[32px] hover:bg-zinc-50 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black uppercase">
                       {notif.actor.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-zinc-50">
                       {getIcon(notif.type)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                       <p className="text-[14px] font-black text-zinc-950">
                         {notif.actor}
                         {notif.verified && <SealCheck size={14} weight="fill" className="text-[#0066FF] inline ml-1.5" />}
                       </p>
                       <span className="text-zinc-300 font-bold text-[13px]">&bull; {notif.time}</span>
                    </div>
                    <p className="text-[13px] font-medium text-zinc-500">
                      {notif.text}
                    </p>
                  </div>
                </div>
                
                <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-200 group-hover:text-zinc-950 transition-colors">
                  <CaretRight size={16} weight="bold" />
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-40 text-zinc-300 font-black uppercase tracking-widest text-xs">
                No new activity. Keep sharing your work!
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
