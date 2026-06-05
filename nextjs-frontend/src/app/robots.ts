import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || 'https://getbig.io';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
