import { describe, expect, it } from "vitest";
import {
  runActivateLicenseTransaction,
  type PgQueryable,
} from "./license-activation";

class RecordingClient implements PgQueryable {
  readonly queries: string[] = [];

  private readonly licenseStatus: string;
  private readonly existingDevices: Set<string>;
  private activationCount: number;

  constructor(options: {
    licenseStatus?: string;
    activationCount?: number;
    existingDeviceHash?: string;
  }) {
    this.licenseStatus = options.licenseStatus ?? "active";
    this.activationCount = options.activationCount ?? 0;
    this.existingDevices = new Set();
    if (options.existingDeviceHash) {
      this.existingDevices.add(options.existingDeviceHash);
    }
  }

  async query(
    text: string,
    params?: unknown[],
  ): Promise<{ rows: Record<string, unknown>[] }> {
    this.queries.push(text.trim());

    if (text.includes("FROM licenses")) {
      return { rows: [{ status: this.licenseStatus }] };
    }

    if (text.includes("FROM activations") && text.includes("device_id_hash")) {
      const deviceHash = String(params?.[1]);
      if (this.existingDevices.has(deviceHash)) {
        return { rows: [{ instance_id: "inst_existing" }] };
      }
      return { rows: [] };
    }

    if (text.includes("COUNT(*)::int AS count")) {
      return { rows: [{ count: this.activationCount }] };
    }

    if (text.startsWith("INSERT INTO activations")) {
      this.activationCount += 1;
      const deviceHash = String(params?.[1]);
      this.existingDevices.add(deviceHash);
      return { rows: [] };
    }

    return { rows: [] };
  }
}

describe("runActivateLicenseTransaction", () => {
  it("runs advisory lock and insert as separate statements in one transaction", async () => {
    const client = new RecordingClient({ activationCount: 1 });
    const result = await runActivateLicenseTransaction(
      client,
      "TEST-KEY",
      "device-hash-new",
      "inst_new",
      3,
    );

    expect(result?.instance_id).toBe("inst_new");

    expect(client.queries[0]).toBe("BEGIN");

    const lockIndex = client.queries.findIndex((q) =>
      q.includes("pg_advisory_xact_lock"),
    );
    const countIndex = client.queries.findIndex((q) =>
      q.includes("COUNT(*)::int AS count"),
    );
    const insertIndex = client.queries.findIndex((q) =>
      q.startsWith("INSERT INTO activations"),
    );
    const commitIndex = client.queries.findIndex((q) => q === "COMMIT");

    expect(lockIndex).toBeGreaterThan(0);
    expect(countIndex).toBeGreaterThan(lockIndex);
    expect(insertIndex).toBeGreaterThan(countIndex);
    expect(commitIndex).toBeGreaterThan(insertIndex);
    expect(client.queries.filter((q) => q === "BEGIN")).toHaveLength(1);
    expect(client.queries.filter((q) => q === "COMMIT")).toHaveLength(1);
  });

  it("locks before counting when the device slot is full", async () => {
    const client = new RecordingClient({ activationCount: 3 });
    const result = await runActivateLicenseTransaction(
      client,
      "TEST-KEY",
      "device-hash-new",
      "inst_new",
      3,
    );

    expect(result).toBeNull();
    expect(client.queries).toContain("ROLLBACK");

    const lockIndex = client.queries.findIndex((q) =>
      q.includes("pg_advisory_xact_lock"),
    );
    const countIndex = client.queries.findIndex((q) =>
      q.includes("COUNT(*)::int AS count"),
    );
    expect(lockIndex).toBeLessThan(countIndex);
  });
});
