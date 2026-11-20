import { readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import * as core from "../core";
import { clearMockEmails, listMockEmails, mockEmailProvider } from "../mock/email";
import { mockWebhookProvider } from "../mock/webhook";
import { DuplicateKeyError, type CheckoutProvider, type Providers } from "../types";
import type { Db } from "./db";
import { createPostgresLicenseStore } from "./store";

/** Runs the real store SQL against an in-process Postgres (PGlite) with db/schema.sql. */

const schema = readFileSync(path.resolve(__dirname, "../../../../db/schema.sql"), "utf8");

let pg: PGlite;
const db: Db = {
  query: async (text, params) => (await pg.query<Record<string, unknown>>(text, params)).rows,
  transaction: (statements) =>
    pg.transaction(async (tx) => {
      const results = [];
      for (const s of statements) results.push((await tx.query<Record<string, unknown>>(s.text, s.params)).rows);
      return results;
    }),
};

const store = createPostgresLicenseStore(() => db);
const unusedCheckout: CheckoutProvider = {
  createCheckoutSession: () => Promise.reject(new Error("not used")),
};
const p: Providers = {
  mode: "real",
  store,
  email: mockEmailProvider,
  webhook: mockWebhookProvider,
  checkout: unusedCheckout,
};

beforeAll(async () => {
  pg = new PGlite();
  await pg.exec(schema);
});

beforeEach(async () => {
  await pg.exec("TRUNCATE activations, licenses CASCADE");
  clearMockEmails();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

const newLicense = (n: number) =>
  store.insertLicenseIfAbsent({
    key: `SPY-AAAA-BBBB-000${n}`,
    email: `Buyer${n}@Example.com`,
    stripeSessionId: `cs_${n}`,
    stripePaymentIntent: `pi_${n}`,
  });

describe("postgres store: licenses", () => {
  it("inserts once per session and maps columns", async () => {
    const a = await newLicense(1);
    expect(a).toMatchObject({
      key: "SPY-AAAA-BBBB-0001",
      status: "active",
      stripeSessionId: "cs_1",
      stripePaymentIntent: "pi_1",
      revokedAt: null,
      emailSentAt: null,
    });
    expect(a.createdAt).toBeInstanceOf(Date);

    const again = await store.insertLicenseIfAbsent({
      key: "SPY-ZZZZ-ZZZZ-ZZZZ",
      email: "other@example.com",
      stripeSessionId: "cs_1",
      stripePaymentIntent: null,
    });
    expect(again.id).toBe(a.id);
    expect(again.key).toBe(a.key);
  });

  it("throws DuplicateKeyError on a key collision for a new session", async () => {
    await newLicense(1);
    await expect(
      store.insertLicenseIfAbsent({
        key: "SPY-AAAA-BBBB-0001",
        email: "x@example.com",
        stripeSessionId: "cs_other",
        stripePaymentIntent: null,
      }),
    ).rejects.toBeInstanceOf(DuplicateKeyError);
  });

  it("finds by key, session, and email (case-insensitive)", async () => {
    const a = await newLicense(1);
    expect((await store.findLicenseByKey(a.key))?.id).toBe(a.id);
    expect((await store.findLicenseBySessionId("cs_1"))?.id).toBe(a.id);
    expect((await store.findLicensesByEmail(" buyer1@example.COM ")).map((l) => l.id)).toEqual([a.id]);
    expect(await store.findLicenseByKey("SPY-NONE-0000-0000")).toBeNull();
  });

  it("revokes by payment intent or id, once", async () => {
    const a = await newLicense(1);
    const b = await newLicense(2);
    expect(await store.revokeLicense({ stripePaymentIntent: "pi_1" })).toBe(1);
    expect(await store.revokeLicense({ stripePaymentIntent: "pi_1" })).toBe(0);
    expect(await store.revokeLicense({ licenseId: b.id })).toBe(1);
    expect(await store.revokeLicense({ licenseId: "not-a-uuid" })).toBe(0);

    const revoked = await store.findLicenseByKey(a.key);
    expect(revoked?.status).toBe("revoked");
    expect(revoked?.revokedAt).toBeInstanceOf(Date);
  });
});

describe("postgres store: activations", () => {
  it("holds the 3-device limit and re-activates existing devices", async () => {
    const { id } = await newLicense(1);
    const activate = (deviceId: string, deviceName = deviceId) =>
      store.activateDevice({ licenseId: id, deviceId, deviceName, maxDevices: 3 });

    expect(await activate("a")).toBe("ok");
    expect(await activate("b")).toBe("ok");
    expect(await activate("c")).toBe("ok");
    expect(await activate("d")).toBe("limit_reached");
    expect(await activate("a", "Renamed")).toBe("ok");

    const list = await store.listActivations(id);
    expect(list.map((a) => a.deviceId).sort()).toEqual(["a", "b", "c"]);
    expect(list.find((a) => a.deviceId === "a")?.deviceName).toBe("Renamed");

    await store.removeActivation(id, "b");
    expect(await activate("d")).toBe("ok");
  });

  it("never exceeds the limit under concurrent activations", async () => {
    const { id } = await newLicense(1);
    const results = await Promise.all(
      ["a", "b", "c", "d", "e", "f"].map((deviceId) =>
        store.activateDevice({ licenseId: id, deviceId, deviceName: deviceId, maxDevices: 3 }),
      ),
    );
    expect(results.filter((r) => r === "ok")).toHaveLength(3);
    expect(await store.listActivations(id)).toHaveLength(3);
  });

  it("touches lastValidatedAt", async () => {
    const { id } = await newLicense(1);
    await store.activateDevice({ licenseId: id, deviceId: "a", deviceName: "A", maxDevices: 3 });
    await pg.query("UPDATE activations SET last_validated_at = now() - interval '1 day'");
    const before = (await store.findActivation(id, "a"))!.lastValidatedAt;
    await store.touchActivation(id, "a");
    const after = (await store.findActivation(id, "a"))!.lastValidatedAt;
    expect(after.getTime()).toBeGreaterThan(before.getTime());
  });
});

describe("licensing rules on postgres", () => {
  const completed = {
    type: "checkout.completed" as const,
    stripeSessionId: "cs_live_1",
    stripePaymentIntent: "pi_live_1",
    email: "buyer@example.com",
    paid: true,
  };

  it("fulfills once, then the key activates, validates, and is revoked by refund", async () => {
    await core.handlePaymentEvent(p, completed);
    await core.handlePaymentEvent(p, completed);

    const license = await store.findLicenseBySessionId("cs_live_1");
    expect(license?.key).toMatch(/^SPY-/);
    expect(license?.emailSentAt).toBeInstanceOf(Date);
    expect(listMockEmails()).toHaveLength(1);

    const key = license!.key;
    expect(await core.validateLicense(p, { key, deviceId: "m1" })).toBe("not_activated");
    expect(await core.activateLicense(p, { key, deviceId: "m1", deviceName: "Mac" })).toBe("ok");
    expect(await core.validateLicense(p, { key, deviceId: "m1" })).toBe("active");

    await core.handlePaymentEvent(p, { type: "charge.refunded", stripePaymentIntent: "pi_live_1", fullyRefunded: true });
    expect(await core.validateLicense(p, { key, deviceId: "m1" })).toBe("revoked");
    expect(await core.activateLicense(p, { key, deviceId: "m2", deviceName: "Mac" })).toBe("revoked");
  });

  it("resends active keys only", async () => {
    await core.handlePaymentEvent(p, completed);
    await core.handlePaymentEvent(p, { ...completed, stripeSessionId: "cs_live_2", stripePaymentIntent: "pi_live_2" });
    await core.revokeLicense(p, { stripePaymentIntent: "pi_live_2" });
    clearMockEmails();

    await core.resendLicenseEmails(p, "BUYER@example.com");
    expect(listMockEmails()).toHaveLength(1);
  });
});
