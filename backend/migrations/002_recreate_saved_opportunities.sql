-- Migration 002: drop and recreate saved_opportunities with correct schema
-- Safe to run because the table was created with wrong columns and has no real data

DROP TABLE IF EXISTS saved_opportunities CASCADE;
DROP VIEW IF EXISTS opportunity_summaries CASCADE;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS saved_opportunities (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email      TEXT        NOT NULL,
  state           VARCHAR(50)  NOT NULL,
  city            VARCHAR(100) NOT NULL,
  zip             VARCHAR(10)  NOT NULL,
  sector          VARCHAR(50)  NOT NULL,
  sector_label    VARCHAR(100),
  card_data       JSONB        NOT NULL,
  score           SMALLINT     NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 10),
  conviction      VARCHAR(20),
  verdict         VARCHAR(10),
  notes           TEXT,
  tags            TEXT[],
  is_watchlisted  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_saved_opps_user_score
  ON saved_opportunities (user_email, score DESC)
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_watchlist
  ON saved_opportunities (user_email, is_watchlisted)
  WHERE is_deleted = FALSE AND is_watchlisted = TRUE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_geo
  ON saved_opportunities (state, city, zip)
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_sector
  ON saved_opportunities (sector)
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_card_data
  ON saved_opportunities USING GIN (card_data);

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON saved_opportunities;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON saved_opportunities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE VIEW opportunity_summaries AS
SELECT
  id, user_email, state, city, zip, sector, sector_label,
  score, conviction, verdict, is_watchlisted, tags, notes,
  created_at, updated_at,
  card_data->>'opportunityName' AS opportunity_name,
  card_data->>'name'            AS card_name,
  card_data->>'tagline'         AS tagline,
  card_data->>'startupCost'     AS startup_cost_raw,
  card_data->>'score'           AS card_score_raw
FROM saved_opportunities
WHERE is_deleted = FALSE;
