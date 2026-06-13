const express = require('express');
const router = express.Router();
const { getPublicAnalysis, getOrActivateShareLink, setVisibility } = require('../repositories/shareRepo');

// These are injected from server.js via router.locals or closure
// We export a factory function so server.js can pass `users` and `auth`
module.exports = function makeShareRouter(users, auth) {
  // GET /api/share/:publicId — public, no auth
  router.get('/:publicId', async (req, res) => {
    try {
      const { publicId } = req.params;
      const data = await getPublicAnalysis(publicId, users);
      if (!data) return res.status(404).json({ error: 'Analysis not found or not public' });
      if (!data.is_public) return res.status(403).json({ error: 'This analysis is not publicly shared' });
      res.json(data);
    } catch (err) {
      console.error('GET /api/share/:publicId error:', err.message);
      res.status(500).json({ error: 'Failed to load analysis' });
    }
  });

  // POST /api/share/generate — auth required, body: { opportunityId }
  router.post('/generate', auth, async (req, res) => {
    try {
      const { opportunityId } = req.body;
      if (!opportunityId) return res.status(400).json({ error: 'opportunityId required' });
      const result = await getOrActivateShareLink(opportunityId, req.user.email);
      if (!result) return res.status(404).json({ error: 'Opportunity not found or access denied' });
      const baseUrl = process.env.FRONTEND_URL || 'https://big-eosin.vercel.app';
      res.json({
        publicId: result.public_id,
        shareUrl: `${baseUrl}/analysis/${result.public_id}`,
        shareCount: result.share_count,
      });
    } catch (err) {
      console.error('POST /api/share/generate error:', err.message);
      res.status(500).json({ error: 'Failed to generate share link' });
    }
  });

  // PATCH /api/share/:opportunityId/visibility — auth required
  router.patch('/:opportunityId/visibility', auth, async (req, res) => {
    try {
      const { opportunityId } = req.params;
      const { isPublic } = req.body;
      if (typeof isPublic !== 'boolean') return res.status(400).json({ error: 'isPublic (boolean) required' });
      const result = await setVisibility(opportunityId, req.user.email, isPublic);
      if (!result) return res.status(404).json({ error: 'Opportunity not found or access denied' });
      res.json(result);
    } catch (err) {
      console.error('PATCH /api/share/:id/visibility error:', err.message);
      res.status(500).json({ error: 'Failed to update visibility' });
    }
  });

  return router;
};
