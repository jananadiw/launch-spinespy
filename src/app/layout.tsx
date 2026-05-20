import type { Metadata } from "next";
import "./globals.css";

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
        className="antialiased"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
