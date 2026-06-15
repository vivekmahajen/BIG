import React from 'react';
import styles from './WhyThisIdeaExists.module.css';

const SOURCE_CONFIG = {
  reddit:  { icon: '📣', label: 'Community Pain'  },
  trends:  { icon: '📈', label: 'Search Trend'    },
  reviews: { icon: '⭐', label: 'Competitor Gaps' },
  search:  { icon: '🔍', label: 'Search Demand'   },
};

export default function WhyThisIdeaExists({ data }) {
  if (!data?.evidence?.length) return null;
  const { evidence, verdict } = data;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.icon}>🔬</span>
        <div>
          <div className={styles.title}>Why This Idea Exists</div>
          <div className={styles.sub}>Evidence from {evidence.length} independent data source{evidence.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className={styles.signals}>
        {evidence.map((signal, i) => {
          const cfg = SOURCE_CONFIG[signal.type] || SOURCE_CONFIG.search;
          return (
            <div key={i} className={`${styles.row} ${styles[signal.type] || ''}`}>
              <span className={styles.signalIcon}>{cfg.icon}</span>
              <div className={styles.content}>
                <span className={styles.label}>{cfg.label}</span>
                <p className={styles.text}>{signal.text}</p>
                {signal.source && (
                  <a href={signal.source} target="_blank" rel="noopener noreferrer" className={styles.source}>
                    View source →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {verdict && (
        <div className={styles.verdict}>
          <strong>Verdict:</strong> {verdict}
        </div>
      )}
    </div>
  );
}
