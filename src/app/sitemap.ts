import type { MetadataRoute } from 'next';

const siteUrl = 'https://www.pandosurgical.com';
const routes = [
  '',
  '/product',
  '/product/ent',
  '/team',
  '/news',
  '/company',
  '/investors',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/accessibility',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
