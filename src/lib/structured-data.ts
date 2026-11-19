import {
  PRODUCTION_SITE_ORIGIN,
  PRODUCTION_SITE_URL,
  SITE_DESCRIPTION,
  SOCIAL_IMAGE_PATH,
  DOWNLOAD_URL,
  SPINESPY_PRICE_USD,
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
          price: SPINESPY_PRICE_USD.toFixed(2),
          priceCurrency: "USD",
          url: `${PRODUCTION_SITE_URL}/#pricing`,
          priceSpecification: {
            "@type": "PriceSpecification",
            price: SPINESPY_PRICE_USD.toFixed(2),
            priceCurrency: "USD",
            valueAddedTaxIncluded: false,
          },
        },
        brand: {
          "@id": `${PRODUCTION_SITE_ORIGIN}/#organization`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Does the camera stay on?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. It opens for one frame, then closes.",
            },
          },
          {
            "@type": "Question",
            name: "Does anything leave my Mac?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The check runs on your Mac. Nothing is uploaded.",
            },
          },
          {
            "@type": "Question",
            name: "How often does it check?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You choose the check-in interval in the app. Each check is brief, and SpineSpy stays out of the way between snapshots.",
            },
          },
          {
            "@type": "Question",
            name: "When does it nudge you?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SpineSpy waits for a pattern across multiple checks before sending one reminder to adjust your posture or change positions.",
            },
          },
          {
            "@type": "Question",
            name: "What are the system requirements?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SpineSpy requires macOS 15 or later and runs on Apple Silicon Macs.",
            },
          },
        ],
      },
    ],
  };
}
