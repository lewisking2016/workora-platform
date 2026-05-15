import { proxyRequest } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const path = `/profile/${params.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  const path = `/profile/${params.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function PATCH(request: Request, { params }: { params: { slug: string[] } }) {
  const path = `/profile/${params.slug.join('/')}`;
  return proxyRequest(path, request);
}

export async function DELETE(request: Request, { params }: { params: { slug: string[] } }) {
  const path = `/profile/${params.slug.join('/')}`;
  return proxyRequest(path, request);
}
