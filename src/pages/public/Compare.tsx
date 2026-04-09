import React from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const COMPETITORS = [
  { name: "Hi-SEO", highlight: true, color: "#3b82f6", price: "From Free", naira: true },
  { name: "Ahrefs", highlight: false, color: "#64748b", price: "$99/mo", naira: false },
  { name: "SEMrush", highlight: false, color: "#64748b", price: "$119/mo", naira: false },
  { name: "Moz Pro", highlight: false, color: "#64748b", price: "$99/mo", naira: false },
]

const COMPARE_FEATURES = [
  { category: "Core SEO Tools", isHeader: true },
  {
    feature: "Keyword Research",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },
  {
    feature: "Site Audit",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },
  {
    feature: "Rank Tracking",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },
  {
    feature: "Backlink Analytics",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },
  {
    feature: "Competitor Analysis",
    hiseo: true, ahrefs: true, semrush: true, moz: "Limited",
    note: "",
  },
  {
    feature: "SERP Analysis",
    hiseo: true, ahrefs: true, semrush: true, moz: false,
    note: "",
  },
  {
    feature: "Site Explorer",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },

  { category: "AI and Content", isHeader: true },
  {
    feature: "AI Content Writer",
    hiseo: true, ahrefs: false, semrush: "Addon", moz: false,
    note: "Hi-SEO includes AI writing in all paid plans",
  },
  {
    feature: "Content Strategy Tools",
    hiseo: true, ahrefs: false, semrush: true, moz: false,
    note: "",
  },
  {
    feature: "Content Brief Generator",
    hiseo: true, ahrefs: false, semrush: "Addon", moz: false,
    note: "",
  },

  { category: "Pricing and Access", isHeader: true },
  {
    feature: "Free Plan Available",
    hiseo: true, ahrefs: false, semrush: false, moz: false,
    note: "Hi-SEO is the only platform with a truly free tier",
  },
  {
    feature: "Naira Pricing",
    hiseo: true, ahrefs: false, semrush: false, moz: false,
    note: "Pay in NGN via Paystack",
  },
  {
    feature: "Paystack Payment",
    hiseo: true, ahrefs: false, semrush: false, moz: false,
    note: "",
  },
  {
    feature: "Starting Price",
    hiseo: "Free", ahrefs: "$99/mo", semrush: "$119/mo", moz: "$99/mo",
    note: "",
  },
  {
    feature: "No Credit Card to Start",
    hiseo: true, ahrefs: false, semrush: false, moz: false,
    note: "",
  },

  { category: "Reports and Export", isHeader: true },
  {
    feature: "PDF Reports",
    hiseo: true, ahrefs: "Limited", semrush: true, moz: true,
    note: "",
  },
  {
    feature: "CSV Export",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },
  {
    feature: "White-label Reports",
    hiseo: "Business+", ahrefs: false, semrush: "Agency", moz: false,
    note: "",
  },

  { category: "Support", isHeader: true },
  {
    feature: "Email Support",
    hiseo: true, ahrefs: true, semrush: true, moz: true,
    note: "",
  },
  {
    feature: "Priority Support",
    hiseo: "Pro+", ahrefs: "Paid only", semrush: "Paid only", moz: "Paid only",
    note: "",
  },
  {
    feature: "Dedicated Manager",
    hiseo: "Agency", ahrefs: "Enterprise", semrush: "Enterprise", moz: "Enterprise",
    note: "",
  },
]

function CheckIcon({ color = "#10b981" }: { color?: string }) {
  return (
    <div className="flex justify-center">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    </div>
  )
}

function XIcon() {
  return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.08)" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    </div>
  )
}

function CellValue({ value, isHiSeo }: { value: boolean | string; isHiSeo?: boolean }) {
  if (value === true) return <CheckIcon color={isHiSeo ? "#3b82f6" : "#10b981"} />
  if (value === false) return <XIcon />
  return (
    <div className="text-center">
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: isHiSeo ? "rgba(59,130,246,0.1)" : "rgba(100,116,139,0.1)",
          color: isHiSeo ? "#3b82f6" : "#64748b",
        }}
      >
        {value}
      </span>
    </div>
  )
}

export default function Compare() {
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
            Hi-SEO vs the competition
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            Why teams choose{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hi-SEO
            </span>{" "}
            over the alternatives
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed mb-10 font-medium"
          >
            See how Hi-SEO stacks up against Ahrefs, SEMrush, and Moz Pro feature by feature. Spoiler: we do more for less.
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
              Try Hi-SEO Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              See Pricing
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* QUICK WINS */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Only platform with a free plan", icon: "gift", color: "#10b981" },
              { label: "Naira pricing via Paystack", icon: "credit", color: "#3b82f6" },
              { label: "AI writer included in paid plans", icon: "zap", color: "#f97316" },
              { label: "All tools in one workspace", icon: "layers", color: "#a855f7" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...fadeUp(i * 0.1)}
                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                >
                  {item.icon === "gift" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>}
                  {item.icon === "credit" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
                  {item.icon === "zap" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  {item.icon === "layers" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>}
                </div>
                <p className="text-sm font-bold text-slate-700 leading-snug">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-10 bg-white">
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Full feature comparison
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              A transparent, side-by-side look at Hi-SEO vs the most popular SEO tools on the market.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[680px] bg-white">
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th className="text-left p-5 text-sm font-bold text-slate-500 w-[32%]">Feature</th>
                  {COMPETITORS.map((comp) => (
                    <th key={comp.name} className="p-5 text-center" style={{ background: comp.highlight ? "rgba(59,130,246,0.04)" : "transparent" }}>
                      <div
                        className="text-sm font-black mb-1"
                        style={{ color: comp.highlight ? "#3b82f6" : "#0f172a" }}
                      >
                        {comp.name}
                        {comp.highlight && (
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black"
                            style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                      <div
                        className="text-xs font-semibold"
                        style={{ color: comp.highlight ? "#10b981" : "#94a3b8" }}
                      >
                        {comp.price}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FEATURES.map((row, i) => {
                  if ("isHeader" in row && row.isHeader) {
                    return (
                      <tr key={row.category} style={{ background: "rgba(248,250,252,1)", borderBottom: "1px solid #e2e8f0", borderTop: "1px solid #e2e8f0" }}>
                        <td colSpan={5} className="px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                          {row.category}
                        </td>
                      </tr>
                    )
                  }
                  const dataRow = row as {
                    feature: string
                    hiseo: boolean | string
                    ahrefs: boolean | string
                    semrush: boolean | string
                    moz: boolean | string
                    note: string
                  }
                  return (
                    <tr
                      key={dataRow.feature}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="p-4">
                        <div className="text-sm font-semibold text-slate-700">{dataRow.feature}</div>
                        {dataRow.note && (
                          <div className="text-xs text-blue-500 font-medium mt-0.5">{dataRow.note}</div>
                        )}
                      </td>
                      <td className="p-4" style={{ background: "rgba(59,130,246,0.03)" }}>
                        <CellValue value={dataRow.hiseo} isHiSeo={true} />
                      </td>
                      <td className="p-4"><CellValue value={dataRow.ahrefs} /></td>
                      <td className="p-4"><CellValue value={dataRow.semrush} /></td>
                      <td className="p-4"><CellValue value={dataRow.moz} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </motion.div>

          <motion.p {...fadeUp(0.2)} className="text-center text-xs text-slate-400 font-medium mt-4">
            Data based on publicly available information. Prices shown in USD for comparison. Hi-SEO pricing is in NGN.
          </motion.p>
        </div>
      </section>

      {/* WHY WE WIN */}
      <section className="py-20" style={{ background: "#f8fafc" }}>
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              The Hi-SEO advantage
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Three reasons teams switch from expensive tools and never look back.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Built for emerging markets",
                desc: "Unlike Ahrefs and SEMrush which are built primarily for Western markets, Hi-SEO is designed with Nigerian businesses, agencies, and African search markets in mind. Naira pricing, Paystack integration, and local support.",
                color: "#3b82f6",
              },
              {
                number: "02",
                title: "All-in-one at a fraction of the cost",
                desc: "Ahrefs charges $99 per month just for one tool. SEMrush charges $119. Hi-SEO gives you everything - keyword research, audits, rank tracking, backlinks, AI writing, and more - starting completely free.",
                color: "#f97316",
              },
              {
                number: "03",
                title: "AI tools included, not an addon",
                desc: "Most platforms charge extra for AI features or do not offer them at all. Hi-SEO includes an AI content writer, content strategy tools, and SEO brief generator in all paid plans at no extra cost.",
                color: "#10b981",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.12)}
                className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className="text-5xl font-black mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}80)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {item.number}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
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
              Make the switch to Hi-SEO today
            </h2>
            <p className="text-blue-200/60 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Start free with no credit card. Get access to every core SEO tool immediately and upgrade when you need more power.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 28px rgba(249,115,22,0.5)" }}
              >
                Start Free Today
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
