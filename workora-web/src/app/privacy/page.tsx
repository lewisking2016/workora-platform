import { PublicSurface } from '@/components/public/PublicSurface';
import { loadPublicSurfaceData } from '@/lib/public-surface';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const data = await loadPublicSurfaceData();
  return <PublicSurface variant="privacy" data={data} />;
}
