const Anthropic = require('@anthropic-ai/sdk');
const NodeCache = require('node-cache');
const { SECTOR_MAP, STATE_CODE_TO_NAME } = require('../config/sectorMap');
const { getBusinessDensity } = require('./censusService');
const { getEmploymentData } = require('./blsService');
const { getSectorTrend } = require('./trendsService');
const { buildOpportunityPrompt } = require('./promptBuilder');

const cardCache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_CARD) || 3600 });

/**
 * Main pipeline: fetches real data signals in parallel, then generates
 * a locally-calibrated opportunity card via Claude API.
 *
 * @param {string} stateInput  - Full state name OR 2-letter code
 * @param {string} city        - City name
 * @param {string} zip         - 5-digit ZIP code
 * @param {string} sector      - Sector label matching SECTOR_MAP keys
 * @returns {Object} Opportunity card matching BIG's existing card schema + _meta
 */
async function generateLiveCard(stateInput, city, zip, sector) {
  // Normalize state to full name
  const state = stateInput.length === 2
    ? (STATE_CODE_TO_NAME[stateInput.toUpperCase()] || stateInput)
    : stateInput;

  const sectorConfig = SECTOR_MAP[sector];
  if (!sectorConfig) {
    throw new Error(`Unknown sector: "${sector}". Check /api/sectors for valid options.`);
  }

  const cardCacheKey = `livecard_${state}_${city}_${zip}_${sector}`;
  const cachedCard = cardCache.get(cardCacheKey);
  if (cachedCard) {
    return { ...cachedCard, _fromCache: true };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  console.log(`[BIG Live] Generating: ${city}, ${state} ${zip} / ${sector}`);
  const startTime = Date.now();

  // Fetch all data signals in parallel — failures are tolerated
  const [censusData, blsData, trendsData] = await Promise.allSettled([
    getBusinessDensity(zip, state, sectorConfig.naics),
    getEmploymentData(state, sectorConfig.naics),
    getSectorTrend(state, sectorConfig.trendsKeywords),
  ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : null));

  console.log(`[BIG Live] Data in ${Date.now() - startTime}ms — Census: ${censusData?.source || 'failed'} | BLS: ${blsData?.source || 'failed'} | Trends: ${trendsData?.source || 'failed'}`);

  const prompt = buildOpportunityPrompt({ state, city, zip, sectorConfig, censusData, blsData, trendsData });

  const anthropic = new Anthropic({ apiKey });
  const claudeStart = Date.now();

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  console.log(`[BIG Live] Claude: ${Date.now() - claudeStart}ms`);

  const rawText = message.content[0]?.text || '';
  let card;
  try {
    const cleaned = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    card = JSON.parse(cleaned);
  } catch {
    // Try stripping trailing comma issues
    try {
      const fixed = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
        .replace(/,\s*([\}\]])/g, '$1');
      card = JSON.parse(fixed);
    } catch {
      console.error('[BIG Live] JSON parse failed:', rawText.substring(0, 300));
      throw new Error('AI response could not be parsed. Please retry.');
    }
  }

  card.aiGenerated = true;
  card.liveGenerated = true;
  card.bestZip = zip;

  card._meta = {
    state, city, zip, sector,
    generatedAt: new Date().toISOString(),
    generationMs: Date.now() - startTime,
    dataSources: {
      census: censusData?.source || 'unavailable',
      bls: blsData?.source || 'unavailable',
      trends: trendsData?.source || 'unavailable',
    },
    dataQuality: {
      censusDataAvailable: !!(censusData?.estab),
      blsDataAvailable: !!(blsData?.employment),
      trendsDataAvailable: !!(trendsData && trendsData.trend !== 'unknown'),
    },
    fromCache: false,
  };

  cardCache.set(cardCacheKey, card);
  return card;
}

module.exports = { generateLiveCard };
