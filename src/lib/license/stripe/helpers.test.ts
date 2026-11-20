import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { NextRequest } from "next/server";
import {
  getCheckoutSessionEmail,
  isChargeFullyRefunded,
  normalizeStripeEvent,
  resolveSiteOrigin,
} from "./helpers";

describe("getCheckoutSessionEmail", () => {
  it("prefers customer_details.email", () => {
    const session = {
      customer_details: { email: "buyer@example.com" },
      customer_email: "legacy@example.com",
    } as Stripe.Checkout.Session;

    expect(getCheckoutSessionEmail(session)).toBe("buyer@example.com");
  });

  it("falls back to customer_email", () => {
    const session = {
      customer_email: "legacy@example.com",
    } as Stripe.Checkout.Session;

    expect(getCheckoutSessionEmail(session)).toBe("legacy@example.com");
  });
});

describe("resolveSiteOrigin", () => {
  it("uses NEXT_PUBLIC_SITE_URL when set", () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.spinespy.com/";
    const request = new NextRequest("http://ignored", {
      headers: { host: "localhost:3000" },
    });
    expect(resolveSiteOrigin(request)).toBe("https://www.spinespy.com");
    process.env.NEXT_PUBLIC_SITE_URL = prev;
  });

  it("derives origin from forwarded headers when env is unset", () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const request = new NextRequest("http://ignored", {
      headers: {
        "x-forwarded-host": "www.spinespy.com",
        "x-forwarded-proto": "https",
      },
    });
    expect(resolveSiteOrigin(request)).toBe("https://www.spinespy.com");
    process.env.NEXT_PUBLIC_SITE_URL = prev;
  });
});

describe("isChargeFullyRefunded", () => {
  it("ignores partial refunds", () => {
    expect(isChargeFullyRefunded({ amount: 999, amount_refunded: 100, refunded: false })).toBe(false);
  });

  it("accepts the refunded flag or a full amount", () => {
    expect(isChargeFullyRefunded({ amount: 999, amount_refunded: 100, refunded: true })).toBe(true);
    expect(isChargeFullyRefunded({ amount: 999, amount_refunded: 999, refunded: false })).toBe(true);
  });
});

describe("normalizeStripeEvent", () => {
  it("maps a paid checkout.session.completed", () => {
    const event = normalizeStripeEvent({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_1",
          payment_intent: "pi_1",
          payment_status: "paid",
          customer_details: { email: "a@example.com" },
        },
      },
    });
    expect(event).toEqual({
      type: "checkout.completed",
      stripeSessionId: "cs_1",
      stripePaymentIntent: "pi_1",
      email: "a@example.com",
      paid: true,
    });
  });

  it("marks delayed payments unpaid until async_payment_succeeded", () => {
    const object = { id: "cs_2", payment_intent: null, payment_status: "unpaid", customer_email: "b@example.com" };
    expect(normalizeStripeEvent({ type: "checkout.session.completed", data: { object } })).toMatchObject({ paid: false });
    expect(
      normalizeStripeEvent({ type: "checkout.session.async_payment_succeeded", data: { object } }),
    ).toMatchObject({ paid: true, stripeSessionId: "cs_2" });
  });

  it("maps charge.refunded with an expanded payment_intent", () => {
    const event = normalizeStripeEvent({
      type: "charge.refunded",
      data: { object: { payment_intent: { id: "pi_3" }, amount: 999, amount_refunded: 999, refunded: true } },
    });
    expect(event).toEqual({ type: "charge.refunded", stripePaymentIntent: "pi_3", fullyRefunded: true });
  });

  it("ignores other events", () => {
    expect(normalizeStripeEvent({ type: "invoice.paid", data: { object: {} } })).toEqual({
      type: "ignored",
      originalType: "invoice.paid",
    });
  });
});
