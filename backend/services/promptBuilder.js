/**
 * Builds the Claude prompt for live opportunity card generation.
 * Injects real Census, BLS, and Google Trends data as grounding context.
 * Returns JSON matching BIG's existing OpportunityCard schema.
 */
function buildOpportunityPrompt({ state, city, zip, sectorConfig, censusData, blsData, trendsData }) {
  const censusContext = censusData?.estab
    ? `- Existing ${sectorConfig.naicsLabel} establishments in ZIP ${zip}: ${censusData.estab.toLocaleString()}
- Employees in this sector in this ZIP: ${censusData.emp?.toLocaleString() || 'unavailable'}
- Annual sector payroll in this ZIP: $${censusData.payann ? Math.round(censusData.payann / 1000) + 'K' : 'unavailable'}
- Source: ${censusData.source}`
    : `- Census establishment data for ZIP ${zip}: suppressed or unavailable — use your knowledge of ${city}`;

  const blsContext = blsData?.employment
    ? `- Total ${sectorConfig.label} employment in ${state}: ${blsData.employment.toLocaleString()} workers
- Average weekly wage in this sector: $${blsData.avgWeeklyWage?.toLocaleString() || 'unavailable'}
- Average annual pay: $${blsData.avgAnnualPay?.toLocaleString() || 'unavailable'}
- Total establishments in ${state}: ${blsData.establishments?.toLocaleString() || 'unavailable'}
- Source: ${blsData.source}`
    : `- BLS employment data for ${state}: unavailable — use your sector knowledge`;

  const trendsContext = trendsData?.trend !== 'unknown'
    ? `- Google Trends signal for "${trendsData.keyword}" in ${state}: ${trendsData.trend.toUpperCase()} (score: ${trendsData.score}/100)
- Recent 6-month avg: ${trendsData.recentAvg}/100 vs earlier avg: ${trendsData.earlierAvg}/100
- Direction: ${trendsData.direction > 0 ? '+' : ''}${trendsData.direction} points over 12 months`
    : `- Google Trends data unavailable — assess trend from sector fundamentals`;

  return `You are a senior business intelligence analyst generating a specific, locally-calibrated opportunity card for entrepreneurs.

## Target Location & Sector
- State: ${state}
- City: ${city}
- ZIP: ${zip}
- Sector: ${sectorConfig.label} (NAICS ${sectorConfig.naics})
- Date: ${new Date().toISOString().split('T')[0]}

## Real Market Data (incorporate these numbers directly into your analysis)

### Business Density (Census Bureau)
${censusContext}

### Employment & Wages (BLS QCEW)
${blsContext}

### Demand Trend (Google Trends)
${trendsContext}

## Instructions
Generate ONE highly specific business opportunity for ${city}, ${state} ZIP ${zip} in the ${sectorConfig.label} sector. Use the real data above to calibrate your financial projections and market assessment.

Return ONLY a valid JSON object — no markdown fences, no explanation:

{
  "name": "Specific Business Name (4-7 words, unique to this market)",
  "model": "Business model type (e.g. B2B SaaS, Franchise, D2C, Marketplace)",
  "startupCost": "$XK–$YK",
  "grossMargin": "XX–YY%",
  "timeToProfit": "X–Y months",
  "tam": "$XB or $XM (with brief market description)",
  "sam": "$XM (addressable within ${state})",
  "som": "$XM (realistic Year 3 capture)",
  "revenueYr1": "$XK–$YK",
  "revenueYr3": "$XM–$YM",
  "exitVal": "$XM–$YM",
  "score": 8.5,
  "ltv_cac": "X:1",
  "paybackMonths": 8,
  "whyItWorks": "2-3 sentences specific to ${city}: why this business, why here, why now. Reference local population, the ${censusData?.estab ? censusData.estab + ' existing establishments creating adjacency opportunities' : 'local market dynamics'}, and the ${trendsData?.trend || 'current'} demand trend.",
  "profitDrivers": [
    "Driver 1 specific to ${sectorConfig.label} economics",
    "Driver 2 with ${state} market context",
    "Driver 3"
  ],
  "greenSignals": [
    "Signal 1 from real data: ${trendsData?.trend !== 'unknown' ? trendsData.trend + ' Google Trends signal for ' + trendsData.keyword : 'sector fundamentals'}",
    "Signal 2 referencing ${state} market conditions",
    "Signal 3"
  ],
  "keyRisks": [
    "Risk 1 specific to ${city}/${zip} geography",
    "Risk 2 specific to ${sectorConfig.label} competitive dynamics"
  ],
  "watchpoints": [
    "Watchpoint 1 (early warning sign to monitor)",
    "Watchpoint 2"
  ],
  "launchPlan": "Month 1–30: [specific action for ${city} market]. Month 31–60: [action]. Month 61–90: [action].",
  "topCompetitors": ["Real or representative competitor name in ${city} or ${state}", "Competitor 2", "Competitor 3"],
  "verdict": "1-2 sentence verdict: is this a strong opportunity in ${city} right now, and what is the single most important success factor?"
}

RULES:
1. Every field must be specific to ${city}, ${state} ${zip} — not generic national advice
2. Calibrate financials to the real ${state} wage data (avg weekly wage: $${blsData?.avgWeeklyWage?.toLocaleString() || 'unknown'}) and establishment density
3. Score 7.0–9.5 based on real conviction (not marketing); reflect the ${trendsData?.trend || 'unknown'} trend signal
4. topCompetitors must name real businesses you know operate in ${city} or ${state} — not generic placeholders
5. Keep all string values under 50 words`;
}

module.exports = { buildOpportunityPrompt };
