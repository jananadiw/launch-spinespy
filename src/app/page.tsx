"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Download,
  Github,
  Shield,
  Eye,
  Smartphone,
  Clock,
  Volume2,
  Pause,
  Play,
  ChevronDown,
  ChevronRight,
  Lock,
  Monitor,
  Star,
} from "lucide-react";
import { useRef, type ReactNode } from "react";
import Image from "next/image";

const DOWNLOAD_URL =
  "https://github.com/jananadiw/spinespy/releases/latest/download/SpineSpy.dmg";

function ProductIcon({ shrimp = false }: { shrimp?: boolean }) {
  return (
    <Image
      src={shrimp ? "/images/shrimp.webp" : "/images/ferret.webp"}
      alt=""
      width={shrimp ? 112 : 89}
      height={128}
      sizes="96px"
      style={{ display: "inline-block", width: "1.3em", height: "1.3em", objectFit: "contain", verticalAlign: "middle" }}
    />
  );
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Spine SVG Component with animation
function SpineIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized spine vertebrae */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.ellipse
          key={i}
          cx="50"
          cy={30 + i * 22}
          rx={18 - i * 1.5}
          ry="8"
          fill="currentColor"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
          className="spine-vertebra"
        />
      ))}
      {/* Connecting line */}
      <motion.path
        d="M50 30 Q55 80 50 100 Q45 120 50 140 Q55 160 50 180"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
    </svg>
  );
}

// Menubar Mockup Component
function MenubarMockup() {
  return (
    <motion.div
      className="menubar-mockup"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="flex items-center gap-3 text-sm text-[var(--charcoal-light)]">
        <span>Next capture: 10:32 AM</span>
        <span>|</span>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <ProductIcon />
          </motion.span>
          <span className="font-medium text-[var(--charcoal)]">SpineSpy</span>
        </div>
      </div>
    </motion.div>
  );
}

// Posture Comparison Visual
function PostureComparison() {
  return (
    <div className="flex items-center justify-center gap-12">
      {/* Good Posture */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative mb-4">
          <svg
            viewBox="0 0 80 120"
            className="w-24 h-36 mx-auto"
            fill="none"
          >
            {/* Head */}
            <circle cx="40" cy="20" r="15" className="posture-good" />
            {/* Neck */}
            <line x1="40" y1="35" x2="40" y2="45" className="posture-good" />
            {/* Shoulders */}
            <line x1="20" y1="50" x2="60" y2="50" className="posture-good" />
            {/* Spine - straight */}
            <line x1="40" y1="50" x2="40" y2="90" className="posture-good" />
            {/* Chair back indicator */}
            <path d="M25 45 L25 95" className="posture-good" strokeDasharray="4" />
          </svg>
          <motion.span
            className="absolute -top-2 -right-2 text-4xl"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ProductIcon />
          </motion.span>
        </div>
        <span className="text-lg font-semibold text-[var(--sage)]">Good Posture</span>
      </motion.div>

      {/* VS */}
      <motion.div
        className="text-4xl font-serif italic text-[var(--charcoal-light)] opacity-30"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true }}
      >
        vs
      </motion.div>

      {/* Bad Posture */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative mb-4">
          <svg
            viewBox="0 0 80 120"
            className="w-24 h-36 mx-auto"
            fill="none"
          >
            {/* Head - forward */}
            <circle cx="55" cy="25" r="15" className="posture-bad" />
            {/* Neck - angled */}
            <line x1="50" y1="38" x2="45" y2="48" className="posture-bad" />
            {/* Shoulders - uneven */}
            <line x1="20" y1="55" x2="55" y2="50" className="posture-bad" />
            {/* Spine - curved */}
            <path d="M40 52 Q50 70 45 90" className="posture-bad" />
            {/* Chair back indicator */}
            <path d="M25 45 L25 95" className="posture-bad" strokeDasharray="4" opacity="0.5" />
          </svg>
          <motion.span
            className="absolute -top-2 -right-2 text-4xl"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ProductIcon shrimp />
          </motion.span>
        </div>
        <span className="text-lg font-semibold text-[var(--coral)]">Bad Posture</span>
      </motion.div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  emoji,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  emoji?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="feature-card group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-[var(--cream-dark)] group-hover:bg-[var(--peach)] transition-colors duration-300">
          <Icon className="w-6 h-6 text-[var(--charcoal)] group-hover:text-white transition-colors duration-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            {title}
            {emoji && <span className="text-xl">{emoji}</span>}
          </h3>
          <p className="text-[var(--charcoal-light)] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// How It Works Step
function HowItWorksStep({
  number,
  title,
  description,
  delay = 0,
}: {
  number: number;
  title: string;
  description: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="flex items-start gap-6"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--charcoal)] text-[var(--cream)] flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-[var(--charcoal-light)] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <main className="gradient-bg min-h-screen relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-wide">
          <div className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl"><ProductIcon /></span>
              <span className="font-bold text-xl tracking-tight">SpineSpy</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/jananadiw/spinespy"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-[var(--charcoal-light)] hover:text-[var(--charcoal)] transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={DOWNLOAD_URL}
                download="SpineSpy.dmg"
                className="btn-primary text-sm py-2 px-3 sm:px-4"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center pt-32 sm:pt-36 lg:pt-40 pb-16 relative">
        <motion.div
          className="container-wide"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Primary trust badge */}
              <motion.div variants={fadeInUp} className="hero-trust mb-6 flex flex-wrap items-center gap-2">
                <span className="trust-badge">
                  <Lock className="trust-badge-icon" aria-hidden="true" />
                  100% Local Processing
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
              >
                Catch the slouch
                <br className="hidden sm:block" />
                <span className="italic"> before your back does</span>
                <span className="block mt-2 text-[0.58em] leading-tight text-[var(--charcoal-light)]">
                  — local, in the menubar.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-xl text-[var(--charcoal-light)] mb-8 max-w-lg leading-relaxed"
              >
                SpineSpy checks your posture in short intervals, then stays out of
                the way. It waits for a pattern — five slouched snapshots in a row —
                before it nudges you.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                <a
                  href={DOWNLOAD_URL}
                  download="SpineSpy.dmg"
                  className="btn-primary"
                >
                  <Download className="w-5 h-5" />
                  Download for macOS
                </a>
                <a href="#demo" className="btn-secondary">
                  <Play className="w-5 h-5" aria-hidden="true" />
                  Watch demo
                </a>
                <a
                  href="https://github.com/jananadiw/spinespy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Github className="w-5 h-5" />
                  View Source
                </a>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--charcoal-light)]"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[var(--coral)]" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[var(--sage)]" />
                  <span>Apple Silicon</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Menubar mockup */}
              <div className="flex justify-center mb-8">
                <MenubarMockup />
              </div>

              {/* Spine illustration */}
              <div className="relative flex justify-center">
                <SpineIllustration className="w-32 h-64 text-[var(--coral)] opacity-20" />

                <motion.span
                  aria-hidden="true"
                  className="absolute -top-5 left-6 text-5xl emoji-hero"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  🦥
                </motion.span>

                {/* Floating feature hints */}
                <motion.div
                  className="absolute top-0 right-0 glass-card p-3 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[var(--sage)]" />
                    Posture Detection
                  </span>
                </motion.div>

                <motion.div
                  className="absolute bottom-12 left-0 glass-card p-3 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[var(--coral)]" />
                    Phone Detection
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-sm text-[var(--charcoal-light)]">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-[var(--charcoal-light)] scroll-indicator" />
          </motion.div>
        </motion.div>
      </section>

      {/* Product Demo */}
      <section id="demo" aria-labelledby="demo-heading" className="py-16 sm:py-24 relative scroll-mt-24">
        <div className="container-wide grid lg:grid-cols-[2fr_3fr] items-center gap-8 lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="text-base font-semibold tracking-tight text-[var(--coral)] mb-3">
              70-second product demo
            </p>
            <h2 id="demo-heading" className="text-4xl sm:text-5xl font-bold leading-[1.1] mb-6">
              See SpineSpy in action
            </h2>
            <p id="demo-description" className="text-xl text-[var(--charcoal-light)] leading-relaxed">
              Take a look at SpineSpy running on a Mac. Press play to watch the demo.
              This recording has no audio.
            </p>
          </div>
          <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[var(--charcoal)]/10 bg-black shadow-xl">
            <video
              controls
              playsInline
              preload="none"
              poster="/images/spinespy-demo-poster.jpg"
              width={944}
              height={614}
              aria-label="SpineSpy product demo"
              aria-describedby="demo-description"
              className="block w-full h-auto"
            >
              <source src="/videos/spinespy-demo.mp4" type="video/mp4" />
              Your browser does not support embedded video.{' '}
              <a href="/videos/spinespy-demo.mp4">Download the SpineSpy demo.</a>
            </video>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container-wide">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Built for people who
              <br />
              <span
                className="italic text-[var(--coral)]"
              >
                live at their computers
              </span>
            </h2>
            <p className="text-xl text-[var(--charcoal-light)]">
              After hours of focused work, your body pays the price. SpineSpy keeps
              watch so you don&apos;t have to.
            </p>
          </motion.div>

          <PostureComparison />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 relative">
        <div className="container-wide">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Thoughtful features,
              <br />
              <span
                className="italic"
              >
                minimal footprint
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={Eye}
              title="Posture Detection"
              description="Spots forward slouch and side tilt from single frames — not a continuous camera feed."
              emoji="👀"
              delay={0}
            />
            <FeatureCard
              icon={Smartphone}
              title="Phone Spotting"
              description="Notices when you reach for your phone during focus time, without recording a continuous video of your desk."
              emoji="📱"
              delay={0.1}
            />
            <FeatureCard
              icon={Clock}
              title="Configurable Intervals"
              description="Check every 30 seconds, 1, 2, or 5 minutes. Your pace, your preference."
              emoji="⏱️"
              delay={0.2}
            />
            <FeatureCard
              icon={Volume2}
              title="Smart Alerts"
              description="Only notifies after 5 consecutive bad snapshots. No false alarm fatigue."
              emoji="🔔"
              delay={0.3}
            />
            <FeatureCard
              icon={Pause}
              title="Pause Anytime"
              description="Need a break? Toggle monitoring on/off with a single click from the menubar."
              emoji="⏸️"
              delay={0.4}
            />
            <FeatureCard
              icon={Shield}
              title="Open by Design"
              description="Inspect the code, verify how detection works, or adapt it. MIT-licensed and built for Apple Silicon Macs."
              emoji="↗"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 relative">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                How it
                <br />
                <span
                  className="italic"
                >
                  works
                </span>
              </h2>
              <p className="text-xl text-[var(--charcoal-light)] mb-12">
                Simple, unobtrusive, and respectful of your privacy.
              </p>

              <div className="space-y-8">
                <HowItWorksStep
                  number={1}
                  title="Periodic Snapshots"
                  description="Every N minutes, SpineSpy briefly opens your camera and captures a single frame."
                  delay={0.1}
                />
                <HowItWorksStep
                  number={2}
                  title="Local Analysis"
                  description="The frame is checked on your Mac for slouching and phone use. The camera closes immediately."
                  delay={0.2}
                />
                <HowItWorksStep
                  number={3}
                  title="Status Update"
                  description={<>Menubar icon updates: <ProductIcon /> (good) or <ProductIcon shrimp /> (needs attention). At a glance, always.</>}
                  delay={0.3}
                />
                <HowItWorksStep
                  number={4}
                  title="Smart Alert"
                  description="After 5 consecutive bad snapshots, you'll hear a gentle reminder to straighten up."
                  delay={0.4}
                />
              </div>
            </motion.div>

            {/* macOS Window Mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="macos-window max-w-md mx-auto">
                <div className="macos-titlebar">
                  <div className="macos-btn macos-btn-close" />
                  <div className="macos-btn macos-btn-minimize" />
                  <div className="macos-btn macos-btn-maximize" />
                </div>
                <div className="p-6 text-white text-sm leading-relaxed">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-semibold">Recent posture checks</span>
                    <span className="text-xs text-gray-400">Camera off</span>
                  </div>
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between text-gray-300">
                      <span>10:24</span>
                      <span className="text-green-400">Good posture</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>10:26</span>
                      <span className="text-yellow-400">Slouch · 1/5</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>10:28</span>
                      <span className="text-yellow-400">Slouch · 2/5</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>10:30</span>
                      <span className="text-yellow-400">Slouch · 3/5</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>10:32</span>
                      <span className="text-yellow-400">Slouch · 4/5</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-white">
                      <span>10:34</span>
                      <span className="text-[var(--sage-light)]">Reminder sent · 5/5</span>
                    </div>
                  </div>
                  <motion.div
                    className="mt-5 h-1 rounded-full bg-[var(--sage)]"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Floating menu mockup */}
              <motion.div
                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 glass-card w-[350px] max-w-full p-4 shadow-xl"
                aria-label="SpineSpy control panel preview"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2 text-sm text-[var(--charcoal)]">
                  <div>Pause Monitoring</div>
                  <div className="text-xs text-[var(--charcoal-light)] opacity-60">Next capture: 2:50:06 PM</div>
                  <div className="text-xs text-[var(--charcoal-light)] opacity-60">Camera: Off · FaceTime HD Camera (Display)</div>
                  <div className="flex items-center justify-between gap-4">Interval <ChevronRight className="w-4 h-4" aria-hidden="true" /></div>
                  <div className="flex items-center justify-between gap-4">Settings <ChevronRight className="w-4 h-4" aria-hidden="true" /></div>
                  <div className="border-t border-[var(--charcoal)]/15 my-2" />
                  <div>Calibrate</div>
                  <div>Save Snapshot</div>
                  <div>Test Alert</div>
                  <div>Quit</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container-wide">
          <motion.div
            className="privacy-panel p-6 sm:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mb-10">
              <span className="trust-badge mb-5">
                <Lock className="trust-badge-icon" aria-hidden="true" />
                Privacy, in plain terms
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                One frame, then the camera closes.
              </h2>
              <p className="text-xl text-[var(--charcoal-light)]">
                No continuous feed. No cloud processing. You control every check.
              </p>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="privacy-fact md:border-r">
                <Clock className="w-6 h-6" />
                <div>
                  <h3>When does it open?</h3>
                  <p>Only at the interval you choose: 30 seconds, 1, 2, or 5 minutes.</p>
                </div>
              </div>
              <div className="privacy-fact">
                <Eye className="w-6 h-6" />
                <div>
                  <h3>For how long?</h3>
                  <p>Long enough to capture one frame. The camera closes as soon as the check is done.</p>
                </div>
              </div>
              <div className="privacy-fact md:border-r md:border-b-0">
                <Lock className="w-6 h-6" />
                <div>
                  <h3>What leaves your Mac?</h3>
                  <p>Nothing. Video, snapshots, and posture results are never uploaded.</p>
                </div>
              </div>
              <div className="privacy-fact border-b-0">
                <Pause className="w-6 h-6" />
                <div>
                  <h3>How do I stop it?</h3>
                  <p>Open SpineSpy in the menubar and pause monitoring with one click.</p>
                </div>
              </div>
            </div>

            <a
              href="https://github.com/jananadiw/spinespy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-semibold hover:text-[var(--coral)] transition-colors"
            >
              <Github className="w-5 h-5" />
              Verify it in the open-source code
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative">
        <div className="container-wide">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="emoji-hero text-7xl mb-6 inline-block"><ProductIcon /></span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Better posture,
              <br />
              <span className="italic text-[var(--coral)]">one quiet nudge at a time.</span>
            </h2>
            <p className="text-xl text-[var(--charcoal-light)] mb-10">
              Download SpineSpy for macOS. It&apos;s free, open source, and built to
              keep your camera data on your Mac.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <a
                href={DOWNLOAD_URL}
                download="SpineSpy.dmg"
                className="btn-primary text-lg py-4 px-8"
              >
                <Download className="w-6 h-6" />
                Download for macOS
              </a>
              <a
                href="https://github.com/jananadiw/spinespy"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg py-4 px-8"
              >
                <Github className="w-6 h-6" />
                Star on GitHub
              </a>
            </div>

            <p className="text-sm text-[var(--charcoal-light)]">
              Requires macOS 15+ • Apple Silicon
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--charcoal)] border-opacity-10">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl"><ProductIcon /></span>
              <span className="font-bold text-lg">SpineSpy</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-[var(--charcoal-light)]">
              <a
                href="https://github.com/jananadiw/spinespy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--charcoal)] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/jananadiw/spinespy/releases"
                className="hover:text-[var(--charcoal)] transition-colors"
              >
                Releases
              </a>
              <a
                href="https://github.com/jananadiw/spinespy/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--charcoal)] transition-colors"
              >
                MIT License
              </a>
            </div>

            <div className="text-sm text-[var(--charcoal-light)]">
              Made with <ProductIcon /> for better posture
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
