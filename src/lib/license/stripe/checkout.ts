import type Stripe from "stripe";
import { getSiteOrigin, requireEnv } from "../config";
import type { CheckoutProvider } from "../types";
import { getStripe, type StripeLike } from "./client";

/**
 * Real Stripe Checkout with managed payments (Stripe is merchant of record and
 * handles tax). Managed payments forbids automatic_tax and payment_method_types,
 * so neither is set. The product behind STRIPE_PRICE_ID needs an eligible
 * digital-goods tax code (e.g. txcd_10202000, downloadable software).
 *
 * Fulfillment happens in the webhook, never here.
 */
export function buildCheckoutParams(input: {
  priceId: string;
  siteOrigin: string;
  deviceId?: string;
  email?: string;
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [{ price: input.priceId, quantity: 1 }],
    managed_payments: { enabled: true },
    success_url: `${input.siteOrigin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: input.siteOrigin,
    ...(input.deviceId ? { client_reference_id: input.deviceId } : {}),
    ...(input.email ? { customer_email: input.email } : {}),
  };
}

/**
 * Everything fulfillment needs after payment. Checkout refuses to start without
 * them, so nobody can pay when the key cannot be stored or emailed.
 */
const FULFILLMENT_ENV = ["STRIPE_WEBHOOK_SECRET", "DATABASE_URL", "RESEND_API_KEY", "LICENSE_FROM_EMAIL"];

export function createStripeCheckoutProvider(
  stripe: () => StripeLike = getStripe,
): CheckoutProvider {
  return {
    async createCheckoutSession({ deviceId, email }) {
      FULFILLMENT_ENV.forEach(requireEnv);
      const params = buildCheckoutParams({
        priceId: requireEnv("STRIPE_PRICE_ID"),
        siteOrigin: getSiteOrigin(),
        deviceId,
        email,
      });
      const session = await stripe().checkout.sessions.create(params);
      if (!session.url) throw new Error(`Checkout session ${session.id} has no URL`);
      return { url: session.url };
    },
  };
}

export const stripeCheckoutProvider = createStripeCheckoutProvider();
