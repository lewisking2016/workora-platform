'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase } from '@phosphor-icons/react';
import { ProfessionalCard, GigCard, Professional, Gig } from '@/components/discovery/cards';
import { apiFetch } from '@/lib/session';

export default function CategoryScreen({ trade }: { trade: string }) {
  const router = useRouter();
  const [pros, setPros] = useState<Professional[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [trades, setTrades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const category = trade === 'All' ? '' : encodeURIComponent(trade);
        const [prosRes, gigsRes, tradesRes] = await Promise.all([
          apiFetch(`/api/search?sort=trust&category=${category}`),
          apiFetch(`/api/gigs/feed?scope=trending&limit=12&trade=${category}`),
          apiFetch('/api/trades'),
        ]);
        const prosData = await prosRes.json();
        const gigsData = await gigsRes.json();
        const tradesData = await tradesRes.json();
        if (!mounted) return;
        setPros(Array.isArray(prosData) ? prosData : []);
        setGigs(Array.isArray(gigsData) ? gigsData : []);
        setTrades(Array.isArray(tradesData) ? tradesData : []);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [trade]);

  const relatedTrades = trades.filter(t => t !== trade).slice(0, 12);

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 pb-24 lg:px-6 lg:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/explore" className="rounded-xl bg-white p-2 text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">Nodes explorer · Categories</p>
          <h1 className="text-2xl font-black flex items-center gap-2 capitalize">
            <Briefcase size={22} weight="fill" className="text-[#4F46E5]" /> {trade === 'All' ? 'All trades' : trade}
          </h1>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => router.push('/dashboard/explore/categories/all')}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${trade === 'All' ? 'bg-[#0057FF] text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
        >
          All
        </button>
        {relatedTrades.map(item => (
          <button
            key={item}
            onClick={() => router.push(`/dashboard/explore/categories/${encodeURIComponent(item)}`)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${trade === item ? 'bg-[#0057FF] text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Professionals</p>
            <h2 className="mt-1 text-xl font-black capitalize">{trade === 'All' ? 'Everyone on the platform' : `${trade} professionals`}</h2>
          </div>
          <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]">
            {pros.length} profiles
          </span>
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
            No {trade} professionals yet — be the first to post your work.
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Trending work</p>
          <h2 className="mt-1 text-xl font-black capitalize">Top {trade} content</h2>
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
            No {trade} content yet — post a job to kick things off.
          </div>
        )}
      </section>
    </div>
  );
}
