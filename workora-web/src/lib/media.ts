const ALLOWED_MEDIA_HOSTS = new Set([
  'videos.pexels.com',
  'www.videos.pexels.com',
  'images.unsplash.com',
  'source.unsplash.com',
  'cdn.pixabay.com',
  'images.pexels.com',
]);

export function resolveMediaUrl(src?: string | null): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('/')) return src;

  try {
    const url = new URL(src);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return src;
    if (ALLOWED_MEDIA_HOSTS.has(url.hostname)) {
      return `/api/media?url=${encodeURIComponent(src)}`;
    }
    return src;
  } catch {
    return src;
  }
}

export const FALLBACK_MEDIA_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23111827'/><stop offset='1' stop-color='%23222d3e'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><circle cx='600' cy='320' r='120' fill='%23ffffff' fill-opacity='.08'/><rect x='360' y='500' width='480' height='60' rx='30' fill='%23ffffff' fill-opacity='.1'/><rect x='420' y='580' width='360' height='28' rx='14' fill='%23ffffff' fill-opacity='.08'/></svg>";
