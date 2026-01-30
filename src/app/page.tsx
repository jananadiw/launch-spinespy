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
  ChevronDown,
  Cpu,
  Lock,
  Monitor,
  Star,
  Coffee,
} from "lucide-react";
import { useRef } from "react";

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
        <span>Mon 10:32 AM</span>
        <span>|</span>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🦸
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
            🦸
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
            🧟
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
          <Icon className="w-6 h-6 text-[var(--charcoal)]" />
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
  description: string;
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

// Tech Stack Badge
function TechBadge({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <motion.span
      className="tech-pill"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
    >
      {name}
    </motion.span>
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
          <div className="glass-card px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦴</span>
              <span className="font-bold text-xl tracking-tight">SpineSpy</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/jananadiw/spinespy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--charcoal-light)] hover:text-[var(--charcoal)] transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://github.com/jananadiw/spinespy/releases"
                className="btn-primary text-sm py-2 px-4"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center pt-24 pb-16 relative">
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
              {/* Privacy Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="privacy-badge">
                  <Lock className="w-4 h-4" />
                  100% Local Processing
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
              >
                Your AI
                <br />
                <span
                  className="italic"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  posture guardian
                </span>
                <br />
                <span className="inline-flex items-center gap-3">
                  in the menubar
                  <span className="emoji-hero text-5xl">🦸</span>
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-xl text-[var(--charcoal-light)] mb-8 max-w-lg leading-relaxed"
              >
                SpineSpy takes periodic snapshots to detect bad posture and phone
                distractions — without keeping your camera always on. Privacy-first,
                runs entirely on your Mac.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                <a
                  href="https://github.com/jananadiw/spinespy/releases"
                  className="btn-primary"
                >
                  <Download className="w-5 h-5" />
                  Download for macOS
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
                className="flex items-center gap-6 text-sm text-[var(--charcoal-light)]"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[var(--coral)]" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[var(--sage)]" />
                  <span>macOS 10.15+</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[var(--peach)]" />
                  <span>MIT License</span>
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

      {/* Pain Points Section */}
      <section className="py-24 relative">
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
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
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
      <section className="py-24 relative">
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
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                minimal footprint
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon={Eye}
              title="Posture Detection"
              description="Uses MediaPipe Pose to detect slouching forward and side tilting. No always-on surveillance."
              emoji="👀"
              delay={0}
            />
            <FeatureCard
              icon={Smartphone}
              title="Phone Spotting"
              description="YOLOv8 object detection catches when you reach for distractions during focus time."
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
              description="Only notifies after 5 consecutive bad snapshots — no false alarm fatigue."
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
              title="Privacy First"
              description="All processing happens locally on your Mac. No data ever leaves your device."
              emoji="🔒"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
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
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
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
                  title="AI Analysis"
                  description="MediaPipe analyzes your posture. YOLOv8 checks for phones. Camera closes immediately."
                  delay={0.2}
                />
                <HowItWorksStep
                  number={3}
                  title="Status Update"
                  description="Menubar icon updates: 🦸 (good) or 🧟 (needs attention). At a glance, always."
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
                <div className="p-6 text-white font-mono text-sm leading-relaxed">
                  <div className="text-gray-500 mb-2">$ python menubar_app.py</div>
                  <div className="text-green-400 mb-1">[INFO] Downloading pose model...</div>
                  <div className="text-green-400 mb-1">[INFO] Model loaded successfully</div>
                  <div className="text-blue-400 mb-1">[DEBUG] Pose detected: 1 people</div>
                  <div className="text-gray-300 mb-1">
                    &nbsp;&nbsp;forward_lean=0.042 tilt=0.018
                  </div>
                  <div className="text-green-400 mb-1">[RESULT] Good posture ✓</div>
                  <div className="text-gray-500 mb-1">---</div>
                  <div className="text-blue-400 mb-1">[DEBUG] Pose detected: 1 people</div>
                  <div className="text-gray-300 mb-1">
                    &nbsp;&nbsp;forward_lean=0.156 tilt=0.032
                  </div>
                  <div className="text-yellow-400 mb-1">[RESULT] Slouching (streak: 1/5)</div>
                  <motion.div
                    className="inline-block"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-white">_</span>
                  </motion.div>
                </div>
              </div>

              {/* Floating menu mockup */}
              <motion.div
                className="absolute -right-4 top-1/2 -translate-y-1/2 glass-card p-4 shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="text-xl">🦸</span> SpineSpy
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[var(--sage)]">
                    ✓ Monitoring
                  </div>
                  <div className="text-[var(--charcoal-light)]">Interval →</div>
                  <div className="border-t border-[var(--cream-dark)] my-2" />
                  <div className="text-[var(--charcoal-light)]">Save Snapshot</div>
                  <div className="text-[var(--charcoal-light)]">Test Alert</div>
                  <div className="text-[var(--charcoal-light)]">Quit</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 relative">
        <div className="container-wide">
          <motion.div
            className="glass-card p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Cpu className="w-8 h-8 text-[var(--coral)]" />
              <h2 className="text-3xl font-bold">Powered by Modern AI</h2>
            </div>
            <p className="text-[var(--charcoal-light)] mb-8 max-w-xl mx-auto">
              Built with battle-tested computer vision libraries for reliable,
              efficient detection.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <TechBadge name="OpenCV" delay={0} />
              <TechBadge name="MediaPipe" delay={0.1} />
              <TechBadge name="YOLOv8" delay={0.2} />
              <TechBadge name="Python" delay={0.3} />
              <TechBadge name="rumps" delay={0.4} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container-wide">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="emoji-hero text-7xl mb-6 inline-block">🦸</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to become a
              <br />
              <span
                className="italic text-[var(--coral)]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                posture superhero?
              </span>
            </h2>
            <p className="text-xl text-[var(--charcoal-light)] mb-10">
              Download SpineSpy and start taking care of your spine today.
              It&apos;s free, open source, and respects your privacy.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <a
                href="https://github.com/jananadiw/spinespy/releases"
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
              Requires macOS 10.15+ • Apple Silicon & Intel supported
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--charcoal)] border-opacity-10">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦴</span>
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
              Made with 🦴 for better posture
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
