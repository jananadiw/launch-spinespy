import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
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

export const metadata: Metadata = {
  title: "SpineSpy | Catch the slouch before your back does",
  description:
    "A local macOS menubar app that catches slouching and phone distractions with brief camera checks. Nothing is uploaded.",
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
  authors: [{ name: "SpineSpy" }],
  openGraph: {
    title: "SpineSpy |Catch the slouch before your back does",
    description:
      "Brief posture checks, smart consecutive alerts, and no camera data leaving your Mac.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpineSpy | Catch the slouch before your back does",
    description:
      "Brief posture checks, smart consecutive alerts, and no camera data leaving your Mac.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
