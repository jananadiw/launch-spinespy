import { neon } from "@neondatabase/serverless";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { getTransactionPool } from "./db-pool";
import { generateLicenseKey } from "./license-key";
import {
  LicenseActivationError,
  runActivateLicenseTransaction,
} from "./license-activation";
import { MAX_ACTIVATIONS } from "./site";

const DATABASE_URL = process.env.DATABASE_URL;
const LICENSE_SIGNING_PRIVATE_KEY = process.env.LICENSE_SIGNING_PRIVATE_KEY;
const LICENSE_SIGNING_PUBLIC_KEY = process.env.LICENSE_SIGNING_PUBLIC_KEY;

export interface License {
  id: number;
  key: string;
  email: string;
  session_id: string;
  status: "active" | "revoked";
  created_at: Date;
  updated_at: Date;
  revoked_at: Date | null;
}

export interface Activation {
  id: number;
  license_key: string;
  device_id_hash: string;
  instance_id: string;
  created_at: Date;
  last_seen: Date;
}

export interface LicenseToken {
  key: string;
  instance_id: string;
  status: string;
  issued_at: number;
  expires_at: number;
}

function getDb() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(DATABASE_URL);
}

export { generateLicenseKey } from "./license-key";

export function generateInstanceId(): string {
  return `inst_${naclUtil.encodeBase64(nacl.randomBytes(16)).replace(/[/+=]/g, "").slice(0, 24)}`;
}

export async function createLicense(
  sessionId: string,
  email: string,
): Promise<License> {
  const sql = getDb();
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = generateLicenseKey();
    try {
      const result = await sql`
        INSERT INTO licenses (key, email, session_id, status)
        VALUES (${key}, ${email}, ${sessionId}, 'active')
        ON CONFLICT (session_id) DO UPDATE
        SET updated_at = NOW()
        RETURNING *
      `;
      return result[0] as License;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);
      if (
        message.includes("licenses_key") ||
        message.includes("unique") ||
        message.includes("duplicate key")
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Failed to generate a unique license key");
}

export async function getLicenseBySessionId(
  sessionId: string
): Promise<License | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM licenses
    WHERE session_id = ${sessionId}
    LIMIT 1
  `;

  return result.length > 0 ? (result[0] as License) : null;
}

export async function getLicenseByKey(key: string): Promise<License | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM licenses
    WHERE key = ${key}
    LIMIT 1
  `;

  return result.length > 0 ? (result[0] as License) : null;
}

export async function revokeLicense(key: string): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE licenses
    SET status = 'revoked', updated_at = NOW(), revoked_at = NOW()
    WHERE key = ${key}
  `;
}

export async function getActivations(licenseKey: string): Promise<Activation[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM activations
    WHERE license_key = ${licenseKey}
    ORDER BY created_at DESC
  `;

  return result as Activation[];
}

export async function activateLicense(
  licenseKey: string,
  deviceIdHash: string,
): Promise<{ instance_id: string; token: string }> {
  const instanceId = generateInstanceId();
  const pool = getTransactionPool();
  const client = await pool.connect();

  try {
    const result = await runActivateLicenseTransaction(
      client,
      licenseKey,
      deviceIdHash,
      instanceId,
      MAX_ACTIVATIONS,
    );

    if (result === null) {
      throw new Error(
        `License is already activated on ${MAX_ACTIVATIONS} devices. Deactivate one device first to activate on a new device.`,
      );
    }

    const token = signLicenseToken({
      key: licenseKey,
      instance_id: result.instance_id,
      status: result.status,
      issued_at: Date.now(),
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return {
      instance_id: result.instance_id,
      token,
    };
  } catch (error) {
    if (error instanceof LicenseActivationError) {
      throw new Error(error.message);
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function validateLicense(
  licenseKey: string,
  instanceId: string
): Promise<{ status: string; token: string }> {
  const sql = getDb();

  const license = await getLicenseByKey(licenseKey);
  if (!license) {
    throw new Error("License not found");
  }

  const activation = await sql`
    SELECT * FROM activations
    WHERE license_key = ${licenseKey} AND instance_id = ${instanceId}
    LIMIT 1
  `;

  if (activation.length === 0) {
    throw new Error("Activation not found");
  }

  await sql`
    UPDATE activations
    SET last_seen = NOW()
    WHERE instance_id = ${instanceId}
  `;

  const token = signLicenseToken({
    key: licenseKey,
    instance_id: instanceId,
    status: license.status,
    issued_at: Date.now(),
    expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return {
    status: license.status,
    token,
  };
}

export async function deactivateLicense(
  licenseKey: string,
  instanceId: string
): Promise<void> {
  const sql = getDb();

  await sql`
    DELETE FROM activations
    WHERE license_key = ${licenseKey} AND instance_id = ${instanceId}
  `;
}

export function signLicenseToken(payload: LicenseToken): string {
  if (!LICENSE_SIGNING_PRIVATE_KEY) {
    throw new Error("LICENSE_SIGNING_PRIVATE_KEY is not configured");
  }

  const privateKeyBytes = naclUtil.decodeBase64(LICENSE_SIGNING_PRIVATE_KEY);
  if (privateKeyBytes.length !== 64) {
    throw new Error("Invalid LICENSE_SIGNING_PRIVATE_KEY length");
  }

  const message = JSON.stringify(payload);
  const messageBytes = naclUtil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageBytes, privateKeyBytes);

  return `${naclUtil.encodeBase64(signature)}.${naclUtil.encodeBase64(messageBytes)}`;
}

export function verifyLicenseToken(token: string): LicenseToken {
  if (!LICENSE_SIGNING_PUBLIC_KEY) {
    throw new Error("LICENSE_SIGNING_PUBLIC_KEY is not configured");
  }

  const [signatureB64, messageB64] = token.split(".");
  if (!signatureB64 || !messageB64) {
    throw new Error("Invalid token format");
  }

  const signature = naclUtil.decodeBase64(signatureB64);
  const message = naclUtil.decodeBase64(messageB64);
  const publicKey = naclUtil.decodeBase64(LICENSE_SIGNING_PUBLIC_KEY);

  const isValid = nacl.sign.detached.verify(message, signature, publicKey);
  if (!isValid) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(naclUtil.encodeUTF8(message));
  return payload as LicenseToken;
}

/** Returns true when this event id was newly claimed (not a Stripe retry). */
export async function claimWebhookEvent(
  eventId: string,
  eventType: string,
  sessionId?: string,
): Promise<boolean> {
  const sql = getDb();

  try {
    await sql`
      INSERT INTO webhook_events (event_id, event_type, session_id)
      VALUES (${eventId}, ${eventType}, ${sessionId || null})
    `;
    return true;
  } catch {
    return false;
  }
}

/** Allow Stripe to retry after a failed handler (e.g. license creation error). */
export async function releaseWebhookEvent(eventId: string): Promise<void> {
  const sql = getDb();
  await sql`
    DELETE FROM webhook_events WHERE event_id = ${eventId}
  `;
}
