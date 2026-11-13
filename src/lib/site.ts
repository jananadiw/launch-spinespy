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

/**
 * Direct download for the free tier + in-app Pro trial build (.dmg or zip).
 * TODO: Replace with the hosted trial build URL before launch (or set NEXT_PUBLIC_TRIAL_BUILD_DOWNLOAD_URL in Vercel).
 */
export const TRIAL_BUILD_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_TRIAL_BUILD_DOWNLOAD_URL?.trim() ||
  "TODO_REPLACE_WITH_TRIAL_BUILD_DOWNLOAD_URL";

export function isTrialDownloadLive(): boolean {
  return TRIAL_BUILD_DOWNLOAD_URL.startsWith("https://");
}

/** Shared copy for homepage FAQ and JSON-LD. */
export function buildSpineSpyPricingFaqAnswer(): string {
  return (
    `Free tier on macOS with a ${TRIAL_DAYS}-day Pro trial in the app (no credit card). ` +
    `Pro is $${SPINESPY_PRICE_USD} USD once (tax at checkout), up to ${MAX_ACTIVATIONS} Macs. No subscription.`
  );
}

export const ACTIVATION_LIMIT_COPY = `Up to ${MAX_ACTIVATIONS} Macs`;

export function isProductionHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.split(":")[0].toLowerCase();
  return PRODUCTION_HOSTS.has(normalized);
}
