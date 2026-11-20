import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { isDevOutboxEnabled } from "@/lib/license/config";
import { listMockEmails } from "@/lib/license/mock/email";
import { MOCK_SEED_EMAIL, MOCK_SEED_KEYS } from "@/lib/license/mock/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mock emails - SpineSpy dev",
  robots: { index: false, follow: false },
};

/** Dev-only outbox for mock license emails. 404 in production builds and when USE_MOCKS=false. */
export default function DevEmailsPage() {
  if (!isDevOutboxEnabled()) notFound();

  const emails = listMockEmails();

  return (
    <PageShell>
      <div className="container-wide">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-4xl font-semibold leading-[1.1]">Mock emails</h1>
          <p className="mb-8 text-[var(--ink-muted)]">
            License emails sent in mock mode, newest first. Stored in server memory; a restart
            clears them. Reload to see new ones.
          </p>

          <details className="faq-item mb-8">
            <summary className="faq-question">Seed keys (owner {MOCK_SEED_EMAIL})</summary>
            <ul className="faq-answer space-y-1 font-mono text-sm">
              <li>{MOCK_SEED_KEYS.valid}: valid, no devices</li>
              <li>{MOCK_SEED_KEYS.full}: valid, already on 3 Macs</li>
              <li>{MOCK_SEED_KEYS.revoked}: revoked</li>
            </ul>
          </details>

          {emails.length === 0 ? (
            <p className="text-[var(--ink-muted)]">
              No emails yet. Click Buy on the home page, or resend a key at /restore.
            </p>
          ) : (
            <ol className="space-y-6">
              {emails.map((email) => (
                <li key={email.id} className="feature-card">
                  <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                    <dt className="text-[var(--ink-muted)]">To</dt>
                    <dd className="font-medium">{email.to}</dd>
                    <dt className="text-[var(--ink-muted)]">Subject</dt>
                    <dd>{email.subject}</dd>
                    <dt className="text-[var(--ink-muted)]">Key</dt>
                    <dd className="font-mono">{email.key}</dd>
                    <dt className="text-[var(--ink-muted)]">Sent</dt>
                    <dd>{email.sentAt.toISOString()}</dd>
                  </dl>
                  <iframe
                    title={`Email to ${email.to}`}
                    srcDoc={email.html}
                    sandbox=""
                    className="h-[560px] w-full rounded-lg border border-[var(--line)] bg-white"
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </PageShell>
  );
}
