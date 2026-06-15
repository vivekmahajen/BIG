import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city   = searchParams.get('city')   || '';
  const state  = searchParams.get('abbr')   || searchParams.get('state') || '';
  const sector = searchParams.get('sector') || '';
  const score  = searchParams.get('score')  || '';

  const sectorLabel = sector
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const gradeColor = score
    ? (parseFloat(score) >= 8.5 ? '#10b981' : parseFloat(score) >= 7 ? '#f59e0b' : '#94a3b8')
    : '#6366f1';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex', flexDirection: 'column', width: '1200px', height: '630px',
          background: 'linear-gradient(135deg, #07090d 0%, #0d1829 100%)',
          padding: '60px', fontFamily: 'sans-serif', position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <span style={{ fontSize: '32px', fontWeight: 900, color: '#f5b731' }}>BIG</span>
          <span style={{ fontSize: '13px', color: '#435870', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Business Opportunity Intelligence
          </span>
        </div>

        {/* Main heading */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: '52px', fontWeight: 800, color: '#eaf0f8', lineHeight: 1.1, marginBottom: '16px' }}>
            {sectorLabel}
          </div>
          {(city || state) && (
            <div style={{ fontSize: '28px', color: '#7db4e8', marginBottom: '40px' }}>
              {[city, state].filter(Boolean).join(', ')}
            </div>
          )}

          {/* Chips row */}
          <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
            {score && (
              <div style={{
                display: 'flex', flexDirection: 'column',
                background: '#111620', border: '1px solid #1a2535',
                borderRadius: '12px', padding: '20px 28px',
              }}>
                <span style={{ fontSize: '12px', color: '#435870', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  BIG Score
                </span>
                <span style={{ fontSize: '44px', fontWeight: 900, color: gradeColor }}>
                  {score}<span style={{ fontSize: '22px' }}>/10</span>
                </span>
              </div>
            )}
            <div style={{
              display: 'flex', flexDirection: 'column',
              background: '#111620', border: '1px solid #1a2535',
              borderRadius: '12px', padding: '20px 28px', flex: 1,
            }}>
              <span style={{ fontSize: '12px', color: '#435870', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Free Analysis Includes
              </span>
              <span style={{ fontSize: '18px', color: '#c2d0e0', lineHeight: 1.6 }}>
                Demand score · Startup costs · Revenue projections · Competitor intel
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ position: 'absolute', bottom: '40px', right: '60px', fontSize: '14px', color: '#435870' }}>
          big-seo.vercel.app · Generate your free analysis →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
