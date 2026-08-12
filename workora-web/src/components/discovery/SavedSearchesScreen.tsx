'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookmarkSimple,
  ClockCounterClockwise,
  MagnifyingGlass,
  Play,
  Trash,
} from '@phosphor-icons/react';
import { apiFetch } from '@/lib/session';

interface SavedSearch {
  id: string;
  query: string;
  filters?: Record<string, unknown>;
  created_at?: string;
}

export default function SavedSearchesScreen() {
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuery, setNewQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await apiFetch('/api/profile/saved/searches');
      const data = await res.json();
      setSearches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const saveSearch = async () => {
    const query = newQuery.trim();
    if (!query) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/profile/saved/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters: {} }),
      });
      if (res.ok) {
        setNewQuery('');
        setMessage(`Saved "${query}" — run it anytime from here.`);
        await load();
      } else {
        setMessage('Could not save that search.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Could not save that search.');
    } finally {
      setSaving(false);
    }
  };

  const runSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.query) params.set('q', search.query);
    const filters = search.filters || {};
    if (filters.trade && filters.trade !== 'All') params.set('trade', String(filters.trade));
    if (filters.location) params.set('location', String(filters.location));
    if (filters.availability && filters.availability !== 'All') params.set('availability', String(filters.availability));
    if (filters.min_trust) params.set('min_trust', String(filters.min_trust));
    if (filters.sort) params.set('sort', String(filters.sort));
    router.push(`/dashboard/search?${params.toString()}`);
  };

  const deleteSearch = async (searchId: string) => {
    try {
      await apiFetch(`/api/profile/saved/searches/${searchId}`, { method: 'DELETE' });
      setSearches(prev => prev.filter(item => item.id !== searchId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-[800px] px-3 py-4 pb-24 lg:px-6 lg:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/explore" className="rounded-xl bg-white p-2 text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">Nodes explorer</p>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <BookmarkSimple size={22} weight="fill" className="text-[#4F46E5]" /> Saved searches
          </h1>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm shadow-black/5 dark:bg-zinc-950">
        <p className="mb-3 text-sm font-semibold">Save a search for later</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={newQuery}
              onChange={(event) => setNewQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void saveSearch(); }}
              placeholder="e.g. electrician in Kilimani"
              className="h-11 w-full rounded-xl bg-zinc-100 pl-9 pr-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => void saveSearch()}
            disabled={saving || !newQuery.trim()}
            className="rounded-xl bg-[#0057FF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
        {message && <p className="mt-3 text-xs font-medium text-[#059669]">{message}</p>}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Your searches</p>
            <h2 className="mt-1 text-xl font-black">{searches.length} saved</h2>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : searches.length > 0 ? (
          <div className="space-y-3">
            {searches.map(search => (
              <div key={search.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/5 dark:bg-zinc-950">
                <button
                  onClick={() => runSearch(search)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]">
                    <ClockCounterClockwise size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{search.query}</span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {search.created_at ? new Date(search.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => runSearch(search)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                  title="Run search"
                >
                  <Play size={16} weight="fill" />
                </button>
                <button
                  onClick={() => void deleteSearch(search.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:text-red-500 dark:bg-zinc-900 dark:text-zinc-400"
                  title="Delete search"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-zinc-950">
            <BookmarkSimple size={28} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm font-semibold">No saved searches yet</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Save a search above — or searches you type in Search get saved automatically.
            </p>
            <Link href="/dashboard/search" className="mt-4 inline-block rounded-xl bg-[#0057FF] px-4 py-2 text-sm font-semibold text-white">
              Go to Search
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
