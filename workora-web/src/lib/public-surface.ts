import { APP_CONFIG } from './config';
import { getBackendBaseUrl } from './backend-url';

export interface PublicTrade {
  id?: string;
  trade?: string | null;
}

export interface PublicGig {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  user_name?: string | null;
  handle?: string | null;
  trade?: string | null;
  verified?: boolean | null;
  likes_count?: number | null;
  comments_count?: number | null;
  view_count?: number | null;
}

export interface PublicSurfaceData {
  trades: string[];
  feed: PublicGig[];
  explore: PublicGig[];
  stats: {
    tradeCount: number;
    feedCount: number;
    exploreCount: number;
    verifiedCount: number;
  };
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loadPublicSurfaceData(): Promise<PublicSurfaceData> {
  const [trades, feed, explore] = await Promise.all([
    fetchJson<string[]>('/profile/trades'),
    fetchJson<PublicGig[]>('/gigs/feed?limit=8'),
    fetchJson<PublicGig[]>('/gigs/explore?limit=8'),
  ]);

  const safeTrades = Array.isArray(trades) ? trades.filter(Boolean) : [];
  const safeFeed = Array.isArray(feed) ? feed : [];
  const safeExplore = Array.isArray(explore) ? explore : [];

  return {
    trades: safeTrades,
    feed: safeFeed,
    explore: safeExplore,
    stats: {
      tradeCount: safeTrades.length,
      feedCount: safeFeed.length,
      exploreCount: safeExplore.length,
      verifiedCount: safeFeed.filter((item) => item.verified).length,
    },
  };
}

export const publicSurfaceTheme = {
  accent: '#0066FF',
  accentAlt: '#000000',
  surface: 'bg-white',
  panel: 'bg-zinc-50',
  border: 'border-black/5',
  text: 'text-black',
  muted: 'text-zinc-500',
  soft: 'text-zinc-400',
  chip: 'bg-white border border-black/10',
} as const;

export const APP_DEFAULTS = APP_CONFIG.defaults;
