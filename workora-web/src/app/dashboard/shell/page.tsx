import { DashboardShellShowcase } from '@/components/system/StatusScreens';
import { loadPublicSurfaceData } from '@/lib/public-surface';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function DashboardShellPage() {
  const [status, data] = await Promise.all([
    loadSystemStatus(),
    loadPublicSurfaceData(),
  ]);

  return <DashboardShellShowcase status={status} liveFeedCount={data.feed.length} />;
}
