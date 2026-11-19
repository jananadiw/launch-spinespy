import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { NextRequest } from "next/server";
import {
  getCheckoutSessionEmail,
  resolveSiteOrigin,
} from "./stripe-session";

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
