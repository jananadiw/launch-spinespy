import { MAX_ACTIVATIONS } from "./site";

export type PgQueryable = {
  query: (
    text: string,
    params?: unknown[],
  ) => Promise<{ rows: Record<string, unknown>[] }>;
};

export class LicenseActivationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LicenseActivationError";
  }
}

/**
 * Activates a license on a device inside an explicit transaction:
 * BEGIN → advisory lock → read count → insert/update → COMMIT.
 */
export async function runActivateLicenseTransaction(
  client: PgQueryable,
  licenseKey: string,
  deviceIdHash: string,
  instanceId: string,
  maxActivations: number = MAX_ACTIVATIONS,
): Promise<{ instance_id: string; status: string } | null> {
  await client.query("BEGIN");

  try {
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
      licenseKey,
    ]);

    const licenseRes = await client.query(
      "SELECT status FROM licenses WHERE key = $1 LIMIT 1",
      [licenseKey],
    );
    if (licenseRes.rows.length === 0) {
      throw new LicenseActivationError("License not found");
    }

    const status = String(licenseRes.rows[0].status);
    if (status === "revoked") {
      throw new LicenseActivationError("License has been revoked");
    }

    const existingRes = await client.query(
      `SELECT instance_id FROM activations
       WHERE license_key = $1 AND device_id_hash = $2
       LIMIT 1`,
      [licenseKey, deviceIdHash],
    );

    if (existingRes.rows.length > 0) {
      const existingInstanceId = String(existingRes.rows[0].instance_id);
      await client.query(
        "UPDATE activations SET last_seen = NOW() WHERE instance_id = $1",
        [existingInstanceId],
      );
      await client.query("COMMIT");
      return { instance_id: existingInstanceId, status };
    }

    const countRes = await client.query(
      `SELECT COUNT(*)::int AS count FROM activations WHERE license_key = $1`,
      [licenseKey],
    );
    const count = Number(countRes.rows[0].count);
    if (count >= maxActivations) {
      await client.query("ROLLBACK");
      return null;
    }

    try {
      await client.query(
        `INSERT INTO activations (license_key, device_id_hash, instance_id, last_seen)
         VALUES ($1, $2, $3, NOW())`,
        [licenseKey, deviceIdHash, instanceId],
      );
    } catch (insertError: unknown) {
      const message =
        insertError instanceof Error ? insertError.message : String(insertError);
      if (
        message.includes("duplicate key") ||
        message.includes("unique constraint")
      ) {
        const again = await client.query(
          `SELECT instance_id FROM activations
           WHERE license_key = $1 AND device_id_hash = $2
           LIMIT 1`,
          [licenseKey, deviceIdHash],
        );
        if (again.rows.length > 0) {
          const existingInstanceId = String(again.rows[0].instance_id);
          await client.query(
            "UPDATE activations SET last_seen = NOW() WHERE instance_id = $1",
            [existingInstanceId],
          );
          await client.query("COMMIT");
          return { instance_id: existingInstanceId, status };
        }
      }
      throw insertError;
    }

    await client.query("COMMIT");
    return { instance_id: instanceId, status };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  }
}
