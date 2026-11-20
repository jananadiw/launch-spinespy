-- SpineSpy license schema (Phase 2, not applied yet).
-- Matches the LicenseStore interface in src/lib/license/types.ts.
-- Apply with: psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS licenses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key                   TEXT NOT NULL UNIQUE,              -- SPY-XXXX-XXXX-XXXX
  email                 TEXT NOT NULL,                     -- from Stripe Checkout; the buyer's only identity
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  stripe_session_id     TEXT NOT NULL UNIQUE,              -- fulfillment is idempotent on this
  stripe_payment_intent TEXT,                              -- refunds revoke by this
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at            TIMESTAMPTZ,
  email_sent_at         TIMESTAMPTZ                        -- null until the key email is sent
);

CREATE INDEX IF NOT EXISTS licenses_email_lower_idx ON licenses (lower(email));
CREATE INDEX IF NOT EXISTS licenses_payment_intent_idx ON licenses (stripe_payment_intent);

CREATE TABLE IF NOT EXISTS activations (
  license_id        UUID NOT NULL REFERENCES licenses (id) ON DELETE CASCADE,
  device_id         TEXT NOT NULL,
  device_name       TEXT NOT NULL,
  activated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_validated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (license_id, device_id)
);
