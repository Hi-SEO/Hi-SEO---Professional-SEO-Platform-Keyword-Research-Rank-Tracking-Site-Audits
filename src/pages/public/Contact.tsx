import React, { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function Contact() {
  const shouldReduceMotion = useReducedMotion()
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email address"
    if (!form.subject.trim()) newErrors.subject = "Subject is required"
    if (!form.message.trim()) newErrors.message = "Message is required"
    else if (form.message.trim().length < 20) newErrors.message = "Message must be at least 20 characters"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const SUPPORT_CARDS = [
    {
      icon: "mail",
      title: "Email Support",
      desc: "For general inquiries and non-urgent support requests.",
      value: "support@hi-seo.com",
      response: "Response within 24 hours",
      color: "#3b82f6",
    },
    {
      icon: "zap",
      title: "Priority Support",
      desc: "Pro and Business plan users get faster dedicated support.",
      value: "Pro and Business plans",
      response: "Response within 4 hours",
      color: "#f97316",
    },
    {
      icon: "users",
      title: "Sales Inquiries",
      desc: "Interested in Agency plan or custom solutions for your team?",
      value: "sales@hi-seo.com",
      response: "Response within 12 hours",
      color: "#10b981",
    },
  ]

  const SUBJECTS = [
    { value: "", label: "Select a subject" },
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "billing", label: "Billing Question" },
    { value: "sales", label: "Sales and Agency Plans" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Report a Bug" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.25) 0%, transparent 70%)" }} />
        <div className="hero-blob hero-blob-blue animate-blob" style={{ width: "500px", height: "500px", top: "-150px", right: "-100px", opacity: 0.3 }} />
        <div className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2" style={{ width: "350px", height: "350px", bottom: "-80px", left: "-80px", opacity: 0.2 }} />

        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            We respond within 24 hours
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            Get in{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              touch
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed font-medium"
          >
            Have a question, feedback, or need help with your account? Our team is ready to help you get the most out of Hi-SEO.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* SUPPORT CARDS */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {SUPPORT_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp(i * 0.1)}
                className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_12px_40px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                >
                  {card.icon === "mail" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                  {card.icon === "zap" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                  {card.icon === "users" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{card.desc}</p>
                <p className="text-sm font-bold" style={{ color: card.color }}>{card.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400 font-medium">{card.response}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact form + info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Form */}
            <motion.div {...fadeUp()} className="lg:col-span-3">
              <div
                className="rounded-2xl p-8"
                style={{ border: "1px solid #e2e8f0", background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  Send us a message
                </h2>
                <p className="text-slate-500 text-sm mb-8">
                  Fill in the form below and we will get back to you as soon as possible.
                </p>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-4"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                      style={{ background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.3)" }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Message sent!</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Thank you for reaching out. We will get back to you within 24 hours at <strong>{form.email}</strong>
                    </p>
                    <button
                      onClick={() => { setSuccess(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">
                          Full name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-0 w-11 h-12 flex items-center justify-center text-slate-400 pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="John Doe"
                            className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                            style={{ borderColor: errors.name ? "#ef4444" : "#e2e8f0", background: errors.name ? "#fef2f2" : "white" }}
                          />
                        </div>
                        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">
                          Email address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-0 w-11 h-12 flex items-center justify-center text-slate-400 pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          </span>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="you@company.com"
                            className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                            style={{ borderColor: errors.email ? "#ef4444" : "#e2e8f0", background: errors.email ? "#fef2f2" : "white" }}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          className="w-full h-12 px-4 rounded-xl text-sm font-medium text-slate-900 border appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                          style={{ borderColor: errors.subject ? "#ef4444" : "#e2e8f0", background: errors.subject ? "#fef2f2" : "white" }}
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </div>
                      {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                        style={{ borderColor: errors.message ? "#ef4444" : "#e2e8f0", background: errors.message ? "#fef2f2" : "white" }}
                      />
                      <div className="flex items-center justify-between">
                        {errors.message
                          ? <p className="text-xs text-red-500 font-medium">{errors.message}</p>
                          : <span className="text-xs text-slate-400">{form.message.length} characters</span>
                        }
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
                      }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2a10 10 0 0 1 10 10" />
                          </svg>
                          Sending message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Info panel */}
            <motion.div {...fadeUp(0.2)} className="lg:col-span-2 space-y-6">
              <div
                className="p-6 rounded-2xl"
                style={{ background: "linear-gradient(135deg, #07123f, #0f2040)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h3 className="text-lg font-black text-white mb-4">Before you write to us</h3>
                <div className="space-y-3">
                  {[
                    { label: "Check our FAQ", href: "/faq", desc: "Most common questions answered" },
                    { label: "Browse the blog", href: "/blog", desc: "Guides, tips, and tutorials" },
                    { label: "SEO Glossary", href: "/glossary", desc: "Terms and definitions explained" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/6 transition-all duration-200 group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(59,130,246,0.2)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                        <p className="text-xs text-white/40 font-medium">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div
                className="p-6 rounded-2xl"
                style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,0.2)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Upgrade for priority support</h4>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Pro and Business plan users get responses within 4 hours from our dedicated support specialists.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  View plans
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div
                className="p-6 rounded-2xl"
                style={{ border: "1px solid #e2e8f0", background: "white" }}
              >
                <h4 className="text-sm font-black text-slate-900 mb-4">Response time by plan</h4>
                <div className="space-y-3">
                  {[
                    { plan: "Starter (Free)", time: "Within 24 hours", color: "#64748b" },
                    { plan: "Pro", time: "Within 4 hours", color: "#3b82f6" },
                    { plan: "Business", time: "Within 2 hours", color: "#f97316" },
                    { plan: "Agency", time: "Dedicated manager", color: "#a855f7" },
                  ].map((row) => (
                    <div key={row.plan} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">{row.plan}</span>
                      <span className="text-xs font-bold" style={{ color: row.color }}>{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
