const axios = require('axios');
const NodeCache = require('node-cache');
const { STATE_TRENDS_GEO } = require('../config/sectorMap');

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_TRENDS) || 3600 });

/**
 * Fetches Google Trends interest data for a sector in a given state.
 * Uses SerpApi if key is available; falls back to google-trends-api npm package.
 */
async function getSectorTrend(state, keywords) {
  const primaryKeyword = keywords[0];
  const cacheKey = `trends_${state}_${primaryKeyword.replace(/\s+/g, '_')}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const geo = STATE_TRENDS_GEO[state] || 'US';

  // Path A: SerpApi
  if (process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== 'none') {
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google_trends',
          q: primaryKeyword,
          geo,
          date: 'today 12-m',
          api_key: process.env.SERPAPI_KEY,
        },
        timeout: 10000,
      });
      const timelineData = response.data?.interest_over_time?.timeline_data;
      if (timelineData && timelineData.length > 0) {
        const values = timelineData.map(d => d.values?.[0]?.extracted_value || 0);
        const result = analyzeTrend(values, primaryKeyword, `SerpApi / Google Trends (${state})`);
        cache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('[Trends] SerpApi failed, trying npm fallback:', err.message);
    }
  }

  // Path B: google-trends-api npm package
  try {
    const googleTrends = require('google-trends-api');
    const raw = await googleTrends.interestOverTime({
      keyword: primaryKeyword,
      geo,
      startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      endTime: new Date(),
    });
    const parsed = JSON.parse(raw);
    const values = parsed?.default?.timelineData?.map(d => d.value?.[0] || 0) || [];
    if (values.length > 0) {
      const result = analyzeTrend(values, primaryKeyword, `google-trends-api (${state})`);
      cache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('[Trends] npm fallback also failed:', err.message);
  }

  const fallback = {
    trend: 'unknown',
    score: 50,
    direction: 0,
    recentAvg: null,
    earlierAvg: null,
    source: 'unavailable',
    keyword: primaryKeyword,
  };
  cache.set(cacheKey, fallback);
  return fallback;
}

function analyzeTrend(values, keyword, source) {
  const mid = Math.floor(values.length / 2);
  const earlierAvg = values.slice(0, mid).reduce((a, b) => a + b, 0) / (mid || 1);
  const recentAvg  = values.slice(mid).reduce((a, b) => a + b, 0) / (values.length - mid || 1);
  const latestScore = values[values.length - 1] || 0;
  const direction = recentAvg - earlierAvg;

  let trend;
  if (direction > 10)       trend = 'rising';
  else if (direction < -10) trend = 'declining';
  else                      trend = 'stable';

  return {
    trend,
    score: Math.round(latestScore),
    direction: Math.round(direction),
    recentAvg: Math.round(recentAvg),
    earlierAvg: Math.round(earlierAvg),
    source,
    keyword,
  };
}

module.exports = { getSectorTrend };
