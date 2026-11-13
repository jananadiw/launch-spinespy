import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST() {
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    return NextResponse.json(
      {
        error: "Stripe is not configured. Please try again later.",
        code: "STRIPE_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
    });

    const idempotencyKey = `checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`;

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
        success_url: `${NEXT_PUBLIC_SITE_URL}/thanks?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${NEXT_PUBLIC_SITE_URL}/pricing`,
        billing_address_collection: "auto",
      },
      {
        idempotencyKey,
      }
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session", code: "NO_SESSION_URL" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create checkout session",
        code: "CHECKOUT_ERROR",
      },
      { status: 500 }
    );
  }
}
