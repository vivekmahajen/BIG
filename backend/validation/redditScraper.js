'use strict';

const PAIN_KEYWORDS = [
  'frustrated','annoyed','terrible','awful','horrible','can\'t find','nobody',
  'no one','impossible','overpriced','rip off','wish','need','looking for',
  'can anyone','help','rant','venting','complaint','so hard','never found',
  'no options','no good','where can i','does anyone know','struggling',
];

function buildQueries(sector, city) {
  return [
    `"${city}" "${sector}" frustrated`,
    `"${city}" "${sector}" "can't find"`,
    `"${sector}" "wish someone would"`,
    `"${city}" need "${sector}"`,
    `"${sector}" problem "${city}"`,
  ];
}

function painScore(post) {
  const text = `${post.title} ${post.selftext || ''}`.toLowerCase();
  const hits = PAIN_KEYWORDS.filter(k => text.includes(k)).length;
  const engagement = Math.min(1, ((post.ups || 0) + (post.num_comments || 0) * 2) / 500);
  return Math.min(1, (hits / 5) * 0.7 + engagement * 0.3);
}

async function scrapeRedditPainPoints(sector, city) {
  const queries = buildQueries(sector, city);
  const seen = new Set();
  const results = [];

  for (const query of queries) {
    try {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=year&limit=25`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'BIG-Validator/1.0 (business research tool)' },
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) continue;
      const data = await resp.json();
      const posts = data?.data?.children ?? [];

      for (const { data: p } of posts) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        const score = painScore(p);
        if (score > 0.3) {
          results.push({
            title:     p.title,
            subreddit: p.subreddit_name_prefixed || `r/${p.subreddit}`,
            upvotes:   p.ups || 0,
            comments:  p.num_comments || 0,
            url:       `https://reddit.com${p.permalink}`,
            snippet:   (p.selftext || '').slice(0, 200),
            painScore: score,
            postedAt:  new Date((p.created_utc || 0) * 1000).toISOString(),
          });
        }
      }
    } catch (_) {
      // individual query failure is non-fatal
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  return results
    .sort((a, b) => (b.painScore * Math.log(b.upvotes + 2)) - (a.painScore * Math.log(a.upvotes + 2)))
    .slice(0, 8);
}

module.exports = { scrapeRedditPainPoints };
