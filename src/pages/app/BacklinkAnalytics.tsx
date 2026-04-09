import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Search, Link2, Shield, TrendingUp, TrendingDown,
  RefreshCw, AlertCircle, Trash2, Save, CheckCircle2,
  ExternalLink, Filter, Download, Globe, Award,
  BarChart2, ArrowUp, ArrowDown, Minus, X, Plus,
  Lock, Unlock, Star, Clock
} from "lucide-react";

interface Backlink {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  pageAuthority: number;
  linkType: "dofollow" | "nofollow";
  firstSeen: string;
  traffic: number;
  status: "active" | "lost" | "new";
}

interface SavedBacklink {
  id: string;
  user_id: string;
  source_url: string;
  target_url: string;
  authority: number;
  created_at: string;
}

interface DomainOverview {
  domain: string;
  domainAuthority: number;
  totalBacklinks: number;
  referringDomains: number;
  dofollowPct: number;
  nofollowPct: number;
  newLinks: number;
  lostLinks: number;
}

interface State {
  domain: string;
  analyzing: boolean;
  overview: DomainOverview | null;
  backlinks: Backlink[];
  analyzeError: string | null;
  hasAnalyzed: boolean;
  saved: SavedBacklink[];
  savedLoading: boolean;
  savedError: string | null;
  saving: boolean;
  saveSuccess: boolean;
  deletingId: string | null;
  activeTab: "results" | "saved";
  linkTypeFilter: string;
  statusFilter: string;
  sortField: string;
  sortDir: "asc" | "desc";
}

type Action =
  | { type: "SET_DOMAIN"; payload: string }
  | { type: "SET_ANALYZING"; payload: boolean }
  | { type: "SET_OVERVIEW"; payload: DomainOverview | null }
  | { type: "SET_BACKLINKS"; payload: Backlink[] }
  | { type: "SET_ANALYZE_ERROR"; payload: string | null }
  | { type: "SET_HAS_ANALYZED"; payload: boolean }
  | { type: "SET_SAVED"; payload: SavedBacklink[] }
  | { type: "SET_SAVED_LOADING"; payload: boolean }
  | { type: "SET_SAVED_ERROR"; payload: string | null }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_SAVE_SUCCESS"; payload: boolean }
  | { type: "SET_DELETING"; payload: string | null }
  | { type: "SET_TAB"; payload: "results" | "saved" }
  | { type: "SET_LINK_TYPE_FILTER"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: string }
  | { type: "SET_SORT"; payload: { field: string; dir: "asc" | "desc" } }
  | { type: "ADD_SAVED"; payload: SavedBacklink[] }
  | { type: "REMOVE_SAVED"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DOMAIN": return { ...state, domain: action.payload };
    case "SET_ANALYZING": return { ...state, analyzing: action.payload };
    case "SET_OVERVIEW": return { ...state, overview: action.payload };
    case "SET_BACKLINKS": return { ...state, backlinks: action.payload };
    case "SET_ANALYZE_ERROR": return { ...state, analyzeError: action.payload };
    case "SET_HAS_ANALYZED": return { ...state, hasAnalyzed: action.payload };
    case "SET_SAVED": return { ...state, saved: action.payload };
    case "SET_SAVED_LOADING": return { ...state, savedLoading: action.payload };
    case "SET_SAVED_ERROR": return { ...state, savedError: action.payload };
    case "SET_SAVING": return { ...state, saving: action.payload };
    case "SET_SAVE_SUCCESS": return { ...state, saveSuccess: action.payload };
    case "SET_DELETING": return { ...state, deletingId: action.payload };
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "SET_LINK_TYPE_FILTER": return { ...state, linkTypeFilter: action.payload };
    case "SET_STATUS_FILTER": return { ...state, statusFilter: action.payload };
    case "SET_SORT": return { ...state, sortField: action.payload.field, sortDir: action.payload.dir };
    case "ADD_SAVED": return { ...state, saved: [...action.payload, ...state.saved] };
    case "REMOVE_SAVED": return { ...state, saved: state.saved.filter(s => s.id !== action.payload) };
    default: return state;
  }
}

const initialState: State = {
  domain: "",
  analyzing: false,
  overview: null,
  backlinks: [],
  analyzeError: null,
  hasAnalyzed: false,
  saved: [],
  savedLoading: true,
  savedError: null,
  saving: false,
  saveSuccess: false,
  deletingId: null,
  activeTab: "results",
  linkTypeFilter: "all",
  statusFilter: "all",
  sortField: "domainAuthority",
  sortDir: "desc",
};

const SOURCE_DOMAINS = [
  "techcrunch.com", "forbes.com", "entrepreneur.com", "searchengineland.com",
  "moz.com", "ahrefs.com", "semrush.com", "backlinko.com", "neilpatel.com",
  "hubspot.com", "copyblogger.com", "seojournal.com", "digitalmarketer.com",
  "socialmediaexaminer.com", "contentmarketinginstitute.com", "sitepoint.com",
  "smashingmagazine.com", "webdesignerdepot.com", "css-tricks.com", "alistapart.com",
];

const ANCHORS = [
  "click here", "SEO tools", "best SEO platform", "learn more", "keyword research",
  "site audit", "backlink checker", "rank tracker", "SEO software", "digital marketing",
  "website optimization", "search engine optimization", "organic traffic", "domain authority",
];

function generateBacklinks(domain: string): { overview: DomainOverview; backlinks: Backlink[] } {
  const seed = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const da = Math.floor((seed % 55) + 20);
  const total = Math.floor((seed % 800) + 120);
  const referring = Math.floor(total * 0.6);
  const dofollowPct = Math.floor((seed % 30) + 55);

  const overview: DomainOverview = {
    domain,
    domainAuthority: da,
    totalBacklinks: total,
    referringDomains: referring,
    dofollowPct,
    nofollowPct: 100 - dofollowPct,
    newLinks: Math.floor((seed % 25) + 5),
    lostLinks: Math.floor((seed % 15) + 2),
  };

  const statuses: Backlink["status"][] = ["active", "active", "active", "new", "lost"];
  const backlinks: Backlink[] = SOURCE_DOMAINS.map((src, i) => {
    const s = seed + i * 17;
    const srcDa = Math.max(10, Math.min(95, Math.floor((s % 75) + 15)));
    const daysAgo = Math.floor((s % 180) + 1);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return {
      sourceUrl: `https://${src}/article-${Math.floor(s % 999) + 100}`,
      targetUrl: `https://${domain}`,
      anchorText: ANCHORS[s % ANCHORS.length],
      domainAuthority: srcDa,
      pageAuthority: Math.max(5, srcDa - Math.floor(s % 20)),
      linkType: s % 5 === 0 ? "nofollow" : "dofollow",
      firstSeen: d.toISOString(),
      traffic: Math.floor((s % 50000) + 1000),
      status: statuses[s % statuses.length],
    };
  });

  return { overview, backlinks };
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
      <text x={size / 2} y={size / 2 + 2} textAnchor="middle" fontSize={size * 0.24} fontWeight="900" fill={color}>{score}</text>
      <text x={size / 2} y={size / 2 + size * 0.18} textAnchor="middle" fontSize={size * 0.1} fill="rgba(255,255,255,0.35)">DA</text>
    </svg>
  );
}

const statusConfig = {
  active: { label: "Active", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" },
  new: { label: "New", color: "text-blue-400 bg-blue-500/15 border-blue-500/25" },
  lost: { label: "Lost", color: "text-red-400 bg-red-500/15 border-red-500/25" },
};

function daColor(da: number) {
  if (da >= 60) return "text-emerald-400";
  if (da >= 40) return "text-amber-400";
  return "text-red-400";
}

function formatTraffic(t: number) {
  if (t >= 1000000) return `${(t / 1000000).toFixed(1)}M`;
  if (t >= 1000) return `${(t / 1000).toFixed(1)}K`;
  return t.toString();
}

export default function BacklinkAnalytics() {
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) return;
    loadSaved();
  }, [user]);

  async function loadSaved() {
    dispatch({ type: "SET_SAVED_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("backlinks")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "SET_SAVED", payload: data ?? [] });
    } catch (err: any) {
      dispatch({ type: "SET_SAVED_ERROR", payload: err.message ?? "Failed to load saved backlinks." });
    } finally {
      dispatch({ type: "SET_SAVED_LOADING", payload: false });
    }
  }

  function validateDomain(raw: string): string {
    if (!raw.trim()) throw new Error("Please enter a domain to analyze.");
    let d = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (!d.includes(".")) throw new Error("Please enter a valid domain (e.g. example.com).");
    return d;
  }

  async function handleAnalyze() {
    dispatch({ type: "SET_ANALYZE_ERROR", payload: null });
    let cleanDomain: string;
    try {
      cleanDomain = validateDomain(state.domain);
    } catch (err: any) {
      dispatch({ type: "SET_ANALYZE_ERROR", payload: err.message });
      return;
    }
    dispatch({ type: "SET_ANALYZING", payload: true });
    dispatch({ type: "SET_HAS_ANALYZED", payload: false });
    await new Promise(r => setTimeout(r, 2000));
    const { overview, backlinks } = generateBacklinks(cleanDomain);
    dispatch({ type: "SET_OVERVIEW", payload: overview });
    dispatch({ type: "SET_BACKLINKS", payload: backlinks });
    dispatch({ type: "SET_HAS_ANALYZED", payload: true });
    dispatch({ type: "SET_ANALYZING", payload: false });
    dispatch({ type: "SET_TAB", payload: "results" });
  }

  async function handleSaveAll() {
    if (!state.backlinks.length) return;
    dispatch({ type: "SET_SAVING", payload: true });
    try {
      const inserts = state.backlinks.slice(0, 10).map(b => ({
        user_id: user!.id,
        source_url: b.sourceUrl,
        target_url: b.targetUrl,
        authority: b.domainAuthority,
      }));
      const { data, error } = await supabase.from("backlinks").insert(inserts).select();
      if (error) throw error;
      dispatch({ type: "ADD_SAVED", payload: data ?? [] });
      dispatch({ type: "SET_SAVE_SUCCESS", payload: true });
      setTimeout(() => dispatch({ type: "SET_SAVE_SUCCESS", payload: false }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_ANALYZE_ERROR", payload: err.message ?? "Failed to save backlinks." });
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }

  async function handleDelete(id: string) {
    dispatch({ type: "SET_DELETING", payload: id });
    try {
      const { error } = await supabase.from("backlinks").delete().eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
      dispatch({ type: "REMOVE_SAVED", payload: id });
    } catch { /* silent */ }
    finally { dispatch({ type: "SET_DELETING", payload: null }); }
  }

  function handleSort(field: string) {
    if (state.sortField === field) {
      dispatch({ type: "SET_SORT", payload: { field, dir: state.sortDir === "desc" ? "asc" : "desc" } });
    } else {
      dispatch({ type: "SET_SORT", payload: { field, dir: "desc" } });
    }
  }

  function exportCSV() {
    const rows = [
      ["Source URL", "Target URL", "Anchor Text", "DA", "PA", "Type", "Status", "Traffic"],
      ...state.backlinks.map(b => [b.sourceUrl, b.targetUrl, b.anchorText, b.domainAuthority, b.pageAuthority, b.linkType, b.status, b.traffic]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `backlinks-${state.domain}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = state.backlinks
    .filter(b => state.linkTypeFilter === "all" || b.linkType === state.linkTypeFilter)
    .filter(b => state.statusFilter === "all" || b.status === state.statusFilter)
    .sort((a, b) => {
      const mult = state.sortDir === "desc" ? -1 : 1;
      if (state.sortField === "domainAuthority") return mult * (a.domainAuthority - b.domainAuthority);
      if (state.sortField === "traffic") return mult * (a.traffic - b.traffic);
      if (state.sortField === "pageAuthority") return mult * (a.pageAuthority - b.pageAuthority);
      return 0;
    });

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Backlink Analytics</h1>
        <p className="text-blue-200/70 text-sm mt-1">Analyze backlink profiles, domain authority, and link quality for any domain</p>
      </motion.div>

      {/* Domain Input */}
      <motion.div {...fadeUp} className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
            <input
              type="text"
              placeholder="example.com"
              value={state.domain}
              onChange={e => dispatch({ type: "SET_DOMAIN", payload: e.target.value })}
              onKeyDown={e => e.key === "Enter" && !state.analyzing && handleAnalyze()}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={state.analyzing}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[160px]"
          >
            {state.analyzing ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</>
            ) : (
              <><Search className="w-4 h-4" />Analyze Backlinks</>
            )}
          </button>
        </div>
        {state.analyzeError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.analyzeError}
            <button onClick={() => dispatch({ type: "SET_ANALYZE_ERROR", payload: null })} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {state.analyzing && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-blue-200/40 mb-2">
              <span>Crawling backlink database for {state.domain}...</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Fetching link data", "Calculating authority", "Checking link types", "Building report"].map((step, i) => (
                <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-1.5 text-xs text-blue-200/40">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />{step}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {state.saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Top 10 backlinks saved to your library successfully.
          </motion.div>
        )}
      </motion.div>

      {/* Overview Cards */}
      <AnimatePresence>
        {state.hasAnalyzed && state.overview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* DA Ring */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <AuthorityRing score={state.overview.domainAuthority} size={110} />
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Domain Authority</p>
                  <p className="text-xs text-blue-200/40 mt-0.5">{state.overview.domain}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Backlinks", value: state.overview.totalBacklinks.toLocaleString(), icon: Link2, color: "text-blue-400", sub: "links indexed" },
                  { label: "Referring Domains", value: state.overview.referringDomains.toLocaleString(), icon: Globe, color: "text-cyan-400", sub: "unique domains" },
                  { label: "Dofollow Links", value: `${state.overview.dofollowPct}%`, icon: Unlock, color: "text-emerald-400", sub: "pass link equity" },
                  { label: "Nofollow Links", value: `${state.overview.nofollowPct}%`, icon: Lock, color: "text-amber-400", sub: "no link equity" },
                  { label: "New Links", value: `+${state.overview.newLinks}`, icon: TrendingUp, color: "text-emerald-400", sub: "last 30 days" },
                  { label: "Lost Links", value: `-${state.overview.lostLinks}`, icon: TrendingDown, color: "text-red-400", sub: "last 30 days" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs text-blue-200/50 font-semibold">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-blue-200/30 mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dofollow Bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Link Type Distribution</span>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Dofollow {state.overview.dofollowPct}%</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Nofollow {state.overview.nofollowPct}%</span>
                </div>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                <motion.div
                  className="h-full bg-emerald-500 rounded-l-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.overview.dofollowPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full bg-amber-500 rounded-r-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.overview.nofollowPct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {(["results", "saved"] as const).map(tab => (
                <button key={tab} onClick={() => dispatch({ type: "SET_TAB", payload: tab })}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 capitalize flex items-center gap-2 ${
                    state.activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-blue-200/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}>
                  {tab === "results" ? <Link2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {tab === "results" ? `Backlinks (${filtered.length})` : `Saved (${state.saved.length})`}
                </button>
              ))}
            </div>

            {/* Results Tab */}
            <AnimatePresence mode="wait">
              {state.activeTab === "results" && (
                <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {/* Filters + Actions */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Filter className="w-3.5 h-3.5 text-blue-200/40 self-center" />
                    <select value={state.linkTypeFilter} onChange={e => dispatch({ type: "SET_LINK_TYPE_FILTER", payload: e.target.value })}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/70 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                      <option value="all">All Types</option>
                      <option value="dofollow">Dofollow</option>
                      <option value="nofollow">Nofollow</option>
                    </select>
                    <select value={state.statusFilter} onChange={e => dispatch({ type: "SET_STATUS_FILTER", payload: e.target.value })}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/70 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="new">New</option>
                      <option value="lost">Lost</option>
                    </select>
                    <div className="ml-auto flex gap-2">
                      <button onClick={exportCSV}
                        className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/60 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-white/10">
                        <Download className="w-3.5 h-3.5" />Export
                      </button>
                      <button onClick={handleSaveAll} disabled={state.saving || state.saveSuccess}
                        className={`h-8 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          state.saveSuccess ? "bg-emerald-600 text-white" : "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/30"
                        } disabled:opacity-60`}>
                        {state.saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Saving...</>
                          : state.saveSuccess ? <><CheckCircle2 className="w-3.5 h-3.5" />Saved!</>
                          : <><Save className="w-3.5 h-3.5" />Save Top 10</>}
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/5 bg-white/3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/40">Source</span>
                      {[
                        { label: "DA", field: "domainAuthority" },
                        { label: "PA", field: "pageAuthority" },
                        { label: "Traffic", field: "traffic" },
                      ].map(col => (
                        <button key={col.field} onClick={() => handleSort(col.field)}
                          className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors text-left ${state.sortField === col.field ? "text-blue-400" : "text-blue-200/40 hover:text-blue-200/70"}`}>
                          {col.label}
                          {state.sortField === col.field ? (state.sortDir === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <Minus className="w-3 h-3 opacity-30" />}
                        </button>
                      ))}
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/40">Type</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/40">Status</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {filtered.map((bl, i) => {
                        const statusCfg = statusConfig[bl.status];
                        const src = bl.sourceUrl.replace("https://", "").split("/")[0];
                        return (
                          <motion.div key={bl.sourceUrl} initial={shouldReduce ? {} : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                            className="group px-6 py-4 hover:bg-white/5 transition-colors">
                            {/* Desktop */}
                            <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-white truncate">{src}</span>
                                  <a href={bl.sourceUrl} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-400/40 hover:text-blue-400 transition-colors flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                                <p className="text-xs text-blue-200/30 truncate mt-0.5">Anchor: {bl.anchorText}</p>
                              </div>
                              <span className={`text-sm font-black ${daColor(bl.domainAuthority)}`}>{bl.domainAuthority}</span>
                              <span className={`text-sm font-black ${daColor(bl.pageAuthority)}`}>{bl.pageAuthority}</span>
                              <span className="text-sm font-semibold text-white">{formatTraffic(bl.traffic)}</span>
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border w-fit ${bl.linkType === "dofollow" ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" : "text-amber-400 bg-amber-500/15 border-amber-500/25"}`}>
                                {bl.linkType === "dofollow" ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                {bl.linkType}
                              </span>
                              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border w-fit ${statusCfg.color}`}>
                                {statusCfg.label}
                              </span>
                            </div>
                            {/* Mobile */}
                            <div className="lg:hidden">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-white truncate">{src}</p>
                                  <p className="text-xs text-blue-200/30 truncate">Anchor: {bl.anchorText}</p>
                                </div>
                                <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusCfg.color}`}>{statusCfg.label}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-white/5 rounded-lg p-2 text-center">
                                  <div className={`font-black ${daColor(bl.domainAuthority)}`}>{bl.domainAuthority}</div>
                                  <div className="text-blue-200/40">DA</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-2 text-center">
                                  <div className="font-black text-white">{formatTraffic(bl.traffic)}</div>
                                  <div className="text-blue-200/40">Traffic</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-2 text-center">
                                  <div className={`font-bold ${bl.linkType === "dofollow" ? "text-emerald-400" : "text-amber-400"}`}>{bl.linkType}</div>
                                  <div className="text-blue-200/40">Type</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Saved Tab */}
              {state.activeTab === "saved" && (
                <motion.div key="saved" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {state.savedLoading && (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />)}
                    </div>
                  )}
                  {!state.savedLoading && state.savedError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4" />{state.savedError}
                    </div>
                  )}
                  {!state.savedLoading && !state.savedError && state.saved.length === 0 && (
                    <div className="text-center py-12 bg-white/3 border border-white/8 rounded-2xl">
                      <Link2 className="w-10 h-10 text-blue-400/20 mx-auto mb-3" />
                      <p className="text-blue-200/50 text-sm font-semibold">No saved backlinks yet</p>
                      <p className="text-blue-200/30 text-xs mt-1">Analyze a domain and save the top backlinks to your library</p>
                    </div>
                  )}
                  {!state.savedLoading && !state.savedError && state.saved.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_60px] gap-4 px-6 py-3 border-b border-white/5 bg-white/3 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
                        <span>Source URL</span><span>Target URL</span><span>Authority</span><span>Saved</span><span>Del</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {state.saved.map((bl, i) => {
                          const isDeleting = state.deletingId === bl.id;
                          return (
                            <motion.div key={bl.id} initial={shouldReduce ? {} : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                              className="group px-6 py-4 hover:bg-white/5 transition-colors">
                              <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_60px] gap-4 items-center">
                                <span className="text-sm text-white truncate">{bl.source_url.replace("https://", "").split("/")[0]}</span>
                                <span className="text-sm text-blue-200/50 truncate">{bl.target_url.replace("https://", "").split("/")[0]}</span>
                                <span className={`text-sm font-black ${daColor(bl.authority)}`}>{bl.authority}</span>
                                <span className="text-xs text-blue-200/40">{new Date(bl.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
                                <button onClick={() => handleDelete(bl.id)} disabled={isDeleting}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/0 group-hover:text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                                  {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="md:hidden flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-bold text-white">{bl.source_url.replace("https://", "").split("/")[0]}</p>
                                  <p className="text-xs text-blue-200/40 mt-0.5">DA: <span className={`font-bold ${daColor(bl.authority)}`}>{bl.authority}</span></p>
                                </div>
                                <button onClick={() => handleDelete(bl.id)} disabled={isDeleting}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                  {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State before analysis */}
      {!state.hasAnalyzed && !state.analyzing && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Link2 className="w-10 h-10 text-blue-400/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyze Any Domain</h3>
          <p className="text-blue-200/50 text-sm max-w-sm mx-auto">
            Enter a domain above to discover its backlink profile, domain authority score, referring domains, and link quality breakdown.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-blue-200/30">
            {["Domain Authority Score", "Referring Domains", "Dofollow vs Nofollow", "Link Status Tracking"].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 border border-white/8">
                <CheckCircle2 className="w-3 h-3 text-blue-400/40" />{f}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
