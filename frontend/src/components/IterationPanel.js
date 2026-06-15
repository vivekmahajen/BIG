import React, { useState } from 'react';
import styles from './IterationPanel.module.css';
import { api } from '../api';

const QUICK_CHIPS = [
  'Lower investment',
  'Scale this up',
  'Make it online-only',
  'B2B version',
  'Add recurring revenue',
  'Lower competition niche',
];

export default function IterationPanel({ idea, allIdeas = [], location, onRefined, onCompared }) {
  const [mode, setMode] = useState(null); // 'refine' | 'compare'
  const [instruction, setInstruction] = useState('');
  const [compareTarget, setCompareTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const otherIdeas = allIdeas.filter(i => i.name !== idea.name);

  async function handleRefine(text) {
    const inst = text || instruction;
    if (!inst.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const refined = await api.refineIdea(idea, inst, idea.sector, location?.city, location?.country);
      onRefined && onRefined(refined);
      setMode(null);
      setInstruction('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompare() {
    const target = otherIdeas.find(i => i.name === compareTarget);
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const comparison = await api.compareIdeas(idea, target, location?.city, location?.country);
      onCompared && onCompared(comparison, idea, target);
      setMode(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.prompt}>What would you like to do with this idea?</div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${mode === 'refine' ? styles.active : ''}`}
          onClick={() => setMode(mode === 'refine' ? null : 'refine')}
        >
          ✏️ Refine <span className={styles.cost}>1 credit</span>
        </button>
        {otherIdeas.length > 0 && (
          <button
            className={`${styles.actionBtn} ${mode === 'compare' ? styles.active : ''}`}
            onClick={() => setMode(mode === 'compare' ? null : 'compare')}
          >
            ⚖️ Compare <span className={styles.cost}>2 credits</span>
          </button>
        )}
      </div>

      {mode === 'refine' && (
        <div className={styles.refineBox}>
          <div className={styles.chips}>
            {QUICK_CHIPS.map(chip => (
              <button key={chip} className={styles.chip} onClick={() => handleRefine(chip)} disabled={loading}>
                {chip}
              </button>
            ))}
          </div>
          <div className={styles.customRow}>
            <input
              className={styles.input}
              placeholder="Or describe your own refinement…"
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRefine()}
              disabled={loading}
            />
            <button className={styles.goBtn} onClick={() => handleRefine()} disabled={loading || !instruction.trim()}>
              {loading ? '…' : 'Go'}
            </button>
          </div>
        </div>
      )}

      {mode === 'compare' && (
        <div className={styles.compareBox}>
          <select
            className={styles.select}
            value={compareTarget}
            onChange={e => setCompareTarget(e.target.value)}
          >
            <option value="">Select an idea to compare against…</option>
            {otherIdeas.map(i => (
              <option key={i.name} value={i.name}>{i.name}</option>
            ))}
          </select>
          <button className={styles.goBtn} onClick={handleCompare} disabled={loading || !compareTarget}>
            {loading ? 'Comparing…' : 'Compare'}
          </button>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
