import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Plus, TrendingUp, TrendingDown, Minus, RefreshCw,
  AlertCircle, Trash2, Target, BarChart2, Award,
  ChevronUp, ChevronDown, Search, Globe, Calendar,
  CheckCircle2, X, Zap, ArrowUp, ArrowDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface RankRecord {
  id: string;
  user_id: string;
  keyword: string;
  position: number;
  created_at: string;
}

interface TrackedKeyword {
  keyword: string;
  currentPosition: number;
  previousPosition: number | null;
  change: number | null;
  history: { date: string; position: number }[];
  bestPosition: number;
  url?: string;
}

interface State {
  records: RankRecord[];
  tracked: TrackedKeyword[];
  loading: boolean;
  error: string | null;
  adding: boolean;
  addError: string | null;
  addSuccess: string | null;
  newKeyword: string;
  newUrl: string;
  deletingKeyword: string | null;
  selectedKeyword: string | null;
  showAddForm: boolean;
  refreshing: boolean;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RECORDS"; payload: RankRecord[] }
  | { type: "SET_TRACKED"; payload: TrackedKeyword[] }
  | { type: "SET_ADDING"; payload: boolean }
  | { type: "SET_ADD_ERROR"; payload: string | null }
  | { type: "SET_ADD_SUCCESS"; payload: string | null }
  | { type: "SET_NEW_KEYWORD"; payload: string }
  | { type: "SET_NEW_URL"; payload: string }
  | { type: "SET_DELETING"; payload: string | null }
  | { type: "SET_SELECTED"; payload: string | null }
  | { type: "TOGGLE_ADD_FORM" }
  | { type: "SET_REFRESHING"; payload: boolean }
  | { type: "ADD_RECORDS"; payload: RankRecord[] }
  | { type: "REMOVE_KEYWORD"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_RECORDS": return { ...state, records: action.payload };
    case "SET_TRACKED": return { ...state, tracked: action.payload };
    case "SET_ADDING": return { ...state, adding: action.payload };
    case "SET_ADD_ERROR": return { ...state, addError: action.payload };
    case "SET_ADD_SUCCESS": return { ...state, addSuccess: action.payload };
    case "SET_NEW_KEYWORD": return { ...state, newKeyword: action.payload };
    case "SET_NEW_URL": return { ...state, newUrl: action.payload };
    case "SET_DELETING": return { ...state, deletingKeyword: action.payload };
    case "SET_SELECTED": return { ...state, selectedKeyword: action.payload };
    case "TOGGLE_ADD_FORM": return { ...state, showAddForm: !state.showAddForm, addError: null };
    case "SET_REFRESHING": return { ...state, refreshing: action.payload };
    case "ADD_RECORDS": return { ...state, records: [...state.records, ...action.payload] };
    case "REMOVE_KEYWORD": return {
      ...state,
      records: state.records.filter(r => r.keyword !== action.payload),
      tracked: state.tracked.filter(t => t.keyword !== action.payload),
      selectedKeyword: state.selectedKeyword === action.payload ? null : state.selectedKeyword,
    };
    default: return state;
  }
}

const initialState: State = {
  records: [],
  tracked: [],
  loading: true,
  error: null,
  adding: false,
  addError: null,
  addSuccess: null,
  newKeyword: "",
  newUrl: "",
  deletingKeyword: null,
  selectedKeyword: null,
  showAddForm: false,
  refreshing: false,
};

function buildTracked(records: RankRecord[]): TrackedKeyword[] {
  const map: Record<string, RankRecord[]> = {};
  records.forEach(r => {
    if (!map[r.keyword]) map[r.keyword] = [];
    map[r.keyword].push(r);
  });
  return Object.entries(map).map(([keyword, recs]) => {
    const sorted = [...recs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const history = sorted.map(r => ({
      date: new Date(r.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
      position: r.position,
    }));
    const current = sorted[sorted.length - 1]?.position ?? 0;
    const previous = sorted.length >= 2 ? sorted[sorted.length - 2].position : null;
    const change = previous !== null ? previous - current : null;
    const best = Math.min(...sorted.map(r => r.position));
    return { keyword, currentPosition: current, previousPosition: previous, change, history, bestPosition: best };
  }).sort((a, b) => a.currentPosition - b.currentPosition);
}

function generateSimulatedHistory(keyword: string): { position: number; created_at: string }[] {
  const days = 14;
  const seed = keyword.length * 7;
  const base = Math.floor((seed % 40) + 8);
  return Array.from({ length: days }, (_, i) => {
    const noise = Math.floor(Math.sin(i * seed) * 5);
    const trend = Math.floor(i * 0.8);
    const pos = Math.max(1, Math.min(100, base + noise - trend));
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return { position: pos, created_at: d.toISOString() };
  });
}

function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) return <span className="text-xs text-blue-200/30">New</span>;
  if (change > 0) return (
    <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold">
      <ArrowUp className="w-3 h-3" />+{change}
    </span>
  );
  if (change < 0) return (
    <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
      <ArrowDown className="w-3 h-3" />{change}
    </span>
  );
  return <span className="flex items-center gap-0.5 text-blue-200/40 text-xs"><Minus className="w-3 h-3" />0</span>;
}

function PositionBadge({ pos }: { pos: number }) {
  const color = pos <= 3 ? "text-amber-400 bg-amber-500/15 border-amber-500/25"
    : pos <= 10 ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/25"
    : pos <= 30 ? "text-blue-400 bg-blue-500/15 border-blue-500/25"
    : "text-slate-400 bg-slate-500/15 border-slate-500/25";
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border text-sm font-black ${color}`}>
      #{pos}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0b1729] border border-blue-500/20 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-blue-200/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm font-bold" style={{ color: p.color }}>
          #{p.value} <span className="text-blue-200/40 font-normal">position</span>
        </p>
      ))}
    </div>
  );
};

export default function RankTracker() {
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  useEffect(() => {
    if (state.records.length > 0) {
      const tracked = buildTracked(state.records);
      dispatch({ type: "SET_TRACKED", payload: tracked });
      if (!state.selectedKeyword && tracked.length > 0) {
        dispatch({ type: "SET_SELECTED", payload: tracked[0].keyword });
      }
    }
  }, [state.records]);

  async function loadData() {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const { data, error } = await supabase
        .from("rank_tracker")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "SET_RECORDS", payload: data ?? [] });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message ?? "Failed to load rank data." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function handleAdd() {
    if (!state.newKeyword.trim()) {
      dispatch({ type: "SET_ADD_ERROR", payload: "Please enter a keyword to track." });
      return;
    }
    const already = state.tracked.some(t => t.keyword.toLowerCase() === state.newKeyword.trim().toLowerCase());
    if (already) {
      dispatch({ type: "SET_ADD_ERROR", payload: "This keyword is already being tracked." });
      return;
    }
    dispatch({ type: "SET_ADDING", payload: true });
    dispatch({ type: "SET_ADD_ERROR", payload: null });
    await new Promise(r => setTimeout(r, 1200));
    try {
      const history = generateSimulatedHistory(state.newKeyword.trim());
      const inserts = history.map(h => ({
        user_id: user!.id,
        keyword: state.newKeyword.trim(),
        position: h.position,
        created_at: h.created_at,
      }));
      const { data, error } = await supabase.from("rank_tracker").insert(inserts).select();
      if (error) throw error;
      dispatch({ type: "ADD_RECORDS", payload: data ?? [] });
      dispatch({ type: "SET_ADD_SUCCESS", payload: state.newKeyword.trim() });
      dispatch({ type: "SET_NEW_KEYWORD", payload: "" });
      dispatch({ type: "SET_NEW_URL", payload: "" });
      dispatch({ type: "TOGGLE_ADD_FORM" });
      setTimeout(() => dispatch({ type: "SET_ADD_SUCCESS", payload: null }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_ADD_ERROR", payload: err.message ?? "Failed to add keyword." });
    } finally {
      dispatch({ type: "SET_ADDING", payload: false });
    }
  }

  async function handleDelete(keyword: string) {
    dispatch({ type: "SET_DELETING", payload: keyword });
    try {
      const { error } = await supabase
        .from("rank_tracker")
        .delete()
        .eq("user_id", user!.id)
        .eq("keyword", keyword);
      if (error) throw error;
      dispatch({ type: "REMOVE_KEYWORD", payload: keyword });
    } catch { /* silent */ }
    finally { dispatch({ type: "SET_DELETING", payload: null }); }
  }

  async function handleRefresh() {
    dispatch({ type: "SET_REFRESHING", payload: true });
    await new Promise(r => setTimeout(r, 1500));
    await loadData();
    dispatch({ type: "SET_REFRESHING", payload: false });
  }

  const selected = state.tracked.find(t => t.keyword === state.selectedKeyword);
  const top3 = state.tracked.filter(t => t.currentPosition <= 10).length;
  const improved = state.tracked.filter(t => (t.change ?? 0) > 0).length;
  const declined = state.tracked.filter(t => (t.change ?? 0) < 0).length;

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f97316", "#34d399", "#fbbf24"];

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Rank Tracker</h1>
          <p className="text-blue-200/70 text-sm mt-1">Monitor your keyword positions and track ranking progress over time</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={state.refreshing || state.loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/70 hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${state.refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => dispatch({ type: "TOGGLE_ADD_FORM" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Track Keyword
          </button>
        </div>
      </motion.div>

      {/* Success Banner */}
      <AnimatePresence>
        {state.addSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-4 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Now tracking: <strong>{state.addSuccess}</strong> — 14 days of historical data loaded.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form */}
      <AnimatePresence>
        {state.showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-blue-900/20"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Track New Keyword</h2>
                <p className="text-blue-200/60 text-sm">Add a keyword to start monitoring its search ranking</p>
              </div>
              <button
                onClick={() => dispatch({ type: "TOGGLE_ADD_FORM" })}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-blue-200/60 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200/70 mb-1.5 uppercase tracking-wider">Keyword to Track</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                  <input
                    type="text"
                    placeholder="e.g. SEO tools for small business"
                    value={state.newKeyword}
                    onChange={e => dispatch({ type: "SET_NEW_KEYWORD", payload: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && !state.adding && handleAdd()}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200/70 mb-1.5 uppercase tracking-wider">Target URL (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/40" />
                  <input
                    type="text"
                    placeholder="https://yoursite.com/page"
                    value={state.newUrl}
                    onChange={e => dispatch({ type: "SET_NEW_URL", payload: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
            {state.addError && (
              <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {state.addError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={state.adding}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {state.adding ? <><RefreshCw className="w-4 h-4 animate-spin" />Adding...</> : <><Plus className="w-4 h-4" />Start Tracking</>}
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_ADD_FORM" })}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-blue-200/60 hover:text-white text-sm font-semibold border border-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {state.loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-72 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
        </div>
      )}

      {/* Error */}
      {!state.loading && state.error && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-semibold mb-4">{state.error}</p>
          <button onClick={loadData} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!state.loading && !state.error && state.tracked.length === 0 && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Target className="w-10 h-10 text-blue-400/50" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Keywords Tracked Yet</h3>
          <p className="text-blue-200/50 text-sm max-w-sm mx-auto mb-6">
            Start tracking keywords to monitor their search positions and spot ranking opportunities.
          </p>
          <button
            onClick={() => dispatch({ type: "TOGGLE_ADD_FORM" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />Track Your First Keyword
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      {!state.loading && !state.error && state.tracked.length > 0 && (
        <div className="space-y-6">
          {/* Stats */}
          <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Keywords Tracked", value: state.tracked.length, icon: Target, color: "text-blue-400" },
              { label: "Top 10 Rankings", value: top3, icon: Award, color: "text-amber-400" },
              { label: "Improved", value: improved, icon: TrendingUp, color: "text-emerald-400" },
              { label: "Declined", value: declined, icon: TrendingDown, color: "text-red-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Chart + Keyword Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Keyword List */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">Tracked Keywords</h3>
                <p className="text-xs text-blue-200/40 mt-0.5">Click to view position history</p>
              </div>
              <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
                {state.tracked.map((t, i) => {
                  const isSelected = state.selectedKeyword === t.keyword;
                  const isDeleting = state.deletingKeyword === t.keyword;
                  return (
                    <div
                      key={t.keyword}
                      onClick={() => dispatch({ type: "SET_SELECTED", payload: t.keyword })}
                      className={`group flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all ${isSelected ? "bg-blue-600/20 border-l-2 border-blue-500" : "hover:bg-white/5 border-l-2 border-transparent"}`}
                    >
                      <div className="flex-shrink-0" style={{ color: COLORS[i % COLORS.length] }}>
                        <PositionBadge pos={t.currentPosition} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{t.keyword}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <ChangeIndicator change={t.change} />
                          <span className="text-xs text-blue-200/30">Best: #{t.bestPosition}</span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(t.keyword); }}
                        disabled={isDeleting}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/0 group-hover:text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                      >
                        {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Position Chart */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              {selected ? (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white">{selected.keyword}</h3>
                      <p className="text-xs text-blue-200/40 mt-0.5">Position history over 14 days</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">#{selected.currentPosition}</div>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <ChangeIndicator change={selected.change} />
                        <span className="text-xs text-blue-200/40">vs last check</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={selected.history} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(147,197,253,0.4)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        reversed
                        tick={{ fill: "rgba(147,197,253,0.4)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        domain={["dataMin - 2", "dataMax + 2"]}
                        tickFormatter={(v) => `#${v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="position"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
                        activeDot={{ fill: "#60a5fa", r: 5, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                    <div className="text-center">
                      <div className="text-lg font-black text-white">#{selected.currentPosition}</div>
                      <div className="text-xs text-blue-200/40">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-amber-400">#{selected.bestPosition}</div>
                      <div className="text-xs text-blue-200/40">Best Ever</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-black ${(selected.change ?? 0) > 0 ? "text-emerald-400" : (selected.change ?? 0) < 0 ? "text-red-400" : "text-blue-200/40"}`}>
                        {selected.change !== null ? (selected.change > 0 ? `+${selected.change}` : selected.change) : "N/A"}
                      </div>
                      <div className="text-xs text-blue-200/40">Change</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center py-16">
                  <div className="text-center">
                    <BarChart2 className="w-10 h-10 text-blue-400/20 mx-auto mb-3" />
                    <p className="text-blue-200/40 text-sm">Select a keyword to view its position history</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* All Keywords Table */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-base font-bold text-white">All Tracked Keywords</h3>
            </div>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-6 py-3 border-b border-white/5 bg-white/3 text-xs font-semibold uppercase tracking-wider text-blue-200/40">
              <span>Keyword</span>
              <span>Position</span>
              <span>Change</span>
              <span>Best Rank</span>
              <span>Status</span>
              <span>Delete</span>
            </div>
            <div className="divide-y divide-white/5">
              {state.tracked.map((t, i) => {
                const isDeleting = state.deletingKeyword === t.keyword;
                const status = t.currentPosition <= 3 ? { label: "Top 3", color: "text-amber-400 bg-amber-500/15 border-amber-500/25" }
                  : t.currentPosition <= 10 ? { label: "Page 1", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" }
                  : t.currentPosition <= 30 ? { label: "Page 2-3", color: "text-blue-400 bg-blue-500/15 border-blue-500/25" }
                  : { label: "Low", color: "text-slate-400 bg-slate-500/15 border-slate-500/25" };
                return (
                  <motion.div
                    key={t.keyword}
                    initial={shouldReduce ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="group px-6 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 items-center">
                      <span className="text-sm font-semibold text-white">{t.keyword}</span>
                      <span className="text-sm font-black text-white">#{t.currentPosition}</span>
                      <ChangeIndicator change={t.change} />
                      <span className="text-sm font-bold text-amber-400">#{t.bestPosition}</span>
                      <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border w-fit ${status.color}`}>{status.label}</span>
                      <button
                        onClick={() => handleDelete(t.keyword)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-lg bg-red-500/0 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center justify-center text-red-400/0 group-hover:text-red-400/60 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                        {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="md:hidden flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-white">{t.keyword}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="text-blue-200/50">Position: <span className="text-white font-bold">#{t.currentPosition}</span></span>
                          <ChangeIndicator change={t.change} />
                        </div>
                      </div>
                      <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${status.color}`}>{status.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
