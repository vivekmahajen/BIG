import type { Metadata } from 'next';
import CountryHub from '@/components/CountryHub';
import { getCountryHub } from '@/lib/countryConfig';
import { notFound } from 'next/navigation';

const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';
const HUB = getCountryHub('IN')!;

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  if (!HUB) return { title: 'Not Found' };
  return {
    title: `${HUB.headline} | BIG`,
    description: `${HUB.subheadline}. ${HUB.marketStat}.`,
    keywords: [HUB.topKeyword, `startup ideas ${HUB.name}`, `business ideas ${HUB.name}`, `how to start a business in ${HUB.name}`, `best businesses in ${HUB.name} 2025`],
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/opportunity/in` },
    openGraph: {
      type: 'website',
      title: `${HUB.headline} | BIG`,
      description: `${HUB.subheadline}`,
      siteName: 'BIG — Business Opportunity Intelligence',
      locale: HUB.locale,
      images: [{ url: `${SITE_URL}/api/og?sector=in&city=${HUB.name}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: HUB.headline, description: HUB.subheadline },
  };
}

export default function CountryHubPage() {
  if (!HUB) notFound();
  return <CountryHub hub={HUB} />;
}
