/**
 * USE_MOCKS="true" or "false" always wins.
 * Unset: mocks everywhere except Vercel Production, so the live site never
 * shows a fake purchase. There, Buy fails with "Checkout is unavailable"
 * until the Phase 2 providers ship.
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
