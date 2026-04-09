import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Search, TrendingUp, TrendingDown, Minus, BookmarkPlus,
  Bookmark, Trash2, RefreshCw, AlertCircle, ChevronUp,
  ChevronDown, Filter, Download, Target, BarChart2,
  Zap, Globe, ShoppingCart, Info, CheckCircle2, X
} from "lucide-react";

interface KeywordResult {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: "informational" | "navigational" | "commercial" | "transactional";
  trend: "up" | "down" | "stable";
  competition: "low" | "medium" | "high";
}

interface SavedKeyword {
  id: string;
  user_id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  created_at: string;
}

type SortField = "keyword" | "volume" | "difficulty" | "cpc";
type SortDir = "asc" | "desc";

interface State {
  query: string;
  searching: boolean;
  results: KeywordResult[];
  searchError: string | null;
  hasSearched: boolean;
  saved: SavedKeyword[];
  savedLoading: boolean;
  savedError: string | null;
  savingKeyword: string | null;
  deletingId: string | null;
  sortField: SortField;
  sortDir: SortDir;
  intentFilter: string;
  difficultyFilter: string;
  saveSuccess: string | null;
  activeTab: "results" | "saved";
}

type Action =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_SEARCHING"; payload: boolean }
  | { type: "SET_RESULTS"; payload: KeywordResult[] }
  | { type: "SET_SEARCH_ERROR"; payload: string | null }
  | { type: "SET_HAS_SEARCHED"; payload: boolean }
  | { type: "SET_SAVED"; payload: SavedKeyword[] }
  | { type: "SET_SAVED_LOADING"; payload: boolean }
  | { type: "SET_SAVED_ERROR"; payload: string | null }
  | { type: "SET_SAVING"; payload: string | null }
  | { type: "SET_DELETING"; payload: string | null }
  | { type: "SET_SORT"; payload: { field: SortField; dir: SortDir } }
  | { type: "SET_INTENT_FILTER"; payload: string }
  | { type: "SET_DIFFICULTY_FILTER"; payload: string }
  | { type: "SET_SAVE_SUCCESS"; payload: string | null }
  | { type: "SET_TAB"; payload: "results" | "saved" }
  | { type: "ADD_SAVED"; payload: SavedKeyword }
  | { type: "REMOVE_SAVED"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_QUERY": return { ...state, query: action.payload };
    case "SET_SEARCHING": return { ...state, searching: action.payload };
    case "SET_RESULTS": return { ...state, results: action.payload };
    case "SET_SEARCH_ERROR": return { ...state, searchError: action.payload };
    case "SET_HAS_SEARCHED": return { ...state, hasSearched: action.payload };
    case "SET_SAVED": return { ...state, saved: action.payload };
    case "SET_SAVED_LOADING": return { ...state, savedLoading: action.payload };
    case "SET_SAVED_ERROR": return { ...state, savedError: action.payload };
    case "SET_SAVING": return { ...state, savingKeyword: action.payload };
    case "SET_DELETING": return { ...state, deletingId: action.payload };
    case "SET_SORT": return { ...state, sortField: action.payload.field, sortDir: action.payload.dir };
    case "SET_INTENT_FILTER": return { ...state, intentFilter: action.payload };
    case "SET_DIFFICULTY_FILTER": return { ...state, difficultyFilter: action.payload };
    case "SET_SAVE_SUCCESS": return { ...state, saveSuccess: action.payload };
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "ADD_SAVED": return { ...state, saved: [action.payload, ...state.saved] };
    case "REMOVE_SAVED": return { ...state, saved: state.saved.filter(s => s.id !== action.payload) };
    default: return state;
  }
}

const initialState: State = {
  query: "",
  searching: false,
  results: [],
  searchError: null,
  hasSearched: false,
  saved: [],
  savedLoading: true,
  savedError: null,
  savingKeyword: null,
  deletingId: null,
  sortField: "volume",
  sortDir: "desc",
  intentFilter: "all",
  difficultyFilter: "all",
  saveSuccess: null,
  activeTab: "results",
};

const intentConfig = {
  informational: { label: "Informational", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/25", icon: Info },
  navigational: { label: "Navigational", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/25", icon: Globe },
  commercial: { label: "Commercial", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25", icon: BarChart2 },
  transactional: { label: "Transactional", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25", icon: ShoppingCart },
};

const competitionConfig = {
  low: { label: "Low", color: "text-emerald-400" },
  medium: { label: "Medium", color: "text-amber-400" },
  high: { label: "High", color: "text-red-400" },
};

function difficultyColor(d: number) {
  if (d < 30) return "text-emerald-400";
  if (d < 60) return "text-amber-400";
  return "text-red-400";
}

function difficultyBg(d: number) {
  if (d < 30) return "bg-emerald-500";
  if (d < 60) return "bg-amber-500";
  return "bg-red-500";
}

function formatVolume(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return v.toString();
}

function generateKeywords(query: string): KeywordResult[] {
  const intents: KeywordResult["intent"][] = ["informational", "navigational", "commercial", "transactional"];
  const trends: KeywordResult["trend"][] = ["up", "down", "stable"];
  const competitions: KeywordResult["competition"][] = ["low", "medium", "high"];

  const variations = [
    query,
    `${query} guide`,
    `best ${query}`,
    `${query} tips`,
    `how to ${query}`,
    `${query} tools`,
    `${query} strategy`,
    `${query} for beginners`,
    `${query} examples`,
    `${query} checklist`,
    `${query} software`,
    `${query} agency`,
    `free ${query}`,
    `${query} vs`,
    `${query} tutorial`,
  ];

  return variations.map((kw, i) => {
    const seed = kw.length * (i + 1);
    const volume = Math.floor(((seed * 137) % 89000) + 500);
    const difficulty = Math.floor(((seed * 53) % 85) + 10);
    const cpc = parseFloat((((seed * 7) % 1800) / 100 + 0.5).toFixed(2));
    return {
      keyword: kw,
      volume,
      difficulty,
      cpc,
      intent: intents[(seed + i) % 4],
      trend: trends[(seed + i * 2) % 3],
      competition: competitions[(seed + i * 3) % 3],
    };
  });
}

function TrendIcon({ trend }: { trend: KeywordResult["trend"] }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-blue-200/40" />;
}

function SortButton({ field, label, current, dir, onSort }: {
  field: SortField; label: string; current: SortField; dir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ${active ? "text-blue-400" : "text-blue-200/40 hover:text-blue-200/70"}`}
    >
      {label}
      {active ? (dir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
    </button>
  );
}

export default function KeywordExplorer() {
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
        .from("keywords")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "SET_SAVED", payload: data ?? [] });
    } catch (err: any) {
      dispatch({ type: "SET_SAVED_ERROR", payload: err.message ?? "Failed to load saved keywords." });
    } finally {
      dispatch({ type: "SET_SAVED_LOADING", payload: false });
    }
  }

  async function handleSearch() {
    if (!state.query.trim()) {
      dispatch({ type: "SET_SEARCH_ERROR", payload: "Please enter a keyword to research." });
      return;
    }
    dispatch({ type: "SET_SEARCHING", payload: true });
    dispatch({ type: "SET_SEARCH_ERROR", payload: null });
    dispatch({ type: "SET_HAS_SEARCHED", payload: false });
    await new Promise(r => setTimeout(r, 1600));
    const results = generateKeywords(state.query.trim().toLowerCase());
    dispatch({ type: "SET_RESULTS", payload: results });
    dispatch({ type: "SET_HAS_SEARCHED", payload: true });
    dispatch({ type: "SET_SEARCHING", payload: false });
    dispatch({ type: "SET_TAB", payload: "results" });
  }

  async function handleSave(kw: KeywordResult) {
    const alreadySaved = state.saved.some(s => s.keyword === kw.keyword);
    if (alreadySaved) return;
    dispatch({ type: "SET_SAVING", payload: kw.keyword });
    try {
      const { data, error } = await supabase.from("keywords").insert({
        user_id: user!.id,
        keyword: kw.keyword,
        volume: kw.volume,
        difficulty: kw.difficulty,
      }).select().single();
      if (error) throw error;
      dispatch({ type: "ADD_SAVED", payload: data });
      dispatch({ type: "SET_SAVE_SUCCESS", payload: kw.keyword });
      setTimeout(() => dispatch({ type: "SET_SAVE_SUCCESS", payload: null }), 2500);
    } catch (err: any) {
      dispatch({ type: "SET_SEARCH_ERROR", payload: err.message ?? "Failed to save keyword." });
    } finally {
      dispatch({ type: "SET_SAVING", payload: null });
    }
  }

  async function handleDelete(id: string) {
    dispatch({ type: "SET_DELETING", payload: id });
    try {
      const { error } = await supabase.from("keywords").delete().eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
      dispatch({ type: "REMOVE_SAVED", payload: id });
    } catch { /* silent */ }
    finally { dispatch({ type: "SET_DELETING", payload: null }); }
  }

  function handleSort(field: SortField) {
    if (state.sortField === field) {
      dispatch({ type: "SET_SORT", payload: { field, dir: state.sortDir === "desc" ? "asc" : "desc" } });
    } else {
      dispatch({ type: "SET_SORT", payload: { field, dir: "desc" } });
    }
  }

  function exportCSV() {
    const rows = [
      ["Keyword", "Volume", "Difficulty", "CPC", "Intent", "Competition", "Trend"],
      ...state.results.map(r => [r.keyword, r.volume, r.difficulty, r.cpc, r.intent, r.competition, r.trend]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `keywords-${state.query}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filteredResults = state.results
    .filter(r => state.intentFilter === "all" || r.intent === state.intentFilter)
    .filter(r => {
      if (state.difficultyFilter === "all") return true;
      if (state.difficultyFilter === "easy") return r.difficulty < 30;
      if (state.difficultyFilter === "medium") return r.difficulty >= 30 && r.difficulty < 60;
      if (state.difficultyFilter === "hard") return r.difficulty >= 60;
      return true;
    })
    .sort((a, b) => {
      const mult = state.sortDir === "desc" ? -1 : 1;
      if (state.sortField === "keyword") return mult * a.keyword.localeCompare(b.keyword);
      return mult * (a[state.sortField] - b[state.sortField]);
    });

  const savedKeywords = state.saved.map(s => s.keyword);
  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const avgVolume = state.results.length ? Math.round(state.results.reduce((s, r) => s + r.volume, 0) / state.results.length) : 0;
  const avgDiff = state.results.length ? Math.round(state.results.reduce((s, r) => s + r.difficulty, 0) / state.results.length) : 0;
  const lowComp = state.results.filter(r => r.competition === "low").length;

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Keyword Explorer</h1>
        <p className="text-blue-200/70 text-sm mt-1">Discover high-value keywords, search volumes, and ranking difficulty</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div {...fadeUp} className="mb-6 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
            <input
              type="text"
              placeholder='Try "SEO tools", "keyword research", "backlink strategy"...'
              value={state.query}
              onChange={e => dispatch({ type: "SET_QUERY", payload: e.target.value })}
              onKeyDown={e => e.key === "Enter" && !state.searching && handleSearch()}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={state.searching}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[160px]"
          >
            {state.searching ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Researching...</>
            ) : (
              <><Search className="w-4 h-4" />Research Keywords</>
            )}
          </button>
        </div>
        {state.searchError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.searchError}
            <button onClick={() => dispatch({ type: "SET_SEARCH_ERROR", payload: null })} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {state.saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Keyword saved: <strong>{state.saveSuccess}</strong>
          </motion.div>
        )}
      </motion.div>

      {/* Stats after search */}
      <AnimatePresence>
        {state.hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          >
            {[
              { label: "Keywords Found", value: state.results.length, icon: Target, color: "text-blue-400" },
              { label: "Avg. Volume", value: formatVolume(avgVolume) + "/mo", icon: BarChart2, color: "text-cyan-400" },
              { label: "Avg. Difficulty", value: `${avgDiff}/100`, icon: Zap, color: avgDiff < 40 ? "text-emerald-400" : avgDiff < 65 ? "text-amber-400" : "text-red-400" },
              { label: "Low Competition", value: lowComp, icon: TrendingUp, color: "text-emerald-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-base font-black text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      {(state.hasSearched || state.saved.length > 0) && (
        <motion.div {...fadeUp} className="flex gap-2 mb-5">
          {(["results", "saved"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => dispatch({ type: "SET_TAB", payload: tab })}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 capitalize flex items-center gap-2 ${
                state.activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white/5 text-blue-200/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {tab === "results" ? <Search className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {tab === "results" ? `Results (${filteredResults.length})` : `Saved (${state.saved.length})`}
            </button>
          ))}
        </motion.div>
      )}

      {/* Results Tab */}
      <AnimatePresence mode="wait">
        {state.activeTab === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            {state.hasSearched && (
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-blue-200/40" />
                  <span className="text-xs text-blue-200/40 font-semibold uppercase tracking-wider">Filter:</span>
                </div>
                <select
                  value={state.intentFilter}
                  onChange={e => dispatch({ type: "SET_INTENT_FILTER", payload: e.target.value })}
                  className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/70 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="all">All Intents</option>
                  <option value="informational">Informational</option>
                  <option value="navigational">Navigational</option>
                  <option value="commercial">Commercial</option>
                  <option value="transactional">Transactional</option>
                </select>
                <select
                  value={state.difficultyFilter}
                  onChange={e => dispatch({ type: "SET_DIFFICULTY_FILTER", payload: e.target.value })}
                  className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/70 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy (0-29)</option>
                  <option value="medium">Medium (30-59)</option>
                  <option value="hard">Hard (60+)</option>
                </select>
                <button
                  onClick={exportCSV}
                  className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/60 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-white/10 ml-auto"
                >
                  <Download className="w-3.5 h-3.5" />Export CSV
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {state.searching && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex gap-8">
                  {["Keyword", "Volume", "Difficulty", "CPC", "Intent"].map(h => (
                    <div key={h} className="h-3 bg-white/10 rounded w-16 animate-pulse" />
                  ))}
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 border-b border-white/5 flex gap-8 animate-pulse">
                    <div className="h-3 bg-white/5 rounded flex-1" />
                    <div className="h-3 bg-white/5 rounded w-16" />
                    <div className="h-3 bg-white/5 rounded w-20" />
                    <div className="h-3 bg-white/5 rounded w-12" />
                    <div className="h-5 bg-white/5 rounded-full w-24" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state before search */}
            {!state.searching && !state.hasSearched && (
              <div className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
                  <Search className="w-10 h-10 text-blue-400/50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Start Keyword Research</h3>
                <p className="text-blue-200/50 text-sm max-w-sm mx-auto">
                  Enter a keyword above to discover search volumes, ranking difficulty, CPC data, and search intent signals.
                </p>
              </div>
            )}

            {/* Results Table */}
            {!state.searching && state.hasSearched && filteredResults.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1fr_80px] gap-4 px-6 py-3 border-b border-white/5 bg-white/3">
                  <SortButton field="keyword" label="Keyword" current={state.sortField} dir={state.sortDir} onSort={handleSort} />
                  <SortButton field="volume" label="Volume" current={state.sortField} dir={state.sortDir} onSort={handleSort} />
                  <SortButton field="difficulty" label="Difficulty" current={state.sortField} dir={state.sortDir} onSort={handleSort} />
                  <SortButton field="cpc" label="CPC" current={state.sortField} dir={state.sortDir} onSort={handleSort} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/40">Intent</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/40">Trend</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/40">Save</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  {filteredResults.map((kw, i) => {
                    const intent = intentConfig[kw.intent];
                    const isSaved = savedKeywords.includes(kw.keyword);
                    const isSaving = state.savingKeyword === kw.keyword;
                    return (
                      <motion.div
                        key={kw.keyword}
                        initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group px-6 py-4 hover:bg-white/5 transition-colors"
                      >
                        {/* Desktop Row */}
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1fr_80px] gap-4 items-center">
                          <div>
                            <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{kw.keyword}</span>
                            <div className="text-xs text-blue-200/40 mt-0.5">{competitionConfig[kw.competition].label} competition</div>
                          </div>
                          <div className="text-sm font-bold text-white">{formatVolume(kw.volume)}<span className="text-xs text-blue-200/40 font-normal">/mo</span></div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${difficultyBg(kw.difficulty)}`} style={{ width: `${kw.difficulty}%` }} />
                            </div>
                            <span className={`text-xs font-bold w-7 text-right ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                          </div>
                          <div className="text-sm font-semibold text-white">${kw.cpc}</div>
                          <div>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${intent.bg} ${intent.color}`}>
                              <intent.icon className="w-3 h-3" />
                              {intent.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendIcon trend={kw.trend} />
                            <span className="text-xs text-blue-200/40 capitalize">{kw.trend}</span>
                          </div>
                          <button
                            onClick={() => handleSave(kw)}
                            disabled={isSaved || isSaving}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              isSaved
                                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default"
                                : "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400/60 hover:text-blue-400"
                            }`}
                            title={isSaved ? "Already saved" : "Save keyword"}
                          >
                            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Mobile Card */}
                        <div className="md:hidden space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-white">{kw.keyword}</p>
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border mt-1 ${intent.bg} ${intent.color}`}>
                                <intent.icon className="w-3 h-3" />{intent.label}
                              </span>
                            </div>
                            <button
                              onClick={() => handleSave(kw)}
                              disabled={isSaved || isSaving}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${isSaved ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" : "bg-blue-500/10 border border-blue-500/20 text-blue-400"}`}
                            >
                              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="font-black text-white">{formatVolume(kw.volume)}</div>
                              <div className="text-blue-200/40">Volume</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className={`font-black ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</div>
                              <div className="text-blue-200/40">Difficulty</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="font-black text-white">${kw.cpc}</div>
                              <div className="text-blue-200/40">CPC</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No filter results */}
            {!state.searching && state.hasSearched && filteredResults.length === 0 && (
              <div className="text-center py-12 bg-white/3 border border-white/8 rounded-2xl">
                <Filter className="w-10 h-10 text-blue-400/30 mx-auto mb-3" />
                <p className="text-blue-200/50 text-sm font-semibold">No keywords match your filters</p>
                <button onClick={() => { dispatch({ type: "SET_INTENT_FILTER", payload: "all" }); dispatch({ type: "SET_DIFFICULTY_FILTER", payload: "all" }); }} className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline">Clear filters</button>
              </div>
            )}
          </motion.div>
        )}

        {/* Saved Tab */}
        {state.activeTab === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {state.savedLoading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!state.savedLoading && state.savedError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4" />{state.savedError}
              </div>
            )}

            {!state.savedLoading && !state.savedError && state.saved.length === 0 && (
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <Bookmark className="w-10 h-10 text-blue-400/30 mx-auto mb-3" />
                <p className="text-blue-200/50 text-sm font-semibold">No saved keywords yet</p>
                <p className="text-blue-200/30 text-xs mt-1">Search for keywords and click the save button to track them here</p>
              </div>
            )}

            {!state.savedLoading && !state.savedError && state.saved.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_60px] gap-4 px-6 py-3 border-b border-white/5 bg-white/3 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
                  <span>Keyword</span><span>Volume</span><span>Difficulty</span><span>Saved On</span><span>Delete</span>
                </div>
                <div className="divide-y divide-white/5">
                  {state.saved.map((kw, i) => {
                    const isDeleting = state.deletingId === kw.id;
                    return (
                      <motion.div
                        key={kw.id}
                        initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group px-6 py-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_60px] gap-4 items-center">
                          <span className="text-sm font-semibold text-white">{kw.keyword}</span>
                          <span className="text-sm font-bold text-white">{formatVolume(kw.volume)}<span className="text-xs text-blue-200/40 font-normal">/mo</span></span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${difficultyBg(kw.difficulty)}`} style={{ width: `${kw.difficulty}%` }} />
                            </div>
                            <span className={`text-xs font-bold w-7 text-right ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                          </div>
                          <span className="text-xs text-blue-200/40">{new Date(kw.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <button
                            onClick={() => handleDelete(kw.id)}
                            disabled={isDeleting}
                            className="w-8 h-8 rounded-lg bg-red-500/0 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center justify-center text-red-400/0 group-hover:text-red-400/60 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                          >
                            {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="md:hidden flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-white">{kw.keyword}</p>
                            <div className="flex gap-3 mt-1 text-xs text-blue-200/40">
                              <span>{formatVolume(kw.volume)}/mo</span>
                              <span className={difficultyColor(kw.difficulty)}>KD: {kw.difficulty}</span>
                            </div>
                          </div>
                          <button onClick={() => handleDelete(kw.id)} disabled={isDeleting} className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
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
    </div>
  );
}
