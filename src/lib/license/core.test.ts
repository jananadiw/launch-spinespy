import { beforeEach, describe, expect, it, vi } from "vitest";
import * as core from "./core";
import { generateLicenseKey, normalizeLicenseKey } from "./key";
import { clearMockEmails, listMockEmails } from "./mock/email";
import { MOCK_SEED_EMAIL, MOCK_SEED_KEYS, mockLicenseStore, resetMockStore } from "./mock/store";
import { createMockProviders } from "./providers";
import type { Providers } from "./types";

let p: Providers;

beforeEach(() => {
  resetMockStore();
  clearMockEmails();
  p = createMockProviders();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("license keys", () => {
  it("generates SPY-XXXX-XXXX-XXXX without ambiguous characters", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateLicenseKey()).toMatch(/^SPY-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
    }
  });

  it("normalizes case and whitespace and rejects other shapes", () => {
    expect(normalizeLicenseKey("  spy-test-0000-0001 ")).toBe("SPY-TEST-0000-0001");
    expect(normalizeLicenseKey("SPY-TEST-0000")).toBeNull();
    expect(normalizeLicenseKey(42)).toBeNull();
  });
});

describe("seed keys", () => {
  const device = { deviceId: "mac-new", deviceName: "New Mac" };

  it("valid key activates, validates, and deactivates", async () => {
    const key = MOCK_SEED_KEYS.valid;
    expect(await core.validateLicense(p, { key, deviceId: device.deviceId })).toBe("not_activated");
    expect(await core.activateLicense(p, { key, ...device })).toBe("ok");
    expect(await core.validateLicense(p, { key, deviceId: device.deviceId })).toBe("active");
    expect(await core.deactivateLicense(p, { key, deviceId: device.deviceId })).toBe("ok");
    expect(await core.validateLicense(p, { key, deviceId: device.deviceId })).toBe("not_activated");
  });

  it("full key refuses a 4th Mac but re-activates an existing one", async () => {
    const key = MOCK_SEED_KEYS.full;
    expect(await core.activateLicense(p, { key, ...device })).toBe("limit_reached");
    expect(await core.activateLicense(p, { key, deviceId: "seed-mac-1", deviceName: "Renamed" })).toBe("ok");
    expect(await core.validateLicense(p, { key, deviceId: "seed-mac-2" })).toBe("active");

    await core.deactivateLicense(p, { key, deviceId: "seed-mac-3" });
    expect(await core.activateLicense(p, { key, ...device })).toBe("ok");
  });

  it("revoked key reports revoked", async () => {
    const key = MOCK_SEED_KEYS.revoked;
    expect(await core.activateLicense(p, { key, ...device })).toBe("revoked");
    expect(await core.validateLicense(p, { key, deviceId: device.deviceId })).toBe("revoked");
  });

  it("unknown key is invalid; deactivate still says ok", async () => {
    const key = "SPY-NOPE-0000-0000";
    expect(await core.activateLicense(p, { key, ...device })).toBe("invalid");
    expect(await core.validateLicense(p, { key, deviceId: device.deviceId })).toBe("invalid");
    expect(await core.deactivateLicense(p, { key, deviceId: device.deviceId })).toBe("ok");
  });
});

describe("fulfillment", () => {
  const completed = {
    type: "checkout.completed" as const,
    stripeSessionId: "cs_test_1",
    stripePaymentIntent: "pi_test_1",
    email: "buyer@example.com",
    paid: true,
  };

  it("creates one license and one email per session, across retries", async () => {
    await core.handlePaymentEvent(p, completed);
    await core.handlePaymentEvent(p, completed);

    const license = await mockLicenseStore.findLicenseBySessionId("cs_test_1");
    expect(license?.key).toMatch(/^SPY-/);
    expect(license?.emailSentAt).not.toBeNull();

    const emails = listMockEmails();
    expect(emails).toHaveLength(1);
    expect(emails[0]).toMatchObject({ to: "buyer@example.com", key: license?.key });
    expect(emails[0].text).toContain(license!.key);
  });

  it("createLicense is idempotent on stripeSessionId", async () => {
    const a = await core.createLicense(p, { email: "x@example.com", stripeSessionId: "cs_same" });
    const b = await core.createLicense(p, { email: "x@example.com", stripeSessionId: "cs_same" });
    expect(b.key).toBe(a.key);
  });

  it("waits for async payment before fulfilling", async () => {
    await core.handlePaymentEvent(p, { ...completed, paid: false });
    expect(await mockLicenseStore.findLicenseBySessionId("cs_test_1")).toBeNull();
    await core.handlePaymentEvent(p, completed);
    expect(await mockLicenseStore.findLicenseBySessionId("cs_test_1")).not.toBeNull();
  });

  it("retries the email when the first send fails", async () => {
    const send = vi
      .spyOn(p.email, "sendLicenseEmail")
      .mockRejectedValueOnce(new Error("smtp down"));

    await expect(core.handlePaymentEvent(p, completed)).rejects.toThrow("smtp down");
    expect((await mockLicenseStore.findLicenseBySessionId("cs_test_1"))?.emailSentAt).toBeNull();

    await core.handlePaymentEvent(p, completed);
    expect(send).toHaveBeenCalledTimes(2);
    expect((await mockLicenseStore.findLicenseBySessionId("cs_test_1"))?.emailSentAt).not.toBeNull();
    send.mockRestore();
  });

  it("full refund revokes by payment intent; partial refund does not", async () => {
    await core.handlePaymentEvent(p, completed);
    const { key } = (await mockLicenseStore.findLicenseBySessionId("cs_test_1"))!;

    await core.handlePaymentEvent(p, { type: "charge.refunded", stripePaymentIntent: "pi_test_1", fullyRefunded: false });
    expect(await core.activateLicense(p, { key, deviceId: "d", deviceName: "Mac" })).toBe("ok");

    await core.handlePaymentEvent(p, { type: "charge.refunded", stripePaymentIntent: "pi_test_1", fullyRefunded: true });
    expect(await core.validateLicense(p, { key, deviceId: "d" })).toBe("revoked");
  });

  it("revokeLicense also works by license id", async () => {
    const license = await core.createLicense(p, { email: "x@example.com", stripeSessionId: "cs_rev" });
    expect(await core.revokeLicense(p, { licenseId: license.id })).toBe(1);
    expect(await core.validateLicense(p, { key: license.key, deviceId: "d" })).toBe("revoked");
  });

  it("mock checkout runs fulfillment and returns /thanks", async () => {
    const { url } = await p.checkout.createCheckoutSession({ email: "mock@example.com" });
    expect(url).toMatch(/^\/thanks\?session_id=mock_[0-9a-f]+$/);

    const sessionId = new URL(url, "http://x").searchParams.get("session_id")!;
    const license = await mockLicenseStore.findLicenseBySessionId(sessionId);
    expect(license?.email).toBe("mock@example.com");
    expect(listMockEmails()[0]).toMatchObject({ to: "mock@example.com", key: license?.key });
  });
});

describe("resend", () => {
  it("resends active keys only, matching email case-insensitively", async () => {
    await core.resendLicenseEmails(p, MOCK_SEED_EMAIL.toUpperCase());
    const keys = listMockEmails().map((e) => e.key).sort();
    expect(keys).toEqual([MOCK_SEED_KEYS.full, MOCK_SEED_KEYS.valid].sort());
  });

  it("sends nothing for an unknown email", async () => {
    await core.resendLicenseEmails(p, "nobody@example.com");
    expect(listMockEmails()).toHaveLength(0);
  });
});
