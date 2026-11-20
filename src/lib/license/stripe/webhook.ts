import { NotImplementedError, type WebhookProvider } from "../types";

/**
 * Real Stripe webhook verification. Phase 2.
 *
 * TODO(phase2): Implement:
 *   - If `signature` is null, throw WebhookVerificationError("Missing stripe-signature").
 *   - const event = new Stripe(STRIPE_SECRET_KEY).webhooks.constructEvent(
 *       rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
 *     The route already passes the raw body (request.text()), which the
 *     signature check needs. Never JSON.parse before verifying.
 *   - Wrap constructEvent errors in WebhookVerificationError (route returns 400).
 *   - return normalizeStripeEvent(event)   // from ./helpers
 *   - Register the endpoint in Stripe for: checkout.session.completed,
 *     checkout.session.async_payment_succeeded, charge.refunded.
 */
export const stripeWebhookProvider: WebhookProvider = {
  async parseEvent() {
    throw new NotImplementedError("Stripe webhook verification");
  },
};
