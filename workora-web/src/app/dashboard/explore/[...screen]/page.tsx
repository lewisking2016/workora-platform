import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ExploreScreenPage({
  params,
}: {
  params: Promise<{ screen: string[] }>;
}) {
  const { screen } = await params;
  const [kind] = screen;

  if (kind === 'map') {
    redirect('/dashboard/explore?view=map');
  }

  if (kind === 'grid') {
    redirect('/dashboard/explore?view=grid');
  }

  if (kind === 'list') {
    redirect('/dashboard/explore?view=list');
  }

  if (kind === 'trust-ranked') {
    redirect('/dashboard/explore?sort=trust');
  }

  if (kind === 'nearby') {
    redirect('/dashboard/explore?sort=location');
  }

  redirect('/dashboard/explore');
}
