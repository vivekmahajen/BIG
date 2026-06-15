import React from 'react';
import styles from './IdeaComparison.module.css';

const ADV_LABEL = { idea1: '← Better', idea2: 'Better →', tie: 'Tie' };
const ADV_COLOR = { idea1: '#10b981', idea2: '#6366f1', tie: '#94a3b8' };

export default function IdeaComparison({ comparison, idea1, idea2, onClose }) {
  if (!comparison) return null;
  const { comparisonTable = [], winner, winnerReason, idea1BestFor, idea2BestFor, recommendation } = comparison;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.ideaName} style={{ color: '#10b981' }}>{idea1.name}</div>
        <div className={styles.vs}>VS</div>
        <div className={styles.ideaName} style={{ color: '#6366f1' }}>{idea2.name}</div>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      {winner && (
        <div className={styles.winnerBanner} style={{ borderColor: winner === 'idea1' ? '#10b981' : '#6366f1' }}>
          <span className={styles.winnerLabel}>
            {winner === 'idea1' ? `${idea1.name} wins` : `${idea2.name} wins`}
          </span>
          {winnerReason && <span className={styles.winnerReason}> — {winnerReason}</span>}
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.dimHead}>Dimension</th>
              <th className={styles.colHead} style={{ color: '#10b981' }}>{idea1.name}</th>
              <th className={styles.colHead} style={{ color: '#6366f1' }}>{idea2.name}</th>
              <th className={styles.advHead}>Edge</th>
            </tr>
          </thead>
          <tbody>
            {comparisonTable.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td className={styles.dimCell}>{row.dimension}</td>
                <td className={`${styles.valCell} ${row.advantage === 'idea1' ? styles.winner : ''}`}>{row.idea1}</td>
                <td className={`${styles.valCell} ${row.advantage === 'idea2' ? styles.winner : ''}`}>{row.idea2}</td>
                <td className={styles.advCell} style={{ color: ADV_COLOR[row.advantage] || '#94a3b8' }}>
                  {ADV_LABEL[row.advantage] || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.verdict}>
        {idea1BestFor && (
          <div className={styles.bestFor}>
            <span className={styles.bestForLabel} style={{ color: '#10b981' }}>Choose {idea1.name} if:</span>
            <span className={styles.bestForText}> {idea1BestFor}</span>
          </div>
        )}
        {idea2BestFor && (
          <div className={styles.bestFor}>
            <span className={styles.bestForLabel} style={{ color: '#6366f1' }}>Choose {idea2.name} if:</span>
            <span className={styles.bestForText}> {idea2BestFor}</span>
          </div>
        )}
        {recommendation && (
          <div className={styles.rec}>{recommendation}</div>
        )}
      </div>
    </div>
  );
}
