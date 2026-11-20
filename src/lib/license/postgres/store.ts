import { NotImplementedError, type LicenseStore } from "../types";

/**
 * Postgres (Neon) license store. Phase 2. Schema: db/schema.sql.
 *
 * TODO(phase2): Implement each method with @neondatabase/serverless (already a dependency).
 *   - Plain queries: neon(process.env.DATABASE_URL) tagged templates.
 *   - Transactions (activateDevice): Pool + ws from the same package.
 *
 *   insertLicenseIfAbsent:
 *     INSERT INTO licenses (key, email, stripe_session_id, stripe_payment_intent)
 *     VALUES (...) ON CONFLICT (stripe_session_id) DO NOTHING RETURNING *;
 *     If no row returns, SELECT by stripe_session_id. Map a unique violation
 *     on `key` (code 23505, constraint licenses_key_key) to DuplicateKeyError.
 *
 *   activateDevice (must hold the 3-device limit under concurrency):
 *     BEGIN; SELECT pg_advisory_xact_lock(hashtext(license_id));
 *     existing row for (license_id, device_id)? UPDATE device_name,
 *       last_validated_at; COMMIT; return "ok".
 *     COUNT(*) for license_id >= maxDevices? ROLLBACK; return "limit_reached".
 *     INSERT; COMMIT; return "ok".
 *
 *   findLicensesByEmail: WHERE lower(email) = lower($1).
 *   revokeLicense: UPDATE ... SET status='revoked', revoked_at=now()
 *     WHERE (id = $1 OR stripe_payment_intent = $1) AND status <> 'revoked'.
 *   Map snake_case columns to the camelCase License/Activation types.
 */
function notImplemented(): never {
  throw new NotImplementedError("Postgres license store");
}

export const postgresLicenseStore: LicenseStore = {
  findLicenseByKey: async () => notImplemented(),
  findLicenseBySessionId: async () => notImplemented(),
  findLicensesByEmail: async () => notImplemented(),
  insertLicenseIfAbsent: async () => notImplemented(),
  markEmailSent: async () => notImplemented(),
  revokeLicense: async () => notImplemented(),
  listActivations: async () => notImplemented(),
  findActivation: async () => notImplemented(),
  activateDevice: async () => notImplemented(),
  removeActivation: async () => notImplemented(),
  touchActivation: async () => notImplemented(),
};
