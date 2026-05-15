import { proxyRequest } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const path = `/gigs/${params.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  const path = `/gigs/${params.slug.join('/')}`;
  return proxyRequest(path, request);
}
