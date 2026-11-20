import type { NextRequest } from "next/server";
import { json } from "@/lib/license/http";
import { handlePaymentEvent, parseWebhookEvent } from "@/lib/license/service";
import { NotImplementedError, WebhookVerificationError } from "@/lib/license/types";

/**
 * Stripe webhook.
 *   checkout.session.completed (paid) and checkout.session.async_payment_succeeded
 *     -> createLicense, then sendLicenseEmail. Idempotent on the session id.
 *   charge.refunded (full refund) -> revokeLicense by payment intent.
 *
 * Mock mode: accepts unsigned Stripe-shaped JSON (dev only). Mock checkout
 * calls the same handlePaymentEvent directly, so both paths share fulfillment.
 *
 * TODO(phase2): Real signature check lives in lib/license/stripe/webhook.ts.
 *   This route already reads the raw body, which the check needs.
 * TODO(phase2): Decide whether charge.dispute.created should also revoke
 *   (the previous backend did). Add it to normalizeStripeEvent if so.
 * TODO(phase2): Confirm which refund events Stripe managed payments sends to
 *   this account, and that charge.payment_intent matches the session's.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = await parseWebhookEvent(rawBody, signature);
  } catch (error) {
    if (error instanceof NotImplementedError) {
      return json({ error: "Webhook is not configured" }, 501);
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
