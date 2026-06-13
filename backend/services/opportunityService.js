const Anthropic = require('@anthropic-ai/sdk');
const NodeCache = require('node-cache');
const { SECTOR_MAP } = require('../config/sectorMap');
const { getBusinessDensity } = require('./censusService');
const { getEmploymentData } = require('./blsService');
const { getSectorTrend } = require('./trendsService');

const cardCache = new NodeCache({ stdTTL: 86400 }); // 24-hour card cache

async function generateLiveCard(state, city, zip, sectorName, { force = false } = {}) {
  const sectorConfig = SECTOR_MAP[sectorName];
  if (!sectorConfig) throw new Error(`Unknown sector: ${sectorName}`);

  const cacheKey = `livecard_${zip}_${sectorName.replace(/\s+/g,'_')}`;
  if (!force) {
    const cached = cardCache.get(cacheKey);
    if (cached) return { ...cached, _fromCache: true };
  }

  const t0 = Date.now();

  // Fetch all signals in parallel — any failure is tolerated
  const [censusData, blsData, trendsData] = (await Promise.allSettled([
    getBusinessDensity(zip, state, sectorConfig.naics),
    getEmploymentData(state, sectorConfig.naics),
    getSectorTrend(state, sectorConfig.trendsKeywords),
  ])).map(r => r.status === 'fulfilled' ? r.value : null);

  console.log(`[BIG live] data signals ${Date.now()-t0}ms | census:${censusData?.source||'fail'} bls:${blsData?.source||'fail'} trends:${trendsData?.source||'fail'}`);

  // Build Claude prompt
  const censusCtx = censusData?.estab != null
    ? censusData.statewide
      ? `- ${sectorConfig.naicsLabel} establishments statewide in ${state}: ${censusData.estab.toLocaleString()} (ZIP-level data unavailable — do NOT present this as a local figure)\n- Statewide employees in sector: ${censusData.emp?.toLocaleString()}\n- Statewide annual payroll: $${censusData.payann ? Math.round(censusData.payann/1000)+'K' : 'N/A'}\n- Source: ${censusData.source}`
      : `- ${sectorConfig.naicsLabel} establishments in ZIP ${zip}: ${censusData.estab.toLocaleString()}\n- Employees in sector / ZIP: ${censusData.emp?.toLocaleString()}\n- Annual payroll: $${censusData.payann ? Math.round(censusData.payann/1000)+'K' : 'N/A'}\n- Source: ${censusData.source}`
    : `- Census data for ZIP ${zip}: unavailable — use your knowledge of ${city}, ${state} demographics`;

  const blsCtx = blsData?.employment != null
    ? `- ${sectorConfig.naicsLabel} employment in ${state}: ${blsData.employment.toLocaleString()} workers\n- Avg weekly wage: $${blsData.avgWeeklyWage?.toLocaleString()}\n- Avg annual pay: $${blsData.avgAnnualPay?.toLocaleString()}\n- Establishments statewide: ${blsData.establishments?.toLocaleString()}\n- Source: ${blsData.source}`
    : `- BLS employment data: unavailable`;

  const trendsCtx = trendsData?.trend !== 'unknown'
    ? `- Google Trends for "${trendsData.keyword}" in ${state}: ${trendsData.trend.toUpperCase()} (score ${trendsData.score}/100, direction ${trendsData.direction > 0 ? '+' : ''}${trendsData.direction} pts over 12 months)`
    : `- Trend data unavailable — assess from sector fundamentals`;

  const today = new Date().toISOString();

  const prompt = `You are a senior business intelligence analyst. Generate a live, hyper-local opportunity card for an entrepreneur.

Location: ${city}, ${state} (ZIP ${zip})
Sector: ${sectorName} (NAICS ${sectorConfig.naics})
Date: ${today.split('T')[0]}

REAL MARKET DATA — incorporate these numbers directly:
${censusCtx}
${blsCtx}
${trendsCtx}

Return ONLY valid JSON (no markdown, no preamble). Map your analysis to this exact schema used by our existing card renderer:

{
  "name": "<Specific business name — NOT generic like 'Restaurant', e.g. 'Hyper-Local Meal-Kit Subscription Box'>",
  "model": "<Business model, e.g. 'B2C Subscription + Marketplace'>",
  "startupCost": "<range like '$45K–$80K'>",
  "grossMargin": "<range like '62–70%'>",
  "timeToProfit": "<e.g. '8–12 months'>",
  "tam": "<dollar figure with context, e.g. '$2.1B California food-delivery market'>",
  "revenueYr1": "<e.g. '$180K–$320K'>",
  "revenueYr3": "<e.g. '$1.2M–$2.4M'>",
  "score": <float 7.0–9.5>,
  "exitVal": "<e.g. '$8M–$15M'>",
  "whyItWorks": "<2-3 sentences specific to ${city}: reference the Census/BLS numbers, local demographics, or timing. Do not be generic.>",
  "profitDrivers": ["<driver specific to ${city}>", "<driver 2>", "<driver 3>"],
  "greenSignals": ["<signal 1 backed by real data above>", "<signal 2>", "<signal 3>"],
  "keyRisks": ["<risk 1 specific to this ZIP/sector>", "<risk 2>", "<risk 3>"],
  "watchpoints": ["<watchpoint 1>", "<watchpoint 2>"],
  "launchPlan": "<Month 1–30: [action specific to ${city}]. Month 31–60: [action]. Month 61–90: [action].>",
  "topCompetitors": ["<real or representative competitor in ${city} or ${state}>", "<competitor 2>", "<competitor 3>"],
  "ltv_cac": "<e.g. '8:1'>",
  "paybackMonths": <integer>,
  "sam": "<e.g. '$210M'>",
  "som": "<e.g. '$21M'>",
  "bestZip": "${zip}",
  "liveAnalysis": true,
  "dataQuality": {
    "censusAvailable": ${censusData?.estab != null ? 'true' : 'false'},
    "blsAvailable": ${blsData?.employment != null ? 'true' : 'false'},
    "trendsAvailable": ${trendsData?.trend !== 'unknown' ? 'true' : 'false'},
    "generatedAt": "${today}",
    "confidence": "<High|Medium|Low>"
  }
}

Rules:
1. Every insight must be SPECIFIC to ${city}, ${state} ZIP ${zip} — not generic U.S. advice
2. Incorporate the real numbers above into whyItWorks, greenSignals, and financials
3. Use real competitor names you know for the ${city} market where possible
4. Keep all string values concise (under 35 words each)`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const client = new Anthropic({ apiKey });
  const t1 = Date.now();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });
  console.log(`[BIG live] Claude ${Date.now()-t1}ms`);

  const raw = message.content[0]?.text?.replace(/```json|```/g, '').trim() || '';
  let card;
  try { card = JSON.parse(raw); }
  catch { card = JSON.parse(raw.replace(/,\s*$/, '') + '}'); }

  card.aiGenerated = true;
  card._meta = {
    state, city, zip, sector: sectorName,
    generatedAt: today,
    generationMs: Date.now() - t0,
    sources: { census: censusData?.source, bls: blsData?.source, trends: trendsData?.source },
  };

  cardCache.set(cacheKey, card);
  return card;
}

module.exports = { generateLiveCard };
