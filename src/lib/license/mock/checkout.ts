import { randomBytes } from "node:crypto";
import { getMockBuyerEmail } from "../config";
import type { CheckoutProvider, PaymentEvent } from "../types";

/**
 * Mock checkout: no payment page. It acts as if the buyer paid at once.
 * It sends the same "checkout.completed" event the Stripe webhook would send,
 * through the same fulfillment code, then returns the /thanks URL that
 * Stripe's success_url would return.
 */
export function createMockCheckoutProvider(deps: {
  onCompleted: (event: PaymentEvent) => Promise<void>;
}): CheckoutProvider {
  return {
    async createCheckoutSession({ email }) {
      const id = randomBytes(12).toString("hex");
      const stripeSessionId = `mock_${id}`;

      try {
        await deps.onCompleted({
          type: "checkout.completed",
          stripeSessionId,
          stripePaymentIntent: `pi_mock_${id}`,
          email: email || getMockBuyerEmail(),
          paid: true,
        });
      } catch (error) {
        // Real Stripe fulfills out of band, so a failed webhook never blocks the
        // redirect. The mock behaves the same way.
        console.error("[mock checkout] fulfillment failed:", error);
      }

      return { url: `/thanks?session_id=${stripeSessionId}` };
    },
  };
}
