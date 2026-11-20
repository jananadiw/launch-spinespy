import { MAX_ACTIVATIONS } from "@/lib/site";
import { generateLicenseKey } from "./key";
import {
  DuplicateKeyError,
  type ActivateStatus,
  type License,
  type PaymentEvent,
  type Providers,
  type RevokeTarget,
  type ValidateStatus,
} from "./types";

/**
 * Licensing rules. Every function takes its providers as an argument, so the
 * same code runs on mocks, on real providers, and in tests.
 * Route handlers call the bound versions in ./service.
 */

const KEY_ATTEMPTS = 5;

/** Idempotent on stripeSessionId: a second call returns the first license. */
export async function createLicense(
  p: Providers,
  input: { email: string; stripeSessionId: string; stripePaymentIntent?: string | null },
): Promise<License> {
  const existing = await p.store.findLicenseBySessionId(input.stripeSessionId);
  if (existing) return existing;

  for (let attempt = 0; attempt < KEY_ATTEMPTS; attempt++) {
    try {
      return await p.store.insertLicenseIfAbsent({
        key: generateLicenseKey(),
        email: input.email.trim(),
        stripeSessionId: input.stripeSessionId,
        stripePaymentIntent: input.stripePaymentIntent ?? null,
      });
    } catch (error) {
      if (error instanceof DuplicateKeyError) continue;
      throw error;
    }
  }
  throw new Error("Could not generate a unique license key");
}

export async function sendLicenseEmail(
  p: Providers,
  input: { email: string; key: string },
): Promise<void> {
  await p.email.sendLicenseEmail(input);
}

export async function revokeLicense(p: Providers, target: RevokeTarget): Promise<number> {
  return p.store.revokeLicense(target);
}

/**
 * Creates the license and emails it once per checkout session.
 * Safe to call again for the same session (webhook retries, async_payment_succeeded
 * after completed): it reuses the license and skips the email if it was sent.
 */
export async function fulfillCheckout(
  p: Providers,
  input: { stripeSessionId: string; stripePaymentIntent: string | null; email: string },
): Promise<License> {
  const license = await createLicense(p, input);
  if (!license.emailSentAt) {
    // Throws on failure so the webhook returns 500 and Stripe retries the send.
    await sendLicenseEmail(p, { email: license.email, key: license.key });
    await p.store.markEmailSent(license.id);
  }
  return license;
}

export async function handlePaymentEvent(p: Providers, event: PaymentEvent): Promise<void> {
  switch (event.type) {
    case "checkout.completed": {
      if (!event.paid) return; // Wait for checkout.session.async_payment_succeeded.
      if (!event.email) {
        throw new Error(`Checkout session ${event.stripeSessionId} is paid but has no email`);
      }
      await fulfillCheckout(p, {
        stripeSessionId: event.stripeSessionId,
        stripePaymentIntent: event.stripePaymentIntent,
        email: event.email,
      });
      return;
    }
    case "charge.refunded": {
      if (!event.fullyRefunded || !event.stripePaymentIntent) return;
      await revokeLicense(p, { stripePaymentIntent: event.stripePaymentIntent });
      return;
    }
    case "ignored":
      return;
  }
}

/* ---------------------------- Mac app license API ---------------------------- */

export async function activateLicense(
  p: Providers,
  input: { key: string; deviceId: string; deviceName: string },
): Promise<ActivateStatus> {
  const license = await p.store.findLicenseByKey(input.key);
  if (!license) return "invalid";
  if (license.status === "revoked") return "revoked";

  return p.store.activateDevice({
    licenseId: license.id,
    deviceId: input.deviceId,
    deviceName: input.deviceName,
    maxDevices: MAX_ACTIVATIONS,
  });
}

/** Always "ok": deactivating an unknown key or device is a no-op. */
export async function deactivateLicense(
  p: Providers,
  input: { key: string; deviceId: string },
): Promise<"ok"> {
  const license = await p.store.findLicenseByKey(input.key);
  if (license) await p.store.removeActivation(license.id, input.deviceId);
  return "ok";
}

export async function validateLicense(
  p: Providers,
  input: { key: string; deviceId: string },
): Promise<ValidateStatus> {
  const license = await p.store.findLicenseByKey(input.key);
  if (!license) return "invalid";
  if (license.status === "revoked") return "revoked";

  const activation = await p.store.findActivation(license.id, input.deviceId);
  if (!activation) return "not_activated";

  await p.store.touchActivation(license.id, input.deviceId);
  return "active";
}

/**
 * Resends every active key bought with this email. Returns nothing on purpose:
 * callers must not reveal whether the email has a purchase.
 */
export async function resendLicenseEmails(p: Providers, email: string): Promise<void> {
  const licenses = await p.store.findLicensesByEmail(email);
  for (const license of licenses) {
    if (license.status !== "active") continue;
    await sendLicenseEmail(p, { email: license.email, key: license.key });
  }
}
