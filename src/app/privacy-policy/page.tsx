import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - SpineSpy",
  description: "Privacy Policy for SpineSpy posture monitoring app",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-[var(--ink-muted)] mb-10">
            Effective Date: November 18, 2026
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4 mt-8">1. Introduction</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              This Privacy Policy describes how SpineSpy (&quot;we&quot;, &quot;us&quot;,
              &quot;our&quot;) collects, uses and discloses personal data in connection with our
              website, applications and related services (the &quot;Services&quot;). By using the
              Services, you acknowledge that you have read this Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">2. Information We Collect</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We may collect the following categories of information: (a) information you provide to
              us, such as your name, email address, account credentials and the content of your
              communications with us; (b) transaction information, such as purchase history and
              billing details processed on our behalf by payment service providers; (c) device and
              usage information, such as IP address, device and operating system type, application
              version, log data, diagnostic and performance data, and information about how you
              interact with the Services; and (d) information collected through cookies and similar
              technologies.
            </p>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              SpineSpy requires access to your device camera for posture monitoring. Camera frames
              are processed locally on your device and are never uploaded or transmitted to our
              servers. Such access is requested through your device permissions and may be withdrawn
              at any time; some features may not function without it.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">3. How We Use Information</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We may use information to: provide, operate and maintain the Services; process
              transactions and manage accounts; provide support and respond to requests; send
              service-related and, where permitted, marketing communications; analyze, develop and
              improve the Services; detect, prevent and address fraud, security and technical
              issues; comply with legal obligations; and establish, exercise or defend legal claims.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">
              4. Legal Bases for Processing
            </h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Where applicable law requires a legal basis, we process personal data on the basis of:
              performance of a contract; our legitimate interests; compliance with legal obligations;
              and your consent, where required. Where processing is based on consent, you may
              withdraw it at any time without affecting the lawfulness of processing carried out
              before withdrawal.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">5. Disclosure of Information</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We may disclose information to: service providers acting on our behalf; professional
              advisors; competent authorities and other parties where required by law or to protect
              our rights, property or safety or that of others; and a successor or acquirer in
              connection with a merger, acquisition, financing or sale of assets. We do not sell
              personal data.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">6. International Transfers</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Information may be transferred to and processed in countries other than your country of
              residence. Where required by applicable law, such transfers are subject to appropriate
              safeguards.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">7. Retention</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We retain personal data for as long as necessary for the purposes described in this
              Privacy Policy, or as required or permitted by applicable law.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">8. Security</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We take reasonable measures to protect personal data. However, no method of
              transmission or storage is completely secure, and we cannot guarantee the security of
              any information.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">9. Your Rights</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Depending on your jurisdiction, you may have the right to request access to,
              rectification or erasure of, or restriction of processing of your personal data, to
              object to processing, to data portability, and to lodge a complaint with a supervisory
              authority. To exercise these rights, contact us using the details below. We may need
              to verify your identity before responding. You may opt out of marketing communications
              at any time using the unsubscribe link provided.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">10. Cookies</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We use cookies and similar technologies for the operation of the Services, analytics
              and marketing. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">11. Children</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              The Services are not directed to individuals under 18 years of age, and we do not
              knowingly collect personal data from them.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">12. Changes to This Policy</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              We may amend this Privacy Policy at any time. The amended version will be posted on
              this page with a revised effective date. Your continued use of the Services after such
              posting constitutes acceptance of the amended Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">13. Contact</h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-6">
              Questions regarding this Privacy Policy may be sent to support@spinespy.com.
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
