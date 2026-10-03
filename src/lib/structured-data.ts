import {
  DOWNLOAD_URL,
  PRODUCTION_SITE_ORIGIN,
  PRODUCTION_SITE_URL,
  SITE_DESCRIPTION,
  SOCIAL_IMAGE_PATH,
} from "./site";

export function buildStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${PRODUCTION_SITE_ORIGIN}/#organization`,
        name: "SpineSpy",
        url: PRODUCTION_SITE_URL,
      },
      {
        "@type": "SoftwareApplication",
        name: "SpineSpy",
        applicationCategory: "DesktopApplication",
        operatingSystem: "macOS 15+ (Apple Silicon)",
        description: SITE_DESCRIPTION,
        url: PRODUCTION_SITE_URL,
        image: `${PRODUCTION_SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`,
        downloadUrl: DOWNLOAD_URL,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        brand: {
          "@id": `${PRODUCTION_SITE_ORIGIN}/#organization`,
        },
      },
    ],
  };
}
