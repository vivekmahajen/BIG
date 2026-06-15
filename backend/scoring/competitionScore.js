'use strict';

/**
 * Competition Score
 * Derived from: competitor count, review volume, CPC (ad spend proxy).
 */
function calculateCompetitionScore(validationPayload) {
  if (!validationPayload) return null;
  let score = 0;
  let factors = 0;

  // Competitor count from review miner
  const competitorCount = validationPayload.reviews?.competitorCount ?? 0;
  const reviewCount     = validationPayload.reviews?.reviewCount ?? 0;
  if (competitorCount > 0) {
    score += competitorCount >= 5 ? 3 : competitorCount >= 3 ? 2 : 1;
    factors++;
  }

  // Review volume — highly reviewed = established, hard-to-dislodge incumbents
  if (reviewCount > 0) {
    score += reviewCount > 50 ? 3 : reviewCount > 20 ? 2 : 1;
    factors++;
  }

  // CPC — high ad spend signals incumbents are fighting for every click
  const avgCPC = (validationPayload.search?.keywords || [])
    .reduce((s, k) => s + (k.cpc || 0), 0) /
    Math.max((validationPayload.search?.keywords || []).length, 1);
  if (avgCPC > 0) {
    score += avgCPC > 5 ? 3 : avgCPC > 2 ? 2 : avgCPC > 0.5 ? 1 : 0;
    factors++;
  }

  // Search competition field from DataForSEO
  const searchComp = validationPayload.search?.competition || 'UNKNOWN';
  if (searchComp !== 'UNKNOWN') {
    score += searchComp === 'HIGH' ? 3 : searchComp === 'MEDIUM' ? 2 : 1;
    factors++;
  }

  if (factors === 0) return null;

  // Normalise to 0–10 scale (max raw = 12 from 4 factors × 3 each)
  const normalised = (score / (factors * 3)) * 10;

  const level =
    normalised >= 8 ? 'Very High' :
    normalised >= 6 ? 'High'      :
    normalised >= 4 ? 'Medium'    :
    normalised >= 2 ? 'Low'       : 'Very Low';

  const incumbentStrength =
    reviewCount > 200 ? 'Strong' :
    reviewCount > 50  ? 'Moderate' : 'Weak';

  return {
    level,
    score:             Math.round(normalised * 10) / 10,
    competitorCount,
    reviewCount,
    avgCPC:            +avgCPC.toFixed(2),
    incumbentStrength,
    entryBarrier:      level === 'Very High' || level === 'High' ? 'High' :
                       level === 'Very Low'  || level === 'Low'  ? 'Low'  : 'Medium',
    competitors:       validationPayload.reviews?.competitors || [],
  };
}

module.exports = { calculateCompetitionScore };
