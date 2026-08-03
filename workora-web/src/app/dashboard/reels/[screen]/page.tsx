import { redirect } from 'next/navigation';
import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

type ReelScreen = 'upload-preview' | 'draft' | 'publish';

const COPY: Record<ReelScreen, { title: string; description: string }> = {
  'upload-preview': {
    title: 'Reel upload preview',
    description: 'Preview the reel against the live backend before publishing.',
  },
  draft: {
    title: 'Reel draft screen',
    description: 'Saved reel drafts are ready for editing and publishing.',
  },
  publish: {
    title: 'Reel publish screen',
    description: 'Publish the reel to the live feed when it is ready.',
  },
};

export default async function ReelScreenPage({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const [{ screen }, status] = await Promise.all([params, loadSystemStatus()]);
  const value = screen as ReelScreen;
  const copy = COPY[value];

  if (!copy) {
    redirect('/dashboard/reels');
  }

  return (
    <SystemStateScreen
      title={copy.title}
      description={copy.description}
      primaryHref="/dashboard/reels"
      primaryLabel="Open reels"
      secondaryHref="/dashboard/create/new"
      secondaryLabel="Create reel"
      status={status}
      variant="generic"
    />
  );
}
