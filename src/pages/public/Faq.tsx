import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const FAQ_SECTIONS = [
  {
    category: "Getting Started",
    icon: "rocket",
    color: "#3b82f6",
    faqs: [
      {
        q: "What is Hi-SEO and who is it for?",
        a: "Hi-SEO is a premium all-in-one SEO platform designed for founders, marketers, content creators, and digital agencies who want to grow their organic traffic without juggling multiple tools. Whether you are managing one website or fifty client projects, Hi-SEO gives you everything you need in one clean workspace.",
      },
      {
        q: "Do I need technical SEO knowledge to use Hi-SEO?",
        a: "Not at all. Hi-SEO is designed to be accessible for beginners while powerful enough for experts. Our interface guides you through every workflow with clear explanations, prioritized recommendations, and plain-language insights. You do not need to know how to code or have years of SEO experience to get real results.",
      },
      {
        q: "How do I get started with Hi-SEO?",
        a: "Simply create your free account at hi-seo.com, add your website domain as your first project, and run your first site audit. The entire setup takes less than 5 minutes and you will immediately see your site health score and a list of issues to fix.",
      },
      {
        q: "Is there a free plan?",
        a: "Yes. Our Starter plan is completely free and includes 3 projects, 50 keyword searches per month, 5 site audits per month, basic rank tracking for up to 10 keywords, and access to our SEO glossary and blog. No credit card is required to sign up.",
      },
    ],
  },
  {
    category: "Features and Tools",
    icon: "zap",
    color: "#f97316",
    faqs: [
      {
        q: "What SEO tools are included in Hi-SEO?",
        a: "Hi-SEO includes 9 integrated tools: Keyword Explorer, Site Audit, Rank Tracker, Backlink Analytics, Site Explorer, Competitor Analysis, SERP Analysis, AI Content Writer, and Content Strategy. All tools share the same data and work together seamlessly in one dashboard.",
      },
      {
        q: "How accurate is the keyword data?",
        a: "Our keyword volume and difficulty data is sourced from multiple trusted providers and refreshed monthly. While no SEO tool can claim 100 percent accuracy on search volume data, our data is comparable to industry-leading tools and is more than accurate enough for making strategic keyword decisions.",
      },
      {
        q: "How does the AI content writer work?",
        a: "Our AI writer uses large language models trained on SEO best practices to generate content based on your target keyword. You can generate full articles, outlines, meta descriptions, title tags, and content briefs. The AI understands search intent and naturally incorporates relevant keywords without stuffing.",
      },
      {
        q: "Can I track rankings for multiple websites?",
        a: "Yes. Each project in Hi-SEO has its own dedicated rank tracking. Pro users can track up to 100 keywords across 10 projects, Business users get 500 keywords across 50 projects, and Agency users get unlimited tracking across unlimited projects.",
      },
      {
        q: "How does the site audit work?",
        a: "When you trigger a site audit, our crawler scans every accessible page on your website and checks over 100 SEO factors. These include meta tags, heading structure, image alt text, internal links, page speed signals, mobile friendliness, canonical tags, and more. You get a score from 0 to 100 with issues organized by severity.",
      },
    ],
  },
  {
    category: "Billing and Payments",
    icon: "credit",
    color: "#10b981",
    faqs: [
      {
        q: "How does billing work?",
        a: "Hi-SEO offers monthly and yearly billing cycles. Monthly plans are charged each month on the date you subscribed. Yearly plans are billed annually and include a 20 percent discount compared to monthly pricing. All payments are processed securely via Paystack.",
      },
      {
        q: "Do you accept Naira payments?",
        a: "Yes. All Hi-SEO pricing is in Nigerian Naira and payments are processed via Paystack. We accept debit cards, credit cards, bank transfers, and USSD payments. You do not need a dollar card or international payment method to use Hi-SEO.",
      },
      {
        q: "Can I upgrade or downgrade my plan?",
        a: "Yes, you can change your plan at any time from your billing dashboard. Upgrades take effect immediately and you are charged the prorated difference. Downgrades take effect at the start of your next billing cycle.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a 7-day refund policy on all paid plans. If you are not satisfied with Hi-SEO for any reason, contact our support team within 7 days of your payment and we will issue a full refund with no questions asked.",
      },
      {
        q: "What happens to my data if I cancel?",
        a: "If you cancel your paid plan, your account is downgraded to the free Starter plan. Your data including projects, keywords, audits, and reports is retained for 90 days. After 90 days, data from projects that exceed the free plan limits may be archived.",
      },
    ],
  },
  {
    category: "Privacy and Security",
    icon: "shield",
    color: "#06b6d4",
    faqs: [
      {
        q: "How is my data protected?",
        a: "Hi-SEO is built on Supabase, which uses industry-standard encryption for data at rest and in transit. All authentication is handled via secure JWT tokens with automatic refresh. We never store your payment details directly as all billing is handled by Paystack.",
      },
      {
        q: "Can other users see my projects and data?",
        a: "No. Every piece of data in Hi-SEO is strictly scoped to your user account. Your projects, keywords, audits, reports, and billing information are completely private and never visible to other users. We enforce row-level security at the database level.",
      },
      {
        q: "Do you sell user data to third parties?",
        a: "Never. We do not sell, rent, or share your personal data or usage data with any third parties for marketing purposes. The only data we share is what is necessary to process payments via Paystack and provide the service. Please read our Privacy Policy for full details.",
      },
      {
        q: "How do I delete my account?",
        a: "You can delete your account at any time from the Danger Zone section in your Settings page. Account deletion is permanent and removes all your personal information, projects, and associated data from our systems within 30 days.",
      },
    ],
  },
  {
    category: "Support",
    icon: "help",
    color: "#a855f7",
    faqs: [
      {
        q: "How do I contact support?",
        a: "You can reach our support team via the Contact page, by emailing support at hi-seo.com, or through the in-app chat widget. We respond to all support requests within 24 hours on weekdays. Pro and Business plan users get priority support with faster response times.",
      },
      {
        q: "Do you offer onboarding help for new users?",
        a: "Yes. All new users have access to our getting started guide and video walkthroughs in the Help Center. Business plan users get a dedicated onboarding session with a Hi-SEO team member. Agency plan users get a full custom onboarding and training program.",
      },
      {
        q: "Is there a community or forum for Hi-SEO users?",
        a: "We are actively building our user community. Currently you can connect with other Hi-SEO users and the team through our newsletter and social channels. A dedicated community forum is on our roadmap for later this year.",
      },
    ],
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-5 text-left gap-4 group"
      >
        <span className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
          {q}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 mt-0.5"
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
            <p className="pb-5 text-sm text-slate-500 leading-relaxed font-medium">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryIcon({ type, color }: { type: string; color: string }) {
  const props = { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}15`, border: `1px solid ${color}25` }}
    >
      {type === "rocket" && <svg {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>}
      {type === "zap" && <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
      {type === "credit" && <svg {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
      {type === "shield" && <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      {type === "help" && <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
    </div>
  )
}

export default function Faq() {
  const shouldReduceMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState("All")

  const sections = activeSection === "All"
    ? FAQ_SECTIONS
    : FAQ_SECTIONS.filter((s) => s.category === activeSection)

  const totalFaqs = FAQ_SECTIONS.reduce((acc, s) => acc + s.faqs.length, 0)

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
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {totalFaqs} questions answered
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            Frequently asked{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              questions
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed font-medium"
          >
            Everything you need to know about Hi-SEO, our features, pricing, and support. Cannot find your answer? We are happy to help.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">

            {/* Category filter */}
            <motion.div {...fadeUp()} className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={() => setActiveSection("All")}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  background: activeSection === "All" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#f1f5f9",
                  color: activeSection === "All" ? "white" : "#64748b",
                  boxShadow: activeSection === "All" ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
                }}
              >
                All Questions
              </button>
              {FAQ_SECTIONS.map((section) => (
                <button
                  key={section.category}
                  onClick={() => setActiveSection(section.category)}
                  className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                  style={{
                    background: activeSection === section.category ? section.color : "#f1f5f9",
                    color: activeSection === section.category ? "white" : "#64748b",
                    boxShadow: activeSection === section.category ? `0 4px 12px ${section.color}40` : "none",
                  }}
                >
                  {section.category}
                </button>
              ))}
            </motion.div>

            {/* FAQ sections */}
            <div className="space-y-8">
              {sections.map((section, si) => (
                <motion.div
                  key={section.category}
                  {...fadeUp(si * 0.1)}
                  className="rounded-2xl border border-slate-100 overflow-hidden"
                >
                  {/* Section header */}
                  <div
                    className="flex items-center gap-4 px-7 py-5"
                    style={{ background: `${section.color}06`, borderBottom: "1px solid #f1f5f9" }}
                  >
                    <CategoryIcon type={section.icon} color={section.color} />
                    <div>
                      <h2 className="text-lg font-black text-slate-900">{section.category}</h2>
                      <p className="text-xs text-slate-400 font-medium">{section.faqs.length} questions</p>
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="px-7">
                    {section.faqs.map((faq, i) => (
                      <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="py-20" style={{ background: "#f8fafc" }}>
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                Still have questions?
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Our support team is here to help. Choose the best way to reach us below.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: "mail",
                  title: "Email Support",
                  desc: "Send us a message and we will get back to you within 24 hours on weekdays.",
                  action: "Send an email",
                  href: "/contact",
                  color: "#3b82f6",
                },
                {
                  icon: "message",
                  title: "Live Chat",
                  desc: "Chat with our team in real time during business hours for instant answers.",
                  action: "Start a chat",
                  href: "/contact",
                  color: "#10b981",
                },
                {
                  icon: "book",
                  title: "Documentation",
                  desc: "Browse our detailed help center with guides, tutorials, and video walkthroughs.",
                  action: "Browse docs",
                  href: "/blog",
                  color: "#f97316",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp(i * 0.1)}
                  className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-[0_12px_40px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
                  >
                    {item.icon === "mail" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                    {item.icon === "message" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                    {item.icon === "book" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors duration-200"
                    style={{ color: item.color }}
                  >
                    {item.action}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-orange animate-blob" style={{ width: "350px", height: "350px", top: "-60px", right: "-60px", opacity: 0.2 }} />
        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-blue-200/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of teams using Hi-SEO to grow their organic traffic. Start free today with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 24px rgba(249,115,22,0.45)" }}
              >
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
