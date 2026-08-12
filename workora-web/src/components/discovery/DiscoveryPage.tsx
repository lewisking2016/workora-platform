'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowClockwise,
  ArrowRight,
  Briefcase,
  ClockCounterClockwise,
  Compass,
  Heart,
  MapPin,
  MagnifyingGlass,
  SealCheck,
  SlidersHorizontal,
  Sparkle,
  Star,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { APP_CONFIG } from '@/lib/config';
import { apiFetch } from '@/lib/session';

type SurfaceMode = 'search' | 'explore';
type ViewMode = 'grid' | 'list' | 'map';
type SortMode = 'trust' | 'recent' | 'location' | 'availability';

interface Professional {
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

interface Gig {
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

interface Business {
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

interface CollectionCard {
  id: string;
  title: string;
  description?: string;
  kind?: string;
  is_public?: boolean;
  cover_url?: string;
  item_count?: number;
  save_count?: number;
}

interface DiscoveryPageProps {
  mode: SurfaceMode;
}

interface FilterState {
  trade: string;
  location: string;
  availability: string;
  minTrust: string;
}

const HISTORY_KEY = 'workora_search_history';

const VIEW_MODES: Array<{ key: ViewMode; label: string }> = [
  { key: 'grid', label: 'Grid' },
  { key: 'list', label: 'List' },
  { key: 'map', label: 'Map' },
];

const SORT_MODES: Array<{ key: SortMode; label: string; description: string }> = [
  { key: 'trust', label: 'Trust ranked', description: 'Highest trust score first' },
  { key: 'recent', label: 'Most recent', description: 'Latest updated professionals' },
  { key: 'location', label: 'Location', description: 'Closest matches first' },
  { key: 'availability', label: 'Availability', description: 'Open for new work' },
];

const AVAILABILITY_OPTIONS = ['available', 'busy', 'away'];

const formatScore = (value?: number | string) => Number(value || 0).toFixed(1);

function loadHistory() {
  if (typeof window === 'undefined') return [] as string[];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string').slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveHistory(value: string) {
  if (typeof window === 'undefined') return;
  const next = [value, ...loadHistory().filter(item => item.toLowerCase() !== value.toLowerCase())].slice(0, 8);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export default function DiscoveryPage({ mode }: DiscoveryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTrade = searchParams.get('trade') || 'All';
  const initialLocation = searchParams.get('location') || '';
  const initialAvailability = searchParams.get('availability') || 'All';
  const initialSort = (searchParams.get('sort') as SortMode) || 'trust';
  const initialViewParam = searchParams.get('view');

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    trade: initialTrade,
    location: initialLocation,
    availability: initialAvailability,
    minTrust: searchParams.get('min_trust') || '',
  });
  const [sort, setSort] = useState<SortMode>(initialSort);
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialViewParam === 'list' || initialViewParam === 'map' ? initialViewParam : 'grid'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [featuredPros, setFeaturedPros] = useState<Professional[]>([]);
  const [nearbyPros, setNearbyPros] = useState<Professional[]>([]);
  const [recommendedPros, setRecommendedPros] = useState<Professional[]>([]);
  const [trustPros, setTrustPros] = useState<Professional[]>([]);
  const [trendingGigList, setTrendingGigList] = useState<Gig[]>([]);
  const [nearbyGigList, setNearbyGigList] = useState<Gig[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [collections, setCollections] = useState<CollectionCard[]>([]);
  const [savedCollections, setSavedCollections] = useState<CollectionCard[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [history, setHistory] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedCompare, setSelectedCompare] = useState<Professional[]>([]);
  const activeTrade = filters.trade === 'All' ? '' : filters.trade;

  const persistQuery = (value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value.trim());
    if (filters.trade !== 'All') params.set('trade', filters.trade);
    if (filters.location) params.set('location', filters.location);
    if (filters.availability !== 'All') params.set('availability', filters.availability);
    if (filters.minTrust) params.set('min_trust', filters.minTrust);
    if (sort) params.set('sort', sort);
    router.replace(`${mode === 'search' ? '/dashboard/search' : '/dashboard/explore'}?${params.toString()}`, { scroll: false });
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/trades');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(['All', ...data]);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (filters.trade !== 'All') params.set('category', filters.trade);
      if (filters.location) params.set('location', filters.location);
      if (filters.availability !== 'All') params.set('availability', filters.availability);
      if (filters.minTrust) params.set('min_trust', filters.minTrust);
      params.set('sort', sort);

      let res = await apiFetch(`/api/search?${params.toString()}`);
      if (!res.ok) {
        res = await apiFetch(`/api/profile/search?${params.toString()}`);
      }
      if (!res.ok) {
        throw new Error(`Search failed with ${res.status}`);
      }
      const data = await res.json();
      setProfessionals(Array.isArray(data) ? data : []);
      if (query.trim().length >= 3) {
        void apiFetch('/api/profile/saved/searches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query.trim(),
            filters: {
              trade: filters.trade,
              location: filters.location,
              availability: filters.availability,
              min_trust: filters.minTrust,
              sort,
            },
          }),
        }).catch(() => undefined);
      }
    } catch (err) {
      console.error(err);
      setError('We could not load discovery results right now.');
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExploreSections = async () => {
    try {
      const [trustRes, recentRes, nearbyRes, trendRes, nearbyGigsRes, businessesRes, collectionsRes, savedCollectionsRes] = await Promise.all([
        apiFetch('/api/search?sort=trust'),
        apiFetch('/api/search?sort=recent'),
        apiFetch(`/api/search?sort=location${filters.location ? `&location=${encodeURIComponent(filters.location)}` : ''}`),
        apiFetch('/api/gigs/feed?scope=trending&limit=12'),
        apiFetch('/api/gigs/feed?scope=nearby&limit=12'),
        apiFetch('/api/profile/businesses'),
        apiFetch('/api/profile/collections'),
        apiFetch('/api/profile/collections?kind=saved'),
      ]);

      const loadJson = async (res: Response, fallbackUrl?: string) => {
        if (res.ok) return res.json();
        if (fallbackUrl) {
          const fb = await apiFetch(fallbackUrl);
          if (fb.ok) return fb.json();
        }
        return [];
      };

      const [trustData, recentData, nearbyData, trendData, nearbyGigsData, businessData, collectionsData, savedCollectionsData] = await Promise.all([
        loadJson(trustRes, '/api/profile/search?sort=trust'),
        loadJson(recentRes, '/api/profile/search?sort=recent'),
        loadJson(nearbyRes, '/api/profile/search?sort=location'),
        loadJson(trendRes, '/api/gigs/explore?limit=12'),
        loadJson(nearbyGigsRes, '/api/gigs/explore?limit=12'),
        loadJson(businessesRes),
        loadJson(collectionsRes),
        loadJson(savedCollectionsRes),
      ]);

      // If trending still empty, pull explore videos so the page always shows work
      let trending = Array.isArray(trendData) ? trendData.slice(0, 12) : [];
      if (trending.length === 0) {
        const exploreRes = await apiFetch('/api/gigs/explore?limit=12');
        if (exploreRes.ok) {
          const exploreData = await exploreRes.json();
          trending = Array.isArray(exploreData) ? exploreData.slice(0, 12) : [];
        }
      }

      setTrustPros(Array.isArray(trustData) ? trustData.slice(0, 8) : []);
      setFeaturedPros(Array.isArray(recentData) ? recentData.slice(0, 8) : []);
      setNearbyPros(Array.isArray(nearbyData) ? nearbyData.slice(0, 8) : []);
      setRecommendedPros(Array.isArray(trustData) ? trustData.slice(0, 8) : []);
      setTrendingGigList(trending);
      setNearbyGigList(Array.isArray(nearbyGigsData) && nearbyGigsData.length ? nearbyGigsData.slice(0, 12) : trending);
      setFeaturedBusinesses(Array.isArray(businessData) ? businessData.slice(0, 8) : []);
      setCollections(Array.isArray(collectionsData) ? collectionsData.slice(0, 8) : []);
      setSavedCollections(Array.isArray(savedCollectionsData) ? savedCollectionsData.slice(0, 8) : []);
    } catch (err) {
      console.error('Explore fetch failed', err);
    }
  };

  useEffect(() => {
    setHistory(loadHistory());
    void fetchCategories();
  }, []);

  // Debounce search: typing pauses 300ms before any API call fires, so we
  // don't hammer the backend (and saved-search table) on every keystroke.
  useEffect(() => {
    persistQuery(query);
    const timer = window.setTimeout(() => {
      if (query.trim()) {
        saveHistory(query.trim());
        setHistory(loadHistory());
      }
      void fetchProfessionals();
    }, 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters.trade, filters.location, filters.availability, filters.minTrust, sort]);

  useEffect(() => {
    if (mode !== 'explore') return;
    void fetchExploreSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, filters.location]);

  const compareAction = (person: Professional) => {
    setSelectedCompare(prev => {
      const exists = prev.find(item => item.id === person.id);
      if (exists) return prev.filter(item => item.id !== person.id);
      if (prev.length >= 2) return [prev[1], person];
      return [...prev, person];
    });
  };

  const displayedProfessionals = useMemo(() => {
    const data = [...professionals];
    return data.sort((a, b) => {
      if (sort === 'trust') return Number(b.trust_score || 0) - Number(a.trust_score || 0);
      if (sort === 'recent') return new Date(String(b.updated_at || 0)).getTime() - new Date(String(a.updated_at || 0)).getTime();
      if (sort === 'location') return String(a.location || '').localeCompare(String(b.location || ''));
      if (sort === 'availability') return String(a.availability_status || '').localeCompare(String(b.availability_status || ''));
      return 0;
    });
  }, [professionals, sort]);

  const compareReady = selectedCompare.length === 2;

  const groupedByLocation = useMemo(() => {
    return displayedProfessionals.reduce<Record<string, Professional[]>>((acc, person) => {
      const key = person.location || 'Kenya';
      acc[key] = acc[key] ? [...acc[key], person] : [person];
      return acc;
    }, {});
  }, [displayedProfessionals]);

  const renderProfessionalCard = (person: Professional) => {
    const selected = selectedCompare.some(item => item.id === person.id);
    return (
      <motion.div
        key={person.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950"
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.push(`/dashboard/messages`)}
            className="flex min-w-0 items-center gap-3 text-left"
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
                <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">{person.user_name}</p>
                {person.is_verified && <SealCheck size={14} weight="fill" className="text-[#4F46E5]" />}
              </div>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{person.trade}</p>
            </div>
          </button>
          <button
            onClick={() => compareAction(person)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              selected ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            {selected ? 'Selected' : 'Compare'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 p-4 text-xs text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
          <div>
            <p className="font-semibold text-zinc-950 dark:text-white">{formatScore(person.trust_score)}</p>
            <p>Trust</p>
          </div>
          <div>
            <p className="font-semibold text-zinc-950 dark:text-white">{person.location || 'Kenya'}</p>
            <p>Location</p>
          </div>
          <div>
            <p className="font-semibold text-zinc-950 dark:text-white capitalize">{person.availability_status || 'available'}</p>
            <p>Availability</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMapView = (items: Professional[]) => (
    <div className="grid gap-4 xl:grid-cols-2">
      {Object.entries(groupedByLocation).map(([location, people]) => (
        <div key={location} className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Location cluster</p>
              <h3 className="mt-1 text-lg font-black">{location}</h3>
            </div>
            <MapPin size={18} className="text-[#4F46E5]" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {people.slice(0, 4).map(person => (
              <button
                key={person.id}
                onClick={() => compareAction(person)}
                className="rounded-2xl bg-zinc-50 p-4 text-left dark:bg-zinc-900"
              >
                <p className="text-sm font-semibold">{person.user_name}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{person.trade}</p>
                <p className="mt-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Trust {formatScore(person.trust_score)} · {person.availability_status || 'available'}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="rounded-3xl bg-white p-6 text-sm text-zinc-500 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-400">
          No live locations match this set of filters.
        </div>
      )}
    </div>
  );

  const renderGigCard = (gig: Gig) => (
    <button
      key={gig.id}
      onClick={() => router.push(`/dashboard/post/${gig.id}`)}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-black"
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

  const renderBusinessCard = (business: Business) => (
    <div
      key={business.user_id}
      className="overflow-hidden rounded-xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950"
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
          <span>{business.location || 'Kenya'}</span>
          <span className="font-semibold text-zinc-950 dark:text-white">{formatScore(business.trust_score)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{business.bio || 'Live business profile from the backend.'}</p>
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{business.gig_count || 0} posts</span>
          <span>{business.pricing_from ? `From KSh ${Number(business.pricing_from).toLocaleString()}` : 'Pricing not set'}</span>
        </div>
      </div>
    </div>
  );

  const renderCollectionCard = (collection: CollectionCard) => (
    <button
      key={collection.id}
      onClick={() => router.push(`/dashboard/saved`)}
      className="overflow-hidden rounded-xl bg-white text-left shadow-sm shadow-black/5 dark:bg-zinc-950"
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
        <span>{collection.kind || 'collection'}</span>
        <span>{collection.item_count || 0} items</span>
      </div>
    </button>
  );

  const renderViewToggle = () => (
    <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900">
      {VIEW_MODES.map(modeItem => (
        <button
          key={modeItem.key}
          onClick={() => setViewMode(modeItem.key)}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
            viewMode === modeItem.key ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          {modeItem.label}
        </button>
      ))}
    </div>
  );

  const renderComparePanel = () => {
    if (!compareReady) return null;
    const [first, second] = selectedCompare;
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Compare results</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Two live results side by side.</p>
            </div>
            <button onClick={() => setSelectedCompare([])} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
              <X size={18} weight="bold" />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[first, second].map(person => (
              <div key={person.id} className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {person.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={person.avatar_url} alt={person.user_name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-black">{person.user_name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">{person.user_name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{person.trade}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-zinc-950 dark:text-white">{formatScore(person.trust_score)}</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Trust</p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-950 dark:text-white">{person.location || 'Kenya'}</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Location</p>
                  </div>
                  <div>
                    <p className="font-semibold capitalize text-zinc-950 dark:text-white">{person.availability_status || 'available'}</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Availability</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/messages`)}
                    className="flex-1 rounded-xl bg-zinc-950 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const headerTitle = mode === 'search' ? 'Search' : 'Nodes Explorer';
  const headerSubtitle = mode === 'search'
    ? 'Search by trade, location, trust, availability, or keyword.'
    : 'Browse live professionals and work by what people are doing now.';

  return (
    <div className="min-h-full bg-[#f7f8fc] text-zinc-950 dark:bg-black dark:text-white">
      <div className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl dark:border-zinc-900 dark:bg-black/90">
        <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                <Compass size={14} className="text-[#4F46E5]" />
                {headerTitle}
              </div>
              <h1 className="mt-1 text-[28px] font-black tracking-tight sm:text-[34px]">
                {mode === 'explore' ? (
                  <>
                    Explore the{' '}
                    <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">nodes</span>
                  </>
                ) : (
                  headerTitle
                )}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{headerSubtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {renderViewToggle()}
              <button
                onClick={() => setShowFilterModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <SlidersHorizontal size={16} />
                Filter
              </button>
              <button
                onClick={() => setShowSortModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <ArrowRight size={16} />
                Sort
              </button>
            </div>
          </div>

          <div className="mt-4 relative">
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && saveHistory(query.trim())}
              placeholder="Search professionals, trades, keywords, or locations"
              className="h-12 w-full rounded-2xl bg-zinc-100 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {history.length > 0 && (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Recent</span>
                {history.map(item => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    {item}
                  </button>
                ))}
              </>
            )}
            {categories.slice(0, 10).map(category => (
              <button
                key={category}
                onClick={() => setFilters(prev => ({ ...prev, trade: category }))}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                  activeTrade === category
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'bg-white text-zinc-600 shadow-sm shadow-black/5 dark:bg-zinc-950 dark:text-zinc-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        {loading ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(item => (
                <div key={item} className="h-40 rounded-2xl bg-white animate-pulse dark:bg-zinc-950" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(item => (
                <div key={item} className="h-64 rounded-2xl bg-white animate-pulse dark:bg-zinc-950" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm shadow-black/5 dark:bg-zinc-950">
            <WarningCircle size={40} weight="fill" className="text-[#4F46E5]" />
            <h2 className="mt-4 text-2xl font-black">Search error</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{error}</p>
            <button
              onClick={fetchProfessionals}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
            >
              <ArrowClockwise size={16} />
              Retry
            </button>
          </div>
        ) : mode === 'search' && !query.trim() && professionals.length === 0 ? (
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Search landing</p>
                  <h2 className="mt-1 text-2xl font-black">Search live professionals</h2>
                </div>
                <Sparkle size={22} className="text-[#4F46E5]" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Search by trade',
                  'Search by location',
                  'Search by trust',
                  'Search by availability',
                ].map(item => (
                  <div key={item} className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {item}
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 dark:bg-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Search suggestions</p>
              <div className="mt-4 space-y-3">
                {history.length > 0 ? history.slice(0, 4).map(item => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="flex w-full items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-left text-sm font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    <span>{item}</span>
                    <ClockCounterClockwise size={16} />
                  </button>
                )) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Your recent searches will appear here.</p>
                )}
              </div>
            </section>
          </div>
        ) : professionals.length === 0 && query.trim() ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm shadow-black/5 dark:bg-zinc-950">
            <MagnifyingGlass size={40} className="text-zinc-300 dark:text-zinc-700" />
            <h2 className="mt-4 text-2xl font-black">No results found</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
              Try a different keyword, loosen the trust filter, or clear the location filter.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setFilters({ trade: 'All', location: '', availability: 'All', minTrust: '' });
              }}
              className="mt-6 rounded-2xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
            >
              Reset search
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {mode === 'explore' && (
              <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 dark:bg-zinc-950 xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Explore home</p>
                      <h2 className="mt-1 text-2xl font-black">Discover what&apos;s active right now</h2>
                    </div>
                    <Compass size={24} className="text-[#4F46E5]" />
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { title: 'Featured pros', subtitle: 'Top live profiles by trust score' },
                      { title: 'Nearby professionals', subtitle: 'Filtered by your location' },
                      { title: 'Trending professionals', subtitle: 'Recent and highly trusted' },
                      { title: 'Recommended for you', subtitle: 'Matches from live search data' },
                    ].map(card => (
                      <div key={card.title} className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                        <p className="text-sm font-semibold text-zinc-950 dark:text-white">{card.title}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{card.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Collections</p>
                  <div className="mt-4 space-y-3">
                    <Link href="/dashboard/saved" className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium dark:bg-zinc-900">
                      <span>Saved collections</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link href="/dashboard/feed?scope=trending" className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium dark:bg-zinc-900">
                      <span>Trending results</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link href="/dashboard/feed?scope=nearby" className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium dark:bg-zinc-900">
                      <span>Nearby results</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {mode === 'explore' && (
              <section className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950 xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Featured businesses</p>
                      <h2 className="mt-1 text-xl font-black">Live business profiles</h2>
                    </div>
                    <Briefcase size={20} className="text-[#4F46E5]" />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {featuredBusinesses.length > 0 ? featuredBusinesses.slice(0, 4).map(renderBusinessCard) : (
                      <div className="rounded-xl bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                        No featured businesses matched yet.
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Collections</p>
                    <div className="mt-4 space-y-3">
                      {collections.length > 0 ? collections.slice(0, 3).map(collection => renderCollectionCard(collection)) : (
                        <div className="rounded-xl bg-zinc-50 px-4 py-5 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                          No public collections yet.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Saved collections</p>
                    <div className="mt-4 space-y-3">
                      {savedCollections.length > 0 ? savedCollections.slice(0, 3).map(collection => renderCollectionCard(collection)) : (
                        <div className="rounded-xl bg-zinc-50 px-4 py-5 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                          Your saved collections will appear here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {selectedCompare.length > 0 && (
              <section className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Compare results</p>
                    <h2 className="mt-1 text-xl font-black">Compare selected professionals</h2>
                  </div>
                  <button onClick={() => setSelectedCompare([])} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
                    <X size={16} weight="bold" />
                  </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {selectedCompare.map(person => (
                    <div key={person.id} className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          {person.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={person.avatar_url} alt={person.user_name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-black">{person.user_name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{person.user_name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{person.trade}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="font-semibold">{formatScore(person.trust_score)}</p>
                          <p className="text-zinc-500 dark:text-zinc-400">Trust</p>
                        </div>
                        <div>
                          <p className="font-semibold">{person.location || 'Kenya'}</p>
                          <p className="text-zinc-500 dark:text-zinc-400">Location</p>
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{person.availability_status || 'available'}</p>
                          <p className="text-zinc-500 dark:text-zinc-400">Availability</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="grid gap-4 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {mode === 'search' ? 'Search results' : 'Featured pros'}
                    </p>
                    <h2 className="mt-1 text-xl font-black">
                      {mode === 'search'
                        ? (query.trim() ? `Results for "${query}"` : 'People matching your filters')
                        : 'Live professionals from the backend'}
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{displayedProfessionals.length} profiles</p>
                </div>
                {viewMode === 'map' ? (
                  renderMapView(displayedProfessionals)
                ) : viewMode === 'list' ? (
                  <div className="space-y-4">
                    {displayedProfessionals.map(person => renderProfessionalCard(person))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {displayedProfessionals.map(person => renderProfessionalCard(person))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Search suggestions</p>
                  <div className="mt-4 space-y-2">
                    {history.length > 0 ? history.slice(0, 5).map(item => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="flex w-full items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-left text-sm font-medium dark:bg-zinc-900"
                      >
                        <span>{item}</span>
                        <ClockCounterClockwise size={16} />
                      </button>
                    )) : (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Searches you use will show up here.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Nearby professionals</p>
                  <div className="mt-4 space-y-3">
                    {(nearbyPros.length > 0 ? nearbyPros : featuredPros).slice(0, 4).map(person => (
                      <button
                        key={person.id}
                        onClick={() => router.push(`/profile/${person.user_id}`)}
                        className="flex w-full items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-left dark:bg-zinc-900"
                      >
                        <div>
                          <p className="text-sm font-semibold">{person.user_name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{person.location || 'Kenya'}</p>
                        </div>
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{formatScore(person.trust_score)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Trending content</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {trendingGigList.slice(0, 4).map(renderGigCard)}
                  </div>
                </div>
              </div>
            </section>

            {mode === 'explore' && (
              <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Trending professionals</p>
                      <h2 className="mt-1 text-xl font-black">Trust-ranked live professionals</h2>
                    </div>
                    <Star size={20} className="text-amber-500" />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {trustPros.slice(0, 4).map(renderProfessionalCard)}
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Nearby explore</p>
                      <h2 className="mt-1 text-xl font-black">Nearby professionals and content</h2>
                    </div>
                    <MapPin size={20} className="text-[#4F46E5]" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {nearbyGigList.slice(0, 4).map(gig => (
                      <button key={gig.id} onClick={() => router.push(`/dashboard/post/${gig.id}`)} className="flex w-full items-center gap-3 rounded-2xl bg-zinc-50 p-3 text-left dark:bg-zinc-900">
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-black">
                          <SafeMediaThumb src={gig.thumbnail_url || APP_CONFIG.defaults.thumbnail} alt={gig.description} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{gig.user_name}</p>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{gig.trade}</p>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{(gig.view_count || 0).toLocaleString()} views</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {mode === 'explore' && (
              <section className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Category browse</p>
                    <h2 className="mt-1 text-xl font-black">Browse by trade</h2>
                  </div>
                  <Briefcase size={20} className="text-[#4F46E5]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.slice(1, 14).map(category => (
                    <button
                      key={category}
                      onClick={() => setFilters(prev => ({ ...prev, trade: category }))}
                      className="rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {mode === 'explore' && (
              <section className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Recommended for you</p>
                    <h2 className="mt-1 text-xl font-black">Results ranked by trust</h2>
                  </div>
                  <Heart size={20} className="text-[#4F46E5]" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {recommendedPros.slice(0, 4).map(renderProfessionalCard)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md rounded-[24px] bg-white p-5 shadow-2xl dark:bg-zinc-950"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black">Filters</h3>
                <button onClick={() => setShowFilterModal(false)} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Trade</span>
                  <select
                    value={filters.trade}
                    onChange={(event) => setFilters(prev => ({ ...prev, trade: event.target.value }))}
                    className="h-12 w-full rounded-2xl bg-zinc-100 px-4 text-sm outline-none dark:bg-zinc-900 dark:text-white"
                  >
                    {categories.map(category => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Location</span>
                  <input
                    value={filters.location}
                    onChange={(event) => setFilters(prev => ({ ...prev, location: event.target.value }))}
                    placeholder="Nairobi, Mombasa, remote"
                    className="h-12 w-full rounded-2xl bg-zinc-100 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Availability</span>
                  <select
                    value={filters.availability}
                    onChange={(event) => setFilters(prev => ({ ...prev, availability: event.target.value }))}
                    className="h-12 w-full rounded-2xl bg-zinc-100 px-4 text-sm outline-none dark:bg-zinc-900 dark:text-white"
                  >
                    <option>All</option>
                    {AVAILABILITY_OPTIONS.map(item => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Minimum trust</span>
                  <input
                    value={filters.minTrust}
                    onChange={(event) => setFilters(prev => ({ ...prev, minTrust: event.target.value }))}
                    placeholder="0.0"
                    inputMode="decimal"
                    className="h-12 w-full rounded-2xl bg-zinc-100 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
                  />
                </label>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setFilters({ trade: 'All', location: '', availability: 'All', minTrust: '' })}
                  className="flex-1 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Clear filters
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 rounded-2xl bg-[#0057FF] px-4 py-3 text-sm font-semibold text-white"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSortModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md rounded-[24px] bg-white p-5 shadow-2xl dark:bg-zinc-950"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black">Sort</h3>
                <button onClick={() => setShowSortModal(false)} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="space-y-2">
                {SORT_MODES.map(option => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSort(option.key);
                      setShowSortModal(false);
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-left ${
                      sort === option.key ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="text-xs text-current/70">{option.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {renderComparePanel()}
    </div>
  );
}
