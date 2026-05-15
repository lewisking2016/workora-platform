import { proxyRequest } from '@/lib/proxy';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = `/auth/${resolvedParams.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = `/auth/${resolvedParams.slug.join('/')}`;
  return proxyRequest(path, request);
}
