const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  users.push({ id: 1, email: 'demo@big.com', name: 'Demo User', passwordHash: hash });
});

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

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', app: 'BIG backend' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Register
app.post('/api/register', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'email, name and password required' });
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, name, passwordHash };
  users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Me
app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user });
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

Include 6-8 capabilities that truly differentiate leaders in this market. Be specific and actionable.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = message.content[0].text.trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    res.json(JSON.parse(json));
  } catch (err) {
    console.error('competitor-compare error:', err.message);
    res.status(500).json({ error: 'Failed to generate comparison: ' + err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`BIG backend running on 0.0.0.0:${PORT}`));
