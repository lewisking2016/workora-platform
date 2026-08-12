'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ChatCircleDots, 
  UserCirclePlus, 
  Star,
  SealCheck,
  Bell,
  Gear
} from '@phosphor-icons/react';
import { fetchCurrentUser, apiFetch } from '@/lib/session';
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
  is_read?: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/api/notifications');
      const data = await res.json();

      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Notifications fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const openNotification = async (notif: Notification) => {
    // Mark as read, then route to the actual content the notification points at.
    await apiFetch(`/api/notifications/${notif.id}/read`, { method: 'PATCH' });
    if (notif.gig_id) {
      router.push(`/dashboard/post/${notif.gig_id}`);
    } else if (notif.actor_id && (notif.type === 'follow' || notif.type === 'rating')) {
      router.push(`/profile/${notif.actor_id}`);
    }
  };

  const markAllRead = async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error('Mark all read failed', e);
    }
  };

  const [followedBack, setFollowedBack] = useState<Set<string>>(new Set());

  const followBack = async (notif: Notification, event: React.MouseEvent) => {
    event.stopPropagation();
    if (followedBack.has(notif.id) || !notif.actor_id) return;
    try {
      const res = await apiFetch(`/api/profile/follow/${notif.actor_id}`, { method: 'POST' });
      const data = await res.json();
      if (data?.following) {
        setFollowedBack(prev => new Set(prev).add(notif.id));
      }
    } catch (e) {
      console.error('Follow back failed', e);
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
      fetchNotifications();
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
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Notifications</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="inline-flex h-10 items-center rounded-xl bg-zinc-100 px-3 text-xs font-black text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              Mark all read
            </button>
            <button
              onClick={() => router.push('/dashboard/notifications/settings')}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-100 px-3 text-xs font-black text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <Gear size={14} weight="bold" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-white pb-24 dark:bg-black lg:pb-0">
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
                  onClick={() => openNotification(notif)}
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
                    <button
                      onClick={(event) => followBack(notif, event)}
                      className={`h-8 px-4 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                        followedBack.has(notif.id)
                          ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900'
                          : 'bg-[#0066FF] text-white'
                      }`}
                    >
                      {followedBack.has(notif.id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                  {!notif.is_read && (
                    <div className="h-2 w-2 rounded-full bg-[#0066FF] shrink-0" />
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
