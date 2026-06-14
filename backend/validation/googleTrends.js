'use strict';

// Maps BIG country codes → SerpAPI geo codes
const GEO_MAP = {
  US: 'US', CA: 'CA', GB: 'GB', AU: 'AU', IN: 'IN',
  DE: 'DE', FR: 'FR', AE: 'AE', SG: 'SG', BR: 'BR',
  JP: 'JP', MX: 'MX', ZA: 'ZA', NL: 'NL', NG: 'NG',
  KE: 'KE', ES: 'ES', IT: 'IT', PH: 'PH', PK: 'PK',
  CN: 'CN', ID: 'ID',
};

async function getTrendData(keyword, countryCode = 'US') {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return null;

  const geo = GEO_MAP[countryCode] || 'US';
  const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&geo=${geo}&date=${encodeURIComponent('today 12-m')}&api_key=${apiKey}`;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return null;
    const data = await resp.json();

    const timeline = data?.interest_over_time?.timeline_data ?? [];
    if (timeline.length < 4) return null;

    const values = timeline.map(t => t.values?.[0]?.extracted_value ?? 0);
    const half = Math.floor(values.length / 2);
    const avgFirst  = values.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const avgSecond = values.slice(half).reduce((a, b) => a + b, 0) / (values.length - half);
    const growthPct = avgFirst > 0 ? Math.round(((avgSecond - avgFirst) / avgFirst) * 100) : 0;

    const current = values[values.length - 1];
    const peak    = Math.max(...values);

    // Related rising queries
    const risingQueries = (data?.related_queries?.rising ?? [])
      .slice(0, 4)
      .map(q => ({ query: q.query, value: q.value }));

    return {
      keyword,
      geo,
      growthPercent: growthPct,
      trend:         growthPct > 15 ? 'Rising ↑' : growthPct < -15 ? 'Declining ↓' : 'Stable →',
      currentScore:  current,
      peakScore:     peak,
      atPeak:        current >= peak * 0.9,
      sparkline:     values.slice(-12),
      risingQueries,
    };
  } catch (_) {
    return null;
  }
}

module.exports = { getTrendData };
