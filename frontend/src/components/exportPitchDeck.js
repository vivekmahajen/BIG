import pptxgen from 'pptxgenjs';

export function exportPitchDeck(plan, analysisId) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  const BG    = '07090D';
  const GOLD  = 'FFC843';
  const CYAN  = '00D4FF';
  const WHITE = 'EEF2F8';
  const MUTED = '4D6070';
  const SLATE = '111620';
  const GREEN = '00E676';

  function addSlide(num, title, renderFn) {
    const slide = pptx.addSlide();
    slide.background = { color: BG };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.05, fill: { color: GOLD } });
    slide.addText(`${String(num).padStart(2, '0')} / 10`, {
      x: 11.8, y: 6.9, w: 1.4, h: 0.3, fontSize: 8, color: MUTED, align: 'right', fontFace: 'Courier New',
    });
    slide.addText('BIG — Business Opportunity Intelligence', {
      x: 0.3, y: 6.9, w: 5, h: 0.3, fontSize: 7, color: MUTED, fontFace: 'Courier New',
    });
    if (title) {
      slide.addText(title, {
        x: 0.5, y: 0.25, w: 12.3, h: 0.45, fontSize: 10, color: MUTED, fontFace: 'Courier New', charSpacing: 3,
      });
    }
    renderFn(slide);
    return slide;
  }

  const s = plan.sections;

  // Slide 1: Cover
  addSlide(1, null, slide => {
    slide.addText('BIG', { x: 0.5, y: 0.8, w: 3, h: 1.2, fontSize: 72, bold: true, color: GOLD, fontFace: 'Arial' });
    slide.addText(plan.plan_title, { x: 0.5, y: 2.1, w: 12, h: 0.9, fontSize: 26, bold: true, color: WHITE, fontFace: 'Arial' });
    slide.addText(plan.tagline, { x: 0.5, y: 3.1, w: 10, h: 0.6, fontSize: 14, color: MUTED, fontFace: 'Arial', italic: true });
    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.0, w: 3, h: 0.8, fill: { color: SLATE }, line: { color: GOLD, width: 1 } });
    slide.addText(`Score: ${s.executive_summary.key_metrics[0]?.value || ''}`, {
      x: 0.5, y: 4.0, w: 3, h: 0.8, fontSize: 14, bold: true, color: GOLD, align: 'center', fontFace: 'Courier New',
    });
  });

  // Slide 2: Problem
  addSlide(2, 'THE PROBLEM', slide => {
    slide.addText('What gap does this business fill?', { x: 0.5, y: 0.9, w: 12, h: 0.7, fontSize: 24, bold: true, color: WHITE, fontFace: 'Arial' });
    slide.addText(s.market_opportunity.demand_signals, { x: 0.5, y: 1.8, w: 12, h: 4.8, fontSize: 13, color: MUTED, fontFace: 'Arial', valign: 'top' });
  });

  // Slide 3: Solution
  addSlide(3, 'THE SOLUTION', slide => {
    slide.addText(s.executive_summary.headline, { x: 0.5, y: 0.9, w: 12, h: 0.9, fontSize: 22, bold: true, color: GOLD, fontFace: 'Arial' });
    slide.addText((s.executive_summary.body || '').slice(0, 700), { x: 0.5, y: 2.0, w: 12, h: 4.5, fontSize: 12, color: MUTED, fontFace: 'Arial', valign: 'top' });
  });

  // Slide 4: Market Opportunity
  addSlide(4, 'MARKET OPPORTUNITY', slide => {
    slide.addText(s.market_opportunity.headline, { x: 0.5, y: 0.85, w: 12, h: 0.65, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial' });
    const metrics = s.executive_summary.key_metrics.slice(0, 4);
    metrics.forEach((m, i) => {
      const x = 0.5 + (i % 2) * 6.3;
      const y = 1.7 + Math.floor(i / 2) * 1.9;
      slide.addShape(pptx.ShapeType.rect, { x, y, w: 5.8, h: 1.6, fill: { color: SLATE }, line: { color: '263550', width: 1 } });
      slide.addText(String(m.value), { x, y: y + 0.15, w: 5.8, h: 0.9, fontSize: 22, bold: true, color: CYAN, align: 'center', fontFace: 'Arial' });
      slide.addText(m.label, { x, y: y + 1.05, w: 5.8, h: 0.4, fontSize: 9, color: MUTED, align: 'center', fontFace: 'Courier New' });
    });
    slide.addText(s.market_opportunity.local_context, { x: 0.5, y: 5.6, w: 12, h: 0.9, fontSize: 10, color: MUTED, fontFace: 'Arial', italic: true });
  });

  // Slide 5: Business Model
  addSlide(5, 'BUSINESS MODEL', slide => {
    slide.addText(s.revenue_model.headline, { x: 0.5, y: 0.85, w: 12, h: 0.65, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial' });
    slide.addText(s.revenue_model.primary_revenue, { x: 0.5, y: 1.7, w: 7.5, h: 3.8, fontSize: 11, color: MUTED, fontFace: 'Arial', valign: 'top' });
    slide.addShape(pptx.ShapeType.rect, { x: 8.3, y: 1.5, w: 4.5, h: 4.2, fill: { color: SLATE }, line: { color: GOLD, width: 1 } });
    slide.addText('UNIT ECONOMICS', { x: 8.3, y: 1.55, w: 4.5, h: 0.45, fontSize: 8, color: GOLD, align: 'center', fontFace: 'Courier New', charSpacing: 2 });
    Object.entries(s.revenue_model.unit_economics).forEach(([k, v], i) => {
      slide.addText(`${k.replace(/_/g, ' ')}: ${v}`, { x: 8.5, y: 2.1 + i * 0.48, w: 4.1, h: 0.42, fontSize: 9, color: WHITE, fontFace: 'Courier New' });
    });
  });

  // Slide 6: Competitive Landscape
  addSlide(6, 'COMPETITIVE LANDSCAPE', slide => {
    slide.addText(s.competitive_landscape.headline, { x: 0.5, y: 0.85, w: 12, h: 0.65, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial' });
    slide.addText(s.competitive_landscape.competitor_analysis, { x: 0.5, y: 1.7, w: 6.5, h: 4.2, fontSize: 11, color: MUTED, fontFace: 'Arial', valign: 'top' });
    slide.addShape(pptx.ShapeType.rect, { x: 7.2, y: 1.5, w: 5.6, h: 4.2, fill: { color: SLATE }, line: { color: GREEN, width: 1 } });
    slide.addText('YOUR ADVANTAGE', { x: 7.2, y: 1.55, w: 5.6, h: 0.45, fontSize: 8, color: GREEN, align: 'center', fontFace: 'Courier New', charSpacing: 2 });
    slide.addText(s.competitive_landscape.competitive_advantage, { x: 7.4, y: 2.1, w: 5.2, h: 3.4, fontSize: 10, color: WHITE, fontFace: 'Arial', valign: 'top' });
  });

  // Slide 7: Go-to-Market
  addSlide(7, 'GO-TO-MARKET', slide => {
    slide.addText('How we acquire the first 100 customers', { x: 0.5, y: 0.85, w: 12, h: 0.65, fontSize: 20, bold: true, color: WHITE, fontFace: 'Arial' });
    const m1 = s.milestones.months[0];
    slide.addText(`Month 1–2: ${(m1?.goals || []).join(' · ')}`, { x: 0.5, y: 1.7, w: 12, h: 0.9, fontSize: 12, color: GOLD, fontFace: 'Arial' });
    slide.addText((s.revenue_model.revenue_ramp || '').slice(0, 600), { x: 0.5, y: 2.8, w: 12, h: 3.8, fontSize: 12, color: MUTED, fontFace: 'Arial', valign: 'top' });
  });

  // Slide 8: 12-Month Roadmap
  addSlide(8, '12-MONTH ROADMAP', slide => {
    s.milestones.months.forEach((m, i) => {
      const x = 0.3 + i * 2.55;
      slide.addShape(pptx.ShapeType.rect, { x, y: 0.8, w: 2.4, h: 5.9, fill: { color: SLATE }, line: { color: '263550', width: 1 } });
      slide.addText(m.period, { x, y: 0.85, w: 2.4, h: 0.5, fontSize: 8, color: GOLD, align: 'center', fontFace: 'Courier New', bold: true });
      slide.addText(m.phase, { x, y: 1.35, w: 2.4, h: 0.45, fontSize: 10, color: WHITE, align: 'center', fontFace: 'Arial', bold: true });
      slide.addText(m.revenue_target, { x, y: 1.82, w: 2.4, h: 0.5, fontSize: 12, color: CYAN, align: 'center', fontFace: 'Arial', bold: true });
      (m.goals || []).forEach((g, gi) => {
        slide.addText(`• ${g}`, { x: x + 0.1, y: 2.45 + gi * 0.8, w: 2.2, h: 0.72, fontSize: 8, color: MUTED, fontFace: 'Arial', valign: 'top' });
      });
    });
  });

  // Slide 9: Financial Projections
  addSlide(9, 'FINANCIAL PROJECTIONS', slide => {
    slide.addText('Investment Required → Revenue Ramp → Exit', { x: 0.5, y: 0.85, w: 12, h: 0.65, fontSize: 18, bold: true, color: WHITE, fontFace: 'Arial' });
    const boxes = [
      { label: 'STARTUP COST', val: s.startup_costs.total_range, color: GOLD },
      { label: 'YEAR 1 REVENUE', val: s.executive_summary.key_metrics[1]?.value || '', color: CYAN },
      { label: 'PROJECTED EXIT', val: s.executive_summary.key_metrics[2]?.value || '', color: GREEN },
    ];
    boxes.forEach((b, i) => {
      const x = 0.5 + i * 4.27;
      slide.addShape(pptx.ShapeType.rect, { x, y: 1.8, w: 4, h: 2.6, fill: { color: SLATE }, line: { color: b.color, width: 2 } });
      slide.addText(b.label, { x, y: 1.85, w: 4, h: 0.5, fontSize: 8, color: MUTED, align: 'center', fontFace: 'Courier New', charSpacing: 1 });
      slide.addText(String(b.val), { x, y: 2.5, w: 4, h: 1.3, fontSize: 18, bold: true, color: b.color, align: 'center', fontFace: 'Arial' });
    });
    slide.addText(s.milestones.year_1_exit_criteria, { x: 0.5, y: 5.1, w: 12, h: 1.5, fontSize: 10, color: MUTED, fontFace: 'Arial', italic: true });
  });

  // Slide 10: The Ask & Exit
  addSlide(10, 'THE ASK & EXIT STRATEGY', slide => {
    slide.addText(s.exit_strategy.headline, { x: 0.5, y: 0.8, w: 12, h: 0.75, fontSize: 22, bold: true, color: GOLD, fontFace: 'Arial' });
    slide.addText(s.exit_strategy.valuation_basis, { x: 0.5, y: 1.7, w: 7.5, h: 2.6, fontSize: 12, color: MUTED, fontFace: 'Arial', valign: 'top' });
    slide.addText(s.exit_strategy.primary_exit, { x: 0.5, y: 4.4, w: 7.5, h: 1.6, fontSize: 11, color: WHITE, fontFace: 'Arial' });
    slide.addShape(pptx.ShapeType.rect, { x: 8.5, y: 1.5, w: 4.3, h: 3.1, fill: { color: SLATE }, line: { color: GOLD, width: 2 } });
    slide.addText('PROJECTED EXIT', { x: 8.5, y: 1.6, w: 4.3, h: 0.5, fontSize: 9, color: MUTED, align: 'center', fontFace: 'Courier New', charSpacing: 2 });
    slide.addText(String(s.executive_summary.key_metrics[2]?.value || ''), { x: 8.5, y: 2.3, w: 4.3, h: 1.3, fontSize: 20, bold: true, color: GOLD, align: 'center', fontFace: 'Arial' });
    slide.addText(s.exit_strategy.timeline, { x: 8.5, y: 3.6, w: 4.3, h: 0.7, fontSize: 9, color: MUTED, align: 'center', fontFace: 'Arial', italic: true });
    slide.addText('big-eosin.vercel.app  ·  Generated by BIG', { x: 0.5, y: 6.4, w: 12, h: 0.4, fontSize: 8, color: MUTED, align: 'center', fontFace: 'Courier New' });
  });

  pptx.writeFile({ fileName: `BIG-PitchDeck-${analysisId || 'deck'}.pptx` });
}
