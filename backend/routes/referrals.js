const express = require('express');
const router = express.Router();
const { processReferral } = require('../repositories/shareRepo');

// Factory: accepts users array and auth middleware from server.js
module.exports = function makeReferralsRouter(users, auth) {
  // POST /api/referrals/claim — auth required
  // body: { referralCode, publicId? }
  router.post('/claim', auth, async (req, res) => {
    try {
      const { referralCode, publicId } = req.body;
      if (!referralCode) return res.status(400).json({ error: 'referralCode required' });

      const result = await processReferral(
        { refereeEmail: req.user.email, referralCode, publicId },
        users
      );

      if (!result.success) {
        return res.status(400).json({ error: result.reason });
      }

      res.json({
        success: true,
        creditsAwarded: result.creditsAwarded,
        message: `${result.creditsAwarded} credits awarded to the referrer`,
      });
    } catch (err) {
      console.error('POST /api/referrals/claim error:', err.message);
      res.status(500).json({ error: 'Failed to process referral' });
    }
  });

  return router;
};
