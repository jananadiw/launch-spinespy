import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SpineSpy — AI Posture & Focus Monitor for macOS",
  description:
    "An AI-powered menubar app that monitors your posture and detects phone distractions. Privacy-first with all processing done locally on your Mac.",
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
    title: "SpineSpy — AI Posture & Focus Monitor for macOS",
    description:
      "Monitor your posture and stay focused with AI-powered detection. Privacy-first, runs entirely on your Mac.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpineSpy — AI Posture & Focus Monitor for macOS",
    description:
      "Monitor your posture and stay focused with AI-powered detection. Privacy-first, runs entirely on your Mac.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
