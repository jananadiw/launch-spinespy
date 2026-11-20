import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { RestoreForm } from "./restore-form";

export const metadata: Metadata = {
  title: "Resend your license key - SpineSpy",
  description: "Get your SpineSpy license key sent to your purchase email again.",
  robots: { index: false, follow: false },
};

export default function RestorePage() {
  return (
    <PageShell>
      <div className="container-wide">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Resend your license key
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-[var(--ink-muted)]">
            Enter the email you used at checkout. We&rsquo;ll send your key there again.
          </p>
          <RestoreForm />
        </div>
      </div>
    </PageShell>
  );
}
