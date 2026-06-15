import React, { useState } from 'react';
import styles from './CompetitiveAnalysis.module.css';

const STRENGTH_META = {
  Strong:   { color: '#ef4444', label: '🔴 Hard market — strong incumbents' },
  Moderate: { color: '#f59e0b', label: '🟡 Moderate — gaps exist' },
  Weak:     { color: '#10b981', label: '🟢 Opportunity — weak incumbents' },
};

const SEV_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#94a3b8' };

export default function CompetitiveAnalysis({ analysis }) {
  const [expanded, setExpanded] = useState(null);
  if (!analysis) return null;

  const {
    market_summary,
    incumbent_strength,
    market_gap_score,
    competitors = [],
    aggregate_gaps = [],
    entry_angle,
    red_flags = [],
  } = analysis;

  const sm = STRENGTH_META[incumbent_strength] || STRENGTH_META.Moderate;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>⚔️ Competitive Landscape</div>
        <div className={styles.strength} style={{ color: sm.color }}>{sm.label}</div>
        {market_gap_score != null && (
          <div className={styles.gapScore}>Gap Score: <strong>{market_gap_score}/10</strong></div>
        )}
      </div>

      <p className={styles.summary}>{market_summary}</p>

      {aggregate_gaps.length > 0 && (
        <div className={styles.gapsSection}>
          <h3 className={styles.gapsTitle}>Market Gaps (across {competitors.length} competitors)</h3>
          {aggregate_gaps.map((g, i) => (
            <div key={i} className={styles.gapRow}>
              <span className={styles.gapDot} style={{ color: SEV_COLOR[g.severity] || '#94a3b8' }}>●</span>
              <span className={styles.gapText}>{g.gap}</span>
              <span className={styles.gapFreq}>{g.frequency}/{competitors.length}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.competitorList}>
        {competitors.map((comp, i) => (
          <div key={i} className={styles.compCard}>
            <button
              className={styles.compCardHeader}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className={styles.compRank}>#{i + 1}</span>
              <span className={styles.compName}>{comp.name}</span>
              <span className={styles.compRating}>
                {comp.rating != null ? `⭐ ${comp.rating}` : '—'}
                {comp.review_count ? ` (${comp.review_count.toLocaleString()})` : ''}
              </span>
              {comp.estimated_monthly_revenue && (
                <span className={styles.compRevenue}>{comp.estimated_monthly_revenue}</span>
              )}
              <span className={styles.chevron}>{expanded === i ? '▲' : '▼'}</span>
            </button>

            {expanded === i && (
              <div className={styles.compCardBody}>
                <div className={styles.compCols}>
                  <div className={styles.compCol}>
                    <div className={styles.colLabel} style={{ color: '#10b981' }}>✓ What they do well</div>
                    {(comp.what_they_do_well || []).map((s, j) => (
                      <div key={j} className={styles.compItem}>+ {s}</div>
                    ))}
                  </div>
                  <div className={styles.compCol}>
                    <div className={styles.colLabel} style={{ color: '#ef4444' }}>✗ Where they fail</div>
                    {(comp.where_they_fail || []).map((w, j) => (
                      <div key={j} className={styles.compItem}>– {w}</div>
                    ))}
                  </div>
                </div>
                {comp.vulnerability && (
                  <div className={styles.vulnerability}>
                    💡 <strong>Your opening:</strong> {comp.vulnerability}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {entry_angle && (
        <div className={styles.entryAngle}>
          <div className={styles.entryAngleLabel}>🎯 Recommended Entry Angle</div>
          <div className={styles.entryAngleText}>{entry_angle}</div>
        </div>
      )}

      {red_flags.length > 0 && (
        <div className={styles.redFlags}>
          <div className={styles.redFlagsLabel}>⚠️ Red Flags</div>
          {red_flags.map((f, i) => <div key={i} className={styles.redFlag}>• {f}</div>)}
        </div>
      )}
    </div>
  );
}
