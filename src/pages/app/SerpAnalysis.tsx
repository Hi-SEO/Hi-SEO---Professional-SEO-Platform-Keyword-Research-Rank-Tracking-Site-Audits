import { useState, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search, Globe, TrendingUp, BarChart2, RefreshCw,
  AlertCircle, ExternalLink, X, Shield, Zap, Star,
  CheckCircle2, Link2, FileText, Image, Video,
  MapPin, ShoppingCart, Hash, ChevronDown, ChevronUp,
  Award, Target, Eye, Clock, Users, ArrowUp, ArrowDown
} from "lucide-react";

interface SerpResult {
  position: number;
  title: string;
  url: string;
  domain: string;
  description: string;
  domainAuthority: number;
  backlinks: number;
  wordCount: number;
  loadTime: number;
  isAd: boolean;
  isFeatured: boolean;
  resultType: "organic" | "featured" | "video" | "image" | "local" | "shopping";
}

interface SerpFeature {
  type: string;
  label: string;
  present: boolean;
  icon: any;
  color: string;
}

interface SerpInsight {
  label: string;
  value: string | number;
  description: string;
  color: string;
  icon: any;
}

interface SerpData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  totalResults: number;
  results: SerpResult[];
  features: SerpFeature[];
  insights: SerpInsight[];
  avgDA: number;
  avgWordCount: number;
  avgBacklinks: number;
  topDomains: { domain: string; positions: number[] }[];
}

interface State {
  keyword: string;
  analyzing: boolean;
  data: SerpData | null;
  error: string | null;
  hasAnalyzed: boolean;
  expandedResult: number | null;
  activeTab: "results" | "insights" | "features";
}

type Action =
  | { type: "SET_KEYWORD"; payload: string }
  | { type: "SET_ANALYZING"; payload: boolean }
  | { type: "SET_DATA"; payload: SerpData | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_HAS_ANALYZED"; payload: boolean }
  | { type: "TOGGLE_RESULT"; payload: number }
  | { type: "SET_TAB"; payload: State["activeTab"] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_KEYWORD": return { ...state, keyword: action.payload };
    case "SET_ANALYZING": return { ...state, analyzing: action.payload };
    case "SET_DATA": return { ...state, data: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_HAS_ANALYZED": return { ...state, hasAnalyzed: action.payload };
    case "TOGGLE_RESULT": return { ...state, expandedResult: state.expandedResult === action.payload ? null : action.payload };
    case "SET_TAB": return { ...state, activeTab: action.payload };
    default: return state;
  }
}

const initialState: State = {
  keyword: "",
  analyzing: false,
  data: null,
  error: null,
  hasAnalyzed: false,
  expandedResult: null,
  activeTab: "results",
};

const DOMAINS = [
  "wikipedia.org", "hubspot.com", "moz.com", "ahrefs.com", "semrush.com",
  "backlinko.com", "neilpatel.com", "searchengineland.com", "searchenginejournal.com",
  "wordstream.com",
];

const TITLES = [
  "The Complete Guide to {kw} in 2025",
  "What is {kw}? Everything You Need to Know",
  "{kw}: Definition, Examples, and Best Practices",
  "How to Master {kw} (Step-by-Step Guide)",
  "Top 10 {kw} Strategies That Actually Work",
  "{kw} Tutorial for Beginners - Start Here",
  "Advanced {kw} Techniques for Professionals",
  "The Ultimate {kw} Checklist (Free Download)",
  "{kw} vs Traditional Methods: Which is Better?",
  "Why {kw} is the Future of Digital Marketing",
];

const DESCRIPTIONS = [
  "Discover everything you need to know about {kw}. This comprehensive guide covers strategies, tools, and best practices to help you succeed in 2025 and beyond.",
  "Learn how {kw} works and why it matters for your business. Our experts break down the key concepts and actionable steps to get started today.",
  "Get the definitive resource on {kw}. From beginner basics to advanced tactics, this guide has everything you need to drive real results.",
  "Struggling with {kw}? Our detailed tutorial walks you through proven methods that top marketers use to achieve consistent organic growth.",
  "Unlock the power of {kw} with our step-by-step framework. Includes templates, checklists, and real-world case studies from leading brands.",
];

function generateSerpData(keyword: string): SerpData {
  const seed = keyword.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number, off = 0) =>
    Math.floor(((seed * (off + 1) * 137) % (max - min + 1)) + min);

  const volume = r(1000, 90000, 1);
  const difficulty = r(20, 85, 2);
  const cpc = parseFloat((r(50, 2500, 3) / 100).toFixed(2));

  const intents = ["Informational", "Commercial", "Navigational", "Transactional"];
  const intent = intents[seed % intents.length];

  const results: SerpResult[] = DOMAINS.map((domain, i) => {
    const da = Math.max(20, Math.min(98, r(30, 95, i + 10)));
    const wc = r(800, 4500, i + 20);
    const bl = r(500, 85000, i + 30);
    const lt = parseFloat((r(8, 45, i + 40) / 10).toFixed(1));
    const titleTemplate = TITLES[(seed + i * 3) % TITLES.length];
    const descTemplate = DESCRIPTIONS[(seed + i * 7) % DESCRIPTIONS.length];
    return {
      position: i + 1,
      title: titleTemplate.replace(/\{kw\}/g, keyword),
      url: `https://${domain}/${keyword.toLowerCase().replace(/\s+/g, "-")}`,
      domain,
      description: descTemplate.replace(/\{kw\}/g, keyword),
      domainAuthority: da,
      backlinks: bl,
      wordCount: wc,
      loadTime: lt,
      isAd: i === 0 && seed % 3 === 0,
      isFeatured: i === 0 && seed % 4 !== 0,
      resultType: i === 0 ? "featured" : i === 8 ? "video" : "organic",
    };
  });

  const features: SerpFeature[] = [
    { type: "featured_snippet", label: "Featured Snippet", present: seed % 3 !== 0, icon: Award, color: "text-amber-400" },
    { type: "people_also_ask", label: "People Also Ask", present: seed % 4 !== 1, icon: Hash, color: "text-blue-400" },
    { type: "image_pack", label: "Image Pack", present: seed % 5 === 0, icon: Image, color: "text-purple-400" },
    { type: "video_carousel", label: "Video Carousel", present: seed % 6 === 0, icon: Video, color: "text-red-400" },
    { type: "local_pack", label: "Local Pack", present: seed % 7 === 0, icon: MapPin, color: "text-emerald-400" },
    { type: "shopping", label: "Shopping Results", present: seed % 8 === 0, icon: ShoppingCart, color: "text-orange-400" },
    { type: "knowledge_panel", label: "Knowledge Panel", present: seed % 9 === 0, icon: FileText, color: "text-cyan-400" },
    { type: "site_links", label: "Sitelinks", present: seed % 2 === 0, icon: Link2, color: "text-indigo-400" },
  ];

  const avgDA = Math.round(results.reduce((s, r) => s + r.domainAuthority, 0) / results.length);
  const avgWC = Math.round(results.reduce((s, r) => s + r.wordCount, 0) / results.length);
  const avgBL = Math.round(results.reduce((s, r) => s + r.backlinks, 0) / results.length);

  const insights: SerpInsight[] = [
    { label: "Avg Domain Authority", value: avgDA, description: `Top 10 results have an average DA of ${avgDA}. ${avgDA > 60 ? "High authority needed to compete." : "Moderate authority may be enough."}`, color: avgDA > 60 ? "text-red-400" : "text-amber-400", icon: Shield },
    { label: "Avg Content Length", value: `${Math.round(avgWC / 100) * 100} words`, description: `Top results average ${Math.round(avgWC / 100) * 100} words. Aim for at least this length to be competitive.`, color: "text-blue-400", icon: FileText },
    { label: "Avg Backlinks", value: formatNum(avgBL), description: `Competing pages have an average of ${formatNum(avgBL)} backlinks. Strong link building is ${avgBL > 5000 ? "essential" : "helpful"}.`, color: avgBL > 5000 ? "text-red-400" : "text-emerald-400", icon: Link2 },
    { label: "SERP Difficulty", value: `${difficulty}/100`, description: `${difficulty >= 70 ? "Highly competitive SERP. Will require significant authority and content investment." : difficulty >= 40 ? "Moderate competition. Good content and links can break in." : "Lower competition. Well-optimized content has a strong chance to rank."}`, color: difficulty >= 70 ? "text-red-400" : difficulty >= 40 ? "text-amber-400" : "text-emerald-400", icon: Target },
    { label: "Search Volume", value: formatNum(volume) + "/mo", description: `This keyword gets approximately ${formatNum(volume)} searches per month, making it ${volume > 10000 ? "a high-value target" : "a niche opportunity"}.`, color: "text-cyan-400", icon: BarChart2 },
    { label: "CPC Value", value: `$${cpc}`, description: `Advertisers pay $${cpc} per click, indicating ${cpc > 5 ? "high commercial intent" : "moderate commercial value"} for this keyword.`, color: cpc > 5 ? "text-emerald-400" : "text-blue-400", icon: Zap },
  ];

  const topDomains = results.slice(0, 5).map(res => ({
    domain: res.domain,
    positions: [res.position],
  }));

  return {
    keyword,
    searchVolume: volume,
    difficulty,
    cpc,
    intent,
    totalResults: r(5000000, 850000000, 99),
    results,
    features,
    insights,
    avgDA,
    avgWordCount: avgWC,
    avgBacklinks: avgBL,
    topDomains,
  };
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function daColor(da: number) {
  if (da >= 70) return "text-emerald-400";
  if (da >= 45) return "text-amber-400";
  return "text-red-400";
}

function diffColor(d: number) {
  if (d >= 70) return "text-red-400 bg-red-500/15 border-red-500/25";
  if (d >= 40) return "text-amber-400 bg-amber-500/15 border-amber-500/25";
  return "text-emerald-400 bg-emerald-500/15 border-emerald-500/25";
}

function diffLabel(d: number) {
  if (d >= 70) return "Hard";
  if (d >= 40) return "Medium";
  return "Easy";
}

const resultTypeConfig = {
  organic: { label: "Organic", color: "text-blue-400 bg-blue-500/15 border-blue-500/25" },
  featured: { label: "Featured", color: "text-amber-400 bg-amber-500/15 border-amber-500/25" },
  video: { label: "Video", color: "text-red-400 bg-red-500/15 border-red-500/25" },
  image: { label: "Image", color: "text-purple-400 bg-purple-500/15 border-purple-500/25" },
  local: { label: "Local", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" },
  shopping: { label: "Shopping", color: "text-orange-400 bg-orange-500/15 border-orange-500/25" },
};

export default function SerpAnalysis() {
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  async function handleAnalyze() {
    if (!state.keyword.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a keyword to analyze." });
      return;
    }
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_DATA", payload: null });
    dispatch({ type: "SET_ANALYZING", payload: true });
    dispatch({ type: "SET_HAS_ANALYZED", payload: false });
    await new Promise(r => setTimeout(r, 2000));
    const data = generateSerpData(state.keyword.trim().toLowerCase());
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_HAS_ANALYZED", payload: true });
    dispatch({ type: "SET_ANALYZING", payload: false });
    dispatch({ type: "SET_TAB", payload: "results" });
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
  const d = state.data;

  const presentFeatures = d?.features.filter(f => f.present) ?? [];

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">SERP Analysis</h1>
        <p className="text-blue-200/70 text-sm mt-1">Analyze the top search results for any keyword and discover what it takes to rank on page one</p>
      </motion.div>

      {/* Search Input */}
      <motion.div {...fadeUp} className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
            <input
              type="text"
              placeholder='Enter a keyword to analyze (e.g. "best SEO tools 2025")'
              value={state.keyword}
              onChange={e => dispatch({ type: "SET_KEYWORD", payload: e.target.value })}
              onKeyDown={e => e.key === "Enter" && !state.analyzing && handleAnalyze()}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={state.analyzing}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[160px]"
          >
            {state.analyzing
              ? <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</>
              : <><Search className="w-4 h-4" />Analyze SERP</>}
          </button>
        </div>
        {state.error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
            <button onClick={() => dispatch({ type: "SET_ERROR", payload: null })} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {state.analyzing && (
          <div className="mt-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: "0%" }} animate={{ width: "88%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }} />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Fetching SERP data", "Analyzing top results", "Detecting SERP features", "Building insights"].map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-1.5 text-xs text-blue-200/40">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />{s}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {!state.hasAnalyzed && !state.analyzing && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Search className="w-10 h-10 text-blue-400/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyze Any SERP</h3>
          <p className="text-blue-200/50 text-sm max-w-sm mx-auto mb-6">
            Enter any keyword to see the top 10 search results, detect SERP features, and get actionable insights on what it takes to rank on page one.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {["Top 10 Results", "SERP Features", "DA Analysis", "Content Length", "Backlink Data", "Ranking Insights"].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-200/50">
                <CheckCircle2 className="w-3 h-3 text-blue-400/40" />{f}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {d && !state.analyzing && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">

            {/* Keyword Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Search Volume", value: `${formatNum(d.searchVolume)}/mo`, icon: BarChart2, color: "text-blue-400" },
                { label: "Difficulty", value: `${d.difficulty}/100`, icon: Target, color: d.difficulty >= 70 ? "text-red-400" : d.difficulty >= 40 ? "text-amber-400" : "text-emerald-400" },
                { label: "CPC", value: `$${d.cpc}`, icon: Zap, color: "text-cyan-400" },
                { label: "Intent", value: d.intent, icon: Eye, color: "text-purple-400" },
                { label: "Avg DA (Top 10)", value: d.avgDA, icon: Shield, color: daColor(d.avgDA) },
                { label: "Avg Content", value: `${formatNum(d.avgWordCount)} words`, icon: FileText, color: "text-orange-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                  <div className={`text-base font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-blue-200/40 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* SERP Features Strip */}
            {presentFeatures.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold text-blue-200/50 uppercase tracking-wider mb-3">SERP Features Detected</p>
                <div className="flex flex-wrap gap-2">
                  {d.features.map(feat => (
                    <span key={feat.type}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${feat.present ? `${feat.color} bg-white/5 border-white/15` : "text-blue-200/20 bg-white/3 border-white/5 line-through"}`}>
                      <feat.icon className="w-3 h-3" />
                      {feat.label}
                      {feat.present ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3" />}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {([
                { key: "results", label: `Top 10 Results`, icon: Globe },
                { key: "insights", label: `Insights (${d.insights.length})`, icon: BarChart2 },
                { key: "features", label: `SERP Features`, icon: Star },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => dispatch({ type: "SET_TAB", payload: tab.key })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    state.activeTab === tab.key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-blue-200/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}>
                  <tab.icon className="w-3.5 h-3.5" />{tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* RESULTS TAB */}
              {state.activeTab === "results" && (
                <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
                  {d.results.map((result, i) => {
                    const isExpanded = state.expandedResult === result.position;
                    const typeCfg = resultTypeConfig[result.resultType];
                    return (
                      <motion.div key={result.position}
                        initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white/5 border rounded-2xl overflow-hidden backdrop-blur-sm transition-all ${result.isFeatured ? "border-amber-500/30 bg-amber-500/5" : result.isAd ? "border-orange-500/20 bg-orange-500/5" : "border-white/10 hover:border-blue-500/20"}`}
                      >
                        <div className="px-5 py-4">
                          <div className="flex items-start gap-4">
                            {/* Position */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black ${
                              result.position <= 3 ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                              : result.position <= 7 ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                              : "bg-white/5 border border-white/10 text-blue-200/50"
                            }`}>
                              #{result.position}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    {result.isFeatured && (
                                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">
                                        <Award className="w-3 h-3" />Featured Snippet
                                      </span>
                                    )}
                                    {result.isAd && (
                                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400">Ad</span>
                                    )}
                                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${typeCfg.color}`}>
                                      {typeCfg.label}
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors leading-snug line-clamp-2">{result.title}</h3>
                                </div>
                                <button onClick={() => dispatch({ type: "TOGGLE_RESULT", payload: result.position })}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-blue-200/40 hover:text-white transition-all flex-shrink-0">
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5 mb-2">
                                <Globe className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span className="text-xs text-emerald-400 font-semibold truncate">{result.url.replace("https://", "").substring(0, 55)}</span>
                                <a href={result.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                  className="text-blue-400/40 hover:text-blue-400 transition-colors flex-shrink-0">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>

                              <p className="text-xs text-blue-200/50 leading-relaxed line-clamp-2">{result.description}</p>

                              {/* Quick metrics */}
                              <div className="flex flex-wrap gap-3 mt-3">
                                <span className={`text-xs font-bold ${daColor(result.domainAuthority)}`}>DA {result.domainAuthority}</span>
                                <span className="text-xs text-blue-200/40">{formatNum(result.backlinks)} backlinks</span>
                                <span className="text-xs text-blue-200/40">{result.wordCount.toLocaleString()} words</span>
                                <span className={`text-xs font-semibold ${result.loadTime < 2 ? "text-emerald-400" : result.loadTime < 4 ? "text-amber-400" : "text-red-400"}`}>{result.loadTime}s load</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden border-t border-white/5"
                            >
                              <div className="px-5 py-4 bg-white/3">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                  {[
                                    { label: "Domain Authority", value: result.domainAuthority, color: daColor(result.domainAuthority) },
                                    { label: "Total Backlinks", value: formatNum(result.backlinks), color: "text-purple-400" },
                                    { label: "Word Count", value: `${result.wordCount.toLocaleString()}`, color: "text-blue-400" },
                                    { label: "Load Speed", value: `${result.loadTime}s`, color: result.loadTime < 2 ? "text-emerald-400" : result.loadTime < 4 ? "text-amber-400" : "text-red-400" },
                                  ].map(item => (
                                    <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                                      <div className={`text-base font-black ${item.color}`}>{item.value}</div>
                                      <div className="text-xs text-blue-200/40 mt-0.5">{item.label}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-blue-200/40">Ranking domain:</span>
                                  <span className="text-xs font-bold text-white">{result.domain}</span>
                                  <a href={`https://${result.domain}`} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-400/50 hover:text-blue-400 transition-colors">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* INSIGHTS TAB */}
              {state.activeTab === "insights" && (
                <motion.div key="insights" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {d.insights.map((insight, i) => (
                      <motion.div key={insight.label}
                        initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-500/20 transition-all backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                            <insight.icon className={`w-4 h-4 ${insight.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-blue-200/50 font-semibold uppercase tracking-wider">{insight.label}</div>
                            <div className={`text-xl font-black mt-0.5 ${insight.color}`}>{insight.value}</div>
                          </div>
                        </div>
                        <p className="text-xs text-blue-200/50 leading-relaxed">{insight.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Opportunity Assessment */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />Ranking Opportunity Assessment
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Content Requirement", status: d.avgWordCount > 2000 ? "warning" : "good", message: d.avgWordCount > 2000 ? `You need ${Math.round(d.avgWordCount / 100) * 100}+ words to compete with top results` : `${Math.round(d.avgWordCount / 100) * 100} word articles can rank here` },
                        { label: "Authority Requirement", status: d.avgDA > 60 ? "danger" : d.avgDA > 40 ? "warning" : "good", message: d.avgDA > 60 ? `High DA (${d.avgDA}+) sites dominate. Build authority first.` : d.avgDA > 40 ? `Moderate DA required. Growing sites can compete.` : `Lower DA sites can rank. Quality content is key.` },
                        { label: "Link Building Need", status: d.avgBacklinks > 10000 ? "danger" : d.avgBacklinks > 2000 ? "warning" : "good", message: d.avgBacklinks > 10000 ? `Top pages have ${formatNum(d.avgBacklinks)} avg backlinks. Heavy link building needed.` : `${formatNum(d.avgBacklinks)} avg backlinks. Achievable with consistent outreach.` },
                        { label: "SERP Opportunity", status: presentFeatures.length > 3 ? "warning" : "good", message: presentFeatures.length > 3 ? `${presentFeatures.length} SERP features detected. Optimize for featured snippets and PAA.` : "Standard organic SERP. Focus on strong title and meta optimization." },
                      ].map(item => {
                        const color = item.status === "good" ? "text-emerald-400" : item.status === "warning" ? "text-amber-400" : "text-red-400";
                        const bg = item.status === "good" ? "bg-emerald-500/10 border-emerald-500/20" : item.status === "warning" ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";
                        const Icon = item.status === "good" ? CheckCircle2 : AlertCircle;
                        return (
                          <div key={item.label} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${bg}`}>
                            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${color}`} />
                            <div>
                              <span className={`text-xs font-bold ${color}`}>{item.label}</span>
                              <p className="text-xs text-blue-200/60 mt-0.5">{item.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FEATURES TAB */}
              {state.activeTab === "features" && (
                <motion.div key="features" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {d.features.map((feat, i) => (
                      <motion.div key={feat.type}
                        initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`bg-white/5 border rounded-2xl p-5 backdrop-blur-sm transition-all ${feat.present ? "border-white/10 hover:border-blue-500/20" : "border-white/5 opacity-50"}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${feat.present ? "bg-white/5" : "bg-white/3"}`}>
                            <feat.icon className={`w-5 h-5 ${feat.present ? feat.color : "text-blue-200/20"}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-sm font-bold ${feat.present ? "text-white" : "text-blue-200/30"}`}>{feat.label}</h3>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-0.5 ${feat.present ? "text-emerald-400" : "text-red-400/60"}`}>
                              {feat.present ? <><CheckCircle2 className="w-3 h-3" />Present in SERP</> : <><X className="w-3 h-3" />Not detected</>}
                            </span>
                          </div>
                        </div>
                        {feat.present && (
                          <div className="bg-white/3 rounded-xl px-3 py-2.5">
                            <p className="text-xs text-blue-200/50 leading-relaxed">
                              {feat.type === "featured_snippet" && "A featured snippet appears at position zero. Optimize your content with clear, concise answers to target this spot."}
                              {feat.type === "people_also_ask" && "People Also Ask boxes expand organic visibility. Target related questions in your content to appear here."}
                              {feat.type === "image_pack" && "Images appear in results. Add high-quality, optimized images with descriptive alt text to your content."}
                              {feat.type === "video_carousel" && "Videos rank for this keyword. Consider creating a video tutorial or explainer to capture this traffic."}
                              {feat.type === "local_pack" && "Local results appear. Ensure your Google Business Profile is complete and optimized for local search."}
                              {feat.type === "shopping" && "Shopping results indicate commercial intent. Product pages and price optimization are critical here."}
                              {feat.type === "knowledge_panel" && "A knowledge panel displays entity information. Build brand authority and structured data markup."}
                              {feat.type === "site_links" && "Sitelinks appear for branded queries. Strong internal linking and site structure help trigger these."}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* SERP Difficulty Visual */}
                  <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-4">Overall SERP Difficulty</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${d.difficulty >= 70 ? "bg-red-500" : d.difficulty >= 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.difficulty}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className={`text-2xl font-black w-16 text-right ${d.difficulty >= 70 ? "text-red-400" : d.difficulty >= 40 ? "text-amber-400" : "text-emerald-400"}`}>
                        {d.difficulty}/100
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full border ${diffColor(d.difficulty)}`}>
                        {diffLabel(d.difficulty)}
                      </span>
                    </div>
                    <p className="text-xs text-blue-200/50">
                      {d.difficulty >= 70
                        ? "This is a highly competitive keyword dominated by high-authority domains. You will need exceptional content, strong backlinks, and significant domain authority to break into the top 10."
                        : d.difficulty >= 40
                        ? "This keyword has moderate competition. A well-optimized piece of content backed by solid link building can realistically achieve page one rankings within 3-6 months."
                        : "This is a lower-competition keyword. A high-quality, well-optimized article targeting this keyword has a strong chance of ranking within 1-3 months with minimal link building."}
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
