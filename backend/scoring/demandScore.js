'use strict';

/**
 * Demand Score (0–10)
 * Derived entirely from live validation signals — no static data needed.
 */
function calculateDemandScore(validationPayload) {
  if (!validationPayload) return null;
  const scores = {};

  // Search volume component (30%)
  const totalSearches = (validationPayload.search?.keywords || [])
    .reduce((s, k) => s + (k.monthlyVolume || 0), 0);
  scores.searchVolume =
    totalSearches > 50000 ? 10 :
    totalSearches > 20000 ? 9  :
    totalSearches > 10000 ? 8  :
    totalSearches > 5000  ? 7  :
    totalSearches > 1000  ? 5  :
    totalSearches > 100   ? 3  : null; // null = no data

  // Trend component (25%)
  const growthPct = validationPayload.trends?.growthPercent ?? null;
  if (growthPct !== null) {
    scores.trend =
      growthPct > 100 ? 10 :
      growthPct > 50  ? 9  :
      growthPct > 25  ? 8  :
      growthPct > 10  ? 7  :
      growthPct > 0   ? 6  :
      growthPct > -10 ? 5  :
      growthPct > -25 ? 3  : 1;
  }

  // Reddit pain signal (25%)
  const redditPosts = validationPayload.reddit || [];
  const redditCount = redditPosts.length;
  if (redditCount > 0) {
    const avgPain = redditPosts.reduce((s, r) => s + (r.painScore || 0), 0) / redditCount;
    scores.reddit =
      redditCount > 20 ? Math.min(10, 5 + avgPain * 5) :
      redditCount > 10 ? Math.min(8,  4 + avgPain * 4) :
      redditCount > 3  ? Math.min(6,  3 + avgPain * 3) : 3;
  }

  // Current trend score as density proxy (20%)
  const currentScore = validationPayload.trends?.currentScore ?? null;
  if (currentScore !== null) {
    scores.density = currentScore / 10; // 0–100 → 0–10
  }

  // Weighted average using only signals that have data
  const WEIGHTS = { searchVolume: 0.30, trend: 0.25, reddit: 0.25, density: 0.20 };
  let totalWeight = 0;
  let weightedSum = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    if (scores[key] != null) {
      weightedSum += scores[key] * weight;
      totalWeight += weight;
    }
  }

  // If we have no signals at all, return null
  if (totalWeight === 0) return null;

  // Scale to full weight
  const raw = weightedSum / totalWeight;
  const score = Math.round(raw * 10) / 10;

  const dataPoints = Object.keys(scores).length;
  const confidence = dataPoints >= 3 ? 'High' : dataPoints >= 2 ? 'Medium' : 'Low';

  return {
    score,
    breakdown: scores,
    label: score >= 8 ? 'Strong' : score >= 6 ? 'Moderate' : score >= 4 ? 'Emerging' : 'Weak',
    confidence,
    totalMonthlySearches: totalSearches,
    trendGrowth: growthPct,
    redditMentions: redditCount,
  };
}

module.exports = { calculateDemandScore };
