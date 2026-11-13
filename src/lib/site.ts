export const PRODUCTION_SITE_URL = "https://www.spinespy.com";

export const PRODUCTION_SITE_ORIGIN = "https://www.spinespy.com";

export const PRODUCTION_HOSTS = new Set(["www.spinespy.com", "spinespy.com"]);

export const SITE_DESCRIPTION =
  "A local macOS menubar app that catches slouching and phone distractions with brief camera checks. Nothing is uploaded.";

/** One-time purchase price in USD (tax calculated at checkout). */
export const SPINESPY_PRICE_USD = 5;

export const SOCIAL_IMAGE_PATH = "/images/posture-good.png";

export const SUPPORT_EMAIL = "support@spinespy.com";

export const TRIAL_DAYS = 7;
export const REFUND_DAYS = 14;
export const MAX_ACTIVATIONS = 3;

export function isProductionHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.split(":")[0].toLowerCase();
  return PRODUCTION_HOSTS.has(normalized);
}
