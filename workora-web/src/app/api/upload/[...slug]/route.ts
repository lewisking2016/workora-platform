import { proxyRequest } from '@/lib/proxy';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = `/upload/${resolvedParams.slug.join('/')}`;
  return proxyRequest(path, request);
}
