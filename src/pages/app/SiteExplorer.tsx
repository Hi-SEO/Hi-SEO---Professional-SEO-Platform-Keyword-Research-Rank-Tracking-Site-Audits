import { useState, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search, Globe, TrendingUp, TrendingDown, BarChart2,
  FileText, Key, Link2, RefreshCw, AlertCircle, ExternalLink,
  ArrowUp, ArrowDown, Minus, Eye, Users, Zap, Shield,
  CheckCircle2, X, Star, Award, Clock, Filter
} from "lucide-react";

interface TopPage {
  url: string;
  title: string;
  traffic: number;
  keywords: number;
  position: number;
  change: number;
}

interface TopKeyword {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  difficulty: number;
  url: string;
}

interface Competitor {
  domain: string;
  authority: number;
  traffic: number;
  keywords: number;
}

interface DomainData {
  domain: string;
  domainAuthority: number;
  organicTraffic: number;
  totalKeywords: number;
  backlinks: number;
  referringDomains: number;
  trafficValue: number;
  trafficTrend: number;
  topCountry: string;
  founded: string;
  topPages: TopPage[];
  topKeywords: TopKeyword[];
  competitors: Competitor[];
  trafficByMonth: { month: string; traffic: number }[];
}

interface State {
  domain: string;
  exploring: boolean;
  data: DomainData | null;
  error: string | null;
  hasExplored: boolean;
  activeTab: "overview" | "pages" | "keywords" | "competitors";
}

type Action =
  | { type: "SET_DOMAIN"; payload: string }
  | { type: "SET_EXPLORING"; payload: boolean }
  | { type: "SET_DATA"; payload: DomainData | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_HAS_EXPLORED"; payload: boolean }
  | { type: "SET_TAB"; payload: State["activeTab"] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DOMAIN": return { ...state, domain: action.payload };
    case "SET_EXPLORING": return { ...state, exploring: action.payload };
    case "SET_DATA": return { ...state, data: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_HAS_EXPLORED": return { ...state, hasExplored: action.payload };
    case "SET_TAB": return { ...state, activeTab: action.payload };
    default: return state;
  }
}

const initialState: State = {
  domain: "",
  exploring: false,
  data: null,
  error: null,
  hasExplored: false,
  activeTab: "overview",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "Nigeria", "India", "Brazil"];
const PAGE_TITLES = [
  "Home Page", "Ultimate SEO Guide", "Keyword Research Tutorial",
  "Best SEO Tools Review", "On-Page SEO Checklist", "Link Building Strategies",
  "Technical SEO Guide", "Content Marketing Tips", "Local SEO Guide",
  "SEO Case Studies",
];
const KW_EXAMPLES = [
  "seo tools", "keyword research", "backlink checker", "site audit tool",
  "rank tracker", "seo software", "organic traffic", "domain authority",
  "link building", "content strategy",
];
const COMPETITOR_DOMAINS = [
  "ahrefs.com", "semrush.com", "moz.com", "ubersuggest.com",
  "serpstat.com", "majestic.com",
];

function generateDomainData(domain: string): DomainData {
  const seed = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number, offset = 0) =>
    Math.floor(((seed * (offset + 1) * 137) % (max - min + 1)) + min);

  const da = r(25, 85, 1);
  const traffic = r(8000, 450000, 2);
  const keywords = r(500, 35000, 3);
  const backlinks = r(1200, 95000, 4);
  const refDomains = Math.floor(backlinks * 0.35);
  const trafficValue = r(2000, 85000, 5);
  const trafficTrend = r(-15, 35, 6);

  const topPages: TopPage[] = PAGE_TITLES.map((title, i) => ({
    url: `https://${domain}/${title.toLowerCase().replace(/\s+/g, "-")}`,
    title,
    traffic: r(500, Math.floor(traffic * 0.25), i + 10),
    keywords: r(20, 800, i + 20),
    position: r(1, 15, i + 30),
    change: r(-5, 8, i + 40) - 3,
  })).sort((a, b) => b.traffic - a.traffic);

  const topKeywords: TopKeyword[] = KW_EXAMPLES.map((kw, i) => ({
    keyword: `${kw} ${domain.split(".")[0]}`,
    position: r(1, 20, i + 50),
    volume: r(500, 45000, i + 60),
    traffic: r(100, 8000, i + 70),
    difficulty: r(15, 85, i + 80),
    url: `https://${domain}`,
  })).sort((a, b) => a.position - b.position);

  const competitors: Competitor[] = COMPETITOR_DOMAINS.slice(0, 5).map((d, i) => ({
    domain: d,
    authority: Math.max(10, da + r(-25, 30, i + 90)),
    traffic: r(5000, 600000, i + 100),
    keywords: r(300, 50000, i + 110),
  }));

  const now = new Date();
  const trafficByMonth = MONTHS.map((month, i) => {
    const base = traffic * (0.6 + i * 0.04);
    const noise = r(-15, 15, i + 120);
    return { month, traffic: Math.max(1000, Math.floor(base * (1 + noise / 100))) };
  });

  return {
    domain,
    domainAuthority: da,
    organicTraffic: traffic,
    totalKeywords: keywords,
    backlinks,
    referringDomains: refDomains,
    trafficValue,
    trafficTrend,
    topCountry: COUNTRIES[seed % COUNTRIES.length],
    founded: `${2010 + (seed % 13)}`,
    topPages,
    topKeywords,
    competitors,
    trafficByMonth,
  };
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function daColor(da: number) {
  if (da >= 60) return "text-emerald-400";
  if (da >= 40) return "text-amber-400";
  return "text-red-400";
}

function diffBar(d: number) {
  if (d < 30) return "bg-emerald-500";
  if (d < 60) return "bg-amber-500";
  return "bg-red-500";
}

function AuthorityRing({ score, size = 100 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 60 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size * 0.08} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={size * 0.08} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={size * 0.26} fontWeight="900" fill={color}>{score}</text>
      <text x={size / 2} y={size / 2 + size * 0.2} textAnchor="middle" fontSize={size * 0.1} fill="rgba(255,255,255,0.35)">DA</text>
    </svg>
  );
}

function MiniTrafficChart({ data }: { data: { month: string; traffic: number }[] }) {
  const max = Math.max(...data.map(d => d.traffic));
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => {
        const h = Math.max(4, (d.traffic / max) * 64);
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group cursor-default" title={`${d.month}: ${formatNum(d.traffic)}`}>
            <motion.div
              className="w-full bg-blue-500/60 group-hover:bg-blue-400 rounded-sm transition-colors"
              style={{ height: h }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function SiteExplorer() {
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  function validateDomain(raw: string): string {
    if (!raw.trim()) throw new Error("Please enter a domain to explore.");
    let d = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (!d.includes(".")) throw new Error("Please enter a valid domain (e.g. example.com).");
    return d;
  }

  async function handleExplore() {
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_DATA", payload: null });
    let cleanDomain: string;
    try {
      cleanDomain = validateDomain(state.domain);
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
      return;
    }
    dispatch({ type: "SET_EXPLORING", payload: true });
    dispatch({ type: "SET_HAS_EXPLORED", payload: false });
    await new Promise(r => setTimeout(r, 2000));
    const data = generateDomainData(cleanDomain);
    dispatch({ type: "SET_DATA", payload: data });
    dispatch({ type: "SET_HAS_EXPLORED", payload: true });
    dispatch({ type: "SET_EXPLORING", payload: false });
    dispatch({ type: "SET_TAB", payload: "overview" });
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
  const d = state.data;

  const tabs: { key: State["activeTab"]; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "pages", label: `Top Pages (${d?.topPages.length ?? 0})`, icon: FileText },
    { key: "keywords", label: `Keywords (${d?.topKeywords.length ?? 0})`, icon: Key },
    { key: "competitors", label: `Competitors (${d?.competitors.length ?? 0})`, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Site Explorer</h1>
        <p className="text-blue-200/70 text-sm mt-1">Deep-dive into any domain to uncover traffic, keywords, backlinks, and competitors</p>
      </motion.div>

      {/* Search */}
      <motion.div {...fadeUp} className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
            <input
              type="text"
              placeholder="Enter any domain (e.g. competitor.com)"
              value={state.domain}
              onChange={e => dispatch({ type: "SET_DOMAIN", payload: e.target.value })}
              onKeyDown={e => e.key === "Enter" && !state.exploring && handleExplore()}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleExplore}
            disabled={state.exploring}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[160px]"
          >
            {state.exploring
              ? <><RefreshCw className="w-4 h-4 animate-spin" />Exploring...</>
              : <><Search className="w-4 h-4" />Explore Domain</>}
          </button>
        </div>
        {state.error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
            <button onClick={() => dispatch({ type: "SET_ERROR", payload: null })} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {state.exploring && (
          <div className="mt-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "88%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Fetching domain data", "Analyzing traffic", "Scanning keywords", "Building overview"].map((s, i) => (
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
      {!state.hasAnalyzed && !state.exploring && !state.data && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Globe className="w-10 h-10 text-blue-400/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Explore Any Domain</h3>
          <p className="text-blue-200/50 text-sm max-w-sm mx-auto mb-6">
            Enter a competitor or any domain to reveal its organic traffic, top-ranking keywords, best pages, and backlink profile in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {["Organic Traffic", "Top Pages", "Keyword Rankings", "Competitor Analysis", "Domain Authority", "Traffic Trends"].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-200/50">
                <CheckCircle2 className="w-3 h-3 text-blue-400/50" />{f}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state.data && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

            {/* Domain Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{state.data.domain}</h2>
                <p className="text-xs text-blue-200/40">Full domain analysis report</p>
              </div>
              <a href={`https://${state.data.domain}`} target="_blank" rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 text-xs text-blue-400/70 hover:text-blue-400 transition-colors border border-blue-500/20 hover:border-blue-500/40 px-3 py-1.5 rounded-lg">
                <ExternalLink className="w-3.5 h-3.5" />Visit Site
              </a>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map(tab => (
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

              {/* OVERVIEW TAB */}
              {state.activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* DA Ring */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                      <AuthorityRing score={state.data.domainAuthority} size={110} />
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">Domain Authority</p>
                        <p className="text-xs text-blue-200/40 mt-0.5">Moz DA Score</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Organic Traffic", value: formatNum(state.data.organicTraffic), sub: "/month", icon: Users, color: "text-blue-400", trend: state.data.trafficTrend },
                        { label: "Total Keywords", value: formatNum(state.data.totalKeywords), sub: "ranking", icon: Key, color: "text-cyan-400", trend: null },
                        { label: "Backlinks", value: formatNum(state.data.backlinks), sub: "total links", icon: Link2, color: "text-purple-400", trend: null },
                        { label: "Referring Domains", value: formatNum(state.data.referringDomains), sub: "unique domains", icon: Globe, color: "text-emerald-400", trend: null },
                        { label: "Traffic Value", value: `$${formatNum(state.data.trafficValue)}`, sub: "/month equiv.", icon: Zap, color: "text-amber-400", trend: null },
                        { label: "Top Country", value: state.data.topCountry, sub: "primary market", icon: Award, color: "text-rose-400", trend: null },
                      ].map(stat => (
                        <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-xs text-blue-200/50 font-semibold">{stat.label}</span>
                          </div>
                          <div className="text-xl font-black text-white leading-none">{stat.value}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-blue-200/30">{stat.sub}</span>
                            {stat.trend !== null && (
                              <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.trend > 0 ? "text-emerald-400" : stat.trend < 0 ? "text-red-400" : "text-blue-200/40"}`}>
                                {stat.trend > 0 ? <ArrowUp className="w-3 h-3" /> : stat.trend < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                {Math.abs(stat.trend)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic Chart */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">Traffic Trend (12 Months)</h3>
                        <p className="text-xs text-blue-200/40 mt-0.5">Estimated organic traffic per month</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-bold ${state.data.trafficTrend > 0 ? "text-emerald-400" : state.data.trafficTrend < 0 ? "text-red-400" : "text-blue-200/40"}`}>
                        {state.data.trafficTrend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {state.data.trafficTrend > 0 ? "+" : ""}{state.data.trafficTrend}% YoY
                      </div>
                    </div>
                    <MiniTrafficChart data={state.data.trafficByMonth} />
                    <div className="flex justify-between mt-2">
                      {state.data.trafficByMonth.filter((_, i) => i % 3 === 0).map(d => (
                        <span key={d.month} className="text-xs text-blue-200/30">{d.month}</span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Insights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Strong Authority", desc: `DA of ${state.data.domainAuthority} puts this domain in the ${state.data.domainAuthority >= 60 ? "top tier" : state.data.domainAuthority >= 40 ? "mid range" : "lower range"} for link equity.` },
                      { icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Keyword Coverage", desc: `Ranking for ${formatNum(state.data.totalKeywords)} keywords with ${formatNum(state.data.topKeywords.filter(k => k.position <= 10).length)} in top 10.` },
                      { icon: Link2, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", title: "Link Profile", desc: `${formatNum(state.data.backlinks)} total backlinks from ${formatNum(state.data.referringDomains)} unique referring domains.` },
                    ].map(insight => (
                      <div key={insight.title} className={`rounded-2xl p-5 border ${insight.bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <insight.icon className={`w-4 h-4 ${insight.color}`} />
                          <span className="text-sm font-bold text-white">{insight.title}</span>
                        </div>
                        <p className="text-xs text-blue-200/50 leading-relaxed">{insight.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PAGES TAB */}
              {state.activeTab === "pages" && (
                <motion.div key="pages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/5 bg-white/3 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
                      <span>Page</span><span>Traffic</span><span>Keywords</span><span>Position</span><span>Change</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {(state.data?.topPages ?? []).map((page, i) => (
                        <motion.div key={page.url} initial={shouldReduce ? {} : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="group px-6 py-4 hover:bg-white/5 transition-colors">
                          <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{page.title}</p>
                              <a href={page.url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-blue-400/50 hover:text-blue-400 truncate flex items-center gap-1 mt-0.5 transition-colors">
                                {page.url.replace("https://", "").substring(0, 45)}...
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            </div>
                            <span className="text-sm font-bold text-white">{formatNum(page.traffic)}</span>
                            <span className="text-sm font-semibold text-blue-200/70">{page.keywords}</span>
                            <span className="text-sm font-bold text-white">#{page.position}</span>
                            <span className={`text-sm font-bold flex items-center gap-1 ${page.change > 0 ? "text-emerald-400" : page.change < 0 ? "text-red-400" : "text-blue-200/40"}`}>
                              {page.change > 0 ? <ArrowUp className="w-3 h-3" /> : page.change < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                              {page.change > 0 ? `+${page.change}` : page.change}
                            </span>
                          </div>
                          <div className="md:hidden">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="text-sm font-bold text-white">{page.title}</p>
                              <span className={`text-xs font-bold flex items-center gap-0.5 flex-shrink-0 ${page.change > 0 ? "text-emerald-400" : page.change < 0 ? "text-red-400" : "text-blue-200/40"}`}>
                                {page.change > 0 ? "+" : ""}{page.change}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="font-black text-white">{formatNum(page.traffic)}</div>
                                <div className="text-blue-200/40">Traffic</div>
                              </div>
                              <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="font-black text-white">{page.keywords}</div>
                                <div className="text-blue-200/40">Keywords</div>
                              </div>
                              <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="font-black text-white">#{page.position}</div>
                                <div className="text-blue-200/40">Position</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* KEYWORDS TAB */}
              {state.activeTab === "keywords" && (
                <motion.div key="keywords" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1.5fr] gap-4 px-6 py-3 border-b border-white/5 bg-white/3 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
                      <span>Keyword</span><span>Position</span><span>Volume</span><span>Traffic</span><span>Difficulty</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {(state.data?.topKeywords ?? []).map((kw, i) => (
                        <motion.div key={kw.keyword} initial={shouldReduce ? {} : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="px-6 py-4 hover:bg-white/5 transition-colors">
                          <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1.5fr] gap-4 items-center">
                            <span className="text-sm font-semibold text-white">{kw.keyword}</span>
                            <span className={`text-sm font-black ${kw.position <= 3 ? "text-amber-400" : kw.position <= 10 ? "text-emerald-400" : "text-blue-200/70"}`}>#{kw.position}</span>
                            <span className="text-sm font-semibold text-white">{formatNum(kw.volume)}</span>
                            <span className="text-sm font-semibold text-blue-200/70">{formatNum(kw.traffic)}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${diffBar(kw.difficulty)}`} style={{ width: `${kw.difficulty}%` }} />
                              </div>
                              <span className={`text-xs font-bold w-7 text-right ${kw.difficulty < 30 ? "text-emerald-400" : kw.difficulty < 60 ? "text-amber-400" : "text-red-400"}`}>{kw.difficulty}</span>
                            </div>
                          </div>
                          <div className="md:hidden">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="text-sm font-bold text-white">{kw.keyword}</p>
                              <span className={`text-sm font-black ${kw.position <= 3 ? "text-amber-400" : kw.position <= 10 ? "text-emerald-400" : "text-blue-200/60"}`}>#{kw.position}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="font-black text-white">{formatNum(kw.volume)}</div>
                                <div className="text-blue-200/40">Volume</div>
                              </div>
                              <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className="font-black text-white">{formatNum(kw.traffic)}</div>
                                <div className="text-blue-200/40">Traffic</div>
                              </div>
                              <div className="bg-white/5 rounded-lg p-2 text-center">
                                <div className={`font-black ${kw.difficulty < 30 ? "text-emerald-400" : kw.difficulty < 60 ? "text-amber-400" : "text-red-400"}`}>{kw.difficulty}</div>
                                <div className="text-blue-200/40">KD</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* COMPETITORS TAB */}
              {state.activeTab === "competitors" && (
                <motion.div key="competitors" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="space-y-4">
                    {(state.data?.competitors ?? []).map((comp, i) => (
                      <motion.div key={comp.domain} initial={shouldReduce ? {} : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:-translate-y-0.5 hover:border-blue-500/20 transition-all backdrop-blur-sm group">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Globe className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-base font-bold text-white truncate">{comp.domain}</p>
                              <a href={`https://${comp.domain}`} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-blue-400/50 hover:text-blue-400 transition-colors flex items-center gap-1">
                                Visit site <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 sm:gap-8">
                            <div className="text-center">
                              <div className={`text-xl font-black ${daColor(comp.authority)}`}>{comp.authority}</div>
                              <div className="text-xs text-blue-200/40">DA</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-black text-white">{formatNum(comp.traffic)}</div>
                              <div className="text-xs text-blue-200/40">Traffic/mo</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-black text-white">{formatNum(comp.keywords)}</div>
                              <div className="text-xs text-blue-200/40">Keywords</div>
                            </div>
                          </div>
                          <button
                            onClick={() => dispatch({ type: "SET_DOMAIN", payload: comp.domain })}
                            className="sm:w-auto w-full px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 text-xs font-bold border border-blue-500/20 transition-all whitespace-nowrap"
                          >
                            Explore This Domain
                          </button>
                        </div>
                        {/* DA comparison bar */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between text-xs text-blue-200/40 mb-1.5">
                            <span>Authority vs {state.data?.domain}</span>
                            <span>{comp.authority} vs {state.data?.domainAuthority}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${comp.authority >= (state.data?.domainAuthority ?? 0) ? "bg-emerald-500" : "bg-amber-500"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, comp.authority)}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
