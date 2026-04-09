import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Search, BarChart3, Link2, FileText, Globe,
  TrendingUp, CheckCircle, ChevronDown,
  ArrowRight, Star, Users, Award, Target, Zap, Shield
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
  },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const gridStyle = {
  backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
};

const features = [
  { icon: Search, title: "Keyword Explorer", description: "Uncover high-value keywords with real search volume, difficulty scores, and intent signals. Find the exact terms your audience is searching for.", color: "from-blue-500 to-cyan-500" },
  { icon: BarChart3, title: "Rank Tracker", description: "Monitor your keyword positions daily across Google and Bing. Get instant alerts when rankings shift and understand what is driving the changes.", color: "from-orange-500 to-amber-500" },
  { icon: Globe, title: "Site Audit", description: "Run comprehensive technical SEO audits in seconds. Identify crawl errors, broken links, slow pages, and on-page issues with actionable fix guidance.", color: "from-emerald-500 to-teal-500" },
  { icon: Link2, title: "Backlink Analytics", description: "Analyze your backlink profile and your competitors. Discover new link opportunities, track domain authority growth, and disavow toxic links.", color: "from-purple-500 to-violet-500" },
  { icon: FileText, title: "AI Content Writer", description: "Generate SEO-optimized content briefs, outlines, and full articles in seconds. Every piece is crafted to rank and convert from day one.", color: "from-pink-500 to-rose-500" },
  { icon: Target, title: "Competitor Analysis", description: "Reverse-engineer your competitors top pages, keyword gaps, and backlink sources. Turn their strengths into your next SEO opportunity.", color: "from-cyan-500 to-blue-500" },
];

const steps = [
  { number: "01", title: "Connect Your Website", description: "Add your domain and let Hi-SEO instantly crawl your site, audit your technical health, and map your current keyword positions.", icon: Globe },
  { number: "02", title: "Discover Opportunities", description: "Use our Keyword Explorer, Competitor Analysis, and AI insights to find exactly where you can rank higher and outperform the competition.", icon: Search },
  { number: "03", title: "Execute and Grow", description: "Follow your personalized SEO action plan, track your progress daily, and watch your organic traffic climb week after week.", icon: TrendingUp },
];

const benefits = [
  "Full site technical audit in under 60 seconds",
  "Daily keyword rank tracking across all search engines",
  "AI-powered content briefs that actually rank",
  "Competitor gap analysis in one click",
  "Backlink monitoring and toxic link alerts",
  "Custom PDF reports for clients or stakeholders",
  "Real-time SERP analysis and feature tracking",
  "Team collaboration tools built in",
];

const testimonials = [
  { name: "Chidi Okonkwo", role: "SEO Director, FinTech Nigeria", avatar: "CO", rating: 5, text: "Hi-SEO completely transformed how our team manages SEO. The keyword explorer and rank tracker alone saved us 10 hours per week. Our organic traffic is up 340 percent in 4 months." },
  { name: "Amaka Eze", role: "Founder, GrowthLab Agency", avatar: "AE", rating: 5, text: "I have used every major SEO tool on the market. Hi-SEO is the first one built for the African market that actually understands our search landscape. The pricing is fair and the data is accurate." },
  { name: "Seun Adeyemi", role: "Head of Digital, RetailPro", avatar: "SA", rating: 5, text: "The site audit feature caught 47 critical issues on our e-commerce site that we had no idea about. After fixing them, our rankings jumped significantly within 6 weeks. Incredible tool." },
];

const faqs = [
  { question: "How is Hi-SEO different from other SEO tools?", answer: "Hi-SEO is purpose-built for businesses operating in African and emerging markets. Our keyword data, search volume metrics, and competitor intelligence are calibrated for your actual market. We combine world-class SEO tooling with pricing and support that makes sense for growing businesses in Nigeria and across Africa." },
  { question: "Do I need any technical knowledge to use Hi-SEO?", answer: "Not at all. Hi-SEO is designed for marketing teams, business owners, and SEO professionals alike. Every report comes with plain-language explanations and step-by-step fix guides. If you understand that you want more traffic from Google, you are ready to use Hi-SEO." },
  { question: "How accurate is the keyword and ranking data?", answer: "Our data is sourced from live search index sampling and updated daily. Keyword volumes are aggregated from multiple reliable sources and cross-validated for accuracy. Rank tracking is checked daily for all tracked keywords across your target location and device type." },
  { question: "Can I try Hi-SEO before paying?", answer: "Yes. Our Starter plan is completely free and includes a full site audit, up to 10 tracked keywords, and access to our keyword explorer with limited queries. No credit card required to get started. Upgrade only when you are ready to scale." },
  { question: "Is my data secure?", answer: "Absolutely. All data is encrypted at rest and in transit. We use Supabase with row-level security ensuring your data is never accessible to other users. We do not sell your data or share it with third parties under any circumstances." },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "Perfect for individuals getting started with SEO",
    features: ["1 Project", "10 Keywords", "1 Site Audit/mo", "Basic Reports"],
    popular: false,
    cta: "Start Free",
    href: "/signup",
    accentColor: "#64748b",
  },
  {
    name: "Pro",
    price: "15,000",
    period: "/mo",
    desc: "Best for growing businesses and freelancers",
    features: ["5 Projects", "500 Keywords", "10 Audits/mo", "AI Writer", "Priority Support"],
    popular: false,
    cta: "Get Started",
    href: "/signup",
    accentColor: "#1d4ed8",
  },
  {
    name: "Business",
    price: "45,000",
    period: "/mo",
    desc: "For agencies and high-traffic websites",
    features: ["20 Projects", "2,000 Keywords", "Unlimited Audits", "White-label Reports", "API Access"],
    popular: true,
    cta: "Get Started",
    href: "/signup",
    accentColor: "#f97316",
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    desc: "Enterprise-grade for large teams and agencies",
    features: ["Unlimited Projects", "Unlimited Keywords", "Dedicated Manager", "Custom Integrations", "SLA Guarantee"],
    popular: false,
    cta: "Contact Sales",
    href: "/contact",
    accentColor: "#7c3aed",
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mv = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          variants: fadeUp(delay),
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.2 },
        };

  return (
    <div className="w-full overflow-x-hidden">

      {/* ============ HERO ============ */}
      <section
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}
      >
        {/* Grid */}
        <div className="absolute inset-0" style={gridStyle} />

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: "#3b82f6" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]" style={{ backgroundColor: "#06b6d4" }} />

        {/* Left geometric */}
        <div className="absolute left-0 top-0 bottom-0 w-48 flex items-center opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 500" fill="none" className="w-full h-full">
            <rect x="-40" y="150" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(-15 50 240)" />
            <rect x="-20" y="170" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(-15 70 260)" />
            <circle cx="20" cy="350" r="5" fill="#f97316" />
            <circle cx="120" cy="280" r="3" fill="#f97316" />
            <circle cx="60" cy="420" r="4" fill="#06b6d4" />
          </svg>
        </div>

        {/* Right geometric */}
        <div className="absolute right-0 top-0 bottom-0 w-48 flex items-center opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 500" fill="none" className="w-full h-full">
            <rect x="60" y="120" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(15 150 210)" />
            <rect x="40" y="140" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(15 130 230)" />
            <circle cx="180" cy="100" r="5" fill="#f97316" />
            <circle cx="80" cy="300" r="3" fill="#f97316" />
            <circle cx="150" cy="380" r="4" fill="#06b6d4" />
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-32 text-center">

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-sm font-semibold text-blue-100">The SEO Platform Built for African Businesses</span>
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6"
          >
            Rank Higher and Grow
            <br />
            <span style={{ color: "#f97316" }}>Your Business Online</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Hi-SEO gives you keyword research, rank tracking, site audits, backlink analysis,
            and AI content tools to dominate Google and drive consistent organic traffic to your business.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#f97316", boxShadow: "0 8px 32px rgba(249,115,22,0.45)" }}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "2,400+", label: "Active Users" },
              { value: "12M+", label: "Keywords Tracked" },
              { value: "98.7%", label: "Uptime SLA" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-blue-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 80" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...mv(0)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Join 2,400+ Businesses Already Using Hi-SEO
            </h2>
            <p className="text-slate-500 text-lg">Real results from real customers across Africa and beyond</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp(i * 0.08)}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...mv(0.2)} className="flex justify-center">
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-6 py-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>
              <span className="text-slate-700 text-sm font-semibold">Rated 4.9 / 5 based on 2,400+ reviews</span>
              <span className="text-emerald-600 font-bold text-sm">Verified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="w-full bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...mv(0)} className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Everything You Need
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              One Platform. Every SEO Tool.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop juggling 6 different tools and spreadsheets. Hi-SEO brings your entire SEO workflow
              into one intelligent, connected platform built for teams that want to move fast.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp()}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 cursor-default"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                    <div className="mt-5 flex items-center gap-1 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div {...mv(0.2)} className="text-center mt-12">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: "#1239a8", boxShadow: "0 4px 20px rgba(18,57,168,0.3)" }}
            >
              Explore All Features <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        className="relative w-full py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}
      >
        <div className="absolute inset-0" style={gridStyle} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-[120px]" style={{ backgroundColor: "#06b6d4" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...mv(0)} className="text-center mb-16">
            <span className="inline-block bg-white/10 text-blue-200 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Simple Setup
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              From Zero to Ranking in 3 Steps
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Getting started with Hi-SEO takes less than 5 minutes. No complex setup, no agency required.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp(i * 0.12)}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-7xl font-black leading-none mb-4" style={{ color: "rgba(255,255,255,0.07)" }}>{step.number}</div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-white/20 mb-5 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "rgba(249,115,22,0.15)" }}>
                    <Icon className="w-7 h-7" style={{ color: "#f97316" }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-blue-200 leading-relaxed text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="#f8fafc" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="w-full bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...mv(0)}>
              <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
                Why Hi-SEO
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Every Feature You Need to Dominate Search
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Hi-SEO is not just another SEO dashboard. It is an integrated growth engine that connects
                your keyword data, technical health, content performance, and backlink authority into one
                unified view of your SEO performance.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#f97316", boxShadow: "0 4px 20px rgba(249,115,22,0.35)" }}
              >
                Start Free Today <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={fadeUp()}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ PRICING PREVIEW ============ */}
      <section className="w-full bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...mv(0)} className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Simple Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Plans for Every Stage of Growth
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no long-term contracts.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp(i * 0.08)}
                className={`relative bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl ${
                  plan.popular
                    ? "border-2 shadow-xl"
                    : "border border-slate-200 hover:border-blue-200"
                }`}
                style={plan.popular ? { borderColor: "#f97316", boxShadow: "0 8px 40px rgba(249,115,22,0.15)" } : {}}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: plan.accentColor }} />

                {/* Most popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="inline-block text-white text-xs font-bold px-4 py-1.5 rounded-full" style={{ backgroundColor: "#f97316" }}>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="pt-3">
                  <h3 className="text-lg font-black text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-xs mb-5 leading-relaxed">{plan.desc}</p>

                  {/* Price */}
                  <div className="mb-5">
                    {plan.price === "Free" ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900">Free</span>
                        <span className="text-slate-500 text-sm">{plan.period}</span>
                      </div>
                    ) : plan.price === "Custom" ? (
                      <span className="text-4xl font-black text-slate-900">Custom</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-400 font-semibold">NGN</span>
                        <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-slate-500 text-sm">{plan.period}</span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-10 h-0.5 mb-5 rounded-full" style={{ background: `linear-gradient(90deg, ${plan.accentColor}, transparent)` }} />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to={plan.href}
                    className="block w-full text-center text-white font-bold py-3 rounded-xl text-sm transition-all duration-300 hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: plan.popular ? "#f97316" : plan.accentColor }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...mv(0.3)} className="text-center mt-10">
            <Link
              to="/pricing"
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm underline underline-offset-4 transition-colors duration-200"
            >
              View full pricing comparison table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="w-full bg-slate-50 py-24">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <motion.div {...mv(0)} className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know before getting started with Hi-SEO.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp()}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-blue-50/50 transition-colors duration-200 gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-3 text-slate-600 leading-relaxed text-sm border-t border-slate-100">
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

      {/* ============ FINAL CTA ============ */}
      <section
        className="relative w-full py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #07123f 0%, #0a1a6e 50%, #1239a8 100%)" }}
      >
        <div className="absolute inset-0" style={gridStyle} />

        {/* Left geometric */}
        <div className="absolute left-0 top-0 bottom-0 w-48 flex items-center opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 500" fill="none" className="w-full h-full">
            <rect x="-40" y="150" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(-15 50 240)" />
            <rect x="-20" y="170" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(-15 70 260)" />
            <circle cx="20" cy="350" r="5" fill="#f97316" />
            <circle cx="120" cy="280" r="3" fill="#f97316" />
          </svg>
        </div>

        {/* Right geometric */}
        <div className="absolute right-0 top-0 bottom-0 w-48 flex items-center opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 500" fill="none" className="w-full h-full">
            <rect x="60" y="120" width="180" height="180" stroke="white" strokeWidth="1" fill="none" transform="rotate(15 150 210)" />
            <rect x="40" y="140" width="180" height="180" stroke="white" strokeWidth="0.5" fill="none" transform="rotate(15 130 230)" />
            <circle cx="180" cy="100" r="5" fill="#f97316" />
            <circle cx="80" cy="300" r="3" fill="#f97316" />
          </svg>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[120px]" style={{ backgroundColor: "#3b82f6" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div {...mv(0)}>
            <div className="flex justify-center gap-3 mb-8">
              {[Award, Shield, Users, Zap].map((Icon, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <Icon className="w-6 h-6 text-blue-200" />
                </div>
              ))}
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
              Your Competitors Are Already
              <br />
              <span style={{ color: "#f97316" }}>Gaining Ground on You.</span>
            </h2>

            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every day without Hi-SEO is another day your competitors rank above you and capture your customers.
              Start your free account in 60 seconds. No credit card. No commitment. Just results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#f97316", boxShadow: "0 8px 40px rgba(249,115,22,0.5)" }}
              >
                Start Free - No Card Needed
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-6 text-blue-300 text-sm font-medium">
              Free plan available forever. Upgrade when you are ready to scale.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
