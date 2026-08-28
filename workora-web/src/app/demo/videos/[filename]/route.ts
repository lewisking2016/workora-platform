import { NextRequest } from 'next/server';
import { getBackendBaseUrl } from '@/lib/backend-url';

/**
 * Proxies /demo/videos/:filename requests to the backend API.
 * This ensures demo videos work from both the web app and mobile app.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const backendUrl = getBackendBaseUrl();
  const url = `${backendUrl}/demo/videos/${encodeURIComponent(filename)}`;

  try {
    const range = request.headers.get('range');
    const headers: Record<string, string> = {};
    if (range) headers['range'] = range;

    const upstream = await fetch(url, { headers });

    if (!upstream.ok || !upstream.body) {
      return new Response('Demo video unavailable', { status: upstream.status || 502 });
    }

    const responseHeaders = new Headers();
    const passthrough = [
      'content-type', 'content-length', 'content-range',
      'accept-ranges', 'cache-control', 'etag', 'last-modified',
    ];

    passthrough.forEach((key) => {
      const value = upstream.headers.get(key);
      if (value) responseHeaders.set(key, value);
    });
    responseHeaders.set('cache-control', 'public, max-age=86400');

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Demo video proxy error:', error);
    return new Response('Demo video proxy error', { status: 500 });
  }
}
