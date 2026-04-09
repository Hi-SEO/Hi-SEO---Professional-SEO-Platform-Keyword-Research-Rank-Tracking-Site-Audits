import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const CATEGORIES = ["All", "SEO Strategy", "Technical SEO", "Content Marketing", "Link Building", "Tools and Tips", "Case Studies"]

const POSTS = [
  {
    id: 1,
    title: "How to Double Your Organic Traffic in 90 Days Without Buying a Single Backlink",
    excerpt: "A step-by-step framework used by our top-performing users to grow organic traffic dramatically using on-page optimization, content gaps, and internal linking alone.",
    category: "SEO Strategy",
    author: "Emeka Okafor",
    authorRole: "Head of SEO",
    authorColor: "#3b82f6",
    date: "January 28, 2025",
    readTime: "12 min read",
    featured: true,
    tags: ["Traffic Growth", "On-Page SEO", "Content Strategy"],
  },
  {
    id: 2,
    title: "The Complete Guide to Technical SEO Audits in 2025",
    excerpt: "Everything you need to know about running a thorough technical SEO audit, from crawl errors and Core Web Vitals to schema markup and mobile optimization.",
    category: "Technical SEO",
    author: "Fatima Aliyu",
    authorRole: "Technical SEO Lead",
    authorColor: "#06b6d4",
    date: "January 22, 2025",
    readTime: "18 min read",
    featured: false,
    tags: ["Site Audit", "Core Web Vitals", "Technical SEO"],
  },
  {
    id: 3,
    title: "Keyword Research for Nigerian Businesses: A Practical Playbook",
    excerpt: "How to find high-intent keywords that Nigerian audiences actually search for, including local search patterns, language variations, and untapped opportunities.",
    category: "SEO Strategy",
    author: "Chidi Nwosu",
    authorRole: "Content Strategist",
    authorColor: "#f97316",
    date: "January 15, 2025",
    readTime: "10 min read",
    featured: false,
    tags: ["Keyword Research", "Local SEO", "Nigeria"],
  },
  {
    id: 4,
    title: "How We Used AI Content to Rank for 500 Keywords in 60 Days",
    excerpt: "A real case study showing how a client used Hi-SEO AI writer combined with a smart content strategy to capture hundreds of first-page rankings in under two months.",
    category: "Case Studies",
    author: "Adaeze Ibe",
    authorRole: "Growth Manager",
    authorColor: "#10b981",
    date: "January 10, 2025",
    readTime: "15 min read",
    featured: false,
    tags: ["AI Content", "Case Study", "Rankings"],
  },
  {
    id: 5,
    title: "Link Building in 2025: What Actually Works and What to Avoid",
    excerpt: "The definitive guide to building high-quality backlinks in the modern SEO landscape. Includes 12 proven tactics, outreach templates, and red flags to watch out for.",
    category: "Link Building",
    author: "Seun Adeyemi",
    authorRole: "Link Building Specialist",
    authorColor: "#a855f7",
    date: "January 5, 2025",
    readTime: "20 min read",
    featured: false,
    tags: ["Link Building", "Outreach", "Backlinks"],
  },
  {
    id: 6,
    title: "Content Marketing vs SEO: Why You Need Both Working Together",
    excerpt: "Most teams treat content marketing and SEO as separate disciplines. Here is why the most successful brands integrate them tightly and how to do the same for your business.",
    category: "Content Marketing",
    author: "Emeka Okafor",
    authorRole: "Head of SEO",
    authorColor: "#3b82f6",
    date: "December 28, 2024",
    readTime: "8 min read",
    featured: false,
    tags: ["Content Marketing", "SEO Strategy", "Integration"],
  },
  {
    id: 7,
    title: "How to Use Hi-SEO Rank Tracker to Monitor and Recover Lost Rankings",
    excerpt: "A practical walkthrough of using the Hi-SEO rank tracker to identify ranking drops early, diagnose the cause, and implement recovery strategies that actually work.",
    category: "Tools and Tips",
    author: "Fatima Aliyu",
    authorRole: "Technical SEO Lead",
    authorColor: "#06b6d4",
    date: "December 20, 2024",
    readTime: "9 min read",
    featured: false,
    tags: ["Rank Tracking", "Hi-SEO", "Recovery"],
  },
  {
    id: 8,
    title: "The E-E-A-T Framework: How to Build Content Google Trusts and Ranks",
    excerpt: "Google Experience, Expertise, Authoritativeness, and Trustworthiness explained with real examples and a practical checklist for improving your content quality signals.",
    category: "Content Marketing",
    author: "Chidi Nwosu",
    authorRole: "Content Strategist",
    authorColor: "#f97316",
    date: "December 15, 2024",
    readTime: "14 min read",
    featured: false,
    tags: ["E-E-A-T", "Content Quality", "Google"],
  },
  {
    id: 9,
    title: "Core Web Vitals 2025: The Updated Checklist for Perfect Scores",
    excerpt: "Everything that changed in Core Web Vitals for 2025, including the new INP metric replacing FID, and a detailed technical checklist to achieve green scores across all metrics.",
    category: "Technical SEO",
    author: "Adaeze Ibe",
    authorRole: "Growth Manager",
    authorColor: "#10b981",
    date: "December 8, 2024",
    readTime: "16 min read",
    featured: false,
    tags: ["Core Web Vitals", "Page Speed", "Technical"],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  "SEO Strategy": "#3b82f6",
  "Technical SEO": "#06b6d4",
  "Content Marketing": "#f97316",
  "Link Building": "#a855f7",
  "Tools and Tips": "#10b981",
  "Case Studies": "#f59e0b",
}

export default function Blog() {
  const shouldReduceMotion = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = activeCategory === "All"
    ? POSTS
    : POSTS.filter((p) => p.category === activeCategory)

  const featuredPost = POSTS.find((p) => p.featured)
  const regularPosts = filtered.filter((p) => !p.featured || activeCategory !== "All")

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
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            SEO insights and strategies
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            The Hi-SEO{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Blog
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed font-medium"
          >
            Actionable SEO strategies, technical guides, case studies, and product updates from the Hi-SEO team. No fluff, just results.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* FEATURED POST */}
      {activeCategory === "All" && featuredPost && (
        <section className="pt-16 pb-8 bg-white">
          <div className="section-container">
            <motion.div {...fadeUp()}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Featured Article</p>
              <div
                className="group rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-100 hover:shadow-[0_20px_60px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Image placeholder */}
                  <div
                    className="lg:col-span-2 min-h-[280px] relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
                  >
                    <div className="absolute inset-0 bg-grid-overlay opacity-30" />
                    <div className="hero-blob hero-blob-blue" style={{ width: "300px", height: "300px", top: "-50px", right: "-50px", opacity: 0.4 }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                          </svg>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: "rgba(249,115,22,0.2)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)" }}
                        >
                          Featured
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-3 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: `${CATEGORY_COLORS[featuredPost.category]}15`,
                          color: CATEGORY_COLORS[featuredPost.category],
                          border: `1px solid ${CATEGORY_COLORS[featuredPost.category]}25`,
                        }}
                      >
                        {featuredPost.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{featuredPost.readTime}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-700 transition-colors duration-200">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-500 text-base leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
                          style={{ background: featuredPost.authorColor }}
                        >
                          {featuredPost.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{featuredPost.author}</p>
                          <p className="text-xs text-slate-400 font-medium">{featuredPost.date}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all duration-200">
                        Read article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ARTICLES */}
      <section className="py-12 bg-white">
        <div className="section-container">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  background: activeCategory === cat
                    ? cat === "All"
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : CATEGORY_COLORS[cat] || "#3b82f6"
                    : "#f1f5f9",
                  color: activeCategory === cat ? "white" : "#64748b",
                  boxShadow: activeCategory === cat ? "0 4px 12px rgba(59,130,246,0.25)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, i) => {
              const catColor = CATEGORY_COLORS[post.category] || "#3b82f6"
              return (
                <motion.div
                  key={post.id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4) }}
                  className="group rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Card top image area */}
                  <div
                    className="h-40 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${catColor}20, ${catColor}08)` }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: `linear-gradient(90deg, ${catColor}, transparent)` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ background: `${catColor}20`, border: `1px solid ${catColor}30` }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="1.5">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: `${catColor}12`,
                          color: catColor,
                          border: `1px solid ${catColor}20`,
                        }}
                      >
                        {post.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{post.readTime}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug mb-3 group-hover:text-blue-700 transition-colors duration-200 flex-1">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                          style={{ background: post.authorColor }}
                        >
                          {post.author[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{post.author}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{post.date}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-500 group-hover:text-blue-700 flex items-center gap-1 transition-all duration-200 group-hover:gap-2">
                        Read
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-slate-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No posts in this category yet</h3>
              <p className="text-sm text-slate-400 font-medium">Check back soon or browse all articles</p>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20" style={{ background: "#f8fafc" }}>
        <div className="section-container">
          <motion.div
            {...fadeUp()}
            className="max-w-2xl mx-auto text-center"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Weekly SEO insights
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Get the best SEO tips delivered weekly
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Join over 5,000 SEO professionals and founders who get actionable strategies, tool updates, and industry insights every week. No spam, unsubscribe anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-12 px-4 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
              />
              <button
                className="h-12 px-6 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] shrink-0"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 16px rgba(249,115,22,0.4)" }}
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3">
              No spam. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="hero-blob hero-blob-orange animate-blob" style={{ width: "350px", height: "350px", top: "-80px", right: "-60px", opacity: 0.2 }} />
        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Ready to apply what you have learned?
            </h2>
            <p className="text-blue-200/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Start using Hi-SEO today and put every strategy from our blog into action with powerful, easy-to-use tools.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 24px rgba(249,115,22,0.45)" }}
            >
              Start Free Today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
