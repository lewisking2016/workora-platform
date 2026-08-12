import { loadPublicSurfaceData } from '@/lib/public-surface';
import { BusinessClient } from '@/components/public/BusinessClient';

export const dynamic = 'force-dynamic';

export default async function BusinessPage() {
  const data = await loadPublicSurfaceData();
  return <BusinessClient data={data} />;
}
