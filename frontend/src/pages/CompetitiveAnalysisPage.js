import { useState } from 'react';
import { api } from '../api';
import Disclaimer from '../components/Disclaimer';
import styles from './CompetitiveAnalysisPage.module.css';

const FUNCTION_OPTIONS = [
  'Operations & processes',
  'Sales & business development',
  'Marketing & brand',
  'Customer experience & retention',
  'Technology & software stack',
  'Pricing & revenue model',
  'Talent & team structure',
  'Finance & unit economics',
  'Legal & compliance',
  'Partnerships & channels',
  'Product & service development',
  'Data & analytics',
  'Supply chain & vendors',
  'Geographic expansion',
  'Online reviews & reputation',
  'Listing optimization & algorithm performance',
  'Dynamic pricing & revenue management',
  'Guest / patient / client experience management',
];

const SCORING_OPTIONS = [
  { value: '1–10 numeric score', label: '1–10 Score', desc: 'Quantitative, easy to rank' },
  { value: 'Letter grade (A–F)', label: 'Letter Grade', desc: 'Intuitive, non-technical' },
  { value: 'Traffic light (Red / Yellow / Green)', label: 'Traffic Light', desc: 'Executive dashboards' },
  { value: 'Percentile rank (0–100)', label: 'Percentile Rank', desc: 'Detailed benchmarking' },
];

const HORIZON_OPTIONS = [
  { value: '90-day / 12-month / 3-year', label: '90d / 1yr / 3yr', desc: 'Most businesses' },
  { value: '30-60-90 day sprints', label: '30-60-90 Days', desc: 'Pre-launch / early stage' },
  { value: '1-year only (Q1 / Q2–Q3 / Q4)', label: '1-Year Plan', desc: 'Annual planning' },
  { value: '5-year strategic plan', label: '5-Year Strategic', desc: 'Investors / mature biz' },
];

const PRIORITY_OPTIONS = [
  'Biggest gaps vs. top competitor',
  'Fastest path to profitability',
  'Building a defensible moat',
  'Customer acquisition and growth',
  'Operational efficiency',
  'Brand awareness and trust',
];

const FORMAT_OPTIONS = [
  { value: 'Full structured report (tables + scorecards + milestones)', label: 'Full Report', desc: 'Tables, scorecards, milestones' },
  { value: 'Executive summary (bullets)', label: 'Executive Summary', desc: 'Concise bullets, key findings' },
  { value: 'Operational playbook (checklists)', label: 'Operational Playbook', desc: 'Step-by-step checklists' },
];

const STAGES = ['Pre-launch', 'Year 1', 'Growing', 'Scaling'];

const DEFAULT_FUNCTIONS = [
  'Operations & processes',
  'Sales & business development',
  'Marketing & brand',
  'Customer experience & retention',
  'Technology & software stack',
  'Pricing & revenue model',
  'Talent & team structure',
  'Finance & unit economics',
];

function MarkdownRenderer({ text }) {
  // Convert markdown to styled HTML for display
  const lines = text.split('\n');
  const elements = [];
  let tableLines = [];
  let inTable = false;
  let key = 0;

  function flushTable() {
    if (!tableLines.length) return;
    const rows = tableLines.map(l => l.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim()));
    const header = rows[0];
    const body = rows.slice(2); // skip separator row
    elements.push(
      <div key={key++} className={styles.tableWrap}>
        <table className={styles.mdTable}>
          <thead><tr>{header.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{body.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
    tableLines = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('|')) {
      inTable = true;
      tableLines.push(line);
      continue;
    }

    if (inTable) flushTable();

    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className={styles.mdH3}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className={styles.mdH2}>{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className={styles.mdH1}>{line.slice(2)}</h1>);
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={key++} className={styles.mdBold}>{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // collect consecutive list items
      const items = [line.slice(2)];
      while (i + 1 < lines.length && (lines[i+1].startsWith('- ') || lines[i+1].startsWith('* '))) {
        i++;
        items.push(lines[i].slice(2));
      }
      elements.push(
        <ul key={key++} className={styles.mdList}>
          {items.map((item, idx) => {
            // bold inline **text**
            const parts = item.split(/(\*\*[^*]+\*\*)/g).map((p, pi) =>
              p.startsWith('**') ? <strong key={pi}>{p.slice(2, -2)}</strong> : p
            );
            return <li key={idx}>{parts}</li>;
          })}
        </ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const items = [line.replace(/^\d+\. /, '')];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i+1])) {
        i++;
        items.push(lines[i].replace(/^\d+\. /, ''));
      }
      elements.push(
        <ol key={key++} className={styles.mdOList}>
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ol>
      );
    } else if (line.startsWith('---') || line.startsWith('===')) {
      elements.push(<hr key={key++} className={styles.mdHr} />);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className={styles.mdSpacer} />);
    } else {
      // inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, pi) =>
        p.startsWith('**') ? <strong key={pi}>{p.slice(2, -2)}</strong> : p
      );
      elements.push(<p key={key++} className={styles.mdP}>{parts}</p>);
    }
  }

  if (inTable) flushTable();
  return <div className={styles.mdBody}>{elements}</div>;
}

function handlePrintAnalysis(businessName, analysisText) {
  const w = window.open('', '_blank');
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Convert markdown to basic HTML for print
  const htmlBody = analysisText
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^\*\*(.+)\*\*$/gm, '<p><strong>$1</strong></p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^\|.+/gm, m => {
      const cells = m.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    });

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>BIG Competitive Analysis — ${businessName}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1e293b;background:#fff;padding:36px;font-size:13px;line-height:1.6;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #6366f1;}
  .brand{font-size:26px;font-weight:900;color:#6366f1;letter-spacing:-2px;}
  .meta{text-align:right;font-size:11px;color:#64748b;line-height:1.6;}
  .disclaimer{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;font-size:10.5px;color:#92400e;margin-bottom:20px;line-height:1.5;}
  h1{font-size:20px;font-weight:800;color:#0f172a;margin:20px 0 8px;}
  h2{font-size:16px;font-weight:700;color:#1e293b;margin:20px 0 8px;border-bottom:2px solid #6366f1;padding-bottom:4px;}
  h3{font-size:13px;font-weight:700;color:#334155;margin:14px 0 6px;}
  p{margin:0 0 8px;font-size:13px;}
  ul,ol{padding-left:20px;margin:0 0 10px;}
  li{margin-bottom:4px;font-size:13px;}
  hr{border:none;border-top:1px solid #e2e8f0;margin:16px 0;}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px;}
  th{background:#f1f5f9;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border:1px solid #e2e8f0;}
  td{padding:7px 10px;border:1px solid #e2e8f0;vertical-align:top;}
  tr:nth-child(even) td{background:#f8fafc;}
  strong{font-weight:700;}
  .footer{margin-top:28px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center;}
  @media print{body{padding:16px;}@page{margin:.8cm;size:A4;}}
</style></head><body>
<div class="header">
  <div><div class="brand">BIG</div><div style="font-size:11px;color:#64748b;margin-top:2px;">Competitive Analysis & Roadmap to #1</div></div>
  <div class="meta"><div>Generated: ${date}</div><div>Business: ${businessName}</div></div>
</div>
<div class="disclaimer"><strong>⚠ Disclaimer:</strong> This analysis is for informational and entertainment purposes only. It does not constitute financial, legal, or business advice. BIG assumes no liability for decisions made based on this content.</div>
${htmlBody}
<div class="footer">BIG — Business Opportunity Intelligence &nbsp;|&nbsp; For informational and entertainment purposes only. Not financial or investment advice.</div>
<script>window.onload=function(){window.print();};</script>
</body></html>`);
  w.document.close();
}

export default function CompetitiveAnalysisPage({ user, onBack, onLogout }) {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Step 1: Business
  const [business, setBusiness] = useState({ name: '', industry: '', geography: '', stage: 'Pre-launch', description: '' });
  // Step 2: Competitors
  const [competitors, setCompetitors] = useState([
    { name: '', strengths: '' }, { name: '', strengths: '' }, { name: '', strengths: '' },
    { name: '', strengths: '' }, { name: '', strengths: '' },
  ]);
  // Step 3: Config
  const [selectedFunctions, setSelectedFunctions] = useState(DEFAULT_FUNCTIONS);
  const [customFunction, setCustomFunction] = useState('');
  const [scoring, setScoring] = useState('1–10 numeric score');
  const [horizon, setHorizon] = useState('90-day / 12-month / 3-year');
  const [priorityFocus, setPriorityFocus] = useState('Biggest gaps vs. top competitor');
  const [outputFormat, setOutputFormat] = useState('Full structured report (tables + scorecards + milestones)');
  // Step 4: Context
  const [context, setContext] = useState('');

  function setBiz(field, val) { setBusiness(b => ({ ...b, [field]: val })); }
  function setComp(i, field, val) { setCompetitors(cs => cs.map((c, ci) => ci === i ? { ...c, [field]: val } : c)); }
  function toggleFn(fn) {
    setSelectedFunctions(prev => prev.includes(fn) ? prev.filter(f => f !== fn) : [...prev, fn]);
  }
  function addCustomFn() {
    if (customFunction.trim() && !selectedFunctions.includes(customFunction.trim())) {
      setSelectedFunctions(prev => [...prev, customFunction.trim()]);
      setCustomFunction('');
    }
  }

  async function generate() {
    setGenerating(true);
    setError('');
    try {
      const data = await api.competitiveAnalysis({
        business,
        competitors: competitors.filter(c => c.name.trim()),
        functions: selectedFunctions,
        scoring,
        horizon,
        priorityFocus,
        outputFormat,
        context: context.trim() || undefined,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>BIG</span>
            <span className={styles.headerTitle}>Competitive Analysis</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={onLogout}>Sign out</button>
          </div>
        </header>
        <Disclaimer />
        <div className={styles.resultPage}>
          <div className={styles.resultBar}>
            <button className={styles.backBtn} onClick={() => setResult(null)}>← Run New Analysis</button>
            <div className={styles.resultActions}>
              <span className={styles.resultTitle}>📊 {result.business} — Competitive Analysis</span>
              <button className={styles.pdfBtn} onClick={() => handlePrintAnalysis(result.business, result.analysis)}>
                ⬇ Download PDF
              </button>
              <button className={styles.dashBtn} onClick={onBack}>← Dashboard</button>
            </div>
          </div>
          <div className={styles.resultContent}>
            <MarkdownRenderer text={result.analysis} />
          </div>
        </div>
        <Disclaimer />
      </div>
    );
  }

  // ── Generating screen ──────────────────────────────────────────────────────
  if (generating) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>BIG</span>
            <span className={styles.headerTitle}>Competitive Analysis</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.userName}>{user.name}</span>
          </div>
        </header>
        <Disclaimer />
        <div className={styles.generatingScreen}>
          <div className={styles.generatingSpinner} />
          <h2 className={styles.generatingTitle}>Building your competitive roadmap…</h2>
          <p className={styles.generatingSubtitle}>
            Analysing {business.name}, scoring against {competitors.filter(c=>c.name).length} competitors
            across {selectedFunctions.length} business functions, and building your phased roadmap to #1.
            This takes 20–40 seconds.
          </p>
        </div>
        <Disclaimer />
      </div>
    );
  }

  // ── Form steps ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>BIG</span>
          <span className={styles.headerTitle}>Competitive Analysis Builder</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.logoutBtn} onClick={onBack}>← Dashboard</button>
          <span className={styles.userName}>{user.name}</span>
          <button className={styles.logoutBtn} onClick={onLogout}>Sign out</button>
        </div>
      </header>
      <Disclaimer />

      <div className={styles.formPage}>
        {/* Step indicator */}
        <div className={styles.steps}>
          {['Business', 'Competitors', 'Configuration', 'Context & Generate'].map((label, i) => (
            <div key={i} className={`${styles.stepItem} ${step === i+1 ? styles.stepActive : ''} ${step > i+1 ? styles.stepDone : ''}`}>
              <div className={styles.stepDot}>{step > i+1 ? '✓' : i+1}</div>
              <span className={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {/* ── Step 1: Business ── */}
        {step === 1 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Your Business</h2>
            <p className={styles.formSub}>The more specific you are, the more actionable your roadmap will be.</p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Business Name <span className={styles.req}>*</span></label>
              <input className={styles.input} value={business.name} onChange={e => setBiz('name', e.target.value)} placeholder="e.g. Sunrise STR Management" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Industry / Niche <span className={styles.req}>*</span></label>
              <input className={styles.input} value={business.industry} onChange={e => setBiz('industry', e.target.value)} placeholder="e.g. Short-Term Rental Property Management (not just 'Real Estate')" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Geography</label>
              <input className={styles.input} value={business.geography} onChange={e => setBiz('geography', e.target.value)} placeholder="e.g. Sacramento, CA metro — Sacramento, El Dorado, and Placer counties" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Business Stage</label>
              <div className={styles.pillGroup}>
                {STAGES.map(s => (
                  <button key={s} className={`${styles.pill} ${business.stage === s ? styles.pillActive : ''}`} onClick={() => setBiz('stage', s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Description <span className={styles.req}>*</span></label>
              <textarea className={styles.textarea} rows={4} value={business.description} onChange={e => setBiz('description', e.target.value)}
                placeholder="2–3 sentences: what you do, who you serve, what core problem you solve. Be specific." />
            </div>

            <div className={styles.navRow}>
              <div />
              <button className={styles.nextBtn} disabled={!business.name || !business.industry || !business.description}
                onClick={() => setStep(2)}>Next: Add Competitors →</button>
            </div>
          </div>
        )}

        {/* ── Step 2: Competitors ── */}
        {step === 2 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Competitors to Analyze</h2>
            <p className={styles.formSub}>Add 3–6 competitors. Include at least one national player and one local/regional. Leave blank rows empty — they'll be ignored.</p>

            {competitors.map((c, i) => (
              <div key={i} className={styles.competitorRow}>
                <div className={styles.competitorNum}>{i+1}</div>
                <div className={styles.competitorFields}>
                  <input className={styles.input} value={c.name} onChange={e => setComp(i, 'name', e.target.value)}
                    placeholder={`Competitor ${i+1} name (e.g. Vacasa)`} />
                  <input className={styles.input} style={{marginTop:8}} value={c.strengths} onChange={e => setComp(i, 'strengths', e.target.value)}
                    placeholder="Known strengths (optional — e.g. national scale, brand recognition, technology platform)" />
                </div>
              </div>
            ))}

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button className={styles.nextBtn} disabled={competitors.filter(c => c.name.trim()).length < 2}
                onClick={() => setStep(3)}>Next: Configure Analysis →</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Configuration ── */}
        {step === 3 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Analysis Configuration</h2>
            <p className={styles.formSub}>Choose what to assess and how to present the results.</p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Business Functions to Assess</label>
              <p className={styles.fieldHint}>Select all that apply. Click to toggle. All 8 defaults are pre-selected.</p>
              <div className={styles.checkGrid}>
                {FUNCTION_OPTIONS.map(fn => (
                  <label key={fn} className={`${styles.checkItem} ${selectedFunctions.includes(fn) ? styles.checkItemOn : ''}`}>
                    <input type="checkbox" checked={selectedFunctions.includes(fn)} onChange={() => toggleFn(fn)} />
                    <span>{fn}</span>
                  </label>
                ))}
              </div>
              <div className={styles.customFnRow}>
                <input className={styles.input} value={customFunction} onChange={e => setCustomFunction(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomFn()}
                  placeholder="Add a custom function specific to your business…" />
                <button className={styles.addBtn} onClick={addCustomFn}>Add</button>
              </div>
              {selectedFunctions.filter(f => !FUNCTION_OPTIONS.includes(f)).map(f => (
                <div key={f} className={styles.customFnTag}>
                  {f} <button onClick={() => setSelectedFunctions(prev => prev.filter(x => x !== f))}>✕</button>
                </div>
              ))}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Scoring Framework</label>
              <div className={styles.optionGrid}>
                {SCORING_OPTIONS.map(o => (
                  <button key={o.value} className={`${styles.optionCard} ${scoring === o.value ? styles.optionCardOn : ''}`}
                    onClick={() => setScoring(o.value)}>
                    <div className={styles.optionLabel}>{o.label}</div>
                    <div className={styles.optionDesc}>{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Roadmap Horizon</label>
              <div className={styles.optionGrid}>
                {HORIZON_OPTIONS.map(o => (
                  <button key={o.value} className={`${styles.optionCard} ${horizon === o.value ? styles.optionCardOn : ''}`}
                    onClick={() => setHorizon(o.value)}>
                    <div className={styles.optionLabel}>{o.label}</div>
                    <div className={styles.optionDesc}>{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Phase 1 Priority Focus</label>
              <div className={styles.pillGroup}>
                {PRIORITY_OPTIONS.map(p => (
                  <button key={p} className={`${styles.pill} ${priorityFocus === p ? styles.pillActive : ''}`}
                    onClick={() => setPriorityFocus(p)}>{p}</button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Output Format</label>
              <div className={styles.optionGrid}>
                {FORMAT_OPTIONS.map(o => (
                  <button key={o.value} className={`${styles.optionCard} ${outputFormat === o.value ? styles.optionCardOn : ''}`}
                    onClick={() => setOutputFormat(o.value)}>
                    <div className={styles.optionLabel}>{o.label}</div>
                    <div className={styles.optionDesc}>{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button className={styles.nextBtn} disabled={selectedFunctions.length === 0} onClick={() => setStep(4)}>Next: Final Details →</button>
            </div>
          </div>
        )}

        {/* ── Step 4: Context + Generate ── */}
        {step === 4 && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Additional Context</h2>
            <p className={styles.formSub}>Optional but highly recommended — specific constraints and targets dramatically improve the roadmap quality.</p>

            <div className={styles.contextHints}>
              {[
                ['Budget constraints', 'e.g. Total annual budget under $150K for Year 1'],
                ['Known weaknesses', 'e.g. No brand recognition, no existing customers, single founder'],
                ['Target metrics', 'e.g. Goal is 25 managed properties within 12 months'],
                ['Key hires needed', 'e.g. Need first 2 hires — operations and sales'],
                ['Technology preferences', 'e.g. Already using Guesty for PMS, prefer Stripe for payments'],
                ['Constraints', 'e.g. Cannot raise outside funding — must be cash-flow funded from Month 3'],
              ].map(([label, hint]) => (
                <div key={label} className={styles.contextHint}>
                  <strong>{label}:</strong> <span>{hint}</span>
                </div>
              ))}
            </div>

            <textarea className={styles.textarea} rows={8} value={context} onChange={e => setContext(e.target.value)}
              placeholder="Type any additional context here. Use the prompts above as a guide — include budget constraints, known weaknesses, target metrics, key hires, technology preferences, or any other constraints the analysis should account for." />

            {/* Summary */}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Analysis Summary</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}><span>Business</span><strong>{business.name}</strong></div>
                <div className={styles.summaryItem}><span>Industry</span><strong>{business.industry}</strong></div>
                <div className={styles.summaryItem}><span>Stage</span><strong>{business.stage}</strong></div>
                <div className={styles.summaryItem}><span>Competitors</span><strong>{competitors.filter(c=>c.name).length} companies</strong></div>
                <div className={styles.summaryItem}><span>Functions</span><strong>{selectedFunctions.length} areas</strong></div>
                <div className={styles.summaryItem}><span>Scoring</span><strong>{scoring}</strong></div>
                <div className={styles.summaryItem}><span>Horizon</span><strong>{horizon}</strong></div>
                <div className={styles.summaryItem}><span>Priority</span><strong>{priorityFocus}</strong></div>
              </div>
            </div>

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
              <button className={styles.generateBtn} onClick={generate}>
                ✦ Generate Competitive Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
