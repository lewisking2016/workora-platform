import { PublicSurface } from '@/components/public/PublicSurface';
import { loadPublicSurfaceData } from '@/lib/public-surface';

export const dynamic = 'force-dynamic';

export default async function SafetyPage() {
  const data = await loadPublicSurfaceData();
  return <PublicSurface variant="safety" data={data} />;
}
