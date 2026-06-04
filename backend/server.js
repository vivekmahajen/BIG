const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CREDIT_COSTS, TIERS, CREDIT_PACKS } = require('./credits');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'big-opportunity-secret-2026';

app.use(cors({
  origin: [
    'https://big-eosin.vercel.app',
    'https://big-production-e0d8.up.railway.app',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());

// ── In-memory user store (replace with DB in production) ──────────────────
const users = [];
// Seed a demo account
bcrypt.hash('demo1234', 10).then(hash => {
  users.push({
    id: 1, email: 'demo@big.com', name: 'Demo User', passwordHash: hash,
    tier: 'free', credits: 10, packCredits: 0,
    creditsResetAt: nextMonthStart(),
  });
});

function nextMonthStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
}

function getUser(id) {
  return users.find(u => u.id === id);
}

function refreshCreditsIfNeeded(user) {
  if (Date.now() >= user.creditsResetAt) {
    const tier = TIERS[user.tier] || TIERS.free;
    const rollover = Math.min(user.credits, tier.rolloverMax || 0);
    user.credits = tier.monthlyCredits + rollover;
    user.creditsResetAt = nextMonthStart();
  }
}

function userPublic(user) {
  refreshCreditsIfNeeded(user);
  const tier = TIERS[user.tier] || TIERS.free;
  return {
    id: user.id, email: user.email, name: user.name,
    tier: user.tier, tierName: tier.name,
    credits: user.credits + (user.packCredits || 0),
    subscriptionCredits: user.credits,
    packCredits: user.packCredits || 0,
    monthlyAllowance: tier.monthlyCredits,
    creditsResetAt: user.creditsResetAt,
  };
}

// ── Auth middleware ────────────────────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Deduct credits; returns false if insufficient
function deductCredits(user, action) {
  refreshCreditsIfNeeded(user);
  const cost = CREDIT_COSTS[action] || 0;
  if (cost === 0) return true;
  const total = user.credits + (user.packCredits || 0);
  if (total < cost) return false;
  // Deduct from subscription credits first, then pack credits
  let remaining = cost;
  const fromSub = Math.min(user.credits, remaining);
  user.credits -= fromSub;
  remaining -= fromSub;
  if (remaining > 0) user.packCredits = (user.packCredits || 0) - remaining;
  return true;
}

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', app: 'BIG backend' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Password reset token store (in-memory; expires in 1 hour) ─────────────
const resetTokens = new Map(); // token -> { userId, expiresAt }

function makeResetToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Request password reset
app.post('/api/reset-request', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const user = users.find(u => u.email === email.toLowerCase().trim());
  // Always respond success so we don't leak whether an email exists
  if (!user) return res.json({ message: 'If that email is registered, a reset link has been sent.' });

  const token = makeResetToken();
  resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 60 * 60 * 1000 });

  // In production send an email here. For demo we return the token directly.
  const isDev = !process.env.SMTP_HOST;
  res.json({
    message: 'If that email is registered, a reset link has been sent.',
    ...(isDev ? { devToken: token, devNote: 'Token returned in dev mode — use it at /reset-password' } : {}),
  });
});

// Validate reset token (used to pre-check before showing the new-password form)
app.get('/api/reset-validate', (req, res) => {
  const { token } = req.query;
  const entry = resetTokens.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
  }
  res.json({ valid: true });
});

// Perform the reset
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'token and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const entry = resetTokens.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    return res.status(400).json({ error: 'Reset link is invalid or has expired. Please request a new one.' });
  }

  const user = getUser(entry.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.passwordHash = await bcrypt.hash(password, 10);
  resetTokens.delete(token);
  res.json({ message: 'Password updated successfully. You can now sign in.' });
});

// Register
app.post('/api/register', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'email, name and password required' });
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1, email, name, passwordHash,
    tier: 'free', credits: 10, packCredits: 0,
    creditsResetAt: nextMonthStart(),
  };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: userPublic(user) });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: userPublic(user) });
});

// Me
app.get('/api/me', auth, (req, res) => {
  const user = getUser(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: userPublic(user) });
});

// Credits info
app.get('/api/credits', auth, (req, res) => {
  const user = getUser(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(userPublic(user));
});

// Credit packs and tiers info (public)
app.get('/api/pricing', (req, res) => {
  res.json({ tiers: TIERS, packs: CREDIT_PACKS, costs: CREDIT_COSTS });
});

// Simulate buying a credit pack (in production, wire to Stripe)
app.post('/api/buy-pack', auth, (req, res) => {
  const { packId } = req.body;
  const pack = CREDIT_PACKS.find(p => p.id === packId);
  if (!pack) return res.status(400).json({ error: 'Unknown pack' });
  const user = getUser(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.packCredits = (user.packCredits || 0) + pack.credits;
  res.json({ success: true, added: pack.credits, user: userPublic(user) });
});

// Geo data
app.get('/api/geo/states', auth, (req, res) => {
  const { geoData } = require('./geoData');
  res.json(geoData.states.map(s => ({ code: s.code, name: s.name })));
});

app.get('/api/geo/cities', auth, (req, res) => {
  const { stateCode } = req.query;
  const { geoData } = require('./geoData');
  const state = geoData.states.find(s => s.code === stateCode);
  if (!state) return res.status(404).json({ error: 'State not found' });
  res.json(state.cities.map(c => ({ name: c.name })));
});

app.get('/api/geo/zips', auth, (req, res) => {
  const { stateCode, city } = req.query;
  const { geoData } = require('./geoData');
  const state = geoData.states.find(s => s.code === stateCode);
  if (!state) return res.status(404).json({ error: 'State not found' });
  const cityData = state.cities.find(c => c.name === city);
  if (!cityData) return res.status(404).json({ error: 'City not found' });
  res.json(cityData.zips);
});

app.get('/api/sectors', auth, (req, res) => {
  const { zip } = req.query;
  const { getSectorsForZip } = require('./geoData');
  res.json(getSectorsForZip(zip));
});

app.get('/api/opportunity', auth, (req, res) => {
  const { zip, sector } = req.query;
  const { getOpportunity } = require('./geoData');
  const opp = getOpportunity(zip, sector);
  if (!opp) return res.status(404).json({ error: 'No data for this combination' });
  res.json(opp);
});

app.get('/api/sector-opportunities', auth, (req, res) => {
  const { sector } = req.query;
  if (!sector) return res.status(400).json({ error: 'sector query param required' });
  const { REPORT_DATA } = require('./reportData');
  const opps = REPORT_DATA[sector];
  if (!opps) return res.status(404).json({ error: 'Sector not found' });
  res.json(opps);
});

app.post('/api/generate-idea', auth, async (req, res) => {
  const { sector, zip, city, state } = req.body;
  if (!sector) return res.status(400).json({ error: 'sector required' });

  const user = getUser(req.user.id);
  if (!user || !deductCredits(user, 'generate-idea')) {
    return res.status(402).json({
      error: `Not enough credits. Generating a business idea costs ${CREDIT_COSTS['generate-idea']} credits.`,
      creditsRequired: CREDIT_COSTS['generate-idea'],
      creditsAvailable: user ? user.credits + (user.packCredits || 0) : 0,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI generation not configured (ANTHROPIC_API_KEY missing)' });

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const locationCtx = [city, state, zip].filter(Boolean).join(', ');

  const prompt = `You are a business opportunity analyst. Generate ONE original, specific, and highly actionable business idea for the "${sector}" sector${locationCtx ? ` targeting the ${locationCtx} market` : ''}.

Return ONLY a valid JSON object with exactly these fields (no markdown, no explanation, just raw JSON):

{
  "name": "Specific Business Name (4-7 words)",
  "model": "Business model type (e.g. SaaS, B2B Services, Marketplace)",
  "startupCost": "$XK–$YK",
  "grossMargin": "XX–YY%",
  "timeToProfit": "X–Y months",
  "tam": "$XB or $XM",
  "revenueYr1": "$XK–$YK",
  "revenueYr3": "$XM–$YM",
  "score": 8.5,
  "exitVal": "$XM–$YM",
  "whyItWorks": "2-3 sentence explanation of why this business makes money, specific market dynamics, and why now is the right time.",
  "profitDrivers": ["driver 1", "driver 2", "driver 3"],
  "greenSignals": ["positive market signal 1", "signal 2", "signal 3"],
  "keyRisks": ["risk 1", "risk 2"],
  "watchpoints": ["watchpoint 1", "watchpoint 2"],
  "launchPlan": "Month 1–30: [action]. Month 31–60: [action]. Month 61–90: [action].",
  "topCompetitors": ["Competitor A", "Competitor B", "Competitor C"],
  "ltv_cac": "X:1",
  "paybackMonths": 8,
  "sam": "$XM (10% of TAM)",
  "som": "$XM (1% of TAM)",
  "bestZip": "${zip || '78701'}"
}

Make the idea genuinely different from common ideas. Be specific with numbers. Score should reflect real conviction (7.0–9.5 range).`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    // Strip markdown code fences if present
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const idea = JSON.parse(json);
    idea.aiGenerated = true;
    res.json(idea);
  } catch (err) {
    console.error('generate-idea error:', err.message);
    res.status(500).json({ error: 'Failed to generate idea: ' + err.message });
  }
});

app.post('/api/competitor-compare', auth, async (req, res) => {
  const { businessName, sector, competitors } = req.body;
  if (!businessName || !competitors || !competitors.length) {
    return res.status(400).json({ error: 'businessName and competitors required' });
  }

  const user = getUser(req.user.id);
  if (!user || !deductCredits(user, 'competitor-compare')) {
    return res.status(402).json({
      error: `Not enough credits. Competitor analysis costs ${CREDIT_COSTS['competitor-compare']} credits.`,
      creditsRequired: CREDIT_COSTS['competitor-compare'],
      creditsAvailable: user ? user.credits + (user.packCredits || 0) : 0,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI generation not configured (ANTHROPIC_API_KEY missing)' });

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const prompt = `You are a competitive strategy analyst. For the business "${businessName}" in the "${sector}" sector, analyze what it takes to reach #1 market position against these competitors: ${competitors.join(', ')}.

Return ONLY a valid JSON object (no markdown) with this exact structure:

{
  "capabilities": [
    {
      "name": "Capability name (5-8 words)",
      "description": "Why this capability is critical to win (1 sentence)",
      "importance": "critical" | "high" | "medium",
      "competitors": {
        "${competitors[0]}": { "status": "strong" | "partial" | "weak" | "none", "note": "1 short phrase" }
        ${competitors.slice(1).map(c => `,"${c}": { "status": "strong" | "partial" | "weak" | "none", "note": "1 short phrase" }`).join('\n        ')}
      },
      "yourStatus": "none",
      "toAchieve": "Specific action to build this capability (1 sentence)"
    }
  ],
  "winningMove": "The single most important strategic move to reach #1 (2 sentences)",
  "timelineToLead": "Estimated time to become market leader if executing well"
}

Include exactly 5 capabilities that truly differentiate leaders in this market. Be specific and actionable. Keep each "note" field under 8 words and "toAchieve" under 15 words.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = message.content[0].text.trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    // Attempt parse; if truncated, try to salvage by closing open structures
    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      // Close any unterminated JSON and retry
      const fixed = json
        .replace(/,\s*$/, '')
        .replace(/([^}])\s*$/, '$1}')
        + ']}';
      parsed = JSON.parse(fixed);
    }
    res.json(parsed);
  } catch (err) {
    console.error('competitor-compare error:', err.message);
    res.status(500).json({ error: 'Failed to generate comparison: ' + err.message });
  }
});

app.post('/api/competitive-analysis', auth, async (req, res) => {
  const { business, competitors, functions: fns, scoring, horizon, priorityFocus, outputFormat, context } = req.body;
  if (!business || !business.name) return res.status(400).json({ error: 'business.name required' });

  const user = getUser(req.user.id);
  if (!user || !deductCredits(user, 'competitive-analysis')) {
    return res.status(402).json({
      error: `Not enough credits. Full competitive analysis costs ${CREDIT_COSTS['competitive-analysis']} credits.`,
      creditsRequired: CREDIT_COSTS['competitive-analysis'],
      creditsAvailable: user ? user.credits + (user.packCredits || 0) : 0,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI generation not configured (ANTHROPIC_API_KEY missing)' });

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const competitorList = (competitors || []).filter(c => c.name)
    .map((c, i) => `   ${i+1}. ${c.name}${c.strengths ? ` — known for: ${c.strengths}` : ''}`).join('\n');

  const fnList = (fns || []).map((f, i) => `   ${i+1}. ${f}`).join('\n');

  const prompt = `# Comprehensive competitive analysis + roadmap to #1

## Business overview
- **Name:** ${business.name}
- **Industry:** ${business.industry || 'Not specified'}
- **Geography:** ${business.geography || 'Not specified'}
- **Stage:** ${business.stage || 'Not specified'}
- **Description:** ${business.description || 'Not specified'}

## Competitors to analyze
${competitorList || '   Not specified — please identify 3–5 likely competitors based on the industry and geography.'}

## Business functions to assess
For each function, provide:
- What best-in-class looks like in this industry
- A ${scoring || '1–10 numeric score'} for ${business.name} vs. each competitor
- The 2–3 specific actions to move ${business.name} to leading this function

${fnList || '   1. Operations & processes\n   2. Sales & business development\n   3. Marketing & brand\n   4. Customer experience & retention\n   5. Technology & software stack\n   6. Pricing & revenue model\n   7. Talent & team structure\n   8. Finance & unit economics'}

## Competitive scorecard
Produce a side-by-side scorecard table with ${business.name} and each competitor as columns, the business functions as rows, and a ${scoring || '1–10 score'} in each cell. Include a total/overall score row at the bottom. Call out the top 3 functions where ${business.name} has an advantage and the top 3 where it has the greatest gap.

## Competitive positioning narrative
For each competitor, write a 2–3 sentence summary covering:
- Their primary competitive strengths
- Their most significant weaknesses or blind spots
- The most effective counter-positioning move ${business.name} should make against them specifically

## Gap analysis: highest-leverage opportunities
Identify the 5–7 highest-leverage improvement opportunities — the specific changes with greatest competitive impact, weighted by: (1) ease of execution, (2) speed to customer impact, (3) long-term moat-building potential.
For each, specify: which function, which competitor(s) it counters, estimated time to implement, and a measurable success metric.

## The #1 definition
State clearly: what does it mean to be #1 in this specific market? Define it across 3–5 measurable dimensions (market share %, NPS vs. industry, revenue per customer, brand recognition, operational efficiency metrics).

## Roadmap to #1: ${horizon || '90-day / 12-month / 3-year'}

### Phase 1 — Foundation & quick wins
- 5–8 specific, executable actions with owners, success metrics, and deadlines
- Focus: ${priorityFocus || 'biggest gaps vs. top competitor'}
- Expected outcome: what competitive position does ${business.name} hold after this phase?

### Phase 2 — Growth & differentiation
- 5–8 actions building on Phase 1 momentum
- Focus: extending leads in strong functions, closing critical gaps
- Expected outcome: measurable gain vs. top competitor?

### Phase 3 — Market leadership
- 5–8 actions establishing durable market leadership
- Focus: moat-building, category ownership
- Expected outcome: how does ${business.name} define "#1" and know when it has achieved it?

${context ? `## Additional context\n${context}` : ''}

## Output format
Deliver as a ${outputFormat || 'full structured report with tables, scorecards, and milestone lists'}. Use specific numbers, named metrics, and actionable language throughout. Every recommendation must be specific enough that a team member can act on it without further clarification. Use markdown formatting with clear section headers, tables, and bullet points.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ analysis: message.content[0].text, business: business.name });
  } catch (err) {
    console.error('competitive-analysis error:', err.message);
    res.status(500).json({ error: 'Failed to generate analysis: ' + err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`BIG backend running on 0.0.0.0:${PORT}`));
