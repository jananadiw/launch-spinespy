import Link from "next/link";

export const metadata = {
  title: "Refund Policy - SpineSpy",
  description: "Refund Policy for SpineSpy posture monitoring app",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen relative bg-[var(--paper)]">
      <div className="noise-overlay" aria-hidden="true" />

      <header className="site-nav">
        <div className="container-wide py-4 sm:py-5">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            SpineSpy
          </Link>
        </div>
      </header>

      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="container-wide max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-4">
            Refund Policy
          </h1>
          <p className="text-[var(--ink-muted)] mb-10">
            Last Updated: November 18, 2026
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Refund requests for purchases of SpineSpy may be submitted within 14 days of the date
              of purchase by contacting support@spinespy.com. Requests submitted after this period
              are not eligible, except where required by applicable law.
            </p>

            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Approved refunds are issued to the original payment method. Upon a refund, access to
              the software and any associated features may be revoked.
            </p>

            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              This Refund Policy does not affect any statutory rights you may have under applicable
              law. By making a purchase, you agree to this Refund Policy and our{" "}
              <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
