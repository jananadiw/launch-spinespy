import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveSiteOrigin } from "@/lib/stripe-session";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

async function createCheckoutResponse(request: NextRequest): Promise<NextResponse> {
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    return NextResponse.json(
      {
        error: "Stripe is not configured. Please try again later.",
        code: "STRIPE_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  try {
    const siteOrigin = resolveSiteOrigin(request);
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
    });

    const idempotencyKey = `checkout_${randomBytes(16).toString("hex")}`;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        automatic_tax: {
          enabled: true,
        },
        success_url: `${siteOrigin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteOrigin}/pricing`,
        billing_address_collection: "auto",
        customer_creation: "always",
      },
      {
        idempotencyKey,
      },
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session", code: "NO_SESSION_URL" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
        code: "CHECKOUT_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return createCheckoutResponse(request);
}

/** Convenience for mistaken GET navigations; prefer POST forms in the UI. */
export async function GET(request: NextRequest) {
  return createCheckoutResponse(request);
}
