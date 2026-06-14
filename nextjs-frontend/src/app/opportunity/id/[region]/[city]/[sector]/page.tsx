import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SECTORS, getSectorById } from '@/lib/sectors';
import { INTL_GEO, getRegionBySlug, getCityBySlug } from '@/lib/intlGeography';

export const revalidate = 86400;
export const dynamicParams = true;

const COUNTRY_CODE = 'ID';
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
  const title = `${sector.label} Business Opportunities in ${city.city}, ${region.name} | BIG Indonesia`;
  const description = `Discover the best ${sector.label.toLowerCase()} business ideas in ${city.city}, ${region.name}, Indonesia. AI-powered market analysis with Rp IDR projections, KBLI 2020 industry codes, KUR loan guidance, and OSS-RBA NIB registration support.`;
  const canonicalUrl = `${SITE_URL}/opportunity/id/${regionSlug}/${citySlug}/${sectorId}`;
  return {
    title,
    description,
    keywords: [
      `${sector.label.toLowerCase()} business ${city.city}`,
      `peluang usaha ${sector.shortLabel.toLowerCase()} ${city.city}`,
      `business opportunity ${city.city} ${region.name}`,
      `start ${sector.label.toLowerCase()} business Indonesia`,
      `${city.city} ${sector.label.toLowerCase()} modal usaha IDR`,
      `KUR ${sector.label.toLowerCase()} ${city.city}`,
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: { type: 'article', title, description, url: canonicalUrl, siteName: 'BIG — Business Opportunity Intelligence', locale: 'id_ID' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function IDOpportunityPage({ params }: { params: Promise<{ region: string; city: string; sector: string }> }) {
  const { region: regionSlug, city: citySlug, sector: sectorId } = await params;
  const region = getRegionBySlug(COUNTRY_CODE, regionSlug);
  const city = getCityBySlug(COUNTRY_CODE, regionSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!region || !city || !sector) notFound();

  const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://big-eosin.vercel.app';
  const canonicalUrl = `${SITE_URL}/opportunity/id/${regionSlug}/${citySlug}/${sectorId}`;
  const ctaUrl = `${APP_URL}?country=ID&region=${region.code}&city=${encodeURIComponent(city.city)}&sector=${sector.apiId}`;

  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `${sector.label} Business Opportunities in ${city.city}, ${region.name}, Indonesia`,
    url: canonicalUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Indonesia', item: `${SITE_URL}/opportunity/id` },
        { '@type': 'ListItem', position: 3, name: region.name, item: `${SITE_URL}/opportunity/id/${regionSlug}` },
        { '@type': 'ListItem', position: 4, name: city.city, item: `${SITE_URL}/opportunity/id/${regionSlug}/${citySlug}` },
        { '@type': 'ListItem', position: 5, name: sector.label, item: canonicalUrl },
      ],
    },
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, Indonesia?`,
        acceptedAnswer: { '@type': 'Answer', text: `${city.city}, ${region.name} offers a growing market for ${sector.label} businesses. Indonesia's 270+ million population, rising middle class, and booming digital economy (Tokopedia, Shopee, GoFood, TikTok Shop) create strong opportunities for new entrepreneurs. BIG's AI analyzes local demand, competition density, and financial viability to generate a BIG Score for this specific market.` },
      },
      {
        '@type': 'Question',
        name: `How much modal (capital) do I need to start a ${sector.label.toLowerCase()} business in ${city.city}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Startup costs (modal usaha) for ${sector.label} businesses in ${city.city} are in Indonesian Rupiah (Rp) and expressed in juta (millions) or miliar (billions). KUR (Kredit Usaha Rakyat) subsidized loans up to Rp 500 juta are available for UMKM with just 6% annual interest. BIG generates detailed Rp projections tailored to ${city.city}.` },
      },
      {
        '@type': 'Question',
        name: `How do I register a ${sector.label.toLowerCase()} business (NIB) in ${region.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Register your business through OSS-RBA (Online Single Submission - Risk Based Approach) at oss.go.id to obtain your NIB (Nomor Induk Berusaha / Business Registration Number). UMKM (Usaha Mikro Kecil Menengah) with annual turnover below Rp 50 juta can use the simplified Mikro registration. Also register for NPWP (tax ID) and PKP (VAT) if turnover exceeds Rp 4.8 miliar.` },
      },
      {
        '@type': 'Question',
        name: `What government programs support ${sector.label.toLowerCase()} businesses in ${region.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Key programs for UMKM in ${region.name}: KUR (Kredit Usaha Rakyat) — subsidized loans up to Rp 500 juta at 6% interest; BPUM (Bantuan Produktif Usaha Mikro) — grants for micro businesses; PNM Mekaar — women entrepreneur financing; and Tokopedia/Shopee UMKM programs for digital onboarding. Register on OSS-RBA to access all government incentives automatically.` },
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
          <a href="/opportunity/id" style={{ color: '#6366f1' }}>Indonesia</a> {' → '}
          <a href={`/opportunity/id/${regionSlug}`} style={{ color: '#6366f1' }}>{region.name}</a> {' → '}
          <a href={`/opportunity/id/${regionSlug}/${citySlug}`} style={{ color: '#6366f1' }}>{city.city}</a> {' → '}
          {sector.label}
        </nav>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{sector.icon}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', lineHeight: 1.2 }}>
            Best {sector.label} Business Opportunities in {city.city}, {region.name}, Indonesia
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: 700 }}>
            AI-powered market analysis for {sector.label.toLowerCase()} businesses in {city.city}. Rp IDR financial projections, KBLI 2020 industry codes, KUR loan eligibility, and OSS-RBA NIB registration guidance for Indonesia.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #dc2626, #b45309)', borderRadius: '16px', padding: '32px', marginBottom: '40px', color: '#fff' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Get Your Free {sector.label} Analysis for {city.city}</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px' }}>Local market data · AI business ideas · KUR loan guidance · Rp IDR projections</p>
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
                  q: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, Indonesia?`,
                  a: `${city.city}, ${region.name} offers a growing market for ${sector.label} businesses. Indonesia's 270+ million population, rising middle class, and digital economy (Tokopedia, Shopee, GoFood, TikTok Shop) create strong opportunities. BIG's AI analyzes local demand signals and generates a BIG Score for this specific opportunity.`
                },
                {
                  q: `Berapa modal untuk memulai bisnis ${sector.shortLabel.toLowerCase()} di ${city.city}?`,
                  a: `Modal usaha untuk ${sector.label} di ${city.city} dalam Rupiah (Rp) dan dinyatakan dalam juta atau miliar. KUR (Kredit Usaha Rakyat) menawarkan pinjaman bersubsidi hingga Rp 500 juta dengan bunga 6% per tahun. BIG menghasilkan proyeksi Rp yang akurat untuk ${city.city}.`
                },
                {
                  q: `How do I get a NIB (business license) for a ${sector.label.toLowerCase()} business in ${region.name}?`,
                  a: `Register at oss.go.id through OSS-RBA to get your NIB (Nomor Induk Berusaha). Micro businesses (turnover < Rp 300 juta) use the simplified Mikro tier. You'll also need NPWP (tax ID) from the local KPP (Kantor Pelayanan Pajak). Most registrations complete within 1-3 business days online.`
                },
                {
                  q: `What are the best ${sector.label.toLowerCase()} business ideas in ${city.city}?`,
                  a: `BIG's AI identifies high-scoring ${sector.label} opportunities for ${city.city} based on local market data, ${region.name}'s economic profile, and platform trends (Tokopedia, TikTok Shop, Gojek). Each idea includes a 90-day action plan, competitor analysis, and Rp financial projections.`
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
                  <a key={s.id} href={`/opportunity/id/${regionSlug}/${citySlug}/${s.id}`}
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
                  <a key={c.slug} href={`/opportunity/id/${regionSlug}/${c.slug}/${sectorId}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
                    {sector.icon} {c.city}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>UMKM Support Programs</h3>
              {[
                { name: 'KUR Mikro', desc: 'Up to Rp 100 juta, 6% interest' },
                { name: 'KUR Kecil', desc: 'Up to Rp 500 juta, 6% interest' },
                { name: 'BPUM Grant', desc: 'Bantuan Produktif Usaha Mikro' },
                { name: 'PNM Mekaar', desc: 'Women entrepreneur financing' },
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
                BIG uses AI to generate hyper-local market intelligence for Indonesian entrepreneurs (UMKM).
                All financial projections are in Indonesian Rupiah (Rp) using juta/miliar notation.
                Industry classification follows KBLI 2020. Registration guidance covers OSS-RBA NIB and NPWP processes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
