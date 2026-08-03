import { redirect } from 'next/navigation';
import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

type SavedScreen =
  | 'overview'
  | 'items'
  | 'posts'
  | 'reels'
  | 'profiles'
  | 'searches'
  | 'collections'
  | 'collection-detail'
  | 'create-collection'
  | 'edit-collection'
  | 'remove-confirmation'
  | 'empty';

const COPY: Record<SavedScreen, { title: string; description: string; primaryHref: string; primaryLabel: string; secondaryHref?: string; secondaryLabel?: string }> = {
  overview: { title: 'Saved overview', description: 'Review saved posts, profiles, searches, and collections from the live library.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved library' },
  items: { title: 'Saved items screen', description: 'See live saved posts and work items pulled from the backend.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved items' },
  posts: { title: 'Saved posts screen', description: 'Open saved post tiles and jump back to their live post detail pages.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved posts' },
  reels: { title: 'Saved reels screen', description: 'Saved reel assets are surfaced with their live thumbnails and playback links.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved reels' },
  profiles: { title: 'Saved profiles screen', description: 'Profile bookmarks can be surfaced here when the saved profile model is available.', primaryHref: '/dashboard/search', primaryLabel: 'Search profiles' },
  searches: { title: 'Saved searches screen', description: 'Search history and saved queries can be reviewed from the discovery system.', primaryHref: '/dashboard/search', primaryLabel: 'Open search' },
  collections: { title: 'Saved collections screen', description: 'View collections that were saved from the live discovery and library flows.', primaryHref: '/dashboard/saved?tab=collections', primaryLabel: 'Open collections' },
  'collection-detail': { title: 'Collection detail screen', description: 'Inspect a saved collection and its live contents.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved library' },
  'create-collection': { title: 'Create collection screen', description: 'Create a new live collection in the backend-backed library model.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved library' },
  'edit-collection': { title: 'Edit collection screen', description: 'Update collection metadata and cover assets from the live backend.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved library' },
  'remove-confirmation': { title: 'Remove from saved confirmation', description: 'Confirm removing an item from the live saved library.', primaryHref: '/dashboard/saved', primaryLabel: 'Back to saved' },
  empty: { title: 'Empty saved state', description: 'Your saved library is currently empty and ready for live items.', primaryHref: '/dashboard/explore', primaryLabel: 'Explore content' },
};

export default async function SavedScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const [{ screen }, status] = await Promise.all([params, loadSystemStatus()]);
  const key = screen as SavedScreen;
  const copy = COPY[key];

  if (!copy) redirect('/dashboard/saved');

  return (
    <SystemStateScreen
      title={copy.title}
      description={copy.description}
      primaryHref={copy.primaryHref}
      primaryLabel={copy.primaryLabel}
      secondaryHref={copy.secondaryHref || '/dashboard/saved'}
      secondaryLabel={copy.secondaryLabel || 'Back to saved'}
      status={status}
      variant="generic"
    />
  );
}
