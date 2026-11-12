export const PRODUCTION_SITE_URL = "https://www.spinespy.com";

export const PRODUCTION_SITE_ORIGIN = "https://www.spinespy.com";

export const PRODUCTION_HOSTS = new Set(["www.spinespy.com", "spinespy.com"]);

export const SITE_DESCRIPTION =
  "A local macOS menubar app that catches slouching and phone distractions with brief camera checks. Nothing is uploaded.";

/** One-time purchase price in USD (no trial, no subscription). */
export const SPINESPY_PRICE_USD = 5;

/**
 * Lemon Squeezy checkout URL for SpineSpy.
 * TODO: Replace this placeholder with the real Lemon Squeezy checkout link when the product is live.
 */
export const LEMON_SQUEEZY_CHECKOUT_URL = "TODO_REPLACE_WITH_LEMON_SQUEEZY_CHECKOUT_URL";

export const SOCIAL_IMAGE_PATH = "/images/posture-good.png";

export function isProductionHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.split(":")[0].toLowerCase();
  return PRODUCTION_HOSTS.has(normalized);
}
