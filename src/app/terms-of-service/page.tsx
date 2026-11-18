import Link from "next/link";

export const metadata = {
  title: "Terms of Service - SpineSpy",
  description: "Terms of Service for SpineSpy posture monitoring app",
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-[var(--ink-muted)] mb-10">
            Last Updated: November 18, 2026
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4 mt-8">1. Acceptance of Terms</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
              SpineSpy website, applications and related services (the &quot;Services&quot;). By
              accessing or using the Services, you agree to be bound by these Terms. If you do not
              agree, do not use the Services.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">2. Eligibility and Accounts</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              You must be at least 18 years old to use the Services. You are responsible for the
              accuracy of the information you provide, for maintaining the confidentiality of your
              account credentials, and for all activity under your account.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">3. License</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Subject to these Terms and payment of any applicable fees, we grant you a limited,
              non-exclusive, non-transferable, revocable license to use the Services for your
              personal purposes. You may not copy, modify, distribute, sell, lease, reverse engineer
              or create derivative works of the Services, except to the extent such restrictions are
              prohibited by applicable law.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">4. Purchases</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Prices and payment terms are presented at checkout. Payments may be processed by
              third-party payment providers and are subject to their terms. We may change prices at
              any time; changes do not affect completed purchases. Refunds are governed by our
              Refund Policy.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">5. No Medical Advice</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              The Services are provided for general informational and habit-tracking purposes only.
              They do not constitute medical advice, diagnosis or treatment and are not a substitute
              for consultation with a qualified healthcare professional. Use of the Services is at
              your own risk.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">6. Acceptable Use</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              You agree not to misuse the Services, including by interfering with their operation,
              attempting to gain unauthorized access to any systems or data, or using the Services
              in violation of applicable law.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">7. Intellectual Property</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              The Services and all related content, software and trademarks are owned by us or our
              licensors and are protected by applicable intellectual property laws. No rights are
              granted except as expressly set out in these Terms.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">8. Privacy</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Our collection and use of personal data is described in our{" "}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">9. Disclaimer of Warranties</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              The Services are provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, express or implied, including warranties of merchantability,
              fitness for a particular purpose, non-infringement, accuracy or uninterrupted
              availability. We do not warrant any particular result from use of the Services.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">10. Limitation of Liability</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              To the maximum extent permitted by applicable law, we shall not be liable for any
              indirect, incidental, special, consequential or punitive damages, or for any loss of
              profits, data or goodwill, arising out of or related to the Services. Our total
              liability for any claim arising out of or related to the Services shall not exceed the
              amount you paid us for the Services in the twelve months preceding the claim. Some
              jurisdictions do not allow certain limitations; in such cases, our liability is
              limited to the fullest extent permitted by law.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              11. Suspension and Termination
            </h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We may suspend or terminate your access to the Services at any time if you breach
              these Terms or if required by law. Sections that by their nature should survive
              termination shall survive.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              12. Changes to the Services and Terms
            </h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We may modify, suspend or discontinue any part of the Services at any time. We may
              amend these Terms at any time by posting the revised version on this page. Your
              continued use of the Services after such posting constitutes acceptance of the revised
              Terms.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">13. Contact</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Questions regarding these Terms may be sent to support@spinespy.com.
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
