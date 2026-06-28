import { useState, useEffect } from 'react';
import { api } from '../api';
import styles from './IdeaValidator.module.css';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';

const VERDICT_META = {
  'Promising':            { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  icon: '✓' },
  'Conditional':          { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  icon: '△' },
  'Weak':                 { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  icon: '⚠' },
  "Don't build (as stated)": { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: '✕' },
};

const CONF_COLOR = { High: '#10b981', Medium: '#f59e0b', Low: '#94a3b8' };

function ProvenanceChip({ tag }) {
  const colors = {
    'MEASURED · Census':      { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    'MEASURED · BLS':         { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    'SIGNAL · Google Trends': { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
    'INFERRED':               { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
    'UNKNOWN':                { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
  };
  const style = colors[tag] || { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
  return <span className={styles.provChip} style={{ background: style.bg, color: style.color }}>{tag}</span>;
}

function DimensionRow({ dim }) {
  const [open, setOpen] = useState(false);
  const scoreColor = dim.score >= 65 ? '#10b981' : dim.score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className={styles.dimRow}>
      <button className={styles.dimHeader} onClick={() => setOpen(o => !o)}>
        <span className={styles.dimName}>{dim.name}</span>
        <span className={styles.dimRight}>
          <span className={styles.dimConf} style={{ color: CONF_COLOR[dim.confidence] }}>{dim.confidence}</span>
          <span className={styles.dimScore} style={{ color: scoreColor }}>{dim.score}</span>
          <span className={styles.dimChevron}>{open ? '▲' : '▼'}</span>
        </span>
      </button>
      {open && (
        <div className={styles.dimBody}>
          <p className={styles.dimRationale}>{dim.rationale}</p>
          {dim.provenance?.length > 0 && (
            <div className={styles.dimProvenance}>
              {dim.provenance.map(p => <ProvenanceChip key={p} tag={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function IdeaValidator({ sector, city, state, zip, country, onNavigate, prefill }) {
  const [idea, setIdea] = useState(prefill?.idea || '');
  const [targetCustomer, setTargetCustomer] = useState(prefill?.targetCustomer || '');
  const [geography, setGeography] = useState('');
  const [pricePoint, setPricePoint] = useState(prefill?.pricePoint || '');
  const [showNudges, setShowNudges] = useState(false);
  const [loading, setLoading] = useState(!!prefill);
  const [result, setResult] = useState(null);
  const [needsDetail, setNeedsDetail] = useState(null);
  const [error, setError] = useState('');
  const [savedOpportunityId, setSavedOpportunityId] = useState(null);

  function buildGeoHint(overrideGeo) {
    if (overrideGeo) return overrideGeo;
    return [city, state, country && country !== 'US' ? country : ''].filter(Boolean).join(', ');
  }

  // Auto-submit when opened with a prefilled idea (e.g. from generated card)
  useEffect(() => {
    if (!prefill?.idea) return;
    const geoHint = buildGeoHint();
    api.validateIdea(prefill.idea, prefill.targetCustomer || undefined, geoHint || undefined, prefill.pricePoint || undefined)
      .then(data => {
        if (data.error === 'needs-detail') setNeedsDetail(data);
        else setResult(data);
      })
      .catch(err => {
        if (err.message?.includes('credits')) setError(err.message + ' — click "+ Add Credits" to top up.');
        else setError(err.message || 'Validation failed. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  async function handleValidate() {
    if (!idea.trim() || idea.trim().length < 20) {
      setNeedsDetail({ prompts: ['Add at least a sentence describing what the idea is, who it\'s for, and how it makes money.'] });
      return;
    }
    setLoading(true);
    setResult(null);
    setNeedsDetail(null);
    setError('');
    setSavedOpportunityId(null);

    // Pre-fill geography from form if not provided
    const geoHint = buildGeoHint(geography);

    try {
      const data = await api.validateIdea(idea.trim(), targetCustomer || undefined, geoHint || undefined, pricePoint || undefined);
      if (data.error === 'needs-detail') {
        setNeedsDetail(data);
      } else {
        setResult(data);
      }
    } catch (err) {
      if (err.message?.includes('credits')) {
        setError(err.message + ' — click "+ Add Credits" to top up.');
      } else {
        setError(err.message || 'Validation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setNeedsDetail(null);
    setError('');
    setSavedOpportunityId(null);
  }

  const meta = result ? (VERDICT_META[result.verdict] || VERDICT_META['Conditional']) : null;

  // Build a card-data object compatible with SaveButton/ShareButton
  const cardData = result ? {
    name: `Validation: ${result.inputEcho?.idea?.slice(0, 60) || idea.slice(0, 60)}…`,
    verdict: result.verdict,
    score: result.score / 10, // normalise to 0–10 for saved reports
    bearCase: result.bearCase,
    riskiestAssumption: result.riskiestAssumption,
    dimensions: result.dimensions,
    movesUpABand: result.movesUpABand,
    validationResult: result,
    _type: 'validation',
  } : null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>✦ Validate My Idea</span>
        <span className={styles.panelSub}>Reality-check your idea against real market signals — honest, not flattering</span>
      </div>

      {/* Input area */}
      {!result && (
        <div className={styles.inputArea}>
          <textarea
            className={styles.ideaField}
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Describe your idea: what it is, who it's for, and how it makes money."
            rows={4}
            maxLength={3000}
            aria-label="Describe your business idea"
          />
          <div className={styles.charCount}>{idea.length}/3000</div>

          <button
            className={styles.nudgeToggle}
            onClick={() => setShowNudges(n => !n)}
            type="button"
          >
            {showNudges ? '▲ Hide details' : '▼ Add details (sharpens the analysis)'}
          </button>

          {showNudges && (
            <div className={styles.nudges}>
              <input
                className={styles.nudgeInput}
                placeholder="Target customer (e.g. 'small restaurant owners')"
                value={targetCustomer}
                onChange={e => setTargetCustomer(e.target.value)}
                aria-label="Target customer"
              />
              <input
                className={styles.nudgeInput}
                placeholder="Geography (e.g. 'Austin, TX' or 'US')"
                value={geography}
                onChange={e => setGeography(e.target.value)}
                aria-label="Geography"
              />
              <input
                className={styles.nudgeInput}
                placeholder="Rough price point (e.g. '$49/mo' or '$200 one-time')"
                value={pricePoint}
                onChange={e => setPricePoint(e.target.value)}
                aria-label="Price point"
              />
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.validateBtn}
              onClick={handleValidate}
              disabled={loading || idea.trim().length < 10}
              aria-label="Validate my idea — 5 credits"
            >
              {loading ? <><span className={styles.btnSpinner} /> Analysing…</> : <>✦ Validate My Idea <span className={styles.creditTag}>5 credits</span></>}
            </button>
          </div>
        </div>
      )}

      {/* Needs-detail state */}
      {needsDetail && !result && (
        <div className={styles.needsDetail}>
          <p className={styles.needsTitle}>More detail needed to assess this idea:</p>
          <ul className={styles.needsList}>
            {needsDetail.prompts?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <button className={styles.retryBtn} onClick={() => setNeedsDetail(null)}>← Edit idea</button>
        </div>
      )}

      {/* Error state */}
      {error && !result && (
        <div className={styles.errorBox} role="alert">
          {error}
          <button className={styles.retryBtn} onClick={() => { setError(''); }}>Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className={styles.skeleton} aria-live="polite" aria-label="Analysing your idea…">
          <div className={styles.skeletonBar} style={{ width: '60%' }} />
          <div className={styles.skeletonBar} style={{ width: '90%' }} />
          <div className={styles.skeletonBar} style={{ width: '75%' }} />
          <div className={styles.skeletonBar} style={{ width: '50%' }} />
          <p className={styles.skeletonNote}>Querying trend signals and building your honest assessment…</p>
        </div>
      )}

      {/* Result */}
      {result && meta && (
        <div className={styles.result} aria-live="polite">
          {/* Hero verdict */}
          <div className={styles.verdictHero} style={{ background: meta.bg, borderColor: meta.border }}>
            <div className={styles.verdictLeft}>
              <span className={styles.verdictIcon} style={{ color: meta.color }}>{meta.icon}</span>
              <div>
                <div className={styles.verdictLabel} style={{ color: meta.color }}>{result.verdict}</div>
                <div className={styles.verdictReason}>{result.verdictReason}</div>
              </div>
            </div>
            <div className={styles.verdictRight}>
              <div className={styles.scoreCircle} style={{ borderColor: meta.color, color: meta.color }}>
                <span className={styles.scoreNum}>{result.score}</span>
                <span className={styles.scoreMax}>/100</span>
              </div>
              <div className={styles.confLabel}>
                Confidence: <span style={{ color: CONF_COLOR[result.verdictConfidence] }}>{result.verdictConfidence}</span>
              </div>
            </div>
          </div>

          {/* Data coverage chips */}
          <div className={styles.coverageRow}>
            <span className={styles.coverageLabel}>Data coverage:</span>
            <ProvenanceChip tag={result.dataCoverage?.census ? 'MEASURED · Census' : 'UNKNOWN'} />
            <ProvenanceChip tag={result.dataCoverage?.bls ? 'MEASURED · BLS' : 'UNKNOWN'} />
            <ProvenanceChip tag={result.dataCoverage?.trends ? 'SIGNAL · Google Trends' : 'UNKNOWN'} />
          </div>

          {/* Bear case — most important */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>🐻 Strongest reason it fails</div>
            <div className={styles.bearCase}>{result.bearCase}</div>
          </div>

          {/* Riskiest assumption */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>⚡ Riskiest assumption to test next</div>
            <div className={styles.riskiestBox}>{result.riskiestAssumption}</div>
          </div>

          {/* Dimensions */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Dimension breakdown</div>
            <div className={styles.dims}>
              {result.dimensions?.map(dim => <DimensionRow key={dim.name} dim={dim} />)}
            </div>
          </div>

          {/* What would move it up */}
          {result.movesUpABand?.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>🔼 What would move it up a band</div>
              <ul className={styles.movesList}>
                {result.movesUpABand.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}

          {/* Input echo */}
          {result.inputEcho && (
            <div className={styles.inputEcho}>
              <span>Assessed as: customer = <em>{result.inputEcho.inferredCustomer}</em>, geography = <em>{result.inputEcho.inferredGeography}</em></span>
            </div>
          )}

          {/* Actions */}
          <div className={styles.resultActions}>
            <button className={styles.newValidationBtn} onClick={handleReset}>← Validate another idea</button>
            <SaveButton
              cardData={cardData}
              state={state}
              city={city}
              zip={zip}
              sector={sector || 'Validation'}
              sectorLabel={sector || 'Validation'}
              onNavigateDashboard={() => onNavigate('saved')}
              onSaved={(id) => setSavedOpportunityId(id)}
            />
            {savedOpportunityId && (
              <ShareButton opportunityId={savedOpportunityId} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
