import {
  DuplicateKeyError,
  type Activation,
  type License,
  type LicenseStore,
} from "../types";
import { getNeonDb, type Db, type Row } from "./db";

/** Postgres license store. Schema: db/schema.sql. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const toDate = (value: unknown) => (value instanceof Date ? value : new Date(String(value)));
const toDateOrNull = (value: unknown) => (value == null ? null : toDate(value));

function toLicense(row: Row): License {
  return {
    id: String(row.id),
    key: String(row.key),
    email: String(row.email),
    status: row.status === "revoked" ? "revoked" : "active",
    stripeSessionId: String(row.stripe_session_id),
    stripePaymentIntent: row.stripe_payment_intent == null ? null : String(row.stripe_payment_intent),
    createdAt: toDate(row.created_at),
    revokedAt: toDateOrNull(row.revoked_at),
    emailSentAt: toDateOrNull(row.email_sent_at),
  };
}

function toActivation(row: Row): Activation {
  return {
    licenseId: String(row.license_id),
    deviceId: String(row.device_id),
    deviceName: String(row.device_name),
    activatedAt: toDate(row.activated_at),
    lastValidatedAt: toDate(row.last_validated_at),
  };
}

/**
 * Adds or refreshes a device only while the license has room.
 * Runs after the advisory lock, so concurrent activations of one license are
 * serialized and the count cannot go stale between check and insert.
 */
const ACTIVATE_SQL = `
  INSERT INTO activations (license_id, device_id, device_name)
  SELECT $1::uuid, $2::text, $3::text
  WHERE EXISTS (SELECT 1 FROM activations WHERE license_id = $1::uuid AND device_id = $2::text)
     OR (SELECT count(*) FROM activations WHERE license_id = $1::uuid) < $4::int
  ON CONFLICT (license_id, device_id)
  DO UPDATE SET device_name = EXCLUDED.device_name, last_validated_at = now()
  RETURNING device_id`;

export function createPostgresLicenseStore(db: () => Db = getNeonDb): LicenseStore {
  const one = async (text: string, params: unknown[]) => (await db().query(text, params))[0] ?? null;

  return {
    async findLicenseByKey(key) {
      const row = await one("SELECT * FROM licenses WHERE key = $1", [key]);
      return row ? toLicense(row) : null;
    },

    async findLicenseBySessionId(stripeSessionId) {
      const row = await one("SELECT * FROM licenses WHERE stripe_session_id = $1", [stripeSessionId]);
      return row ? toLicense(row) : null;
    },

    async findLicensesByEmail(email) {
      const rows = await db().query(
        "SELECT * FROM licenses WHERE lower(email) = lower($1) ORDER BY created_at",
        [email.trim()],
      );
      return rows.map(toLicense);
    },

    async insertLicenseIfAbsent(input) {
      // DO NOTHING covers both unique columns: stripe_session_id (a retry) and key (a collision).
      const inserted = await one(
        `INSERT INTO licenses (key, email, stripe_session_id, stripe_payment_intent)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [input.key, input.email, input.stripeSessionId, input.stripePaymentIntent],
      );
      if (inserted) return toLicense(inserted);

      const existing = await this.findLicenseBySessionId(input.stripeSessionId);
      if (existing) return existing;
      throw new DuplicateKeyError();
    },

    async markEmailSent(licenseId) {
      await db().query("UPDATE licenses SET email_sent_at = now() WHERE id = $1::uuid", [licenseId]);
    },

    async revokeLicense(target) {
      if ("licenseId" in target) {
        if (!UUID.test(target.licenseId)) return 0;
        const rows = await db().query(
          `UPDATE licenses SET status = 'revoked', revoked_at = now()
           WHERE id = $1::uuid AND status <> 'revoked' RETURNING id`,
          [target.licenseId],
        );
        return rows.length;
      }
      const rows = await db().query(
        `UPDATE licenses SET status = 'revoked', revoked_at = now()
         WHERE stripe_payment_intent = $1 AND status <> 'revoked' RETURNING id`,
        [target.stripePaymentIntent],
      );
      return rows.length;
    },

    async listActivations(licenseId) {
      const rows = await db().query(
        "SELECT * FROM activations WHERE license_id = $1::uuid ORDER BY activated_at",
        [licenseId],
      );
      return rows.map(toActivation);
    },

    async findActivation(licenseId, deviceId) {
      const row = await one(
        "SELECT * FROM activations WHERE license_id = $1::uuid AND device_id = $2",
        [licenseId, deviceId],
      );
      return row ? toActivation(row) : null;
    },

    async activateDevice({ licenseId, deviceId, deviceName, maxDevices }) {
      const [, upserted] = await db().transaction([
        { text: "SELECT pg_advisory_xact_lock(hashtext($1::text))", params: [licenseId] },
        { text: ACTIVATE_SQL, params: [licenseId, deviceId, deviceName, maxDevices] },
      ]);
      return upserted.length > 0 ? "ok" : "limit_reached";
    },

    async removeActivation(licenseId, deviceId) {
      await db().query("DELETE FROM activations WHERE license_id = $1::uuid AND device_id = $2", [
        licenseId,
        deviceId,
      ]);
    },

    async touchActivation(licenseId, deviceId) {
      await db().query(
        "UPDATE activations SET last_validated_at = now() WHERE license_id = $1::uuid AND device_id = $2",
        [licenseId, deviceId],
      );
    },
  };
}

export const postgresLicenseStore = createPostgresLicenseStore();
