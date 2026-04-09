import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, BarChart3, Link2, FileText, Globe, TrendingUp,
  Target, Zap, Shield, CheckCircle, ArrowRight,
  LayoutDashboard, PenTool, Eye, Cpu, BarChart
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const gridStyle = {
  backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
};

const allFeatures = [
  {
    icon: Search,
    title: "Keyword Explorer",
    description: "Discover thousands of keyword opportunities with accurate search volume, keyword difficulty scores, CPC data, and search intent classification. Filter by location, language, and competition level to find the exact keywords that will drive qualified traffic to your site.",
    colorA: "#3b82f6", colorB: "#06b6d4",
    benefits: ["Real search volume data", "Keyword difficulty scoring", "Search intent analysis", "Long-tail keyword discovery"],
  },
  {
    icon: BarChart3,
    title: "Rank Tracker",
    description: "Track your keyword positions across Google and Bing with daily updates. Monitor ranking changes, identify trends, and get instant alerts when your positions shift significantly. Compare your rankings against competitors and measure your SEO progress over time.",
    colorA: "#f97316", colorB: "#f59e0b",
    benefits: ["Daily position updates", "Competitor rank comparison", "Historical trend charts", "Instant ranking alerts"],
  },
  {
    icon: Globe,
    title: "Site Audit",
    description: "Run a comprehensive technical SEO audit of your entire website in seconds. Identify crawl errors, broken links, slow-loading pages, missing meta tags, duplicate content, and over 100 other technical issues with clear fix recommendations for each one.",
    colorA: "#10b981", colorB: "#14b8a6",
    benefits: ["100+ SEO checks", "Crawl error detection", "Page speed analysis", "On-page SEO scoring"],
  },
  {
    icon: Link2,
    title: "Backlink Analytics",
    description: "Get a complete picture of your backlink profile and your competitors. Track new and lost backlinks, analyze domain authority, identify toxic links, and discover high-quality link building opportunities. Monitor your link acquisition progress over time.",
    colorA: "#8b5cf6", colorB: "#7c3aed",
    benefits: ["Full backlink profile", "Authority scoring", "Toxic link detection", "Link opportunity finder"],
  },
  {
    icon: FileText,
    title: "AI Content Writer",
    description: "Generate high-quality, SEO-optimized content in seconds using our advanced AI. Create comprehensive content briefs, detailed outlines, full blog posts, and meta descriptions that are designed to rank on Google and convert visitors into customers.",
    colorA: "#ec4899", colorB: "#f43f5e",
    benefits: ["AI-powered content generation", "SEO-optimized output", "Meta description writer", "Content brief creator"],
  },
  {
    icon: Target,
    title: "Competitor Analysis",
    description: "Uncover your competitors complete SEO strategy. Analyze their top-ranking pages, keyword portfolios, backlink sources, and content gaps. Identify exactly what is working for them and use those insights to outrank them on your most important keywords.",
    colorA: "#06b6d4", colorB: "#3b82f6",
    benefits: ["Competitor keyword gaps", "Top page analysis", "Backlink comparison", "Content opportunity finder"],
  },
  {
    icon: Eye,
    title: "SERP Analysis",
    description: "Analyze the search engine results page for any keyword to understand what Google is rewarding. See featured snippets, People Also Ask boxes, local packs, and other SERP features. Understand exactly what content format and depth you need to rank.",
    colorA: "#f59e0b", colorB: "#f97316",
    benefits: ["SERP feature tracking", "Featured snippet analysis", "Content format insights", "Search intent mapping"],
  },
  {
    icon: LayoutDashboard,
    title: "Site Explorer",
    description: "Get a complete overview of any domain including their organic traffic estimates, top ranking pages, keyword rankings, and backlink profile. Use this intelligence to benchmark against competitors and identify new market opportunities.",
    colorA: "#14b8a6", colorB: "#10b981",
    benefits: ["Domain overview", "Traffic estimates", "Top pages analysis", "Organic keyword list"],
  },
  {
    icon: PenTool,
    title: "Content Strategy",
    description: "Plan and organize your entire content calendar with our AI-powered content strategy tool. Map keywords to content topics, identify content gaps, prioritize by traffic potential, and track the performance of your published content.",
    colorA: "#7c3aed", colorB: "#8b5cf6",
    benefits: ["Content calendar planning", "Keyword-to-content mapping", "Gap analysis", "Performance tracking"],
  },
];

const workflowSteps = [
  { step: "01", title: "Audit Your Site", desc: "Start with a comprehensive technical audit to identify all issues holding your rankings back.", icon: Globe },
  { step: "02", title: "Research Keywords", desc: "Find the highest-value keywords your target audience is searching for every day.", icon: Search },
  { step: "03", title: "Analyze Competitors", desc: "Understand exactly what your competitors are doing right and where their gaps are.", icon: Target },
  { step: "04", title: "Create Content", desc: "Use AI to create optimized content that is designed to rank from day one.", icon: FileText },
  { step: "05", title: "Build Authority", desc: "Track and grow your backlink profile to increase your domain authority.", icon: Link2 },
  { step: "06", title: "Track and Scale", desc: "Monitor your rankings daily and scale what is working to drive more organic traffic.", icon: TrendingUp },
];

const comparisonRows = [
  { feature: "Keyword Research", hiseo: true, ahrefs: true, semrush: true, moz: true },
  { feature: "Rank Tracking", hiseo: true, ahrefs: true, semrush: true, moz: true },
  { feature: "Site Audit", hiseo: true, ahrefs: true, semrush: true, moz: true },
  { feature: "Backlink Analysis", hiseo: true, ahrefs: true, semrush: true, moz: false },
  { feature: "AI Content Writer", hiseo: true, ahrefs: false, semrush: false, moz: false },
  { feature: "African Market Data", hiseo: true, ahrefs: false, semrush: false, moz: false },
  { feature: "NGN Pricing", hiseo: true, ahrefs: false, semrush: false, moz: false },
  { feature: "Free Starter Plan", hiseo: true, ahrefs: false, semrush: false, moz: false },
  { feature: "SERP Analysis", hiseo: true, ahrefs: true, semrush: true, moz: false },
  { feature: "Competitor Analysis", hiseo: true, ahrefs: true, semrush: true, moz: true },
];

export default function Features() {
  const shouldReduceMotion = useReducedMotion();

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
      <section style={{
        background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)",
        position: "relative",
        width: "100%",
        overflow: "hidden",
        paddingTop: "80px",
      }}>
        <div style={{ position: "absolute", inset: 0, ...gridStyle }} />
        <div style={{ position: "absolute", top: "30%", left: "20%", width: 350, height: 350, borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.15)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 280, height: 280, borderRadius: "50%", backgroundColor: "rgba(6,182,212,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Left geometric */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 160, opacity: 0.2, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 500" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="-40" y="150" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(-15 50 240)" />
            <rect x="-20" y="170" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(-15 70 260)" />
            <circle cx="20" cy="350" r="5" fill="#f97316" />
            <circle cx="120" cy="280" r="3" fill="#f97316" />
          </svg>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, opacity: 0.2, pointerEvents: "none" }}>
          <svg viewBox="0 0 200 500" fill="none" style={{ width: "100%", height: "100%" }}>
            <rect x="60" y="120" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(15 150 210)" />
            <rect x="40" y="140" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(15 130 230)" />
            <circle cx="180" cy="100" r="5" fill="#f97316" />
            <circle cx="80" cy="300" r="3" fill="#f97316" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "60px 1.25rem 80px", textAlign: "center" }}>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -15 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 9999, padding: "6px 16px", marginBottom: "1.5rem" }}
          >
            <Zap size={14} color="#34d399" />
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#bfdbfe" }}>Everything included in every plan</span>
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "1.25rem" }}
          >
            Every SEO tool you need,
            <br />
            <span style={{ color: "#f97316" }}>perfectly integrated</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "clamp(0.95rem, 3vw, 1.15rem)", color: "#bfdbfe", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.7 }}
          >
            From keyword research to content creation, technical audits to backlink analysis -
            Hi-SEO gives you every tool you need to dominate search rankings and grow organic traffic.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: "3rem" }}
          >
            <Link to="/signup" className="btn-orange">
              Start Free Today <ArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="btn-ghost">
              View Pricing
            </Link>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}
          >
            {[
              { value: "9+", label: "Powerful Tools" },
              { value: "100+", label: "SEO Checks" },
              { value: "Daily", label: "Rank Updates" },
              { value: "AI", label: "Content Writer" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#93c5fd", fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div style={{ position: "relative", lineHeight: 0, marginTop: -2 }}>
          <svg viewBox="0 0 1440 60" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ===== ALL FEATURES ===== */}
      <section style={{ width: "100%", backgroundColor: "white", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-badge-blue">Complete Feature Set</span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              Everything You Need to Win at SEO
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Hi-SEO is not just a collection of tools. It is a complete, connected SEO platform where every feature works together to help you rank higher.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {allFeatures.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp(i * 0.05)}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "center", backgroundColor: "#f8fafc", borderRadius: 20, padding: "2rem", border: "1px solid #e2e8f0", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; el.style.borderColor = "#bfdbfe"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{ order: isEven ? 0 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${feature.colorA}, ${feature.colorB})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", flexShrink: 0 }}>
                        <Icon size={22} color="white" />
                      </div>
                      <h3 style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.25rem" }}>{feature.title}</h3>
                    </div>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{feature.description}</p>
                    <Link
                      to="/signup"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, color: feature.colorA, fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                    >
                      Get started free <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div style={{ order: isEven ? 1 : 0 }}>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {feature.benefits.map((b) => (
                        <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "white", borderRadius: 10, padding: "10px 14px", border: "1px solid #e2e8f0" }}>
                          <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== WORKFLOW ===== */}
      <section style={{ position: "relative", width: "100%", padding: "5rem 0", overflow: "hidden", background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}>
        <div style={{ position: "absolute", inset: 0, ...gridStyle }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-badge-dark">How It Works</span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              Your Complete SEO Workflow
            </h2>
            <p style={{ color: "#bfdbfe", fontSize: "1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Hi-SEO guides you through every step of the SEO process from initial audit to sustained growth.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}
          >
            {workflowSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step} variants={fadeUp(i * 0.08)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", textAlign: "center", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.1)"; el.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "rgba(255,255,255,0.08)", lineHeight: 1, marginBottom: "0.75rem" }}>{s.step}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <Icon size={20} color="#f97316" />
                  </div>
                  <h3 style={{ fontWeight: 700, color: "white", fontSize: "1rem", marginBottom: "0.5rem" }}>{s.title}</h3>
                  <p style={{ color: "#bfdbfe", fontSize: "0.8rem", lineHeight: 1.6 }}>{s.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        <div style={{ position: "relative", lineHeight: 0, marginTop: 40 }}>
          <svg viewBox="0 0 1440 50" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" />
          </svg>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section style={{ width: "100%", backgroundColor: "white", padding: "5rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.25rem" }}>
          <motion.div {...mv(0)} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-badge-blue">Why Hi-SEO Wins</span>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              How We Compare to the Competition
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
              Hi-SEO gives you more value for less money, built specifically for African businesses.
            </p>
          </motion.div>

          <motion.div {...mv(0.1)} style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "12px 0 0 0", fontWeight: 700, color: "#0f172a", width: "35%" }}>Feature</th>
                  {[
                    { name: "Hi-SEO", highlight: true },
                    { name: "Ahrefs", highlight: false },
                    { name: "SEMrush", highlight: false },
                    { name: "Moz", highlight: false },
                  ].map((col, i) => (
                    <th
                      key={col.name}
                      style={{ textAlign: "center", padding: "1rem", backgroundColor: col.highlight ? "#07123f" : "#f8fafc", color: col.highlight ? "white" : "#0f172a", fontWeight: 700, borderRadius: i === 3 ? "0 12px 0 0" : 0 }}
                    >
                      {col.highlight && <span style={{ display: "block", fontSize: "0.65rem", color: "#34d399", marginBottom: 2 }}>BEST VALUE</span>}
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#374151" }}>{row.feature}</td>
                    {[row.hiseo, row.ahrefs, row.semrush, row.moz].map((has, j) => (
                      <td key={j} style={{ textAlign: "center", padding: "0.875rem", backgroundColor: j === 0 ? "rgba(7,18,63,0.03)" : "transparent" }}>
                        {has ? (
                          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", backgroundColor: j === 0 ? "#07123f" : "#d1fae5" }}>
                            <CheckCircle size={14} color={j === 0 ? "white" : "#059669"} />
                          </span>
                        ) : (
                          <span style={{ color: "#cbd5e1", fontSize: "1.2rem", fontWeight: 700 }}>-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ position: "relative", width: "100%", padding: "6rem 0", overflow: "hidden", background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}>
        <div style={{ position: "absolute", inset: 0, ...gridStyle }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.1)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto", padding: "0 1.25rem", textAlign: "center" }}>
          <motion.div {...mv(0)}>
            <h2 style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Ready to Start Growing
              <br />
              <span style={{ color: "#f97316" }}>Your Organic Traffic?</span>
            </h2>
            <p style={{ color: "#bfdbfe", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 2.5rem" }}>
              Join 2,400+ businesses using Hi-SEO to rank higher, drive more traffic, and grow their revenue. Start free today.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link to="/signup" className="btn-orange" style={{ padding: "15px 32px", fontSize: "1rem" }}>
                Start Free - No Card Needed <ArrowRight size={18} />
              </Link>
              <Link to="/pricing" className="btn-ghost" style={{ padding: "15px 24px", fontSize: "1rem" }}>
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
