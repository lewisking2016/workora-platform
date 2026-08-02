import { proxyRequest } from '@/lib/proxy';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return proxyRequest('/profile/trades', request);
}
