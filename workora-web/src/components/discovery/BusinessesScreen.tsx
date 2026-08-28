'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase } from '@phosphor-icons/react';
import { BusinessCard, Business } from '@/components/discovery/cards';
import { apiFetch } from '@/lib/session';

export default function BusinessesScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await apiFetch('/api/profile/businesses');
        const data = await res.json();
        if (!mounted) return;
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const categories = [...new Set(businesses.map(b => b.category || 'Business'))].slice(0, 10);

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-4 pb-24 lg:px-6 lg:pb-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/explore" className="rounded-xl bg-white p-2 text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0066FF]">Nodes explorer</p>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Briefcase size={22} weight="fill" className="text-[#0066FF]" /> Businesses
          </h1>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <span key={category} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {category}
            </span>
          ))}
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Directory</p>
            <h2 className="mt-1 text-xl font-black">Live business profiles</h2>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0066FF] dark:bg-blue-950 dark:text-[#4D9FFF]">
            {businesses.length} businesses
          </span>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {businesses.map(business => <BusinessCard key={business.user_id} business={business} />)}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            No business profiles yet — businesses you follow will appear here.
          </div>
        )}
      </section>
    </div>
  );
}
