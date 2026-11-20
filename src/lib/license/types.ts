/**
 * Licensing domain types and the provider interfaces that Phase 2 implements.
 *
 * Mock and real providers implement the same interfaces. Route handlers and
 * pages only talk to `service.ts`, so swapping providers changes no flow or UI.
 */

export type LicenseStatus = "active" | "revoked";

export interface License {
  id: string;
  key: string;
  email: string;
  status: LicenseStatus;
  stripeSessionId: string;
  stripePaymentIntent: string | null;
  createdAt: Date;
  revokedAt: Date | null;
  /** Set after the license email is sent. Lets webhook retries skip a second send. */
  emailSentAt: Date | null;
}

export interface Activation {
  licenseId: string;
  deviceId: string;
  deviceName: string;
  activatedAt: Date;
  lastValidatedAt: Date;
}

/* ---------- License API contract for the Mac app (mock and real) ---------- */

export type ActivateStatus = "ok" | "invalid" | "revoked" | "limit_reached";
export type DeactivateStatus = "ok";
export type ValidateStatus = "active" | "revoked" | "invalid" | "not_activated";

/* ------------------------------ Providers -------------------------------- */

export interface CheckoutInput {
  deviceId?: string;
  email?: string;
}

export interface CheckoutProvider {
  /** Returns the URL the browser goes to next (Stripe Checkout, or /thanks in mock mode). */
  createCheckoutSession(input: CheckoutInput): Promise<{ url: string }>;
}

export interface EmailProvider {
  sendLicenseEmail(input: { email: string; key: string }): Promise<void>;
}

export interface NewLicense {
  key: string;
  email: string;
  stripeSessionId: string;
  stripePaymentIntent: string | null;
}

export type RevokeTarget =
  | { stripePaymentIntent: string }
  | { licenseId: string };

export type ActivateResult = "ok" | "limit_reached";

/**
 * Persistence for licenses and activations.
 * Mock: in-memory. Phase 2: Postgres (Neon), see db/schema.sql.
 */
export interface LicenseStore {
  findLicenseByKey(key: string): Promise<License | null>;
  findLicenseBySessionId(stripeSessionId: string): Promise<License | null>;
  /** Active and revoked licenses for an email (case-insensitive). */
  findLicensesByEmail(email: string): Promise<License[]>;

  /**
   * Inserts a license unless one already exists for `stripeSessionId`.
   * Must be atomic (Postgres: unique stripe_session_id + ON CONFLICT DO NOTHING).
   * Returns the stored license either way. Throws `DuplicateKeyError` on a key collision.
   */
  insertLicenseIfAbsent(input: NewLicense): Promise<License>;
  markEmailSent(licenseId: string): Promise<void>;
  /** Returns the number of licenses revoked. */
  revokeLicense(target: RevokeTarget): Promise<number>;

  listActivations(licenseId: string): Promise<Activation[]>;
  findActivation(licenseId: string, deviceId: string): Promise<Activation | null>;
  /**
   * Adds or refreshes an activation while holding the device limit.
   * Must be atomic per license (Postgres: transaction + advisory lock).
   * Re-activating an existing device returns "ok" and updates its name.
   */
  activateDevice(input: {
    licenseId: string;
    deviceId: string;
    deviceName: string;
    maxDevices: number;
  }): Promise<ActivateResult>;
  removeActivation(licenseId: string, deviceId: string): Promise<void>;
  touchActivation(licenseId: string, deviceId: string): Promise<void>;
}

/** Payment events, already verified and normalized from the provider's format. */
export type PaymentEvent =
  | {
      type: "checkout.completed";
      stripeSessionId: string;
      stripePaymentIntent: string | null;
      email: string | null;
      /** False for delayed payment methods until async_payment_succeeded arrives. */
      paid: boolean;
    }
  | {
      type: "charge.refunded";
      stripePaymentIntent: string | null;
      fullyRefunded: boolean;
    }
  | { type: "ignored"; originalType: string };

export interface WebhookProvider {
  /**
   * Verifies and parses a raw webhook body.
   * Real: Stripe signature check on the raw body. Mock: plain JSON, no signature.
   * Throws `WebhookVerificationError` when the body cannot be trusted.
   */
  parseEvent(rawBody: string, signature: string | null): Promise<PaymentEvent>;
}

export interface Providers {
  mode: "mock" | "real";
  checkout: CheckoutProvider;
  email: EmailProvider;
  store: LicenseStore;
  webhook: WebhookProvider;
}

export class DuplicateKeyError extends Error {
  constructor() {
    super("License key already exists");
    this.name = "DuplicateKeyError";
  }
}

export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookVerificationError";
  }
}

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet (Phase 2). Set USE_MOCKS=true.`);
    this.name = "NotImplementedError";
  }
}
