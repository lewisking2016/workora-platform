import { proxyRequest } from '@/lib/proxy';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const resp = await proxyRequest('/analytics/events', request);

  // If backend doesn't implement analytics yet, swallow 404s so UX isn't noisy.
  if (resp.status === 404) {
    return NextResponse.json({}, { status: 204 });
  }

  return resp;
}
