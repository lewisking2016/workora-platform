'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ChatCircleDots, 
  UserCirclePlus, 
  Star,
  SealCheck,
  Bell
} from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  actor_id: string;
  actor_name: string;
  actor_trade?: string;
  actor_verified?: boolean;
  gig_id?: string;
  text: string;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const router = useRouter();

  const fetchNotifications = async (userId: string) => {
    try {
      // For now, we'll generate notifications from recent activity
      // In production, you'd have a dedicated notifications table
      const gigsRes = await fetch('/api/gigs/feed?page=1&limit=20');
      const gigsData = await gigsRes.json();
      
      if (Array.isArray(gigsData)) {
        const fakeNotifications: Notification[] = gigsData.slice(0, 10).map((gig, idx) => {
          const types = ['like', 'comment', 'follow', 'rating'];
          const type = types[idx % 4];
          let text = '';
          
          switch (type) {
            case 'like':
              text = 'liked your post';
              break;
            case 'comment':
              text = `commented: "${gig.description?.substring(0, 30)}..."`;
              break;
            case 'follow':
              text = 'started following you';
              break;
            case 'rating':
              text = 'gave you a 5-star rating';
              break;
          }
          
          return {
            id: `notif-${idx}`,
            type,
            actor_id: gig.user_id || gig.worker_id,
            actor_name: gig.user_name,
            actor_trade: gig.trade,
            actor_verified: gig.verified,
            gig_id: gig.id,
            text,
            created_at: gig.created_at
          };
        });
        
        setNotifications(fakeNotifications);
      }
    } catch (err) {
      console.error('Notifications fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);
      fetchNotifications(user.id);
    };
    bootstrap();
    return () => { mounted = false; };
  }, [router]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={18} weight="fill" className="text-red-500" />;
      case 'comment': return <ChatCircleDots size={18} weight="fill" className="text-[#0066FF]" />;
      case 'follow': return <UserCirclePlus size={18} weight="fill" className="text-[#7000FF]" />;
      case 'rating': return <Star size={18} weight="fill" className="text-yellow-500" />;
      default: return <Bell size={18} weight="fill" className="text-[#0066FF]" />;
    }
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white dark:bg-black">
      
      {/* Instagram-style Top Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3">
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Notifications</h1>
      </div>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
        <div className="max-w-[660px] mx-auto">
          
          {loading ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="px-4 py-3 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {notifications.map((notif, i) => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                  onClick={() => router.push('/dashboard/feed')}
                >
                  <div className="relative shrink-0">
                    <div className="h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-950 dark:text-white uppercase">
                      {notif.actor_name?.charAt(0) || '?'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-white dark:bg-black flex items-center justify-center border border-zinc-100 dark:border-zinc-900">
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-950 dark:text-white">
                      <span className="font-semibold">{notif.actor_name}</span>
                      {notif.actor_verified && <SealCheck size={12} weight="fill" className="text-[#0066FF] inline mx-1" />}
                      <span className="font-normal text-zinc-500 dark:text-zinc-400"> {notif.text}</span>
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>
                  
                  {notif.type === 'follow' && (
                    <button className="h-8 px-4 bg-[#0066FF] text-white rounded-lg text-xs font-semibold shrink-0">
                      Follow
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center text-center gap-3 px-4">
              <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Bell size={32} className="text-zinc-300 dark:text-zinc-700" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                No notifications yet
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
