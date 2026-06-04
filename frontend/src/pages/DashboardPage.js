import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api';
import OpportunityCard from '../components/OpportunityCard';
import Disclaimer from '../components/Disclaimer';
import { saveReport, loadReports, deleteReport, makeId } from '../savedReports';
import styles from './DashboardPage.module.css';

// view: 'list' | 'detail' | 'generating' | 'generated'

export default function DashboardPage({ user, onLogout, onNavigate }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZip, setSelectedZip] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  const [sectorOpportunities, setSectorOpportunities] = useState([]);
  const [view, setView] = useState('list');           // which screen to show
  const [activeOpp, setActiveOpp] = useState(null);   // detail or generated idea
  const [generateError, setGenerateError] = useState('');
  const [savedReports, setSavedReports] = useState(() => loadReports());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resultsRef = useRef(null);

  function scrollToResults() {
    if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useEffect(() => {
    api.states().then(setStates).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedState) { setCities([]); setSelectedCity(''); return; }
    api.cities(selectedState).then(data => {
      setCities(data); setSelectedCity(''); setSelectedZip(''); setSelectedSector('');
    });
  }, [selectedState]);

  useEffect(() => {
    if (!selectedState || !selectedCity) { setZips([]); setSelectedZip(''); return; }
    api.zips(selectedState, selectedCity).then(data => {
      setZips(data); setSelectedZip(''); setSelectedSector('');
    });
  }, [selectedState, selectedCity]);

  useEffect(() => {
    if (!selectedZip) { setSectors([]); setSelectedSector(''); return; }
    api.sectors(selectedZip).then(setSectors);
  }, [selectedZip]);

  useEffect(() => {
    if (!selectedSector) { setSectorOpportunities([]); setView('list'); setActiveOpp(null); return; }
    setLoading(true);
    setError('');
    api.sectorOpportunities(selectedSector)
      .then(data => { setSectorOpportunities(data); setView('list'); setActiveOpp(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedSector]);

  const openDetail = useCallback((opp, isGenerated = false) => {
    setActiveOpp(opp);
    setView(isGenerated ? 'generated' : 'detail');
    setGenerateError('');
    scrollToResults();
    // Auto-save report
    const report = {
      id: opp._savedId || makeId(),
      type: isGenerated ? 'generated' : 'curated',
      name: opp.name,
      sector: selectedSector,
      zip: selectedZip,
      score: opp.score,
      timestamp: Date.now(),
      data: opp,
    };
    if (!opp._savedId) opp._savedId = report.id;
    setSavedReports(saveReport(report));
  }, [selectedSector, selectedZip]);

  const handleGenerateIdea = useCallback(async () => {
    setView('generating');
    setGenerateError('');
    setActiveOpp(null);
    scrollToResults();
    try {
      const idea = await api.generateIdea(selectedSector, selectedZip, selectedCity, selectedState);
      openDetail(idea, true);
    } catch (err) {
      setGenerateError(err.message);
      setView('list');
    }
  }, [selectedSector, selectedZip, selectedCity, selectedState, openDetail]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>BIG</span>
          <span className={styles.headerTitle}>Business Opportunity Intelligence</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.navBtn} onClick={() => onNavigate('competitive')}>⚔ Competitive Analysis</button>
          <span className={styles.userName}>{user.name}</span>
          <button className={styles.logoutBtn} onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <Disclaimer />

      <main className={styles.main}>
        {/* Filter panel */}
        <div className={styles.filterPanel}>
          <h2 className={styles.filterTitle}>Explore Opportunities</h2>
          <p className={styles.filterSub}>Select a location and sector to generate your business intelligence report.</p>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>State</label>
              <div className={styles.selectWrap}>
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                  <option value="">— Select state —</option>
                  {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>City</label>
              <div className={styles.selectWrap}>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!cities.length}>
                  <option value="">— Select city —</option>
                  {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>ZIP Code</label>
              <div className={styles.selectWrap}>
                <select value={selectedZip} onChange={e => setSelectedZip(e.target.value)} disabled={!zips.length}>
                  <option value="">— Select ZIP —</option>
                  {zips.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Industry Sector</label>
              <div className={styles.selectWrap}>
                <select value={selectedSector} onChange={e => setSelectedSector(e.target.value)} disabled={!sectors.length}>
                  <option value="">— Select sector —</option>
                  {sectors.map(s => (
                    <option key={s.name} value={s.name}>
                      {s.score ? `★ ${s.score.toFixed(1)}  ` : ''}{s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainColumns}>
        {/* Results */}
        <div className={styles.results} ref={resultsRef}>

          {/* Empty states */}
          {!selectedState && <EmptyState message="Select a state to get started." icon="🗺️" />}
          {selectedState && !selectedCity && <EmptyState message="Now select a city." icon="🏙️" />}
          {selectedCity && !selectedZip && <EmptyState message="Choose a ZIP code." icon="📍" />}
          {selectedZip && !selectedSector && <EmptyState message="Select an industry sector to see the opportunity analysis." icon="🏭" />}

          {/* Loading sector list */}
          {loading && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p>Loading opportunities…</p>
            </div>
          )}

          {error && <div className={styles.errorBox}>{error}</div>}

          {/* ── SCREEN: ranked list ── */}
          {!loading && view === 'list' && sectorOpportunities.length > 0 && (
            <div className={styles.rankedList}>
              <div className={styles.rankedHeader}>
                <h2 className={styles.rankedTitle}>Top 5 Opportunities — {selectedSector}</h2>
                <p className={styles.rankedSub}>Ranked by conviction score. Click any row to view the full intelligence report.</p>
              </div>
              {sectorOpportunities.map((opp, idx) => {
                const color = opp.score >= 9.0 ? '#10b981' : opp.score >= 8.0 ? '#f59e0b' : '#94a3b8';
                return (
                  <button key={opp.name} className={styles.rankedItem} onClick={() => openDetail(opp)}>
                    <span className={styles.rankedRank}>#{idx + 1}</span>
                    <div className={styles.rankedInfo}>
                      <div className={styles.rankedName}>{opp.name}</div>
                      <div className={styles.rankedMeta}>
                        <span>{opp.model}</span>
                        <span className={styles.rankedDot}>·</span>
                        <span>Startup: {opp.startupCost}</span>
                        <span className={styles.rankedDot}>·</span>
                        <span>Margin: {opp.grossMargin}</span>
                        <span className={styles.rankedDot}>·</span>
                        <span>Yr1: {opp.revenueYr1}</span>
                      </div>
                    </div>
                    <span className={styles.rankedScore} style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
                      ★ {opp.score.toFixed(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── SCREEN: detail (curated) ── */}
          {view === 'detail' && activeOpp && (
            <div>
              <div className={styles.screenBar}>
                <button className={styles.backBtn} onClick={() => { setView('list'); setActiveOpp(null); }}>
                  ← Back to rankings
                </button>
                <button className={styles.generateBtn} onClick={handleGenerateIdea}>
                  ✦ Generate New Business Idea
                </button>
              </div>
              {generateError && <div className={styles.generateError}>{generateError}</div>}
              <OpportunityCard opportunity={activeOpp} zip={selectedZip} sector={selectedSector} />
            </div>
          )}

          {/* ── SCREEN: generating ── */}
          {view === 'generating' && (
            <div className={styles.generatingScreen}>
              <div className={styles.generatingSpinner} />
              <h3 className={styles.generatingTitle}>Crafting a new business idea…</h3>
              <p className={styles.generatingSubtitle}>AI is analysing the {selectedSector} sector{selectedCity ? ` in ${selectedCity}` : ''} and building a full opportunity report.</p>
            </div>
          )}

          {/* ── SCREEN: generated idea ── */}
          {view === 'generated' && activeOpp && (
            <div>
              <div className={styles.screenBar}>
                <button className={styles.backBtn} onClick={() => { setView('list'); setActiveOpp(null); }}>
                  ← Back to rankings
                </button>
                <div className={styles.generatedActions}>
                  <span className={styles.generatedBadge}>✦ AI-Generated</span>
                  <button className={styles.generateBtn} onClick={handleGenerateIdea}>
                    ✦ Generate Another
                  </button>
                </div>
              </div>
              <OpportunityCard opportunity={activeOpp} zip={selectedZip} sector={selectedSector} />
            </div>
          )}

        </div>

        {/* Saved Reports Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>📁 Recent Reports</span>
            {savedReports.length > 0 && (
              <span className={styles.sidebarCount}>{savedReports.length}</span>
            )}
          </div>
          {savedReports.length === 0 ? (
            <p className={styles.sidebarEmpty}>Reports you view will be saved here automatically.</p>
          ) : (
            <div className={styles.sidebarList}>
              {savedReports.map(r => {
                const color = r.score >= 9.0 ? '#10b981' : r.score >= 8.0 ? '#f59e0b' : '#94a3b8';
                const timeAgo = getTimeAgo(r.timestamp);
                return (
                  <div key={r.id} className={styles.sidebarItem}>
                    <button className={styles.sidebarItemBtn} onClick={() => openDetail(r.data, r.type === 'generated')}>
                      <div className={styles.sidebarItemTop}>
                        <span className={styles.sidebarItemName}>{r.name}</span>
                        {r.score > 0 && (
                          <span className={styles.sidebarScore} style={{ color }}>★ {r.score.toFixed(1)}</span>
                        )}
                      </div>
                      <div className={styles.sidebarItemMeta}>
                        {r.type === 'generated' && <span className={styles.aiBadge}>AI</span>}
                        <span>{r.sector}</span>
                        {r.zip && <><span className={styles.rankedDot}>·</span><span>{r.zip}</span></>}
                        <span className={styles.rankedDot}>·</span>
                        <span>{timeAgo}</span>
                      </div>
                    </button>
                    <button className={styles.sidebarDelete} onClick={() => setSavedReports(deleteReport(r.id))} title="Remove">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}

function getTimeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function EmptyState({ message, icon }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontSize: 16 }}>{message}</p>
    </div>
  );
}
