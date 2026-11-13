import { NextRequest, NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session.customer_email) {
      return NextResponse.json(
        { error: "Session does not have a customer email" },
        { status: 400 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment has not been completed" },
        { status: 400 }
      );
    }

    const licenseKey = await fulfillOrder(session_id, session.customer_email);

    return NextResponse.json({
      success: true,
      license_key: licenseKey,
    });
  } catch (error) {
    console.error("Fulfill error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fulfill order",
      },
      { status: 500 }
    );
  }
}
