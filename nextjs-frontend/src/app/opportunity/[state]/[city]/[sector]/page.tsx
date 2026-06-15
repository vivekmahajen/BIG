import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SECTORS, getSectorById } from '@/lib/sectors';
import { STATES, getStateBySlug, getCityBySlug, getTopCityCombinations } from '@/lib/geography';
import { buildOpportunityMetadata, buildOpportunityJsonLd } from '@/lib/seo';
import RelatedPages from '@/components/RelatedPages';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const topCombos = getTopCityCombinations(1);
  return topCombos.flatMap(combo =>
    SECTORS.map(sector => ({ state: combo.state, city: combo.city, sector: sector.id }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string; sector: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, sector: sectorId } = await params;
  const state = getStateBySlug(stateSlug);
  const city = getCityBySlug(stateSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!state || !city || !sector) return { title: 'Not Found', robots: { index: false } };
  return buildOpportunityMetadata(state, city, sector);
}

export default async function OpportunityPage({ params }: { params: Promise<{ state: string; city: string; sector: string }> }) {
  const { state: stateSlug, city: citySlug, sector: sectorId } = await params;
  const state = getStateBySlug(stateSlug);
  const city = getCityBySlug(stateSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!state || !city || !sector) notFound();

  const jsonLd = buildOpportunityJsonLd(state, city, sector);
  const otherSectors = SECTORS.filter(s => s.id !== sectorId).slice(0, 8);
  const otherCities = state.cities.filter(c => c.slug !== citySlug).slice(0, 6);

  return (
    <>
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <nav style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
          <a href="/" style={{ color: '#6366f1' }}>Home</a> {' → '}
          <a href={`/opportunity/${state.slug}`} style={{ color: '#6366f1' }}>{state.name}</a> {' → '}
          <a href={`/opportunity/${state.slug}/${city.slug}`} style={{ color: '#6366f1' }}>{city.city}</a> {' → '}
          {sector.label}
        </nav>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{sector.icon}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', lineHeight: 1.2 }}>
            {sector.label} Business Opportunities in {city.city}, {state.abbr}
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: 700 }}>
            AI-powered market analysis, competitor intelligence, and financial projections for {sector.label.toLowerCase()} businesses in {city.city}, {state.name}.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px', padding: '32px', marginBottom: '40px', color: '#fff' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Get Your Free {sector.label} Analysis for {city.city}</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px' }}>Real Census data · BLS employment trends · AI-generated insights · BIG Score</p>
          <a href={`${process.env.NEXT_PUBLIC_APP_URL || '/'}?sector=${sector.apiId}&city=${encodeURIComponent(city.city)}&state=${state.abbr}`}
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
                  q: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}?`,
                  a: `${city.city}, ${state.name} offers specific market dynamics for ${sector.label} businesses. BIG's AI analyzes local business density from Census data, employment trends from BLS, and search demand signals to generate a BIG Score (0–10) for this specific opportunity.`
                },
                {
                  q: `How competitive is the ${sector.shortLabel} market in ${city.city}, ${state.name}?`,
                  a: `Competition in the ${city.city} ${sector.label} market is shaped by local demographics, existing business density, and demand trends. BIG's analysis identifies specific gaps and underserved segments where new entrants can establish a foothold.`
                },
                {
                  q: `What does it cost to start a ${sector.label.toLowerCase()} business in ${city.city}?`,
                  a: `Startup costs vary significantly by business model within the ${sector.label} sector. BIG's financial projections provide specific ranges for startup costs, gross margins, time-to-profitability, and Year 1 revenue estimates for ${city.city}.`
                },
                {
                  q: `What are the best ${sector.label.toLowerCase()} business opportunities near ${city.city}?`,
                  a: `BIG identifies the highest-scoring opportunities in the ${sector.label} sector for ${city.city} based on local market data. The analysis includes specific business concepts, competitor landscape, and a 90-day launch plan.`
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
                  <a key={s.id} href={`/opportunity/${state.slug}/${city.slug}/${s.id}`}
                    style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', textDecoration: 'none', color: '#374151', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                    <span>{s.icon}</span><span>{s.label}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Other Cities in {state.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {otherCities.map(c => (
                  <a key={c.slug} href={`/opportunity/${state.slug}/${c.slug}/${sectorId}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
                    {sector.icon} {c.city}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>About This Analysis</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                BIG combines U.S. Census Bureau business density data, BLS employment statistics,
                and Google Trends signals with Claude AI to generate hyper-local market intelligence
                for entrepreneurs.
              </p>
            </div>
          </aside>
        <RelatedPages
          countrySlug="us"
          stateSlug={state.slug}
          stateName={state.name}
          citySlug={city.slug}
          cityName={city.city}
          sectorId={sectorId}
          sectorLabel={sector.label}
          otherSectors={otherSectors}
          otherCities={otherCities}
        />
      </div>
    </>
  );
}
