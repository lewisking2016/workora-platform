import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://workora.imeantech.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/business',
    '/careers',
    '/contact',
    '/explore',
    '/help',
    '/join',
    '/login',
    '/personal',
    '/platform',
    '/privacy',
    '/safety',
    '/terms',
    '/trust',
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
