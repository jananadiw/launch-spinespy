import { NotImplementedError, type CheckoutProvider } from "../types";

/**
 * Real Stripe Checkout. Phase 2.
 *
 * TODO(phase2): Implement with the `stripe` SDK (already a dependency):
 *   - new Stripe(process.env.STRIPE_SECRET_KEY)
 *   - stripe.checkout.sessions.create({
 *       mode: "payment",
 *       line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
 *       // Managed payments (Stripe as merchant of record, handles tax).
 *       // Check the current API version and parameter name in the Stripe docs
 *       // before shipping; the SDK may need a preview apiVersion for it.
 *       success_url: `${SITE_URL}/thanks?session_id={CHECKOUT_SESSION_ID}`,
 *       cancel_url: SITE_URL,
 *       client_reference_id: input.deviceId,   // only when present
 *       customer_email: input.email,           // only when present
 *     })
 *   - SITE_URL: NEXT_PUBLIC_SITE_URL. `resolveSiteOrigin` in ./helpers already
 *     handles this, but it needs a request; pass the origin in or read the env.
 *   - Throw if session.url is null. Return { url: session.url }.
 *   - Do not fulfill here. The webhook fulfills.
 */
export const stripeCheckoutProvider: CheckoutProvider = {
  async createCheckoutSession() {
    throw new NotImplementedError("Stripe checkout");
  },
};
