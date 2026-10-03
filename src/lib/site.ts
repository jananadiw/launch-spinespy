export const PRODUCTION_SITE_URL = "https://www.spinespy.com/";

export const PRODUCTION_SITE_ORIGIN = "https://www.spinespy.com";

export const PRODUCTION_HOSTS = new Set(["www.spinespy.com", "spinespy.com"]);

export const SITE_DESCRIPTION =
  "A local macOS menubar app that catches slouching and phone distractions with brief camera checks. Nothing is uploaded.";

export const DOWNLOAD_URL =
  "https://github.com/jananadiw/spinespy/releases/download/v1.3.3/SpineSpy.dmg";

export const SOCIAL_IMAGE_PATH = "/images/posture-good.png";

export function isProductionHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.split(":")[0].toLowerCase();
  return PRODUCTION_HOSTS.has(normalized);
}
