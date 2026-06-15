'use strict';

/**
 * Converts raw validationPayload into structured evidence statements
 * for the "Why This Idea Exists" block.
 */
function buildEvidenceBlock(validationPayload, sector, city) {
  if (!validationPayload) return null;

  const { reddit, trends, reviews, search } = validationPayload;
  const evidence = [];

  // ── REDDIT ────────────────────────────────────────────────────────────────
  if (reddit?.length > 0) {
    const count   = reddit.length;
    const avgUps  = Math.round(reddit.reduce((s, r) => s + (r.upvotes || 0), 0) / count);
    const subs    = [...new Set(reddit.map(r => r.subreddit).filter(Boolean))].slice(0, 3);
    const topPost = reddit[0];
    const cityCtx = city ? ` in ${city}` : '';
    evidence.push({
      type:   'reddit',
      text:   `${count} Reddit post${count !== 1 ? 's' : ''} in the past year express frustration with ${sector.toLowerCase()}${cityCtx}, averaging ${avgUps} upvotes each. Top discussion: "${topPost.title.slice(0, 100)}"`,
      source: topPost.url || null,
      meta:   { count, avgUpvotes: avgUps, subreddits: subs },
    });
  }

  // ── SEARCH TRENDS ─────────────────────────────────────────────────────────
  if (trends) {
    const dir     = trends.growthPercent > 0 ? 'grew' : 'fell';
    const abs     = Math.abs(trends.growthPercent);
    const peak    = trends.atPeak ? ' Currently at an all-time high.' : '';
    const rising  = trends.risingQueries?.length
      ? ` Rising related searches: ${trends.risingQueries.slice(0, 2).map(q => `"${q.query}"`).join(', ')}.`
      : '';
    evidence.push({
      type: 'trends',
      text: `Search interest for "${trends.keyword}" ${dir} ${abs}% over the past 12 months (${trends.trend}).${peak}${rising}`,
      meta: { growthPercent: trends.growthPercent, currentScore: trends.currentScore, atPeak: trends.atPeak },
    });
  }

  // ── COMPETITOR REVIEWS ────────────────────────────────────────────────────
  if (reviews?.topPainThemes?.length > 0) {
    const top    = reviews.topPainThemes[0];
    const second = reviews.topPainThemes[1];
    const topLabel    = top.theme.replace(/_/g, ' ');
    const secondPart  = second ? `, followed by "${second.theme.replace(/_/g, ' ')}" (${second.pct}%)` : '';
    const names = reviews.competitors?.slice(0, 2).join(' and ');
    const bizCtx = names ? ` for ${names}` : ` across ${reviews.competitorCount} local competitors`;
    evidence.push({
      type: 'reviews',
      text: `${reviews.reviewCount} negative reviews analysed${bizCtx}. Top complaint: "${topLabel}" (${top.pct}% of 1-star reviews)${secondPart} — a fixable gap a new entrant can solve on day one.`,
      meta: { reviewCount: reviews.reviewCount, topTheme: top.theme, topPct: top.pct },
    });
  }

  // ── SEARCH VOLUME ─────────────────────────────────────────────────────────
  if (search?.totalMonthlySearches > 0) {
    const total  = search.totalMonthlySearches;
    const topKw  = search.keywords?.[0];
    const cpcStr = topKw?.cpc > 0 ? ` Advertisers pay $${topKw.cpc.toFixed(2)}/click on "${topKw.keyword}" — confirming strong commercial intent.` : '';
    const cityCtx = city ? ` in ${city}` : '';
    evidence.push({
      type: 'search',
      text: `${total.toLocaleString()} people search for ${sector.toLowerCase()} services${cityCtx} every month (${search.verdict}).${cpcStr}`,
      meta: { totalMonthlySearches: total, verdict: search.verdict, topKeyword: topKw?.keyword, cpc: topKw?.cpc },
    });
  }

  if (evidence.length === 0) return null;

  // ── VERDICT ───────────────────────────────────────────────────────────────
  const sourceCount = evidence.length;
  const hasReddit   = evidence.some(e => e.type === 'reddit');
  const hasSearch   = evidence.some(e => e.type === 'search');
  const hasTrends   = evidence.some(e => e.type === 'trends');
  const hasReviews  = evidence.some(e => e.type === 'reviews');

  let verdict;
  if (sourceCount >= 3) {
    verdict = `${sourceCount} independent data sources confirm this gap exists — demand is real, documented, and currently unmet.`;
  } else if (hasReddit && hasSearch) {
    verdict = 'Community frustration and commercial search intent align — this is a proven, monetisable gap.';
  } else if (hasTrends && hasSearch) {
    verdict = 'Rising search interest combined with high search volume confirms growing, monetisable demand.';
  } else if (hasReviews) {
    verdict = 'Competitor weaknesses reveal a clear positioning gap — customers are ready for a better alternative.';
  } else {
    verdict = 'Available signals confirm demand exists; additional validation recommended before launch.';
  }

  return { evidence, verdict, signalCount: sourceCount };
}

module.exports = { buildEvidenceBlock };
