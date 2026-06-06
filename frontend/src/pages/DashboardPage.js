import { useState, useEffect, useCallback, useRef, Component } from 'react';
import { api } from '../api';
import OpportunityCard from '../components/OpportunityCard';
import IntlIdeaCard from '../components/IntlIdeaCard';
import Disclaimer from '../components/Disclaimer';
import CreditsDisplay from '../components/CreditsDisplay';
import SaveButton from '../components/SaveButton';
import { saveReport, loadReports, deleteReport, makeId } from '../savedReports';
import styles from './DashboardPage.module.css';

// Maps SEO page sector apiIds to backend sector name strings
const SEO_SECTOR_MAP = {
  food_beverage: 'Food & Beverage',
  technology: 'Technology & Software',
  healthcare: 'Healthcare & Life Sciences',
  financial_services: 'Financial Services & Fintech',
  retail: 'Retail & E-Commerce',
  real_estate: 'Real Estate & Construction',
  education: 'Education & EdTech',
  manufacturing: 'Manufacturing & Logistics',
  wellness: 'Wellness & Fitness',
  hospitality: 'Hospitality & Tourism',
  energy: 'Energy & Sustainability',
  professional_services: 'Professional Services',
  transportation: 'Transportation & Mobility',
  media_entertainment: 'Media & Entertainment',
  agriculture: 'Agriculture & AgTech',
  government: 'Government & Public Sector',
};

const INTL_SECTORS = [
  'Food & Beverage', 'Technology & Software', 'Healthcare & Life Sciences',
  'Financial Services & Fintech', 'Retail & E-Commerce', 'Real Estate & Construction',
  'Education & EdTech', 'Manufacturing & Logistics', 'Wellness & Fitness',
  'Hospitality & Tourism', 'Energy & Sustainability', 'Professional Services',
  'Transportation & Mobility', 'Media & Entertainment', 'Agriculture & AgTech',
  'Government & Public Sector',
];

const COUNTRIES = [
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
];

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

export default function DashboardPage({ user, onLogout, onNavigate, preselect: _preselect = {} }) {
  // Always read URL params fresh — props may be stale if passed through re-renders
  const preselect = (() => {
    const p = new URLSearchParams(window.location.search);
    const result = {
      state:   p.get('state')   || _preselect.state   || '',
      city:    p.get('city')    || _preselect.city     || '',
      sector:  p.get('sector')  || _preselect.sector   || '',
      country: p.get('country') || _preselect.country  || '',
      region:  p.get('region')  || _preselect.region   || '',
    };
    console.log('[BIG] preselect', result);
    return result;
  })();
  // ── US state ──
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZip, setSelectedZip] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  const [sectorOpportunities, setSectorOpportunities] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [view, setView] = useState('list');
  const [activeOpp, setActiveOpp] = useState(null);
  const [generateError, setGenerateError] = useState('');
  const [savedReports, setSavedReports] = useState(() => loadReports());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Country selector ──
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const c = (preselect.country || '').toUpperCase();
    return ['CA', 'GB', 'AU'].includes(c) ? c : 'US';
  });

  // ── International state ──
  const [intlRegions, setIntlRegions] = useState([]);
  const [intlCities, setIntlCities] = useState([]);
  const [intlAreas, setIntlAreas] = useState([]);
  const [intlRegion, setIntlRegion] = useState(() => preselect.region || '');
  const [intlCity, setIntlCity] = useState(() => preselect.city || '');
  const [intlArea, setIntlArea] = useState('');
  const [intlSector, setIntlSector] = useState(() => {
    if (!preselect.sector) return '';
    const needle = preselect.sector.replace(/_/g, ' ').toLowerCase();
    return INTL_SECTORS.find(s => s.toLowerCase().includes(needle) || needle.includes(s.split(' ')[0].toLowerCase())) || '';
  });
  const [intlInvestment, setIntlInvestment] = useState('');
  const [intlSkills, setIntlSkills] = useState('');
  const [intlIdeas, setIntlIdeas] = useState([]);
  console.log('[BIG] intl state init', { selectedCountry, intlRegion, intlCity, intlSector });
  const [intlGenerating, setIntlGenerating] = useState(false);
  const [intlError, setIntlError] = useState('');

  const resultsRef = useRef(null);

  function scrollToResults() {
    if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const skipReactive = useRef(false);

  useEffect(() => {
    api.states().then(stateList => {
      setStates(stateList);
      if (!preselect.state) return;
      const normalize = str => str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      const stateMatch = stateList.find(s => s.code.toLowerCase() === preselect.state.toLowerCase());
      if (!stateMatch) return;

      skipReactive.current = true;
      setSelectedState(stateMatch.code);

      api.cities(stateMatch.code).then(cityList => {
        setCities(cityList);
        if (!preselect.city) { skipReactive.current = false; return; }
        const cityMatch = cityList.find(c => c.name.toLowerCase() === preselect.city.toLowerCase());
        if (!cityMatch) { skipReactive.current = false; return; }
        setSelectedCity(cityMatch.name);

        api.zips(stateMatch.code, cityMatch.name).then(zipList => {
          setZips(zipList);
          if (!zipList.length) { skipReactive.current = false; return; }
          const zip = zipList[0];
          setSelectedZip(zip);

          api.sectors(zip).then(sectorList => {
            setSectors(sectorList);
            skipReactive.current = false;
            if (!preselect.sector) return;
            const backendName = SEO_SECTOR_MAP[preselect.sector];
            const sectorMatch = sectorList.find(s =>
              s.name === backendName || s.name === preselect.sector || normalize(s.name) === normalize(preselect.sector)
            );
            if (sectorMatch) setSelectedSector(sectorMatch.name);
          }).catch(() => { skipReactive.current = false; });
        }).catch(() => { skipReactive.current = false; });
      }).catch(() => { skipReactive.current = false; });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (skipReactive.current) return;
    if (!selectedState) { setCities([]); setSelectedCity(''); return; }
    api.cities(selectedState).then(data => {
      setCities(data);
      setSelectedCity(''); setSelectedZip(''); setSelectedSector('');
    });
  }, [selectedState]);

  useEffect(() => {
    if (skipReactive.current) return;
    if (!selectedState || !selectedCity) { setZips([]); setSelectedZip(''); return; }
    api.zips(selectedState, selectedCity).then(data => {
      setZips(data);
      setSelectedZip(''); setSelectedSector('');
    });
  }, [selectedState, selectedCity]);

  useEffect(() => {
    if (skipReactive.current) return;
    if (!selectedZip) { setSectors([]); setSelectedSector(''); return; }
    api.sectors(selectedZip).then(data => {
      setSectors(data);
    });
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

  // ── International effects ──

  // Load dropdown options on mount (handles both preselect and normal country switching)
  useEffect(() => {
    if (selectedCountry === 'US') return;
    api.intlRegions(selectedCountry).then(regions => {
      setIntlRegions(regions);
      const regionCode = intlRegion || '';
      if (!regionCode) return;
      api.intlCities(selectedCountry, regionCode).then(cities => {
        setIntlCities(cities);
        const cityName = intlCity || '';
        if (!cityName) return;
        api.intlAreas(selectedCountry, regionCode, cityName).then(setIntlAreas).catch(() => {});
      }).catch(() => {});
    }).catch(() => {});
  }, [selectedCountry]); 

  useEffect(() => {
    if (!intlRegion) { setIntlCities([]); setIntlCity(''); setIntlAreas([]); setIntlArea(''); return; }
    api.intlCities(selectedCountry, intlRegion).then(setIntlCities).catch(() => {});
  }, [selectedCountry, intlRegion]); 

  useEffect(() => {
    if (!intlCity) { setIntlAreas([]); setIntlArea(''); return; }
    api.intlAreas(selectedCountry, intlRegion, intlCity).then(setIntlAreas).catch(() => {});
  }, [selectedCountry, intlRegion, intlCity]); 

  // Parse a startup cost string like "$25K–$75K" or "$1.2M" into a max dollar value
  function parseStartupCostMax(str) {
    if (!str) return Infinity;
    const upper = str.split(/[–-]/).pop();
    const m = upper.replace(/,/g, '').match(/\$?([\d.]+)\s*([KMB]?)/i);
    if (!m) return Infinity;
    const num = parseFloat(m[1]);
    const unit = m[2].toUpperCase();
    return unit === 'M' ? num * 1_000_000 : unit === 'B' ? num * 1_000_000_000 : unit === 'K' ? num * 1_000 : num;
  }

  const BUDGET_TIERS = [
    { value: '',           label: '— Any startup cost —',       min: 0,      max: Infinity },
    { value: '100-1000',   label: '$100 – $1,000  (Bootstrap)',  min: 100,    max: 1_000 },
    { value: '1k-10k',     label: '$1,001 – $10,000  (Lean)',    min: 1_001,  max: 10_000 },
    { value: '10k-50k',    label: '$10,001 – $50,000  (Funded)', min: 10_001, max: 50_000 },
    { value: '50k-100k',   label: '$50,001 – $100,000  (Scale)', min: 50_001, max: 100_000 },
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
    setSavedOpportunityId(null);
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

  const [savedOpportunityId, setSavedOpportunityId] = useState(null);
  const [liveStep, setLiveStep] = useState(0);

  const handleLiveAnalysis = useCallback(async () => {
    if (!selectedState || !selectedCity || !selectedZip || !selectedSector) return;
    setLiveStep(1);
    setGenerateError('');
    setActiveOpp(null);
    scrollToResults();
    try {
      const timer1 = setTimeout(() => setLiveStep(2), 1800);
      const timer2 = setTimeout(() => setLiveStep(3), 3600);
      const timer3 = setTimeout(() => setLiveStep(4), 5400);
      const card = await api.liveCard(selectedState, selectedCity, selectedZip, selectedSector);
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);
      setLiveStep(0);
      openDetail(card, true);
    } catch (err) {
      setLiveStep(0);
      const msg = err.message || 'Live analysis failed. Please try again.';
      setGenerateError(msg.includes('credits') ? msg + ' — click "+ Add Credits" to top up.' : msg);
      setView('list');
    }
  }, [selectedState, selectedCity, selectedZip, selectedSector, openDetail]);

  const handleGenerateIdea = useCallback(async (blueOcean = false) => {
    setView('generating');
    setGenerateError('');
    setActiveOpp(null);
    scrollToResults();
    const budgetRange = selectedBudget ? { min: activeBudget.min, max: activeBudget.max, label: activeBudget.label } : null;
    try {
      const idea = blueOcean
        ? await api.generateBlueOcean(selectedSector, selectedZip, selectedCity, selectedState, budgetRange)
        : await api.generateIdea(selectedSector, selectedZip, selectedCity, selectedState, budgetRange);
      try {
        openDetail(idea, true);
      } catch {
        setActiveOpp(idea);
        setView('generated');
      }
    } catch (err) {
      const msg = err.message || 'Failed to generate idea. Please try again.';
      setGenerateError(msg.includes('credits') ? msg + ' — click "+ Add Credits" in the header to top up.' : msg);
      setView('list');
    }
  }, [selectedSector, selectedZip, selectedCity, selectedState, openDetail]);

  const handleGenerateIntl = useCallback(async () => {
    if (!intlSector) return;
    setIntlGenerating(true);
    setIntlError('');
    setIntlIdeas([]);
    scrollToResults();
    const countryMeta = COUNTRIES.find(c => c.code === selectedCountry);
    const currencyMap = { CA: 'CAD', GB: 'GBP', AU: 'AUD' };
    try {
      const ideas = await api.generateIntlIdea({
        country: selectedCountry,
        region: intlRegion,
        city: intlCity,
        area: intlArea,
        sector: intlSector,
        currency: currencyMap[selectedCountry] || 'CAD',
        skills: intlSkills,
        investmentLevel: intlInvestment,
      });
      setIntlIdeas(Array.isArray(ideas) ? ideas : []);
    } catch (err) {
      const msg = err.message || 'Failed to generate ideas. Please try again.';
      setIntlError(msg.includes('credits') ? msg + ' — click "+ Add Credits" in the header to top up.' : msg);
    } finally {
      setIntlGenerating(false);
    }
  }, [selectedCountry, intlRegion, intlCity, intlArea, intlSector, intlSkills, intlInvestment]);

  const isIntl = selectedCountry !== 'US';

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

          {/* Country selector */}
          <div className={styles.countrySelector}>
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                className={`${styles.countryBtn} ${selectedCountry === c.code ? styles.countryBtnActive : ''}`}
                onClick={() => setSelectedCountry(c.code)}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>

          {/* US flow */}
          {!isIntl && (
            <>
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
                  💰 Showing opportunities with startup cost up to <strong>${activeBudget.max.toLocaleString()}</strong>
                  {filteredOpportunities.length === 0 && sectorOpportunities.length > 0 && (
                    <span className={styles.budgetNoMatch}> — no curated matches, but you can still generate an AI idea within this budget</span>
                  )}
                  <button className={styles.budgetClear} onClick={() => setSelectedBudget('')}>✕ Clear</button>
                </div>
              )}
            </>
          )}

          {/* International flow */}
          {isIntl && (
            <div className={styles.intlFilters}>
              <div className={styles.filters} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className={styles.filterGroup}>
                  <label>Region / Province</label>
                  <div className={styles.selectWrap}>
                    <select value={intlRegion} onChange={e => setIntlRegion(e.target.value)} disabled={!intlRegions.length}>
                      <option value="">— Select region —</option>
                      {intlRegions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <label>City</label>
                  <div className={styles.selectWrap}>
                    <select value={intlCity} onChange={e => setIntlCity(e.target.value)} disabled={!intlCities.length}>
                      <option value="">— Select city —</option>
                      {intlCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <label>Area / District</label>
                  <div className={styles.selectWrap}>
                    <select value={intlArea} onChange={e => setIntlArea(e.target.value)} disabled={!intlAreas.length}>
                      <option value="">— Select area —</option>
                      {intlAreas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.filters} style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 16 }}>
                <div className={styles.filterGroup}>
                  <label>Industry Sector</label>
                  <div className={styles.selectWrap}>
                    <select value={intlSector} onChange={e => setIntlSector(e.target.value)}>
                      <option value="">— Select sector —</option>
                      {INTL_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <label>Investment Level (optional)</label>
                  <input
                    className={styles.intlInput}
                    type="text"
                    placeholder={selectedCountry === 'GB' ? 'e.g. Under £25,000' : selectedCountry === 'AU' ? 'e.g. Under AUD $50,000' : 'e.g. Under CAD $25,000'}
                    value={intlInvestment}
                    onChange={e => setIntlInvestment(e.target.value)}
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label>Your Skills (optional)</label>
                  <input
                    className={styles.intlInput}
                    type="text"
                    placeholder="e.g. marketing, trades, tech"
                    value={intlSkills}
                    onChange={e => setIntlSkills(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <button
                  className={styles.intlGenerateBtn}
                  onClick={handleGenerateIntl}
                  disabled={!intlSector || intlGenerating}
                >
                  {intlGenerating ? '⏳ Generating…' : '🌍 Generate International Ideas'}
                  {!intlGenerating && <span className={styles.creditTag}>3 credits</span>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mainColumns}>
        {/* Results */}
        <div className={styles.results} ref={resultsRef}>

          {/* International results */}
          {isIntl && (
            <div>
              {intlGenerating && (
                <div className={styles.generatingScreen}>
                  <div className={styles.generatingSpinner} />
                  <h3 className={styles.generatingTitle}>Generating international ideas…</h3>
                  <p className={styles.generatingSubtitle}>
                    AI is analysing the {intlSector || 'selected'} sector
                    {intlCity ? ` in ${intlCity}` : ''}
                    {selectedCountry === 'CA' ? ', Canada' : selectedCountry === 'GB' ? ', United Kingdom' : ', Australia'} and building localised opportunity reports.
                  </p>
                </div>
              )}

              {intlError && <div className={styles.generateError}>{intlError}</div>}

              {!intlGenerating && intlIdeas.length === 0 && !intlError && (
                <EmptyState message={intlSector ? 'Click "Generate International Ideas" to get started.' : 'Select a sector above, then generate ideas.'} icon="🌍" />
              )}

              {!intlGenerating && intlIdeas.length > 0 && (
                <div>
                  <div className={styles.rankedHeader} style={{ marginBottom: 20 }}>
                    <h2 className={styles.rankedTitle}>
                      {intlIdeas.length} International Business Ideas — {intlSector}
                    </h2>
                    <p className={styles.rankedSub}>
                      AI-generated ideas for {intlCity || (intlRegions.find(r => r.code === intlRegion)?.name) || COUNTRIES.find(c => c.code === selectedCountry)?.name}. The last idea is a wildcard.
                    </p>
                  </div>
                  {intlIdeas.map((idea, i) => (
                    <IntlIdeaCard key={i} idea={idea} />
                  ))}
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button className={styles.generateBtn} onClick={handleGenerateIntl} disabled={intlGenerating}>
                      ↺ Generate New Ideas <span className={styles.creditTag}>3 credits</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* US flow */}
          {!isIntl && (
            <div>
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
                      <button className={styles.liveBtn} onClick={handleLiveAnalysis} title="Real-time AI analysis with Census, BLS & Trends data">
                        🔴 Live Analysis <span className={styles.creditTag}>3 credits</span>
                      </button>
                      <button className={styles.generateBtn} onClick={() => handleGenerateIdea(false)}>
                        ✦ Generate New Idea <span className={styles.creditTag}>3 credits</span>
                      </button>
                      <button className={styles.blueOceanBtn} onClick={() => handleGenerateIdea(true)}>
                        ◎ Blue Ocean Idea <span className={styles.creditTag}>8 credits</span>
                      </button>
                      <SaveButton
                        cardData={activeOpp}
                        state={states.find(s => s.code === selectedState)?.name || selectedState}
                        city={selectedCity}
                        zip={selectedZip}
                        sector={selectedSector}
                        sectorLabel={sectors.find(s => s.name === selectedSector)?.name || selectedSector}
                        onNavigateDashboard={() => onNavigate('saved')}
                        onSaved={setSavedOpportunityId}
                      />
                    </div>
                  </div>
                  {generateError && <div className={styles.generateError}>{generateError}</div>}
                  <CardErrorBoundary onReset={() => { setView('list'); setActiveOpp(null); setGenerateError(''); }}>
                    <OpportunityCard
                      opportunity={activeOpp}
                      zip={selectedZip}
                      sector={selectedSector}
                      state={states.find(s => s.code === selectedState)?.name || selectedState}
                      city={selectedCity}
                      sectorLabel={selectedSector}
                      onNavigate={onNavigate}
                      savedOpportunityId={savedOpportunityId}
                    />
                  </CardErrorBoundary>
                </div>
              )}

              {/* ── SCREEN: generating ── */}
              {view === 'generating' && (
                <div className={styles.generatingScreen}>
                  <div className={styles.generatingSpinner} />
                  <h3 className={styles.generatingTitle}>Crafting a new business idea…</h3>
                  <p className={styles.generatingSubtitle}>AI is analysing the {selectedSector} sector{selectedCity ? ` in ${selectedCity}` : ''}{selectedBudget ? ` within a ${activeBudget.label.split('(')[0].trim()} budget` : ''} and building a full opportunity report.</p>
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
                        <button className={styles.liveBtn} onClick={handleLiveAnalysis} title="Real-time AI analysis with Census, BLS & Trends data">
                          🔴 Live Analysis <span className={styles.creditTag}>3 credits</span>
                        </button>
                        <button className={styles.generateBtn} onClick={() => handleGenerateIdea(false)}>
                          ✦ Generate Another <span className={styles.creditTag}>3 credits</span>
                        </button>
                        <button className={styles.blueOceanBtn} onClick={() => handleGenerateIdea(true)}>
                          ◎ Blue Ocean Idea <span className={styles.creditTag}>8 credits</span>
                        </button>
                        <SaveButton
                          cardData={activeOpp}
                          state={states.find(s => s.code === selectedState)?.name || selectedState}
                          city={selectedCity}
                          zip={selectedZip}
                          sector={selectedSector}
                          sectorLabel={sectors.find(s => s.name === selectedSector)?.name || selectedSector}
                          onNavigateDashboard={() => onNavigate('saved')}
                          onSaved={setSavedOpportunityId}
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
                      savedOpportunityId={savedOpportunityId}
                    />
                  </CardErrorBoundary>
                </div>
              )}
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
