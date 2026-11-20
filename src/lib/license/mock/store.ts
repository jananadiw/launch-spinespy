import { randomUUID } from "node:crypto";
import {
  DuplicateKeyError,
  type ActivateResult,
  type Activation,
  type License,
  type LicenseStore,
  type NewLicense,
  type RevokeTarget,
} from "../types";

/**
 * In-memory license store. State lives on globalThis so it survives Next.js
 * dev hot reloads and is shared by every route handler in one process.
 * It does not persist across serverless instances or restarts.
 */

interface MockState {
  licenses: Map<string, License>; // by id
  activations: Activation[];
}

export const MOCK_SEED_KEYS = {
  valid: "SPY-TEST-0000-0001",
  full: "SPY-FULL-0000-0001",
  revoked: "SPY-REVK-0000-0001",
} as const;

export const MOCK_SEED_EMAIL = "seed@example.com";

function seedState(): MockState {
  const now = new Date();
  const license = (
    id: string,
    key: string,
    status: License["status"],
  ): License => ({
    id,
    key,
    email: MOCK_SEED_EMAIL,
    status,
    stripeSessionId: `cs_seed_${id}`,
    stripePaymentIntent: `pi_seed_${id}`,
    createdAt: now,
    revokedAt: status === "revoked" ? now : null,
    emailSentAt: now,
  });

  const licenses = [
    license("lic_seed_test", MOCK_SEED_KEYS.valid, "active"),
    license("lic_seed_full", MOCK_SEED_KEYS.full, "active"),
    license("lic_seed_revk", MOCK_SEED_KEYS.revoked, "revoked"),
  ];

  const activations: Activation[] = [1, 2, 3].map((n) => ({
    licenseId: "lic_seed_full",
    deviceId: `seed-mac-${n}`,
    deviceName: `Seed Mac ${n}`,
    activatedAt: now,
    lastValidatedAt: now,
  }));

  return {
    licenses: new Map(licenses.map((l) => [l.id, l])),
    activations,
  };
}

const globalForStore = globalThis as unknown as {
  __spinespyMockLicenseState?: MockState;
};

function state(): MockState {
  globalForStore.__spinespyMockLicenseState ??= seedState();
  return globalForStore.__spinespyMockLicenseState;
}

/** Test helper: restore the seed data. */
export function resetMockStore(): void {
  globalForStore.__spinespyMockLicenseState = seedState();
}

const clone = <T extends object>(value: T): T => ({ ...value });

export const mockLicenseStore: LicenseStore = {
  async findLicenseByKey(key) {
    for (const license of state().licenses.values()) {
      if (license.key === key) return clone(license);
    }
    return null;
  },

  async findLicenseBySessionId(stripeSessionId) {
    for (const license of state().licenses.values()) {
      if (license.stripeSessionId === stripeSessionId) return clone(license);
    }
    return null;
  },

  async findLicensesByEmail(email) {
    const target = email.trim().toLowerCase();
    return [...state().licenses.values()]
      .filter((l) => l.email.toLowerCase() === target)
      .map(clone);
  },

  async insertLicenseIfAbsent(input: NewLicense) {
    const existing = await this.findLicenseBySessionId(input.stripeSessionId);
    if (existing) return existing;
    if (await this.findLicenseByKey(input.key)) throw new DuplicateKeyError();

    const license: License = {
      id: `lic_${randomUUID()}`,
      key: input.key,
      email: input.email,
      status: "active",
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntent: input.stripePaymentIntent,
      createdAt: new Date(),
      revokedAt: null,
      emailSentAt: null,
    };
    state().licenses.set(license.id, license);
    return clone(license);
  },

  async markEmailSent(licenseId) {
    const license = state().licenses.get(licenseId);
    if (license) license.emailSentAt = new Date();
  },

  async revokeLicense(target: RevokeTarget) {
    let count = 0;
    for (const license of state().licenses.values()) {
      const matches =
        "licenseId" in target
          ? license.id === target.licenseId
          : license.stripePaymentIntent === target.stripePaymentIntent;
      if (matches && license.status !== "revoked") {
        license.status = "revoked";
        license.revokedAt = new Date();
        count++;
      }
    }
    return count;
  },

  async listActivations(licenseId) {
    return state()
      .activations.filter((a) => a.licenseId === licenseId)
      .map(clone);
  },

  async findActivation(licenseId, deviceId) {
    const found = state().activations.find(
      (a) => a.licenseId === licenseId && a.deviceId === deviceId,
    );
    return found ? clone(found) : null;
  },

  // Synchronous body: Node runs it without interleaving, which makes it atomic here.
  async activateDevice({ licenseId, deviceId, deviceName, maxDevices }): Promise<ActivateResult> {
    const all = state().activations;
    const now = new Date();
    const existing = all.find(
      (a) => a.licenseId === licenseId && a.deviceId === deviceId,
    );
    if (existing) {
      existing.deviceName = deviceName;
      existing.lastValidatedAt = now;
      return "ok";
    }
    const count = all.filter((a) => a.licenseId === licenseId).length;
    if (count >= maxDevices) return "limit_reached";
    all.push({ licenseId, deviceId, deviceName, activatedAt: now, lastValidatedAt: now });
    return "ok";
  },

  async removeActivation(licenseId, deviceId) {
    const s = state();
    s.activations = s.activations.filter(
      (a) => !(a.licenseId === licenseId && a.deviceId === deviceId),
    );
  },

  async touchActivation(licenseId, deviceId) {
    const found = state().activations.find(
      (a) => a.licenseId === licenseId && a.deviceId === deviceId,
    );
    if (found) found.lastValidatedAt = new Date();
  },
};
