'use strict';

const NodeCache = require('node-cache');
const { scrapeRedditPainPoints } = require('./redditScraper');
const { getTrendData }           = require('./googleTrends');
const { mineCompetitorReviews }  = require('./reviewMiner');
const { getSearchVolume }        = require('./searchVolume');

// 24-hour TTL cache — keyed by sector:city:country
const validationCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

async function buildValidationPayload(sector, city, country = 'US') {
  const cacheKey = `${sector}:${city}:${country}`.toLowerCase();
  const cached   = validationCache.get(cacheKey);
  if (cached) return cached;

  const keyword = `${sector} ${city}`.trim();

  const [redditResult, trendsResult, reviewsResult, searchResult] = await Promise.allSettled([
    scrapeRedditPainPoints(sector, city),
    getTrendData(keyword, country),
    mineCompetitorReviews(sector, city),
    getSearchVolume(sector, city, country),
  ]);

  const payload = {
    reddit:       redditResult.status  === 'fulfilled' ? redditResult.value  : null,
    trends:       trendsResult.status  === 'fulfilled' ? trendsResult.value  : null,
    reviews:      reviewsResult.status === 'fulfilled' ? reviewsResult.value : null,
    search:       searchResult.status  === 'fulfilled' ? searchResult.value  : null,
    generatedAt:  new Date().toISOString(),
  };

  // Only cache if at least one signal succeeded
  const hasData = Object.values(payload).some(v => v && v !== null && typeof v === 'object' && !('toISOString' in v));
  if (hasData) validationCache.set(cacheKey, payload);

  return payload;
}

/**
 * Builds a concise text block to inject into the Claude prompt.
 * Claude is instructed to cite these signals in its output.
 */
function buildValidationPromptBlock(payload) {
  if (!payload) return '';
  const lines = [];

  const { reddit, trends, reviews, search } = payload;

  if (reddit?.length) {
    const total = reddit.reduce((s, p) => s + p.upvotes + p.comments, 0);
    lines.push(`REDDIT PAIN SIGNALS (${reddit.length} posts, ~${total} upvotes+comments):`);
    reddit.slice(0, 4).forEach(p => {
      lines.push(`  - ${p.subreddit} (${p.upvotes} upvotes): "${p.title.slice(0, 120)}"`);
    });
  }

  if (trends) {
    lines.push(`GOOGLE TRENDS: "${trends.keyword}" — ${trends.trend} (${trends.growthPercent > 0 ? '+' : ''}${trends.growthPercent}% YoY, current score ${trends.currentScore}/100)`);
    if (trends.risingQueries?.length) {
      lines.push(`  Rising related: ${trends.risingQueries.map(q => `"${q.query}" +${q.value}%`).join(', ')}`);
    }
  }

  if (reviews) {
    lines.push(`COMPETITOR REVIEW INTELLIGENCE: ${reviews.reviewCount} negative reviews across ${reviews.competitorCount} competitors`);
    reviews.topPainThemes.forEach(t => {
      const label = t.theme.replace(/_/g, ' ');
      lines.push(`  - ${label}: ${t.pct}% of complaints (${t.count} mentions)`);
    });
  }

  if (search) {
    lines.push(`SEARCH DEMAND: ~${search.totalMonthlySearches.toLocaleString()} monthly searches — ${search.verdict}`);
    search.keywords?.slice(0, 3).forEach(k => {
      lines.push(`  - "${k.keyword}": ${k.monthlyVolume.toLocaleString()}/mo, CPC $${k.cpc}, competition ${k.competition}`);
    });
  }

  if (!lines.length) return '';

  return `\n\nVALIDATION DATA — cite these real signals in "whyItWorks" and "greenSignals":\n${lines.join('\n')}\n\nVALIDATION RULES:\n1. For every signal present, include a citation in greenSignals: e.g. "487 Reddit posts confirm [problem] in [city]" or "+87% Google Trends growth over 12 months" or "22,000 monthly searches for [keyword]".\n2. Never fabricate signals. Omit a signal category if its data is null.\n3. If reddit.length > 3 AND trends.growthPercent > 20 AND search.totalMonthlySearches > 5000, begin whyItWorks with: "VALIDATED OPPORTUNITY: Multiple independent data sources confirm this gap."\n4. If signals conflict (high search, low reddit), note it as: "High search demand with limited community discussion — early-mover market."\n`;
}

module.exports = { buildValidationPayload, buildValidationPromptBlock };
