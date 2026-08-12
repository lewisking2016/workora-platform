'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  ChatCircleDots,
  UserCirclePlus,
  Star,
  SealCheck,
  Bell,
  SpinnerGap,
  ArrowRight
} from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';

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

// Reserved words that still render the polished system-state screens.
const RESERVED = new Set([
  'inbox', 'detail', 'push', 'permission', 'empty', 'read', 'unread',
  'filtered', 'like', 'comment', 'follow', 'mention', 'message', 'trust', 'system',
]);

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || '');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      if (RESERVED.has(slug)) {
        setLoading(false);
        return;
      }
      const user = await fetchCurrentUser();
      if (!mounted) return;
      if (!user) {
        router.replace('/login');
        return;
      }
      try {
        const res = await apiFetch(`/api/notifications/${slug}`);
        if (!res.ok) {
          setMissing(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (mounted) {
          setNotification(data);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setMissing(true);
          setLoading(false);
        }
      }
    };
    bootstrap();
    return () => { mounted = false; };
  }, [router, slug]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white dark:bg-black">
        <SpinnerGap size={32} className="text-[#0066FF] animate-spin" weight="bold" />
      </div>
    );
  }

  // Reserved words → simple fallback pointing back to the inbox.
  if (RESERVED.has(slug)) {
    return (
      <div className="h-full w-full bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-zinc-50 dark:bg-zinc-950 p-8 text-center">
          <Bell size={32} className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
          <h1 className="text-xl font-black text-zinc-950 dark:text-white">Notifications</h1>
          <p className="mt-2 text-sm text-zinc-500">Head to your inbox to see the latest activity.</p>
          <button
            onClick={() => router.push('/dashboard/notifications')}
            className="mt-6 w-full rounded-xl bg-[#0066FF] py-3 text-sm font-bold text-white"
          >
            Open notifications
          </button>
        </div>
      </div>
    );
  }

  if (missing || !notification) {
    return (
      <div className="h-full w-full bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-zinc-50 dark:bg-zinc-950 p-8 text-center">
          <Bell size={32} className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
          <h1 className="text-xl font-black text-zinc-950 dark:text-white">Notification not found</h1>
          <p className="mt-2 text-sm text-zinc-500">This notification may have been removed.</p>
          <button
            onClick={() => router.push('/dashboard/notifications')}
            className="mt-6 w-full rounded-xl bg-[#0066FF] py-3 text-sm font-bold text-white"
          >
            Back to notifications
          </button>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={22} weight="fill" className="text-red-500" />;
      case 'comment': return <ChatCircleDots size={22} weight="fill" className="text-[#0066FF]" />;
      case 'follow': return <UserCirclePlus size={22} weight="fill" className="text-[#7000FF]" />;
      case 'rating': return <Star size={22} weight="fill" className="text-yellow-500" />;
      default: return <Bell size={22} weight="fill" className="text-[#0066FF]" />;
    }
  };

  const openContent = () => {
    if (notification.gig_id) {
      router.push(`/dashboard/post/${notification.gig_id}`);
    } else if (notification.actor_id) {
      router.push(`/profile/${notification.actor_id}`);
    } else {
      router.push('/dashboard/notifications');
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-black">
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="Back">
          <ArrowLeft size={24} className="text-zinc-950 dark:text-white" />
        </button>
        <h1 className="flex-1 text-lg font-black text-zinc-950 dark:text-white">Notification</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="rounded-3xl border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-lg font-black text-zinc-950 dark:text-white uppercase">
            {notification.actor_name?.charAt(0) || '?'}
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800">
              {getIcon(notification.type)}
            </span>
          </div>

          <p className="text-center text-zinc-950 dark:text-white">
            <span className="font-black">{notification.actor_name}</span>
            {notification.actor_verified && <SealCheck size={14} weight="fill" className="text-[#0066FF] inline mx-1" />}
            <span className="font-medium text-zinc-500 dark:text-zinc-400"> {notification.text}</span>
          </p>
          {notification.actor_trade && notification.actor_trade !== 'Member' && (
            <p className="mt-1 text-center text-xs font-bold text-zinc-400">{notification.actor_trade}</p>
          )}
          <p className="mt-3 text-center text-xs text-zinc-400">
            {new Date(notification.created_at).toLocaleString('en-US', {
              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
            })}
          </p>

          <button
            onClick={openContent}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#7000FF] py-3.5 text-sm font-black text-white hover:brightness-110 transition-all"
          >
            {notification.gig_id ? 'Open post' : notification.actor_id ? 'View profile' : 'Open notifications'}
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

