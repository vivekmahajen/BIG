import React, { useState } from 'react';
import { toggleWatchlist } from '../api/savedOpportunities';
import './WatchlistButton.css';

export default function WatchlistButton({ opportunityId, initialValue = false, onToggle }) {
  const [isWatchlisted, setIsWatchlisted] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e) {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const result = await toggleWatchlist(opportunityId);
      setIsWatchlisted(result.isWatchlisted);
      if (onToggle) onToggle(opportunityId, result.isWatchlisted);
    } catch (err) {
      console.error('Watchlist toggle failed:', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`watchlist-btn ${isWatchlisted ? 'watchlist-active' : 'watchlist-inactive'}`}
      onClick={handleToggle}
      disabled={loading}
      title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={isWatchlisted}
    >
      {loading ? '···' : isWatchlisted ? '⭐' : '☆'}
    </button>
  );
}
