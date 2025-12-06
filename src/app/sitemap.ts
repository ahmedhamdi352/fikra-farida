import { MetadataRoute } from 'next';
import { locales } from '../i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fikrafarida.com';
  const currentDate = new Date();

  // Base routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/blogs',
    '/collections',
    '/active-products',
  ];

  // Generate sitemap entries for each locale
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}

