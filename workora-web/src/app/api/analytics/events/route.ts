import { proxyRequest } from '@/lib/proxy';

export async function POST(request: Request) {
  return proxyRequest('/analytics/events', request);
}
