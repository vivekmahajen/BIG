'use strict';

const LOCATION_NAMES = {
  US: 'United States', CA: 'Canada', GB: 'United Kingdom', AU: 'Australia',
  IN: 'India', DE: 'Germany', FR: 'France', AE: 'United Arab Emirates',
  SG: 'Singapore', BR: 'Brazil', JP: 'Japan', MX: 'Mexico',
  ZA: 'South Africa', NL: 'Netherlands', NG: 'Nigeria', KE: 'Kenya',
  ES: 'Spain', IT: 'Italy', PH: 'Philippines', PK: 'Pakistan',
  CN: 'China', ID: 'Indonesia',
};

const LANGUAGE_CODES = {
  US: 'en', CA: 'en', GB: 'en', AU: 'en', IN: 'en',
  DE: 'de', FR: 'fr', AE: 'en', SG: 'en', BR: 'pt',
  JP: 'ja', MX: 'es', ZA: 'en', NL: 'nl', NG: 'en',
  KE: 'en', ES: 'es', IT: 'it', PH: 'en', PK: 'en',
  CN: 'zh', ID: 'id',
};

async function getSearchVolume(sector, city, countryCode = 'US') {
  const user = process.env.DATAFORSEO_USER;
  const pass = process.env.DATAFORSEO_PASS;
  if (!user || !pass) return null;

  const locationName = city ? `${city}, ${LOCATION_NAMES[countryCode] || countryCode}` : (LOCATION_NAMES[countryCode] || countryCode);
  const languageCode = LANGUAGE_CODES[countryCode] || 'en';
  const keywords = [
    `${sector} ${city}`.trim(),
    `best ${sector} ${city}`.trim(),
    `${sector} near me`,
    `${sector} services ${city}`.trim(),
  ].filter(Boolean);

  try {
    const resp = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        keywords,
        location_name:   locationName,
        language_code:   languageCode,
        search_partners: false,
      }]),
      signal: AbortSignal.timeout(12000),
    });

    if (!resp.ok) return null;
    const data = await resp.json();
    const results = (data?.tasks?.[0]?.result ?? []).filter(r => (r.search_volume || 0) > 0);
    if (!results.length) return null;

    const totalVolume = results.reduce((sum, r) => sum + (r.search_volume || 0), 0);
    const primary     = results.sort((a, b) => (b.search_volume || 0) - (a.search_volume || 0))[0];

    return {
      keywords: results.map(r => ({
        keyword:       r.keyword,
        monthlyVolume: r.search_volume || 0,
        competition:   r.competition || 'UNKNOWN',
        cpc:           +(r.cpc || 0).toFixed(2),
      })),
      totalMonthlySearches: totalVolume,
      primaryKeyword:       primary.keyword,
      primaryVolume:        primary.search_volume || 0,
      cpc:                  +(primary.cpc || 0).toFixed(2),
      competition:          primary.competition || 'UNKNOWN',
      verdict: totalVolume > 10000 ? 'Strong demand' :
               totalVolume > 1000  ? 'Moderate demand' :
               totalVolume > 100   ? 'Niche demand' : 'Emerging/unproven',
    };
  } catch (_) {
    return null;
  }
}

module.exports = { getSearchVolume };
