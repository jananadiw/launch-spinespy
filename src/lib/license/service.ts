import * as core from "./core";
import { getProviders } from "./providers";
import type {
  ActivateStatus,
  CheckoutInput,
  PaymentEvent,
  RevokeTarget,
  ValidateStatus,
} from "./types";

/**
 * Public licensing API. Route handlers import only from here.
 * Each call resolves mock or real providers from USE_MOCKS.
 */

export function createCheckoutSession(input: CheckoutInput): Promise<{ url: string }> {
  return getProviders().checkout.createCheckoutSession(input);
}

/** Idempotent on stripeSessionId. */
export async function createLicense(input: {
  email: string;
  stripeSessionId: string;
  stripePaymentIntent?: string | null;
}): Promise<{ key: string }> {
  const license = await core.createLicense(getProviders(), input);
  return { key: license.key };
}

export function sendLicenseEmail(input: { email: string; key: string }): Promise<void> {
  return core.sendLicenseEmail(getProviders(), input);
}

export async function revokeLicense(target: RevokeTarget): Promise<void> {
  await core.revokeLicense(getProviders(), target);
}

export function parseWebhookEvent(rawBody: string, signature: string | null): Promise<PaymentEvent> {
  return getProviders().webhook.parseEvent(rawBody, signature);
}

export function handlePaymentEvent(event: PaymentEvent): Promise<void> {
  return core.handlePaymentEvent(getProviders(), event);
}

export function activateLicense(input: {
  key: string;
  deviceId: string;
  deviceName: string;
}): Promise<ActivateStatus> {
  return core.activateLicense(getProviders(), input);
}

export function deactivateLicense(input: { key: string; deviceId: string }): Promise<"ok"> {
  return core.deactivateLicense(getProviders(), input);
}

export function validateLicense(input: { key: string; deviceId: string }): Promise<ValidateStatus> {
  return core.validateLicense(getProviders(), input);
}

export function resendLicenseEmails(email: string): Promise<void> {
  return core.resendLicenseEmails(getProviders(), email);
}
