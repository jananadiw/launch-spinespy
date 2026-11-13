import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/fulfill";
import {
  claimWebhookEvent,
  releaseWebhookEvent,
  revokeLicense,
} from "@/lib/license";
import { findLicenseForCharge } from "@/lib/stripe-refunds";
import { getCheckoutSessionEmail } from "@/lib/stripe-session";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  const email = getCheckoutSessionEmail(session);
  if (!email) {
    throw new Error(
      `Checkout session ${session.id} is paid but has no customer email`,
    );
  }
  await fulfillOrder(session.id, email);
}

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
  });

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sessionIdForClaim = event.type.startsWith("checkout.session")
    ? (event.data.object as Stripe.Checkout.Session).id
  : undefined;

  const isNewEvent = await claimWebhookEvent(
    event.id,
    event.type,
    sessionIdForClaim,
  );

  if (!isNewEvent) {
    console.log(`Webhook event ${event.id} already processed, skipping`);
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await fulfillCheckoutSession(session);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckoutSession(session);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const license = await findLicenseForCharge(stripe, charge);
        if (license) {
          await revokeLicense(license.key);
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const chargeId =
          typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
        if (!chargeId) {
          break;
        }
        const chargeObj = await stripe.charges.retrieve(chargeId);
        const license = await findLicenseForCharge(stripe, chargeObj);
        if (license) {
          await revokeLicense(license.key);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook event ${event.id}:`, error);
    await releaseWebhookEvent(event.id);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
