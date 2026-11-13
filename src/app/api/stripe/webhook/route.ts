import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/fulfill";
import { revokeLicense, getLicenseBySessionId, trackWebhookEvent } from "@/lib/license";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 }
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
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    const alreadyProcessed = await trackWebhookEvent(
      event.id,
      event.type,
      event.type.startsWith("checkout.session") 
        ? (event.data.object as Stripe.Checkout.Session).id 
        : undefined
    );

    if (!alreadyProcessed) {
      console.log(`Webhook event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true, skipped: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === "paid" && session.customer_email) {
          await fulfillOrder(session.id, session.customer_email);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.customer_email) {
          await fulfillOrder(session.id, session.customer_email);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        
        if (charge.metadata?.session_id) {
          const license = await getLicenseBySessionId(charge.metadata.session_id);
          if (license) {
            await revokeLicense(license.key);
          }
        } else if (charge.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            charge.payment_intent as string
          );
          
          if (paymentIntent.metadata?.session_id) {
            const license = await getLicenseBySessionId(paymentIntent.metadata.session_id);
            if (license) {
              await revokeLicense(license.key);
            }
          }
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const charge = dispute.charge;
        
        if (typeof charge === "string") {
          const chargeObj = await stripe.charges.retrieve(charge);
          
          if (chargeObj.metadata?.session_id) {
            const license = await getLicenseBySessionId(chargeObj.metadata.session_id);
            if (license) {
              await revokeLicense(license.key);
            }
          } else if (chargeObj.payment_intent) {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              chargeObj.payment_intent as string
            );
            
            if (paymentIntent.metadata?.session_id) {
              const license = await getLicenseBySessionId(paymentIntent.metadata.session_id);
              if (license) {
                await revokeLicense(license.key);
              }
            }
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook event ${event.id}:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
