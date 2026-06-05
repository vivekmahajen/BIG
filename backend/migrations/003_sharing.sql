-- Migration 003: Shareable public analysis links + referral system

-- Add sharing columns to saved_opportunities
ALTER TABLE saved_opportunities
  ADD COLUMN IF NOT EXISTS public_id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shared_at TIMESTAMPTZ;

-- Unique index on public_id for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS saved_opportunities_public_id_idx ON saved_opportunities(public_id);

-- Referral events table
CREATE TABLE IF NOT EXISTS referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_email TEXT NOT NULL,
  referee_email TEXT NOT NULL,
  public_id UUID,
  referral_code VARCHAR(12) NOT NULL,
  credits_awarded INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referee_email)
);

-- Credit transactions audit log
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
