import { STATES } from '@/lib/geography';
import { SECTORS } from '@/lib/sectors';
import { INTL_GEO } from '@/lib/intlGeography';

const COUNTRY_FLAGS: Record<string, string> = { CA: '🇨🇦', GB: '🇬🇧', AU: '🇦🇺' };

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          Business Opportunity Intelligence
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: 600, margin: '0 auto 32px' }}>
          AI-powered market analysis for every city, region, and industry sector worldwide.
        </p>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>🇺🇸 Explore by U.S. State</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '64px' }}>
        {STATES.map(state => (
          <a key={state.slug} href={`/opportunity/${state.slug}`}
            style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', textDecoration: 'none', color: '#111827', display: 'block' }}>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{state.abbr}</div>
            <div style={{ fontWeight: 600 }}>{state.name}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{state.cities.length} cities</div>
          </a>
        ))}
      </div>

      {Object.values(INTL_GEO).map(country => (
        <div key={country.code} style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
            {COUNTRY_FLAGS[country.code]} Explore by {country.name} Region
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {country.regions.map(region => (
              <a key={region.slug}
                href={`/opportunity/${country.code.toLowerCase()}/${region.slug}/${region.cities[0]?.slug ?? 'city'}/${SECTORS[0].id}`}
                style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', textDecoration: 'none', color: '#111827', display: 'block' }}>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{region.code}</div>
                <div style={{ fontWeight: 600 }}>{region.name}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{region.cities.length} cities</div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Explore by Sector</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {SECTORS.map(sector => (
          <a key={sector.id} href={`/opportunity/texas/dallas/${sector.id}`}
            style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', textDecoration: 'none', color: '#111827', display: 'block' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{sector.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{sector.label}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{sector.description.slice(0, 60)}...</div>
          </a>
        ))}
      </div>
    </div>
  );
}
