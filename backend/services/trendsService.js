const axios = require('axios');
const NodeCache = require('node-cache');
const { STATE_TRENDS_GEO } = require('../config/sectorMap');

const cache = new NodeCache({ stdTTL: 3600 }); // 1-hour cache

async function getSectorTrend(state, keywords) {
  const keyword = keywords[0];
  const cacheKey = `trends_${state}_${keyword.replace(/\s+/g, '_')}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const geo = STATE_TRENDS_GEO[state] || 'US';
  const fallback = { trend: 'unknown', score: 50, direction: 0, source: 'unavailable', keyword };

  // SerpApi path
  if (process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== 'none') {
    try {
      const { data } = await axios.get('https://serpapi.com/search', {
        params: { engine: 'google_trends', q: keyword, geo, date: 'today 12-m', api_key: process.env.SERPAPI_KEY },
        timeout: 10000,
      });
      const timeline = data?.interest_over_time?.timeline_data;
      if (timeline?.length) {
        const values = timeline.map(d => d.values?.[0]?.extracted_value || 0);
        const result = analyzeTrend(values, keyword, `SerpApi (${state})`);
        cache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('SerpApi failed:', err.message);
    }
  }

  cache.set(cacheKey, fallback);
  return fallback;
}

function analyzeTrend(values, keyword, source) {
  const mid = Math.floor(values.length / 2);
  const earlier = values.slice(0, mid).reduce((a, b) => a + b, 0) / (mid || 1);
  const recent  = values.slice(mid).reduce((a, b) => a + b, 0) / ((values.length - mid) || 1);
  const direction = recent - earlier;
  const trend = direction > 10 ? 'rising' : direction < -10 ? 'declining' : 'stable';
  return { trend, score: Math.round(values[values.length - 1] || 0), direction: Math.round(direction), recentAvg: Math.round(recent), earlierAvg: Math.round(earlier), source, keyword };
}

module.exports = { getSectorTrend };
