import CategoryScreen from '@/components/discovery/CategoryScreen';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade } = await params;
  return <CategoryScreen trade={decodeURIComponent(trade)} />;
}
