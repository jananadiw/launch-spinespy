import type Stripe from "stripe";
import type { PaymentEvent } from "../types";

/** Buyer email from Checkout (Stripe Checkout collects this in customer_details). */
export function getCheckoutSessionEmail(
  session: Stripe.Checkout.Session,
): string | null {
  return (
    session.customer_details?.email ??
    session.customer_email ??
    null
  );
}

/** A refund revokes the license only when the whole charge is refunded. */
export function isChargeFullyRefunded(
  charge: Pick<Stripe.Charge, "refunded" | "amount" | "amount_refunded">,
): boolean {
  return (
    charge.refunded === true ||
    (charge.amount > 0 && charge.amount_refunded >= charge.amount)
  );
}

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * Maps a Stripe event to the internal PaymentEvent. Pure: no API calls.
 * Used by the mock webhook and by the signature-verified real webhook.
 */
export function normalizeStripeEvent(event: {
  type: string;
  data: { object: unknown };
}): PaymentEvent {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        type: "checkout.completed",
        stripeSessionId: session.id,
        stripePaymentIntent: idOf(session.payment_intent),
        email: getCheckoutSessionEmail(session),
        // Delayed methods complete with payment_status "unpaid"; fulfill on async_payment_succeeded.
        paid:
          event.type === "checkout.session.async_payment_succeeded" ||
          session.payment_status === "paid",
      };
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      return {
        type: "charge.refunded",
        stripePaymentIntent: idOf(charge.payment_intent),
        fullyRefunded: isChargeFullyRefunded(charge),
      };
    }
    default:
      return { type: "ignored", originalType: event.type };
  }
}
