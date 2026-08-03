import { redirect } from 'next/navigation';
import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadPublicSurfaceData } from '@/lib/public-surface';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

type FeedScreen = 'new' | 'following' | 'recommended' | 'trending' | 'nearby' | 'reels' | 'loading' | 'empty' | 'no-results' | 'content-unavailable' | 'video-playback-error' | 'media-loading-placeholder' | 'media-retry' | 'deleted' | 'removed' | 'restricted';

const STATE_COPY: Record<Exclude<FeedScreen, 'new' | 'following' | 'recommended' | 'trending' | 'nearby' | 'reels'>, { title: string; description: string; primary: string; secondary?: string }> = {
  loading: {
    title: 'Feed loading state',
    description: 'The live feed is still loading from the backend.',
    primary: '/dashboard/feed',
  },
  empty: {
    title: 'Feed empty state',
    description: 'There are no feed items yet from the live backend.',
    primary: '/dashboard/create/new',
    secondary: '/dashboard/feed',
  },
  'no-results': {
    title: 'Feed no results state',
    description: 'Your filters did not match any live content right now.',
    primary: '/dashboard/feed',
    secondary: '/dashboard/explore',
  },
  'content-unavailable': {
    title: 'Content unavailable state',
    description: 'This item is no longer available in the live feed.',
    primary: '/dashboard/feed',
    secondary: '/dashboard/search',
  },
  'video-playback-error': {
    title: 'Video playback error state',
    description: 'The media stream could not be played on this device.',
    primary: '/dashboard/feed',
    secondary: '/dashboard/reels',
  },
  'media-loading-placeholder': {
    title: 'Media loading placeholder',
    description: 'The media is still loading from the backend.',
    primary: '/dashboard/feed',
  },
  'media-retry': {
    title: 'Media retry state',
    description: 'Try loading this media again from the live backend.',
    primary: '/dashboard/feed',
    secondary: '/dashboard/reels',
  },
  deleted: {
    title: 'Deleted post state',
    description: 'This post was deleted and is no longer visible.',
    primary: '/dashboard/feed',
  },
  removed: {
    title: 'Removed media state',
    description: 'This media was removed from the platform.',
    primary: '/dashboard/feed',
  },
  restricted: {
    title: 'Restricted media state',
    description: 'Access to this media is limited by live safety rules.',
    primary: '/dashboard/feed',
    secondary: '/help',
  },
};

export default async function FeedScreenPage({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const [{ screen }, status, publicData] = await Promise.all([
    params,
    loadSystemStatus(),
    loadPublicSurfaceData(),
  ]);

  const value = screen as FeedScreen;

  if (value === 'new' || value === 'following' || value === 'recommended' || value === 'trending' || value === 'nearby' || value === 'reels') {
    redirect(`/dashboard/feed?scope=${value}`);
  }

  const copy = STATE_COPY[value as keyof typeof STATE_COPY];
  if (!copy) {
    redirect('/dashboard/feed');
  }

  return (
    <SystemStateScreen
      title={copy.title}
      description={`${copy.description} There are currently ${publicData.stats.feedCount.toLocaleString()} live feed items on the backend.`}
      primaryHref={copy.primary}
      primaryLabel="Open feed"
      secondaryHref={copy.secondary}
      secondaryLabel={copy.secondary ? 'Secondary action' : undefined}
      status={status}
      variant={value === 'loading' ? 'generic' : value === 'video-playback-error' ? 'generic' : value === 'restricted' ? 'generic' : 'generic'}
    />
  );
}
