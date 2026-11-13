-- SpineSpy License Database Schema
-- Run this migration on your Postgres database (Vercel Postgres or Neon)

CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP
);

CREATE INDEX idx_licenses_key ON licenses(key);
CREATE INDEX idx_licenses_session_id ON licenses(session_id);
CREATE INDEX idx_licenses_email ON licenses(email);
CREATE INDEX idx_licenses_status ON licenses(status);

CREATE TABLE IF NOT EXISTS activations (
  id SERIAL PRIMARY KEY,
  license_key VARCHAR(255) NOT NULL,
  device_id_hash VARCHAR(255) NOT NULL,
  instance_id VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (license_key) REFERENCES licenses(key) ON DELETE CASCADE
);

CREATE INDEX idx_activations_license_key ON activations(license_key);
CREATE INDEX idx_activations_device_id_hash ON activations(device_id_hash);
CREATE INDEX idx_activations_instance_id ON activations(instance_id);

-- Add a unique constraint to prevent duplicate device activations
CREATE UNIQUE INDEX idx_activations_license_device ON activations(license_key, device_id_hash);

-- Table for tracking webhook processing to ensure idempotency
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(255) NOT NULL,
  processed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  session_id VARCHAR(255)
);

CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX idx_webhook_events_session_id ON webhook_events(session_id);
