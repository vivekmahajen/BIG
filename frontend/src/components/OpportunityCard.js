import { useState, useEffect } from 'react';
import { api } from '../api';
import styles from './OpportunityCard.module.css';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import BusinessPlan from './BusinessPlan';

const LEGEND = [
  { abbr: 'TAM', full: 'Total Addressable Market', desc: 'The entire revenue opportunity if 100% market share were captured.' },
  { abbr: 'SAM', full: 'Serviceable Addressable Market', desc: 'The portion of TAM your business model and geography can realistically target.' },
  { abbr: 'SOM', full: 'Serviceable Obtainable Market', desc: 'The realistic revenue share you can capture within the timeframe shown.' },
  { abbr: 'LTV', full: 'Lifetime Value', desc: 'Total net revenue expected from one customer over the full relationship.' },
  { abbr: 'CAC', full: 'Customer Acquisition Cost', desc: 'Total sales & marketing spend divided by number of new customers acquired.' },
  { abbr: 'LTV : CAC', full: 'LTV to CAC Ratio', desc: 'How many dollars of lifetime value are generated per dollar spent acquiring a customer. 3:1 is the minimum viable threshold; 10:1+ is excellent.' },
  { abbr: 'Gross Margin', full: 'Gross Profit Margin', desc: 'Revenue minus direct cost of goods/services, expressed as a percentage of revenue.' },
  { abbr: 'Payback Period', full: 'CAC Payback Period', desc: 'Months required to recover the cost of acquiring one customer through their gross profit contribution.' },
  { abbr: 'Exit Val', full: 'Projected Exit Valuation', desc: 'Estimated company value at acquisition or IPO, based on revenue/EBITDA multiples typical for the sector.' },
  { abbr: 'Best ZIP', full: 'Optimal Launch ZIP Code', desc: 'The single ZIP code with the highest concentration of target customers, lowest competitive density, and best infrastructure for launch.' },
];

const SCORE_GUIDE = [
  { range: '9.0 – 10.0', label: 'Highest Conviction', color: '#10b981', desc: 'Exceptional opportunity — strong margins, large market, clear whitespace, right timing.' },
  { range: '8.0 – 8.9', label: 'Strong Opportunity', color: '#f59e0b', desc: 'Very attractive — minor risks or constraints but overall compelling case.' },
  { range: '7.0 – 7.9', label: 'Viable Opportunity', color: '#94a3b8', desc: 'Solid fundamentals — requires more validation or has a narrower window.' },
];

const STATUS_META = {
  strong:  { label: 'Strong',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '●●●' },
  partial: { label: 'Partial', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '●●○' },
  weak:    { label: 'Weak',    color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',icon: '●○○' },
  none:    { label: 'None',    color: '#475569', bg: 'rgba(71,85,105,0.1)',   icon: '○○○' },
};

function ScoreBadge({ score }) {
  if (!score) return null;
  const color = score >= 9.0 ? '#10b981' : score >= 8.0 ? '#f59e0b' : '#94a3b8';
  return (
    <span className={styles.score} style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
      ★ {score.toFixed(1)} / 10
    </span>
  );
}

function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.legendHeader}>
        <span className={styles.legendIcon}>📖</span>
        <h3>Report Glossary</h3>
      </div>
      <div className={styles.legendGrid}>
        {LEGEND.map(item => (
          <div key={item.abbr} className={styles.legendItem}>
            <div className={styles.legendAbbr}>{item.abbr}</div>
            <div className={styles.legendBody}>
              <div className={styles.legendFull}>{item.full}</div>
              <div className={styles.legendDesc}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.legendScoreTitle}>Opportunity Score Guide</div>
      <div className={styles.legendScores}>
        {SCORE_GUIDE.map(s => (
          <div key={s.range} className={styles.legendScore}>
            <span className={styles.legendScoreBadge} style={{ background: `${s.color}22`, color: s.color, borderColor: `${s.color}44` }}>
              {s.range}
            </span>
            <div>
              <div className={styles.legendScoreLabel}>{s.label}</div>
              <div className={styles.legendDesc}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function listHtml(items, color = '#6366f1', icon = '→') {
  if (!items || !items.length) return '<p style="color:#94a3b8;font-size:12px;">None listed.</p>';
  return `<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;">
    ${items.map(i => `<li style="font-size:12px;padding:6px 12px 6px 28px;position:relative;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;">
      <span style="position:absolute;left:10px;color:${color};font-weight:700;">${icon}</span>${i}
    </li>`).join('')}
  </ul>`;
}

function handlePrint(o, zip, sector) {
  const w = window.open('', '_blank');
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const metrics = [
    ['TAM', o.tam], ['Startup Cost', o.startupCost], ['Gross Margin', o.grossMargin],
    ['Time to Profit', o.timeToProfit], ['Revenue Yr 1', o.revenueYr1], ['Revenue Yr 3', o.revenueYr3],
    ...(o.ltv_cac ? [['LTV : CAC', o.ltv_cac]] : []),
    ...(o.paybackMonths ? [['Payback Period', `${o.paybackMonths} months`]] : []),
    ...(o.sam ? [['SAM', o.sam]] : []),
    ...(o.exitVal ? [['Projected Exit', o.exitVal]] : []),
  ].filter(([, v]) => v);

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>BIG Report — ${o.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1e293b;background:#fff;padding:36px;font-size:13px;line-height:1.55;}
  h1{font-size:21px;font-weight:800;color:#0f172a;margin-bottom:4px;}
  h2{font-size:14px;font-weight:700;color:#1e293b;margin:22px 0 10px;border-bottom:2px solid #6366f1;padding-bottom:5px;}
  h3{font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}
  p{margin:0;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:3px solid #6366f1;}
  .brand{font-size:26px;font-weight:900;color:#6366f1;letter-spacing:-2px;}
  .meta{text-align:right;font-size:11px;color:#64748b;line-height:1.6;}
  .disclaimer{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;font-size:10.5px;color:#92400e;margin-bottom:20px;line-height:1.5;}
  .hero{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:18px;margin-bottom:18px;}
  .hero-top{display:flex;justify-content:space-between;align-items:flex-start;}
  .sector-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;background:#ede9fe;color:#6366f1;padding:3px 10px;border-radius:20px;display:inline-block;margin-bottom:8px;}
  .score{font-size:17px;font-weight:800;color:#10b981;}
  .exit-label{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-top:10px;display:block;}
  .exit-num{font-size:17px;font-weight:700;color:#10b981;display:block;}
  .model-txt{font-size:12px;color:#64748b;margin-top:4px;}
  .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
  .metric{background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:12px;}
  .m-label{font-size:9.5px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
  .m-value{font-size:14px;font-weight:700;color:#0f172a;}
  .why-box{background:#f0f0ff;border-left:3px solid #6366f1;padding:12px 14px;border-radius:0 8px 8px 0;font-size:12.5px;color:#1e293b;line-height:1.6;margin-bottom:14px;}
  .launch-box{background:#fffbeb;border-left:3px solid #f59e0b;padding:12px 14px;border-radius:0 8px 8px 0;font-size:12.5px;color:#1e293b;line-height:1.6;margin-bottom:14px;}
  .tags{display:flex;flex-wrap:wrap;gap:7px;}
  .tag{background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:600;padding:4px 11px;border-radius:20px;}
  .verdict{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin:16px 0;font-size:12.5px;color:#92400e;line-height:1.6;}
  .compare-table{width:100%;border-collapse:collapse;font-size:11.5px;margin-bottom:14px;}
  .compare-table th{background:#f1f5f9;padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #e2e8f0;}
  .compare-table td{padding:8px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top;}
  .compare-table tr:last-child td{border-bottom:none;}
  .status-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;display:inline-block;}
  .you-badge{background:rgba(99,102,241,0.12);color:#6366f1;border:1px solid rgba(99,102,241,0.3);}
  .winning-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-bottom:16px;}
  .winning-label{font-size:10px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
  .legend-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px;}
  .legend-item{display:flex;gap:9px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:9px;}
  .legend-abbr{font-size:10.5px;font-weight:800;color:#6366f1;min-width:76px;padding-top:1px;}
  .legend-full{font-size:10.5px;font-weight:600;color:#1e293b;margin-bottom:2px;}
  .legend-desc{font-size:9.5px;color:#64748b;line-height:1.4;}
  .score-guide{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:9px;}
  .score-item{border-radius:6px;padding:9px;border:1px solid #e2e8f0;}
  .footer{margin-top:28px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center;}
  @media print{body{padding:16px;}@page{margin:.8cm;size:A4;}}
</style></head><body>

<div class="header">
  <div>
    <div class="brand">BIG</div>
    <div style="font-size:11px;color:#64748b;margin-top:2px;">Business Opportunity Intelligence Report</div>
  </div>
  <div class="meta">
    <div>Generated: ${date}</div>
    <div>ZIP: ${zip} &nbsp;|&nbsp; Sector: ${sector}</div>
  </div>
</div>

<div class="disclaimer">
  <strong>⚠ Disclaimer:</strong> This report is for informational and entertainment purposes only. It does not constitute financial, legal, or investment advice.
  BIG assumes no liability for any decision made based on this content. Conduct independent research and consult qualified advisors before investing.
</div>

<div class="hero">
  <div class="hero-top">
    <div>
      <div class="sector-tag">${sector}</div>
      <h1>${o.name}</h1>
      <div class="model-txt">${o.model || ''}</div>
    </div>
    <div style="text-align:right;">
      <div class="score">★ ${o.score ? o.score.toFixed(1) : 'N/A'} / 10</div>
      ${o.exitVal ? `<span class="exit-label">Projected Exit</span><span class="exit-num">${o.exitVal}</span>` : ''}
    </div>
  </div>
</div>

<h2>Key Metrics</h2>
<div class="metrics">
  ${metrics.map(([label, value]) => `
    <div class="metric">
      <div class="m-label">${label}</div>
      <div class="m-value">${value || '—'}</div>
    </div>`).join('')}
</div>

${o.whyItWorks ? `<h2>💡 Why It Makes Money</h2><div class="why-box">${o.whyItWorks}</div>` : ''}

${o.profitDrivers && o.profitDrivers.length ? `<h2>📈 Profit Drivers</h2>${listHtml(o.profitDrivers, '#6366f1', '→')}` : ''}

${o.greenSignals && o.greenSignals.length ? `<h2 style="margin-top:16px;">🟢 Green Signals</h2>${listHtml(o.greenSignals, '#10b981', '✓')}` : ''}

${o.keyRisks && o.keyRisks.length ? `<h2 style="margin-top:16px;">⚠️ Key Risks</h2>${listHtml(o.keyRisks, '#ef4444', '!')}` : ''}

${o.watchpoints && o.watchpoints.length ? `<h2 style="margin-top:16px;">👁 Watchpoints</h2>${listHtml(o.watchpoints, '#f59e0b', '→')}` : ''}

${o.launchPlan ? `<h2 style="margin-top:16px;">🚀 90-Day Launch Plan</h2><div class="launch-box">${o.launchPlan}</div>` : ''}

${o.topCompetitors && o.topCompetitors.length ? `
<h2>Competitors</h2>
<div class="tags" style="margin-bottom:16px;">
  ${o.topCompetitors.map(c => `<span class="tag">${c}</span>`).join('')}
</div>` : ''}

${o.compareData ? `
<h2>Competitive Gap Analysis — Road to #1</h2>
${o.compareData.winningMove ? `<div class="winning-box"><div class="winning-label">🏆 Winning Move</div><div style="font-size:12.5px;color:#065f46;line-height:1.6;">${o.compareData.winningMove}</div>${o.compareData.timelineToLead ? `<div style="font-size:11px;color:#059669;margin-top:8px;font-weight:600;">Timeline to Market Lead: ${o.compareData.timelineToLead}</div>` : ''}</div>` : ''}
${o.compareData.capabilities && o.compareData.capabilities.length ? `
<table class="compare-table">
  <thead><tr>
    <th style="width:22%;">Capability</th>
    <th style="width:28%;">Why It Matters</th>
    ${o.topCompetitors.map(c => `<th style="width:${Math.floor(35/o.topCompetitors.length)}%;">${c}</th>`).join('')}
    <th>You</th>
    <th style="width:18%;">How to Build It</th>
  </tr></thead>
  <tbody>
    ${o.compareData.capabilities.map(cap => {
      const imp = cap.importance === 'critical' ? '#ef4444' : cap.importance === 'high' ? '#f59e0b' : '#94a3b8';
      return `<tr>
        <td><strong>${cap.name}</strong><br/><span style="font-size:10px;color:${imp};font-weight:700;">${cap.importance?.toUpperCase() || ''}</span></td>
        <td style="font-size:11px;color:#475569;">${cap.description || ''}</td>
        ${o.topCompetitors.map(c => {
          const cs = cap.competitors?.[c] || { status: 'none', note: '' };
          const sm = STATUS_META[cs.status] || STATUS_META.none;
          return `<td><span class="status-badge" style="background:${sm.bg};color:${sm.color};">${sm.icon} ${sm.label}</span><div style="font-size:10px;color:#64748b;margin-top:3px;">${cs.note || ''}</div></td>`;
        }).join('')}
        <td><span class="status-badge you-badge">○○○ Not yet</span></td>
        <td style="font-size:11px;color:#475569;">${cap.toAchieve || ''}</td>
      </tr>`;
    }).join('')}
  </tbody>
</table>` : ''}` : ''}

${o.verdict ? `<h2>Verdict</h2><div class="verdict"><strong>💡 </strong>${o.verdict}</div>` : ''}

<h2>Report Glossary</h2>
<div class="legend-grid">
  ${LEGEND.map(item => `
    <div class="legend-item">
      <div class="legend-abbr">${item.abbr}</div>
      <div>
        <div class="legend-full">${item.full}</div>
        <div class="legend-desc">${item.desc}</div>
      </div>
    </div>`).join('')}
</div>

<h3 style="margin-top:14px;">Opportunity Score Guide</h3>
<div class="score-guide">
  ${SCORE_GUIDE.map(s => `
    <div class="score-item">
      <div style="font-size:12px;font-weight:700;color:${s.color};margin-bottom:2px;">${s.range}</div>
      <div style="font-size:11px;font-weight:600;color:#1e293b;margin-bottom:2px;">${s.label}</div>
      <div style="font-size:9.5px;color:#64748b;line-height:1.4;">${s.desc}</div>
    </div>`).join('')}
</div>

<div class="footer">
  BIG — Business Opportunity Intelligence &nbsp;|&nbsp; For informational and entertainment purposes only. Not financial or investment advice.
</div>

<script>window.onload=function(){window.print();};</script>
</body></html>`);
  w.document.close();
}

function CompetitorCompare({ businessName, sector, competitors, onCompareReady }) {
  const [compare, setCompare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-run on mount
  // eslint-disable-next-line
  useEffect(() => { run(); }, []);

  async function run() {
    setCompare(null);
    setLoading(true);
    setError('');
    try {
      const data = await api.competitorCompare(businessName, sector, competitors);
      setCompare(data);
      if (onCompareReady) onCompareReady(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.compareLoading}>
        <span className={styles.compareSpinner} />
        <div>
          <div className={styles.compareLoadingTitle}>Analysing competitive landscape…</div>
          <div className={styles.compareLoadingText}>Building your gap matrix vs. {competitors.join(', ')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.compareError}>
        <span>⚠ {error}</span>
        <button onClick={run} className={styles.compareRetry}>Retry</button>
      </div>
    );
  }

  if (!compare) return null;

  const caps = compare.capabilities || [];

  return (
    <div className={styles.comparePanel}>
      <div className={styles.compareHeader}>
        <div>
          <h3 className={styles.compareTitle}>⚔ Competitive Gap Analysis — Road to #1</h3>
          <p className={styles.compareSubtitle}>What you must build to beat {competitors.join(', ')} and become the market leader</p>
        </div>
        <button onClick={run} className={styles.compareRefresh} title="Regenerate analysis">↻ Refresh</button>
      </div>

      {compare.winningMove && (
        <div className={styles.winningMove}>
          <div className={styles.winningLabel}>🏆 Single Most Important Move to Reach #1</div>
          <p className={styles.winningText}>{compare.winningMove}</p>
          {compare.timelineToLead && (
            <div className={styles.winningTimeline}>⏱ Timeline to Market Lead: <strong>{compare.timelineToLead}</strong></div>
          )}
        </div>
      )}

      <div className={styles.compareTableWrap}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th className={styles.capCol}>Capability</th>
              {competitors.map(c => <th key={c} className={styles.compCol}>{c}</th>)}
              <th className={styles.youCol}>You</th>
              <th className={styles.buildCol}>How to Build It</th>
            </tr>
          </thead>
          <tbody>
            {caps.map((cap, i) => {
              const imp = cap.importance === 'critical' ? '#ef4444' : cap.importance === 'high' ? '#f59e0b' : '#94a3b8';
              return (
                <tr key={i} className={styles.capRow}>
                  <td className={styles.capName}>
                    <div className={styles.capNameText}>{cap.name}</div>
                    <span className={styles.impBadge} style={{ color: imp, borderColor: imp + '44', background: imp + '11' }}>
                      {cap.importance?.toUpperCase()}
                    </span>
                    {cap.description && <div className={styles.capDesc}>{cap.description}</div>}
                  </td>
                  {competitors.map(c => {
                    const cs = cap.competitors?.[c] || { status: 'none', note: '' };
                    const sm = STATUS_META[cs.status] || STATUS_META.none;
                    return (
                      <td key={c} className={styles.compCell}>
                        <span className={styles.statusBadge} style={{ background: sm.bg, color: sm.color }}>
                          {sm.icon} {sm.label}
                        </span>
                        {cs.note && <div className={styles.statusNote}>{cs.note}</div>}
                      </td>
                    );
                  })}
                  <td className={styles.youCell}>
                    <span className={styles.youBadge}>○○○ Not yet</span>
                    <div className={styles.statusNote}>Opportunity gap</div>
                  </td>
                  <td className={styles.buildCell}>{cap.toAchieve}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OpportunityCard({ opportunity: raw, zip, sector, state, city, sectorLabel, onNavigate, savedOpportunityId: initialSavedId, user }) {
  const [compareData, setCompareData] = useState(null);
  const [savedOpportunityId, setSavedOpportunityId] = useState(initialSavedId || null);
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  async function handleBuildPlan() {
    setPlanLoading(true);
    setPlanError('');
    try {
      const location = { city, state, zip, country: 'United States' };
      const result = await api.generateBusinessPlan(raw, location);
      setPlan(result.plan);
    } catch (err) {
      setPlanError(err.message || 'Failed to generate business plan. Please try again.');
    } finally {
      setPlanLoading(false);
    }
  }

  const o = {
    ...raw,
    score: typeof raw.score === 'string' ? parseFloat(raw.score) : (raw.score || 0),
    profitDrivers: Array.isArray(raw.profitDrivers) ? raw.profitDrivers : [],
    greenSignals: Array.isArray(raw.greenSignals) ? raw.greenSignals : [],
    keyRisks: Array.isArray(raw.keyRisks) ? raw.keyRisks : [],
    watchpoints: Array.isArray(raw.watchpoints) ? raw.watchpoints : [],
    topCompetitors: Array.isArray(raw.topCompetitors) ? raw.topCompetitors : [],
    compareData,
  };

  return (
    <div>
      {/* Action bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarLeft}>
          <span className={styles.reportLabel}>📊 Opportunity Report</span>
        </div>
        <button className={styles.pdfBtn} onClick={() => handlePrint(o, zip, sector)}>
          ⬇ Download PDF
        </button>
        <ShareButton
          opportunityId={savedOpportunityId || null}
          opportunityName={o.name}
        />
        <SaveButton
          cardData={raw}
          state={state}
          city={city}
          zip={zip}
          sector={sector}
          sectorLabel={sectorLabel}
          onNavigate={onNavigate}
          onSaved={id => setSavedOpportunityId(id)}
        />
      </div>

      <div className={styles.card}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.heroMeta}>
              <span className={styles.zip}>📍 {zip}</span>
              <span className={styles.sectorTag}>{sector}</span>
            </div>
            <h2 className={styles.name}>{o.name}</h2>
            <p className={styles.model}>{o.model}</p>
          </div>
          <div className={styles.heroRight}>
            <ScoreBadge score={o.score} />
            <div className={styles.exitVal}>
              <span className={styles.exitLabel}>Projected Exit</span>
              <span className={styles.exitNum}>{o.exitVal}</span>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className={styles.metrics}>
          {[
            { label: 'TAM', value: o.tam },
            { label: 'Startup Cost', value: o.startupCost },
            { label: 'Gross Margin', value: o.grossMargin },
            { label: 'Time to Profit', value: o.timeToProfit },
            { label: 'Revenue Yr 1', value: o.revenueYr1 },
            { label: 'Revenue Yr 3', value: o.revenueYr3 },
            ...(o.ltv_cac ? [{ label: 'LTV : CAC', value: o.ltv_cac }] : []),
            ...(o.paybackMonths ? [{ label: 'Payback Period', value: `${o.paybackMonths} months` }] : []),
            ...(o.sam ? [{ label: 'SAM', value: o.sam }] : []),
            ...(o.bestZip ? [{ label: 'Best ZIP', value: o.bestZip }] : []),
          ].filter(m => m.value).map(m => (
            <div key={m.label} className={styles.metric}>
              <span className={styles.mLabel}>{m.label}</span>
              <span className={styles.mValue}>{m.value}</span>
            </div>
          ))}
        </div>

        {o.whyItWorks && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💡 Why It Makes Money</h3>
            <p className={styles.whyText}>{o.whyItWorks}</p>
          </div>
        )}

        {o.profitDrivers.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📈 Profit Drivers</h3>
            <ul className={styles.bulletList}>
              {o.profitDrivers.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}

        {o.greenSignals.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🟢 Green Signals</h3>
            <ul className={styles.greenList}>
              {o.greenSignals.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {o.validationSignals && (() => {
          const v = o.validationSignals;
          const hasReddit  = v.reddit  && v.reddit.length  > 0;
          const hasTrends  = v.trends  && v.trends.growthPercent != null;
          const hasReviews = v.reviews && v.reviews.topPainThemes?.length > 0;
          const hasSearch  = v.search  && v.search.totalMonthlySearches > 0;
          if (!hasReddit && !hasTrends && !hasReviews && !hasSearch) return null;
          return (
            <div className={styles.section}>
              <details open>
                <summary className={styles.sectionTitle} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  📡 Real Market Evidence
                </summary>
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {hasReddit && (
                    <div style={{ background: '#fff7ed', borderRadius: '8px', padding: '12px', border: '1px solid #fed7aa' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#c2410c', marginBottom: '8px' }}>
                        🔴 Reddit Pain Points — {v.reddit.length} posts
                      </div>
                      {v.reddit.slice(0, 3).map((p, i) => (
                        <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid #fed7aa' : 'none' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{p.subreddit} · {p.upvotes} upvotes · {p.comments} comments</div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>"{p.title.slice(0, 100)}{p.title.length > 100 ? '…' : ''}"</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {hasTrends && (
                    <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '12px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#15803d', marginBottom: '6px' }}>
                        📈 Google Trends — "{v.trends.keyword}"
                      </div>
                      <div style={{ fontSize: '13px', color: '#374151' }}>
                        <strong>{v.trends.trend}</strong> &nbsp;
                        <span style={{ color: v.trends.growthPercent >= 0 ? '#15803d' : '#dc2626' }}>
                          {v.trends.growthPercent > 0 ? '+' : ''}{v.trends.growthPercent}% YoY
                        </span>
                        &nbsp;· Current interest: {v.trends.currentScore}/100
                      </div>
                      {v.trends.risingQueries?.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                          Rising: {v.trends.risingQueries.map(q => `"${q.query}" +${q.value}%`).join(' · ')}
                        </div>
                      )}
                    </div>
                  )}
                  {hasReviews && (
                    <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '12px', border: '1px solid #fde047' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#a16207', marginBottom: '6px' }}>
                        ⭐ Competitor Review Intelligence — {v.reviews.reviewCount} negative reviews
                      </div>
                      {v.reviews.topPainThemes.map((t, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#374151', marginBottom: '3px' }}>
                          <span>{t.theme.replace(/_/g, ' ')}</span>
                          <span style={{ fontWeight: 600 }}>{t.pct}% of complaints</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {hasSearch && (
                    <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#1d4ed8', marginBottom: '6px' }}>
                        🔍 Search Demand — {v.search.verdict}
                      </div>
                      <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                        <strong>{v.search.totalMonthlySearches.toLocaleString()}</strong> monthly searches
                        {v.search.cpc > 0 && <> · CPC ${v.search.cpc} (commercial intent)</>}
                      </div>
                      {v.search.keywords?.slice(0, 3).map((k, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#6b7280' }}>
                          "{k.keyword}": {k.monthlyVolume.toLocaleString()}/mo
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </div>
          );
        })()}

        {o.keyRisks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>⚠️ Key Risks</h3>
            <ul className={styles.riskList}>
              {o.keyRisks.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {o.watchpoints.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>👁 Watchpoints</h3>
            <ul className={styles.bulletList}>
              {o.watchpoints.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {o.launchPlan && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🚀 90-Day Launch Plan</h3>
            <p className={styles.launchText}>{o.launchPlan}</p>
          </div>
        )}

        {/* Blue Ocean exclusive sections */}
        {o.blueOcean && (
          <>
            <div className={styles.blueOceanBanner}>
              <span className={styles.blueOceanIcon}>◎</span>
              <div>
                <div className={styles.blueOceanTitle}>Blue Ocean — Uncontested Market Space</div>
                <div className={styles.blueOceanSub}>This idea operates in a market with no direct competitors. First-mover advantage is your primary asset.</div>
              </div>
            </div>
            {o.blueOceanReason && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🌊 Why There Are No Competitors</h3>
                <p className={styles.whyText}>{o.blueOceanReason}</p>
              </div>
            )}
            {o.firstMoverAdvantage && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🏆 First-Mover Advantage</h3>
                <p className={styles.whyText}>{o.firstMoverAdvantage}</p>
              </div>
            )}
          </>
        )}

        {/* Competitors + Auto Gap Analysis (only for non-blue-ocean ideas) */}
        {!o.blueOcean && o.topCompetitors.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🏢 Competitors You're Entering Against</h3>
            <div className={styles.competitorRow}>
              {o.topCompetitors.map(c => (
                <span key={c} className={styles.tag}>{c}</span>
              ))}
            </div>
            <CompetitorCompare
              businessName={o.name}
              sector={sector}
              competitors={o.topCompetitors}
              onCompareReady={setCompareData}
            />
          </div>
        )}

        {o.verdict && (
          <div className={styles.verdict}>
            <span className={styles.verdictIcon}>💡</span>
            <p><strong>Verdict: </strong>{o.verdict}</p>
          </div>
        )}

        {o.liveAnalysis && o._meta && (
          <div className={styles.liveFreshness}>
            <span className={styles.liveDot} />
            <span className={styles.liveLabel}>
              Live analysis · Generated {new Date(o._meta.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            {o.dataQuality?.censusAvailable && <span className={styles.dataBadge}>📊 Census</span>}
            {o.dataQuality?.blsAvailable && <span className={styles.dataBadge}>📈 BLS</span>}
            {o.dataQuality?.trendsAvailable && <span className={styles.dataBadge}>🔍 Trends</span>}
          </div>
        )}

        <Legend />

        {/* Build Business Plan */}
        <div style={{ borderTop: '1px solid #1e2a3a', marginTop: 24, paddingTop: 20, textAlign: 'center' }}>
          {!plan && (
            <>
              <button
                onClick={handleBuildPlan}
                disabled={planLoading}
                style={{
                  background: planLoading ? '#1e2a3a' : 'linear-gradient(135deg, #ffc843, #f59e0b)',
                  color: '#07090d',
                  border: 'none',
                  borderRadius: 10,
                  padding: '12px 28px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: planLoading ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {planLoading
                  ? '⏳ Generating Business Plan…'
                  : '📄 Build Business Plan ✦ 3 credits'}
              </button>
              {planLoading && (
                <p style={{ fontSize: 12, color: '#4d6070', marginTop: 10 }}>
                  Claude is writing your investor-ready plan. This takes 20–40 seconds…
                </p>
              )}
              {planError && (
                <p style={{ fontSize: 13, color: '#ef4444', marginTop: 10 }}>{planError}</p>
              )}
            </>
          )}
        </div>
      </div>

      {plan && (
        <BusinessPlan
          plan={plan}
          analysisId={raw._savedId || raw.bestZip || 'plan'}
          onClose={() => setPlan(null)}
        />
      )}
    </div>
  );
}
