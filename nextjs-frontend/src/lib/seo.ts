import type { Metadata } from 'next';
import type { StateData, CityData } from './geography';
import type { SectorData } from './sectors';

const BASE_URL = process.env.SITE_URL || 'https://big-eosin.vercel.app';
const APP_NAME = 'BIG — Business Opportunity Intelligence';

export function buildOpportunityMetadata(state: StateData, city: CityData, sector: SectorData): Metadata {
  const title = `${sector.label} Business Opportunities in ${city.city}, ${state.abbr} | BIG`;
  const description = `Discover the best ${sector.label.toLowerCase()} business opportunities in ${city.city}, ${state.name}. AI-powered market analysis, competitor intelligence, financial projections, and a BIG Score. Free analysis.`;
  const canonicalUrl = `${BASE_URL}/opportunity/${state.slug}/${city.slug}/${sector.id}`;
  const ogImageUrl = `${BASE_URL}/api/og?state=${state.slug}&city=${encodeURIComponent(city.city)}&sector=${sector.id}&abbr=${state.abbr}`;
  return {
    title,
    description,
    keywords: [
      `${sector.label.toLowerCase()} business ${city.city}`,
      `start a ${sector.shortLabel.toLowerCase()} business in ${city.city}`,
      `business opportunity ${city.city} ${state.abbr}`,
      `best businesses to start in ${city.city}`,
    ],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1 } },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article', title, description, url: canonicalUrl, siteName: APP_NAME, locale: 'en_US',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${sector.label} opportunities in ${city.city}, ${state.name}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImageUrl] },
  };
}

export function buildOpportunityJsonLd(state: StateData, city: CityData, sector: SectorData, cardData?: Record<string, unknown>): object {
  const canonicalUrl = `${BASE_URL}/opportunity/${state.slug}/${city.slug}/${sector.id}`;
  const score = cardData?.overallScore as number | undefined;
  return [{
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `${sector.label} Business Opportunities in ${city.city}, ${state.name}`,
    url: canonicalUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: state.name, item: `${BASE_URL}/opportunity/${state.slug}` },
        { '@type': 'ListItem', position: 3, name: city.city, item: `${BASE_URL}/opportunity/${state.slug}/${city.slug}` },
        { '@type': 'ListItem', position: 4, name: sector.label, item: canonicalUrl },
      ],
    },
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${sector.label.toLowerCase()} a good business in ${city.city}, ${state.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `BIG's AI analysis scores ${sector.label} opportunities in ${city.city} based on local market density, demand trends, and financial projections.${score ? ` Current BIG Score: ${score}/10.` : ''}` },
      },
      {
        '@type': 'Question',
        name: `How much does it cost to start a ${sector.label.toLowerCase()} business in ${city.city}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Startup costs for ${sector.label} businesses in ${city.city} vary by model. BIG provides detailed financial projections including startup cost ranges and time-to-profitability for each opportunity type.` },
      },
    ],
  }];
}

export function buildStateMetadata(state: StateData): Metadata {
  return {
    title: `Business Opportunities in ${state.name} | BIG Intelligence`,
    description: `Explore AI-powered business opportunity analysis across all major cities in ${state.name}. Food & Beverage, Technology, Healthcare, Real Estate, and 12 more sectors.`,
    alternates: { canonical: `${BASE_URL}/opportunity/${state.slug}` },
  };
}
