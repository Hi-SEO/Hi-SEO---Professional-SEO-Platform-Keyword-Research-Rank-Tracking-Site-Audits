import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Search, BarChart3, Link2, FileText, Globe,
  TrendingUp, Shield, CheckCircle, ChevronDown,
  ArrowRight, Star, Users, Award, Target
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const features = [
  { icon: Search, title: "Keyword Explorer", description: "Uncover high-value keywords with real search volume, difficulty scores, and intent signals. Find the exact terms your audience is searching for.", color: "from-blue-500 to-cyan-500", glow: "group-hover:shadow-blue-500/25" },
  { icon: BarChart3, title: "Rank Tracker", description: "Monitor your keyword positions daily across Google and Bing. Get instant alerts when rankings shift and understand what is driving the changes.", color: "from-orange-500 to-amber-500", glow: "group-hover:shadow-orange-500/25" },
  { icon: Globe, title: "Site Audit", description: "Run comprehensive technical SEO audits in seconds. Identify crawl errors, broken links, slow pages, and on-page issues with actionable fix guidance.", color: "from-emerald-500 to-teal-500", glow: "group-hover:shadow-emerald-500/25" },
  { icon: Link2, title: "Backlink Analytics", description: "Analyze your backlink profile and your competitors. Discover new link opportunities, track domain authority growth, and disavow toxic links.", color: "from-purple-500 to-violet-500", glow: "group-hover:shadow-purple-500/25" },
  { icon: FileText, title: "AI Content Writer", description: "Generate SEO-optimized content briefs, outlines, and full articles in seconds. Every piece is crafted to rank and convert from day one.", color: "from-pink-500 to-rose-500", glow: "group-hover:shadow-pink-500/25" },
  { icon: Target, title: "Competitor Analysis", description: "Reverse-engineer your competitors top pages, keyword gaps, and backlink sources. Turn their strengths into your next SEO opportunity.", color: "from-cyan-500 to-blue-500", glow: "group-hover:shadow-cyan-500/25" },
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

const trustStats = [
  { value: "2,400+", label: "Active Users" },
  { value: "12M+", label: "Keywords Tracked" },
  { value: "98.7%", label: "Uptime SLA" },
  { value: "4.9/5", label: "User Rating" },
];

const gridStyle = {
  backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const motionProps = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : { variants: fadeUp(delay), initial: "hidden", whileInView: "visible", viewport: { once: true } };

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#07123f] via-[#0d1f6e] to-[#1239a8]">
        <div className="absolute inset-0 opacity-10" style={gridStyle} />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            {...(shouldReduceMotion ? {} : { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } })}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-100">The SEO Platform Built for African Businesses</span>
          </motion.div>

          <motion.h1
            {...(shouldReduceMotion ? {} : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.1 } })}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6"
          >
            Rank Higher.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-orange-300 bg-clip-text text-transparent">
              Grow Faster.
            </span>
            <br />
            Win Online.
          </motion.h1>

          <motion.p
            {...(shouldReduceMotion ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.2 } })}
            className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Hi-SEO is the all-in-one SEO platform that gives you the tools, data, and AI-powered insights
            to dominate search rankings and drive consistent organic traffic to your business.
            From technical audits to keyword research, backlink analysis to content strategy - everything you need, in one powerful platform.
          </motion.p>

          <motion.div
            {...(shouldReduceMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.35 } })}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] transition-all duration-300 hover:scale-105"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105"
            >
              See All Features
            </Link>
          </motion.div>

          <motion.div
            {...(shouldReduceMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 0.5 } })}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-blue-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p {...motionProps(0)} className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by growth teams at leading companies
          </motion.p>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
            {["FinTech Nigeria", "RetailPro", "GrowthLab Agency", "MediaHub Africa", "EcomNation", "StartupNG"].map((brand) => (
              <motion.div key={brand} variants={fadeUp()} className="text-slate-300 font-bold text-base tracking-tight hover:text-slate-500 transition-colors duration-300 cursor-default">
                {brand}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(0)} className="text-center mb-16">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">Everything You Need</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">One Platform. Every SEO Tool.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stop juggling 6 different tools and spreadsheets. Hi-SEO brings your entire SEO workflow into one intelligent, connected platform built for teams that want to move fast.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp()}
                  className={`group relative bg-white border border-slate-100 rounded-2xl p-8 cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.glow} hover:border-transparent`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    <div className="mt-6 flex items-center gap-1 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div {...motionProps(0.2)} className="text-center mt-12">
            <Link to="/features" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
              Explore All Features <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative bg-gradient-to-br from-[#07123f] via-[#0d1f6e] to-[#1239a8] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={gridStyle} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(0)} className="text-center mb-16">
            <span className="inline-block bg-white/10 text-blue-200 text-sm font-semibold px-4 py-2 rounded-full mb-4">Simple Setup</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">From Zero to Ranking in 3 Steps</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Getting started with Hi-SEO takes less than 5 minutes. No complex setup, no agency required. Just connect, discover, and grow.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp(i * 0.1)}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-6xl font-black text-white/10 mb-4 leading-none">{step.number}</div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-blue-200 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...motionProps(0)}>
              <span className="inline-block bg-orange-50 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">Why Hi-SEO</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">Every Feature You Need to Dominate Search</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Hi-SEO is not just another SEO dashboard. It is an integrated growth engine that connects your keyword data, technical health, content performance, and backlink authority into one unified view of your SEO performance.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-4 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300">
                Start Free Today <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <motion.div key={benefit} variants={fadeUp()} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(0)} className="text-center mb-16">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">Real Results</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">Teams That Grew With Hi-SEO</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of marketers, founders, and agencies who use Hi-SEO to rank higher and grow faster.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp()}
                className="group bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(0)} className="text-center mb-16">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">Common Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know before getting started with Hi-SEO.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp()} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-blue-50/50 transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
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
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
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

      {/* FINAL CTA */}
      <section className="relative bg-gradient-to-br from-[#07123f] via-[#0d1f6e] to-[#1239a8] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={gridStyle} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...motionProps(0)}>
            <div className="flex justify-center gap-2 mb-6">
              {[Award, Shield, Users].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-200" />
                </div>
              ))}
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
              Your Competitors Are
              <br />
              <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                Already Using SEO Tools.
              </span>
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every day you wait is another day your competitors rank above you, capture your customers, and grow their organic traffic.
              Start your free Hi-SEO account in 60 seconds. No credit card. No commitment. Just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-5 rounded-xl text-lg shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_rgba(249,115,22,0.7)] transition-all duration-300 hover:scale-105"
              >
                Start Free - No Card Needed
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-300 hover:scale-105"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-6 text-blue-300 text-sm">Free plan available forever. Upgrade when you are ready to scale.</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
