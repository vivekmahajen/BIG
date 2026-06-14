'use strict';

const PAIN_THEMES = {
  response_time:    ['slow', 'waited', 'took forever', 'never called back', 'no response', 'hours', 'days', 'weeks'],
  pricing:          ['expensive', 'overpriced', 'rip off', 'too much', 'charged extra', 'hidden fee', 'bait'],
  quality:          ['bad job', 'poor quality', 'sloppy', 'wrong', 'broken', 'didn\'t work', 'not fixed', 'worse'],
  communication:    ['ignored', 'no communication', 'didn\'t inform', 'surprised', 'ghosted', 'no update'],
  availability:     ['booked', 'no availability', 'couldn\'t get', 'turned away', 'wait list', 'unavailable'],
  professionalism:  ['rude', 'unprofessional', 'late', 'no show', 'disrespectful', 'lied', 'dishonest'],
};

function extractPainThemes(text) {
  const lower = text.toLowerCase();
  return Object.entries(PAIN_THEMES)
    .filter(([, kws]) => kws.some(k => lower.includes(k)))
    .map(([theme]) => theme);
}

async function findLocalCompetitors(sector, city) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];

  const q = encodeURIComponent(`${sector} ${city}`);
  const url = `https://serpapi.com/search.json?engine=google_maps&q=${q}&api_key=${apiKey}`;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data?.local_results ?? []).slice(0, 5).map(r => ({
      name:    r.title,
      rating:  r.rating,
      reviews: r.reviews,
      placeId: r.place_id,
    }));
  } catch (_) {
    return [];
  }
}

async function fetchGoogleReviews(placeId) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];

  const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&sort_by=newestFirst&api_key=${apiKey}`;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data?.reviews ?? []).filter(r => r.rating <= 2);
  } catch (_) {
    return [];
  }
}

async function mineCompetitorReviews(sector, city) {
  const competitors = await findLocalCompetitors(sector, city);
  if (!competitors.length) return null;

  const allReviews = [];
  for (const c of competitors.slice(0, 3)) {
    if (!c.placeId) continue;
    const reviews = await fetchGoogleReviews(c.placeId);
    for (const r of reviews) {
      allReviews.push({
        business:   c.name,
        rating:     r.rating,
        text:       r.snippet || r.text || '',
        painThemes: extractPainThemes(r.snippet || r.text || ''),
      });
    }
  }

  if (!allReviews.length) return null;

  const counts = {};
  allReviews.forEach(r => r.painThemes.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  const themes = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([theme, count]) => ({
      theme,
      count,
      pct: Math.round((count / allReviews.length) * 100),
    }));

  return {
    reviewCount:    allReviews.length,
    competitorCount: competitors.length,
    competitors:    competitors.map(c => c.name),
    topPainThemes:  themes.slice(0, 4),
  };
}

module.exports = { mineCompetitorReviews };
