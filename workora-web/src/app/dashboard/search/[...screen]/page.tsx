import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SearchScreenPage({
  params,
}: {
  params: Promise<{ screen: string[] }>;
}) {
  const { screen } = await params;
  const [kind, value] = screen;

  if (kind === 'trade' && value) {
    redirect(`/dashboard/search?trade=${encodeURIComponent(value)}`);
  }

  if (kind === 'location' && value) {
    redirect(`/dashboard/search?location=${encodeURIComponent(value)}`);
  }

  if (kind === 'keyword' && value) {
    redirect(`/dashboard/search?q=${encodeURIComponent(value)}`);
  }

  if (kind === 'category' && value) {
    redirect(`/dashboard/search?trade=${encodeURIComponent(value)}`);
  }

  if (kind === 'trust') {
    redirect('/dashboard/search?sort=trust');
  }

  if (kind === 'availability') {
    redirect('/dashboard/search?availability=available');
  }

  if (kind === 'compare') {
    redirect('/dashboard/search?sort=trust');
  }

  if (kind === 'nearby') {
    redirect('/dashboard/search?sort=location');
  }

  if (kind === 'trending') {
    redirect('/dashboard/search?sort=recent');
  }

  redirect('/dashboard/search');
}
