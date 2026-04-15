-- Remove Stripe-related columns from subscriptions table
ALTER TABLE public.subscriptions 
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_session_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;
