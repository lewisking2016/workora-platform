import { proxyRequest } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = `/messages/${resolvedParams.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = `/messages/${resolvedParams.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const path = `/messages/${resolvedParams.slug.join('/')}`;
  return proxyRequest(path, request);
}
