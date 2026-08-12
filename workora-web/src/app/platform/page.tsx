import { loadPublicSurfaceData } from '@/lib/public-surface';
import { PlatformClient } from '@/components/public/PlatformClient';

export const dynamic = 'force-dynamic';

export default async function PlatformPage() {
  const data = await loadPublicSurfaceData();
  return <PlatformClient data={data} />;
}
