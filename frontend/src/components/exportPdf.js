import jsPDF from 'jspdf';

export function exportPlanAsPDF(plan, analysisId) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210, pageH = 297, margin = 18;
  let y = margin;

  const GOLD  = [255, 200, 67];
  const DARK  = [7, 9, 13];
  const SLATE = [18, 22, 32];
  const TEXT  = [200, 212, 227];
  const MUTED = [77, 96, 112];
  const WHITE = [238, 242, 248];

  // Header band
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 36, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, 36, pageW, 2, 'F');

  doc.setTextColor(...GOLD);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('BIG', margin, 18);

  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Business Opportunity Intelligence', margin + 18, 18);

  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.text(
    `big-eosin.vercel.app  ·  Generated: ${plan.generated_date}`,
    pageW - margin, 28, { align: 'right' }
  );

  y = 46;

  // Plan title
  doc.setTextColor(...GOLD);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const titleLines = doc.splitTextToSize(plan.plan_title, pageW - margin * 2);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6 + 2;

  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const tagLines = doc.splitTextToSize(plan.tagline, pageW - margin * 2);
  doc.text(tagLines, margin, y);
  y += tagLines.length * 5 + 6;

  // Key metrics band
  const metrics = plan.sections.executive_summary.key_metrics;
  doc.setFillColor(...SLATE);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 3, 3, 'F');
  const colW = (pageW - margin * 2) / metrics.length;
  metrics.forEach((m, i) => {
    const cx = margin + colW * i + colW / 2;
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(String(m.value), cx, y + 9, { align: 'center' });
    doc.setTextColor(...MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(m.label, cx, y + 16, { align: 'center' });
  });
  y += 30;

  function checkPage(needed = 20) {
    if (y + needed > pageH - 15) { doc.addPage(); y = margin; }
  }

  function addSection(title, content, accent) {
    checkPage(30);
    doc.setFillColor(...accent);
    doc.rect(margin, y, 3, 6, 'F');
    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(title, margin + 6, y + 5);
    y += 10;

    doc.setTextColor(...TEXT);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(content || '', pageW - margin * 2);
    lines.forEach(line => {
      checkPage(6);
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 6;
  }

  const s = plan.sections;
  addSection('01 · EXECUTIVE SUMMARY', s.executive_summary.body, GOLD);
  addSection('02 · MARKET OPPORTUNITY',
    [s.market_opportunity.market_size, s.market_opportunity.demand_signals, s.market_opportunity.local_context].join('\n\n'),
    [0, 212, 255]);
  addSection('03 · COMPETITIVE LANDSCAPE',
    [s.competitive_landscape.competitor_analysis, s.competitive_landscape.competitive_advantage, s.competitive_landscape.moat].join('\n\n'),
    [167, 139, 250]);
  addSection('04 · REVENUE MODEL',
    [s.revenue_model.primary_revenue, s.revenue_model.pricing_strategy, s.revenue_model.revenue_ramp].join('\n\n'),
    [0, 230, 118]);
  addSection('05 · STARTUP COSTS',
    `Total: ${s.startup_costs.total_range}\n\n` +
    s.startup_costs.breakdown.map(r => `${r.category}: $${Number(r.low).toLocaleString()}–$${Number(r.high).toLocaleString()} — ${r.notes}`).join('\n') +
    `\n\nFunding Options: ${s.startup_costs.funding_options}`,
    [255, 159, 67]);
  addSection('06 · 12-MONTH MILESTONES',
    s.milestones.months.map(m => `${m.period} (${m.phase}) — Target: ${m.revenue_target}\n${m.goals.join(' · ')}`).join('\n\n') +
    `\n\nYear 1 Success Criteria: ${s.milestones.year_1_exit_criteria}`,
    [244, 114, 182]);
  addSection('07 · EXIT STRATEGY',
    [s.exit_strategy.valuation_basis, s.exit_strategy.primary_exit, s.exit_strategy.value_drivers, s.exit_strategy.timeline].join('\n\n'),
    GOLD);

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...DARK);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setTextColor(...MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(plan.footer_disclaimer, margin, pageH - 5, { maxWidth: pageW - margin * 2 - 15 });
    doc.text(`${i} / ${totalPages}`, pageW - margin, pageH - 5, { align: 'right' });
  }

  doc.save(`BIG-BusinessPlan-${analysisId || 'plan'}.pdf`);
}
