import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Search, BarChart3, Link2, FileText, Globe,
  TrendingUp, CheckCircle, ChevronDown,
  ArrowRight, Star, Users, Award, Target, Zap, Shield
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
  },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const gridStyle = {
  backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
};

const features = [
  { icon: Search, title: "Keyword Explorer", description: "Uncover high-value keywords with real search volume, difficulty scores, and intent signals.", color: "from-blue-500 to-cyan-500" },
  { icon: BarChart3, title: "Rank Tracker", description: "Monitor your keyword positions daily across Google and Bing. Get instant alerts when rankings shift.", color: "from-orange-500 to-amber-500" },
  { icon: Globe, title: "Site Audit", description: "Run comprehensive technical SEO audits in seconds. Identify crawl errors, broken links, and slow pages.", color: "from-emerald-500 to-teal-500" },
  { icon: Link2, title: "Backlink Analytics", description: "Analyze your backlink profile and your competitors. Discover new link opportunities and track authority growth.", color: "from-purple-500 to-violet-500" },
  { icon: FileText, title: "AI Content Writer", description: "Generate SEO-optimized content briefs, outlines, and full articles in seconds that rank and convert.", color: "from-pink-500 to-rose-500" },
  { icon: Target, title: "Competitor Analysis", description: "Reverse-engineer your competitors top pages, keyword gaps, and backlink sources.", color: "from-cyan-500 to-blue-500" },
];

const steps = [
  { number: "01", title: "Connect Your Website", description: "Add your domain and let Hi-SEO crawl your site, audit your technical health, and map your keyword positions.", icon: Globe },
  { number: "02", title: "Discover Opportunities", description: "Use our Keyword Explorer, Competitor Analysis, and AI insights to find where you can rank higher.", icon: Search },
  { number: "03", title: "Execute and Grow", description: "Follow your personalized SEO action plan and watch your organic traffic climb week after week.", icon: TrendingUp },
];

const benefits = [
  "Full site technical audit in under 60 seconds",
  "Daily keyword rank tracking",
  "AI-powered content briefs that rank",
  "Competitor gap analysis in one click",
  "Backlink monitoring and toxic link alerts",
  "Custom PDF reports for clients",
  "Real-time SERP analysis",
  "Team collaboration tools built in",
];

const testimonials = [
  { name: "Chidi Okonkwo", role: "SEO Director, FinTech Nigeria", avatar: "CO", rating: 5, text: "Hi-SEO completely transformed how our team manages SEO. Our organic traffic is up 340 percent in 4 months." },
  { name: "Amaka Eze", role: "Founder, GrowthLab Agency", avatar: "AE", rating: 5, text: "The first SEO platform built for the African market that actually understands our search landscape. The pricing is fair and the data is accurate." },
  { name: "Seun Adeyemi", role: "Head of Digital, RetailPro", avatar: "SA", rating: 5, text: "The site audit feature caught 47 critical issues we had no idea about. After fixing them, our rankings jumped significantly within 6 weeks." },
];

const faqs = [
  { question: "How is Hi-SEO different from other SEO tools?", answer: "Hi-SEO is purpose-built for businesses in African and emerging markets. Our keyword data, search volume metrics, and competitor intelligence are calibrated for your actual market with pricing that makes sense for growing businesses." },
  { question: "Do I need technical knowledge to use Hi-SEO?", answer: "Not at all. Hi-SEO is designed for marketing teams, business owners, and SEO professionals alike. Every report comes with plain-language explanations and step-by-step fix guides." },
  { question: "How accurate is the keyword and ranking data?", answer: "Our data is sourced from live search index sampling and updated daily. Rank tracking is checked daily for all tracked keywords across your target location and device type." },
  { question: "Can I try Hi-SEO before paying?", answer: "Yes. Our Starter plan is completely free with a full site audit, up to 10 tracked keywords, and keyword explorer access. No credit card required." },
  { question: "Is my data secure?", answer: "Absolutely. All data is encrypted at rest and in transit using Supabase with row-level security. We never sell your data or share it with third parties." },
];

const pricingPlans = [
  { name: "Starter", price: "Free", period: "forever", desc: "Perfect for individuals getting started", features: ["1 Project", "10 Keywords", "1 Site Audit/mo", "Basic Reports"], popular: false, cta: "Start Free", href: "/signup", accent: "#64748b" },
  { name: "Pro", price: "15,000", period: "/mo", desc: "Best for growing businesses", features: ["5 Projects", "500 Keywords", "10 Audits/mo", "AI Writer", "Priority Support"], popular: false, cta: "Get Started", href: "/signup", accent: "#1d4ed8" },
  { name: "Business", price: "45,000", period: "/mo", desc: "For agencies and high-traffic sites", features: ["20 Projects", "2,000 Keywords", "Unlimited Audits", "White-label Reports", "API Access"], popular: true, cta: "Get Started", href: "/signup", accent: "#f97316" },
  { name: "Agency", price: "Custom", period: "", desc: "Enterprise-grade for large teams", features: ["Unlimited Projects", "Unlimited Keywords", "Dedicated Manager", "Custom Integrations", "SLA Guarantee"], popular: false, cta: "Contact Sales", href: "/contact", accent: "#7c3aed" },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mv = (delay = 0) =>
    shouldReduceMotion ? {} : {
      variants: fadeUp(delay),
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, amount: 0.15 },
    };

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ===== HERO ===== */}
      <section
        style={{
          background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)",
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: "80px",
        }}
      >
        <div style={{ position: "absolute", inset: 0, ...gridStyle }} />

        {/* Glow blobs - hidden on mobile for performance */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.15)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", backgroundColor: "rgba(6,182,212,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Geometric - desktop only */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 160, display: "flex", alignItems: "center", opacity: 0.2, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 500" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="-40" y="150" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(-15 50 240)" />
            <rect x="-20" y="170" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(-15 70 260)" />
            <circle cx="20" cy="350" r="5" fill="#f97316" />
            <circle cx="120" cy="280" r="3" fill="#f97316" />
          </svg>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, display: "flex", alignItems: "center", opacity: 0.2, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 500" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="60" y="120" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(15 150 210)" />
            <rect x="40" y="140" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(15 130 230)" />
            <circle cx="180" cy="100" r="5" fill="#f97316" />
            <circle cx="80" cy="300" r="3" fill="#f97316" />
          </svg>
        </div>

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 900, margin: "0 auto", padding: "3rem 1.25rem 5rem", textAlign: "center" }}>

          {/* Badge */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -15 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 9999, padding: "6px 16px", marginBottom: "1.5rem" }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#34d399", flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#bfdbfe", whiteSpace: "nowrap" }}>
              The SEO Platform Built for African Businesses
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 1rem" }}
          >
            Rank Higher and Grow
            <br />
            <span style={{ color: "#f97316" }}>Your Business Online</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "clamp(0.95rem, 3vw, 1.15rem)", color: "#bfdbfe", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.7 }}
          >
            Hi-SEO gives you keyword research, rank tracking, site audits, backlink analysis,
            and AI content tools to dominate Google and drive consistent organic traffic.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: "3rem" }}
          >
            <Link
              to="/signup"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                backgroundColor: "#f97316", color: "white", fontWeight: 700,
                padding: "14px 32px", borderRadius: 12, fontSize: "1rem",
                boxShadow: "0 8px 32px rgba(249,115,22,0.45)",
                transition: "all 0.3s ease", textDecoration: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              Get Started Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/features"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)", color: "white",
                fontWeight: 600, padding: "14px 28px", borderRadius: 12,
                fontSize: "1rem", transition: "all 0.3s ease", textDecoration: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", maxWidth: 480, margin: "0 auto" }}
            className="sm:grid-cols-4"
          >
            {[
              { value: "2,400+", label: "Active Users" },
              { value: "12M+", label: "Keywords Tracked" },
              { value: "98.7%", label: "Uptime SLA" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#93c5fd", fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section style={{ width: "100%", backgroundColor: "white", padding: "4rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 2.25rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 0.75rem" }}>
              Join 2,400+ Businesses Already Using Hi-SEO
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>Real results from real customers across Africa and beyond</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp(i * 0.08)}
                style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-6px)"; el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: "0.75rem" }}>
                  {[...Array(t.rating)].map((_, si) => <Star key={si} size={14} style={{ color: "#10b981", fill: "#10b981" }} />)}
                </div>
                <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1rem" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>{t.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...mv(0.2)} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 9999, padding: "10px 20px" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} style={{ color: "#10b981", fill: "#10b981" }} />)}
              </div>
              <span style={{ color: "#374151", fontSize: "0.875rem", fontWeight: 600 }}>Rated 4.9 / 5 based on 2,400+ reviews</span>
              <span style={{ color: "#10b981", fontWeight: 700, fontSize: "0.875rem" }}>Verified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ width: "100%", backgroundColor: "#f8fafc", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "0.75rem", fontWeight: 700, padding: "6px 16px", borderRadius: 9999, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Everything You Need
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 1rem" }}>
              One Platform. Every SEO Tool.
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Stop juggling 6 different tools. Hi-SEO brings your entire SEO workflow into one intelligent, connected platform.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp()}
                  style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "2rem", position: "relative", overflow: "hidden", transition: "all 0.3s ease", cursor: "default" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-6px)"; el.style.boxShadow = "0 24px 48px rgba(0,0,0,0.1)"; el.style.borderColor = "#bfdbfe"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; el.style.borderColor = "#e2e8f0"; }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 hover:opacity-100`} style={{ transition: "opacity 0.3s" }} />
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${feature.color.includes("blue") ? "#3b82f6,#06b6d4" : feature.color.includes("orange") ? "#f97316,#f59e0b" : feature.color.includes("emerald") ? "#10b981,#14b8a6" : feature.color.includes("purple") ? "#8b5cf6,#7c3aed" : feature.color.includes("pink") ? "#ec4899,#f43f5e" : "#06b6d4,#3b82f6"})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.3s" }}>
                    <Icon size={24} color="white" />
                  </div>
                  <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "1.1rem", marginBottom: "0.625rem" }}>{feature.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7 }}>{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div {...mv(0.2)} style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              to="/features"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#1239a8", color: "white", fontWeight: 700, padding: "14px 32px", borderRadius: 12, fontSize: "1rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(18,57,168,0.3)", transition: "all 0.3s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              Explore All Features <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ position: "relative", width: "100%", padding: "5rem 0", overflow: "hidden", background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}>
        <div style={{ position: "absolute", inset: 0, ...gridStyle }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, borderRadius: "50%", backgroundColor: "rgba(6,182,212,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#bfdbfe", fontSize: "0.75rem", fontWeight: 700, padding: "6px 16px", borderRadius: 9999, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simple Setup
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", margin: "0 0 1rem" }}>
              From Zero to Ranking in 3 Steps
            </h2>
            <p style={{ color: "#bfdbfe", fontSize: "1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Getting started with Hi-SEO takes less than 5 minutes. No complex setup, no agency required.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp(i * 0.1)}
                  style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "2rem", textAlign: "center", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.1)"; el.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: "4rem", fontWeight: 900, color: "rgba(255,255,255,0.06)", lineHeight: 1, marginBottom: "1rem" }}>{step.number}</div>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <Icon size={24} color="#f97316" />
                  </div>
                  <h3 style={{ fontWeight: 700, color: "white", fontSize: "1.1rem", marginBottom: "0.75rem" }}>{step.title}</h3>
                  <p style={{ color: "#bfdbfe", fontSize: "0.875rem", lineHeight: 1.7 }}>{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 50" fill="#f8fafc" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" />
          </svg>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section style={{ width: "100%", backgroundColor: "#f8fafc", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
            <motion.div {...mv(0)}>
              <span style={{ display: "inline-block", backgroundColor: "#ffedd5", color: "#c2410c", fontSize: "0.75rem", fontWeight: 700, padding: "6px 16px", borderRadius: 9999, marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Why Hi-SEO
              </span>
              <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 1rem" }}>
                Every Feature to Dominate Search
              </h2>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                Hi-SEO is not just another SEO dashboard. It is an integrated growth engine that connects your keyword data, technical health, content performance, and backlink authority into one unified view.
              </p>
              <Link
                to="/signup"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#f97316", color: "white", fontWeight: 700, padding: "14px 28px", borderRadius: 12, fontSize: "1rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(249,115,22,0.35)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                Start Free Today <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              variants={stagger} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={fadeUp()}
                  style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "white", borderRadius: 12, padding: "12px 14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.25s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CheckCircle size={14} color="#059669" />
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PRICING PREVIEW ===== */}
      <section style={{ width: "100%", backgroundColor: "white", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "0.75rem", fontWeight: 700, padding: "6px 16px", borderRadius: 9999, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simple Pricing
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 1rem" }}>
              Plans for Every Stage of Growth
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
              Start free and scale as you grow. No hidden fees, no long-term contracts.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}
          >
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp(i * 0.08)}
                style={{
                  backgroundColor: "white",
                  border: plan.popular ? `2px solid #f97316` : "1px solid #e2e8f0",
                  borderRadius: 16, padding: "1.5rem",
                  position: "relative",
                  boxShadow: plan.popular ? "0 8px 40px rgba(249,115,22,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-8px)"; el.style.boxShadow = "0 24px 48px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = plan.popular ? "0 8px 40px rgba(249,115,22,0.15)" : "0 1px 3px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: plan.accent, borderRadius: "14px 14px 0 0" }} />
                {plan.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                    <span style={{ backgroundColor: "#f97316", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "4px 14px", borderRadius: 9999 }}>
                      Most Popular
                    </span>
                  </div>
                )}
                <div style={{ paddingTop: "0.75rem" }}>
                  <h3 style={{ fontWeight: 900, color: "#0f172a", fontSize: "1.1rem", marginBottom: "0.25rem" }}>{plan.name}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "1rem", lineHeight: 1.5 }}>{plan.desc}</p>
                  <div style={{ marginBottom: "1rem" }}>
                    {plan.price === "Free" ? (
                      <span style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>Free</span>
                    ) : plan.price === "Custom" ? (
                      <span style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>Custom</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                        <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>NGN</span>
                        <span style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>{plan.price}</span>
                        <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{plan.period}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ width: 36, height: 3, backgroundColor: plan.accent, borderRadius: 9999, marginBottom: "1rem" }} />
                  <ul style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: 8 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "#475569" }}>
                        <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.href}
                    style={{ display: "block", textAlign: "center", backgroundColor: plan.popular ? "#f97316" : plan.accent, color: "white", fontWeight: 700, padding: "11px", borderRadius: 10, fontSize: "0.875rem", textDecoration: "none", transition: "all 0.3s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...mv(0.3)} style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link to="/pricing" style={{ color: "#2563eb", fontWeight: 600, fontSize: "0.875rem", textDecoration: "underline", textUnderlineOffset: 4 }}>
              View full pricing comparison table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={{ width: "100%", backgroundColor: "#f8fafc", padding: "5rem 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ display: "inline-block", backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "0.75rem", fontWeight: 700, padding: "6px 16px", borderRadius: 9999, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              FAQ
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 0.75rem" }}>
              Common Questions
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>Everything you need to know before getting started.</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp()}
                style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", gap: 12 }}
                >
                  <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    style={{ flexShrink: 0, color: openFaq === i ? "#2563eb" : "#94a3b8", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 1.5rem 1.25rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7 }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{ position: "relative", width: "100%", padding: "6rem 0", overflow: "hidden", background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}>
        <div style={{ position: "absolute", inset: 0, ...gridStyle }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 160, opacity: 0.2, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 500" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="-40" y="150" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(-15 50 240)" />
            <circle cx="20" cy="350" r="5" fill="#f97316" />
          </svg>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, opacity: 0.2, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 500" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="60" y="120" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(15 150 210)" />
            <circle cx="180" cy="100" r="5" fill="#f97316" />
          </svg>
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: "0 1.25rem", textAlign: "center" }}>
          <motion.div {...mv(0)}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: "2rem" }}>
              {[Award, Shield, Users, Zap].map((Icon, i) => (
                <div key={i} style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color="#93c5fd" />
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: "clamp(1.75rem, 6vw, 3.5rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 1.25rem" }}>
              Your Competitors Are Already
              <br />
              <span style={{ color: "#f97316" }}>Gaining Ground on You.</span>
            </h2>

            <p style={{ color: "#bfdbfe", fontSize: "1rem", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 2.5rem" }}>
              Every day without Hi-SEO is another day your competitors rank above you and capture your customers.
              Start your free account in 60 seconds. No credit card. No commitment. Just results.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link
                to="/signup"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#f97316", color: "white", fontWeight: 700, padding: "16px 36px", borderRadius: 12, fontSize: "1rem", textDecoration: "none", boxShadow: "0 8px 40px rgba(249,115,22,0.5)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                Start Free - No Card Needed <ArrowRight size={18} />
              </Link>
              <Link
                to="/pricing"
                style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontWeight: 600, padding: "16px 28px", borderRadius: 12, fontSize: "1rem", textDecoration: "none", transition: "all 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
              >
                View Pricing
              </Link>
            </div>

            <p style={{ marginTop: "1.25rem", color: "#93c5fd", fontSize: "0.875rem" }}>
              Free plan available forever. Upgrade when you are ready to scale.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
