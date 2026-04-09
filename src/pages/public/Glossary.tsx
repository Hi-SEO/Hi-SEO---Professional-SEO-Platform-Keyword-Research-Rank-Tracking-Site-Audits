import React, { useState, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
})

const TERMS = [
  { term: "Algorithm", category: "Core SEO", letter: "A", desc: "A set of rules and calculations used by search engines to determine the ranking of web pages in search results. Google updates its algorithm thousands of times per year." },
  { term: "Alt Text", category: "On-Page SEO", letter: "A", desc: "Descriptive text added to image HTML tags that helps search engines understand what an image shows. Also improves accessibility for visually impaired users." },
  { term: "Anchor Text", category: "Link Building", letter: "A", desc: "The visible, clickable text in a hyperlink. Search engines use anchor text as a relevance signal to understand what the linked page is about." },
  { term: "Authority", category: "Core SEO", letter: "A", desc: "A measure of a website or page trustworthiness and credibility based on the quality and quantity of backlinks pointing to it. Higher authority generally means better ranking potential." },
  { term: "Backlink", category: "Link Building", letter: "B", desc: "A hyperlink from one website pointing to another. Backlinks are one of the most important ranking factors. High-quality backlinks from authoritative sites pass link equity and improve rankings." },
  { term: "Black Hat SEO", category: "Core SEO", letter: "B", desc: "Unethical SEO practices that violate search engine guidelines, such as keyword stuffing, cloaking, and buying links. These tactics may provide short-term gains but risk severe penalties." },
  { term: "Bounce Rate", category: "Analytics", letter: "B", desc: "The percentage of visitors who leave a website after viewing only one page without taking any action. A high bounce rate can indicate poor user experience or irrelevant content." },
  { term: "Canonical Tag", category: "Technical SEO", letter: "C", desc: "An HTML element that tells search engines which version of a URL is the preferred or master version when duplicate or similar pages exist. Prevents duplicate content issues." },
  { term: "Crawl Budget", category: "Technical SEO", letter: "C", desc: "The number of pages a search engine will crawl on your website within a given time period. Large sites need to manage crawl budget carefully to ensure important pages are indexed." },
  { term: "Core Web Vitals", category: "Technical SEO", letter: "C", desc: "A set of specific factors Google considers important for overall user experience: Largest Contentful Paint (loading), First Input Delay (interactivity), and Cumulative Layout Shift (visual stability)." },
  { term: "CTR", category: "Analytics", letter: "C", desc: "Click-Through Rate. The percentage of people who click on your search result after seeing it. A higher CTR means your title and meta description are compelling and relevant to searchers." },
  { term: "Domain Authority", category: "Link Building", letter: "D", desc: "A score developed by Moz that predicts how likely a website is to rank in search engine results. Scores range from 1 to 100. Higher scores indicate greater ranking potential." },
  { term: "Duplicate Content", category: "Technical SEO", letter: "D", desc: "Content that appears on the internet in more than one place. Search engines struggle to determine which version to rank and may penalize sites with significant duplicate content issues." },
  { term: "E-E-A-T", category: "Core SEO", letter: "E", desc: "Experience, Expertise, Authoritativeness, and Trustworthiness. Google quality rater guidelines that assess the credibility of content creators and websites. Crucial for YMYL topics." },
  { term: "Featured Snippet", category: "SERP Features", letter: "F", desc: "A selected search result that appears at the top of Google results in a box, providing a direct answer to a query. Also called Position Zero. Capturing snippets dramatically increases visibility." },
  { term: "Google Search Console", category: "Tools", letter: "G", desc: "A free tool by Google that helps website owners monitor their site performance in Google Search, identify indexing issues, and understand which queries drive traffic." },
  { term: "Heading Tags", category: "On-Page SEO", letter: "H", desc: "HTML elements (H1 through H6) used to structure content hierarchically. H1 is the main page title, with H2 and H3 used for subheadings. Proper heading structure helps SEO and readability." },
  { term: "Hreflang", category: "Technical SEO", letter: "H", desc: "An HTML attribute used to specify the language and geographical targeting of a webpage. Important for multilingual and international websites to prevent duplicate content issues." },
  { term: "Index", category: "Core SEO", letter: "I", desc: "The database where search engines store all the web pages they have crawled. For your pages to appear in search results, they must first be discovered and added to the index." },
  { term: "Internal Links", category: "On-Page SEO", letter: "I", desc: "Hyperlinks that connect one page of a website to another page on the same website. Internal links help distribute page authority, improve crawlability, and guide users through your content." },
  { term: "Keyword", category: "Keyword Research", letter: "K", desc: "A word or phrase that users type into search engines to find information. Keywords are the foundation of SEO strategy, used to optimize content for topics your target audience searches for." },
  { term: "Keyword Density", category: "Keyword Research", letter: "K", desc: "The percentage of times a keyword appears in a piece of content relative to the total word count. Modern SEO focuses on natural keyword use rather than specific density targets." },
  { term: "Keyword Difficulty", category: "Keyword Research", letter: "K", desc: "A metric that estimates how hard it will be to rank on the first page of search results for a given keyword based on the competition and authority of currently ranking pages." },
  { term: "Link Equity", category: "Link Building", letter: "L", desc: "Also called link juice. The value and authority passed from one page to another through hyperlinks. Pages with more high-quality inbound links have more equity to pass on." },
  { term: "Long-tail Keywords", category: "Keyword Research", letter: "L", desc: "Longer, more specific keyword phrases with lower search volume but higher conversion intent. Long-tail keywords are usually less competitive and easier to rank for than short head terms." },
  { term: "Meta Description", category: "On-Page SEO", letter: "M", desc: "An HTML element that provides a brief summary of a web page shown in search results below the title. While not a direct ranking factor, compelling meta descriptions improve click-through rates." },
  { term: "Meta Tags", category: "On-Page SEO", letter: "M", desc: "HTML tags in the head section of a webpage that provide information about the page to search engines and browsers. Key meta tags include title, description, robots, and viewport." },
  { term: "Nofollow", category: "Link Building", letter: "N", desc: "An attribute added to a link that tells search engines not to pass link equity to the linked page. Used on paid links, user-generated content, and links you do not want to endorse." },
  { term: "Organic Traffic", category: "Analytics", letter: "O", desc: "Website visitors who arrive through unpaid search engine results rather than paid advertisements. Organic traffic is considered the most valuable type as it is sustainable and cost-effective." },
  { term: "Page Speed", category: "Technical SEO", letter: "P", desc: "How fast a webpage loads for users. Page speed is a confirmed Google ranking factor. Faster pages provide better user experience, lower bounce rates, and improved search rankings." },
  { term: "PageRank", category: "Core SEO", letter: "P", desc: "The original Google algorithm named after Larry Page that measures the importance of web pages based on the quantity and quality of links pointing to them. Still a core part of Google ranking." },
  { term: "Robots.txt", category: "Technical SEO", letter: "R", desc: "A text file that tells search engine crawlers which pages or sections of a website they should or should not crawl. Used to manage crawl budget and prevent indexing of unwanted pages." },
  { term: "Schema Markup", category: "Technical SEO", letter: "S", desc: "Structured data added to HTML that helps search engines understand the content and context of a page. Can enable rich results like star ratings, FAQs, and product information in search results." },
  { term: "Search Intent", category: "Keyword Research", letter: "S", desc: "The primary goal or purpose behind a user search query. Four main types: informational, navigational, commercial, and transactional. Matching content to search intent is critical for ranking." },
  { term: "SERP", category: "Core SEO", letter: "S", desc: "Search Engine Results Page. The page displayed by a search engine in response to a query. Modern SERPs contain organic results, paid ads, featured snippets, local packs, and various rich features." },
  { term: "Sitemap", category: "Technical SEO", letter: "S", desc: "An XML file that lists all the important URLs on a website, helping search engines discover and crawl pages more efficiently. Submitting a sitemap to Google Search Console is a best practice." },
  { term: "Title Tag", category: "On-Page SEO", letter: "T", desc: "An HTML element that specifies the title of a web page. Shown as the clickable headline in search results. One of the most important on-page SEO factors for both rankings and click-through rates." },
  { term: "URL Structure", category: "Technical SEO", letter: "U", desc: "The format and organization of web page addresses. Clean, descriptive URLs that include target keywords and logical hierarchy are preferred by both users and search engines." },
  { term: "White Hat SEO", category: "Core SEO", letter: "W", desc: "Ethical SEO practices that comply with search engine guidelines and focus on providing value to users. White hat techniques include quality content creation, natural link building, and technical optimization." },
  { term: "XML Sitemap", category: "Technical SEO", letter: "X", desc: "A file that lists all the pages of a website in XML format to help search engines discover and crawl content. Different from HTML sitemaps which are designed for human visitors." },
]

const CATEGORIES = ["All", "Core SEO", "Technical SEO", "On-Page SEO", "Keyword Research", "Link Building", "SERP Features", "Analytics", "Tools"]

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const CATEGORY_COLORS: Record<string, string> = {
  "Core SEO": "#3b82f6",
  "Technical SEO": "#06b6d4",
  "On-Page SEO": "#10b981",
  "Keyword Research": "#f97316",
  "Link Building": "#a855f7",
  "SERP Features": "#f59e0b",
  "Analytics": "#ef4444",
  "Tools": "#64748b",
}

export default function Glossary() {
  const shouldReduceMotion = useReducedMotion()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLetter, setActiveLetter] = useState("")

  const filtered = useMemo(() => {
    return TERMS.filter((t) => {
      const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === "All" || t.category === activeCategory
      const matchLetter = !activeLetter || t.letter === activeLetter
      return matchSearch && matchCategory && matchLetter
    })
  }, [search, activeCategory, activeLetter])

  const availableLetters = useMemo(() => {
    return new Set(TERMS.filter((t) => {
      const matchCategory = activeCategory === "All" || t.category === activeCategory
      return matchCategory
    }).map((t) => t.letter))
  }, [activeCategory])

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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {TERMS.length} SEO terms explained
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6"
          >
            The complete{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              SEO glossary
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-200/70 text-xl leading-relaxed mb-10 font-medium"
          >
            Every SEO term you will ever need, explained in plain language. From algorithm basics to advanced technical concepts.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative max-w-lg mx-auto"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SEO terms..."
              className="w-full h-14 pl-12 pr-5 rounded-2xl text-sm font-medium text-white placeholder:text-white/35 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
              }}
            />
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

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveLetter("") }}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  background: activeCategory === cat
                    ? (cat === "All" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : CATEGORY_COLORS[cat] || "#3b82f6")
                    : "#f1f5f9",
                  color: activeCategory === cat ? "white" : "#64748b",
                  boxShadow: activeCategory === cat ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Letter filter */}
          <div className="flex flex-wrap gap-1 mb-10">
            {LETTERS.map((letter) => {
              const available = availableLetters.has(letter)
              const isActive = activeLetter === letter
              return (
                <button
                  key={letter}
                  onClick={() => available && setActiveLetter(isActive ? "" : letter)}
                  disabled={!available}
                  className="w-8 h-8 rounded-lg text-xs font-black transition-all duration-200"
                  style={{
                    background: isActive ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : available ? "#f8fafc" : "transparent",
                    color: isActive ? "white" : available ? "#475569" : "#cbd5e1",
                    border: isActive ? "none" : available ? "1px solid #e2e8f0" : "none",
                    cursor: available ? "pointer" : "default",
                  }}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-bold">{filtered.length}</span> of {TERMS.length} terms
            </p>
            {(search || activeLetter || activeCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setActiveLetter(""); setActiveCategory("All") }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear filters
              </button>
            )}
          </div>

          {/* Terms grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-slate-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No terms found</h3>
              <p className="text-sm text-slate-400 font-medium">Try a different search term or clear your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((term, i) => {
                const color = CATEGORY_COLORS[term.category] || "#3b82f6"
                return (
                  <motion.div
                    key={term.term}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                    className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_12px_40px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                    />
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black mb-2"
                          style={{ background: `${color}15`, color: color }}
                        >
                          {term.letter}
                        </div>
                        <h3 className="text-base font-black text-slate-900">{term.term}</h3>
                      </div>
                    </div>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-3"
                      style={{ background: `${color}12`, color: color, border: `1px solid ${color}20` }}
                    >
                      {term.category}
                    </span>
                    <p className="text-sm text-slate-500 leading-relaxed">{term.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)" }}
      >
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div className="section-container relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Put your SEO knowledge to work
            </h2>
            <p className="text-blue-200/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Now that you know the terms, use Hi-SEO to apply them. Start auditing, researching, and ranking today.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 24px rgba(249,115,22,0.45)" }}
            >
              Start Free Today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
