import styles from './OpportunityCard.module.css';

function ScoreBadge({ score }) {
  if (!score) return null;
  const color = score >= 8.5 ? '#10b981' : score >= 7.5 ? '#f59e0b' : '#94a3b8';
  return (
    <span className={styles.score} style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
      ★ {score.toFixed(1)} / 10
    </span>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className={styles.metricRow}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricValue}>{value}</span>
    </div>
  );
}

export default function OpportunityCard({ opportunity: o, zip, sector }) {
  return (
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
        <p>
          <strong>Verdict: </strong>
          {o.verdict}
        </p>
      </div>
    </div>
  );
}
