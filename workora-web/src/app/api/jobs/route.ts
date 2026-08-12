import { proxyRequest } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyRequest('/jobs', request);
}

export async function POST(request: Request) {
  return proxyRequest('/jobs', request);
}
