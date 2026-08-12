'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, SpinnerGap, Check } from '@phosphor-icons/react';
import { apiFetch, fetchCurrentUser } from '@/lib/session';
import { motion } from 'framer-motion';

interface Prefs {
  likes_enabled: boolean;
  comments_enabled: boolean;
  follows_enabled: boolean;
  mentions_enabled: boolean;
  messages_enabled: boolean;
  trust_updates_enabled: boolean;
  system_enabled: boolean;
  push_enabled: boolean;
}

const SETTINGS: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: 'likes_enabled', label: 'Likes', desc: 'When someone likes your work' },
  { key: 'comments_enabled', label: 'Comments', desc: 'When someone comments on your work' },
  { key: 'follows_enabled', label: 'New followers', desc: 'When someone starts following you' },
  { key: 'mentions_enabled', label: 'Mentions', desc: 'When someone mentions you' },
  { key: 'messages_enabled', label: 'Messages', desc: 'When you receive a new message' },
  { key: 'trust_updates_enabled', label: 'Trust updates', desc: 'When your trust score changes' },
  { key: 'system_enabled', label: 'System updates', desc: 'Platform announcements and security alerts' },
  { key: 'push_enabled', label: 'Push notifications', desc: 'Browser and device push alerts' },
];

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [saved, setSaved] = useState(false);

  const fetchPrefs = async () => {
    try {
      const res = await apiFetch('/api/notifications/settings');
      const data = await res.json();
      if (data) setPrefs(data);
    } catch (e) {
      console.error('Fetch prefs failed', e);
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
      fetchPrefs();
    };
    bootstrap();
    return () => { mounted = false; };
  }, [router]);

  const toggle = async (key: keyof Prefs) => {
    if (!prefs) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSaved(false);
    try {
      await apiFetch('/api/notifications/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      // revert on failure
      setPrefs(prefs);
      console.error('Save prefs failed', e);
    }
  };

  if (!prefs) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white dark:bg-black">
        <SpinnerGap size={32} className="text-[#0066FF] animate-spin" weight="bold" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="Back">
          <ArrowLeft size={24} weight="regular" className="text-zinc-950 dark:text-white" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <Bell size={18} weight="fill" className="text-[#0066FF]" />
          <h1 className="text-lg font-black text-zinc-950 dark:text-white">Notification settings</h1>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-black text-emerald-500">
            <Check size={14} weight="bold" /> Saved
          </span>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 py-4">
        <p className="mb-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Choose what you want to be alerted about. Changes save instantly.
        </p>
        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
          {SETTINGS.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-950 dark:text-white">{s.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.desc}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs[s.key]}
                aria-label={s.label}
                onClick={() => toggle(s.key)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  prefs[s.key] ? 'bg-[#0066FF]' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${
                    prefs[s.key] ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
