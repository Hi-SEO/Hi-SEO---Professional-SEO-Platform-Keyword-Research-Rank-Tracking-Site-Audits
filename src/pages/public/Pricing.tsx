import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const PLANS = [
  {
    name: "Starter",
    desc: "Perfect for individuals and small websites getting started with SEO.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: "Free forever",
    color: "#64748b",
    accent: "slate",
    popular: false,
    cta: "Get Started Free",
    ctaLink: "/signup",
    features: [
      "3 projects",
      "50 keyword searches per month",
      "5 site audits per month",
      "Basic rank tracking (10 keywords)",
      "Basic backlink overview",
      "SEO glossary access",
      "Email support",
    ],
    notIncluded: [
      "Competitor analysis",
      "AI content writer",
      "SERP analysis",
      "Advanced reports",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    desc: "For growing teams and serious SEO professionals who need full power.",
    monthlyPrice: 15000,
    yearlyPrice: 12000,
    color: "#3b82f6",
    accent: "blue",
    popular: true,
    cta: "Start Pro Trial",
    ctaLink: "/signup",
    features: [
      "10 projects",
      "500 keyword searches per month",
      "Unlimited site audits",
      "Full rank tracking (100 keywords)",
      "Complete backlink analytics",
      "Competitor analysis (5 competitors)",
      "AI content writer",
      "SERP analysis",
      "Advanced reports and export",
      "Priority email support",
    ],
    notIncluded: [
      "White-label reports",
      "Agency dashboard",
    ],
  },
  {
    name: "Business",
    desc: "For agencies and businesses managing multiple clients and large SEO campaigns.",
    monthlyPrice: 45000,
    yearlyPrice: 36000,
    color: "#f97316",
    accent: "orange",
    popular: false,
    cta: "Start Business Trial",
    ctaLink: "/signup",
    features: [
      "50 projects",
      "Unlimited keyword searches",
      "Unlimited site audits",
      "Full rank tracking (500 keywords)",
      "Complete backlink analytics",
      "Competitor analysis (10 competitors)",
      "AI content writer",
      "SERP analysis",
      "White-label reports",
      "Advanced analytics dashboard",
      "Priority support",
      "Dedicated onboarding",
    ],
    notIncluded: [
      "Custom integrations",
    ],
  },
  {
    name: "Agency",
    desc: "Custom solution for large agencies and enterprises with unique requirements.",
    monthlyPrice: null,
    yearlyPrice: null,
    priceLabel: "Custom pricing",
    color: "#a855f7",
    accent: "purple",
    popular: false,
    cta: "Contact Sales",
    ctaLink: "/contact",
    features: [
      "Unlimited projects",
      "Unlimited keyword searches",
      "Unlimited site audits",
      "Unlimited rank tracking",
      "Complete backlink analytics",
      "Unlimited competitor analysis",
      "AI content writer",
      "SERP analysis",
      "White-label reports",
      "Custom integrations",
      "Dedicated account manager",
      "Custom onboarding and training",
      "SLA guarantee",
    ],
    notIncluded: [],
  },
]

const COMPARE_ROWS = [
  { category: "Projects and Limits", isHeader: true },
  { feature: "Projects", starter: "3", pro: "10", business: "50", agency: "Unlimited" },
  { feature: "Keyword searches per month", starter: "50", pro: "500", business: "Unlimited", agency: "Unlimited" },
  { feature: "Site audits per month", starter: "5", pro: "Unlimited", business: "Unlimited", agency: "Unlimited" },
  { feature: "Tracked keywords", starter: "10", pro: "100", business: "500", agency: "Unlimited" },

  { category: "SEO Tools", isHeader: true },
  { feature: "Keyword Explorer", starter: true, pro: true, business: true, agency: true },
  { feature: "Site Audit", starter: true, pro: true, business: true, agency: true },
  { feature: "Rank Tracker", starter: true, pro: true, business: true, agency: true },
  { feature: "Backlink Analytics", starter: "Basic", pro: true, business: true, agency: true },
  { feature: "Site Explorer", starter: true, pro: true, business: true, agency: true },
  { feature: "SERP Analysis", starter: false, pro: true, business: true, agency: true },
  { feature: "Competitor Analysis", starter: false, pro: "5 competitors", business: "10 competitors", agency: "Unlimited" },

  { category: "Content and AI", isHeader: true },
  { feature: "AI Content Writer", starter: false, pro: true, business: true, agency: true },
  { feature: "Content Strategy Tools", starter: false, pro: true, business: true, agency: true },

  { category: "Reports", isHeader: true },
  { feature: "Standard Reports", starter: true, pro: true, business: true, agency: true },
  { feature: "Advanced Reports", starter: false, pro: true, business: true, agency: true },
  { feature: "CSV Export", starter: false, pro: true, business: true, agency: true },
  { feature: "White-label Reports", starter: false, pro: false, business: true, agency: true },

  { category: "Support", isHeader: true },
  { feature: "Email Support", starter: true, pro: true, business: true, agency: true },
  { feature: "Priority Support", starter: false, pro: true, business: true, agency: true },
  { feature: "Dedicated Account Manager", starter: false, pro: false, business: false, agency: true },
  { feature: "Custom Onboarding", starter: false, pro: false, business: true, agency: true },
  { feature: "SLA Guarantee", starter: false, pro: false, business: false, agency: true },
]

const FAQS = [
  { q: "Can I switch plans at any time?", a: "Yes. You can upgrade or downgrade your plan at any time from your billing dashboard. Changes take effect immediately and are prorated." },
  { q: "Is there a free trial for paid plans?", a: "You can start on our free Starter plan to explore the platform. When you are ready to upgrade, you can do so instantly with Paystack." },
  { q: "How does billing work?", a: "We bill monthly or yearly depending on your selected billing cycle. Yearly plans save you up to 20 percent. All payments are processed securely via Paystack." },
  { q: "Do you accept Naira payments?", a: "Yes. All payments are processed in Nigerian Naira via Paystack. We accept cards, bank transfers, and USSD payments." },
  { q: "What happens when I hit my plan limits?", a: "We will notify you when you are approaching your limits. You can upgrade your plan at any time to immediately get more capacity." },
  { q: "Can I get a refund?", a: "We offer a 7-day refund policy on all paid plans. If you are not satisfied, contact us within 7 days of payment and we will issue a full refund." },
]

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CompareCell({ value, planColor }: { value: boolean | string; planColor: string }) {
  if (value === true) return <div className="flex justify-center"><CheckIcon color={planColor} /></div>
  if (value === false) return <div className="flex justify-center"><XIcon /></div>
  return <span className="text-xs font-semibold text-slate-600">{value}</span>
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div {...fadeUp(index * 0.06)} className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-base font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{q}</span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? "rgba(59,130,246,0.1)" : "#f1f5f9",
            border: open ? "1px solid rgba(59,130,246,0.2)" : "1px solid #e2e8f0",
          }}
        >
          <motion.svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={open ? "#3b82f6" : "#94a3b8"} strokeWidth="2.5"
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
            <p className="pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Pricing() {
  const shouldReduceMotion = useReducedMotion()
  const [yearly, setYearly] = useState(false)

  const formatPrice = (price: number | null) => {
    if (price === null) return null
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price)
  }

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
        <div className="hero-blob hero-blob-orange animate-blob animate-blob-delay-1" style={{ width: "350px", height: "350px", bottom: "-100px", left: "-80px", opacity: 0.2 }} />

        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            No hidden fees. Cancel anytime.
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            Choose a plan that feels{" "}
            <span style={{ background: "linear-gradient(135deg, #fb923c, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              premium and powerful
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed mb-10 font-medium"
          >
            Hi-SEO gives you keyword research, audits, rank tracking, backlink analysis, and reporting in one polished workspace. Start free, then upgrade when you are ready for more power.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
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
              { icon: "shield", label: "Secure billing" },
              { icon: "zap", label: "Fast workflows" },
              { icon: "clock", label: "24/7 access" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/60"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {badge.icon === "shield" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                {badge.icon === "zap" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                {badge.icon === "clock" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-20 bg-white">
        <div className="section-container">

          {/* Billing toggle */}
          <motion.div {...fadeUp()} className="flex items-center justify-center gap-4 mb-14">
            <span className={`text-sm font-bold transition-colors ${!yearly ? "text-slate-900" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
              style={{ background: yearly ? "linear-gradient(135deg, #2563eb, #06b6d4)" : "#e2e8f0" }}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                animate={{ left: yearly ? "calc(100% - 24px)" : "4px" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${yearly ? "text-slate-900" : "text-slate-400"}`}>Yearly</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black"
                style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
              >
                SAVE 20%
              </span>
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                {...fadeUp(i * 0.1)}
                className="relative group"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                    <div
                      className="px-4 py-1.5 rounded-full text-xs font-black text-white"
                      style={{
                        background: "linear-gradient(135deg, #f97316, #ea6c04)",
                        boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
                      }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}

                <div
                  className="rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: plan.popular ? "linear-gradient(135deg, #07123f, #0f2040)" : "white",
                    border: plan.popular ? "2px solid #f97316" : "1px solid #e2e8f0",
                    boxShadow: plan.popular
                      ? "0 20px 60px rgba(249,115,22,0.25), 0 0 0 1px rgba(249,115,22,0.1)"
                      : "0 4px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="h-1 rounded-t-xl -mx-6 -mt-6 mb-6"
                    style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }}
                  />

                  <div className="mb-5">
                    <h3
                      className="text-lg font-black mb-1"
                      style={{ color: plan.popular ? "white" : "#0f172a" }}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className="text-xs font-medium leading-relaxed"
                      style={{ color: plan.popular ? "rgba(255,255,255,0.5)" : "#64748b" }}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  <div className="mb-6">
                    {plan.priceLabel && !plan.monthlyPrice ? (
                      <div>
                        <span
                          className="text-3xl font-black"
                          style={{ color: plan.popular ? "white" : "#0f172a" }}
                        >
                          {plan.priceLabel}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={yearly ? "yearly" : "monthly"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span
                              className="text-3xl font-black"
                              style={{ color: plan.popular ? "white" : "#0f172a" }}
                            >
                              {formatPrice(yearly ? plan.yearlyPrice : plan.monthlyPrice)}
                            </span>
                            <span
                              className="text-sm font-semibold ml-1"
                              style={{ color: plan.popular ? "rgba(255,255,255,0.4)" : "#94a3b8" }}
                            >
                              /mo
                            </span>
                          </motion.div>
                        </AnimatePresence>
                        {yearly && plan.monthlyPrice !== null && (
                          <p className="text-xs font-medium mt-1" style={{ color: plan.popular ? "rgba(255,255,255,0.4)" : "#94a3b8" }}>
                            Billed annually
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Link
                    to={plan.ctaLink}
                    className="block w-full py-3 rounded-xl text-sm font-bold text-center transition-all duration-300 hover:scale-[1.02] mb-6"
                    style={
                      plan.popular
                        ? {
                            background: "linear-gradient(135deg, #f97316, #ea6c04)",
                            color: "white",
                            boxShadow: "0 4px 20px rgba(249,115,22,0.45)",
                          }
                        : plan.name === "Agency"
                        ? {
                            background: "transparent",
                            color: plan.color,
                            border: `2px solid ${plan.color}40`,
                          }
                        : {
                            background: "#f8fafc",
                            color: "#1e293b",
                            border: "1px solid #e2e8f0",
                          }
                    }
                  >
                    {plan.cta}
                  </Link>

                  <div className="flex-1">
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-3"
                      style={{ color: plan.popular ? "rgba(255,255,255,0.3)" : "#94a3b8" }}
                    >
                      Included features
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" className="shrink-0 mt-0.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span
                            className="text-xs font-medium leading-relaxed"
                            style={{ color: plan.popular ? "rgba(255,255,255,0.75)" : "#475569" }}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                      {plan.notIncluded.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 opacity-40">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="shrink-0 mt-0.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          <span className="text-xs font-medium leading-relaxed" style={{ color: plan.popular ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20" style={{ background: "#f8fafc" }}>
        <div className="section-container">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Full feature comparison
            </h2>
            <p className="text-slate-500 text-lg">
              See exactly what is included in every plan side by side.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th className="text-left p-5 text-sm font-bold text-slate-500 w-[35%]">Feature</th>
                  {PLANS.map((plan) => (
                    <th key={plan.name} className="p-5 text-center">
                      <div
                        className="text-sm font-black"
                        style={{ color: plan.popular ? "#3b82f6" : "#0f172a" }}
                      >
                        {plan.name}
                      </div>
                      {plan.popular && (
                        <div
                          className="text-[10px] font-bold mt-0.5"
                          style={{ color: "#f97316" }}
                        >
                          Most Popular
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => {
                  if ("isHeader" in row && row.isHeader) {
                    return (
                      <tr key={row.category} style={{ background: "rgba(59,130,246,0.04)", borderBottom: "1px solid #e2e8f0" }}>
                        <td colSpan={5} className="px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400">
                          {row.category}
                        </td>
                      </tr>
                    )
                  }
                  const dataRow = row as { feature: string; starter: boolean | string; pro: boolean | string; business: boolean | string; agency: boolean | string }
                  return (
                    <tr
                      key={dataRow.feature}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 text-sm font-semibold text-slate-700">{dataRow.feature}</td>
                      <td className="p-4 text-center"><CompareCell value={dataRow.starter} planColor="#64748b" /></td>
                      <td className="p-4 text-center" style={{ background: "rgba(59,130,246,0.02)" }}><CompareCell value={dataRow.pro} planColor="#3b82f6" /></td>
                      <td className="p-4 text-center"><CompareCell value={dataRow.business} planColor="#f97316" /></td>
                      <td className="p-4 text-center"><CompareCell value={dataRow.agency} planColor="#a855f7" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* WHY UPGRADE */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07111f 0%, #0b1729 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-20" />
        <div className="section-container relative z-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Why upgrade from free?
            </h2>
            <p className="text-white/50 text-lg">
              The free plan is great for getting started. Here is what unlocks when you upgrade.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "shield",
                title: "Secure",
                desc: "Built with Supabase auth and server-side billing flow. Your data is always private, encrypted, and yours.",
                color: "#06b6d4",
              },
              {
                icon: "zap",
                title: "Fast",
                desc: "Premium UI with quick actions, instant audits, and smooth navigation designed for high-speed workflows.",
                color: "#3b82f6",
              },
              {
                icon: "layers",
                title: "Flexible",
                desc: "Plans built for individuals, growing teams, and large agencies. Scale up or down with zero friction.",
                color: "#a855f7",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.12)}
                className="p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                >
                  {item.icon === "shield" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                  {item.icon === "zap" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  {item.icon === "layers" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                Pricing questions answered
              </h2>
              <p className="text-slate-500 text-lg">
                Still not sure?{" "}
                <Link to="/contact" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Talk to us directly
                </Link>
              </p>
            </motion.div>
            <div className="rounded-2xl border border-slate-100 overflow-hidden px-8">
              {FAQS.map((faq, i) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-orange animate-blob" style={{ width: "400px", height: "400px", top: "-80px", right: "-80px", opacity: 0.2 }} />
        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Start free. Upgrade when ready.
            </h2>
            <p className="text-blue-200/60 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              No credit card required to get started. Join thousands of teams already growing with Hi-SEO.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 28px rgba(249,115,22,0.5)" }}
              >
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
