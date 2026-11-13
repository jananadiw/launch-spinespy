import {
  PRODUCTION_SITE_ORIGIN,
  PRODUCTION_SITE_URL,
  SITE_DESCRIPTION,
  SOCIAL_IMAGE_PATH,
  SPINESPY_PRICE_USD,
  buildSpineSpyPricingFaqAnswer,
  isTrialDownloadLive,
  TRIAL_BUILD_DOWNLOAD_URL,
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
        ...(isTrialDownloadLive()
          ? { downloadUrl: TRIAL_BUILD_DOWNLOAD_URL }
          : {}),
        offers: {
          "@type": "Offer",
          price: String(SPINESPY_PRICE_USD),
          priceCurrency: "USD",
          url: `${PRODUCTION_SITE_URL}/pricing`,
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
              text: "You pick 10, 20, or 30 minutes, or 1 hour.",
            },
          },
          {
            "@type": "Question",
            name: "When does it nudge you?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "After five bad snapshots in a row. One reminder, then it waits.",
            },
          },
          {
            "@type": "Question",
            name: "How much does SpineSpy cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: buildSpineSpyPricingFaqAnswer(),
            },
          },
          {
            "@type": "Question",
            name: "Is SpineSpy a local macOS posture app?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. It is a menubar app for Apple Silicon on macOS 15 or later. Processing stays on your Mac.",
            },
          },
        ],
      },
    ],
  };
}
