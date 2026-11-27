"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Bell,
  Check,
  CreditCard,
  Download,
  Eye,
  Shield,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { BuyButton } from "@/components/buy-button";
import { DOWNLOAD_URL, MAX_ACTIVATIONS, SPINESPY_PRICE_USD } from "@/lib/site";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const features = [
  {
    icon: Eye,
    title: "Posture",
    description:
      "Notices posture patterns from a single frame, without running a continuous camera feed.",
  },
  {
    icon: Smartphone,
    title: "Phone",
    description:
      "Notices when you reach for your phone during focus time, without recording the desk.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Waits for a pattern across multiple checks before reminding you to adjust or move.",
  },
  {
    icon: Shield,
    title: "Privacy / Pause",
    description:
      "One frame, then the camera closes. Pause monitoring from the menubar whenever you want.",
  },
];

const steps = [
  {
    title: "Periodic snapshots",
    description:
      "SpineSpy checks in at the interval you set, giving you time to work without constant interruptions.",
  },
  {
    title: "Local analysis",
    description:
      "One frame is checked on your Mac for slouching and phone use. The camera closes immediately.",
  },
  {
    title: "Menubar status",
    description:
      "Your posture buddy icon changes with your posture, so you can read it without opening the menu.",
  },
  {
    title: "Smart alert",
    description:
      "After multiple checks, you get one reminder to adjust your posture or change positions.",
  },
];

export default function Home() {
  const demoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = demoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

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
          <a href="#top" className="font-semibold text-lg tracking-tight">
            SpineSpy
          </a>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="hidden text-sm font-medium sm:inline">
              Pricing
            </a>
            <a
              href={DOWNLOAD_URL}
              download="SpineSpy.dmg"
              className="btn-primary btn-compact"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Download
            </a>
          </div>
        </div>
      </motion.header>

      <section id="top" className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="container-wide flex flex-col items-center text-center">
          <motion.div
            className="flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-5 flex items-center gap-2 text-sm font-medium text-[var(--ink-muted)]"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              100% local processing
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-semibold leading-[1.05] mb-6 text-balance"
            >
              Meet your
              <span className="emphasis block">posture buddy</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--ink-muted)] mb-8 max-w-xl leading-relaxed"
            >
              SpineSpy checks your posture at set intervals, offers simple suggestions, and reminds
              you to keep moving throughout the workday. Everything runs locally on your Mac, from
              the menubar.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <BuyButton />
              <a href={DOWNLOAD_URL} download="SpineSpy.dmg" className="btn-secondary">
                <Download className="w-4 h-4" aria-hidden="true" />
                Download app
              </a>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-[var(--ink-muted)]"
            >
              macOS 15+ · Apple Silicon
            </motion.p>
          </motion.div>

          <motion.figure
            className="product-frame hero-shot mx-auto mt-14 w-full min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Image
              src="/images/welcome.png"
              alt="Welcome to SpineSpy. Pick what you need help with, and how often it should check in."
              width={1120}
              height={1276}
              priority
              className="block w-full h-auto"
            />
          </motion.figure>
        </div>
      </section>

      <section id="demo" aria-labelledby="demo-heading" className="section-rule py-16 sm:py-24 scroll-mt-20">
        <div className="container-wide">
          <div className="max-w-2xl mb-10">
            <h2 id="demo-heading" className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-4">
              See SpineSpy in action
            </h2>
            <p id="demo-description" className="text-lg text-[var(--ink-muted)] leading-relaxed">
              SpineSpy sits in your menubar. Answer the welcome questionnaire, calibrate your
              preferred posture, then leave it running. It checks in throughout the day and nudges
              you to adjust your posture or change positions when needed.
            </p>
          </div>
          <div className="product-frame min-w-0 bg-black">
            <video
              ref={demoRef}
              controls
              muted
              playsInline
              preload="metadata"
              poster="/images/spinespy-demo-poster.jpg"
              width={1588}
              height={1080}
              aria-label="SpineSpy product demo. This video has no audio."
              aria-describedby="demo-description"
              className="block w-full h-auto"
            >
              <source src="/videos/spinespy-demo.mp4" type="video/mp4" />
              Your browser does not support embedded video.{" "}
              <a href="/videos/spinespy-demo.mp4">Download the SpineSpy demo.</a>
            </video>
          </div>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24" aria-labelledby="compare-heading">
        <div className="container-wide">
          <div className="max-w-2xl mb-10">
            <h2 id="compare-heading" className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-4">
              Built for people who lose track of time at their desks
            </h2>
            <p className="text-lg text-[var(--ink-muted)]">
              After a long stretch of focus, your body often pays the price. SpineSpy is your
              posture buddy, helping you keep moving and feel better through long work sessions.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-[1.2fr_1fr]">
            <div className="menu-panel min-w-0 md:row-span-2">
              <div className="product-frame menu-frame">
                <Image
                  src="/images/menubar-menu.png"
                  alt="SpineSpy open in the menu bar: Pause Monitoring, the next capture time, camera off, and Interval, Settings, Calibrate, Save Snapshot, Test Alert, and Quit."
                  width={702}
                  height={614}
                  className="block w-full h-auto"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="product-frame posture-frame">
                <Image
                  src="/images/posture-good.png"
                  alt="Notification: Sitting nice and straight, with the ferret in the menu bar."
                  width={928}
                  height={480}
                  className="block w-full"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="product-frame posture-frame">
                <Image
                  src="/images/posture-shrimp.png"
                  alt="Notification: You're being a shrimp, my friend, with the shrimp in the menu bar."
                  width={898}
                  height={400}
                  className="block w-full"
                />
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-[var(--ink-muted)]">
            A quiet nudge when it is time to reset your position.
          </p>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24" aria-labelledby="features-heading">
        <div className="container-wide">
          <h2 id="features-heading" className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-10 max-w-xl">
            Thoughtful features, minimal footprint
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="feature-card">
                <Icon className="w-5 h-5 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-[var(--ink-muted)] leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="section-rule scroll-mt-20 py-16 sm:py-24"
        aria-labelledby="pricing-heading"
      >
        <div className="container-wide">
          <div className="pricing-panel">
            <div>
              <h2
                id="pricing-heading"
                className="max-w-xl text-4xl font-semibold leading-[1.1] sm:text-5xl"
              >
                Buy once. Keep it for life.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-[var(--pricing-muted)]">
                One simple payment gives you lifetime access to every SpineSpy feature. No
                subscription and no recurring charge.
              </p>
              <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  "All features included",
                  "Lifetime license",
                  "14-day refund policy",
                  "Built for macOS",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing-purchase">
              <p className="text-sm font-medium text-[var(--pricing-muted)]">Lifetime purchase</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="price-amount">${SPINESPY_PRICE_USD.toFixed(2)}</span>
                <span className="mb-2 text-sm text-[var(--pricing-muted)]">USD · one time</span>
              </div>

              <div className="mt-6">
                <BuyButton className="pricing-cta" errorClassName="text-[var(--pricing-muted)]" />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--pricing-muted)]">
                Secure checkout via Stripe. Tax is calculated at checkout. Your license key
                arrives by email and works on up to {MAX_ACTIVATIONS} Macs.
              </p>

              <div className="mt-7 border-t border-white/15 pt-6">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Supported payment methods
                </p>
                <div className="payment-methods mt-3" aria-label="Visa, Mastercard, American Express, and Apple Pay">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>Amex</span>
                  <span>Apple Pay</span>
                </div>
              </div>

              <p className="mt-7 text-sm text-[var(--pricing-muted)]">
                Already purchased?{" "}
                <a
                  href={DOWNLOAD_URL}
                  download="SpineSpy.dmg"
                  className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  Download for macOS
                </a>
                {" · "}
                <a
                  href="/restore"
                  className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                >
                  Resend my key
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24" aria-labelledby="how-heading">
        <div className="container-wide">
          <h2 id="how-heading" className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-3">
            How it works
          </h2>
          <p className="text-lg text-[var(--ink-muted)] mb-10 max-w-lg">
            A short check, a local read, and a nudge only after a pattern.
          </p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <li key={step.title}>
                <div className="step-index mb-3">{String(index + 1).padStart(2, "0")}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[var(--ink-muted)] leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24" aria-labelledby="privacy-heading">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <h2 id="privacy-heading" className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-4">
              One frame, then the camera closes.
            </h2>
            <p className="text-lg text-[var(--ink-muted)]">
              No continuous feed. Nothing is uploaded. Pause from the menubar.
            </p>
          </div>

          <ol className="privacy-flow">
            <li className="privacy-node">
              <h3 className="text-2xl font-semibold mb-2">Open</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                The camera opens only at the interval you chose.
              </p>
            </li>
            <li className="privacy-node">
              <h3 className="text-2xl font-semibold mb-2">One frame</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                That frame is checked on your Mac. It never leaves the machine.
              </p>
            </li>
            <li className="privacy-node">
              <h3 className="text-2xl font-semibold mb-2">Close</h3>
              <p className="text-[var(--ink-muted)] leading-relaxed">
                The camera shuts as soon as the check is done.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.08] mb-4 text-balance">
            Feel better at your desk,{" "}
            <span className="emphasis">one movement at a time.</span>
          </h2>
          <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-lg">
            Get lifetime access with a one-time purchase. Camera data stays on your Mac.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <BuyButton />
            <a href={DOWNLOAD_URL} download="SpineSpy.dmg" className="btn-secondary">
              <Download className="w-4 h-4" aria-hidden="true" />
              Download app
            </a>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">macOS 15+ · Apple Silicon</p>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24" aria-labelledby="faq-heading">
        <div className="container-wide max-w-3xl">
          <h2 id="faq-heading" className="text-4xl sm:text-5xl font-semibold leading-[1.1] mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            <details className="faq-item group">
              <summary className="faq-question">
                Does the camera stay on?
              </summary>
              <div className="faq-answer">
                No. It opens for one frame, then closes.
              </div>
            </details>
            <details className="faq-item group">
              <summary className="faq-question">
                Does anything leave my Mac?
              </summary>
              <div className="faq-answer">
                No. The check runs on your Mac. Nothing is uploaded.
              </div>
            </details>
            <details className="faq-item group">
              <summary className="faq-question">
                How often does it check?
              </summary>
              <div className="faq-answer">
                You choose the check-in interval in the app. Each check is brief, and SpineSpy stays
                out of the way between snapshots.
              </div>
            </details>
            <details className="faq-item group">
              <summary className="faq-question">
                When does it nudge you?
              </summary>
              <div className="faq-answer">
                SpineSpy waits for a pattern across multiple checks before sending one reminder to
                adjust your posture or change positions.
              </div>
            </details>
            <details className="faq-item group">
              <summary className="faq-question">
                How much does SpineSpy cost?
              </summary>
              <div className="faq-answer">
                SpineSpy is ${SPINESPY_PRICE_USD.toFixed(2)} USD as a one-time purchase. There is no
                subscription. Tax is calculated at checkout.
              </div>
            </details>
            <details className="faq-item group">
              <summary className="faq-question">
                What are the system requirements?
              </summary>
              <div className="faq-answer">
                SpineSpy requires macOS 15 or later and runs on Apple Silicon Macs.
              </div>
            </details>
            <details className="faq-item group">
              <summary className="faq-question">
                Is there a refund policy?
              </summary>
              <div className="faq-answer">
                Yes. You can request a refund within 14 days of purchase. See our{" "}
                <a href="/refund-policy" className="text-blue-600 hover:underline">
                  Refund Policy
                </a>{" "}
                for details.
              </div>
            </details>
          </div>
        </div>
      </section>

      <footer className="section-rule py-10">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/ferret.webp"
                alt=""
                width={89}
                height={128}
                className="w-8 h-10 object-contain"
              />
              <div>
                <div className="font-semibold">SpineSpy</div>
                <div className="text-sm text-[var(--ink-muted)]">Made to keep you moving</div>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--ink-muted)]">
              <a href="/privacy-policy" className="hover:text-[var(--ink)]">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="hover:text-[var(--ink)]">
                Terms of Service
              </a>
              <a href="/refund-policy" className="hover:text-[var(--ink)]">
                Refund Policy
              </a>
            </nav>
          </div>
          <div className="text-xs text-[var(--ink-muted)] text-center sm:text-left">
            © {new Date().getFullYear()} SpineSpy. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
