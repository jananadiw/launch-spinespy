import { requireEnv } from "../config";
import { WebhookVerificationError, type WebhookProvider } from "../types";
import { getStripe, type StripeLike } from "./client";
import { normalizeStripeEvent } from "./helpers";

/**
 * Real Stripe webhook. Verifies the signature on the raw body (the route
 * passes request.text() untouched), then maps the event.
 *
 * Register the endpoint for: checkout.session.completed,
 * checkout.session.async_payment_succeeded, charge.refunded.
 */
export function createStripeWebhookProvider(
  stripe: () => StripeLike = getStripe,
): WebhookProvider {
  return {
    async parseEvent(rawBody, signature) {
      if (!signature) throw new WebhookVerificationError("Missing stripe-signature header");
      const secret = requireEnv("STRIPE_WEBHOOK_SECRET");

      let event;
      try {
        event = stripe().webhooks.constructEvent(rawBody, signature, secret);
      } catch (error) {
        throw new WebhookVerificationError(
          error instanceof Error ? error.message : "Signature check failed",
        );
      }
      return normalizeStripeEvent(event);
    },
  };
}

export const stripeWebhookProvider = createStripeWebhookProvider();
