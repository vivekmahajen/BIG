import type { MetadataRoute } from 'next';
import { STATES } from '@/lib/geography';
import { SECTORS } from '@/lib/sectors';
import { INTL_GEO } from '@/lib/intlGeography';

const SITE_URL = process.env.SITE_URL || 'https://getbig.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const urls: MetadataRoute.Sitemap = [];

  // Homepage
  urls.push({ url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 });

  // Country hub pages
  for (const slug of ['in', 'id', 'cn', 'br', 'de', 'ca', 'gb', 'au', 'mx']) {
    urls.push({ url: `${SITE_URL}/opportunity/${slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
  }

  // State pages — all 50
  for (const state of STATES) {
    urls.push({
      url: `${SITE_URL}/opportunity/${state.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    // Top 2 cities per state × all sectors in sitemap
    const topCities = state.cities.slice(0, 2);
    for (const city of topCities) {
      urls.push({
        url: `${SITE_URL}/opportunity/${state.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      for (const sector of SECTORS) {
        urls.push({
          url: `${SITE_URL}/opportunity/${state.slug}/${city.slug}/${sector.id}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.6,
        });
      }
    }
  }

  // International pages — all countries in INTL_GEO (CA, GB, AU, IN, DE, FR, etc. + CN, ID)
  for (const [countrySlug, country] of Object.entries(INTL_GEO)) {
    const cc = countrySlug.toLowerCase();
    for (const region of country.regions) {
      for (const city of region.cities) {
        for (const sector of SECTORS) {
          urls.push({
            url: `${SITE_URL}/opportunity/${cc}/${region.slug}/${city.slug}/${sector.id}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.6,
          });
        }
      }
    }
  }

  return urls;
}
