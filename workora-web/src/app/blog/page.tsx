import { loadPublicSurfaceData } from '@/lib/public-surface';
import { InsightsClient } from '@/components/public/InsightsClient';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const data = await loadPublicSurfaceData();
  return <InsightsClient data={data} />;
}
