import { NextRequest } from 'next/server';

const ALLOWED_MEDIA_HOSTS = new Set([
  'videos.pexels.com',
  'www.videos.pexels.com',
  'images.unsplash.com',
  'source.unsplash.com',
  'cdn.pixabay.com',
  'images.pexels.com',
  'filesamples.com',
  'www.w3schools.com',
  'media.w3.org',
  'interactive-examples.mdn.mozilla.net',
]);

function isAllowedUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && ALLOWED_MEDIA_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url || !isAllowedUrl(url)) {
    return new Response('Invalid media url', { status: 400 });
  }

  const upstream = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      accept: request.headers.get('accept') || '*/*',
      range: request.headers.get('range') || '',
    },
    cache: 'no-store',
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Media unavailable', { status: 502 });
  }

  const headers = new Headers();
  const passthrough = [
    'content-type',
    'content-length',
    'content-range',
    'accept-ranges',
    'cache-control',
    'etag',
    'last-modified',
  ];

  passthrough.forEach((key) => {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  });
  headers.set('cache-control', 'public, max-age=3600');

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
