import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import OpportunityCard from '../components/OpportunityCard';
import styles from './DashboardPage.module.css';

export default function DashboardPage({ user, onLogout }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZip, setSelectedZip] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  const [opportunity, setOpportunity] = useState(null);
  const [sectorOpportunities, setSectorOpportunities] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.states().then(setStates).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedState) { setCities([]); setSelectedCity(''); return; }
    api.cities(selectedState).then(data => { setCities(data); setSelectedCity(''); setSelectedZip(''); setSelectedSector(''); setOpportunity(null); });
  }, [selectedState]);

  useEffect(() => {
    if (!selectedState || !selectedCity) { setZips([]); setSelectedZip(''); return; }
    api.zips(selectedState, selectedCity).then(data => { setZips(data); setSelectedZip(''); setSelectedSector(''); setOpportunity(null); });
  }, [selectedState, selectedCity]);

  useEffect(() => {
    if (!selectedZip) { setSectors([]); setSelectedSector(''); return; }
    api.sectors(selectedZip).then(setSectors);
  }, [selectedZip]);

  useEffect(() => {
    if (!selectedSector) { setSectorOpportunities([]); setSelectedOpp(null); setGeneratedIdea(null); return; }
    api.sectorOpportunities(selectedSector)
      .then(data => { setSectorOpportunities(data); setSelectedOpp(null); setGeneratedIdea(null); })
      .catch(() => setSectorOpportunities([]));
  }, [selectedSector]);

  const handleGenerateIdea = async () => {
    setGenerating(true);
    setGenerateError('');
    setGeneratedIdea(null);
    setSelectedOpp(null);
    try {
      const idea = await api.generateIdea(selectedSector, selectedZip, selectedCity, selectedState);
      setGeneratedIdea(idea);
    } catch (err) {
      setGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const loadOpportunity = useCallback(async () => {
    if (!selectedZip || !selectedSector) return;
    setLoading(true);
    setError('');
    setOpportunity(null);
    try {
      const data = await api.opportunity(selectedZip, selectedSector);
      setOpportunity(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedZip, selectedSector]);

  useEffect(() => { loadOpportunity(); }, [loadOpportunity]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>BIG</span>
          <span className={styles.headerTitle}>Business Opportunity Intelligence</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{user.name}</span>
          <button className={styles.logoutBtn} onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Filter panel */}
        <div className={styles.filterPanel}>
          <h2 className={styles.filterTitle}>Explore Opportunities</h2>
          <p className={styles.filterSub}>Select a location and sector to generate your business intelligence report.</p>

          <div className={styles.filters}>
            {/* State */}
            <div className={styles.filterGroup}>
              <label>State</label>
              <div className={styles.selectWrap}>
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                >
                  <option value="">— Select state —</option>
                  {states.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* City */}
            <div className={styles.filterGroup}>
              <label>City</label>
              <div className={styles.selectWrap}>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  disabled={!cities.length}
                >
                  <option value="">— Select city —</option>
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ZIP */}
            <div className={styles.filterGroup}>
              <label>ZIP Code</label>
              <div className={styles.selectWrap}>
                <select
                  value={selectedZip}
                  onChange={e => setSelectedZip(e.target.value)}
                  disabled={!zips.length}
                >
                  <option value="">— Select ZIP —</option>
                  {zips.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sector */}
            <div className={styles.filterGroup}>
              <label>Industry Sector</label>
              <div className={styles.selectWrap}>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  disabled={!sectors.length}
                >
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

        {/* Results */}
        <div className={styles.results}>
          {!selectedState && (
            <EmptyState message="Select a state to get started." icon="🗺️" />
          )}
          {selectedState && !selectedCity && (
            <EmptyState message="Now select a city." icon="🏙️" />
          )}
          {selectedCity && !selectedZip && (
            <EmptyState message="Choose a ZIP code." icon="📍" />
          )}
          {selectedZip && !selectedSector && (
            <EmptyState message="Select an industry sector to see the opportunity analysis." icon="🏭" />
          )}
          {loading && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p>Generating intelligence report…</p>
            </div>
          )}
          {error && (
            <div className={styles.errorBox}>{error}</div>
          )}

          {/* Ranked opportunity list */}
          {selectedSector && sectorOpportunities.length > 0 && !selectedOpp && !loading && !generatedIdea && (
            <div className={styles.rankedList}>
              <div className={styles.rankedHeader}>
                <h2 className={styles.rankedTitle}>Top 5 Opportunities — {selectedSector}</h2>
                <p className={styles.rankedSub}>Ranked by conviction score. Click any row to view the full intelligence report.</p>
              </div>
              {sectorOpportunities.map((opp, idx) => {
                const color = opp.score >= 9.0 ? '#10b981' : opp.score >= 8.0 ? '#f59e0b' : '#94a3b8';
                return (
                  <button
                    key={opp.name}
                    className={styles.rankedItem}
                    onClick={() => setSelectedOpp(opp)}
                  >
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

          {/* Full report for selected opportunity */}
          {selectedOpp && !loading && !generatedIdea && !generating && (
            <div>
              <div className={styles.generatedHeader}>
                <button className={styles.backBtn} onClick={() => setSelectedOpp(null)}>
                  ← Back to rankings
                </button>
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerateIdea}
                  disabled={generating}
                >
                  ✦ Generate New Business Idea
                </button>
              </div>
              <OpportunityCard
                opportunity={selectedOpp}
                zip={selectedZip}
                sector={selectedSector}
              />
            </div>
          )}

          {/* Generating spinner */}
          {generating && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p>AI is crafting a new business idea for {selectedSector}…</p>
            </div>
          )}

          {/* Generated AI idea */}
          {generatedIdea && !generating && (
            <div>
              <div className={styles.generatedHeader}>
                <div className={styles.generatedBadge}>✦ AI-Generated Idea</div>
                <div className={styles.generatedActions}>
                  <button className={styles.generateBtn} onClick={handleGenerateIdea} disabled={generating}>
                    ✦ Generate Another
                  </button>
                  <button className={styles.backBtn} onClick={() => { setGeneratedIdea(null); }}>
                    ← Back to rankings
                  </button>
                </div>
              </div>
              {generateError && <div className={styles.generateError}>{generateError}</div>}
              <OpportunityCard
                opportunity={generatedIdea}
                zip={selectedZip}
                sector={selectedSector}
              />
            </div>
          )}

          {opportunity && !loading && !selectedOpp && sectorOpportunities.length === 0 && (
            <OpportunityCard
              opportunity={opportunity}
              zip={selectedZip}
              sector={selectedSector}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ message, icon }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontSize: 16 }}>{message}</p>
    </div>
  );
}
