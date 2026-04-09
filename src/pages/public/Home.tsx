import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const FEATURES = [
  {
    icon: "search",
    title: "Keyword Explorer",
    desc: "Discover high-impact keywords with real search volume, difficulty scores, and intent classification. Find the exact terms your audience is searching for.",
    color: "blue",
  },
  {
    icon: "shield",
    title: "Site Audit",
    desc: "Run a full technical SEO audit in seconds. Get a scored health report with critical issues, warnings, and actionable fixes organized by priority.",
    color: "cyan",
  },
  {
    icon: "trending",
    title: "Rank Tracker",
    desc: "Track your keyword positions daily across all major search engines. See gains and drops instantly with visual history charts.",
    color: "orange",
  },
  {
    icon: "link",
    title: "Backlink Analytics",
    desc: "Analyze your entire backlink profile. Monitor new and lost links, domain authority scores, and identify toxic links before they hurt your rankings.",
    color: "purple",
  },
  {
    icon: "users",
    title: "Competitor Analysis",
    desc: "Spy on your top competitors. See exactly which keywords they rank for, their backlink sources, and content gaps you can exploit.",
    color: "green",
  },
  {
    icon: "zap",
    title: "AI Content Writer",
    desc: "Generate SEO-optimized content briefs, outlines, and full articles using AI trained on top-ranking pages. Publish content that actually ranks.",
    color: "amber",
  },
]

const STEPS = [
  {
    number: "01",
    title: "Connect your website",
    desc: "Add your domain to Hi-SEO in seconds. No code, no plugins, no complicated setup. Just enter your URL and we do the rest.",
    color: "blue",
  },
  {
    number: "02",
    title: "Run your first audit",
    desc: "Get an instant health score with a full breakdown of issues holding your site back. Our AI prioritizes what to fix first for maximum impact.",
    color: "cyan",
  },
  {
    number: "03",
    title: "Track and grow",
    desc: "Monitor rankings, fix issues, build content, and watch your organic traffic climb. Hi-SEO gives you one focused place to manage everything.",
    color: "orange",
  },
]

const TESTIMONIALS = [
  {
    name: "Chukwuemeka A.",
    role: "Founder, GrowthStack",
    text: "Hi-SEO replaced four separate tools for us. The keyword research and site audit alone saved us over 8 hours per week. Our organic traffic is up 280 percent in four months.",
    rating: 5,
    avatar: "C",
    color: "#3b82f6",
  },
  {
    name: "Fatima D.",
    role: "SEO Lead, MediaPulse NG",
    text: "The rank tracking and competitor analysis features are incredibly powerful. We identified keyword gaps our competitors had and ranked for them within weeks.",
    rating: 5,
    avatar: "F",
    color: "#f97316",
  },
  {
    name: "James O.",
    role: "Agency Owner, SERPcraft",
    text: "I manage 12 client websites from one Hi-SEO dashboard. The reporting is beautiful, the audits are thorough, and my clients love the results we deliver.",
    rating: 5,
    avatar: "J",
    color: "#06b6d4",
  },
]

const FAQS = [
  {
    q: "Is Hi-SEO really free to start?",
    a: "Yes. Our Starter plan is completely free and includes site audits, keyword research, rank tracking, and basic reports. No credit card required to sign up.",
  },
  {
    q: "How accurate is the keyword data?",
    a: "Hi-SEO pulls keyword volume and difficulty data from multiple trusted sources and refreshes it regularly. Our data is comparable to industry-leading tools at a fraction of the cost.",
  },
  {
    q: "Can I manage multiple websites?",
    a: "Yes. The Pro plan supports up to 10 projects, Business supports 50, and our Agency plan has unlimited projects. Each project gets its own dashboard, audits, and reports.",
  },
  {
    q: "How does the site audit work?",
    a: "Our crawler scans every page of your website and checks over 100 SEO factors including page speed, meta tags, headings, internal links, mobile friendliness, and more. You get a health score from 0 to 100 with prioritized fixes.",
  },
  {
    q: "Do you support Nigerian businesses and payment?",
    a: "Absolutely. Hi-SEO is built with Nigerian founders and agencies in mind. We accept payment in Naira via Paystack and our pricing is designed to be accessible for the Nigerian market.",
  },
  {
    q: "Can I cancel or downgrade at any time?",
    a: "Yes, always. There are no contracts or lock-in periods. You can upgrade, downgrade, or cancel your plan at any time from your billing dashboard.",
  },
]

function FeatureIcon({ type, color }: { type: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6", cyan: "#06b6d4", orange: "#f97316",
    purple: "#a855f7", green: "#10b981", amber: "#f59e0b",
  }
  const c = colorMap[color] || "#3b82f6"
  const bgMap: Record<string, string> = {
    blue: "rgba(59,130,246,0.15)", cyan: "rgba(6,182,212,0.15)",
    orange: "rgba(249,115,22,0.15)", purple: "rgba(168,85,247,0.15)",
    green: "rgba(16,185,129,0.15)", amber: "rgba(245,158,11,0.15)",
  }
  const bg = bgMap[color] || "rgba(59,130,246,0.15)"
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
      style={{ background: bg, border: `1px solid ${c}30` }}
    >
      {type === "search" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>}
      {type === "shield" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      {type === "trending" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>}
      {type === "link" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
      {type === "users" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
      {type === "zap" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
    </div>
  )
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      {...fadeUp(index * 0.07)}
      className="border-b border-white/8 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
          {q}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)",
            border: open ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <motion.svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={open ? "#60a5fa" : "rgba(255,255,255,0.5)"} strokeWidth="2.5"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-white/55 leading-relaxed font-medium">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="overflow-x-hidden">

      {/* ============ HERO ============ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 60%, #0b1729 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.25) 0%, transparent 70%)" }} />

        <div className="hero-blob hero-blob-blue animate-blob" style={{ width: "700px", height: "700px", top: "-200px", right: "-200px", opacity: 0.35 }} />
        <div className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2" style={{ width: "500px", height: "500px", bottom: "-150px", left: "-150px", opacity: 0.25 }} />
        <div className="hero-blob hero-blob-orange animate-blob-slow animate-blob-delay-1" style={{ width: "300px", height: "300px", top: "40%", right: "10%", opacity: 0.2 }} />

        <div className="section-container relative z-10 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
              style={{
                background: "rgba(249,115,22,0.15)",
                border: "1px solid rgba(249,115,22,0.3)",
                color: "#fb923c",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Premium SEO SaaS for modern teams
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
            >
              Turn SEO into a{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                clear, beautiful
              </span>{" "}
              workflow
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
            >
              Hi-SEO helps you manage keyword research, audits, backlinks, rankings, reports, and content strategy in one premium dashboard. Stop switching between tools and start growing.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(249,115,22,0.6)]"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea6c04)",
                  boxShadow: "0 4px 24px rgba(249,115,22,0.45)",
                }}
              >
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/features"
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Explore Features
              </Link>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {[
                { icon: "shield", label: "Built for founders, marketers, and agencies" },
                { icon: "lock", label: "Secure auth and workspace control" },
                { icon: "zap", label: "Fast SEO workflows in one dashboard" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/60"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {badge.icon === "shield" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                  {badge.icon === "lock" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
                  {badge.icon === "zap" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: "10+", label: "SEO tools" },
              { value: "1 click", label: "Fast audits" },
              { value: "Real time", label: "Dashboard updates" },
              { value: "Free +", label: "Premium plans" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-5 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs font-semibold text-white/45 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="py-14 bg-white">
        <div className="section-container">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            {["TechCorp NG", "GrowthStack", "MediaPulse", "SERPcraft", "DigitalFirst", "WebAgency"].map((brand) => (
              <span key={brand} className="text-slate-500 font-black text-lg tracking-tight">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 bg-blue-50 text-blue-600 border border-blue-100">
              Everything you need
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              One platform for every SEO workflow
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Stop paying for 5 different tools. Hi-SEO combines keyword research, audits, rank tracking, backlinks, competitor analysis, and AI content in one premium workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeUp(i * 0.08)}
                className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_16px_48px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-2 cursor-default relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.02), rgba(6,182,212,0.02))" }} />
                <FeatureIcon type={feature.icon} color={feature.color} />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="text-center mt-12">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all duration-200"
            >
              View all features
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-cyan animate-blob" style={{ width: "500px", height: "500px", top: "-100px", right: "-100px", opacity: 0.2 }} />

        <div className="section-container relative z-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
            >
              Quick and easy setup
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Get ranking results in three steps
            </h2>
            <p className="text-blue-200/60 text-lg leading-relaxed">
              No technical knowledge required. Hi-SEO is designed to get you from zero to ranking insights in under 5 minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                {...fadeUp(i * 0.15)}
                className="relative group"
              >
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-10 left-[calc(100%_-_16px)] w-1/2 h-0.5 z-10"
                    style={{ background: "linear-gradient(90deg, rgba(249,115,22,0.6), transparent)" }}
                  />
                )}
                <div
                  className="p-7 rounded-2xl h-full transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="text-4xl font-black"
                      style={{
                        background: step.color === "blue"
                          ? "linear-gradient(135deg, #60a5fa, #3b82f6)"
                          : step.color === "cyan"
                          ? "linear-gradient(135deg, #22d3ee, #06b6d4)"
                          : "linear-gradient(135deg, #fb923c, #f97316)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                  <p className="text-blue-200/55 text-sm leading-relaxed font-medium">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp()}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 bg-orange-50 text-orange-600 border border-orange-100">
                Why Hi-SEO
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Built differently for teams that want real results
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Most SEO tools are built for enterprises with massive budgets. Hi-SEO is built for founders, growing agencies, and marketing teams who need professional-grade results without the enterprise price tag.
              </p>
              <div className="space-y-4">
                {[
                  { title: "No bloat, just workflows", desc: "Every feature in Hi-SEO is designed around a specific SEO workflow. Nothing unnecessary, everything useful." },
                  { title: "Data you can actually act on", desc: "We do not just show you numbers. We tell you what to fix, why it matters, and how to do it." },
                  { title: "Built for the Nigerian market", desc: "Naira pricing, Paystack payments, and tools tuned for African and global search markets." },
                  { title: "Always improving", desc: "New features ship every month. Your feedback directly shapes the product roadmap." },
                ].map((benefit, i) => (
                  <motion.div
                    key={benefit.title}
                    {...fadeUp(i * 0.1)}
                    className="flex items-start gap-4"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">{benefit.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea6c04)",
                    boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                  }}
                >
                  Start Free Today
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
              {[
                { value: "340%", label: "Average traffic increase reported by Pro users in 6 months", color: "blue" },
                { value: "10+", label: "SEO tools combined into one clean dashboard workspace", color: "orange" },
                { value: "98%", label: "Platform uptime guaranteed with real-time monitoring", color: "cyan" },
                { value: "4.9", label: "Average rating from verified users across all plans", color: "green" },
              ].map((metric, i) => (
                <div
                  key={metric.label}
                  className="p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="text-3xl font-black mb-2"
                    style={{
                      background: metric.color === "blue"
                        ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                        : metric.color === "orange"
                        ? "linear-gradient(135deg, #f97316, #fbbf24)"
                        : metric.color === "cyan"
                        ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                        : "linear-gradient(135deg, #10b981, #06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {metric.value}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24" style={{ background: "#f8fafc" }}>
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 bg-blue-50 text-blue-600 border border-blue-100">
              Real results from real users
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Teams that switched to Hi-SEO do not look back
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Here is what founders, SEO leads, and agency owners say after making the switch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.12)}
                className="p-7 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f97316">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 bg-slate-100 text-slate-600 border border-slate-200">
                Frequently asked questions
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Everything you need to know
              </h2>
              <p className="text-slate-500 text-lg">
                Still have questions? We are happy to help.{" "}
                <Link to="/contact" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Contact us
                </Link>
              </p>
            </motion.div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="divide-y divide-slate-100 px-8">
                {FAQS.map((faq, i) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-orange animate-blob" style={{ width: "400px", height: "400px", top: "-100px", right: "-80px", opacity: 0.2 }} />
        <div className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2" style={{ width: "350px", height: "350px", bottom: "-80px", left: "-60px", opacity: 0.18 }} />

        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
              Your competitors are already{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #fb923c, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                using SEO tools.
              </span>
            </h2>
            <p className="text-blue-200/60 text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join Hi-SEO today and start making data-driven decisions that grow your organic traffic. Free forever, upgrade when ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea6c04)",
                  boxShadow: "0 4px 28px rgba(249,115,22,0.5)",
                }}
              >
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                See Pricing
              </Link>
            </div>
            <p className="mt-6 text-white/30 text-sm font-medium">
              No credit card required. Free plan available forever.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
