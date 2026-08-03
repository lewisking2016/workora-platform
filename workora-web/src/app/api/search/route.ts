import { proxyRequest } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const availability = searchParams.get('availability') || '';
  const sort = searchParams.get('sort') || '';
  const minTrust = searchParams.get('min_trust') || '';
  
  const path = `/profile/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&availability=${encodeURIComponent(availability)}&sort=${encodeURIComponent(sort)}&min_trust=${encodeURIComponent(minTrust)}`;
  return proxyRequest(path, request);
}
