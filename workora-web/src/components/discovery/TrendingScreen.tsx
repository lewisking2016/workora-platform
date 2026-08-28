'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Fire, TrendUp } from '@phosphor-icons/react';
import { ProfessionalCard, GigCard, Professional, Gig } from '@/components/discovery/cards';
import { apiFetch } from '@/lib/session';

export default function TrendingScreen() {
  const [pros, setPros] = useState<Professional[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [prosRes, gigsRes] = await Promise.all([
          apiFetch('/api/search?sort=trust'),
          apiFetch('/api/gigs/feed?scope=trending&limit=12'),
        ]);
        const prosData = await prosRes.json();
        const gigsData = await gigsRes.json();
        if (!mounted) return;
        setPros(Array.isArray(prosData) ? prosData : []);
        setGigs(Array.isArray(gigsData) ? gigsData : []);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 pb-24 lg:px-6 lg:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/explore" className="rounded-xl bg-white p-2 text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF]">Nodes explorer</p>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Fire size={22} weight="fill" className="text-orange-500" /> Trending
          </h1>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Live professionals</p>
            <h2 className="mt-1 text-xl font-black">Trust-ranked this week</h2>
          </div>
          <TrendUp size={20} className="text-[#0066FF]" />
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : pros.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pros.map(person => <ProfessionalCard key={person.id} person={person} />)}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            No trending professionals yet — check back soon.
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Trending content</p>
            <h2 className="mt-1 text-xl font-black">Most viewed work right now</h2>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0066FF] dark:bg-blue-950 dark:text-[#4D9FFF]">
            {gigs.length} posts
          </span>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : gigs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {gigs.map(gig => <GigCard key={gig.id} gig={gig} />)}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            No trending content yet.
          </div>
        )}
      </section>

      <p className="mt-8 text-center text-xs text-zinc-400">
        {pros.length} professionals ranked by trust score
      </p>
    </div>
  );
}
