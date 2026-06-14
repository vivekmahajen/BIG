import React from 'react';
import styles from './ScoreBadge.module.css';

const COMP_COLOR  = { 'Very Low': '#15803d', 'Low': '#15803d', 'Medium': '#b45309', 'High': '#dc2626', 'Very High': '#7f1d1d' };
const MONO_COLOR  = { 'Very High': '#15803d', 'High': '#15803d', 'Medium': '#b45309', 'Low': '#dc2626' };
const GRADE_COLOR = { 'A+': '#15803d', 'A': '#166534', 'B': '#1d4ed8', 'C': '#b45309', 'D': '#c2410c', 'F': '#7f1d1d' };

function DemandBar({ score }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? '#15803d' : score >= 5 ? '#b45309' : '#dc2626';
  return (
    <div className={styles.barWrap}>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.barLabel} style={{ color }}>{score}/10</span>
    </div>
  );
}

export default function ScoreBadge({ scores }) {
  if (!scores) return null;
  const { demand, competition, monetisation, viability } = scores;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>📊 BIG Opportunity Score</span>
        {viability && (
          <div className={styles.gradeBadge} style={{ background: GRADE_COLOR[viability.grade] || '#374151' }}>
            <span className={styles.grade}>{viability.grade}</span>
            <span className={styles.gradeScore}>{viability.score}/10</span>
          </div>
        )}
      </div>

      {viability && (
        <div className={styles.verdict}>
          {viability.verdict}
          {viability.topRisk && <span className={styles.risk}> · ⚠ {viability.topRisk}</span>}
        </div>
      )}

      <div className={styles.chips}>

        {/* Demand */}
        {demand && (
          <div className={styles.chip}>
            <div className={styles.chipLabel}>Demand</div>
            <DemandBar score={demand.score} />
            <div className={styles.chipSub}>
              <span style={{ color: demand.score >= 7 ? '#15803d' : demand.score >= 5 ? '#b45309' : '#dc2626', fontWeight: 600 }}>{demand.label}</span>
              {' · '}
              <span className={styles.conf}>{demand.confidence} confidence</span>
            </div>
            {demand.totalMonthlySearches > 0 && (
              <div className={styles.chipMeta}>{demand.totalMonthlySearches.toLocaleString()} searches/mo</div>
            )}
            {demand.trendGrowth != null && (
              <div className={styles.chipMeta} style={{ color: demand.trendGrowth >= 0 ? '#15803d' : '#dc2626' }}>
                {demand.trendGrowth > 0 ? '+' : ''}{demand.trendGrowth}% YoY trend
              </div>
            )}
          </div>
        )}

        {/* Competition */}
        {competition && (
          <div className={styles.chip}>
            <div className={styles.chipLabel}>Competition</div>
            <div className={styles.chipValue} style={{ color: COMP_COLOR[competition.level] || '#374151' }}>
              {competition.level}
            </div>
            <div className={styles.chipSub}>Entry barrier: {competition.entryBarrier}</div>
            {competition.incumbentStrength && (
              <div className={styles.chipMeta}>Incumbent strength: {competition.incumbentStrength}</div>
            )}
            {competition.competitorCount > 0 && (
              <div className={styles.chipMeta}>{competition.competitorCount} local competitors found</div>
            )}
          </div>
        )}

        {/* Monetisation */}
        {monetisation && (
          <div className={styles.chip}>
            <div className={styles.chipLabel}>Monetisation</div>
            <div className={styles.chipValue} style={{ color: MONO_COLOR[monetisation.level] || '#374151' }}>
              {monetisation.level}
            </div>
            <div className={styles.chipSub}>
              Avg ticket ${monetisation.avgTicket?.toLocaleString()}
              {' · '}
              {monetisation.recurring ? '🔄 Recurring' : '🔲 One-off'}
            </div>
            <div className={styles.chipMeta}>LTV potential: {monetisation.ltvLevel}</div>
            {monetisation.cpcBoost && (
              <div className={styles.chipMeta} style={{ color: '#15803d' }}>✓ High CPC signals strong commercial intent</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
