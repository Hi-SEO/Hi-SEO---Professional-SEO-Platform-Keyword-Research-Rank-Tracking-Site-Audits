import React from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

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
    tagline: "Find the exact keywords your audience is searching for",
    desc: "Discover thousands of keyword ideas with accurate search volume, keyword difficulty scores, CPC data, and search intent classification. Filter by difficulty, volume, or intent to find your perfect target keywords instantly.",
    bullets: [
      "Real search volume data updated monthly",
      "Keyword difficulty scored 0 to 100",
      "Search intent: informational, navigational, commercial, transactional",
      "Related keywords and question-based suggestions",
      "Save keywords to your project with one click",
    ],
    color: "blue",
    accent: "#3b82f6",
  },
  {
    icon: "shield",
    title: "Site Audit",
    tagline: "Fix technical SEO issues before they tank your rankings",
    desc: "Run a comprehensive technical audit across your entire website in seconds. Our crawler checks over 100 SEO factors and gives you a health score from 0 to 100 with prioritized action items sorted by impact.",
    bullets: [
      "Full crawl of all pages including subpages",
      "Critical, warning, and passed issue breakdown",
      "Meta tags, headings, images, and link checks",
      "Page speed and Core Web Vitals signals",
      "Save and compare audit history over time",
    ],
    color: "cyan",
    accent: "#06b6d4",
  },
  {
    icon: "trending",
    title: "Rank Tracker",
    tagline: "Know exactly where you stand in search every single day",
    desc: "Track your keyword rankings across Google and other major search engines with daily updates. Visualize position history with beautiful charts and get instant alerts when rankings change significantly.",
    bullets: [
      "Daily rank updates for all tracked keywords",
      "Position history charts going back 90 days",
      "Track rankings for multiple projects simultaneously",
      "See rank changes at a glance with color indicators",
      "Export ranking reports for clients",
    ],
    color: "orange",
    accent: "#f97316",
  },
  {
    icon: "link",
    title: "Backlink Analytics",
    tagline: "Build and monitor a backlink profile that search engines love",
    desc: "Analyze your complete backlink profile in detail. Monitor new and lost backlinks, evaluate domain authority, identify toxic links, and discover link building opportunities your competitors are missing.",
    bullets: [
      "Full backlink discovery and monitoring",
      "Domain authority and page authority scores",
      "Anchor text distribution analysis",
      "New and lost link notifications",
      "Toxic link identification and disavow support",
    ],
    color: "purple",
    accent: "#a855f7",
  },
  {
    icon: "users",
    title: "Competitor Analysis",
    tagline: "See exactly what your competitors are doing and do it better",
    desc: "Get a complete picture of your competitive landscape. Discover which keywords your competitors rank for that you do not, where their backlinks come from, and what content is driving their traffic.",
    bullets: [
      "Side-by-side competitor domain comparison",
      "Keyword gap analysis to find missed opportunities",
      "Competitor backlink source discovery",
      "Top performing competitor pages revealed",
      "Track up to 10 competitors per project",
    ],
    color: "green",
    accent: "#10b981",
  },
  {
    icon: "zap",
    title: "AI Content Writer",
    tagline: "Create SEO-optimized content that ranks from day one",
    desc: "Generate high-quality SEO content using AI trained on top-ranking pages in your niche. Create full articles, outlines, meta descriptions, title tags, and content briefs in seconds.",
    bullets: [
      "Full article generation from keyword input",
      "SEO-optimized title and meta description writer",
      "Content brief and outline creator",
      "NLP-based keyword integration suggestions",
      "Export to markdown, HTML, or plain text",
    ],
    color: "amber",
    accent: "#f59e0b",
  },
  {
    icon: "globe",
    title: "Site Explorer",
    tagline: "Deep-dive into any domain to uncover SEO insights",
    desc: "Enter any domain and instantly see its full SEO profile. Discover top pages, ranking keywords, estimated traffic, backlink count, and authority metrics for any website in seconds.",
    bullets: [
      "Full domain SEO overview in seconds",
      "Top pages by estimated organic traffic",
      "All ranking keywords for any domain",
      "Traffic estimation and trend data",
      "Works on competitor domains too",
    ],
    color: "blue",
    accent: "#3b82f6",
  },
  {
    icon: "bar",
    title: "SERP Analysis",
    tagline: "Understand exactly what it takes to rank on page one",
    desc: "Analyze the full search engine results page for any keyword. See what content format, word count, backlink count, and domain authority the top 10 results have so you know exactly what to beat.",
    bullets: [
      "Full SERP breakdown for any keyword",
      "Top 10 results with metrics displayed",
      "Content length and format analysis",
      "Featured snippet opportunity detection",
      "People Also Ask question mining",
    ],
    color: "cyan",
    accent: "#06b6d4",
  },
  {
    icon: "file",
    title: "Reports and Projects",
    tagline: "Manage everything and impress clients with beautiful reports",
    desc: "Organize all your SEO work into projects. Generate beautiful client-ready reports that show keyword rankings, audit scores, backlink growth, and traffic trends in one professional document.",
    bullets: [
      "Multi-project workspace management",
      "Client-ready PDF and CSV report export",
      "Audit, keyword, and ranking report types",
      "Report scheduling and automation",
      "White-label friendly report design",
    ],
    color: "green",
    accent: "#10b981",
  },
]

const WORKFLOW = [
  {
    step: "01",
    title: "Audit your site",
    desc: "Start with a full technical audit to find and fix everything holding your site back from ranking.",
  },
  {
    step: "02",
    title: "Research keywords",
    desc: "Find high-opportunity keywords your target audience is searching for and your competitors are missing.",
  },
  {
    step: "03",
    title: "Create content",
    desc: "Use the AI writer to generate SEO-optimized content that targets your chosen keywords perfectly.",
  },
  {
    step: "04",
    title: "Build backlinks",
    desc: "Discover link building opportunities and monitor your backlink profile as it grows over time.",
  },
  {
    step: "05",
    title: "Track rankings",
    desc: "Watch your keywords climb in search results and share beautiful ranking reports with your team or clients.",
  },
]

function FeatureIcon({ type, accent }: { type: string; accent: string }) {
  const props = { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: accent, strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
    >
      {type === "search" && <svg {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>}
      {type === "shield" && <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      {type === "trending" && <svg {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>}
      {type === "link" && <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
      {type === "users" && <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
      {type === "zap" && <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
      {type === "globe" && <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
      {type === "bar" && <svg {...props}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
      {type === "file" && <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>}
    </div>
  )
}

export default function Features() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative py-28 lg:py-36 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.25) 0%, transparent 70%)" }} />
        <div className="hero-blob hero-blob-blue animate-blob" style={{ width: "600px", height: "600px", top: "-200px", right: "-150px", opacity: 0.3 }} />
        <div className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2" style={{ width: "400px", height: "400px", bottom: "-100px", left: "-100px", opacity: 0.2 }} />

        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Everything included in every plan
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            Every SEO tool you need,{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              perfectly integrated
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed mb-10 font-medium"
          >
            Hi-SEO brings together 9 powerful SEO tools in one premium workspace. No switching tabs, no separate subscriptions, no data silos.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 24px rgba(249,115,22,0.45)" }}
            >
              Start Free Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              9 tools. One premium workspace.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Each tool is purpose-built for a specific SEO workflow and deeply integrated with the others for maximum efficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeUp(i * 0.07)}
                className="group p-7 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
                />
                <FeatureIcon type={feature.icon} accent={feature.accent} />
                <h3 className="text-lg font-black text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-xs font-bold mb-3" style={{ color: feature.accent }}>{feature.tagline}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={feature.accent} strokeWidth="3" className="shrink-0 mt-0.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07123f 0%, #0b1729 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-blue animate-blob" style={{ width: "500px", height: "500px", top: "-100px", right: "-100px", opacity: 0.2 }} />

        <div className="section-container relative z-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }}
            >
              The Hi-SEO workflow
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              A complete SEO workflow in one loop
            </h2>
            <p className="text-blue-200/60 text-lg leading-relaxed">
              Every tool feeds into the next. Hi-SEO is designed as a continuous improvement loop that compounds your results over time.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.4), rgba(6,182,212,0.4), rgba(249,115,22,0.4))" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {WORKFLOW.map((step, i) => (
                <motion.div
                  key={step.step}
                  {...fadeUp(i * 0.12)}
                  className="relative text-center"
                >
                  <div className="flex justify-center mb-5">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black relative z-10"
                      style={{
                        background: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
                        boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                        color: "white",
                      }}
                    >
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-base font-black text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-blue-200/50 leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Hi-SEO vs buying separate tools
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Why pay for 5 subscriptions when one premium platform does it all better?
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                <div className="p-5 font-bold text-sm text-slate-500">Feature</div>
                <div className="p-5 text-center font-black text-sm text-slate-900 border-l border-slate-200">Separate Tools</div>
                <div
                  className="p-5 text-center font-black text-sm text-white border-l border-blue-600"
                  style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
                >
                  Hi-SEO
                </div>
              </div>
              {[
                { feature: "Keyword Research", separate: "Separate subscription", hiseo: true },
                { feature: "Site Audit", separate: "Separate subscription", hiseo: true },
                { feature: "Rank Tracking", separate: "Separate subscription", hiseo: true },
                { feature: "Backlink Analytics", separate: "Separate subscription", hiseo: true },
                { feature: "Competitor Analysis", separate: "Separate subscription", hiseo: true },
                { feature: "AI Content Writer", separate: "Separate subscription", hiseo: true },
                { feature: "Unified dashboard", separate: "No", hiseo: true },
                { feature: "Naira pricing", separate: "No", hiseo: true },
                { feature: "Monthly cost", separate: "NGN 200,000+", hiseo: "From Free" },
              ].map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                >
                  <div className="p-4 text-sm font-semibold text-slate-700">{row.feature}</div>
                  <div className="p-4 text-center border-l border-slate-100">
                    {typeof row.separate === "boolean" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="mx-auto">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    ) : (
                      <span className="text-sm text-slate-500 font-medium">{row.separate}</span>
                    )}
                  </div>
                  <div className="p-4 text-center border-l border-blue-100" style={{ background: "rgba(59,130,246,0.04)" }}>
                    {typeof row.hiseo === "boolean" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="mx-auto">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold text-blue-600">{row.hiseo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-orange animate-blob" style={{ width: "400px", height: "400px", top: "-80px", right: "-80px", opacity: 0.2 }} />

        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Ready to try every feature for free?
            </h2>
            <p className="text-blue-200/60 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Start your free account today. No credit card required. Access all core tools immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 28px rgba(249,115,22,0.5)" }}
              >
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                See Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
