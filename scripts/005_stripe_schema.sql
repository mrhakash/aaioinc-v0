-- Migration 005: Stripe integration schema additions
-- Adds plan column to profiles, and stripe/status columns to subscriptions

-- 1. Add plan column to profiles (quick-access, denormalized from subscriptions)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS plan          TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- 2. Extend subscriptions table with Stripe-specific columns
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_customer_id      TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id         TEXT,
  ADD COLUMN IF NOT EXISTS status                  TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS current_period_start    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS current_period_end      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at              TIMESTAMPTZ NOT NULL DEFAULT now();

-- 3. Index on stripe_subscription_id for fast webhook lookups
CREATE INDEX IF NOT EXISTS subscriptions_stripe_sub_id_idx
  ON subscriptions (stripe_subscription_id);

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON profiles (stripe_customer_id);

-- 4. RLS policy: service role can update any profile/subscription row (for webhook)
-- (service role bypasses RLS by default — no policy needed)

-- 5. Sync plan back-fill: for any existing subscriptions, copy plan to profiles
UPDATE profiles p
SET plan = s.plan
FROM subscriptions s
WHERE s.user_id = p.id
  AND s.plan IS NOT NULL;
