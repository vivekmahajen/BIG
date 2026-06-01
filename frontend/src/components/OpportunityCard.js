import styles from './OpportunityCard.module.css';

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

function handlePrint(o, zip, sector) {
  const printWindow = window.open('', '_blank');
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BIG Report — ${o.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; font-size: 13px; line-height: 1.5; }
    h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    h2 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 24px 0 10px; border-bottom: 2px solid #6366f1; padding-bottom: 6px; }
    h3 { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
    .brand { font-size: 28px; font-weight: 900; color: #6366f1; letter-spacing: -2px; }
    .meta { text-align: right; font-size: 11px; color: #64748b; }

    .hero { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .hero-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .sector-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #ede9fe; color: #6366f1; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 8px; }
    .score { font-size: 18px; font-weight: 800; color: #10b981; }
    .exit { text-align: right; }
    .exit-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .exit-num { font-size: 18px; font-weight: 700; color: #10b981; display: block; }
    .model { font-size: 12px; color: #64748b; margin-top: 4px; }

    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .metric { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .m-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .m-value { font-size: 15px; font-weight: 700; color: #0f172a; }

    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }

    .verdict { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #92400e; line-height: 1.6; }
    .verdict strong { color: #78350f; }

    .legend-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .legend-item { display: flex; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
    .legend-abbr { font-size: 11px; font-weight: 800; color: #6366f1; min-width: 80px; padding-top: 1px; }
    .legend-full { font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
    .legend-desc { font-size: 10px; color: #64748b; line-height: 1.4; }

    .score-guide { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
    .score-item { border-radius: 6px; padding: 10px; border: 1px solid #e2e8f0; }
    .score-range { font-size: 12px; font-weight: 700; margin-bottom: 2px; }
    .score-label { font-size: 11px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
    .score-desc { font-size: 10px; color: #64748b; line-height: 1.4; }

    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }

    @media print {
      body { padding: 20px; }
      @page { margin: 1cm; size: A4; }
    }
  </style>
</head>
<body>

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

<div class="hero">
  <div class="hero-top">
    <div>
      <div class="sector-tag">${sector}</div>
      <h1>${o.name}</h1>
      <div class="model">${o.model}</div>
    </div>
    <div class="exit">
      <div class="score">★ ${o.score ? o.score.toFixed(1) : 'N/A'} / 10</div>
      <div class="exit-label" style="margin-top:12px;">Projected Exit</div>
      <div class="exit-num">${o.exitVal}</div>
    </div>
  </div>
</div>

<h2>Key Metrics</h2>
<div class="metrics">
  ${[
    ['TAM', o.tam],
    ['SAM', o.sam],
    ['SOM (Yr 3)', o.som],
    ['Gross Margin', o.grossMargin],
    ['LTV : CAC', o.ltv_cac],
    ['Payback Period', `${o.paybackMonths} months`],
    ['Startup Cost', o.startupCost],
    ['Best ZIP', o.bestZip],
  ].map(([label, value]) => `
    <div class="metric">
      <div class="m-label">${label}</div>
      <div class="m-value">${value}</div>
    </div>
  `).join('')}
</div>

<h2>Top Competitors</h2>
<div class="tags" style="margin-bottom:20px;">
  ${o.topCompetitors.map(c => `<span class="tag">${c}</span>`).join('')}
</div>

<h2>Investment Verdict</h2>
<div class="verdict">
  <strong>💡 Verdict: </strong>${o.verdict}
</div>

<h2>Report Glossary</h2>
<div class="legend-grid">
  ${LEGEND.map(item => `
    <div class="legend-item">
      <div class="legend-abbr">${item.abbr}</div>
      <div>
        <div class="legend-full">${item.full}</div>
        <div class="legend-desc">${item.desc}</div>
      </div>
    </div>
  `).join('')}
</div>

<h3 style="margin-top:16px;">Opportunity Score Guide</h3>
<div class="score-guide">
  ${SCORE_GUIDE.map(s => `
    <div class="score-item">
      <div class="score-range" style="color:${s.color}">${s.range}</div>
      <div class="score-label">${s.label}</div>
      <div class="score-desc">${s.desc}</div>
    </div>
  `).join('')}
</div>

<div class="footer">
  BIG — Business Opportunity Intelligence &nbsp;|&nbsp; All projections are estimates based on publicly available data. Not investment advice.
</div>

<script>
  window.onload = function() { window.print(); };
</script>
</body>
</html>
  `);
  printWindow.document.close();
}

export default function OpportunityCard({ opportunity: o, zip, sector }) {
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
            { label: 'SAM', value: o.sam },
            { label: 'SOM (Yr 3)', value: o.som },
            { label: 'Gross Margin', value: o.grossMargin },
            { label: 'LTV : CAC', value: o.ltv_cac },
            { label: 'Payback Period', value: `${o.paybackMonths} months` },
            { label: 'Startup Cost', value: o.startupCost },
            { label: 'Best ZIP', value: o.bestZip },
          ].map(m => (
            <div key={m.label} className={styles.metric}>
              <span className={styles.mLabel}>{m.label}</span>
              <span className={styles.mValue}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* Competitors */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Top Competitors</h3>
          <div className={styles.tags}>
            {o.topCompetitors.map(c => (
              <span key={c} className={styles.tag}>{c}</span>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className={styles.verdict}>
          <span className={styles.verdictIcon}>💡</span>
          <p><strong>Verdict: </strong>{o.verdict}</p>
        </div>

        {/* Legend */}
        <Legend />
      </div>
    </div>
  );
}
