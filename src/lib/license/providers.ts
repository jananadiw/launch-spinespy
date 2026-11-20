import { isMockMode } from "./config";
import { handlePaymentEvent } from "./core";
import { createMockCheckoutProvider } from "./mock/checkout";
import { mockEmailProvider } from "./mock/email";
import { mockLicenseStore } from "./mock/store";
import { mockWebhookProvider } from "./mock/webhook";
import { postgresLicenseStore } from "./postgres/store";
import { resendEmailProvider } from "./resend/email";
import { stripeCheckoutProvider } from "./stripe/checkout";
import { stripeWebhookProvider } from "./stripe/webhook";
import type { Providers } from "./types";

/** Mock providers. Checkout runs the same fulfillment the webhook runs. */
export function createMockProviders(): Providers {
  const providers: Providers = {
    mode: "mock",
    store: mockLicenseStore,
    email: mockEmailProvider,
    webhook: mockWebhookProvider,
    checkout: createMockCheckoutProvider({
      onCompleted: (event) => handlePaymentEvent(providers, event),
    }),
  };
  return providers;
}

const realProviders: Providers = {
  mode: "real",
  store: postgresLicenseStore,
  email: resendEmailProvider,
  webhook: stripeWebhookProvider,
  checkout: stripeCheckoutProvider,
};

let mockProviders: Providers | null = null;

/** Picks providers from USE_MOCKS on every call, so an env change needs no code change. */
export function getProviders(): Providers {
  if (!isMockMode()) return realProviders;
  mockProviders ??= createMockProviders();
  return mockProviders;
}
