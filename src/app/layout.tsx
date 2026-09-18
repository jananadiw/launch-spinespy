import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpineSpy — Catch the slouch before your back does",
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
    title: "SpineSpy — Catch the slouch before your back does",
    description:
      "Brief posture checks, smart consecutive alerts, and no camera data leaving your Mac.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpineSpy — Catch the slouch before your back does",
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
