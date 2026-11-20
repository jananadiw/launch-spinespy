import type { NextRequest } from "next/server";
import { json } from "@/lib/license/http";
import { handlePaymentEvent, parseWebhookEvent } from "@/lib/license/service";
import { ConfigError, WebhookVerificationError } from "@/lib/license/types";

/**
 * Stripe webhook.
 *   checkout.session.completed (paid) and checkout.session.async_payment_succeeded
 *     -> createLicense, then sendLicenseEmail. Idempotent on the session id.
 *   charge.refunded (full refund) -> revokeLicense by payment intent.
 *
 * Real mode verifies the Stripe signature on the raw body.
 * Mock mode accepts unsigned Stripe-shaped JSON (dev only). Mock checkout
 * calls the same handlePaymentEvent directly, so both paths share fulfillment.
 *
 * TODO: Disputes are not handled. With managed payments Stripe handles disputes
 * itself; the docs don't say whether charge.dispute.created reaches this
 * account. Check in the sandbox, then decide whether a lost dispute revokes.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = await parseWebhookEvent(rawBody, signature);
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error("Webhook not configured:", error.message);
      return json({ error: "Webhook is not configured" }, 500);
    }
    if (error instanceof WebhookVerificationError) {
      console.warn("Webhook rejected:", error.message);
      return json({ error: "Invalid webhook" }, 400);
    }
    throw error;
  }

  try {
    await handlePaymentEvent(event);
    return json({ received: true });
  } catch (error) {
    // 500 makes Stripe retry. Fulfillment is idempotent, so retries are safe.
    console.error(`Webhook handling failed for ${event.type}:`, error);
    return json({ error: "Webhook processing failed" }, 500);
  }
}
