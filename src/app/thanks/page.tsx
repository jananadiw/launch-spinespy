import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { DOWNLOAD_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thanks for your purchase - SpineSpy",
  robots: { index: false, follow: false },
};

/**
 * Stripe's success_url lands here with ?session_id=. The page never shows the
 * key and never looks the session up: the key goes out only by email.
 */
export default function ThanksPage() {
  return (
    <PageShell>
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Thanks for your purchase!
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-[var(--ink-muted)]">
            Your license key has been sent to your email. Open SpineSpy and paste it to activate.
          </p>

          <a href={DOWNLOAD_URL} download="SpineSpy.dmg" className="btn-primary">
            <Download className="h-5 w-5" aria-hidden="true" />
            Download SpineSpy
          </a>

          <p className="mt-10 text-sm text-[var(--ink-muted)]">
            Didn&rsquo;t get it? Check your spam folder, or{" "}
            <Link href="/restore" className="text-link">
              resend your key
            </Link>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
