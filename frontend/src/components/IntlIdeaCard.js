import { useState } from 'react';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import styles from './IntlIdeaCard.module.css';

export default function IntlIdeaCard({ idea, country, region, city, sector, onNavigate }) {
  const { name, what, whyHereNow, startupCost, revenueMonthly, steps, watchOut, resources, isWildcard } = idea;
  const sym = startupCost?.currency === 'GBP' ? '£' : startupCost?.currency === 'AUD' ? 'AUD $' : 'CAD $';
  const [savedId, setSavedId] = useState(null);

  function fmt(n) {
    if (!n && n !== 0) return '—';
    return sym + Number(n).toLocaleString();
  }

  const cardData = idea;
  const sectorLabel = sector || 'International';
  // Use region as "state", country code as "zip" so existing save API works
  const saveProps = {
    state: region || country || '',
    city: city || '',
    zip: country || '',
    sector: sectorLabel,
    sectorLabel,
    cardData,
  };

  return (
    <div className={`${styles.card} ${isWildcard ? styles.wildcard : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <h3 className={styles.name}>{name}</h3>
          {isWildcard && <span className={styles.wildcardBadge}>🎲 Wildcard Idea</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <SaveButton
            {...saveProps}
            onSaved={setSavedId}
            onNavigate={onNavigate}
          />
          <ShareButton
            opportunityId={savedId}
            opportunityName={name}
          />
        </div>
      </div>

      <p className={styles.what}>{what}</p>

      <div className={styles.highlight}>
        <span className={styles.highlightLabel}>Why here &amp; now</span>
        <p className={styles.highlightText}>{whyHereNow}</p>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Startup Cost</span>
          <span className={styles.metricValue}>
            {startupCost ? `${fmt(startupCost.low)} – ${fmt(startupCost.high)}` : '—'}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Monthly Revenue</span>
          <span className={styles.metricValue}>
            {revenueMonthly ? `${fmt(revenueMonthly.low)} – ${fmt(revenueMonthly.high)}` : '—'}
          </span>
        </div>
      </div>

      {startupCost?.breakdown?.length > 0 && (
        <div className={styles.breakdown}>
          <span className={styles.sectionLabel}>Cost Breakdown</span>
          <ul className={styles.breakdownList}>
            {startupCost.breakdown.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}

      {steps?.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Getting Started</span>
          <ol className={styles.stepList}>
            {steps.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}

      {watchOut?.length > 0 && (
        <div className={`${styles.section} ${styles.watchSection}`}>
          <span className={styles.sectionLabel}>⚠ Watch Out For</span>
          <ul className={styles.watchList}>
            {watchOut.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {resources?.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Local Resources</span>
          <ul className={styles.resourceList}>
            {resources.map((r, i) => (
              <li key={i}>
                <a href={r} target="_blank" rel="noopener noreferrer">{r}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
