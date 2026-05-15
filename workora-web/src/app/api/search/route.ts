import { proxyRequest } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const path = `/profile/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`;
  return proxyRequest(path, request);
}
