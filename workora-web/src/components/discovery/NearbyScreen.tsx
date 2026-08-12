'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin } from '@phosphor-icons/react';
import { ProfessionalCard, GigCard, Professional, Gig } from '@/components/discovery/cards';
import { apiFetch } from '@/lib/session';

export default function NearbyScreen() {
  const [pros, setPros] = useState<Professional[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [prosRes, gigsRes] = await Promise.all([
          apiFetch('/api/search?sort=location'),
          apiFetch('/api/gigs/feed?scope=nearby&limit=12'),
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

  const locations = [...new Set(pros.map(p => p.location || 'Kenya'))].slice(0, 8);

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 pb-24 lg:px-6 lg:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/explore" className="rounded-xl bg-white p-2 text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">Nodes explorer</p>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MapPin size={22} weight="fill" className="text-[#4F46E5]" /> Nearby
          </h1>
        </div>
      </div>

      {locations.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {locations.map(location => (
            <span key={location} className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]">
              {location}
            </span>
          ))}
        </div>
      )}

      <section className="mb-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Professionals near you</p>
          <h2 className="mt-1 text-xl font-black">Closest first</h2>
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
            No nearby professionals yet.
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Nearby content</p>
          <h2 className="mt-1 text-xl font-black">Work happening around you</h2>
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
            No nearby content yet.
          </div>
        )}
      </section>
    </div>
  );
}
