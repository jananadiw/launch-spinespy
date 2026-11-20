import Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigError, WebhookVerificationError } from "../types";
import { createStripeCheckoutProvider } from "./checkout";
import type { StripeLike } from "./client";
import { createStripeWebhookProvider } from "./webhook";

beforeEach(() => {
  vi.stubEnv("STRIPE_PRICE_ID", "price_123");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.spinespy.com/");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test_secret");
  vi.stubEnv("DATABASE_URL", "postgresql://test");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("LICENSE_FROM_EMAIL", "hello@spinespy.com");
});
afterEach(() => vi.unstubAllEnvs());

function fakeStripe(session: Partial<Stripe.Checkout.Session>) {
  const create = vi.fn().mockResolvedValue({ id: "cs_1", ...session });
  const stripe = { checkout: { sessions: { create } } } as unknown as StripeLike;
  return { stripe, create };
}

describe("stripe checkout provider", () => {
  it("creates a managed-payments session for the price", async () => {
    const { stripe, create } = fakeStripe({ url: "https://checkout.stripe.com/c/pay/cs_1" });
    const provider = createStripeCheckoutProvider(() => stripe);

    await expect(provider.createCheckoutSession({})).resolves.toEqual({
      url: "https://checkout.stripe.com/c/pay/cs_1",
    });
    expect(create).toHaveBeenCalledWith({
      mode: "payment",
      line_items: [{ price: "price_123", quantity: 1 }],
      managed_payments: { enabled: true },
      success_url: "https://www.spinespy.com/thanks?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://www.spinespy.com",
    });
  });

  it("passes deviceId and email when present", async () => {
    const { stripe, create } = fakeStripe({ url: "https://checkout.stripe.com/x" });
    await createStripeCheckoutProvider(() => stripe).createCheckoutSession({
      deviceId: "mac-1",
      email: "a@example.com",
    });
    expect(create.mock.calls[0][0]).toMatchObject({
      client_reference_id: "mac-1",
      customer_email: "a@example.com",
    });
  });

  it("fails without a session URL or a price", async () => {
    const { stripe } = fakeStripe({ url: null });
    await expect(createStripeCheckoutProvider(() => stripe).createCheckoutSession({})).rejects.toThrow(
      "has no URL",
    );
    vi.stubEnv("STRIPE_PRICE_ID", "");
    await expect(createStripeCheckoutProvider(() => stripe).createCheckoutSession({})).rejects.toBeInstanceOf(
      ConfigError,
    );
  });
});

describe("stripe checkout preflight", () => {
  it.each(["STRIPE_WEBHOOK_SECRET", "DATABASE_URL", "RESEND_API_KEY", "LICENSE_FROM_EMAIL"])(
    "refuses to start checkout without %s",
    async (name) => {
      vi.stubEnv(name, "");
      const { stripe, create } = fakeStripe({ url: "https://checkout.stripe.com/x" });
      await expect(createStripeCheckoutProvider(() => stripe).createCheckoutSession({})).rejects.toBeInstanceOf(
        ConfigError,
      );
      expect(create).not.toHaveBeenCalled();
    },
  );
});

describe("stripe webhook provider", () => {
  // Real SDK crypto, no network.
  const stripe = new Stripe("sk_test_unused");
  const provider = createStripeWebhookProvider(() => stripe);
  const payload = JSON.stringify({
    id: "evt_1",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        payment_intent: "pi_1",
        payment_status: "paid",
        customer_details: { email: "buyer@example.com" },
      },
    },
  });
  const sign = (body: string, secret = "whsec_test_secret") =>
    stripe.webhooks.generateTestHeaderString({ payload: body, secret });

  it("verifies the signature and maps the event", async () => {
    await expect(provider.parseEvent(payload, sign(payload))).resolves.toEqual({
      type: "checkout.completed",
      stripeSessionId: "cs_1",
      stripePaymentIntent: "pi_1",
      email: "buyer@example.com",
      paid: true,
    });
  });

  it("rejects a missing, wrong, or tampered signature", async () => {
    await expect(provider.parseEvent(payload, null)).rejects.toBeInstanceOf(WebhookVerificationError);
    await expect(provider.parseEvent(payload, sign(payload, "whsec_other"))).rejects.toBeInstanceOf(
      WebhookVerificationError,
    );
    const tampered = payload.replace("buyer@", "attacker@");
    await expect(provider.parseEvent(tampered, sign(payload))).rejects.toBeInstanceOf(
      WebhookVerificationError,
    );
  });

  it("needs STRIPE_WEBHOOK_SECRET", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
    await expect(provider.parseEvent(payload, sign(payload))).rejects.toBeInstanceOf(ConfigError);
  });
});
