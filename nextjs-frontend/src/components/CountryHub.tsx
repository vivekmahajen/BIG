import type { CountryHubConfig } from '@/lib/countryConfig';
import { SECTORS } from '@/lib/sectors';
import { INTL_GEO } from '@/lib/intlGeography';
import RelatedPages from '@/components/RelatedPages';

const SITE_URL = process.env.SITE_URL || 'https://big-seo.vercel.app';

interface CountryHubProps {
  hub: CountryHubConfig;
}

export default function CountryHub({ hub }: CountryHubProps) {
  const country = INTL_GEO[hub.code];
  const allRegions = country?.regions ?? [];
  // Top cities for browsing grid
  const topCities = allRegions.flatMap(r => r.cities.slice(0, 2).map(c => ({ ...c, regionSlug: r.slug, regionName: r.name }))).slice(0, 18);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
        <a href="/" style={{ color: '#6366f1' }}>Home</a> {' → '}
        <a href="/opportunity" style={{ color: '#6366f1' }}>Opportunities</a> {' → '}
        {hub.name}
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{hub.flag}</div>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#111827', marginBottom: '12px', lineHeight: 1.15 }}>
          {hub.headline}
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: 720, lineHeight: 1.6, marginBottom: '16px' }}>
          {hub.subheadline}
        </p>
        <p style={{ fontSize: '14px', color: '#9ca3af' }}>{hub.marketStat}</p>
      </div>

      {/* CTA Banner */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px', padding: '32px', marginBottom: '48px', color: '#fff' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Generate Your Free {hub.name} Business Analysis
        </h2>
        <p style={{ opacity: 0.9, marginBottom: '20px', fontSize: '15px' }}>
          Real market data · AI-generated insights in {hub.currency} · Startup cost breakdown · 90-day launch plan
        </p>
        <a
          href={hub.appUrl}
          style={{ display: 'inline-block', background: '#fff', color: '#6366f1', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}
        >
          Get Free Analysis in {hub.symbol} →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px' }}>
        <div>
          {/* Top Sectors */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
              Top Business Opportunities in {hub.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {hub.topSectors.map(s => (
                <div key={s.label} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{s.label}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{s.why}</p>
                  {topCities[0] && (
                    <a
                      href={`${SITE_URL}/opportunity/${hub.slug}/${topCities[0].regionSlug}/${topCities[0].slug}/${SECTORS[0]?.id}`}
                      style={{ display: 'inline-block', marginTop: '12px', fontSize: '12px', color: '#6366f1', textDecoration: 'none' }}
                    >
                      Analyse in {topCities[0].city} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Government Programs */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
              Government Support Programs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {hub.grantPrograms.map(g => (
                <div key={g.name} style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', background: '#ede9fe', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>{g.name}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
              Frequently Asked Questions
            </h2>
            {hub.faqs.map(({ q, a }) => (
              <details key={q} style={{ marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
                <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: '15px', color: '#111827' }}>{q}</summary>
                <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px', lineHeight: 1.7 }}>{a}</p>
              </details>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <aside>
          {/* Business Registration */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>📋 How to Register a Business in {hub.name}</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', lineHeight: 1.5 }}>
              Primary registration body: <strong>{hub.registrationBody}</strong>
            </p>
            <div style={{ marginBottom: '12px' }}>
              {hub.primaryStructures.map(s => (
                <div key={s} style={{ fontSize: '12px', padding: '6px 10px', background: '#f9fafb', borderRadius: '6px', marginBottom: '6px', color: '#374151' }}>
                  · {s}
                </div>
              ))}
            </div>
            <a href={hub.registrationUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
              Official registration portal →
            </a>
          </div>

          {/* Digital Platforms */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>🛒 Key Digital Platforms</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {hub.platforms.map(p => (
                <span key={p} style={{ fontSize: '12px', padding: '4px 10px', background: '#f3f4f6', borderRadius: '12px', color: '#374151' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Browse Cities */}
          {topCities.length > 0 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>🏙️ Browse by City</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {topCities.slice(0, 10).map(c => (
                  <a key={c.slug}
                    href={`/opportunity/${hub.slug}/${c.regionSlug}/${c.slug}/${SECTORS[0]?.id}`}
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>
                    → {c.city}, {c.regionName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Browse All Sectors */}
      <section style={{ marginBottom: '48px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Browse All Sectors in {hub.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {SECTORS.map(s => topCities[0] && (
            <a key={s.id}
              href={`/opportunity/${hub.slug}/${topCities[0].regionSlug}/${topCities[0].slug}/${s.id}`}
              style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', textDecoration: 'none', color: '#374151', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
              <span>{s.icon}</span><span>{s.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
