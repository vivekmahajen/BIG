import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SECTORS, getSectorById } from '@/lib/sectors';
import { INTL_GEO, getRegionBySlug, getCityBySlug } from '@/lib/intlGeography';

export const revalidate = 86400;
export const dynamicParams = true;

const COUNTRY_CODE = 'BR';
const country = INTL_GEO[COUNTRY_CODE];

export async function generateStaticParams() {
  const params: { region: string; city: string; sector: string }[] = [];
  for (const region of country.regions) {
    for (const city of region.cities) {
      for (const sector of SECTORS) {
        params.push({ region: region.slug, city: city.slug, sector: sector.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ region: string; city: string; sector: string }> }): Promise<Metadata> {
  const { region: regionSlug, city: citySlug, sector: sectorId } = await params;
  const region = getRegionBySlug(COUNTRY_CODE, regionSlug);
  const city = getCityBySlug(COUNTRY_CODE, regionSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!region || !city || !sector) return { title: 'Not Found', robots: { index: false } };

  const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';
  const title = `${sector.label} Business Opportunities in ${city.city}, ${region.name} (Brazil) | BIG`;
  const description = `Discover the best ${sector.label.toLowerCase()} business opportunities in ${city.city}, ${region.name}, Brazil. AI-powered market analysis, competitor intelligence, and financial projections in Brazil.`;
  const canonicalUrl = `${SITE_URL}/opportunity/br/${regionSlug}/${citySlug}/${sectorId}`;
  return {
    title,
    description,
    keywords: [
      `${sector.label.toLowerCase()} business ${city.city}`,
      `start a ${sector.shortLabel.toLowerCase()} business in ${city.city} Brazil`,
      `business opportunity ${city.city} ${region.name}`,
      `best businesses to start in ${city.city}`,
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: { type: 'article', title, description, url: canonicalUrl, siteName: 'BIG — Business Opportunity Intelligence', locale: 'pt_BR' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BROpportunityPage({ params }: { params: Promise<{ region: string; city: string; sector: string }> }) {
  const { region: regionSlug, city: citySlug, sector: sectorId } = await params;
  const region = getRegionBySlug(COUNTRY_CODE, regionSlug);
  const city = getCityBySlug(COUNTRY_CODE, regionSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!region || !city || !sector) notFound();

  const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://big-eosin.vercel.app';
  const canonicalUrl = `${SITE_URL}/opportunity/br/${regionSlug}/${citySlug}/${sectorId}`;
  const ctaUrl = `${APP_URL}?country=BR&region=${region.code}&city=${encodeURIComponent(city.city)}&sector=${sector.apiId}`;

  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `${sector.label} Business Opportunities in ${city.city}, ${region.name}, Brazil`,
    url: canonicalUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Brazil', item: `${SITE_URL}/opportunity/br` },
        { '@type': 'ListItem', position: 3, name: region.name, item: `${SITE_URL}/opportunity/br/${regionSlug}` },
        { '@type': 'ListItem', position: 4, name: city.city, item: `${SITE_URL}/opportunity/br/${regionSlug}/${citySlug}` },
        { '@type': 'ListItem', position: 5, name: sector.label, item: canonicalUrl },
      ],
    },
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${sector.label.toLowerCase()} a good business in ${city.city}, Brazil?`,
        acceptedAnswer: { '@type': 'Answer', text: `${city.city}, ${region.name} offers a dynamic market for ${sector.label} businesses. BIG's AI analyzes local market density, demand trends, and financial projections to generate a BIG Score for this specific opportunity in Brazil.` },
      },
      {
        '@type': 'Question',
        name: `How much does it cost to start a ${sector.label.toLowerCase()} business in ${city.city}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Startup costs for ${sector.label} businesses in ${city.city} are in ${country.symbol} and vary by business model. BIG provides detailed financial projections including startup cost ranges and time-to-profitability tailored to the Brazil market.` },
      },
    ],
  }];

  const otherSectors = SECTORS.filter(s => s.id !== sectorId).slice(0, 8);
  const otherCities = region.cities.filter(c => c.slug !== citySlug).slice(0, 6);

  return (
    <>
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <nav style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
          <a href="/" style={{ color: '#6366f1' }}>Home</a> {' → '}
          <a href="/opportunity/br" style={{ color: '#6366f1' }}>Brazil</a> {' → '}
          <a href={`/opportunity/br/${regionSlug}`} style={{ color: '#6366f1' }}>{region.name}</a> {' → '}
          <a href={`/opportunity/br/${regionSlug}/${citySlug}`} style={{ color: '#6366f1' }}>{city.city}</a> {' → '}
          {sector.label}
        </nav>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{sector.icon}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', lineHeight: 1.2 }}>
            Best {sector.label} Business Opportunities in {city.city}, {region.name} (Brazil)
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: 700 }}>
            AI-powered market analysis for {sector.label.toLowerCase()} businesses in {city.city}. Competitor intelligence, financial projections in {country.symbol}, and a 90-day launch plan tailored to Brazil.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px', padding: '32px', marginBottom: '40px', color: '#fff' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Get Your Free {sector.label} Analysis for {city.city}</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px' }}>Local market data · AI-generated insights · BIG Score · {country.symbol} projections</p>
          <a href={ctaUrl}
            style={{ display: 'inline-block', background: '#fff', color: '#6366f1', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
            Generate Free Analysis →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
          <div>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
                Common Questions About {sector.label} in {city.city}
              </h2>
              {[
                {
                  q: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, Brazil?`,
                  a: `${city.city}, ${region.name} offers specific market dynamics for ${sector.label} businesses. BIG's AI analyzes local business density, employment trends, and demand signals to generate a BIG Score (0–10) for this specific opportunity.`
                },
                {
                  q: `How competitive is the ${sector.shortLabel} market in ${city.city}?`,
                  a: `Competition in the ${city.city} ${sector.label} market is shaped by local demographics, existing business density, and demand trends unique to the Brazil market. BIG identifies specific gaps and underserved segments.`
                },
                {
                  q: `What does it cost to start a ${sector.label.toLowerCase()} business in ${city.city}?`,
                  a: `Startup costs in ${city.city} are denominated in ${country.symbol} and vary significantly by business model. BIG's financial projections provide specific ranges for startup costs, gross margins, time-to-profitability, and Year 1 revenue estimates.`
                },
                {
                  q: `What are the best ${sector.label.toLowerCase()} business opportunities in ${city.city}?`,
                  a: `BIG identifies the highest-scoring opportunities in the ${sector.label} sector for ${city.city} based on local market data. The analysis includes specific business concepts, competitor landscape, and a 90-day launch plan tailored to Brazil.`
                },
              ].map(({ q, a }) => (
                <details key={q} style={{ marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
                  <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}>{q}</summary>
                  <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px', lineHeight: 1.7 }}>{a}</p>
                </details>
              ))}
            </section>

            <section>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Other Opportunities in {city.city}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {otherSectors.map(s => (
                  <a key={s.id} href={`/opportunity/br/${regionSlug}/${citySlug}/${s.id}`}
                    style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', textDecoration: 'none', color: '#374151', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                    <span>{s.icon}</span><span>{s.label}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Other Cities in {region.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {otherCities.map(c => (
                  <a key={c.slug} href={`/opportunity/br/${regionSlug}/${c.slug}/${sectorId}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
                    {sector.icon} {c.city}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>About This Analysis</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                BIG combines local business density data, employment statistics, and market signals
                with Claude AI to generate hyper-local market intelligence for entrepreneurs in Brazil.
                All financial projections are in {country.symbol}.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
