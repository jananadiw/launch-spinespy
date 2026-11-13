import type Stripe from "stripe";
import { getLicenseBySessionId, type License } from "./license";

export async function findLicenseForCharge(
  stripe: Stripe,
  charge: Stripe.Charge,
): Promise<License | null> {
  if (charge.metadata?.session_id) {
    return getLicenseBySessionId(charge.metadata.session_id);
  }

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) {
    return null;
  }

  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntentId,
    limit: 1,
  });

  const sessionId = sessions.data[0]?.id;
  if (!sessionId) {
    return null;
  }

  return getLicenseBySessionId(sessionId);
}
