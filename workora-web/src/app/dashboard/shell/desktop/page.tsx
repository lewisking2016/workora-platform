import { DashboardShellVariantScreen } from '@/components/system/StatusScreens';
import { loadPublicSurfaceData } from '@/lib/public-surface';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

export default async function DesktopShellPage() {
  const [status, data] = await Promise.all([
    loadSystemStatus(),
    loadPublicSurfaceData(),
  ]);

  return (
    <DashboardShellVariantScreen
      mode="desktop"
      status={status}
      liveFeedCount={data.feed.length}
      liveTradeCount={data.trades.length}
    />
  );
}
