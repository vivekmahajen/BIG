const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const repo = require('../repositories/opportunitiesRepo');

router.use(authenticateToken);

// POST /api/saved-opportunities — save a card
router.post('/', async (req, res) => {
  const { state, city, zip, sector, sectorLabel, cardData } = req.body;
  const userEmail = req.user.email;

  if (!state || !city || !zip || !sector || !cardData) {
    return res.status(400).json({ error: 'Missing required fields: state, city, zip, sector, cardData' });
  }
  if (typeof cardData !== 'object' || Array.isArray(cardData)) {
    return res.status(400).json({ error: 'cardData must be a JSON object' });
  }

  try {
    const existing = await repo.findExistingSave({ userEmail, state, city, zip, sector });
    if (existing) {
      return res.status(200).json({
        success: true, alreadySaved: true, id: existing.id,
        isWatchlisted: existing.is_watchlisted,
        message: 'This opportunity is already in your dashboard.',
      });
    }

    const saved = await repo.saveOpportunity({ userEmail, state, city, zip, sector, sectorLabel, cardData });
    return res.status(201).json({
      success: true, alreadySaved: false, id: saved.id,
      score: saved.score, conviction: saved.conviction,
      verdict: saved.verdict, createdAt: saved.created_at,
      message: 'Opportunity saved to your dashboard!',
    });
  } catch (err) {
    console.error('[saved-opps] POST error:', err.message);
    return res.status(500).json({ error: 'Failed to save opportunity', detail: err.message });
  }
});

// GET /api/saved-opportunities — dashboard list
router.get('/', async (req, res) => {
  const userEmail = req.user.email;
  const {
    sortBy = 'score', sortDir = 'DESC',
    sector = '', verdict = '', watchlistOnly = '',
    search = '', limit = '50', offset = '0',
  } = req.query;

  const options = {
    sortBy, sortDir,
    sector:       sector       || null,
    verdict:      verdict      || null,
    watchlistOnly: watchlistOnly === 'true',
    search:       search       || null,
    limit:        Math.min(parseInt(limit)  || 50, 100),
    offset:       parseInt(offset) || 0,
  };

  try {
    const [opportunities, total, stats] = await Promise.all([
      repo.getUserOpportunities(userEmail, options),
      repo.getUserOpportunityCount(userEmail, options),
      repo.getUserStats(userEmail),
    ]);
    return res.json({
      success: true, total, count: opportunities.length,
      opportunities, stats,
      pagination: {
        limit: options.limit, offset: options.offset,
        hasMore: options.offset + opportunities.length < total,
      },
    });
  } catch (err) {
    console.error('[saved-opps] GET error:', err.message);
    return res.status(500).json({ error: 'Failed to load dashboard', detail: err.message });
  }
});

// GET /api/saved-opportunities/:id — full card data
router.get('/:id', async (req, res) => {
  const userEmail = req.user.email;
  try {
    const opportunity = await repo.getOpportunityById(req.params.id, userEmail);
    if (!opportunity) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, opportunity });
  } catch (err) {
    console.error('[saved-opps] GET /:id error:', err.message);
    return res.status(500).json({ error: 'Failed to load opportunity', detail: err.message });
  }
});

// PATCH /api/saved-opportunities/:id/watchlist — toggle watchlist
router.patch('/:id/watchlist', async (req, res) => {
  const userEmail = req.user.email;
  try {
    const updated = await repo.toggleWatchlist(req.params.id, userEmail);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json({
      success: true, id: updated.id, isWatchlisted: updated.is_watchlisted,
      message: updated.is_watchlisted ? 'Added to watchlist ⭐' : 'Removed from watchlist',
    });
  } catch (err) {
    console.error('[saved-opps] PATCH watchlist error:', err.message);
    return res.status(500).json({ error: 'Failed to update watchlist', detail: err.message });
  }
});

// PATCH /api/saved-opportunities/:id/notes
router.patch('/:id/notes', async (req, res) => {
  const userEmail = req.user.email;
  const { notes } = req.body;
  if (notes === undefined) return res.status(400).json({ error: 'notes field required' });
  if (typeof notes !== 'string' || notes.length > 5000) {
    return res.status(400).json({ error: 'notes must be a string under 5,000 characters' });
  }
  try {
    const updated = await repo.updateNotes(req.params.id, userEmail, notes);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, id: updated.id, notes: updated.notes, updatedAt: updated.updated_at });
  } catch (err) {
    console.error('[saved-opps] PATCH notes error:', err.message);
    return res.status(500).json({ error: 'Failed to update notes', detail: err.message });
  }
});

// PATCH /api/saved-opportunities/:id/tags
router.patch('/:id/tags', async (req, res) => {
  const userEmail = req.user.email;
  const { tags } = req.body;
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags must be an array' });
  if (tags.length > 10) return res.status(400).json({ error: 'Maximum 10 tags' });
  const cleanTags = tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
  try {
    const updated = await repo.updateTags(req.params.id, userEmail, cleanTags);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, id: updated.id, tags: updated.tags, updatedAt: updated.updated_at });
  } catch (err) {
    console.error('[saved-opps] PATCH tags error:', err.message);
    return res.status(500).json({ error: 'Failed to update tags', detail: err.message });
  }
});

// DELETE /api/saved-opportunities/:id
router.delete('/:id', async (req, res) => {
  const userEmail = req.user.email;
  try {
    const deleted = await repo.deleteOpportunity(req.params.id, userEmail);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, id: deleted.id, message: 'Removed from dashboard' });
  } catch (err) {
    console.error('[saved-opps] DELETE error:', err.message);
    return res.status(500).json({ error: 'Failed to delete', detail: err.message });
  }
});

module.exports = router;
