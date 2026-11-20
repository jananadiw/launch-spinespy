/**
 * USE_MOCKS defaults to true until Phase 2 ships. Only the literal "false"
 * turns on the real Stripe, Postgres, and Resend providers.
 */
export function isMockMode(): boolean {
  return process.env.USE_MOCKS?.trim().toLowerCase() !== "false";
}

/** The dev outbox page (/dev/emails) runs only with mocks, outside production builds. */
export function isDevOutboxEnabled(): boolean {
  return isMockMode() && process.env.NODE_ENV !== "production";
}

/** Buyer email for mock checkout when the request has none. */
export function getMockBuyerEmail(): string {
  return process.env.MOCK_BUYER_EMAIL?.trim() || "buyer@example.com";
}
