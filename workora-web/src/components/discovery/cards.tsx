'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, MapPin, SealCheck, Star } from '@phosphor-icons/react';
import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { APP_CONFIG } from '@/lib/config';

export interface Professional {
  id: string;
  user_id: string;
  user_name: string;
  trade: string;
  location?: string;
  availability_status?: string;
  trust_score?: number | string;
  is_verified?: boolean;
  avatar_url?: string;
  bio?: string;
  updated_at?: string;
}

export interface Gig {
  id: string;
  user_name: string;
  trade: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  likes_count: number;
  comments_count: number;
  view_count: number;
  verified?: boolean;
  created_at?: string;
}

export interface Business {
  user_id: string;
  business_name: string;
  category?: string;
  location?: string;
  trust_score?: number | string;
  verified?: boolean;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  pricing_from?: number | string;
  gig_count?: number;
}

export interface CollectionCard {
  id: string;
  title: string;
  description?: string;
  kind?: string;
  is_public?: boolean;
  cover_url?: string;
  item_count?: number;
  save_count?: number;
}

export const formatScore = (value?: number | string) => Number(value || 0).toFixed(1);

export function ProfessionalCard({
  person,
  showCompare = false,
  onCompare,
}: {
  person: Professional;
  showCompare?: boolean;
  onCompare?: (person: Professional) => void;
}) {
  const router = useRouter();
  const selected = false;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => router.push(`/profile/${person.user_id}`)}
          className="group flex min-w-0 items-center gap-3 text-left"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            {person.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={person.avatar_url} alt={person.user_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-black text-zinc-500">{person.user_name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-zinc-950 group-hover:text-[#0066FF] dark:text-white dark:group-hover:text-[#4D9FFF]">
                {person.user_name}
              </p>
              {person.is_verified && <SealCheck size={14} weight="fill" className="text-[#0066FF]" />}
            </div>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{person.trade}</p>
          </div>
        </button>
        {showCompare && onCompare && (
          <button
            onClick={() => onCompare(person)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              selected ? 'bg-blue-50 text-[#0066FF] dark:bg-blue-950 dark:text-[#4D9FFF]' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            Compare
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 p-4 text-xs text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
        <div>
          <p className="font-semibold text-zinc-950 dark:text-white">{formatScore(person.trust_score)}</p>
          <p>Trust</p>
        </div>
        <div>
          <p className="truncate font-semibold text-zinc-950 dark:text-white">{person.location || 'Kenya'}</p>
          <p>Location</p>
        </div>
        <div>
          <p className="font-semibold capitalize text-zinc-950 dark:text-white">{person.availability_status || 'available'}</p>
          <p>Availability</p>
        </div>
      </div>
    </div>
  );
}

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      href={`/profile/${business.user_id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 transition-shadow hover:shadow-md hover:shadow-black/10 dark:bg-zinc-950"
    >
      <div className="relative h-28 bg-zinc-100 dark:bg-zinc-900">
        {business.cover_url ? (
          <SafeMediaThumb
            src={business.cover_url}
            alt={business.business_name}
            className="h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-black text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-white">
            {business.avatar_url ? (
              <SafeMediaThumb src={business.avatar_url} alt={business.business_name} className="h-full w-full object-cover" />
            ) : (
              business.business_name.charAt(0)
            )}
          </div>
          <div className="text-white">
            <p className="truncate text-sm font-semibold">{business.business_name}</p>
            <p className="truncate text-xs text-white/75">{business.category || 'Business'}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1"><MapPin size={12} /> {business.location || 'Kenya'}</span>
          <span className="flex items-center gap-1 font-semibold text-zinc-950 dark:text-white">
            <Star size={12} weight="fill" className="text-amber-500" /> {formatScore(business.trust_score)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{business.bio || 'Live business profile from the backend.'}</p>
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1"><Briefcase size={12} /> {business.gig_count || 0} posts</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {business.pricing_from ? `From KSh ${Number(business.pricing_from).toLocaleString()}` : 'Pricing on request'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CollectionCardView({ collection }: { collection: CollectionCard }) {
  return (
    <Link
      href={`/dashboard/saved`}
      className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm shadow-black/5 dark:bg-zinc-950"
    >
      <div className="relative h-28 bg-zinc-100 dark:bg-zinc-900">
        {collection.cover_url ? (
          <SafeMediaThumb src={collection.cover_url} alt={collection.title} className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="truncate text-sm font-semibold text-white">{collection.title}</p>
          <p className="truncate text-xs text-white/75">{collection.description || 'Collection items are live from the backend.'}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="capitalize">{collection.kind || 'collection'}</span>
        <span>{collection.item_count || 0} items</span>
      </div>
    </Link>
  );
}

export function GigCard({ gig }: { gig: Gig }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/dashboard/post/${gig.id}`)}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-black text-left"
    >
      <SafeMediaThumb
        src={gig.thumbnail_url || APP_CONFIG.defaults.thumbnail}
        alt={gig.description || gig.user_name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white">
        <p className="truncate text-sm font-semibold">{gig.user_name}</p>
        <p className="truncate text-[11px] text-white/80">{gig.trade}</p>
      </div>
      <div className="absolute right-2 top-2 flex items-center gap-2 text-white">
        <div className="rounded-full bg-black/35 px-2 py-1 text-[10px] font-semibold backdrop-blur-md">
          {(gig.view_count || 0).toLocaleString()} views
        </div>
      </div>
    </button>
  );
}

export function SectionLink({ href, title, subtitle }: { href: string; title: string; subtitle?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-left transition-colors hover:bg-blue-50 dark:bg-zinc-900 dark:hover:bg-[#1B1F3A]"
    >
      <div>
        <p className="text-sm font-semibold text-zinc-950 dark:text-white">{title}</p>
        {subtitle ? <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p> : null}
      </div>
      <ArrowRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0066FF]" />
    </Link>
  );
}
