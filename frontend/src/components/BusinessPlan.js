import { useState } from 'react';
import { exportPlanAsPDF } from './exportPdf';
import { exportPitchDeck } from './exportPitchDeck';
import styles from './BusinessPlan.module.css';

const SECTIONS = [
  { key: 'executive_summary',     label: 'Executive Summary',    icon: '📋' },
  { key: 'market_opportunity',    label: 'Market Opportunity',   icon: '📍' },
  { key: 'competitive_landscape', label: 'Competitive Landscape',icon: '⚔️' },
  { key: 'revenue_model',         label: 'Revenue Model',        icon: '💰' },
  { key: 'startup_costs',         label: 'Startup Costs',        icon: '🚀' },
  { key: 'milestones',            label: '12-Month Milestones',  icon: '📅' },
  { key: 'exit_strategy',         label: 'Exit Strategy',        icon: '🏆' },
];

export default function BusinessPlan({ plan, analysisId, onClose }) {
  const [open, setOpen] = useState('executive_summary');
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingDeck, setExportingDeck] = useState(false);

  async function handleExportPdf() {
    setExportingPdf(true);
    try { exportPlanAsPDF(plan, analysisId); } finally { setExportingPdf(false); }
  }

  async function handleExportDeck() {
    setExportingDeck(true);
    try { exportPitchDeck(plan, analysisId); } finally { setExportingDeck(false); }
  }

  const s = plan.sections;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.planBadge}>📄 Business Plan</div>
          <h2 className={styles.planTitle}>{plan.plan_title}</h2>
          <p className={styles.planTagline}>{plan.tagline}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={handleExportPdf} disabled={exportingPdf}>
            {exportingPdf ? 'Generating…' : '⬇ Export PDF'}
          </button>
          <button className={styles.deckBtn} onClick={handleExportDeck} disabled={exportingDeck}>
            {exportingDeck ? 'Generating…' : '📊 Pitch Deck'}
          </button>
          {onClose && <button className={styles.closeBtn} onClick={onClose}>✕</button>}
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsBar}>
        {s.executive_summary.key_metrics.map(m => (
          <div key={m.label} className={styles.metric}>
            <div className={styles.metricVal}>{m.value}</div>
            <div className={styles.metricLbl}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Accordion */}
      <div className={styles.sections}>
        {SECTIONS.map(sec => (
          <div key={sec.key} className={styles.section}>
            <button
              className={`${styles.sectionHeader} ${open === sec.key ? styles.sectionHeaderOpen : ''}`}
              onClick={() => setOpen(open === sec.key ? null : sec.key)}
            >
              <span>{sec.icon} {sec.label}</span>
              <span className={styles.chevron}>{open === sec.key ? '▲' : '▼'}</span>
            </button>
            {open === sec.key && (
              <div className={styles.sectionBody}>
                <SectionContent sectionKey={sec.key} data={s[sec.key]} />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className={styles.disclaimer}>{plan.footer_disclaimer}</p>
    </div>
  );
}

function SectionContent({ sectionKey, data }) {
  if (!data) return null;

  if (sectionKey === 'executive_summary') {
    return (
      <>
        <h3 className={styles.sectionHeadline}>{data.headline}</h3>
        <p className={styles.bodyText}>{data.body}</p>
      </>
    );
  }

  if (sectionKey === 'startup_costs') {
    return (
      <>
        <h3 className={styles.sectionHeadline}>{data.headline}</h3>
        <p className={styles.totalRange}>Total required: <strong>{data.total_range}</strong></p>
        <table className={styles.costTable}>
          <thead>
            <tr><th>Category</th><th>Low</th><th>High</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {(data.breakdown || []).map(r => (
              <tr key={r.category}>
                <td>{r.category}</td>
                <td>${Number(r.low).toLocaleString()}</td>
                <td>${Number(r.high).toLocaleString()}</td>
                <td>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.fieldBlock}>
          <h4>Funding Options</h4>
          <p>{data.funding_options}</p>
        </div>
      </>
    );
  }

  if (sectionKey === 'milestones') {
    return (
      <>
        <h3 className={styles.sectionHeadline}>{data.headline}</h3>
        <div className={styles.milestoneGrid}>
          {(data.months || []).map(m => (
            <div key={m.period} className={styles.milestoneCard}>
              <div className={styles.milestonePeriod}>{m.period}</div>
              <div className={styles.milestonePhase}>{m.phase}</div>
              <div className={styles.milestoneRevenue}>{m.revenue_target}</div>
              <ul className={styles.milestoneGoals}>
                {(m.goals || []).map((g, i) => <li key={i}>{g}</li>)}
              </ul>
              <div className={styles.milestoneMetric}>Track: {m.key_metric}</div>
            </div>
          ))}
        </div>
        <div className={styles.fieldBlock}>
          <h4>Year 1 Success Criteria</h4>
          <p>{data.year_1_exit_criteria}</p>
        </div>
      </>
    );
  }

  if (sectionKey === 'revenue_model') {
    return (
      <>
        <h3 className={styles.sectionHeadline}>{data.headline}</h3>
        <div className={styles.fieldBlock}>
          <h4>Primary Revenue</h4>
          <p>{data.primary_revenue}</p>
        </div>
        {data.unit_economics && (
          <div className={styles.ueBlock}>
            <h4>Unit Economics</h4>
            <div className={styles.ueGrid}>
              {Object.entries(data.unit_economics).map(([k, v]) => (
                <div key={k} className={styles.ueItem}>
                  <div className={styles.ueVal}>{v}</div>
                  <div className={styles.ueLbl}>{k.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.fieldBlock}>
          <h4>Revenue Ramp</h4>
          <p>{data.revenue_ramp}</p>
        </div>
        {data.secondary_revenue && (
          <div className={styles.fieldBlock}>
            <h4>Secondary Revenue</h4>
            <p>{data.secondary_revenue}</p>
          </div>
        )}
      </>
    );
  }

  // Default: render all string fields
  return (
    <>
      <h3 className={styles.sectionHeadline}>{data.headline}</h3>
      {Object.entries(data)
        .filter(([k, v]) => k !== 'headline' && k !== 'data_source' && typeof v === 'string')
        .map(([k, v]) => (
          <div key={k} className={styles.fieldBlock}>
            <h4>{k.replace(/_/g, ' ')}</h4>
            <p>{v}</p>
          </div>
        ))}
      {data.data_source && (
        <p className={styles.dataSource}>Source: {data.data_source}</p>
      )}
    </>
  );
}
