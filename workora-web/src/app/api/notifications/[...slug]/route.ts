import { proxyRequest } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(`/notifications/${resolvedParams.slug.join('/')}`, request);
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(`/notifications/${resolvedParams.slug.join('/')}`, request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  return proxyRequest(`/notifications/${resolvedParams.slug.join('/')}`, request);
}
