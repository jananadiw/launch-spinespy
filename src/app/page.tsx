"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Bell,
  Download,
  Eye,
  Github,
  Monitor,
  Play,
  Shield,
  Smartphone,
  Star,
} from "lucide-react";
import Image from "next/image";

const DOWNLOAD_URL =
  "https://github.com/jananadiw/spinespy/releases/download/v1.3.3/SpineSpy.dmg";
const SOURCE_URL = "https://github.com/jananadiw/spinespy";

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
      "Spots forward slouch and side tilt from a single frame, not a continuous camera feed.",
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
      "Waits for five bad snapshots in a row before it makes a sound. No alert fatigue.",
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
      "SpineSpy opens the camera on the interval you set: 10 minutes, 20 minutes, 30 minutes, or 1 hour.",
  },
  {
    title: "Local analysis",
    description:
      "One frame is checked on your Mac for slouching and phone use. The camera closes immediately.",
  },
  {
    title: "Menubar status",
    description:
      "The icon switches when your posture changes, so you can read it without opening the menu.",
  },
  {
    title: "Smart alert",
    description:
      "After five consecutive bad snapshots, you get one reminder to straighten up.",
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
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-source"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:block">
                <span className="text-sm font-semibold leading-tight">GitHub</span>
                <span className="nav-source-sub">View source</span>
              </span>
              <span className="sr-only sm:hidden">GitHub, view source</span>
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
              Catch the slouch
              <span className="emphasis block">before your back does</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--ink-muted)] mb-8 max-w-xl leading-relaxed"
            >
              SpineSpy checks your posture in short intervals, then stays out of
              the way. It waits for five bad snapshots in a row before it nudges
              you. Local, in the menubar.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <a href={DOWNLOAD_URL} download="SpineSpy.dmg" className="btn-primary">
                <Download className="w-5 h-5" aria-hidden="true" />
                Download for macOS
              </a>
              <a href="#demo" className="btn-secondary">
                <Play className="w-4 h-4" aria-hidden="true" />
                Watch demo
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--ink-muted)]"
            >
              <span className="inline-flex items-center gap-2">
                <Star className="w-4 h-4" aria-hidden="true" />
                Open source
              </span>
              <span className="inline-flex items-center gap-2">
                <Monitor className="w-4 h-4" aria-hidden="true" />
                macOS 15+ · Apple Silicon
              </span>
            </motion.div>
          </motion.div>

          <motion.figure
            className="product-frame hero-shot mx-auto mt-14 w-full min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Image
              src="/images/menubar-menu.jpg"
              alt="SpineSpy menubar menu showing Pause Monitoring, the next capture time, and Camera off."
              width={600}
              height={568}
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
              SpineSpy sits in your menubar. Calibrate your preferred posture
              before you start monitoring, then leave it running. It checks you
              on the interval you set and nudges you only after five bad
              snapshots in a row.
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
              width={944}
              height={614}
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
              Built for people who live at their computers
            </h2>
            <p className="text-lg text-[var(--ink-muted)]">
              After a long stretch of focus, your body pays the price. SpineSpy
              keeps the check in the menubar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <figure className="min-w-0">
              <div className="product-frame">
                <Image
                  src="/images/posture-good.jpg"
                  alt="Menubar notification: Sitting nice and straight, with the ferret icon."
                  width={740}
                  height={390}
                  className="block w-full h-auto"
                />
              </div>
              <figcaption className="mt-3 text-sm font-semibold">Straight</figcaption>
            </figure>
            <figure className="min-w-0">
              <div className="product-frame">
                <Image
                  src="/images/posture-shrimp.jpg"
                  alt="Menubar notification: You're being a shrimp, my friend, with the shrimp icon."
                  width={740}
                  height={390}
                  className="block w-full h-auto"
                />
              </div>
              <figcaption className="mt-3 text-sm font-semibold">Shrimp</figcaption>
            </figure>
          </div>
          <p className="mt-6 max-w-xl text-[var(--ink-muted)]">
            Five bad checks in a row, and it calls you a shrimp.
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

          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 font-semibold hover:underline"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            Verify it in the source
          </a>
        </div>
      </section>

      <section className="section-rule py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.08] mb-4 text-balance">
            Better posture,{" "}
            <span className="emphasis">one quiet nudge at a time.</span>
          </h2>
          <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-lg">
            Free, open source, and built so camera data stays on your Mac.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <a href={DOWNLOAD_URL} download="SpineSpy.dmg" className="btn-primary">
              <Download className="w-5 h-5" aria-hidden="true" />
              Download for macOS
            </a>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
              Star on GitHub
            </a>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">macOS 15+ · Apple Silicon</p>
        </div>
      </section>

      <footer className="section-rule py-10">
        <div className="container-wide flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
              <div className="text-sm text-[var(--ink-muted)]">Made for better posture</div>
            </div>
          </div>
          <nav className="flex items-center gap-5 text-sm text-[var(--ink-muted)]">
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)]">
              GitHub
            </a>
            <a href="https://github.com/jananadiw/spinespy/releases" className="hover:text-[var(--ink)]">
              Releases
            </a>
            <a
              href="https://github.com/jananadiw/spinespy/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              MIT License
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
