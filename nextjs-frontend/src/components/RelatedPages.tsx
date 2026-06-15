interface RelatedPagesProps {
  countrySlug: string;
  stateSlug: string;
  stateName: string;
  citySlug: string;
  cityName: string;
  sectorId: string;
  sectorLabel: string;
  otherSectors: Array<{ id: string; label: string; icon: string }>;
  otherCities: Array<{ slug: string; city: string }>;
}

export default function RelatedPages({
  countrySlug, stateSlug, stateName, citySlug, cityName,
  sectorId, sectorLabel, otherSectors, otherCities,
}: RelatedPagesProps) {
  const base = countrySlug === 'us'
    ? `/opportunity/${stateSlug}`
    : `/opportunity/${countrySlug}/${stateSlug}`;

  return (
    <section style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
        Explore More Opportunities
      </h2>

      {otherCities.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {sectorLabel} in Other {stateName} Cities
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherCities.map(c => (
              <a
                key={c.slug}
                href={`${base}/${c.slug}/${sectorId}`}
                style={{
                  padding: '6px 14px', background: '#f3f4f6', borderRadius: '20px',
                  fontSize: '13px', color: '#374151', textDecoration: 'none', border: '1px solid #e5e7eb',
                }}
              >
                {c.city}
              </a>
            ))}
          </div>
        </div>
      )}

      {otherSectors.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Other Sectors in {cityName}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherSectors.map(s => (
              <a
                key={s.id}
                href={`${base}/${citySlug}/${s.id}`}
                style={{
                  padding: '6px 14px', background: '#f3f4f6', borderRadius: '20px',
                  fontSize: '13px', color: '#374151', textDecoration: 'none', border: '1px solid #e5e7eb',
                }}
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Browse by Location
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <a href={base} style={{ padding: '6px 14px', background: '#ede9fe', color: '#7c3aed', borderRadius: '20px', fontSize: '13px', textDecoration: 'none' }}>
            All {stateName} opportunities
          </a>
          <a href={`${base}/${citySlug}`} style={{ padding: '6px 14px', background: '#ede9fe', color: '#7c3aed', borderRadius: '20px', fontSize: '13px', textDecoration: 'none' }}>
            All {cityName} sectors
          </a>
        </div>
      </div>
    </section>
  );
}
