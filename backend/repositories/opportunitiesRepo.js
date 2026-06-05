const db = require('../db');

async function saveOpportunity({ userId, state, city, zip, sector, sectorLabel, cardData }) {
  // Handle both card schemas: old uses 'score' (float), new uses 'overallScore' (int)
  const score = parseFloat(cardData?.score || cardData?.overallScore || 0);

  const sql = `
    INSERT INTO saved_opportunities
      (user_id, state, city, zip, sector, sector_label, card_data, score)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, created_at, score
  `;
  const { rows } = await db.query(sql, [
    userId, state, city, zip, sector, sectorLabel, JSON.stringify(cardData), score,
  ]);
  return rows[0];
}

async function getUserOpportunities(userId, options = {}) {
  const {
    sortBy = 'score', sortDir = 'DESC',
    watchlistOnly = false, search = null,
    limit = 50, offset = 0,
  } = options;

  const allowedSorts = { score: 'score', created_at: 'created_at', city: 'city', sector: 'sector' };
  const safeSort = allowedSorts[sortBy] || 'score';
  const safeDir  = sortDir === 'ASC' ? 'ASC' : 'DESC';

  const conds = ['user_id = $1', 'is_deleted = FALSE'];
  const vals  = [userId];
  let p = 2;

  if (watchlistOnly) conds.push('is_watchlisted = TRUE');
  if (search) {
    conds.push(`(opportunity_name ILIKE $${p} OR city ILIKE $${p} OR sector_label ILIKE $${p})`);
    vals.push(`%${search}%`);
    p++;
  }

  const sql = `
    SELECT * FROM opportunity_summaries
    WHERE ${conds.join(' AND ')}
    ORDER BY ${safeSort} ${safeDir}, created_at DESC
    LIMIT $${p++} OFFSET $${p++}
  `;
  vals.push(limit, offset);
  const { rows } = await db.query(sql, vals);
  return rows;
}

async function getUserOpportunityCount(userId, options = {}) {
  const { watchlistOnly = false, search = null } = options;
  const conds = ['user_id = $1', 'is_deleted = FALSE'];
  const vals  = [userId];
  let p = 2;
  if (watchlistOnly) conds.push('is_watchlisted = TRUE');
  if (search) {
    conds.push(`(opportunity_name ILIKE $${p} OR city ILIKE $${p})`);
    vals.push(`%${search}%`);
  }
  const { rows } = await db.query(
    `SELECT COUNT(*) FROM opportunity_summaries WHERE ${conds.join(' AND ')}`, vals
  );
  return parseInt(rows[0].count);
}

async function getOpportunityById(id, userId) {
  const { rows } = await db.query(
    `SELECT * FROM saved_opportunities WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE`,
    [id, userId]
  );
  return rows[0] || null;
}

async function findExistingSave({ userId, state, city, zip, sector }) {
  const { rows } = await db.query(
    `SELECT id, is_watchlisted FROM saved_opportunities
     WHERE user_id=$1 AND state=$2 AND city=$3 AND zip=$4 AND sector=$5 AND is_deleted=FALSE
     ORDER BY created_at DESC LIMIT 1`,
    [userId, state, city, zip, sector]
  );
  return rows[0] || null;
}

async function toggleWatchlist(id, userId) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET is_watchlisted = NOT is_watchlisted
     WHERE id=$1 AND user_id=$2 AND is_deleted=FALSE
     RETURNING id, is_watchlisted, updated_at`,
    [id, userId]
  );
  return rows[0] || null;
}

async function updateNotes(id, userId, notes) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET notes=$3
     WHERE id=$1 AND user_id=$2 AND is_deleted=FALSE
     RETURNING id, notes, updated_at`,
    [id, userId, notes]
  );
  return rows[0] || null;
}

async function deleteOpportunity(id, userId) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET is_deleted=TRUE, deleted_at=NOW()
     WHERE id=$1 AND user_id=$2 AND is_deleted=FALSE RETURNING id`,
    [id, userId]
  );
  return rows[0] || null;
}

async function getUserStats(userId) {
  const { rows } = await db.query(`
    SELECT
      COUNT(*)                                        AS total_saved,
      COUNT(*) FILTER (WHERE is_watchlisted = TRUE)   AS watchlisted,
      ROUND(AVG(score), 1)                            AS avg_score,
      COUNT(DISTINCT sector)                          AS sectors_explored,
      COUNT(DISTINCT city || ',' || state)            AS cities_explored
    FROM saved_opportunities
    WHERE user_id=$1 AND is_deleted=FALSE
  `, [userId]);
  return rows[0];
}

module.exports = {
  saveOpportunity, getUserOpportunities, getUserOpportunityCount,
  getOpportunityById, findExistingSave, toggleWatchlist,
  updateNotes, deleteOpportunity, getUserStats,
};
