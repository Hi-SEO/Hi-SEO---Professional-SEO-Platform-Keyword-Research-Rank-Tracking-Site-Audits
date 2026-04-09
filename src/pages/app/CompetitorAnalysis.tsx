import { useState, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search, Globe, TrendingUp, TrendingDown, BarChart2,
  RefreshCw, AlertCircle, ExternalLink, Plus, X,
  Shield, Zap, Link2, Key, Users, Award, Target,
  CheckCircle2, XCircle, Minus, ArrowUp, ArrowDown,
  ChevronRight, Star
} from "lucide-react";

interface DomainMetrics {
  domain: string;
  domainAuthority: number;
  organicTraffic: number;
  totalKeywords: number;
  backlinks: number;
  referringDomains: number;
  topKeywords: string[];
  commonKeywords: number;
  uniqueKeywords: number;
  trafficTrend: number;
  avgPosition: number;
  top10Keywords: number;
  contentPages: number;
  socialSignals: number;
  loadSpeed: number;
  mobileScore: number;
}

interface State {
  yourDomain: string;
  competitorDomains: string[];
  newCompetitor: string;
  comparing: boolean;
  yourMetrics: DomainMetrics | null;
  competitorMetrics: DomainMetrics[];
  error: string | null;
  hasCompared: boolean;
  activeView: "overview" | "keywords" | "technical";
}

type Action =
  | { type: "SET_YOUR_DOMAIN"; payload: string }
  | { type: "SET_NEW_COMPETITOR"; payload: string }
  | { type: "ADD_COMPETITOR"; payload: string }
  | { type: "REMOVE_COMPETITOR"; payload: string }
  | { type: "SET_COMPARING"; payload: boolean }
  | { type: "SET_YOUR_METRICS"; payload: DomainMetrics | null }
  | { type: "SET_COMPETITOR_METRICS"; payload: DomainMetrics[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_HAS_COMPARED"; payload: boolean }
  | { type: "SET_VIEW"; payload: State["activeView"] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_YOUR_DOMAIN": return { ...state, yourDomain: action.payload };
    case "SET_NEW_COMPETITOR": return { ...state, newCompetitor: action.payload };
    case "ADD_COMPETITOR":
      if (state.competitorDomains.includes(action.payload) || state.competitorDomains.length >= 3) return state;
      return { ...state, competitorDomains: [...state.competitorDomains, action.payload], newCompetitor: "" };
    case "REMOVE_COMPETITOR":
      return { ...state, competitorDomains: state.competitorDomains.filter(d => d !== action.payload) };
    case "SET_COMPARING": return { ...state, comparing: action.payload };
    case "SET_YOUR_METRICS": return { ...state, yourMetrics: action.payload };
    case "SET_COMPETITOR_METRICS": return { ...state, competitorMetrics: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_HAS_COMPARED": return { ...state, hasCompared: action.payload };
    case "SET_VIEW": return { ...state, activeView: action.payload };
    default: return state;
  }
}

const initialState: State = {
  yourDomain: "",
  competitorDomains: [],
  newCompetitor: "",
  comparing: false,
  yourMetrics: null,
  competitorMetrics: [],
  error: null,
  hasCompared: false,
  activeView: "overview",
};

const SAMPLE_KEYWORDS = [
  "seo tools", "keyword research", "rank tracker", "site audit",
  "backlink checker", "content strategy", "domain authority",
  "organic traffic", "link building", "serp analysis",
  "on-page seo", "technical seo", "local seo", "seo software",
];

function generateMetrics(domain: string, index: number): DomainMetrics {
  const seed = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * (index + 1);
  const r = (min: number, max: number, off = 0) =>
    Math.floor(((seed * (off + 1) * 137 + off * 53) % (max - min + 1)) + min);

  const da = r(25, 88, 1);
  const traffic = r(8000, 480000, 2);
  const keywords = r(500, 40000, 3);
  const backlinks = r(1200, 110000, 4);
  const topKwCount = Math.min(8, SAMPLE_KEYWORDS.length);
  const topKeywords = SAMPLE_KEYWORDS.slice(0, topKwCount).map(kw => `${kw} ${domain.split(".")[0]}`);

  return {
    domain,
    domainAuthority: da,
    organicTraffic: traffic,
    totalKeywords: keywords,
    backlinks,
    referringDomains: Math.floor(backlinks * 0.3 + r(100, 500, 5)),
    topKeywords,
    commonKeywords: r(50, 800, 6),
    uniqueKeywords: r(200, 5000, 7),
    trafficTrend: r(-20, 40, 8) - 10,
    avgPosition: parseFloat((r(50, 350, 9) / 10).toFixed(1)),
    top10Keywords: r(20, Math.floor(keywords * 0.15), 10),
    contentPages: r(80, 2500, 11),
    socialSignals: r(500, 50000, 12),
    loadSpeed: parseFloat((r(10, 48, 13) / 10).toFixed(1)),
    mobileScore: r(55, 99, 14),
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

function WinnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">
      <Star className="w-3 h-3" />Best
    </span>
  );
}

function MetricRow({
  label, yourVal, compVals, format, higherBetter = true, icon: Icon,
}: {
  label: string;
  yourVal: number;
  compVals: number[];
  format: (n: number) => string;
  higherBetter?: boolean;
  icon: any;
}) {
  const allVals = [yourVal, ...compVals];
  const best = higherBetter ? Math.max(...allVals) : Math.min(...allVals);
  const worst = higherBetter ? Math.min(...allVals) : Math.max(...allVals);

  function barWidth(val: number) {
    const max = Math.max(...allVals);
    const min = Math.min(...allVals);
    if (max === min) return 60;
    return Math.max(8, Math.round(((val - min) / (max - min)) * 85) + 15);
  }

  const COLORS = ["#3b82f6", "#f97316", "#06b6d4", "#8b5cf6"];

  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-blue-400/60" />
        <span className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider">{label}</span>
      </div>
      <div className="space-y-2">
        {[yourVal, ...compVals].map((val, i) => {
          const isYou = i === 0;
          const isBest = val === best;
          const isWorst = val === worst && allVals.length > 1;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-blue-200/40 w-24 truncate flex-shrink-0">
                {isYou ? "Your site" : `Competitor ${i}`}
              </span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth(val)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
              <span className={`text-sm font-black w-20 text-right flex-shrink-0 ${isBest ? "text-emerald-400" : isWorst ? "text-red-400" : "text-white"}`}>
                {format(val)}
              </span>
              {isBest && <WinnerBadge />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreCard({ metrics, isYou, color }: { metrics: DomainMetrics; isYou: boolean; color: string }) {
  const score = Math.round(
    (metrics.domainAuthority * 0.3) +
    (Math.min(100, metrics.organicTraffic / 5000) * 0.3) +
    (Math.min(100, metrics.backlinks / 1000) * 0.2) +
    (Math.min(100, metrics.totalKeywords / 400) * 0.2)
  );

  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, score) / 100) * circ;

  return (
    <div className={`relative bg-white/5 border rounded-2xl p-5 backdrop-blur-sm transition-all ${isYou ? "border-blue-500/40 bg-blue-500/5" : "border-white/10"}`}>
      {isYou && (
        <div className="absolute top-3 right-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400">Your Site</span>
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <svg width="72" height="72" viewBox="0 0 72 72" className="flex-shrink-0">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <motion.circle
            cx="36" cy="36" r={r} fill="none" stroke={color}
            strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${circ}` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <text x="36" y="40" textAnchor="middle" fontSize="15" fontWeight="900" fill={color}>{Math.min(100, score)}</text>
        </svg>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-white truncate">{metrics.domain}</h3>
          <div className="flex items-center gap-1 mt-1">
            {metrics.trafficTrend > 0
              ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            <span className={`text-xs font-bold ${metrics.trafficTrend > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {metrics.trafficTrend > 0 ? "+" : ""}{metrics.trafficTrend}% traffic
            </span>
          </div>
          <p className="text-xs text-blue-200/30 mt-1">Competitive Score</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "DA", value: metrics.domainAuthority, color: daColor(metrics.domainAuthority) },
          { label: "Traffic", value: formatNum(metrics.organicTraffic), color: "text-blue-400" },
          { label: "Keywords", value: formatNum(metrics.totalKeywords), color: "text-cyan-400" },
          { label: "Backlinks", value: formatNum(metrics.backlinks), color: "text-purple-400" },
        ].map(item => (
          <div key={item.label} className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className={`text-base font-black ${item.color}`}>{item.value}</div>
            <div className="text-xs text-blue-200/40">{item.label}</div>
          </div>
        ))}
      </div>
      <a href={`https://${metrics.domain}`} target="_blank" rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-1.5 text-xs text-blue-400/60 hover:text-blue-400 transition-colors">
        <ExternalLink className="w-3 h-3" />Visit site
      </a>
    </div>
  );
}

const CARD_COLORS = ["#3b82f6", "#f97316", "#06b6d4", "#8b5cf6"];

export default function CompetitorAnalysis() {
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  function validateDomain(raw: string): string {
    if (!raw.trim()) throw new Error("Please enter a domain.");
    let d = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (!d.includes(".")) throw new Error(`Invalid domain: ${raw}`);
    return d;
  }

  function handleAddCompetitor() {
    if (!state.newCompetitor.trim()) return;
    if (state.competitorDomains.length >= 3) {
      dispatch({ type: "SET_ERROR", payload: "You can compare up to 3 competitors at once." });
      return;
    }
    try {
      const d = validateDomain(state.newCompetitor);
      dispatch({ type: "ADD_COMPETITOR", payload: d });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  }

  async function handleCompare() {
    if (!state.yourDomain.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter your domain first." });
      return;
    }
    if (state.competitorDomains.length === 0) {
      dispatch({ type: "SET_ERROR", payload: "Please add at least one competitor domain." });
      return;
    }
    let yourClean: string;
    try {
      yourClean = validateDomain(state.yourDomain);
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message });
      return;
    }
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_COMPARING", payload: true });
    dispatch({ type: "SET_HAS_COMPARED", payload: false });
    await new Promise(r => setTimeout(r, 2200));
    const yourMetrics = generateMetrics(yourClean, 0);
    const competitorMetrics = state.competitorDomains.map((d, i) => generateMetrics(d, i + 1));
    dispatch({ type: "SET_YOUR_METRICS", payload: yourMetrics });
    dispatch({ type: "SET_COMPETITOR_METRICS", payload: competitorMetrics });
    dispatch({ type: "SET_HAS_COMPARED", payload: true });
    dispatch({ type: "SET_COMPARING", payload: false });
    dispatch({ type: "SET_VIEW", payload: "overview" });
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const allMetrics = state.yourMetrics ? [state.yourMetrics, ...state.competitorMetrics] : [];

  const views: { key: State["activeView"]; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "keywords", label: "Keyword Gap", icon: Key },
    { key: "technical", label: "Technical", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Competitor Analysis</h1>
        <p className="text-blue-200/70 text-sm mt-1">Compare your domain against up to 3 competitors across authority, traffic, and keywords</p>
      </motion.div>

      {/* Input Panel */}
      <motion.div {...fadeUp} className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          {/* Your Domain */}
          <div>
            <label className="block text-xs font-semibold text-blue-200/70 mb-2 uppercase tracking-wider">Your Domain</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
              <input
                type="text"
                placeholder="yourdomain.com"
                value={state.yourDomain}
                onChange={e => dispatch({ type: "SET_YOUR_DOMAIN", payload: e.target.value })}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-blue-500/30 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <p className="text-xs text-blue-200/30 mt-1.5">This is your baseline for comparison</p>
          </div>

          {/* Competitors */}
          <div>
            <label className="block text-xs font-semibold text-blue-200/70 mb-2 uppercase tracking-wider">
              Competitor Domains <span className="text-blue-200/30 normal-case font-normal">(max 3)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                <input
                  type="text"
                  placeholder="competitor.com"
                  value={state.newCompetitor}
                  onChange={e => dispatch({ type: "SET_NEW_COMPETITOR", payload: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleAddCompetitor()}
                  disabled={state.competitorDomains.length >= 3}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-40"
                />
              </div>
              <button
                onClick={handleAddCompetitor}
                disabled={state.competitorDomains.length >= 3}
                className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* Added competitors */}
            {state.competitorDomains.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {state.competitorDomains.map((d, i) => (
                  <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    style={{ backgroundColor: `${CARD_COLORS[i + 1]}18`, borderColor: `${CARD_COLORS[i + 1]}35`, color: CARD_COLORS[i + 1] }}>
                    {d}
                    <button onClick={() => dispatch({ type: "REMOVE_COMPETITOR", payload: d })}
                      className="hover:opacity-70 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {state.error && (
          <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
            <button onClick={() => dispatch({ type: "SET_ERROR", payload: null })} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        <button
          onClick={handleCompare}
          disabled={state.comparing}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {state.comparing
            ? <><RefreshCw className="w-4 h-4 animate-spin" />Comparing domains...</>
            : <><BarChart2 className="w-4 h-4" />Run Comparison</>}
        </button>

        {state.comparing && (
          <div className="mt-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                initial={{ width: "0%" }} animate={{ width: "88%" }}
                transition={{ duration: 2, ease: "easeInOut" }} />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Fetching metrics", "Comparing traffic", "Analyzing keywords", "Scoring domains"].map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.45 }}
                  className="flex items-center gap-1.5 text-xs text-blue-200/40">
                  <RefreshCw className="w-3 h-3 animate-spin text-orange-400" />{s}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {!state.hasCompared && !state.comparing && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-5">
            <Target className="w-10 h-10 text-orange-400/50" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Compare Your Domain Against Competitors</h3>
          <p className="text-blue-200/50 text-sm max-w-md mx-auto mb-6">
            Enter your domain and up to 3 competitor domains to get a detailed side-by-side breakdown of authority, traffic, keywords, backlinks, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {["Domain Authority", "Organic Traffic", "Keyword Gap", "Backlink Comparison", "Technical Scores", "Traffic Trends"].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-200/50">
                <CheckCircle2 className="w-3 h-3 text-orange-400/50" />{f}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state.hasCompared && state.yourMetrics && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">

            {/* Score Cards */}
            <div className={`grid gap-4 ${allMetrics.length === 2 ? "grid-cols-1 sm:grid-cols-2" : allMetrics.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
              {allMetrics.map((m, i) => (
                <motion.div key={m.domain}
                  initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ScoreCard metrics={m} isYou={i === 0} color={CARD_COLORS[i % CARD_COLORS.length]} />
                </motion.div>
              ))}
            </div>

            {/* View Tabs */}
            <div className="flex gap-2">
              {views.map(v => (
                <button key={v.key} onClick={() => dispatch({ type: "SET_VIEW", payload: v.key })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    state.activeView === v.key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-blue-200/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}>
                  <v.icon className="w-3.5 h-3.5" />{v.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {state.activeView === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-5">Head-to-Head Comparison</h3>
                    <MetricRow label="Domain Authority" yourVal={state.yourMetrics.domainAuthority}
                      compVals={state.competitorMetrics.map(m => m.domainAuthority)} format={n => `${n}`} icon={Shield} />
                    <MetricRow label="Organic Traffic / Month" yourVal={state.yourMetrics.organicTraffic}
                      compVals={state.competitorMetrics.map(m => m.organicTraffic)} format={formatNum} icon={Users} />
                    <MetricRow label="Total Keywords Ranking" yourVal={state.yourMetrics.totalKeywords}
                      compVals={state.competitorMetrics.map(m => m.totalKeywords)} format={formatNum} icon={Key} />
                    <MetricRow label="Total Backlinks" yourVal={state.yourMetrics.backlinks}
                      compVals={state.competitorMetrics.map(m => m.backlinks)} format={formatNum} icon={Link2} />
                    <MetricRow label="Referring Domains" yourVal={state.yourMetrics.referringDomains}
                      compVals={state.competitorMetrics.map(m => m.referringDomains)} format={formatNum} icon={Globe} />
                  </div>

                  {/* Win/Lose Summary */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {state.competitorMetrics.map((comp, i) => {
                      const wins = [
                        state.yourMetrics!.domainAuthority > comp.domainAuthority,
                        state.yourMetrics!.organicTraffic > comp.organicTraffic,
                        state.yourMetrics!.totalKeywords > comp.totalKeywords,
                        state.yourMetrics!.backlinks > comp.backlinks,
                        state.yourMetrics!.referringDomains > comp.referringDomains,
                      ].filter(Boolean).length;
                      const total = 5;
                      const pct = Math.round((wins / total) * 100);
                      return (
                        <div key={comp.domain} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CARD_COLORS[i + 1] }} />
                            <span className="text-sm font-bold text-white truncate">vs {comp.domain}</span>
                          </div>
                          <div className="text-3xl font-black mb-1" style={{ color: pct >= 60 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171" }}>
                            {wins}/{total}
                          </div>
                          <p className="text-xs text-blue-200/50 mb-3">metrics where you win</p>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full"
                              style={{ backgroundColor: pct >= 60 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171" }}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }} />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-blue-200/40">You win {pct}%</span>
                            <span className={`text-xs font-bold ${pct >= 60 ? "text-emerald-400" : pct >= 40 ? "text-amber-400" : "text-red-400"}`}>
                              {pct >= 60 ? "Winning" : pct >= 40 ? "Competitive" : "Behind"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* KEYWORD GAP */}
              {state.activeView === "keywords" && (
                <motion.div key="keywords" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {state.competitorMetrics.map((comp, i) => (
                      <div key={comp.domain} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CARD_COLORS[i + 1] }} />
                          <span className="text-sm font-bold text-white truncate">{comp.domain}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs text-blue-200/50">Common Keywords</span>
                            <span className="text-sm font-black text-white">{formatNum(comp.commonKeywords)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs text-blue-200/50">Their Unique Keywords</span>
                            <span className="text-sm font-black text-orange-400">{formatNum(comp.uniqueKeywords)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-xs text-blue-200/50">Top 10 Rankings</span>
                            <span className="text-sm font-black text-emerald-400">{formatNum(comp.top10Keywords)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-xs text-blue-200/50">Avg Position</span>
                            <span className="text-sm font-black text-blue-400">#{comp.avgPosition}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-xs text-blue-200/40 mb-2">Keyword Opportunity Gap</p>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ backgroundColor: CARD_COLORS[i + 1] }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.round((comp.uniqueKeywords / Math.max(comp.uniqueKeywords, state.yourMetrics!.totalKeywords)) * 100))}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }} />
                          </div>
                          <p className="text-xs text-blue-200/30 mt-1">{formatNum(comp.uniqueKeywords)} keywords you could target</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-4">Keyword Metrics Comparison</h3>
                    <MetricRow label="Top 10 Keyword Rankings" yourVal={state.yourMetrics!.top10Keywords}
                      compVals={state.competitorMetrics.map(m => m.top10Keywords)} format={formatNum} icon={Award} />
                    <MetricRow label="Average Position" yourVal={state.yourMetrics!.avgPosition}
                      compVals={state.competitorMetrics.map(m => m.avgPosition)} format={n => `#${n}`} higherBetter={false} icon={Target} />
                    <MetricRow label="Total Content Pages" yourVal={state.yourMetrics!.contentPages}
                      compVals={state.competitorMetrics.map(m => m.contentPages)} format={formatNum} icon={Key} />
                  </div>
                </motion.div>
              )}

              {/* TECHNICAL */}
              {state.activeView === "technical" && (
                <motion.div key="technical" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-base font-bold text-white mb-5">Technical Performance</h3>
                    <MetricRow label="Mobile Score (0-100)" yourVal={state.yourMetrics!.mobileScore}
                      compVals={state.competitorMetrics.map(m => m.mobileScore)} format={n => `${n}/100`} icon={Zap} />
                    <MetricRow label="Load Speed (seconds)" yourVal={state.yourMetrics!.loadSpeed}
                      compVals={state.competitorMetrics.map(m => m.loadSpeed)} format={n => `${n}s`} higherBetter={false} icon={RefreshCw} />
                    <MetricRow label="Social Signals" yourVal={state.yourMetrics!.socialSignals}
                      compVals={state.competitorMetrics.map(m => m.socialSignals)} format={formatNum} icon={Users} />
                    <MetricRow label="Traffic Growth Trend" yourVal={state.yourMetrics!.trafficTrend}
                      compVals={state.competitorMetrics.map(m => m.trafficTrend)} format={n => `${n > 0 ? "+" : ""}${n}%`} icon={TrendingUp} />
                  </div>

                  {/* Technical Scorecard */}
                  <div className={`grid gap-4 ${allMetrics.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {allMetrics.map((m, i) => {
                      const techScore = Math.round((m.mobileScore * 0.4) + (Math.max(0, 50 - m.loadSpeed * 10) * 0.3) + (Math.min(100, m.socialSignals / 500) * 0.3));
                      return (
                        <div key={m.domain} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }} />
                            <span className="text-sm font-bold text-white truncate">{i === 0 ? "Your Site" : m.domain}</span>
                          </div>
                          <div className="space-y-2.5">
                            {[
                              { label: "Mobile Score", val: `${m.mobileScore}/100`, good: m.mobileScore >= 80 },
                              { label: "Load Speed", val: `${m.loadSpeed}s`, good: m.loadSpeed < 3 },
                              { label: "Traffic Trend", val: `${m.trafficTrend > 0 ? "+" : ""}${m.trafficTrend}%`, good: m.trafficTrend > 0 },
                            ].map(item => (
                              <div key={item.label} className="flex items-center justify-between">
                                <span className="text-xs text-blue-200/50">{item.label}</span>
                                <div className="flex items-center gap-1.5">
                                  {item.good
                                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                  <span className={`text-sm font-bold ${item.good ? "text-emerald-400" : "text-red-400"}`}>{item.val}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-white/5">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-blue-200/40">Tech Score</span>
                              <span className={`text-sm font-black ${techScore >= 70 ? "text-emerald-400" : techScore >= 50 ? "text-amber-400" : "text-red-400"}`}>{techScore}/100</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full"
                                style={{ backgroundColor: techScore >= 70 ? "#34d399" : techScore >= 50 ? "#fbbf24" : "#f87171" }}
                                initial={{ width: 0 }} animate={{ width: `${techScore}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
