import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SECTORS, getSectorById } from '@/lib/sectors';
import { INTL_GEO, getRegionBySlug, getCityBySlug } from '@/lib/intlGeography';

export const revalidate = 86400;
export const dynamicParams = true;

const COUNTRY_CODE = 'IN';
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
  const title = `${sector.label} Business Opportunities in ${city.city}, ${region.name} | BIG India`;
  const description = `Discover the best ${sector.label.toLowerCase()} business ideas in ${city.city}, ${region.name}, India. AI-powered market analysis with INR projections, MUDRA/PMEGP scheme guidance, and NIC 2008 industry insights.`;
  const canonicalUrl = `${SITE_URL}/opportunity/in/${regionSlug}/${citySlug}/${sectorId}`;
  return {
    title,
    description,
    keywords: [
      `${sector.label.toLowerCase()} business ${city.city}`,
      `${sector.shortLabel.toLowerCase()} business ideas in ${city.city}`,
      `business opportunity ${city.city} ${region.name}`,
      `start ${sector.label.toLowerCase()} business India`,
      `${city.city} ${sector.label.toLowerCase()} startup cost INR`,
      `MUDRA loan ${sector.label.toLowerCase()} ${city.city}`,
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: { type: 'article', title, description, url: canonicalUrl, siteName: 'BIG — Business Opportunity Intelligence', locale: 'en_IN' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function INOpportunityPage({ params }: { params: Promise<{ region: string; city: string; sector: string }> }) {
  const { region: regionSlug, city: citySlug, sector: sectorId } = await params;
  const region = getRegionBySlug(COUNTRY_CODE, regionSlug);
  const city = getCityBySlug(COUNTRY_CODE, regionSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!region || !city || !sector) notFound();

  const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://big-eosin.vercel.app';
  const canonicalUrl = `${SITE_URL}/opportunity/in/${regionSlug}/${citySlug}/${sectorId}`;
  const ctaUrl = `${APP_URL}?country=IN&region=${region.code}&city=${encodeURIComponent(city.city)}&sector=${sector.apiId}`;

  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `${sector.label} Business Opportunities in ${city.city}, ${region.name}, India`,
    url: canonicalUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'India', item: `${SITE_URL}/opportunity/in` },
        { '@type': 'ListItem', position: 3, name: region.name, item: `${SITE_URL}/opportunity/in/${regionSlug}` },
        { '@type': 'ListItem', position: 4, name: city.city, item: `${SITE_URL}/opportunity/in/${regionSlug}/${citySlug}` },
        { '@type': 'ListItem', position: 5, name: sector.label, item: canonicalUrl },
      ],
    },
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, India?`,
        acceptedAnswer: { '@type': 'Answer', text: `${city.city}, ${region.name} offers a dynamic and growing market for ${sector.label} businesses. India's expanding middle class, digital adoption, and government MSME support schemes (MUDRA, PMEGP, Stand-Up India) make this an attractive time to enter. BIG's AI analyzes local demand, competition density, and financial viability to generate a BIG Score for this opportunity.` },
      },
      {
        '@type': 'Question',
        name: `How much does it cost to start a ${sector.label.toLowerCase()} business in ${city.city} in rupees?`,
        acceptedAnswer: { '@type': 'Answer', text: `Startup costs for ${sector.label} businesses in ${city.city} are in Indian Rupees (₹) and vary by business model and scale. MUDRA Shishu loans cover up to ₹50,000; MUDRA Kishore up to ₹5 lakh; MUDRA Tarun up to ₹10 lakh. BIG generates detailed INR projections including gross margin, time-to-profit, and Year 1 revenue estimates tailored to ${city.city}.` },
      },
      {
        '@type': 'Question',
        name: `What government schemes are available for ${sector.label.toLowerCase()} businesses in ${region.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Entrepreneurs in ${region.name} can access MUDRA loans (up to ₹10 lakh), PMEGP subsidy (15–35% of project cost), Stand-Up India (₹10L–₹1Cr for SC/ST and women), and GeM Portal for government procurement. Register on Udyam Portal for MSME benefits and GST registration for businesses above ₹20L turnover.` },
      },
      {
        '@type': 'Question',
        name: `What are the best ${sector.label.toLowerCase()} business ideas in ${city.city}?`,
        acceptedAnswer: { '@type': 'Answer', text: `BIG's AI generates specific ${sector.label} business ideas for ${city.city} based on local market data, city tier (metro/emerging/smaller city), and the ${region.name} economic profile. Each idea includes a 90-day launch plan, competitor analysis, and INR financial projections.` },
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
          <a href="/opportunity/in" style={{ color: '#6366f1' }}>India</a> {' → '}
          <a href={`/opportunity/in/${regionSlug}`} style={{ color: '#6366f1' }}>{region.name}</a> {' → '}
          <a href={`/opportunity/in/${regionSlug}/${citySlug}`} style={{ color: '#6366f1' }}>{city.city}</a> {' → '}
          {sector.label}
        </nav>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{sector.icon}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', lineHeight: 1.2 }}>
            Best {sector.label} Business Opportunities in {city.city}, {region.name}, India
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: 700 }}>
            AI-powered market analysis for {sector.label.toLowerCase()} businesses in {city.city}. INR projections, MUDRA/PMEGP scheme guidance, and competitor intelligence tailored to the Indian market.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)', borderRadius: '16px', padding: '32px', marginBottom: '40px', color: '#fff' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Get Your Free {sector.label} Analysis for {city.city}</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px' }}>Local market data · AI business ideas · Government schemes · ₹ INR projections</p>
          <a href={ctaUrl}
            style={{ display: 'inline-block', background: '#fff', color: '#dc2626', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
            Generate Free Analysis →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
          <div>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
                Common Questions About {sector.label} Businesses in {city.city}
              </h2>
              {[
                {
                  q: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, India?`,
                  a: `${city.city}, ${region.name} offers a dynamic and growing market for ${sector.label} businesses. India's expanding middle class, digital adoption, and government MSME support schemes (MUDRA, PMEGP, Stand-Up India) make this an attractive time to enter. BIG's AI analyzes local demand, competition density, and financial viability to generate a BIG Score for this opportunity.`
                },
                {
                  q: `How much capital do I need to start a ${sector.shortLabel} business in ${city.city}?`,
                  a: `Startup costs for ${sector.label} in ${city.city} vary by scale. MUDRA Shishu loans cover micro-businesses up to ₹50,000; MUDRA Kishore up to ₹5 lakh; MUDRA Tarun up to ₹10 lakh. PMEGP offers 15–35% subsidy on project costs. BIG generates exact INR projections with startup cost ranges specific to ${city.city}.`
                },
                {
                  q: `What government schemes support ${sector.label.toLowerCase()} businesses in ${region.name}?`,
                  a: `Key schemes for ${region.name}: MUDRA loans (up to ₹10 lakh, no collateral), PMEGP (up to ₹25L manufacturing / ₹10L services with 15–35% subsidy), Stand-Up India (₹10L–₹1Cr for SC/ST and women), and GeM Portal for government sales. Register on Udyam Portal for MSME benefits.`
                },
                {
                  q: `What are the best ${sector.label.toLowerCase()} business ideas in ${city.city}?`,
                  a: `BIG's AI generates specific ${sector.label} ideas for ${city.city} based on local demand signals, ${region.name}'s economic profile, and city-tier analysis. Each idea includes competitor intelligence, INR financial projections, and a 90-day action plan.`
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
                  <a key={s.id} href={`/opportunity/in/${regionSlug}/${citySlug}/${s.id}`}
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
                  <a key={c.slug} href={`/opportunity/in/${regionSlug}/${c.slug}/${sectorId}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
                    {sector.icon} {c.city}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Key Government Schemes</h3>
              {[
                { name: 'MUDRA Loan', desc: 'Up to ₹10 lakh, no collateral' },
                { name: 'PMEGP', desc: '15–35% subsidy up to ₹25L' },
                { name: 'Stand-Up India', desc: '₹10L–₹1Cr for SC/ST & women' },
                { name: 'GeM Portal', desc: 'Sell to government directly' },
              ].map(s => (
                <div key={s.name} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>About This Analysis</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                BIG uses AI to generate hyper-local market intelligence for Indian entrepreneurs.
                All financial projections are in Indian Rupees (₹) with lakh/crore formatting.
                Registration guidance follows Udyam Portal, MCA21, and GST processes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
