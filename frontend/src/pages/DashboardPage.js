import { useState, useEffect, useCallback, useRef, Component } from 'react';
import { api } from '../api';
import OpportunityCard from '../components/OpportunityCard';
import Disclaimer from '../components/Disclaimer';
import CreditsDisplay from '../components/CreditsDisplay';
import IdeaValidator from '../components/IdeaValidator';
import SaveButton from '../components/SaveButton';
import { saveReport, loadReports, deleteReport, makeId } from '../savedReports';
import styles from './DashboardPage.module.css';

// view: 'list' | 'detail' | 'generating' | 'generated'

class CardErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '32px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', margin: '16px 0' }}>
          <strong>Unable to render this report.</strong>
          <p style={{ marginTop: 8, fontSize: 13 }}>{this.state.error.message}</p>
          <button onClick={this.props.onReset} style={{ marginTop: 12, padding: '6px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            ← Back to list
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DashboardPage({ user, onLogout, onNavigate, preselect = {} }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(preselect.country || 'US');
  const [selectedState, setSelectedState] = useState('');     // region code
  const [selectedStateName, setSelectedStateName] = useState(''); // region display name
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZip, setSelectedZip] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  const [sectorOpportunities, setSectorOpportunities] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');  // startup cost tier filter
  const [view, setView] = useState('list');           // which screen to show
  const [activeOpp, setActiveOpp] = useState(null);   // detail or generated idea
  const [generateError, setGenerateError] = useState('');
  const [savedReports, setSavedReports] = useState(() => loadReports());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showValidator, setShowValidator] = useState(false);
  const [validatorPrefill, setValidatorPrefill] = useState(null);

  const resultsRef = useRef(null);
  const selectedBudgetRef = useRef(selectedBudget);
  selectedBudgetRef.current = selectedBudget; // always current, no closure issues

  function scrollToResults() {
    if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useEffect(() => {
    api.countries().then(setCountries).catch(() => {});
  }, []);

  // Single sequential preselect: when URL params are present, drive the form directly
  const preselectApplied = useRef(false);
  useEffect(() => {
    const regionParam = preselect.region || preselect.state;
    if (!regionParam && !preselect.city && !preselect.sector) return;
    if (preselectApplied.current) return;

    const SEO_SECTOR_MAP = {
      food_beverage: 'Food & Beverage', technology: 'Technology & Software',
      healthcare: 'Healthcare & Life Sciences', financial_services: 'Financial Services & Fintech',
      retail: 'Retail & E-Commerce', real_estate: 'Real Estate & Construction',
      education: 'Education & EdTech', manufacturing: 'Manufacturing & Logistics',
      wellness: 'Wellness & Fitness', hospitality: 'Hospitality & Tourism',
      energy: 'Energy & Sustainability', professional_services: 'Professional Services',
      transportation: 'Transportation & Mobility', media_entertainment: 'Media & Entertainment',
      agriculture: 'Agriculture & AgTech', government: 'Government & Public Sector',
    };

    async function applyPreselect() {
      preselectApplied.current = true;
      const country = preselect.country || 'US';
      console.log('[preselect] start', { country, regionParam, city: preselect.city, sector: preselect.sector });

      // Step 1: Load states/regions for the country
      let stateList = [];
      try { stateList = await api.states(country); } catch (e) { console.log('[preselect] states error', e); }
      console.log('[preselect] states', stateList.length);
      if (!stateList.length) return;
      setStates(stateList);

      // Step 2: Find matching region
      const matchedState = stateList.find(s =>
        s.code === regionParam ||
        s.code?.toLowerCase() === regionParam?.toLowerCase() ||
        s.code?.endsWith('-' + regionParam?.toUpperCase())
      );
      console.log('[preselect] matchedState', matchedState);
      if (!matchedState) return;
      setSelectedState(matchedState.code);
      setSelectedStateName(matchedState.name);

      // Step 3: Load cities for region
      let cityList = [];
      try { cityList = await api.cities(matchedState.code, country); } catch (e) { console.log('[preselect] cities error', e); }
      console.log('[preselect] cities', cityList.length);
      if (!cityList.length) return;
      setCities(cityList);

      // Step 4: Match city
      const matchedCity = preselect.city
        ? cityList.find(c => c.name === preselect.city || c.name?.toLowerCase() === preselect.city.toLowerCase())
        : null;
      console.log('[preselect] matchedCity', matchedCity);
      if (!matchedCity) return;
      setSelectedCity(matchedCity.name);

      // Step 5: Load zips/postal areas
      let zipList = [];
      try { zipList = await api.zips(matchedState.code, matchedCity.name, country); } catch (e) { console.log('[preselect] zips error', e); }
      console.log('[preselect] zips', zipList);
      if (!zipList.length) return;
      setZips(zipList);
      setSelectedZip(zipList[0]);

      // Step 6: Load sectors
      let sectorList = [];
      try { sectorList = await api.sectors(zipList[0]); } catch (e) { console.log('[preselect] sectors error', e); }
      console.log('[preselect] sectors', sectorList.length);
      if (!sectorList.length) return;
      setSectors(sectorList);

      // Step 7: Match sector
      if (preselect.sector) {
        const backendName = SEO_SECTOR_MAP[preselect.sector] || preselect.sector;
        const matchedSector = sectorList.find(s =>
          s.name === backendName || s.name?.toLowerCase() === backendName.toLowerCase()
        );
        console.log('[preselect] matchedSector', matchedSector, 'for', backendName);
        if (matchedSector) setSelectedSector(matchedSector.name);
      }
      console.log('[preselect] done');
    }

    applyPreselect();
  }, []); // eslint-disable-line

  // Auto-select state/region from URL param once states are loaded (user-driven flow)
  useEffect(() => {
    const regionParam = preselect.region || preselect.state;
    if (regionParam && states.length > 0 && !selectedState) {
      const match = states.find(s =>
        s.code === regionParam ||
        s.code?.toLowerCase() === regionParam.toLowerCase() ||
        s.code?.endsWith('-' + regionParam.toUpperCase())
      );
      if (match) setSelectedState(match.code);
    }
  }, [preselect.region, preselect.state, states]);

  useEffect(() => {
    // Don't wipe out preselect cascade — it sets state via applyPreselect independently
    if (!preselectApplied.current) {
      setSelectedState(''); setSelectedStateName(''); setSelectedCity(''); setSelectedZip(''); setSelectedSector('');
      setCities([]); setZips([]); setSectors([]);
    }
    api.states(selectedCountry).then(setStates).catch(() => setStates([]));
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedState) {
      if (!preselectApplied.current) { setCities([]); setSelectedCity(''); }
      return;
    }
    const stateName = states.find(s => s.code === selectedState)?.name || selectedState;
    setSelectedStateName(stateName);
    if (preselectApplied.current) return; // applyPreselect handles cities itself
    api.cities(selectedState, selectedCountry).then(data => {
      setCities(data);
      if (preselect.city) {
        const match = data.find(c => c.name === preselect.city || c.name?.toLowerCase() === preselect.city.toLowerCase());
        if (match) { setSelectedCity(match.name); return; }
      }
      setSelectedCity(''); setSelectedZip(''); setSelectedSector('');
    });
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    if (!selectedState || !selectedCity) {
      if (!preselectApplied.current) { setZips([]); setSelectedZip(''); }
      return;
    }
    if (preselectApplied.current) return; // applyPreselect handles zips itself
    api.zips(selectedState, selectedCity, selectedCountry).then(data => {
      setZips(data);
      if (data.length > 0 && preselect.city) { setSelectedZip(data[0]); return; }
      setSelectedZip(''); setSelectedSector('');
    });
  }, [selectedState, selectedCity, selectedCountry]);

  useEffect(() => {
    if (!selectedZip) { setSectors([]); setSelectedSector(''); return; }
    api.sectors(selectedZip).then(data => {
      setSectors(data);
      // auto-select sector from URL param
      if (preselect.sector) {
        const SEO_SECTOR_MAP = {
          food_beverage: 'Food & Beverage', technology: 'Technology & Software',
          healthcare: 'Healthcare & Life Sciences', financial_services: 'Financial Services & Fintech',
          retail: 'Retail & E-Commerce', real_estate: 'Real Estate & Construction',
          education: 'Education & EdTech', manufacturing: 'Manufacturing & Logistics',
          wellness: 'Wellness & Fitness', hospitality: 'Hospitality & Tourism',
          energy: 'Energy & Sustainability', professional_services: 'Professional Services',
          transportation: 'Transportation & Mobility', media_entertainment: 'Media & Entertainment',
          agriculture: 'Agriculture & AgTech', government: 'Government & Public Sector',
        };
        const backendName = SEO_SECTOR_MAP[preselect.sector] || preselect.sector;
        const match = data.find(s => s.name === backendName || s.name?.toLowerCase() === backendName.toLowerCase());
        if (match) { setSelectedSector(match.name); return; }
      }
    });
  }, [selectedZip]);

  useEffect(() => {
    if (!selectedSector) { setSectorOpportunities([]); setView('list'); setActiveOpp(null); return; }
    setLoading(true);
    setError('');
    const stateName = states.find(s => s.code === selectedState)?.name || selectedState;
    api.sectorOpportunities(selectedSector, selectedZip || undefined, stateName || undefined, selectedCity || undefined)
      .then(data => { setSectorOpportunities(data); setView('list'); setActiveOpp(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedSector, selectedZip, selectedState]); // eslint-disable-line

  // Parse a startup cost string like "$25K–$75K" or "$1.2M" into a max dollar value
  function parseStartupCostMax(str) {
    if (!str) return Infinity;
    const upper = str.split(/[–-]/).pop();   // take the upper bound
    const m = upper.replace(/,/g, '').match(/\$?([\d.]+)\s*([KMB]?)/i);
    if (!m) return Infinity;
    const num = parseFloat(m[1]);
    const unit = m[2].toUpperCase();
    return unit === 'M' ? num * 1_000_000 : unit === 'B' ? num * 1_000_000_000 : unit === 'K' ? num * 1_000 : num;
  }

  const BUDGET_TIERS = [
    { value: '',           label: '— Any startup cost —',              min: 0,         max: Infinity },
    { value: '0-1k',       label: '$0 – $1,000  (Side Hustle)',        min: 0,         max: 1_000 },
    { value: '1k-10k',     label: '$1,000 – $10,000  (Bootstrap)',     min: 1_000,     max: 10_000 },
    { value: '10k-50k',    label: '$10,000 – $50,000  (Lean)',         min: 10_000,    max: 50_000 },
    { value: '50k-100k',   label: '$50,000 – $100,000  (Funded)',      min: 50_000,    max: 100_000 },
    { value: '100k-1m',    label: '$100,000 – $1,000,000  (Scale)',    min: 100_000,   max: 1_000_000 },
    { value: '1m-10m',     label: '$1,000,000 – $10,000,000  (Growth)', min: 1_000_000, max: 10_000_000 },
  ];

  const activeBudget = BUDGET_TIERS.find(t => t.value === selectedBudget) || BUDGET_TIERS[0];

  const filteredOpportunities = sectorOpportunities.filter(opp => {
    if (!selectedBudget) return true;
    const max = parseStartupCostMax(opp.startupCost);
    return max >= activeBudget.min && max <= activeBudget.max;
  });

  const openDetail = useCallback((opp, isGenerated = false) => {
    const savedId = opp._savedId || makeId();
    const oppWithId = { ...opp, _savedId: savedId };
    setActiveOpp(oppWithId);
    setView(isGenerated ? 'generated' : 'detail');
    setGenerateError('');
    scrollToResults();
    const report = {
      id: savedId,
      type: isGenerated ? 'generated' : 'curated',
      name: opp.name,
      sector: selectedSector,
      zip: selectedZip,
      score: typeof opp.score === 'string' ? parseFloat(opp.score) : (opp.score || 0),
      timestamp: Date.now(),
      data: oppWithId,
    };
    setSavedReports(saveReport(report));
  }, [selectedSector, selectedZip]);

  const [liveStep, setLiveStep] = useState(0); // 0=idle, 1-4=loading steps

  async function handleLiveAnalysis() {
    if (!selectedState || !selectedCity || !selectedZip || !selectedSector) return;
    setLiveStep(1);
    setGenerateError('');
    setActiveOpp(null);
    scrollToResults();
    const budgetValue = selectedBudgetRef.current;
    const budgetTier = BUDGET_TIERS.find(t => t.value === budgetValue) || BUDGET_TIERS[0];
    const budgetRange = budgetValue ? { min: budgetTier.min, max: budgetTier.max, label: budgetTier.label } : null;
    try {
      const timer1 = setTimeout(() => setLiveStep(2), 1800);
      const timer2 = setTimeout(() => setLiveStep(3), 3600);
      const timer3 = setTimeout(() => setLiveStep(4), 5400);
      const card = await api.liveCard(selectedStateName || selectedState, selectedCity, selectedZip, selectedSector, selectedCountry !== 'US' ? selectedCountry : undefined, budgetRange);
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);
      setLiveStep(0);
      openDetail(card, true);
    } catch (err) {
      setLiveStep(0);
      const msg = err.message || 'Live analysis failed. Please try again.';
      if (msg.includes('No viable idea found within')) {
        setGenerateError(msg + ' Try a different sector or relax the budget filter.');
      } else if (msg.includes('credits')) {
        setGenerateError(msg + ' — click "+ Add Credits" to top up.');
      } else {
        setGenerateError(msg);
      }
      setView('list');
    }
  }

  async function handleGenerateIdea(blueOcean = false) {
    setView('generating');
    setGenerateError('');
    setActiveOpp(null);
    scrollToResults();
    // Read budget fresh (avoid stale closure)
    const budgetValue = selectedBudget;
    const budgetTier = BUDGET_TIERS.find(t => t.value === budgetValue) || BUDGET_TIERS[0];
    const budgetRange = budgetValue ? { min: budgetTier.min, max: budgetTier.max, label: budgetTier.label } : null;
    const countryCtx = selectedCountry !== 'US' ? selectedCountry : undefined;
    const stateLabel = selectedStateName || selectedState;
    try {
      const idea = blueOcean
        ? await api.generateBlueOcean(selectedSector, selectedZip, selectedCity, stateLabel, budgetRange, countryCtx)
        : await api.generateIdea(selectedSector, selectedZip, selectedCity, stateLabel, budgetRange, countryCtx);

      if (budgetRange) {
        const costMax = parseStartupCostMax(idea.startupCost);
        if (costMax > budgetRange.max) {
          setGenerateError(`No viable idea found within the $${budgetRange.min.toLocaleString()}–$${budgetRange.max.toLocaleString()} budget range. Try a different sector or relax the budget filter.`);
          setView('list');
          return;
        }
      }


      try {
        openDetail(idea, true);
      } catch {
        setActiveOpp(idea);
        setView('generated');
      }
    } catch (err) {
      const msg = err.message || 'Failed to generate idea. Please try again.';
      if (msg.includes('No viable idea found within')) {
        setGenerateError(msg + ' Try a different sector or relax the budget filter.');
      } else if (msg.includes('credits')) {
        setGenerateError(msg + ' — click "+ Add Credits" in the header to top up.');
      } else {
        setGenerateError(msg);
      }
      setView('list');
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>BIG</span>
          <span className={styles.headerTitle}>Business Opportunity Intelligence</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.navBtn} onClick={() => onNavigate('saved')}>📊 My Saved</button>
          <button className={styles.navBtn} onClick={() => onNavigate('competitive')}>⚔ Competitive Analysis</button>
          <button className={styles.navBtn} onClick={() => onNavigate('saved')}>📁 My Dashboard</button>
          <CreditsDisplay user={user} onBuyCredits={() => onNavigate('pricing')} />
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
              <label>Country</label>
              <div className={styles.selectWrap}>
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
                  {countries.length === 0 && selectedCountry
                    ? <option value={selectedCountry}>{selectedCountry}</option>
                    : null}
                  {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>{selectedCountry === 'US' ? 'State' : 'Region / Province'}</label>
              <div className={styles.selectWrap}>
                <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedStateName(e.target.options[e.target.selectedIndex]?.text || ''); }} disabled={!states.length}>
                  <option value="">— Select {selectedCountry === 'US' ? 'state' : 'region'} —</option>
                  {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>City / Area</label>
              <div className={styles.selectWrap}>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!cities.length}>
                  <option value="">— Select city —</option>
                  {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>{selectedCountry === 'US' ? 'ZIP Code' : 'Postal Area'}</label>
              <div className={styles.selectWrap}>
                <select value={selectedZip} onChange={e => setSelectedZip(e.target.value)} disabled={!zips.length}>
                  <option value="">— Select {selectedCountry === 'US' ? 'ZIP' : 'postal area'} —</option>
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

            <div className={styles.filterGroup}>
              <label>Startup Budget</label>
              <div className={styles.selectWrap}>
                <select value={selectedBudget} onChange={e => setSelectedBudget(e.target.value)}>
                  {BUDGET_TIERS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedBudget && (
            <div className={styles.budgetBadge}>
              💰 Showing opportunities with startup cost in the <strong>{activeBudget.label.split('(')[0].trim()}</strong> range
              {filteredOpportunities.length === 0 && sectorOpportunities.length > 0 && (
                <span className={styles.budgetNoMatch}> — no curated matches, but you can still generate an AI idea within this budget</span>
              )}
              <button className={styles.budgetClear} onClick={() => setSelectedBudget('')}>✕ Clear</button>
            </div>
          )}
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
          {generateError && view === 'list' && <div className={styles.generateError}>{generateError}</div>}

          {/* ── SCREEN: ranked list ── */}
          {!loading && view === 'list' && filteredOpportunities.length > 0 && (
            <div className={styles.rankedList}>
              <div className={styles.rankedHeader}>
                <h2 className={styles.rankedTitle}>
                  {selectedBudget ? `${filteredOpportunities.length} Opportunit${filteredOpportunities.length === 1 ? 'y' : 'ies'}` : 'Top 5 Opportunities'} — {selectedSector}
                </h2>
                <p className={styles.rankedSub}>Ranked by conviction score. Click any row to view the full intelligence report.</p>
              </div>
              {filteredOpportunities.map((opp, idx) => {
                const displayScore = opp.adjustedScore ?? opp.score;
                const color = displayScore >= 9.0 ? '#10b981' : displayScore >= 8.0 ? '#f59e0b' : displayScore >= 6.0 ? '#f97316' : '#94a3b8';
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
                      {opp.localWarning && (
                        <div className={styles.localWarning} title={opp.localWarning}>
                          ⚠ Small local market — revenue projections may not hold for {selectedCity}
                        </div>
                      )}
                    </div>
                    <span className={styles.rankedScore} style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
                      ★ {displayScore.toFixed(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Generate buttons — always visible when sector is selected ── */}
          {!loading && view === 'list' && selectedSector && (
            <>
              <div className={styles.generateGroup} style={{ marginTop: 16 }}>
                <button className={styles.liveBtn} onClick={handleLiveAnalysis} title="Real-time AI analysis with Census, BLS & Trends data">
                  🔴 Live Analysis <span className={styles.creditTag}>3 credits</span>
                </button>
                <button className={styles.generateBtn} onClick={() => handleGenerateIdea(false)}>
                  ✦ Generate New Idea <span className={styles.creditTag}>3 credits</span>
                </button>
                <button className={styles.blueOceanBtn} onClick={() => handleGenerateIdea(true)}>
                  ◎ Blue Ocean Idea <span className={styles.creditTag}>8 credits</span>
                </button>
                <button className={styles.validateIdeaBtn} onClick={() => { setValidatorPrefill(null); setShowValidator(v => !v); }}>
                  {showValidator ? '✕ Close Validator' : '✦ Validate My Idea'} <span className={styles.creditTag}>5 credits</span>
                </button>
              </div>
              {showValidator && (
                <IdeaValidator
                  sector={selectedSector}
                  city={selectedCity}
                  state={selectedStateName || selectedState}
                  zip={selectedZip}
                  onNavigate={onNavigate}
                  prefill={validatorPrefill}
                />
              )}
            </>
          )}

          {liveStep > 0 && (
            <div className={styles.liveLoadingOverlay}>
              <div className={styles.liveLoadingBox}>
                <div className={styles.liveSpinner} />
                <div className={styles.liveSteps}>
                  {['Fetching Census business data…', 'Loading BLS employment data…', 'Checking Google Trends signals…', 'Generating AI analysis…'].map((label, i) => (
                    <div key={i} className={`${styles.liveStep} ${liveStep > i ? styles.liveStepDone : ''} ${liveStep === i + 1 ? styles.liveStepActive : ''}`}>
                      <span className={styles.liveStepDot} />
                      {label}
                    </div>
                  ))}
                </div>
                <p className={styles.liveNote}>Live analysis takes 4–8 seconds. Worth the wait.</p>
              </div>
            </div>
          )}

          {/* ── SCREEN: detail (curated) ── */}
          {view === 'detail' && activeOpp && (
            <div>
              <div className={styles.screenBar}>
                <button className={styles.backBtn} onClick={() => { setView('list'); setActiveOpp(null); }}>
                  ← Back to rankings
                </button>
                <div className={styles.generateGroup}>
                  {selectedCountry === 'US' && (
                    <button className={styles.liveBtn} onClick={handleLiveAnalysis} title="Real-time AI analysis with Census, BLS & Trends data">
                      🔴 Live Analysis <span className={styles.creditTag}>3 credits</span>
                    </button>
                  )}
                  <button className={styles.generateBtn} onClick={() => handleGenerateIdea(false)}>
                    ✦ Generate New Idea <span className={styles.creditTag}>3 credits</span>
                  </button>
                  <button className={styles.blueOceanBtn} onClick={() => handleGenerateIdea(true)}>
                    ◎ Blue Ocean Idea <span className={styles.creditTag}>8 credits</span>
                  </button>
                  <button className={styles.validateIdeaBtn} onClick={() => setShowValidator(v => !v)}>
                    {showValidator ? '✕ Close Validator' : '✦ Validate My Idea'} <span className={styles.creditTag}>5 credits</span>
                  </button>
                  <SaveButton
                    cardData={activeOpp}
                    state={states.find(s => s.code === selectedState)?.name || selectedState}
                    city={selectedCity}
                    zip={selectedZip}
                    sector={selectedSector}
                    sectorLabel={sectors.find(s => s.name === selectedSector)?.name || selectedSector}
                    onNavigateDashboard={() => onNavigate('saved')}
                  />
                </div>
              </div>
              {generateError && <div className={styles.generateError}>{generateError}</div>}
              {showValidator && (
                <IdeaValidator
                  sector={selectedSector}
                  city={selectedCity}
                  state={selectedStateName || selectedState}
                  zip={selectedZip}
                  onNavigate={onNavigate}
                  prefill={validatorPrefill}
                />
              )}
              <CardErrorBoundary onReset={() => { setView('list'); setActiveOpp(null); setGenerateError(''); }}>
                <OpportunityCard
                  opportunity={activeOpp}
                  zip={selectedZip}
                  sector={selectedSector}
                  state={states.find(s => s.code === selectedState)?.name || selectedState}
                  city={selectedCity}
                  sectorLabel={selectedSector}
                  onNavigate={onNavigate}
                  savedOpportunityId={activeOpp?._savedId}
                />
              </CardErrorBoundary>
            </div>
          )}

          {/* ── SCREEN: generating ── */}
          {view === 'generating' && (
            <div className={styles.generatingScreen}>
              <div className={styles.generatingSpinner} />
              <h3 className={styles.generatingTitle}>Crafting a new business idea…</h3>
              <p className={styles.generatingSubtitle}>AI is analysing the {selectedSector} sector{selectedCity ? ` in ${selectedCity}${selectedStateName ? `, ${selectedStateName}` : ''}` : ''}{selectedBudget ? ` within a ${activeBudget.label.split('(')[0].trim()} budget` : ''} and building a full opportunity report.</p>
              {selectedBudget && <p style={{fontSize:11,color:'#6b7280',marginTop:4}}>Budget filter active: {activeBudget.label} (max ${activeBudget.max.toLocaleString()})</p>}
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
                  {activeOpp.blueOcean
                    ? <span className={styles.blueOceanBadge}>◎ Blue Ocean — No Competitors</span>
                    : <span className={styles.generatedBadge}>✦ AI-Generated</span>
                  }
                  <div className={styles.generateGroup}>
                    {selectedCountry === 'US' && (
                      <button className={styles.liveBtn} onClick={handleLiveAnalysis} title="Real-time AI analysis with Census, BLS & Trends data">
                        🔴 Live Analysis <span className={styles.creditTag}>3 credits</span>
                      </button>
                    )}
                    <button className={styles.generateBtn} onClick={() => handleGenerateIdea(false)}>
                      ✦ Generate Another <span className={styles.creditTag}>3 credits</span>
                    </button>
                    <button className={styles.blueOceanBtn} onClick={() => handleGenerateIdea(true)}>
                      ◎ Blue Ocean Idea <span className={styles.creditTag}>8 credits</span>
                    </button>
                    <button className={styles.validateIdeaBtn} onClick={() => {
                      const ideaText = [
                        activeOpp.name,
                        activeOpp.model ? `Business model: ${activeOpp.model}.` : '',
                        activeOpp.whyItWorks || '',
                        activeOpp.revenueYr1 ? `Year 1 revenue target: ${activeOpp.revenueYr1}.` : '',
                        activeOpp.grossMargin ? `Gross margin: ${activeOpp.grossMargin}.` : '',
                      ].filter(Boolean).join(' ');
                      setValidatorPrefill({
                        idea: ideaText,
                        targetCustomer: activeOpp.model || '',
                        pricePoint: activeOpp.startupCost ? `Startup cost: ${activeOpp.startupCost}` : '',
                      });
                      setShowValidator(true);
                    }}>
                      ✦ Validate This Idea <span className={styles.creditTag}>5 credits</span>
                    </button>
                    <SaveButton
                      cardData={activeOpp}
                      state={states.find(s => s.code === selectedState)?.name || selectedState}
                      city={selectedCity}
                      zip={selectedZip}
                      sector={selectedSector}
                      sectorLabel={sectors.find(s => s.name === selectedSector)?.name || selectedSector}
                      onNavigateDashboard={() => onNavigate('saved')}
                    />
                  </div>
                </div>
              </div>
              <CardErrorBoundary onReset={() => { setView('list'); setActiveOpp(null); setGenerateError(''); }}>
                <OpportunityCard
                  opportunity={activeOpp}
                  zip={selectedZip}
                  sector={selectedSector}
                  state={states.find(s => s.code === selectedState)?.name || selectedState}
                  city={selectedCity}
                  sectorLabel={selectedSector}
                  onNavigate={onNavigate}
                  savedOpportunityId={activeOpp?._savedId}
                />
              </CardErrorBoundary>
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
