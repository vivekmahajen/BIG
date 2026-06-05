import { useState } from 'react';
import { toggleWatchlist } from '../api/savedOpportunities';
import styles from './WatchlistButton.module.css';

export default function WatchlistButton({ opportunityId, initialValue = false, onToggle }) {
  const [active, setActive] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e) {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const result = await toggleWatchlist(opportunityId);
      setActive(result.isWatchlisted);
      if (onToggle) onToggle(opportunityId, result.isWatchlisted);
    } catch (err) {
      console.error('Watchlist toggle failed:', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`${styles.btn} ${active ? styles.active : styles.inactive}`}
      onClick={handleToggle}
      disabled={loading}
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={active}
    >
      {loading ? '···' : active ? '⭐' : '☆'}
    </button>
  );
}
