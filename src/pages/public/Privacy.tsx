import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const SECTIONS = [
  {
    id: "overview",
    title: "Privacy Overview",
    icon: "shield",
    color: "#3b82f6",
    content: [
      "At Hi-SEO, your privacy is not an afterthought. It is a core part of how we design and build our platform. This Privacy Policy explains what data we collect, why we collect it, how we use it, and the controls you have over your information.",
      "Hi-SEO Technologies Ltd is the data controller for all personal data processed through the Hi-SEO platform. We are based in Lagos, Nigeria and operate under Nigerian data protection law.",
      "We do not sell your personal data. We do not share it with advertisers. We collect only what we need to provide the Service and improve your experience.",
    ],
  },
  {
    id: "collection",
    title: "Data We Collect",
    icon: "database",
    color: "#06b6d4",
    content: [
      "Account data: When you register, we collect your name, email address, and optionally your company name. This is required to create and manage your account.",
      "Usage data: We collect information about how you use Hi-SEO including pages visited, features used, search queries entered, and actions taken. This helps us improve the platform.",
      "Project data: Any websites, keywords, reports, and audit results you create in Hi-SEO are stored in our database associated with your account.",
      "Payment data: We do not store your card details. All payment information is handled directly by Paystack. We only receive a transaction reference and payment status.",
      "Technical data: We collect IP addresses, browser type, device information, and session data for security purposes and to diagnose technical issues.",
      "Communications: If you contact our support team, we retain records of those communications to provide better service.",
    ],
  },
  {
    id: "usage",
    title: "How We Use Your Data",
    icon: "settings",
    color: "#f97316",
    content: [
      "Providing the Service: We use your data to operate Hi-SEO, process your SEO queries, store your projects and reports, and deliver results back to you.",
      "Account management: Your account data is used to authenticate you, manage your subscription, and communicate important service updates.",
      "Improving Hi-SEO: Aggregated and anonymized usage data helps us understand which features are most valuable and where we can improve the user experience.",
      "Security: Technical and usage data is analyzed to detect suspicious activity, prevent fraud, and protect the integrity of our platform.",
      "Communication: We may send you product updates, feature announcements, and educational content. You can unsubscribe from marketing emails at any time.",
      "Legal compliance: In rare cases we may need to process data to comply with applicable laws, regulations, or legal proceedings.",
    ],
  },
  {
    id: "sharing",
    title: "Data Sharing and Third Parties",
    icon: "users",
    color: "#10b981",
    content: [
      "We do not sell, rent, or trade your personal data with third parties for marketing purposes. Period.",
      "We share data only with service providers who help us deliver Hi-SEO: Supabase (database and authentication), Paystack (payment processing), and our hosting infrastructure. These providers are contractually bound to protect your data.",
      "We may disclose data if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect the rights, property, or safety of Hi-SEO, our users, or the public.",
      "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections described in this policy.",
    ],
  },
  {
    id: "security",
    title: "Data Security",
    icon: "lock",
    color: "#a855f7",
    content: [
      "All data transmitted between your browser and Hi-SEO is encrypted using TLS. Data stored in our database is encrypted at rest.",
      "We implement row-level security at the database level, meaning your data is completely isolated from other users. No user can ever access another user data.",
      "Access to production systems is restricted to authorized Hi-SEO team members and is protected by multi-factor authentication.",
      "We conduct regular security reviews and promptly address any vulnerabilities discovered. If you discover a security issue, please report it to security@hi-seo.com.",
      "While we take security seriously, no system is completely immune to threats. We encourage you to use a strong unique password and enable any available account security features.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: "clock",
    color: "#f59e0b",
    content: [
      "We retain your account data for as long as your account is active. If you delete your account, we will remove your personal information within 30 days.",
      "Project data including keywords, audits, and reports associated with your account will be deleted within 30 days of account deletion.",
      "Some anonymized and aggregated data may be retained indefinitely for analytics and platform improvement purposes. This data cannot be linked back to you.",
      "Payment records are retained for 7 years as required by Nigerian financial regulations.",
      "Support communications are retained for 2 years to maintain service quality and resolve potential disputes.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights and Controls",
    icon: "key",
    color: "#3b82f6",
    content: [
      "Access: You can access all your personal data directly through your Hi-SEO account settings at any time.",
      "Correction: You can update your name, company name, and other profile information from your settings page.",
      "Deletion: You can delete your account and all associated data from the Danger Zone section in your settings. We will complete the deletion within 30 days.",
      "Data export: You can export your reports and project data in CSV format from your dashboard at any time.",
      "Unsubscribe: You can opt out of marketing communications using the unsubscribe link in any email or by updating your notification settings.",
      "Complaints: If you believe we have mishandled your data, please contact us at privacy@hi-seo.com. You also have the right to lodge a complaint with the Nigeria Data Protection Commission.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    icon: "eye",
    color: "#06b6d4",
    content: [
      "Hi-SEO uses essential cookies required for authentication and security. These cookies are necessary for the platform to function and cannot be disabled.",
      "We use analytics cookies to understand how users interact with our platform. This data is aggregated and anonymized.",
      "We do not use advertising cookies or share any data with advertising networks.",
      "You can control cookie settings through your browser preferences. Disabling essential cookies may prevent the platform from functioning correctly.",
    ],
  },
  {
    id: "children",
    title: "Children Privacy",
    icon: "heart",
    color: "#ef4444",
    content: [
      "Hi-SEO is not intended for use by anyone under the age of 18. We do not knowingly collect personal data from children.",
      "If you are a parent or guardian and believe your child has provided us with personal data, please contact us at privacy@hi-seo.com and we will promptly delete the information.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: "refresh",
    color: "#64748b",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other reasons.",
      "We will notify you of significant changes via email and by posting a prominent notice on our platform. The updated policy will include the date it was last revised.",
      "Your continued use of Hi-SEO after changes take effect constitutes your acceptance of the revised Privacy Policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact and Data Requests",
    icon: "mail",
    color: "#10b981",
    content: [
      "For any privacy-related questions, requests, or concerns, contact our privacy team at privacy@hi-seo.com.",
      "For data deletion requests or data access requests, you can also use the settings in your account or contact support@hi-seo.com.",
      "We will respond to all legitimate privacy requests within 30 days.",
      "Hi-SEO Technologies Ltd, Lagos, Nigeria.",
    ],
  },
]

function SectionIcon({ type, color }: { type: string; color: string }) {
  const props = { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
      {type === "shield" && <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      {type === "database" && <svg {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>}
      {type === "settings" && <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
      {type === "users" && <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
      {type === "lock" && <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
      {type === "clock" && <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
      {type === "key" && <svg {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>}
      {type === "eye" && <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
      {type === "heart" && <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
      {type === "refresh" && <svg {...props}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>}
      {type === "mail" && <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
    </div>
  )
}

export default function Privacy() {
  const shouldReduceMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState("")

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.2) 0%, transparent 70%)" }} />
        <div className="hero-blob hero-blob-cyan animate-blob" style={{ width: "400px", height: "400px", top: "-100px", right: "-80px", opacity: 0.25 }} />

        <div className="section-container relative z-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Your privacy matters to us
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-blue-200/60 text-lg leading-relaxed mb-6">
              We are committed to protecting your privacy. This policy explains exactly how Hi-SEO collects, uses, and protects your personal information.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
                <span>Last updated: January 28, 2025</span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                We never sell your data
              </div>
            </div>
          </motion.div>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Contents
                </p>
                <nav className="space-y-1">
                  {SECTIONS.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        color: activeSection === section.id ? section.color : "#64748b",
                        background: activeSection === section.id ? `${section.color}10` : "transparent",
                      }}
                    >
                      <SectionIcon type={section.icon} color={activeSection === section.id ? section.color : "#94a3b8"} />
                      {section.title}
                    </a>
                  ))}
                </nav>

                <div
                  className="mt-8 p-4 rounded-2xl space-y-3"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <p className="text-xs font-black text-slate-700">Our privacy promise</p>
                  </div>
                  {[
                    "We never sell your data",
                    "You own your content",
                    "7-day deletion guarantee",
                    "No advertising trackers",
                  ].map((promise) => (
                    <div key={promise} className="flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="text-xs text-slate-600 font-medium">{promise}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">

              {/* Key points summary */}
              <motion.div
                {...fadeUp()}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
              >
                {[
                  { icon: "shield", label: "Data encrypted at rest and in transit", color: "#3b82f6" },
                  { icon: "lock", label: "Row-level security keeps your data private", color: "#10b981" },
                  { icon: "eye", label: "No advertising tracking or data selling", color: "#f97316" },
                ].map((point) => (
                  <div
                    key={point.label}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: `${point.color}08`, border: `1px solid ${point.color}18` }}
                  >
                    <SectionIcon type={point.icon} color={point.color} />
                    <p className="text-xs font-semibold text-slate-700 leading-snug">{point.label}</p>
                  </div>
                ))}
              </motion.div>

              {SECTIONS.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  {...fadeUp(i * 0.04)}
                  className="scroll-mt-24"
                >
                  <div className="p-7 rounded-2xl border border-slate-100 hover:border-blue-50 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${section.color}15`, border: `1px solid ${section.color}25` }}
                      >
                        <SectionIcon type={section.icon} color={section.color} />
                      </div>
                      <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
                    </div>
                    <div className="space-y-3">
                      {section.content.map((paragraph, pi) => (
                        <p key={pi} className="text-sm text-slate-600 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div {...fadeUp()} className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 mb-1">Privacy questions or requests?</p>
                    <p className="text-sm text-slate-500">
                      Contact us at{" "}
                      <a href="mailto:privacy@hi-seo.com" className="text-blue-600 font-semibold hover:underline">
                        privacy@hi-seo.com
                      </a>
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 4px 16px rgba(59,130,246,0.3)" }}
                  >
                    Contact Us
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
