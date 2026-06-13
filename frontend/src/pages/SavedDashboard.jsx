import { useState, useEffect, useCallback } from 'react';
import {
  getSavedOpportunities,
  updateNotes,
  deleteOpportunity,
} from '../api/savedOpportunities';
import WatchlistButton from '../components/WatchlistButton';
import './SavedDashboard.css';

function ScoreBadge({ score }) {
  const s = parseFloat(score) || 0;
  const getColor = (v) => {
    if (v >= 8) return { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' };
    if (v >= 6) return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
    if (v >= 4) return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' };
    return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
  };
  const c = getColor(s);
  return (
    <div className="sdash-score-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      <span className="sdash-score-num">{s % 1 === 0 ? s : s.toFixed(1)}</span>
      <span className="sdash-score-denom">/10</span>
    </div>
  );
}

function VerdictBadge({ verdict }) {
  const map = {
    Buy:      { bg: '#d1fae5', color: '#065f46' },
    Cautious: { bg: '#fef3c7', color: '#92400e' },
    Pass:     { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[verdict] || { bg: '#f3f4f6', color: '#6b7280' };
  if (!verdict) return null;
  return <span className="sdash-verdict" style={{ background: s.bg, color: s.color }}>{verdict}</span>;
}

function NotesEditor({ opportunityId, initialNotes, onSaved }) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateNotes(opportunityId, notes);
      setEditing(false);
      if (onSaved) onSaved(notes);
    } catch (err) {
      console.error('Notes save failed:', err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="sdash-notes-display" onClick={() => setEditing(true)} title="Click to edit notes">
        {notes
          ? <p className="sdash-notes-text">{notes}</p>
          : <span className="sdash-notes-placeholder">+ Add notes…</span>
        }
      </div>
    );
  }

  return (
    <div className="sdash-notes-editor">
      <textarea
        className="sdash-notes-ta"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Your thoughts, next steps, reminders…"
        maxLength={5000}
        autoFocus
        rows={3}
      />
      <div className="sdash-notes-actions">
        <button className="sdash-notes-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save notes'}
        </button>
        <button className="sdash-notes-cancel" onClick={() => { setEditing(false); setNotes(initialNotes || ''); }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function DashboardCard({ opp, onWatchlistToggle, onDelete, onNotesUpdate }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Remove this opportunity from your dashboard?')) return;
    setDeleting(true);
    try {
      await deleteOpportunity(opp.id);
      if (onDelete) onDelete(opp.id);
    } catch (err) {
      console.error('Delete failed:', err.message);
      setDeleting(false);
    }
  }

  const savedDate = new Date(opp.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const displayName = opp.opportunity_name || opp.opportunity_name_alt || `${opp.sector_label || opp.sector} Opportunity`;
  const trendClass = (opp.demand_trend || '').toLowerCase();

  return (
    <article className={`sdash-card ${opp.is_watchlisted ? 'sdash-card-watchlisted' : ''}`}>
      <div className="sdash-card-header">
        <div className="sdash-card-header-left">
          <ScoreBadge score={opp.score} />
          <div className="sdash-card-title-group">
            <h3 className="sdash-card-name">{displayName}</h3>
            {opp.tagline && <p className="sdash-card-tagline">{opp.tagline}</p>}
          </div>
        </div>
        <WatchlistButton
          opportunityId={opp.id}
          initialValue={opp.is_watchlisted}
          onToggle={onWatchlistToggle}
        />
      </div>

      <div className="sdash-meta-row">
        <span className="sdash-location">📍 {opp.city}, {opp.state} {opp.zip}</span>
        <span className="sdash-sector-tag">🏷 {opp.sector_label || opp.sector}</span>
        <VerdictBadge verdict={opp.verdict} />
        {opp.demand_trend && (
          <span className={`sdash-trend sdash-trend-${trendClass}`}>
            {opp.demand_trend === 'Rising' ? '📈' : opp.demand_trend === 'Declining' ? '📉' : '➡️'} {opp.demand_trend}
          </span>
        )}
      </div>

      {(opp.startup_cost_min || opp.startup_cost_raw || opp.revenue_year1_min || opp.revenue_yr1_raw) && (
        <div className="sdash-financials">
          {(opp.startup_cost_min || opp.startup_cost_raw) && (
            <div className="sdash-fin-item">
              <span className="sdash-fin-label">Startup Cost</span>
              <span className="sdash-fin-value">
                {opp.startup_cost_raw
                  ? opp.startup_cost_raw
                  : `$${(parseInt(opp.startup_cost_min) / 1000).toFixed(0)}K–$${(parseInt(opp.startup_cost_max || opp.startup_cost_min) / 1000).toFixed(0)}K`
                }
              </span>
            </div>
          )}
          {(opp.revenue_year1_min || opp.revenue_yr1_raw) && (
            <div className="sdash-fin-item">
              <span className="sdash-fin-label">Year 1 Revenue</span>
              <span className="sdash-fin-value">
                {opp.revenue_yr1_raw
                  ? opp.revenue_yr1_raw
                  : `$${(parseInt(opp.revenue_year1_min) / 1000).toFixed(0)}K–$${(parseInt(opp.revenue_year1_max || opp.revenue_year1_min) / 1000).toFixed(0)}K`
                }
              </span>
            </div>
          )}
        </div>
      )}

      {opp.tags && opp.tags.length > 0 && (
        <div className="sdash-tags">
          {opp.tags.map(tag => <span key={tag} className="sdash-tag">{tag}</span>)}
        </div>
      )}

      <NotesEditor
        opportunityId={opp.id}
        initialNotes={opp.notes}
        onSaved={notes => onNotesUpdate && onNotesUpdate(opp.id, notes)}
      />

      <div className="sdash-card-footer">
        <span className="sdash-card-date">Saved {savedDate}</span>
        <button className="sdash-delete-btn" onClick={handleDelete} disabled={deleting} title="Remove from dashboard">
          {deleting ? '···' : '✕'}
        </button>
      </div>
    </article>
  );
}

function StatsBar({ stats }) {
  if (!stats) return null;
  return (
    <div className="sdash-stats">
      <div className="sdash-stat"><span className="sdash-stat-val">{stats.total_saved || 0}</span><span className="sdash-stat-lbl">Saved</span></div>
      <div className="sdash-stat"><span className="sdash-stat-val">{stats.watchlisted || 0}</span><span className="sdash-stat-lbl">Watchlisted</span></div>
      <div className="sdash-stat"><span className="sdash-stat-val">{stats.avg_score || '—'}</span><span className="sdash-stat-lbl">Avg Score</span></div>
      <div className="sdash-stat"><span className="sdash-stat-val">{stats.sectors_explored || 0}</span><span className="sdash-stat-lbl">Sectors</span></div>
      <div className="sdash-stat"><span className="sdash-stat-val">{stats.cities_explored || 0}</span><span className="sdash-stat-lbl">Cities</span></div>
    </div>
  );
}

function EmptyState({ watchlistOnly, onExplore }) {
  return (
    <div className="sdash-empty">
      <div className="sdash-empty-icon">{watchlistOnly ? '⭐' : '📊'}</div>
      <h3 className="sdash-empty-title">{watchlistOnly ? 'Your watchlist is empty' : 'No saved opportunities yet'}</h3>
      <p className="sdash-empty-desc">
        {watchlistOnly
          ? 'Star any saved opportunity to add it to your watchlist.'
          : 'Generate a business opportunity analysis and click "Save to Dashboard" to build your collection.'}
      </p>
      {!watchlistOnly && (
        <button className="sdash-explore-btn" onClick={onExplore}>Explore Opportunities →</button>
      )}
    </div>
  );
}

const SECTORS = [
  { id: '', label: 'All Sectors' },
  { id: 'food_beverage', label: 'Food & Beverage' },
  { id: 'technology', label: 'Technology' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'financial_services', label: 'Financial Services' },
  { id: 'retail', label: 'Retail' },
  { id: 'real_estate', label: 'Real Estate' },
  { id: 'education', label: 'Education' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'wellness', label: 'Wellness & Fitness' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'energy', label: 'Energy' },
  { id: 'professional_services', label: 'Professional Services' },
  { id: 'transportation', label: 'Transportation' },
];

export default function SavedDashboard({ user, onBack, onLogout }) {
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats]                 = useState(null);
  const [total, setTotal]                 = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [dbMissing, setDbMissing]         = useState(false);

  const [activeTab, setActiveTab]         = useState('all');
  const [sortBy, setSortBy]               = useState('score');
  const [sortDir, setSortDir]             = useState('DESC');
  const [filterSector, setFilterSector]   = useState('');
  const [filterVerdict, setFilterVerdict] = useState('');
  const [search, setSearch]               = useState('');
  const [searchInput, setSearchInput]     = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDbMissing(false);
    try {
      const result = await getSavedOpportunities({
        sortBy, sortDir,
        sector: filterSector || null,
        verdict: filterVerdict || null,
        watchlistOnly: activeTab === 'watchlist',
        search: search || null,
      });
      setOpportunities(result.opportunities);
      setStats(result.stats);
      setTotal(result.total);
    } catch (err) {
      if (err.message.includes('503') || err.message.toLowerCase().includes('database')) {
        setDbMissing(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortDir, filterSector, filterVerdict, activeTab, search]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleWatchlistToggle(id, newValue) {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, is_watchlisted: newValue } : o));
    setStats(prev => prev ? {
      ...prev,
      watchlisted: newValue ? parseInt(prev.watchlisted) + 1 : Math.max(0, parseInt(prev.watchlisted) - 1),
    } : prev);
    if (activeTab === 'watchlist' && !newValue) {
      setOpportunities(prev => prev.filter(o => o.id !== id));
    }
  }

  function handleDelete(id) {
    setOpportunities(prev => prev.filter(o => o.id !== id));
    setTotal(prev => Math.max(0, prev - 1));
    setStats(prev => prev ? { ...prev, total_saved: Math.max(0, parseInt(prev.total_saved) - 1) } : prev);
  }

  function handleNotesUpdate(id, notes) {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, notes } : o));
  }

  return (
    <div className="sdash">
      <div className="sdash-header">
        <div>
          <h1 className="sdash-title">My Saved Dashboard</h1>
          <p className="sdash-subtitle">
            {total > 0 ? `${total} saved opportunit${total === 1 ? 'y' : 'ies'}` : 'Your saved business opportunities'}
          </p>
        </div>
        <div className="sdash-header-right">
          <button className="sdash-back-btn" onClick={onBack}>← Back to Explorer</button>
          {onLogout && <button className="sdash-back-btn" onClick={onLogout}>Sign out</button>}
        </div>
      </div>

      <StatsBar stats={stats} />

      <div className="sdash-tabs">
        <button className={`sdash-tab ${activeTab === 'all' ? 'sdash-tab-active' : ''}`} onClick={() => setActiveTab('all')}>
          All Saved {total > 0 && <span className="sdash-tab-count">{total}</span>}
        </button>
        <button className={`sdash-tab ${activeTab === 'watchlist' ? 'sdash-tab-active' : ''}`} onClick={() => setActiveTab('watchlist')}>
          ⭐ Watchlist {parseInt(stats?.watchlisted) > 0 && <span className="sdash-tab-count">{stats.watchlisted}</span>}
        </button>
      </div>

      <div className="sdash-toolbar">
        <input
          className="sdash-search"
          type="text"
          placeholder="Search opportunities, cities, sectors…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <select className="sdash-select" value={filterSector} onChange={e => setFilterSector(e.target.value)}>
          {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="sdash-select" value={filterVerdict} onChange={e => setFilterVerdict(e.target.value)}>
          <option value="">All Verdicts</option>
          <option value="Buy">Buy</option>
          <option value="Cautious">Cautious</option>
          <option value="Pass">Pass</option>
        </select>
        <div className="sdash-sort-group">
          <select className="sdash-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="score">Sort: Score</option>
            <option value="created_at">Sort: Date Saved</option>
            <option value="city">Sort: City</option>
            <option value="sector">Sort: Sector</option>
          </select>
          <button className="sdash-sort-dir" onClick={() => setSortDir(d => d === 'DESC' ? 'ASC' : 'DESC')}>
            {sortDir === 'DESC' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {dbMissing && (
        <div className="sdash-db-notice">
          ⚠️ Database not connected. To enable saving, set the <code>DATABASE_URL</code> environment variable on Render (your backend service → Environment tab).
        </div>
      )}

      {error && !dbMissing && (
        <div className="sdash-error">
          ⚠️ {error}
          <button onClick={fetchDashboard} className="sdash-retry">Retry</button>
        </div>
      )}

      {loading && (
        <div className="sdash-loading">
          <div className="sdash-spinner" />
          <span>Loading your opportunities…</span>
        </div>
      )}

      {!loading && !error && !dbMissing && opportunities.length === 0 && (
        <EmptyState watchlistOnly={activeTab === 'watchlist'} onExplore={onBack} />
      )}

      {!loading && !error && !dbMissing && opportunities.length > 0 && (
        <div className="sdash-grid">
          {opportunities.map(opp => (
            <DashboardCard
              key={opp.id}
              opp={opp}
              onWatchlistToggle={handleWatchlistToggle}
              onDelete={handleDelete}
              onNotesUpdate={handleNotesUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
