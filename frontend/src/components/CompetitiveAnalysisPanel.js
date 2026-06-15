import React, { useState } from 'react';
import { api } from '../api';
import CompetitiveAnalysis from './CompetitiveAnalysis';
import styles from './CompetitiveAnalysisPanel.module.css';

export default function CompetitiveAnalysisPanel({ industry, city, country }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.competitiveAnalysis({ industry, city, country });
      setAnalysis(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (analysis) return <CompetitiveAnalysis analysis={analysis} />;

  return (
    <div className={styles.panel}>
      <div className={styles.teaser}>
        <div className={styles.teaserTitle}>⚔️ Competitive Intelligence</div>
        <div className={styles.teaserText}>
          Discover who's already in this market, what they do well, where they fail, and the exact gap you can exploit.
        </div>
        <button className={styles.runBtn} onClick={run} disabled={loading}>
          {loading ? '⏳ Analysing competitors…' : '⚔️ Run Competitive Analysis · 5 credits'}
        </button>
        {loading && <div className={styles.loadingNote}>Scanning Google Maps, profiling competitors, identifying gaps…</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
