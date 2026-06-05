import { useState, useEffect, useCallback } from 'react';
import { getSavedOpportunities, toggleWatchlist, updateNotes, deleteOpportunity } from '../api/savedOpportunities';
import WatchlistButton from '../components/WatchlistButton';
import styles from './SavedDashboard.module.css';

function ScoreBadge({ score }) {
  const s = parseFloat(score) || 0;
  const color = s >= 8 ? { bg: '#d1fae5', fg: '#065f46', border: '#6ee7b7' }
              : s >= 6 ? { bg: '#fef3c7', fg: '#92400e', border: '#fcd34d' }
              :           { bg: '#fee2e2', fg: '#991b1b', border: '#fca5a5' };
  return (
    <div className={styles.scoreBadge} style={{ background: color.bg, color: color.fg, borderColor: color.border }}>
      <span className={styles.scoreNum}>{s.toFixed(1)}</span>
      <span className={styles.scoreLabel}>/10</span>
    </div>
  );
}

function NotesEditor({ id, initial, onSaved }) {
  const [notes, setNotes] = useState(initial || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateNotes(id, notes);
      setEditing(false);
      if (onSaved) onSaved(notes);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className={styles.notesDisplay} onClick={() => setEditing(true)} title="Click to edit">
        {notes ? <p className={styles.notesText}>{notes}</p> : <span className={styles.notesPlaceholder}>+ Add notes...</span>}
      </div>
    );
  }
  return (
    <div className={styles.notesEditor}>
      <textarea className={styles.notesTextarea} value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="Your thoughts, next steps..." rows={3} maxLength={5000} autoFocus />
      <div className={styles.notesActions}>
        <button className={styles.notesSave} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button className={styles.notesCancel} onClick={() => { setEditing(false); setNotes(initial || ''); }}>Cancel</button>
      </div>
    </div>
  );
}

function SavedCard({ opp, onWatchlistToggle, onDelete, onNotesUpdate }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Remove this opportunity from your dashboard?')) return;
    setDeleting(true);
    try {
      await deleteOpportunity(opp.id);
      if (onDelete) onDelete(opp.id);
    } catch (e) {
      console.error(e);
      setDeleting(false);
    }
  }

  const date = new Date(opp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <article className={`${styles.card} ${opp.is_watchlisted ? styles.cardWatchlisted : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <ScoreBadge score={opp.score} />
          <div className={styles.cardTitles}>
            <h3 className={styles.cardName}>{opp.opportunity_name || opp.sector_label || 'Opportunity'}</h3>
            {opp.tagline && <p className={styles.cardTagline}>{opp.tagline.length > 100 ? opp.tagline.substring(0, 100) + '…' : opp.tagline}</p>}
          </div>
        </div>
        <WatchlistButton opportunityId={opp.id} initialValue={opp.is_watchlisted} onToggle={onWatchlistToggle} />
      </div>

      <div className={styles.cardMeta}>
        <span>📍 {opp.city}, {opp.state} {opp.zip}</span>
        <span>🏷 {opp.sector_label || opp.sector}</span>
        {opp.startup_cost && <span>💰 {opp.startup_cost}</span>}
        {opp.revenue_yr1 && <span>📈 Yr1: {opp.revenue_yr1}</span>}
        {opp.live_generated && <span className={styles.liveBadge}>⚡ Live</span>}
      </div>

      <NotesEditor id={opp.id} initial={opp.notes} onSaved={notes => onNotesUpdate && onNotesUpdate(opp.id, notes)} />

      <div className={styles.cardFooter}>
        <span className={styles.savedDate}>Saved {date}</span>
        <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting} title="Remove">
          {deleting ? '···' : '✕'}
        </button>
      </div>
    </article>
  );
}

function StatsBar({ stats }) {
  if (!stats) return null;
  const items = [
    { val: stats.total_saved || 0, label: 'Saved' },
    { val: stats.watchlisted || 0, label: 'Watchlisted' },
    { val: stats.avg_score || '—', label: 'Avg Score' },
    { val: stats.sectors_explored || 0, label: 'Sectors' },
    { val: stats.cities_explored || 0, label: 'Cities' },
  ];
  return (
    <div className={styles.statsBar}>
      {items.map(({ val, label }) => (
        <div key={label} className={styles.statItem}>
          <span className={styles.statVal}>{val}</span>
          <span className={styles.statLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SavedDashboard({ onNavigate }) {
  const [opps, setOpps]       = useState([]);
  const [stats, setStats]     = useState(null);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tab, setTab]         = useState('all');
  const [sortBy, setSortBy]   = useState('score');
  const [sortDir, setSortDir] = useState('DESC');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]   = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await getSavedOpportunities({
        sortBy, sortDir,
        watchlistOnly: tab === 'watchlist' ? 'true' : null,
        search: search || null,
      });
      setOpps(result.opportunities);
      setStats(result.stats);
      setTotal(result.total);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortDir, tab, search]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  function handleWatchlistToggle(id, newVal) {
    setOpps(prev => prev.map(o => o.id === id ? { ...o, is_watchlisted: newVal } : o));
    if (tab === 'watchlist' && !newVal) setOpps(prev => prev.filter(o => o.id !== id));
    setStats(prev => prev ? { ...prev, watchlisted: newVal ? +prev.watchlisted + 1 : Math.max(0, +prev.watchlisted - 1) } : prev);
  }

  function handleDelete(id) {
    setOpps(prev => prev.filter(o => o.id !== id));
    setTotal(prev => Math.max(0, prev - 1));
    setStats(prev => prev ? { ...prev, total_saved: Math.max(0, +prev.total_saved - 1) } : prev);
  }

  function handleNotesUpdate(id, notes) {
    setOpps(prev => prev.map(o => o.id === id ? { ...o, notes } : o));
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Dashboard</h1>
          <p className={styles.subtitle}>{total > 0 ? `${total} saved opportunit${total === 1 ? 'y' : 'ies'}` : 'Your saved business opportunities'}</p>
        </div>
        <button className={styles.exploreBtn} onClick={() => onNavigate('dashboard')}>+ Explore Opportunities</button>
      </div>

      <StatsBar stats={stats} />

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'all' ? styles.tabActive : ''}`} onClick={() => setTab('all')}>
          All Saved {total > 0 && <span className={styles.tabCount}>{total}</span>}
        </button>
        <button className={`${styles.tab} ${tab === 'watchlist' ? styles.tabActive : ''}`} onClick={() => setTab('watchlist')}>
          ⭐ Watchlist {stats?.watchlisted > 0 && <span className={styles.tabCount}>{stats.watchlisted}</span>}
        </button>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search opportunities, cities..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        <select className={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="score">Sort: Score</option>
          <option value="created_at">Sort: Date Saved</option>
          <option value="city">Sort: City</option>
        </select>
        <button className={styles.sortDir} onClick={() => setSortDir(d => d === 'DESC' ? 'ASC' : 'DESC')} title="Toggle direction">
          {sortDir === 'DESC' ? '↓' : '↑'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>⚠️ {error} <button className={styles.retry} onClick={fetch}>Retry</button></div>
      )}

      {loading && (
        <div className={styles.loading}><div className={styles.spinner} /> Loading your dashboard...</div>
      )}

      {!loading && !error && opps.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>{tab === 'watchlist' ? '⭐' : '📊'}</div>
          <h3 className={styles.emptyTitle}>{tab === 'watchlist' ? 'Watchlist is empty' : 'No saved opportunities yet'}</h3>
          <p className={styles.emptyDesc}>
            {tab === 'watchlist'
              ? 'Star any saved card to add it to your watchlist.'
              : 'Generate an opportunity card and click "+ Save" to build your dashboard.'}
          </p>
          {tab !== 'watchlist' && (
            <button className={styles.emptyCta} onClick={() => onNavigate('dashboard')}>Explore Opportunities →</button>
          )}
        </div>
      )}

      {!loading && !error && opps.length > 0 && (
        <div className={styles.grid}>
          {opps.map(opp => (
            <SavedCard key={opp.id} opp={opp}
              onWatchlistToggle={handleWatchlistToggle}
              onDelete={handleDelete}
              onNotesUpdate={handleNotesUpdate}
            />
          ))}
        </div>
      )}
    </main>
  );
}
