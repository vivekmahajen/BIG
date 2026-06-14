'use strict';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
];

const PAIN_KEYWORDS = [
  'frustrated','annoyed','terrible','awful','horrible','can\'t find','nobody',
  'no one','impossible','overpriced','rip off','wish','need','looking for',
  'can anyone','help','rant','venting','complaint','so hard','never found',
  'no options','no good','where can i','does anyone know','struggling',
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUA() {
  return USER_AGENTS[randInt(0, USER_AGENTS.length - 1)];
}

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
      // Random delay 1.5–3.5s between queries to avoid rate limiting
      await new Promise(r => setTimeout(r, randInt(1500, 3500)));

      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=year&limit=25&raw_json=1`;
      const resp = await fetch(url, {
        headers: {
          'User-Agent': randomUA(),
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (resp.status === 429) {
        console.warn('[reddit] rate limited, skipping remaining queries');
        break;
      }
      if (!resp.ok) continue;

      const data = await resp.json();
      const posts = data?.data?.children ?? [];

      for (const { data: p } of posts) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        const score = painScore(p);
        if (score > 0.25) {
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
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('[reddit] query failed:', err.message);
    }
  }

  return results
    .sort((a, b) => (b.painScore * Math.log(b.upvotes + 2)) - (a.painScore * Math.log(a.upvotes + 2)))
    .slice(0, 8);
}

module.exports = { scrapeRedditPainPoints };
