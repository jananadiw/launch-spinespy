import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveSiteOrigin } from "@/lib/stripe-session";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
};

async function createCheckoutResponse(request: NextRequest): Promise<NextResponse> {
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    return NextResponse.json(
      {
        error: "Stripe is not configured. Please try again later.",
        code: "STRIPE_NOT_CONFIGURED",
      },
      { status: 503, headers: NOINDEX_HEADERS },
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
        { status: 500, headers: NOINDEX_HEADERS },
      );
    }

    const response = NextResponse.redirect(session.url, 303);
    for (const [key, value] of Object.entries(NOINDEX_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
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
      { status: 500, headers: NOINDEX_HEADERS },
    );
  }
}

export async function POST(request: NextRequest) {
  return createCheckoutResponse(request);
}

/** No side effects: send humans to pricing so checkout only happens via POST. */
export async function GET(request: NextRequest) {
  const pricingUrl = new URL("/pricing#pro", request.url);
  const response = NextResponse.redirect(pricingUrl, 307);
  for (const [key, value] of Object.entries(NOINDEX_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}
