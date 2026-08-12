import { loadPublicSurfaceData } from '@/lib/public-surface';
import { PersonalClient } from '@/components/public/PersonalClient';

export const dynamic = 'force-dynamic';

export default async function PersonalPage() {
  const data = await loadPublicSurfaceData();
  return <PersonalClient data={data} />;
}
