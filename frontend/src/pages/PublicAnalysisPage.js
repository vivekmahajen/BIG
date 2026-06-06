import React, { useEffect, useState } from 'react';
import { getPublicAnalysis } from '../api/share';

// Read publicId from /analysis/:publicId
const pathParts = window.location.pathname.split('/');
const PUBLIC_ID = pathParts[2] || '';

// Read ?ref= from query string and persist
const searchParams = new URLSearchParams(window.location.search);
const REF_CODE = searchParams.get('ref');
if (REF_CODE) {
  sessionStorage.setItem('big_ref_code', REF_CODE);
  sessionStorage.setItem('big_ref_public_id', PUBLIC_ID);
}

function ScoreBadge({ score }) {
  if (!score) return null;
  const s = typeof score === 'string' ? parseFloat(score) : score;
  const color = s >= 9.0 ? '#10b981' : s >= 8.0 ? '#f59e0b' : '#94a3b8';
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 14px',
      borderRadius: 20,
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
      fontWeight: 700,
      fontSize: 16,
    }}>
      ★ {s.toFixed(1)} / 10
    </span>
  );
}

function MetricGrid({ data }) {
  const metrics = [
    ['TAM', data.tam],
    ['Startup Cost', data.startupCost],
    ['Gross Margin', data.grossMargin],
    ['Time to Profit', data.timeToProfit],
    ['Revenue Yr 1', data.revenueYr1],
    ['Revenue Yr 3', data.revenueYr3],
    data.ltv_cac ? ['LTV : CAC', data.ltv_cac] : null,
    data.paybackMonths ? ['Payback Period', `${data.paybackMonths} months`] : null,
    data.sam ? ['SAM', data.sam] : null,
    data.exitVal ? ['Exit Valuation', data.exitVal] : null,
  ].filter(Boolean).filter(([, v]) => v);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, margin: '20px 0' }}>
      {metrics.map(([label, value]) => (
        <div key={label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function GatedSection({ referralCode, publicId }) {
  const signupUrl = referralCode
    ? `/?signup=1&ref=${referralCode}`
    : '/?signup=1';

  return (
    <div style={{ position: 'relative', marginTop: 24 }}>
      {/* Blurred preview */}
      <div style={{
        filter: 'blur(4px)',
        pointerEvents: 'none',
        userSelect: 'none',
        padding: '24px',
        background: '#f8fafc',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 8, width: '70%' }} />
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 8, width: '90%' }} />
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 8, width: '60%' }} />
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 8, width: '80%' }} />
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 8, width: '50%' }} />
        <div style={{ height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 8, width: '75%' }} />
      </div>
      {/* CTA overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(248,250,252,0.85)',
        borderRadius: 12,
        padding: 24,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 24, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
          Full Report — Competitors, Risks & Launch Plan
        </h3>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20, maxWidth: 340 }}>
          Sign up free to see the full analysis including key risks, competitor breakdown, 90-day launch plan, and more.
        </p>
        <a
          href={signupUrl}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
          }}
        >
          Try BIG Free →
        </a>
        {referralCode && (
          <p style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
            You were referred — both you and the sharer earn 5 bonus credits on signup.
          </p>
        )}
      </div>
    </div>
  );
}

export default function PublicAnalysisPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!PUBLIC_ID) {
      setError('Invalid analysis link.');
      setLoading(false);
      return;
    }
    getPublicAnalysis(PUBLIC_ID)
      .then(result => {
        setData(result);
        const cardName = result.card_data?.name || 'Business Analysis';
        document.title = `${cardName} — BIG Business Intelligence`;
      })
      .catch(err => setError(err.message || 'Failed to load analysis'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#6366f1', letterSpacing: -1 }}>BIG</span>
          <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 8 }}>Business Opportunity Intelligence</span>
        </a>
        <a
          href="/"
          style={{
            padding: '8px 18px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          Try BIG Free →
        </a>
      </header>

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            Loading analysis…
          </div>
        )}

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 10,
            padding: '24px',
            color: '#991b1b',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <a href="/" style={{ marginTop: 16, display: 'inline-block', color: '#6366f1' }}>← Go to BIG</a>
          </div>
        )}

        {data && (() => {
          const card = data.card_data || {};
          const isIntl = !!(card.whyHereNow || card.revenueMonthly);
          const score = card.score ?? data.score;
          const sector = data.sector_label || data.sector || card.sector || '';
          const city = data.city || '';
          const stateName = data.state || '';
          const zip = data.zip || card.bestZip || '';

          // Normalize intl startupCost object → display string
          const sym = card.startupCost?.currency === 'GBP' ? '£' : card.startupCost?.currency === 'AUD' ? 'AUD $' : 'CAD $';
          const intlStartupCost = isIntl && card.startupCost
            ? `${sym}${Number(card.startupCost.low).toLocaleString()} – ${sym}${Number(card.startupCost.high).toLocaleString()}`
            : null;
          const intlRevenue = isIntl && card.revenueMonthly
            ? `${sym}${Number(card.revenueMonthly.low).toLocaleString()} – ${sym}${Number(card.revenueMonthly.high).toLocaleString()}/mo`
            : null;

          // Build a normalized card for MetricGrid (safe string values only)
          const metricCard = isIntl ? {
            startupCost: intlStartupCost,
            revenueYr1: intlRevenue,
          } : card;

          return (
            <div>
              {/* Hero card */}
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '28px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    {sector && (
                      <span style={{
                        display: 'inline-block',
                        background: '#ede9fe',
                        color: '#6366f1',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 8,
                      }}>
                        {sector}
                      </span>
                    )}
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                      {card.name || 'Business Analysis'}
                    </h1>
                    {card.model && <p style={{ color: '#64748b', margin: 0 }}>{card.model}</p>}
                    {(city || stateName || zip) && (
                      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                        📍 {[city, stateName, zip].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <ScoreBadge score={score} />
                    {card.exitVal && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected Exit</div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#10b981' }}>{card.exitVal}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Key Financials</h2>
                <MetricGrid data={metricCard} />
              </div>

              {/* Why it works (US) or Why here & now (Intl) */}
              {(card.whyItWorks || card.whyHereNow) && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>💡 {isIntl ? 'Why Here & Now' : 'Why It Makes Money'}</h2>
                  <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>{card.whyItWorks || card.whyHereNow}</p>
                </div>
              )}

              {/* Intl: What it is */}
              {isIntl && card.what && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>📋 The Business</h2>
                  <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>{card.what}</p>
                </div>
              )}

              {/* Intl: Getting started steps */}
              {isIntl && Array.isArray(card.steps) && card.steps.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>🚀 Getting Started</h2>
                  <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {card.steps.slice(0, 3).map((s, i) => (
                      <li key={i} style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Competitors */}
              {Array.isArray(card.topCompetitors) && card.topCompetitors.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>🏢 Competitors</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {card.topCompetitors.map(c => (
                      <span key={c} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Risks (visible) */}
              {Array.isArray(card.keyRisks) && card.keyRisks.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>⚠️ Key Risks</h2>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {card.keyRisks.map((r, i) => (
                      <li key={i} style={{ fontSize: 13, padding: '6px 12px 6px 28px', position: 'relative', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 6 }}>
                        <span style={{ position: 'absolute', left: 10, color: '#ef4444', fontWeight: 700 }}>!</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gated section — full report behind signup */}
              <GatedSection referralCode={data.referralCode} publicId={PUBLIC_ID} />
            </div>
          );
        })()}
      </main>

      <footer style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8', fontSize: 12, borderTop: '1px solid #e2e8f0', marginTop: 48 }}>
        BIG — Business Opportunity Intelligence &nbsp;|&nbsp; For informational purposes only. Not financial or investment advice.
      </footer>
    </div>
  );
}
