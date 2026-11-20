import { normalizeStripeEvent } from "../stripe/helpers";
import { WebhookVerificationError, type WebhookProvider } from "../types";

/**
 * Mock webhook: accepts an unsigned Stripe-shaped JSON event, so refunds and
 * retries can be tested with curl. Refused in production builds.
 *
 *   curl -X POST localhost:3000/api/stripe/webhook -d \
 *     '{"type":"charge.refunded","data":{"object":{"payment_intent":"pi_mock_…","refunded":true,"amount":999,"amount_refunded":999}}}'
 */
export const mockWebhookProvider: WebhookProvider = {
  async parseEvent(rawBody) {
    if (process.env.NODE_ENV === "production") {
      throw new WebhookVerificationError("Unsigned mock webhooks are disabled in production");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new WebhookVerificationError("Body is not JSON");
    }

    const event = parsed as { type?: unknown; data?: { object?: unknown } };
    if (typeof event.type !== "string" || !event.data?.object) {
      throw new WebhookVerificationError("Expected { type, data: { object } }");
    }

    return normalizeStripeEvent({ type: event.type, data: { object: event.data.object } });
  },
};
