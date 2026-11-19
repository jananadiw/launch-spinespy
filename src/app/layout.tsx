import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { headers } from "next/headers";
import { buildStructuredData } from "@/lib/structured-data";
import {
  isProductionHost,
  PRODUCTION_SITE_ORIGIN,
  PRODUCTION_SITE_URL,
  SITE_DESCRIPTION,
  SOCIAL_IMAGE_PATH,
} from "@/lib/site";
import "./globals.css";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

const socialImage = {
  url: SOCIAL_IMAGE_PATH,
  width: 928,
  height: 480,
  alt: "SpineSpy menubar notification: Sitting nice and straight.",
};

const pageTitle = "SpineSpy | Meet your posture buddy";

const openGraphDescription =
  "Brief local posture checks and quiet reminders to adjust and keep moving through the workday.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const indexable = isProductionHost(requestHeaders.get("host"));

  return {
    metadataBase: new URL(PRODUCTION_SITE_ORIGIN),
    title: pageTitle,
    description: SITE_DESCRIPTION,
    keywords: [
      "posture",
      "ergonomics",
      "macOS",
      "menubar app",
      "AI",
      "productivity",
      "health",
      "focus",
      "computer vision",
    ],
    applicationName: "SpineSpy",
    authors: [{ name: "SpineSpy" }],
    appleWebApp: {
      title: "SpineSpy",
    },
    alternates: {
      canonical: PRODUCTION_SITE_URL,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: pageTitle,
      description: openGraphDescription,
      type: "website",
      url: PRODUCTION_SITE_URL,
      siteName: "SpineSpy",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: openGraphDescription,
      images: [socialImage.url],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = buildStructuredData();

  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
