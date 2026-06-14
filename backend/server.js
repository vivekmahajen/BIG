const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CREDIT_COSTS, TIERS, CREDIT_PACKS } = require('./credits');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'big-opportunity-secret-2026';

// Auto-run migrations on startup when DATABASE_URL is set
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const fs = require('fs');
  const path = require('path');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  (async () => {
    for (const file of files) {
      try {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await pool.query(sql);
        console.log(`✅ Migration applied: ${file}`);
      } catch (err) {
        console.error(`❌ Migration failed (${file}):`, err.message);
      }
    }
    await pool.end();
  })();
}

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

// Parse the upper bound of a startup cost string like "$25K–$75K" → 75000
function parseStartupCostMax(str) {
  if (!str) return Infinity;
  const upper = str.split(/[–\-]/).pop();
  const m = upper.replace(/,/g, '').match(/\$?([\d.]+)\s*([KMB]?)/i);
  if (!m) return Infinity;
  const n = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  return u === 'M' ? n * 1e6 : u === 'B' ? n * 1e9 : u === 'K' ? n * 1e3 : n;
}

// Call Claude and parse JSON; retries up to 2 times if budget constraint is violated
async function callClaude(client, prompt, budget, retryPrefix = '') {
  async function attempt(p) {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: p }],
    });
    const text = msg.content[0].text.trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    try { return JSON.parse(json); } catch {
      return JSON.parse(json.replace(/,\s*$/, '') + '}');
    }
  }

  let idea = await attempt(prompt);

  if (budget) {
    for (let retry = 1; retry <= 2; retry++) {
      const costMax = parseStartupCostMax(idea.startupCost);
      if (costMax <= budget.max && costMax >= budget.min) break;
      if (retry === 2) {
        const err = new Error(`No viable idea found within the $${budget.min.toLocaleString()}–$${budget.max.toLocaleString()} budget range after multiple attempts.`);
        err.budgetExceeded = true;
        throw err;
      }
      const strict = `CRITICAL ERROR: Your previous response had startupCost "${idea.startupCost}" (max=$${costMax.toLocaleString()}) which VIOLATES the required range of $${budget.min.toLocaleString()}–$${budget.max.toLocaleString()}. The startupCost field MUST have its upper bound at or below $${budget.max.toLocaleString()}. Choose a completely different, simpler, lower-cost business concept that genuinely fits this budget. Do NOT scale down the same idea — pick a new one.\n\n${retryPrefix}${prompt}`;
      idea = await attempt(strict);
    }
  }

  return idea;
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
app.get('/api/geo/countries', auth, (req, res) => {
  const { COUNTRIES } = require('./internationalGeoData');
  res.json(COUNTRIES);
});

app.get('/api/geo/states', auth, (req, res) => {
  const { country } = req.query;
  if (!country || country === 'US') {
    const { geoData } = require('./geoData');
    return res.json(geoData.states.map(s => ({ code: s.code, name: s.name })));
  }
  const { getRegionsForCountry } = require('./internationalGeoData');
  const regions = getRegionsForCountry(country);
  res.json(regions.map(r => ({ code: r.code, name: r.name })));
});

app.get('/api/geo/cities', auth, (req, res) => {
  const { stateCode, country } = req.query;
  if (!country || country === 'US') {
    const { geoData } = require('./geoData');
    const state = geoData.states.find(s => s.code === stateCode);
    if (!state) return res.status(404).json({ error: 'State not found' });
    return res.json(state.cities.map(c => ({ name: c.name })));
  }
  const { getCitiesForRegion } = require('./internationalGeoData');
  const cities = getCitiesForRegion(country, stateCode);
  res.json(cities.map(c => ({ name: c.name })));
});

app.get('/api/geo/zips', auth, (req, res) => {
  const { stateCode, city, country } = req.query;
  if (!country || country === 'US') {
    const { geoData } = require('./geoData');
    const state = geoData.states.find(s => s.code === stateCode);
    if (!state) return res.status(404).json({ error: 'State not found' });
    const cityData = state.cities.find(c => c.name === city);
    if (!cityData) return res.status(404).json({ error: 'City not found' });
    return res.json(cityData.zips);
  }
  const { getPostalAreasForCity } = require('./internationalGeoData');
  const areas = getPostalAreasForCity(country, stateCode, city);
  res.json(areas);
});

app.get('/api/sectors', auth, (req, res) => {
  const { zip } = req.query;
  const { getSectorsForZip, SECTORS } = require('./geoData');
  // Non-US postal areas won't be in our ZIP database — return all sectors
  const result = getSectorsForZip(zip);
  if (!result || result.length === 0) {
    return res.json(SECTORS.map(name => ({ name, score: null })));
  }
  res.json(result);
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

// Public test endpoint — no auth, no credits — hit in browser to verify signals
app.get('/api/validate-test', async (req, res) => {
  const sector  = req.query.sector  || 'food';
  const city    = req.query.city    || 'Austin';
  const country = req.query.country || 'US';
  try {
    const { buildValidationPayload } = require('./validation/index');
    const payload = await buildValidationPayload(sector, city, country);
    res.json({
      summary: {
        reddit:  payload.reddit  ? `${payload.reddit.length} posts` : 'no data (expected — Reddit throttles)',
        trends:  payload.trends  ? `${payload.trends.trend} (${payload.trends.growthPercent > 0 ? '+' : ''}${payload.trends.growthPercent}%)` : 'no data (SERPAPI_KEY missing or not set)',
        reviews: payload.reviews ? `${payload.reviews.reviewCount} reviews, ${payload.reviews.topPainThemes.length} pain themes` : 'no data (SERPAPI_KEY missing or not set)',
        search:  payload.search  ? `${payload.search.totalMonthlySearches.toLocaleString()} monthly searches — ${payload.search.verdict}` : 'no data (DATAFORSEO keys missing or not set)',
      },
      raw: payload,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pre-fetch validation signals (cacheable, no credit cost)
app.post('/api/validate', auth, async (req, res) => {
  const { sector, city, country } = req.body;
  if (!sector) return res.status(400).json({ error: 'sector required' });
  try {
    const { buildValidationPayload } = require('./validation/index');
    const payload = await buildValidationPayload(sector, city || '', country || 'US');
    res.json(payload);
  } catch (err) {
    console.error('validate error:', err.message);
    res.status(500).json({ error: 'Validation fetch failed' });
  }
});

app.post('/api/generate-idea', auth, async (req, res) => {
  const { sector, zip, city, state, budget, country } = req.body;
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

  const { getCountryName } = require('./internationalGeoData');
  const countryLabel = country && country !== 'US' ? getCountryName(country) : null;
  const locationCtx = [city, state, countryLabel, zip].filter(Boolean).join(', ');

  let indiaCtx = '';
  let currencyNote = '';
  if (country === 'IN') {
    const { NIC_INDUSTRY_MAP, detectCityTier, getIndiaStateByCode, getRelevantSchemes } = require('./config/indiaData');
    const stateData = getIndiaStateByCode(state);
    const cityTier = detectCityTier(city);
    const nicInfo = NIC_INDUSTRY_MAP[sector] || {};
    const schemes = getRelevantSchemes(0); // get all major schemes
    indiaCtx = `
INDIA-SPECIFIC CONTEXT:
- State Economic Profile: ${stateData?.economicProfile || 'Emerging market with growth potential'}
- City Tier: Tier ${cityTier} city (${cityTier === 1 ? 'Metro — high competition, high purchasing power' : cityTier === 2 ? 'Emerging city — growing middle class, lower costs' : 'Smaller city — underserved market, cost advantages'})
- NIC 2008 Industry Code: ${nicInfo.nic || 'N/A'} — ${nicInfo.nicDesc || sector}
- GST Note: ${stateData?.gstThresholdNote || 'GST registration required above ₹20L turnover'}
- Business Registration: Udyam Portal (udyamregistration.gov.in) for MSME, MCA21 for Pvt Ltd/OPC
- Applicable Government Schemes: ${schemes.map(s => s.name).join(', ')}

MANDATORY INDIA RULES:
1. ALL monetary values MUST be in Indian Rupees (₹). NEVER use USD/$/dollars.
2. Use Indian number format: ₹1,00,000 (one lakh) NOT ₹100,000.
3. Use Indian business terms: "lakh" for 1,00,000 and "crore" for 1,00,00,000.
4. Startup costs should reflect Indian market rates (labour, rent, materials significantly lower than US).
5. Mention relevant government schemes (MUDRA, PMEGP, Stand-Up India, etc.) in funding section.
6. Consider local competition from unorganised sector, kirana stores, local service providers.
7. Registration path: Udyam (MSME) → GST → Shop & Establishment Act → any sector-specific licence.
`;
    currencyNote = ' Use ₹ (Indian Rupees) for ALL monetary values. Indian number format: ₹1,00,000 = one lakh.';
  } else if (country === 'CN') {
    const { GBT_INDUSTRY_MAP, detectCityTier: detectCNTier, getChinaProvinceByCode } = require('./config/chinaData');
    const provinceData = getChinaProvinceByCode(state);
    const cityTier = detectCNTier(city);
    const gbtInfo = GBT_INDUSTRY_MAP[sector] || {};
    indiaCtx = `
CHINA-SPECIFIC CONTEXT:
- Province Economic Profile: ${provinceData?.economicProfile || 'Emerging market with growth potential'}
- City Tier: ${cityTier} city (${cityTier === 'Tier 1' ? 'highest competition and purchasing power (Beijing/Shanghai/Shenzhen/Guangzhou)' : cityTier === 'New Tier 1' ? 'rapidly growing consumer market with strong digital adoption' : cityTier === 'Tier 2' ? 'growing middle class, lower costs, less competition than Tier 1' : 'underserved market, strong cost advantages, local customer loyalty'})
- GB/T 4754-2017 Industry Code: ${gbtInfo.code || 'N/A'} — ${gbtInfo.name || sector} (${gbtInfo.description || ''})
- Business Registration: GSXT (国家企业信用信息公示系统) via local Market Supervision Administration (市场监督管理局). Options: 个体工商户 (sole proprietor) or 有限责任公司 (LLC)
- Tax: VAT registration, corporate income tax 25% (small enterprises 5–10%), fapiao (发票) invoicing required

MANDATORY CHINA RULES:
1. ALL monetary values MUST be in Chinese Yuan (¥/人民币/CNY). NEVER use USD/$/dollars.
2. Use Chinese number format: ¥10万 (10,0000 yuan = 10 wan) or ¥1亿 (100 million yuan = 1 yi).
3. Express amounts as: ¥X万 for tens of thousands, ¥X百万 for hundreds of thousands, ¥X亿 for 100 millions.
4. Startup costs must reflect Chinese market rates (significantly different from US — labour costs lower in interior, higher in Tier 1).
5. Reference China's digital ecosystem: WeChat mini-programs, Douyin, Meituan, Taobao/JD.com, Xiaohongshu.
6. Consider platform-specific strategies: WeChat for CRM, Douyin for content marketing, Meituan for local services.
7. Registration: GSXT → local Market Supervision Administration → tax registration → social insurance.
`;
    currencyNote = ' Use ¥ (Chinese Yuan/CNY) for ALL monetary values. Format: ¥X万 (10,000s) or ¥X亿 (100 millions).';
  } else if (country === 'ID') {
    const { KBLI_INDUSTRY_MAP, getIndonesiaProvinceByCode } = require('./config/indonesiaData');
    const provinceData = getIndonesiaProvinceByCode(state);
    const kbliInfo = KBLI_INDUSTRY_MAP[sector] || {};
    indiaCtx = `
INDONESIA-SPECIFIC CONTEXT:
- Province Economic Profile: ${provinceData?.economicProfile || 'Growing market with UMKM opportunity'}
- KBLI 2020 Industry Code: ${kbliInfo.code || 'N/A'} — ${kbliInfo.name || sector} (${kbliInfo.description || ''})
- Business Registration: OSS-RBA (oss.go.id) for NIB (Nomor Induk Berusaha). Mikro tier for turnover < Rp 300 juta. Also NPWP (tax ID) from KPP.
- Government Finance Programs: KUR Mikro (up to Rp 100 juta, 6%), KUR Kecil (up to Rp 500 juta, 6%), BPUM grants, PNM Mekaar for women

MANDATORY INDONESIA RULES:
1. ALL monetary values MUST be in Indonesian Rupiah (Rp/IDR). NEVER use USD/$/dollars.
2. Use Indonesian format: Rp X juta (millions), Rp X miliar (billions). Example: Rp 50 juta, Rp 2 miliar.
3. Startup costs must reflect Indonesian market rates — significantly lower than US, especially outside Jakarta.
4. Reference KUR subsidized loans (6% annual interest) as primary funding vehicle for UMKM.
5. Mention relevant digital platforms: Tokopedia, Shopee, TikTok Shop, GoFood/Gojek, Grab.
6. Consider Indonesia's UMKM culture: most businesses start very small, scale via marketplace platforms.
7. Registration: OSS-RBA NIB → NPWP → PKP (if VAT applicable) → sector-specific permit (izin usaha).
`;
    currencyNote = ' Use Rp (Indonesian Rupiah/IDR) for ALL monetary values. Format: Rp X juta (millions) or Rp X miliar (billions).';
  }

  const budgetCtx = budget
    ? `\n\nCRITICAL BUDGET CONSTRAINT: The total startup cost MUST be between $${budget.min.toLocaleString()} and $${budget.max.toLocaleString()}. The startupCost field MUST have its upper bound at or below $${budget.max.toLocaleString()}. Design the entire business model around this budget — choose a lean, capital-efficient approach that is genuinely viable at this funding level. Do NOT suggest a business that requires more capital than this.`
    : '';

  const startupCostExample = country === 'IN'
    ? '"₹X lakh–₹Y lakh"'
    : country === 'CN'
      ? '"¥X万–¥Y万"'
      : country === 'ID'
        ? '"Rp X juta–Rp Y juta"'
        : budget
          ? `"$${Math.round(budget.min + (budget.max - budget.min) * 0.3).toLocaleString()}–$${Math.round(budget.min + (budget.max - budget.min) * 0.8).toLocaleString()}"`
          : '"$XK–$YK"';

  const tamExample = country === 'IN' ? '₹X,XX,XXX crore or ₹X,XXX crore' : country === 'CN' ? '¥X亿 or ¥X百亿' : country === 'ID' ? 'Rp X triliun or Rp X miliar' : '$XB or $XM';
  const revYr1Example = country === 'IN' ? '₹X lakh–₹Y lakh' : country === 'CN' ? '¥X万–¥Y万' : country === 'ID' ? 'Rp X juta–Rp Y juta' : '$XK–$YK';
  const revYr3Example = country === 'IN' ? '₹X crore–₹Y crore' : country === 'CN' ? '¥X百万–¥Y百万' : country === 'ID' ? 'Rp X miliar–Rp Y miliar' : '$XM–$YM';
  const exitValExample = country === 'IN' ? '₹X crore–₹Y crore' : country === 'CN' ? '¥X亿–¥Y亿' : country === 'ID' ? 'Rp X miliar–Rp Y miliar' : '$XM–$YM';
  const samExample = country === 'IN' ? '₹X,XXX crore (10% of TAM)' : country === 'CN' ? '¥X亿 (10% of TAM)' : country === 'ID' ? 'Rp X miliar (10% of TAM)' : '$XM (10% of TAM)';
  const somExample = country === 'IN' ? '₹XXX crore (1% of TAM)' : country === 'CN' ? '¥X千万 (1% of TAM)' : country === 'ID' ? 'Rp X miliar (1% of TAM)' : '$XM (1% of TAM)';

  const { buildValidationPayload, buildValidationPromptBlock } = require('./validation/index');
  const validationPayload = await buildValidationPayload(sector, city || '', country || 'US');
  const validationBlock   = buildValidationPromptBlock(validationPayload);

  const prompt = `You are a business opportunity analyst. Generate ONE original, specific, and highly actionable business idea for the "${sector}" sector${locationCtx ? ` targeting the ${locationCtx} market` : ''}.${budgetCtx}${indiaCtx}${validationBlock}
Return ONLY a valid JSON object with exactly these fields (no markdown, no explanation, just raw JSON):${currencyNote}

{
  "name": "Specific Business Name (4-7 words)",
  "model": "Business model type (e.g. SaaS, B2B Services, Marketplace)",
  "startupCost": ${startupCostExample},
  "grossMargin": "XX–YY%",
  "timeToProfit": "X–Y months",
  "tam": "${tamExample}",
  "revenueYr1": "${revYr1Example}",
  "revenueYr3": "${revYr3Example}",
  "score": 8.5,
  "exitVal": "${exitValExample}",
  "whyItWorks": "2-3 sentence explanation of why this business makes money, specific market dynamics, and why now is the right time.",
  "profitDrivers": ["driver 1", "driver 2", "driver 3"],
  "greenSignals": ["positive market signal 1", "signal 2", "signal 3"],
  "keyRisks": ["risk 1", "risk 2"],
  "watchpoints": ["watchpoint 1", "watchpoint 2"],
  "launchPlan": "Month 1–30: [action]. Month 31–60: [action]. Month 61–90: [action].",
  "topCompetitors": ["Competitor A", "Competitor B", "Competitor C"],
  "ltv_cac": "X:1",
  "paybackMonths": 8,
  "sam": "${samExample}",
  "som": "${somExample}",
  "bestZip": "${zip || '78701'}"
}

Make the idea genuinely different from common ideas. Be specific with numbers. Score should reflect real conviction (7.0–9.5 range).`;

  try {
    const idea = await callClaude(client, prompt, budget);
    idea.aiGenerated = true;
    idea.validationSignals = validationPayload;
    res.json(idea);
  } catch (err) {
    console.error('generate-idea error:', err.message);
    if (err.budgetExceeded) return res.status(422).json({ error: err.message, budgetExceeded: true });
    res.status(500).json({ error: 'Failed to generate idea: ' + err.message });
  }
});

app.post('/api/generate-blue-ocean', auth, async (req, res) => {
  const { sector, zip, city, state, budget, country } = req.body;
  if (!sector) return res.status(400).json({ error: 'sector required' });

  const user = getUser(req.user.id);
  if (!user || !deductCredits(user, 'generate-blue-ocean')) {
    return res.status(402).json({
      error: `Not enough credits. Blue Ocean ideas cost ${CREDIT_COSTS['generate-blue-ocean']} credits (3 base + 5 premium).`,
      creditsRequired: CREDIT_COSTS['generate-blue-ocean'],
      creditsAvailable: user ? user.credits + (user.packCredits || 0) : 0,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI generation not configured (ANTHROPIC_API_KEY missing)' });

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });
  const { getCountryName: _gcn } = require('./internationalGeoData');
  const _countryLabel = country && country !== 'US' ? _gcn(country) : null;
  const locationCtx = [city, state, _countryLabel, zip].filter(Boolean).join(', ');

  // India-specific context for blue ocean
  let boIndiaCtx = '';
  let boCurrencyNote = '';
  if (country === 'IN') {
    const { NIC_INDUSTRY_MAP, detectCityTier, getIndiaStateByCode, getRelevantSchemes } = require('./config/indiaData');
    const stateData = getIndiaStateByCode(state);
    const cityTier = detectCityTier(city);
    const nicInfo = NIC_INDUSTRY_MAP[sector] || {};
    const schemes = getRelevantSchemes(0); // get all major schemes
    boIndiaCtx = `
INDIA-SPECIFIC CONTEXT:
- State Economic Profile: ${stateData?.economicProfile || 'Emerging market with growth potential'}
- City Tier: Tier ${cityTier} city (${cityTier === 1 ? 'Metro — high competition, high purchasing power' : cityTier === 2 ? 'Emerging city — growing middle class, lower costs' : 'Smaller city — underserved market, cost advantages'})
- NIC 2008 Industry Code: ${nicInfo.nic || 'N/A'} — ${nicInfo.nicDesc || sector}
- GST Note: ${stateData?.gstThresholdNote || 'GST registration required above ₹20L turnover'}
- Business Registration: Udyam Portal (udyamregistration.gov.in) for MSME, MCA21 for Pvt Ltd/OPC
- Applicable Government Schemes: ${schemes.map(s => s.name).join(', ')}

MANDATORY INDIA RULES:
1. ALL monetary values MUST be in Indian Rupees (₹). NEVER use USD/$/dollars.
2. Use Indian number format: ₹1,00,000 (one lakh) NOT ₹100,000.
3. Use Indian business terms: "lakh" for 1,00,000 and "crore" for 1,00,00,000.
4. Startup costs should reflect Indian market rates (labour, rent, materials significantly lower than US).
5. Mention relevant government schemes (MUDRA, PMEGP, Stand-Up India, etc.) in funding section.
6. Consider local competition from unorganised sector, kirana stores, local service providers.
7. Registration path: Udyam (MSME) → GST → Shop & Establishment Act → any sector-specific licence.
`;
    boCurrencyNote = ' Use ₹ (Indian Rupees) for ALL monetary values. Indian number format: ₹1,00,000 = one lakh.';
  } else if (country === 'CN') {
    const { GBT_INDUSTRY_MAP, detectCityTier: detectCNTier, getChinaProvinceByCode } = require('./config/chinaData');
    const provinceData = getChinaProvinceByCode(state);
    const cityTier = detectCNTier(city);
    const gbtInfo = GBT_INDUSTRY_MAP[sector] || {};
    boIndiaCtx = `
CHINA-SPECIFIC CONTEXT:
- Province Economic Profile: ${provinceData?.economicProfile || 'Emerging market with growth potential'}
- City Tier: ${cityTier} city
- GB/T 4754-2017 Industry Code: ${gbtInfo.code || 'N/A'} — ${gbtInfo.name || sector}
- Business Registration: GSXT via local Market Supervision Administration (市场监督管理局)

MANDATORY CHINA RULES:
1. ALL monetary values MUST be in Chinese Yuan (¥/CNY). NEVER use USD/$.
2. Use Chinese format: ¥X万 (10,000s) or ¥X亿 (100 millions).
3. Reference China's digital ecosystem: WeChat, Douyin, Meituan, Taobao/JD.com.
4. Consider platform-specific strategies for each channel.
5. Registration: GSXT → Market Supervision Administration → tax registration.
`;
    boCurrencyNote = ' Use ¥ (Chinese Yuan/CNY) for ALL monetary values. Format: ¥X万 or ¥X亿.';
  } else if (country === 'ID') {
    const { KBLI_INDUSTRY_MAP, getIndonesiaProvinceByCode } = require('./config/indonesiaData');
    const provinceData = getIndonesiaProvinceByCode(state);
    const kbliInfo = KBLI_INDUSTRY_MAP[sector] || {};
    boIndiaCtx = `
INDONESIA-SPECIFIC CONTEXT:
- Province Economic Profile: ${provinceData?.economicProfile || 'Growing UMKM market'}
- KBLI 2020 Industry Code: ${kbliInfo.code || 'N/A'} — ${kbliInfo.name || sector}
- Business Registration: OSS-RBA (oss.go.id) for NIB + NPWP from KPP
- Government Finance: KUR Mikro (Rp 100 juta, 6%), KUR Kecil (Rp 500 juta, 6%), BPUM grants

MANDATORY INDONESIA RULES:
1. ALL monetary values MUST be in Indonesian Rupiah (Rp/IDR). NEVER use USD/$.
2. Use format: Rp X juta (millions) or Rp X miliar (billions).
3. Reference KUR subsidized loans as primary UMKM funding.
4. Mention platforms: Tokopedia, Shopee, TikTok Shop, GoFood/Gojek.
5. Registration: OSS-RBA NIB → NPWP → sector-specific izin usaha.
`;
    boCurrencyNote = ' Use Rp (Indonesian Rupiah/IDR) for ALL monetary values. Format: Rp X juta or Rp X miliar.';
  }

  const budgetCtx = budget
    ? `\n- CRITICAL BUDGET CONSTRAINT: Startup cost MUST be between $${budget.min.toLocaleString()} and $${budget.max.toLocaleString()}. The startupCost field MUST have its upper bound at or below $${budget.max.toLocaleString()}. Design for this exact funding level — choose a genuinely low-cost approach.`
    : '';

  const blueOceanStartupCostExample = country === 'IN'
    ? '"₹X lakh–₹Y lakh"'
    : country === 'CN'
      ? '"¥X万–¥Y万"'
      : country === 'ID'
        ? '"Rp X juta–Rp Y juta"'
        : budget
          ? `"$${Math.round(budget.min + (budget.max - budget.min) * 0.3).toLocaleString()}–$${Math.round(budget.min + (budget.max - budget.min) * 0.8).toLocaleString()}"`
          : '"$XK–$YK"';
  const boTamExample = country === 'IN' ? '₹X,XX,XXX crore or ₹X,XXX crore' : country === 'CN' ? '¥X亿 or ¥X百亿' : country === 'ID' ? 'Rp X triliun or Rp X miliar' : '$XB or $XM';
  const boRevYr1Example = country === 'IN' ? '₹X lakh–₹Y lakh' : country === 'CN' ? '¥X万–¥Y万' : country === 'ID' ? 'Rp X juta–Rp Y juta' : '$XK–$YK';
  const boRevYr3Example = country === 'IN' ? '₹X crore–₹Y crore' : country === 'CN' ? '¥X百万–¥Y百万' : country === 'ID' ? 'Rp X miliar–Rp Y miliar' : '$XM–$YM';
  const boExitValExample = country === 'IN' ? '₹X crore–₹Y crore' : country === 'CN' ? '¥X亿–¥Y亿' : country === 'ID' ? 'Rp X miliar–Rp Y miliar' : '$XM–$YM';
  const boSamExample = country === 'IN' ? '₹X,XXX crore (10% of TAM)' : country === 'CN' ? '¥X亿 (10% of TAM)' : country === 'ID' ? 'Rp X miliar (10% of TAM)' : '$XM';
  const boSomExample = country === 'IN' ? '₹XXX crore (1% of TAM)' : country === 'CN' ? '¥X千万 (1% of TAM)' : country === 'ID' ? 'Rp X miliar (1% of TAM)' : '$XM';

  const { buildValidationPayload: _bvp, buildValidationPromptBlock: _bvpb } = require('./validation/index');
  const boValidationPayload = await _bvp(sector, city || '', country || 'US');
  const boValidationBlock   = _bvpb(boValidationPayload);

  const prompt = `You are a blue ocean strategy expert. Generate ONE truly original business idea for the "${sector}" sector${locationCtx ? ` in ${locationCtx}` : ''} that operates in UNCONTESTED MARKET SPACE with NO direct competitors.

CRITICAL REQUIREMENTS:${budgetCtx}${boIndiaCtx}${boValidationBlock}
- The idea must serve a customer need that is currently UNMET or UNDERSERVED with zero established competition
- It must NOT be a "better version" of an existing business — it must create a NEW category or market
- Explain specifically WHY no competitors exist yet (timing, technology gap, overlooked segment, regulatory change, etc.)
- The idea must be genuinely viable and profit-making, not a gimmick

Return ONLY a valid JSON object (no markdown, no explanation):${boCurrencyNote}

{
  "name": "Specific Business Name (4-7 words)",
  "model": "Business model type",
  "startupCost": ${blueOceanStartupCostExample},
  "grossMargin": "XX–YY%",
  "timeToProfit": "X–Y months",
  "tam": "${boTamExample}",
  "revenueYr1": "${boRevYr1Example}",
  "revenueYr3": "${boRevYr3Example}",
  "score": 9.0,
  "exitVal": "${boExitValExample}",
  "whyItWorks": "2-3 sentences: the unmet need, why it's profitable, and why NOW is the right time to enter.",
  "blueOceanReason": "Specific explanation of why NO competitors exist: what gap in the market, technology, regulation, or customer insight makes this space completely empty.",
  "firstMoverAdvantage": "Concrete advantages of being first: network effects, switching costs, brand, data, regulatory moat, etc.",
  "profitDrivers": ["driver 1", "driver 2", "driver 3"],
  "greenSignals": ["signal confirming zero competition 1", "signal 2", "signal 3"],
  "keyRisks": ["risk of being too early 1", "risk 2"],
  "watchpoints": ["watchpoint 1", "watchpoint 2"],
  "launchPlan": "Month 1–30: [action]. Month 31–60: [action]. Month 61–90: [action].",
  "topCompetitors": [],
  "ltv_cac": "X:1",
  "paybackMonths": 8,
  "sam": "${boSamExample}",
  "som": "${boSomExample}",
  "bestZip": "${zip || '78701'}",
  "blueOcean": true
}

The topCompetitors array MUST be empty. Score 8.5–9.5. Keep ALL string values concise — under 40 words each. Be specific with numbers.`;

  try {
    const idea = await callClaude(client, prompt, budget);
    idea.aiGenerated = true;
    idea.blueOcean = true;
    idea.topCompetitors = [];
    idea.validationSignals = boValidationPayload;
    res.json(idea);
  } catch (err) {
    console.error('generate-blue-ocean error:', err.message);
    if (err.budgetExceeded) return res.status(422).json({ error: err.message, budgetExceeded: true });
    res.status(500).json({ error: 'Failed to generate blue ocean idea: ' + err.message });
  }
});

// ── Business Plan Generation ───────────────────────────────────────────────
const BUSINESS_PLAN_SYSTEM_PROMPT = `You are an expert business plan writer specialising in investor-ready documents for small and medium businesses. Your output will be used by an entrepreneur to pitch to investors, apply for loans, and guide their first 12 months of operation.

Generate a complete, structured business plan based on the BIG analysis data provided. The plan must be specific to this location, industry, and opportunity — not generic. Every section must use the real numbers from the analysis.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object. No preamble, no markdown fences, no commentary outside the JSON.

JSON STRUCTURE:
{
  "plan_title": "[Industry] Business Plan — [City], [State]",
  "generated_date": "[today's date in Month DD, YYYY format]",
  "tagline": "[1 punchy sentence positioning the opportunity]",
  "sections": {
    "executive_summary": {
      "headline": "[1 bold sentence — the investment thesis]",
      "body": "[3-4 paragraphs: what the business is, why this location, why now, what success looks like at 12 months. Use the score, exit valuation, and LTV:CAC ratio from the data. Be specific — city name, industry, real numbers.]",
      "key_metrics": [
        {"label": "BIG Opportunity Score", "value": "[score]/10"},
        {"label": "Projected 12-Month Revenue", "value": "[revenueYr1 value]"},
        {"label": "Projected Exit Valuation", "value": "[exitVal value]"},
        {"label": "LTV:CAC Ratio", "value": "[ltv_cac value]"},
        {"label": "Market Saturation", "value": "[low/medium/high based on data]"},
        {"label": "Startup Cost Range", "value": "[startupCost value]"}
      ]
    },
    "market_opportunity": {
      "headline": "[Why this market, why now]",
      "market_size": "[Description of total addressable market. Reference the TAM and SAM from the data.]",
      "demand_signals": "[Describe each green signal from the analysis and what it means for this business.]",
      "blue_ocean": "[If no competitors: explain the low-competition advantage. Otherwise: explain differentiation strategy.]",
      "local_context": "[2-3 sentences on why this specific city is the right place to launch.]",
      "data_source": "Census ZIP Business Patterns (ZBP) + BLS QCEW + BIG proprietary scoring engine"
    },
    "competitive_landscape": {
      "headline": "[How this business wins in a competitive market]",
      "competitor_analysis": "[Analyse the top competitors listed in the data. For each, describe their strength, weakness, and the gap this business exploits.]",
      "competitive_advantage": "[3 specific advantages this business has given the location, timing, and market data.]",
      "moat": "[What makes this business hard to copy once established? Network effects, local relationships, proprietary data, brand recognition.]"
    },
    "revenue_model": {
      "headline": "[The core revenue thesis]",
      "primary_revenue": "[Describe the primary revenue stream in detail: pricing model, transaction size, frequency, who pays.]",
      "secondary_revenue": "[1-2 secondary revenue streams that emerge after Month 6.]",
      "pricing_strategy": "[Specific pricing recommendation for this industry and city.]",
      "unit_economics": {
        "avg_transaction": "[estimated average transaction value]",
        "monthly_customers_needed": "[number of customers needed at Month 12 to hit the revenue target]",
        "ltv": "[estimated 12-month LTV per customer]",
        "cac": "[estimated customer acquisition cost]",
        "ltv_cac": "[ratio from analysis data]",
        "payback_period": "[estimated months to recoup CAC]"
      },
      "revenue_ramp": "[Month 1-3 / Month 4-6 / Month 7-12 revenue narrative. Be realistic and specific.]"
    },
    "startup_costs": {
      "headline": "[What it takes to get to first revenue]",
      "total_range": "[startupCost value from data]",
      "breakdown": [
        {"category": "Business registration & legal", "low": "[number only]", "high": "[number only]", "notes": "[specific registration steps for this state/country]"},
        {"category": "Technology & software", "low": "[number only]", "high": "[number only]", "notes": "[specific tools for this industry]"},
        {"category": "Marketing & lead generation", "low": "[number only]", "high": "[number only]", "notes": "[specific channels for this city+industry]"},
        {"category": "Equipment & workspace", "low": "[number only]", "high": "[number only]", "notes": "[specific requirements for this industry]"},
        {"category": "Working capital (3 months)", "low": "[number only]", "high": "[number only]", "notes": "[covers ops until revenue positive]"},
        {"category": "Contingency (15%)", "low": "[number only]", "high": "[number only]", "notes": "First-time founders spend 15-20% more than planned"}
      ],
      "funding_options": "[3 specific funding sources for this country and business type. Name the programme and eligibility. Use SBA 7(a) for US, BDC for Canada, British Business Bank for UK, AusIndustry for Australia.]"
    },
    "milestones": {
      "headline": "[The 12-month sprint — from zero to predictable revenue]",
      "months": [
        {"period": "Month 1-2", "phase": "Foundation", "goals": ["goal 1", "goal 2", "goal 3"], "revenue_target": "$[amount]", "key_metric": "[what to measure]"},
        {"period": "Month 3-4", "phase": "First Revenue", "goals": ["goal 1", "goal 2", "goal 3"], "revenue_target": "$[amount]", "key_metric": "[what to measure]"},
        {"period": "Month 5-6", "phase": "Growth", "goals": ["goal 1", "goal 2", "goal 3"], "revenue_target": "$[amount]", "key_metric": "[what to measure]"},
        {"period": "Month 7-9", "phase": "Scale", "goals": ["goal 1", "goal 2", "goal 3"], "revenue_target": "$[amount]", "key_metric": "[what to measure]"},
        {"period": "Month 10-12", "phase": "Optimise", "goals": ["goal 1", "goal 2", "goal 3"], "revenue_target": "$[amount]", "key_metric": "[what to measure]"}
      ],
      "year_1_exit_criteria": "[What does success look like at Month 12? Specific metrics indicating the business is on track for the projected exit valuation.]"
    },
    "exit_strategy": {
      "headline": "[The wealth-building thesis]",
      "primary_exit": "[Most likely exit path for this type of business. Be specific: strategic acquisition by what type of acquirer, private equity roll-up, or management buyout.]",
      "valuation_basis": "[How the projected exit valuation was derived. Reference the exit multiple from the BIG data and comparable transactions.]",
      "timeline": "[Realistic timeline to exit from launch: typically 3-7 years for this type of business.]",
      "value_drivers": "[3-4 specific things the founder should build from Day 1 to maximise exit value: recurring revenue, customer concentration, documented processes, defensible data.]",
      "alternative_paths": "[2 alternative exit paths if the primary path doesn't materialise.]"
    }
  },
  "footer_disclaimer": "This business plan was generated by BIG (Business Opportunity Intelligence) using Census ZBP, BLS QCEW, and proprietary market scoring data. Projections are estimates based on comparable businesses in this market and should be validated with a financial advisor before making investment decisions.",
  "big_score_context": "A BIG Score of [score]/10 places this opportunity among the top-rated opportunities analysed in [state]."
}

QUALITY RULES:
1. Every number must come from the analysis data provided. Do not invent figures not in the data.
2. Every section must reference the specific city, state/region, and industry — not generic placeholders.
3. The startup cost breakdown numbers must sum to approximately the startupCost range in the data.
4. The competitive landscape must reference the actual topCompetitors from the analysis data.
5. The milestone revenue targets must ramp from $0 toward the revenueYr1 range from the analysis.
6. The exit strategy valuation must be grounded in the exitVal range from the BIG data.
7. Never use placeholder text like "[insert here]" in the output — every field must be fully populated.
8. Tone: confident, specific, investor-ready. Not salesy. Not generic. Not padded.`;

app.post('/api/business-plan', auth, async (req, res) => {
  const { analysis, location } = req.body;
  if (!analysis) return res.status(400).json({ error: 'analysis data required' });

  const user = getUser(req.user.id);
  if (!user || !deductCredits(user, 'business-plan')) {
    return res.status(402).json({
      error: `Not enough credits. Business plan generation costs ${CREDIT_COSTS['business-plan']} credits.`,
      creditsRequired: CREDIT_COSTS['business-plan'],
      creditsAvailable: user ? user.credits + (user.packCredits || 0) : 0,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI generation not configured' });

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8000,
      system: BUSINESS_PLAN_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Generate a complete business plan for the following BIG analysis:\n\n${JSON.stringify({ analysis, location }, null, 2)}`,
      }],
    });

    const raw = msg.content[0].text.trim();
    const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const plan = JSON.parse(clean);

    res.json({ plan, creditsUsed: CREDIT_COSTS['business-plan'], creditsRemaining: user.credits + (user.packCredits || 0) });
  } catch (err) {
    // Refund credits on failure
    user.credits += CREDIT_COSTS['business-plan'];
    console.error('business-plan error:', err.message);
    res.status(500).json({ error: 'Business plan generation failed: ' + err.message });
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

// ── Live AI Card (Census + BLS + Trends + Claude) ─────────────────────────
app.post('/api/live-card', auth, async (req, res) => {
  const { state, city, zip, sector, country } = req.body;
  if (!state || !city || !zip || !sector)
    return res.status(400).json({ error: 'state, city, zip, sector required' });
  // Only enforce 5-digit ZIP for US; international postal areas have varied formats
  if ((!country || country === 'US') && !/^\d{5}$/.test(zip))
    return res.status(400).json({ error: 'ZIP must be 5 digits' });

  // Charge 3 credits (same as generate-idea — live card uses Claude Sonnet)
  const user = getUser(req.user.id);
  if (!user || !deductCredits(user, 'generate-idea')) {
    return res.status(402).json({
      error: `Not enough credits. Live analysis costs ${CREDIT_COSTS['generate-idea']} credits.`,
      creditsRequired: CREDIT_COSTS['generate-idea'],
      creditsAvailable: user ? user.credits + (user.packCredits || 0) : 0,
    });
  }

  try {
    const { generateLiveCard } = require('./services/opportunityService');
    const { getCountryName: gcn } = require('./internationalGeoData');
    const stateLabel = country && country !== 'US' ? `${state}, ${gcn(country)}` : state;

    // Hard 25-second timeout — prevents hanging when BLS/Census/Claude stall
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timed out after 25s — please try again')), 25000)
    );
    const card = await Promise.race([
      generateLiveCard(stateLabel, city, zip, sector, { force: true }),
      timeout,
    ]);
    res.json(card);
  } catch (err) {
    console.error('[BIG live-card]', err.message);
    res.status(500).json({ error: 'Live analysis failed: ' + err.message });
  }
});

// ── Saved Opportunities ────────────────────────────────────────────────────
// Saved opportunities (requires DATABASE_URL env var)
if (process.env.DATABASE_URL) {
  const savedOpportunitiesRoutes = require('./routes/savedOpportunities');
  app.use('/api/saved-opportunities', savedOpportunitiesRoutes);
} else {
  app.use('/api/saved-opportunities', (req, res) =>
    res.status(503).json({ error: 'Database not configured. Set DATABASE_URL to enable saving.' })
  );
}

// ── Share & Referrals ─────────────────────────────────────────────────────
const makeShareRouter = require('./routes/share');
app.use('/api/share', makeShareRouter(users, auth));
const makeReferralsRouter = require('./routes/referrals');
app.use('/api/referrals', makeReferralsRouter(users, auth));

// ── International Geo Endpoints ───────────────────────────────────────────────
app.get('/api/intl/countries', auth, (req, res) => {
  const { INTL_GEO } = require('./intlGeoData');
  const countries = Object.entries(INTL_GEO).map(([code, c]) => ({
    code, name: c.name, currency: c.currency, symbol: c.symbol,
  }));
  res.json(countries);
});

app.get('/api/intl/:countryCode/regions', auth, (req, res) => {
  const { INTL_GEO } = require('./intlGeoData');
  const country = INTL_GEO[req.params.countryCode.toUpperCase()];
  if (!country) return res.status(404).json({ error: 'Country not found' });
  res.json(country.regions.map(r => ({ code: r.code, name: r.name })));
});

app.get('/api/intl/:countryCode/:regionCode/cities', auth, (req, res) => {
  const { INTL_GEO } = require('./intlGeoData');
  const country = INTL_GEO[req.params.countryCode.toUpperCase()];
  if (!country) return res.status(404).json({ error: 'Country not found' });
  const region = country.regions.find(r => r.code === req.params.regionCode);
  if (!region) return res.status(404).json({ error: 'Region not found' });
  res.json(region.cities.map(c => ({ name: c.name })));
});

app.get('/api/intl/:countryCode/:regionCode/:cityName/areas', auth, (req, res) => {
  const { INTL_GEO } = require('./intlGeoData');
  const country = INTL_GEO[req.params.countryCode.toUpperCase()];
  if (!country) return res.status(404).json({ error: 'Country not found' });
  const region = country.regions.find(r => r.code === req.params.regionCode);
  if (!region) return res.status(404).json({ error: 'Region not found' });
  const city = region.cities.find(c => c.name === req.params.cityName);
  if (!city) return res.status(404).json({ error: 'City not found' });
  res.json(city.areas);
});

// ── International Idea Generation ─────────────────────────────────────────────
app.post('/api/generate-intl-idea', auth, async (req, res) => {
  const { country, region, city, area, sector, currency, skills, investmentLevel } = req.body;
  if (!country || !sector) return res.status(400).json({ error: 'country and sector required' });

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

  // Country-specific context
  const countryCtx = {
    CA: {
      structures: 'Corporation (Inc.), Limited Partnership, or Sole Proprietorship — NOT LLC',
      taxBody: 'Canada Revenue Agency (CRA)',
      regAuthority: region === 'QC' ? 'Registraire des entreprises (Quebec) and Corporations Canada' : 'Corporations Canada and provincial registry',
      marketData: 'Statistics Canada (statcan.gc.ca), BDC (bdc.ca), Innovation, Science and Economic Development Canada',
      notes: 'HST/GST applies; CBSA for imports; Business Development Bank of Canada for financing',
    },
    GB: {
      structures: 'Limited Company (Ltd), Limited Liability Partnership (LLP), or Sole Trader — NOT LLC',
      taxBody: 'HM Revenue & Customs (HMRC)',
      regAuthority: region === 'SCT' ? 'Companies House and Registers of Scotland' : region === 'NIR' ? 'Companies House (Belfast)' : 'Companies House (companieshouse.gov.uk)',
      marketData: 'Office for National Statistics (ons.gov.uk), British Business Bank, Innovate UK, local Growth Hubs',
      notes: 'VAT registration required above £90,000 turnover; Making Tax Digital applies; consider IR35 if contracting',
    },
    AU: {
      structures: 'Proprietary Limited (Pty Ltd), Partnership, or Sole Trader — NOT LLC',
      taxBody: 'Australian Taxation Office (ATO)',
      regAuthority: 'Australian Securities and Investments Commission (ASIC) and state business registry',
      marketData: 'Australian Bureau of Statistics (abs.gov.au), Business.gov.au, CSIRO, state investment authorities',
      notes: 'ABN registration required; GST applies above AUD $75,000 turnover; Fair Work Act governs employment',
    },
  };

  const ctx = countryCtx[country] || countryCtx.CA;
  const locationStr = [area, city, region, country].filter(Boolean).join(', ');
  const currencySymbol = currency === 'GBP' ? '£' : currency === 'AUD' ? 'AUD $' : 'CAD $';

  const prompt = `You are an international business opportunity analyst specialising in ${country === 'CA' ? 'Canada' : country === 'GB' ? 'the United Kingdom' : 'Australia'}.

Generate 4 diverse, highly actionable business ideas for the "${sector}" sector in ${locationStr}.
The 4th idea MUST be a surprising "wildcard" idea — unexpected for this sector/location but genuinely viable.

RULES:
- Use ${currency} currency throughout (symbol: ${currencySymbol})
- Business structure: ${ctx.structures}
- Tax body: ${ctx.taxBody}
- Registration: ${ctx.regAuthority}
- Market data sources: ${ctx.marketData}
- Important: ${ctx.notes}
${skills ? `- Founder skills available: ${skills}` : ''}
${investmentLevel ? `- Target investment level: ${investmentLevel}` : ''}

Return ONLY a valid JSON array of exactly 4 objects (no markdown, no explanation):

[
  {
    "name": "Specific Business Name",
    "what": "What it is in 1-2 sentences",
    "whyHereNow": "Why this specific location and current timing makes this opportunity compelling",
    "startupCost": {
      "low": 15000,
      "high": 40000,
      "currency": "${currency}",
      "breakdown": ["Registration: ${currencySymbol}500", "Equipment: ${currencySymbol}X,000", "Working capital: ${currencySymbol}X,000"]
    },
    "revenueMonthly": { "low": 8000, "high": 20000, "currency": "${currency}" },
    "steps": [
      "Step 1: Register with ${ctx.regAuthority.split(' and ')[0]} — specific action",
      "Step 2: specific action with real local authority named",
      "Step 3: specific action"
    ],
    "watchOut": ["Risk or regulatory consideration 1", "Risk 2"],
    "resources": ["https://real-url-1.gov", "https://real-url-2"],
    "isWildcard": false
  }
]

Set isWildcard: true on the 4th idea only. Use real, accurate URLs. Be specific with numbers. Keep all text concise.`;

  try {
    const Anthropic2 = require('@anthropic-ai/sdk');
    const client2 = new Anthropic2({ apiKey });
    const msg = await client2.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0].text.trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    let ideas;
    try { ideas = JSON.parse(json); } catch {
      ideas = JSON.parse(json.replace(/,\s*$/, '') + ']');
    }
    res.json(ideas);
  } catch (err) {
    console.error('generate-intl-idea error:', err.message);
    res.status(500).json({ error: 'Failed to generate international ideas: ' + err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`BIG backend running on 0.0.0.0:${PORT}`));
