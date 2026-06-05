import React, { useState, useEffect, useCallback } from 'react';
import {
  getSavedOpportunities,
  updateNotes,
  deleteOpportunity,
} from '../api/savedOpportunities';
import WatchlistButton from '../components/WatchlistButton';
import './SavedDashboard.css';

// ── Score badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score, conviction }) {
  const getColor = (s) => {
    if (s >= 8) return { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' };
    if (s >= 6) return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
    if (s >= 4) return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' };
    return         { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
  };
  const c = getColor(score);
  return (
    <div className="sd-score-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      <span className="sd-score-num">{score}</span>
      <span className="sd-score-label">/10</span>
      {conviction && <span className="sd-score-conviction">{conviction}</span>}
    </div>
  );
}

// ── Verdict badge ─────────────────────────────────────────────────────────────
function VerdictBadge({ verdict }) {
  const map = {
    Buy:      { bg: '#d1fae5', color: '#065f46' },
    Cautious: { bg: '#fef3c7', color: '#92400e' },
    Pass:     { bg: '#fee2e2', color: '#991b1b' },
  };
  const style = map[verdict] || { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span className="sd-verdict-badge" style={{ background: style.bg, color: style.color }}>
      {verdict}
    </span>
  );
}

// ── Inline notes editor ───────────────────────────────────────────────────────
function NotesEditor({ opportunityId, initialNotes, onSaved }) {
  const [notes, setNotes]   = useState(initialNotes || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

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
      <div className="sd-notes-display" onClick={() => setEditing(true)} title="Click to edit notes">
        {notes
          ? <p className="sd-notes-text">{notes}</p>
          : <span className="sd-notes-placeholder">+ Add notes...</span>
        }
      </div>
    );
  }

  return (
    <div className="sd-notes-editor">
      <textarea
        className="sd-notes-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Your thoughts, next steps, reminders..."
        maxLength={5000}
        autoFocus
        rows={3}
      />
      <div className="sd-notes-actions">
        <button className="sd-notes-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save notes'}
        </button>
        <button className="sd-notes-cancel" onClick={() => { setEditing(false); setNotes(initialNotes || ''); }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Dashboard card ────────────────────────────────────────────────────────────
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

  // Resolve display name — live cards use opportunityName, AI idea cards use name
  const displayName = opp.opportunity_name || opp.card_name || `${opp.sector_label || opp.sector} Opportunity`;

  // Resolve startup cost display
  const startupCost = opp.startup_cost_raw ||
    (opp.startup_cost_min
      ? `$${Math.round(opp.startup_cost_min / 1000)}K–$${Math.round((opp.startup_cost_max || opp.startup_cost_min) / 1000)}K`
      : null);

  const revenueYr1 = opp.revenue_yr1_raw ||
    (opp.revenue_year1_min
      ? `$${Math.round(opp.revenue_year1_min / 1000)}K–$${Math.round((opp.revenue_year1_max || opp.revenue_year1_min) / 1000)}K`
      : null);

  return (
    <article className={`sd-card ${opp.is_watchlisted ? 'sd-card-watchlisted' : ''}`}>
      <div className="sd-card-header">
        <div className="sd-card-header-left">
          <ScoreBadge score={opp.score} conviction={opp.conviction} />
          <div className="sd-card-title-group">
            <h3 className="sd-card-name">{displayName}</h3>
            {opp.tagline && <p className="sd-card-tagline">{opp.tagline}</p>}
          </div>
        </div>
        <WatchlistButton
          opportunityId={opp.id}
          initialValue={opp.is_watchlisted}
          onToggle={onWatchlistToggle}
        />
      </div>

      <div className="sd-card-meta">
        <span className="sd-meta-location">📍 {opp.city}, {opp.state} {opp.zip}</span>
        <span className="sd-meta-sector">🏷 {opp.sector_label || opp.sector}</span>
        {opp.verdict && <VerdictBadge verdict={opp.verdict} />}
        {opp.demand_trend && (
          <span className={`sd-trend sd-trend-${(opp.demand_trend || '').toLowerCase()}`}>
            {opp.demand_trend === 'Rising' ? '📈' : opp.demand_trend === 'Declining' ? '📉' : '➡️'} {opp.demand_trend}
          </span>
        )}
      </div>

      {(startupCost || revenueYr1) && (
        <div className="sd-financials">
          {startupCost && (
            <div className="sd-fin-item">
              <span className="sd-fin-label">Startup Cost</span>
              <span className="sd-fin-value">{startupCost}</span>
            </div>
          )}
          {revenueYr1 && (
            <div className="sd-fin-item">
              <span className="sd-fin-label">Year 1 Revenue</span>
              <span className="sd-fin-value">{revenueYr1}</span>
            </div>
          )}
        </div>
      )}

      {opp.tags && opp.tags.length > 0 && (
        <div className="sd-tags">
          {opp.tags.map(tag => <span key={tag} className="sd-tag">{tag}</span>)}
        </div>
      )}

      <NotesEditor
        opportunityId={opp.id}
        initialNotes={opp.notes}
        onSaved={(notes) => onNotesUpdate && onNotesUpdate(opp.id, notes)}
      />

      <div className="sd-card-footer">
        <span className="sd-saved-date">Saved {savedDate}</span>
        <button
          className="sd-delete-btn"
          onClick={handleDelete}
          disabled={deleting}
          title="Remove from dashboard"
        >
          {deleting ? '···' : '✕ Remove'}
        </button>
      </div>
    </article>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar({ stats }) {
  if (!stats) return null;
  return (
    <div className="sd-stats-bar">
      {[
        { value: stats.total_saved || 0,       label: 'Saved' },
        { value: stats.watchlisted || 0,        label: 'Watchlisted' },
        { value: stats.avg_score || '—',        label: 'Avg Score' },
        { value: stats.sectors_explored || 0,   label: 'Sectors' },
        { value: stats.cities_explored || 0,    label: 'Cities' },
      ].map(({ value, label }) => (
        <div key={label} className="sd-stat-item">
          <span className="sd-stat-value">{value}</span>
          <span className="sd-stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ watchlistOnly, onNavigate }) {
  return (
    <div className="sd-empty">
      <div className="sd-empty-icon">{watchlistOnly ? '⭐' : '📊'}</div>
      <h3 className="sd-empty-title">
        {watchlistOnly ? 'Your watchlist is empty' : 'No saved opportunities yet'}
      </h3>
      <p className="sd-empty-desc">
        {watchlistOnly
          ? 'Star any saved opportunity to add it to your watchlist.'
          : 'Generate a business opportunity analysis and click "+ Save" to start building your dashboard.'}
      </p>
      {!watchlistOnly && (
        <button className="sd-empty-cta" onClick={() => onNavigate && onNavigate('dashboard')}>
          Explore Opportunities →
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
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

export default function SavedDashboard({ onNavigate }) {
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats]                 = useState(null);
  const [total, setTotal]                 = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const [activeTab, setActiveTab]       = useState('all');
  const [sortBy, setSortBy]             = useState('score');
  const [sortDir, setSortDir]           = useState('DESC');
  const [filterSector, setFilterSector] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('');
  const [search, setSearch]             = useState('');
  const [searchInput, setSearchInput]   = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSavedOpportunities({
        sortBy, sortDir,
        sector:       filterSector  || null,
        verdict:      filterVerdict || null,
        watchlistOnly: activeTab === 'watchlist',
        search:       search        || null,
      });
      setOpportunities(result.opportunities);
      setStats(result.stats);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
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
    setOpportunities(prev =>
      prev.map(o => o.id === id ? { ...o, is_watchlisted: newValue } : o),
    );
    setStats(prev => prev ? {
      ...prev,
      watchlisted: newValue
        ? parseInt(prev.watchlisted) + 1
        : Math.max(0, parseInt(prev.watchlisted) - 1),
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
    <main className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-title">My Saved Opportunities</h1>
          <p className="sd-subtitle">
            {total > 0 ? `${total} saved opportunit${total === 1 ? 'y' : 'ies'}` : 'Your saved business opportunities'}
          </p>
        </div>
        <button className="sd-back-btn" onClick={() => onNavigate && onNavigate('dashboard')}>
          ← Explore
        </button>
      </div>

      <StatsBar stats={stats} />

      <div className="sd-tabs">
        <button className={`sd-tab ${activeTab === 'all' ? 'sd-tab-active' : ''}`} onClick={() => setActiveTab('all')}>
          All Saved {total > 0 && <span className="sd-tab-count">{total}</span>}
        </button>
        <button className={`sd-tab ${activeTab === 'watchlist' ? 'sd-tab-active' : ''}`} onClick={() => setActiveTab('watchlist')}>
          ⭐ Watchlist {stats?.watchlisted > 0 && <span className="sd-tab-count">{stats.watchlisted}</span>}
        </button>
      </div>

      <div className="sd-toolbar">
        <input
          className="sd-search"
          type="text"
          placeholder="Search by name, city, sector..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <select className="sd-select" value={filterSector} onChange={e => setFilterSector(e.target.value)}>
          {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="sd-select" value={filterVerdict} onChange={e => setFilterVerdict(e.target.value)}>
          <option value="">All Verdicts</option>
          <option value="Buy">Buy</option>
          <option value="Cautious">Cautious</option>
          <option value="Pass">Pass</option>
        </select>
        <div className="sd-sort-group">
          <select className="sd-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="score">Score</option>
            <option value="created_at">Date Saved</option>
            <option value="city">City</option>
            <option value="sector">Sector</option>
          </select>
          <button
            className="sd-sort-dir"
            onClick={() => setSortDir(d => d === 'DESC' ? 'ASC' : 'DESC')}
            title="Toggle sort direction"
          >
            {sortDir === 'DESC' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {error && (
        <div className="sd-error">
          ⚠️ {error}
          <button onClick={fetchDashboard} className="sd-retry">Retry</button>
        </div>
      )}

      {loading && (
        <div className="sd-loading">
          <div className="sd-spinner" />
          Loading your opportunities...
        </div>
      )}

      {!loading && !error && opportunities.length === 0 && (
        <EmptyState watchlistOnly={activeTab === 'watchlist'} onNavigate={onNavigate} />
      )}

      {!loading && !error && opportunities.length > 0 && (
        <div className="sd-grid">
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
    </main>
  );
}
