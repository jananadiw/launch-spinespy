"use client";

import { motion } from "framer-motion";
import { Check, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { TrialDownloadLink } from "@/components/trial-download-link";
import {
  SPINESPY_PRICE_USD,
  SUPPORT_EMAIL,
  TRIAL_DAYS,
  REFUND_DAYS,
  MAX_ACTIVATIONS,
  ACTIVATION_LIMIT_COPY,
} from "@/lib/site";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const freeFeatures = [
  "Core posture checks",
  "Forward slouch detection",
  "Side tilt detection",
  "Smart alerts (5 bad checks)",
  "Menubar status",
  "Privacy controls",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Floating pet companion",
  "Custom sound clips",
  "Phone distraction nudges",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen relative bg-[var(--paper)]">
      <div className="noise-overlay" aria-hidden="true" />

      <motion.header
        className="site-nav"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-wide py-4 sm:py-5 flex items-center justify-between gap-6">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            SpineSpy
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/#demo" className="text-sm font-medium hover:text-[var(--ink)]">
              Demo
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-[var(--ink)]">
              Home
            </Link>
          </div>
        </div>
      </motion.header>

      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="container-wide max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-5 flex items-center justify-center gap-2 text-sm font-medium text-[var(--ink-muted)]"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              100% local processing
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-semibold leading-[1.05] mb-6"
            >
              Keep SpineSpy Pro, once.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--ink-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              Try Pro free for {TRIAL_DAYS} days in the app, then ${SPINESPY_PRICE_USD.toFixed(2)} one-time (tax calculated at checkout). No subscription. Camera frames stay on your Mac.
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              id="pro"
              className="bg-white border-2 border-[var(--ink)] rounded-xl p-8 shadow-lg scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[var(--ink)] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[var(--paper)]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">SpineSpy Pro</h2>
                  <p className="text-sm text-[var(--ink-muted)]">One-time purchase</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-semibold">${SPINESPY_PRICE_USD.toFixed(2)}</span>
                  <span className="text-[var(--ink-muted)]">+ applicable tax</span>
                </div>
                <p className="text-sm text-[var(--ink-muted)]">
                  Tax calculated at checkout
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                <TrialDownloadLink className="btn-secondary w-full justify-center" />
                <CheckoutForm
                  label={`Unlock Pro`}
                  formClassName="block w-full"
                  className="btn-primary w-full justify-center"
                />
              </div>

              <p className="text-sm text-center text-[var(--ink-muted)] mb-6">
                One-time. {ACTIVATION_LIMIT_COPY}. No subscription.
              </p>

              <div className="pt-6 border-t border-[var(--border)]">
                <h3 className="font-semibold mb-3">Includes:</h3>
                <ul className="space-y-2">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        className="w-5 h-5 flex-shrink-0 text-green-600"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-semibold mb-8 text-center">Free vs Pro</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Free</h3>
                <TrialDownloadLink
                  className="btn-secondary w-full justify-center mb-4 text-sm"
                  showIcon
                />
                <ul className="space-y-2">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        className="w-5 h-5 flex-shrink-0 text-[var(--ink-muted)]"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border-2 border-[var(--ink)] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  Pro
                  <span className="text-xs font-semibold px-2 py-1 bg-[var(--ink)] text-[var(--paper)] rounded">
                    RECOMMENDED
                  </span>
                </h3>
                <ul className="space-y-2">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        className="w-5 h-5 flex-shrink-0 text-green-600"
                        aria-hidden="true"
                      />
                      <span className={feature.startsWith("Everything") ? "font-semibold" : ""}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mb-16 bg-blue-50 border-l-4 border-blue-500 p-8 rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Trial & License</h2>
            <div className="space-y-4 text-[var(--ink-muted)]">
              <p>
                <strong className="text-[var(--ink)]">{TRIAL_DAYS}-day free trial:</strong> Try all
                Pro features in the app before you buy. No credit card required.
              </p>
              <p>
                <strong className="text-[var(--ink)]">One license, {MAX_ACTIVATIONS} Macs:</strong>{" "}
                Your license works on up to {MAX_ACTIVATIONS} Macs. Deactivate one device to free up
                a slot.
              </p>
              <p>
                <strong className="text-[var(--ink)]">{REFUND_DAYS}-day refund:</strong> Full refund
                within {REFUND_DAYS} days of purchase. Email{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-blue-600 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-8">Pricing FAQ</h2>
            <div className="space-y-3">
              <details className="faq-item group">
                <summary className="faq-question">
                  Is there a free trial?
                </summary>
                <div className="faq-answer">
                  Yes. SpineSpy includes a {TRIAL_DAYS}-day free trial of Pro features built into
                  the app. No credit card required. After the trial, you can continue using the free
                  version or purchase Pro for ${SPINESPY_PRICE_USD.toFixed(2)} + tax.
                </div>
              </details>

              <details className="faq-item group">
                <summary className="faq-question">
                  How much does Pro cost?
                </summary>
                <div className="faq-answer">
                  ${SPINESPY_PRICE_USD.toFixed(2)} USD (tax calculated at checkout), one time. No subscription, no recurring charges.
                </div>
              </details>

              <details className="faq-item group">
                <summary className="faq-question">
                  How many devices can I use?
                </summary>
                <div className="faq-answer">
                  One license works on up to {MAX_ACTIVATIONS} Macs. You can deactivate a device in
                  the app to free up a slot for a new Mac.
                </div>
              </details>

              <details className="faq-item group">
                <summary className="faq-question">
                  What&rsquo;s your refund policy?
                </summary>
                <div className="faq-answer">
                  Full refund within {REFUND_DAYS} days of purchase, no questions asked. Email{" "}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-blue-600 hover:underline"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </details>

              <details className="faq-item group">
                <summary className="faq-question">
                  What payment methods do you accept?
                </summary>
                <div className="faq-answer">
                  We accept all major credit cards (Visa, Mastercard, American Express) via Stripe.
                  Payments are secure and tax is calculated automatically based on your location.
                </div>
              </details>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="section-rule py-10">
        <div className="container-wide flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="text-sm text-[var(--ink-muted)]">
            <Link href="/" className="hover:text-[var(--ink)]">
              SpineSpy
            </Link>
            {" · "}
            <span>Made for better posture</span>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">macOS 15+ · Apple Silicon</p>
        </div>
      </footer>
    </main>
  );
}
