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

app.listen(PORT, () => console.log(`BIG backend running on :${PORT}`));
