import Stripe from "stripe";
import { requireEnv } from "../config";

let client: Stripe | null = null;
let clientKey: string | null = null;

/**
 * Lazily built Stripe client. Uses the SDK's pinned API version
 * (stripe@23: 2026-10-28.endive), which supports managed payments.
 */
export function getStripe(): Stripe {
  const key = requireEnv("STRIPE_SECRET_KEY");
  if (!client || clientKey !== key) {
    client = new Stripe(key);
    clientKey = key;
  }
  return client;
}

/** The subset of the SDK the providers use, so tests can pass a fake. */
export type StripeLike = Pick<Stripe, "checkout" | "webhooks">;
