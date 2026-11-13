"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";
import Link from "next/link";

function ThanksContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchLicense() {
      if (!sessionId) {
        setError("Missing session ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to retrieve license");
        }

        const data = await response.json();
        setLicenseKey(data.license_key);
      } catch (err) {
        console.error("Error fetching license:", err);
        setError("Unable to retrieve your license. Please check your email.");
      } finally {
        setLoading(false);
      }
    }

    fetchLicense();
  }, [sessionId]);

  const copyToClipboard = async () => {
    if (!licenseKey) return;

    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
        <div className="container-wide max-w-2xl">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-6 animate-spin text-[var(--ink-muted)]" />
              <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
                Processing your purchase...
              </h1>
            </div>
          ) : error ? (
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
                Thank you for your purchase!
              </h1>
              <p className="text-lg text-[var(--ink-muted)] mb-6">{error}</p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                Return home
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
                  Welcome to SpineSpy Pro!
                </h1>
                <p className="text-lg text-[var(--ink-muted)]">
                  Your license key has been sent to your email.
                </p>
              </div>

              <div className="bg-white border-2 border-[var(--border)] rounded-lg p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your License Key</h2>
                <div className="bg-[var(--paper)] border border-[var(--border)] rounded-lg p-4 mb-4">
                  <code className="text-xl font-mono font-semibold text-center block break-all">
                    {licenseKey}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to clipboard
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">How to Activate</h2>
                  <ol className="space-y-2 text-[var(--ink-muted)]">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--ink)] text-[var(--paper)] rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </span>
                      <span>Open SpineSpy from your menubar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--ink)] text-[var(--paper)] rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                      </span>
                      <span>Click &ldquo;Enter License&rdquo;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--ink)] text-[var(--paper)] rounded-full flex items-center justify-center text-sm font-semibold">
                        3
                      </span>
                      <span>Paste your license key</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--ink)] text-[var(--paper)] rounded-full flex items-center justify-center text-sm font-semibold">
                        4
                      </span>
                      <span>Enjoy SpineSpy Pro on up to 3 Macs</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                  <h3 className="font-semibold mb-2">Pro Features Unlocked</h3>
                  <ul className="space-y-1 text-[var(--ink-muted)]">
                    <li>✓ Floating pet companion</li>
                    <li>✓ Custom sound clips</li>
                    <li>✓ Phone distraction nudges</li>
                  </ul>
                </div>

                <div className="text-center pt-6 border-t border-[var(--border)]">
                  <p className="text-sm text-[var(--ink-muted)] mb-4">
                    Questions? We&rsquo;re here to help.
                  </p>
                  <Link href="/" className="btn-secondary inline-flex items-center gap-2">
                    Return home
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative bg-[var(--paper)] flex items-center justify-center">
        <div className="noise-overlay" aria-hidden="true" />
        <Loader2 className="w-12 h-12 animate-spin text-[var(--ink-muted)]" />
      </main>
    }>
      <ThanksContent />
    </Suspense>
  );
}
