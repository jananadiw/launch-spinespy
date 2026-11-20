import { PRODUCTION_SITE_URL } from "@/lib/site";
import { ConfigError } from "./types";

/**
 * USE_MOCKS="true" or "false" always wins.
 * Unset: mocks everywhere except Vercel Production, so the live site never
 * shows a fake purchase.
 */
export function isMockMode(): boolean {
  const value = process.env.USE_MOCKS?.trim().toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;
  return process.env.VERCEL_ENV !== "production";
}

/** The dev outbox page (/dev/emails) runs only with mocks, outside production builds. */
export function isDevOutboxEnabled(): boolean {
  return isMockMode() && process.env.NODE_ENV !== "production";
}

/** Buyer email for mock checkout when the request has none. */
export function getMockBuyerEmail(): string {
  return process.env.MOCK_BUYER_EMAIL?.trim() || "buyer@example.com";
}

/** Reads a required env var in real mode. Throws ConfigError (routes answer 503/500). */
export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new ConfigError(`${name} is not set`);
  return value;
}

/**
 * Public origin for Stripe success/cancel URLs.
 * NEXT_PUBLIC_SITE_URL, else the production domain on Vercel Production,
 * else the deployment URL on previews, else localhost in dev.
 */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  throw new ConfigError("NEXT_PUBLIC_SITE_URL is not set");
}
