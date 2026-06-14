import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SECTORS, getSectorById } from '@/lib/sectors';
import { INTL_GEO, getRegionBySlug, getCityBySlug } from '@/lib/intlGeography';

export const revalidate = 86400;
export const dynamicParams = true;

const COUNTRY_CODE = 'CN';
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
  const title = `${sector.label} Business Opportunities in ${city.city}, ${region.name} | BIG China`;
  const description = `Discover the best ${sector.label.toLowerCase()} business ideas in ${city.city}, ${region.name}, China. AI-powered market analysis with ¥ CNY projections, GB/T 4754 industry codes, WeChat/Douyin ecosystem insights, and GSXT registration guidance.`;
  const canonicalUrl = `${SITE_URL}/opportunity/cn/${regionSlug}/${citySlug}/${sectorId}`;
  return {
    title,
    description,
    keywords: [
      `${sector.label.toLowerCase()} business ${city.city}`,
      `${sector.shortLabel.toLowerCase()} business opportunities ${city.city} China`,
      `business opportunity ${city.city} ${region.name}`,
      `start ${sector.label.toLowerCase()} business China`,
      `${city.city} ${sector.label.toLowerCase()} startup cost CNY`,
      `WeChat ${sector.label.toLowerCase()} ${city.city}`,
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: { type: 'article', title, description, url: canonicalUrl, siteName: 'BIG — Business Opportunity Intelligence', locale: 'zh_CN' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CNOpportunityPage({ params }: { params: Promise<{ region: string; city: string; sector: string }> }) {
  const { region: regionSlug, city: citySlug, sector: sectorId } = await params;
  const region = getRegionBySlug(COUNTRY_CODE, regionSlug);
  const city = getCityBySlug(COUNTRY_CODE, regionSlug, citySlug);
  const sector = getSectorById(sectorId);
  if (!region || !city || !sector) notFound();

  const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://big-eosin.vercel.app';
  const canonicalUrl = `${SITE_URL}/opportunity/cn/${regionSlug}/${citySlug}/${sectorId}`;
  const ctaUrl = `${APP_URL}?country=CN&region=${region.code}&city=${encodeURIComponent(city.city)}&sector=${sector.apiId}`;

  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `${sector.label} Business Opportunities in ${city.city}, ${region.name}, China`,
    url: canonicalUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'China', item: `${SITE_URL}/opportunity/cn` },
        { '@type': 'ListItem', position: 3, name: region.name, item: `${SITE_URL}/opportunity/cn/${regionSlug}` },
        { '@type': 'ListItem', position: 4, name: city.city, item: `${SITE_URL}/opportunity/cn/${regionSlug}/${citySlug}` },
        { '@type': 'ListItem', position: 5, name: sector.label, item: canonicalUrl },
      ],
    },
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, China?`,
        acceptedAnswer: { '@type': 'Answer', text: `${city.city}, ${region.name} offers a dynamic market for ${sector.label} businesses. China's 1.4 billion consumers, massive digital ecosystem (WeChat, Douyin, Alipay), and government support for domestic entrepreneurs make this a compelling opportunity. BIG's AI analyzes local demand, competition density, and financial viability to generate a BIG Score for this specific market.` },
      },
      {
        '@type': 'Question',
        name: `How much does it cost to start a ${sector.label.toLowerCase()} business in ${city.city} in yuan?`,
        acceptedAnswer: { '@type': 'Answer', text: `Startup costs for ${sector.label} businesses in ${city.city} are denominated in Chinese Yuan (¥/人民币) and expressed in 万元 (10,000s) or 亿元 (100 million). Costs vary by city tier — Tier 1 cities like Shanghai and Beijing require higher capital than Tier 2/3 cities. BIG generates detailed CNY projections including gross margin, time-to-profit, and Year 1 revenue estimates tailored to ${city.city}.` },
      },
      {
        '@type': 'Question',
        name: `How do I register a ${sector.label.toLowerCase()} business in ${region.name}, China?`,
        acceptedAnswer: { '@type': 'Answer', text: `Business registration in ${region.name} is done through the National Enterprise Credit Information Publicity System (GSXT / 国家企业信用信息公示系统). Steps include: choose business structure (个体工商户 for sole proprietors, 有限责任公司 for LLCs), register with local Market Supervision Administration (市场监督管理局), obtain business license, and complete tax registration. Many cities offer one-stop registration at government service centers.` },
      },
      {
        '@type': 'Question',
        name: `What digital platforms should a ${sector.label.toLowerCase()} business use in ${city.city}?`,
        acceptedAnswer: { '@type': 'Answer', text: `China's digital ecosystem differs significantly from global platforms. Key channels for ${sector.label} businesses in ${city.city}: WeChat (微信) for customer relationships and mini-programs, Douyin (抖音/TikTok China) for short-video marketing, Meituan (美团) for local services and delivery, Taobao/Tmall/JD.com for e-commerce, and Xiaohongshu (小红书) for lifestyle/consumer brands. BIG's analysis includes platform-specific strategy recommendations.` },
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
          <a href="/opportunity/cn" style={{ color: '#6366f1' }}>China</a> {' → '}
          <a href={`/opportunity/cn/${regionSlug}`} style={{ color: '#6366f1' }}>{region.name}</a> {' → '}
          <a href={`/opportunity/cn/${regionSlug}/${citySlug}`} style={{ color: '#6366f1' }}>{city.city}</a> {' → '}
          {sector.label}
        </nav>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{sector.icon}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#111827', marginBottom: '12px', lineHeight: 1.2 }}>
            Best {sector.label} Business Opportunities in {city.city}, {region.name}, China
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: 700 }}>
            AI-powered market analysis for {sector.label.toLowerCase()} businesses in {city.city}. CNY (¥) financial projections, GB/T 4754 industry classification, WeChat/Douyin digital strategy, and GSXT registration guidance.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', borderRadius: '16px', padding: '32px', marginBottom: '40px', color: '#fff' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Get Your Free {sector.label} Analysis for {city.city}</h2>
          <p style={{ opacity: 0.9, marginBottom: '20px' }}>Local market data · AI business ideas · WeChat/Douyin strategy · ¥ CNY projections</p>
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
                  q: `Is ${sector.label.toLowerCase()} a good business to start in ${city.city}, China?`,
                  a: `${city.city}, ${region.name} offers a dynamic market for ${sector.label} businesses. China's 1.4 billion consumers, massive digital ecosystem (WeChat, Douyin, Alipay), and government support for domestic entrepreneurs make this a compelling opportunity. BIG's AI analyzes local demand, competition density, and financial viability to generate a BIG Score for this specific market.`
                },
                {
                  q: `How much capital do I need to start a ${sector.shortLabel} business in ${city.city}?`,
                  a: `Startup costs for ${sector.label} in ${city.city} are in Chinese Yuan (¥) and expressed in 万元 (tens of thousands) or 亿元 (100 millions). Costs vary significantly by city tier. BIG generates exact CNY projections with startup cost ranges, gross margin estimates, and time-to-profitability tailored to ${city.city}.`
                },
                {
                  q: `How do I register a ${sector.label.toLowerCase()} business in ${region.name}?`,
                  a: `Register through GSXT (国家企业信用信息公示系统). Choose your structure: 个体工商户 (sole proprietor) for small businesses, 有限责任公司 (LLC) for larger ventures. Apply at the local Market Supervision Administration (市场监督管理局) or via online portals. Most cities now offer same-day business license issuance.`
                },
                {
                  q: `Which digital platforms are essential for ${sector.label.toLowerCase()} businesses in ${city.city}?`,
                  a: `China's digital ecosystem requires platform-specific strategies. For ${sector.label} in ${city.city}: WeChat mini-programs for customer engagement, Douyin (short-video) for brand discovery, Meituan for local service businesses, and Taobao/JD.com for e-commerce. BIG's AI recommends the optimal channel mix for your specific ${sector.label} business.`
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
                  <a key={s.id} href={`/opportunity/cn/${regionSlug}/${citySlug}/${s.id}`}
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
                  <a key={c.slug} href={`/opportunity/cn/${regionSlug}/${c.slug}/${sectorId}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
                    {sector.icon} {c.city}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>China Digital Ecosystem</h3>
              {[
                { name: 'WeChat (微信)', desc: 'Mini-programs & customer CRM' },
                { name: 'Douyin (抖音)', desc: 'Short-video & live commerce' },
                { name: 'Meituan (美团)', desc: 'Local services & food delivery' },
                { name: 'Taobao/JD.com', desc: 'E-commerce marketplaces' },
                { name: 'Xiaohongshu (小红书)', desc: 'Lifestyle & consumer brands' },
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
                BIG uses AI to generate hyper-local market intelligence for entrepreneurs in China.
                All financial projections are in Chinese Yuan (¥/人民币) using 万元/亿元 notation.
                Industry classification follows GB/T 4754-2017. Registration guidance covers GSXT and local Market Supervision Administration processes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
