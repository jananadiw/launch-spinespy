import type Stripe from "stripe";
import type { NextRequest } from "next/server";
import { PRODUCTION_SITE_URL } from "@/lib/site";
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

/**
 * Public site origin for Stripe success/cancel URLs.
 * Prefers NEXT_PUBLIC_SITE_URL, then the incoming request origin on Vercel previews.
 * Never silently falls back to localhost in production.
 */
export function resolveSiteOrigin(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    request.headers.get("host")?.trim();

  if (host) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      (host.includes("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    const origin = `${proto}://${host}`.replace(/\/$/, "");

    const isLocal =
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.endsWith(".local");

    if (isLocal && process.env.NODE_ENV !== "development") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be set in non-development deployments (refusing localhost fallback).",
      );
    }

    return origin;
  }

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "Set NEXT_PUBLIC_SITE_URL or send a Host header (e.g. next dev on localhost).",
    );
  }

  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not set and the request origin could not be determined.",
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
 * Used by the mock webhook now and by the signature-verified webhook in Phase 2.
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
