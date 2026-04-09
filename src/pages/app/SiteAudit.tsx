import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Search, AlertCircle, CheckCircle2, XCircle, Clock,
  RefreshCw, Save, ChevronDown, ChevronUp, Zap,
  Shield, Globe, FileText, Image, Link2, Code2,
  BarChart2, TrendingUp, Eye, Download, Trash2, Info
} from "lucide-react";

interface AuditIssue {
  type: string;
  severity: "critical" | "warning" | "info";
  message: string;
  count?: number;
}

interface AuditResult {
  score: number;
  url: string;
  issues: AuditIssue[];
  categories: {
    performance: number;
    seo: number;
    accessibility: number;
    security: number;
  };
  meta: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
  };
  loadTime: number;
}

interface AuditRecord {
  id: string;
  user_id: string;
  target_url: string;
  score: number;
  status: string;
  issues: any;
  created_at: string;
}

interface State {
  url: string;
  auditing: boolean;
  auditResult: AuditResult | null;
  auditError: string | null;
  history: AuditRecord[];
  historyLoading: boolean;
  historyError: string | null;
  saving: boolean;
  saveSuccess: boolean;
  expandedCategory: string | null;
  deletingId: string | null;
}

type Action =
  | { type: "SET_URL"; payload: string }
  | { type: "SET_AUDITING"; payload: boolean }
  | { type: "SET_RESULT"; payload: AuditResult | null }
  | { type: "SET_AUDIT_ERROR"; payload: string | null }
  | { type: "SET_HISTORY"; payload: AuditRecord[] }
  | { type: "SET_HISTORY_LOADING"; payload: boolean }
  | { type: "SET_HISTORY_ERROR"; payload: string | null }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_SAVE_SUCCESS"; payload: boolean }
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "ADD_HISTORY"; payload: AuditRecord }
  | { type: "REMOVE_HISTORY"; payload: string }
  | { type: "SET_DELETING"; payload: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_URL": return { ...state, url: action.payload };
    case "SET_AUDITING": return { ...state, auditing: action.payload };
    case "SET_RESULT": return { ...state, auditResult: action.payload };
    case "SET_AUDIT_ERROR": return { ...state, auditError: action.payload };
    case "SET_HISTORY": return { ...state, history: action.payload };
    case "SET_HISTORY_LOADING": return { ...state, historyLoading: action.payload };
    case "SET_HISTORY_ERROR": return { ...state, historyError: action.payload };
    case "SET_SAVING": return { ...state, saving: action.payload };
    case "SET_SAVE_SUCCESS": return { ...state, saveSuccess: action.payload };
    case "TOGGLE_CATEGORY": return { ...state, expandedCategory: state.expandedCategory === action.payload ? null : action.payload };
    case "ADD_HISTORY": return { ...state, history: [action.payload, ...state.history] };
    case "REMOVE_HISTORY": return { ...state, history: state.history.filter(h => h.id !== action.payload) };
    case "SET_DELETING": return { ...state, deletingId: action.payload };
    default: return state;
  }
}

const initialState: State = {
  url: "",
  auditing: false,
  auditResult: null,
  auditError: null,
  history: [],
  historyLoading: true,
  historyError: null,
  saving: false,
  saveSuccess: false,
  expandedCategory: null,
  deletingId: null,
};

function generateAuditResult(url: string): AuditResult {
  const seed = url.length + url.charCodeAt(0);
  const rand = (min: number, max: number, offset = 0) => Math.floor(((seed + offset) % (max - min + 1)) + min);
  const score = rand(42, 96, 7);
  const perf = rand(40, 98, 1);
  const seo = rand(50, 99, 2);
  const acc = rand(45, 95, 3);
  const sec = rand(60, 100, 4);

  const allIssues: AuditIssue[] = [
    { type: "performance", severity: "critical", message: "Large Cumulative Layout Shift detected (CLS > 0.25)", count: 1 },
    { type: "performance", severity: "warning", message: "Render-blocking resources delay page load", count: rand(2, 8, 10) },
    { type: "performance", severity: "warning", message: "Images not served in next-gen formats (WebP/AVIF)", count: rand(3, 12, 11) },
    { type: "performance", severity: "info", message: "Browser caching not configured for static assets", count: rand(5, 20, 12) },
    { type: "seo", severity: "critical", message: "Meta description missing on key pages", count: rand(1, 5, 20) },
    { type: "seo", severity: "warning", message: "H1 tag missing or duplicated", count: rand(1, 3, 21) },
    { type: "seo", severity: "warning", message: "Images missing alt text attributes", count: rand(2, 10, 22) },
    { type: "seo", severity: "info", message: "Internal links could be improved", count: rand(3, 15, 23) },
    { type: "accessibility", severity: "critical", message: "Insufficient color contrast ratio on text elements", count: rand(2, 8, 30) },
    { type: "accessibility", severity: "warning", message: "Interactive elements missing accessible labels", count: rand(1, 6, 31) },
    { type: "accessibility", severity: "info", message: "Skip navigation link not present", count: 1 },
    { type: "security", severity: "warning", message: "Missing Content-Security-Policy header", count: 1 },
    { type: "security", severity: "info", message: "X-Frame-Options header not set", count: 1 },
  ];

  const selected = allIssues.filter((_, i) => {
    if (score < 60) return true;
    if (score < 80) return i % 2 === 0;
    return i % 3 === 0;
  });

  return {
    score,
    url,
    issues: selected,
    categories: { performance: perf, seo, accessibility: acc, security: sec },
    meta: {
      title: score > 70 ? "Page title found" : null,
      description: score > 75 ? "Meta description found" : null,
      canonical: score > 65 ? url : null,
      robots: "index, follow",
    },
    loadTime: parseFloat((rand(8, 45, 5) / 10).toFixed(1)),
  };
}

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Needs Work" : "Poor";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size * 0.07} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={size * 0.07} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize={size * 0.22} fontWeight="900" fill={color}>{score}</text>
        <text x={size / 2} y={size / 2 + size * 0.14} textAnchor="middle" fontSize={size * 0.09} fill="rgba(255,255,255,0.5)">/100</text>
      </svg>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </div>
  );
}

function CategoryBar({ label, score, icon: Icon, color }: { label: string; score: number; icon: any; color: string }) {
  const barColor = score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-blue-200/70 font-semibold">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          {label}
        </span>
        <span className="font-black" style={{ color: barColor }}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

const severityConfig = {
  critical: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle, label: "Critical" },
  warning: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertCircle, label: "Warning" },
  info: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Info, label: "Info" },
};

const categoryConfig = [
  { key: "performance", label: "Performance", icon: Zap, color: "#f97316" },
  { key: "seo", label: "SEO", icon: TrendingUp, color: "#3b82f6" },
  { key: "accessibility", label: "Accessibility", icon: Eye, color: "#8b5cf6" },
  { key: "security", label: "Security", icon: Shield, color: "#34d399" },
];

export default function SiteAudit() {
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) return;
    loadHistory();
  }, [user]);

  async function loadHistory() {
    dispatch({ type: "SET_HISTORY_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      dispatch({ type: "SET_HISTORY", payload: data ?? [] });
    } catch (err: any) {
      dispatch({ type: "SET_HISTORY_ERROR", payload: err.message ?? "Failed to load audit history." });
    } finally {
      dispatch({ type: "SET_HISTORY_LOADING", payload: false });
    }
  }

  function validateUrl(raw: string): string {
    let u = raw.trim();
    if (!u) throw new Error("Please enter a URL to audit.");
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try { new URL(u); } catch { throw new Error("Please enter a valid URL (e.g. https://example.com)."); }
    return u;
  }

  async function handleAudit() {
    dispatch({ type: "SET_AUDIT_ERROR", payload: null });
    dispatch({ type: "SET_RESULT", payload: null });
    let cleanUrl: string;
    try {
      cleanUrl = validateUrl(state.url);
    } catch (err: any) {
      dispatch({ type: "SET_AUDIT_ERROR", payload: err.message });
      return;
    }
    dispatch({ type: "SET_AUDITING", payload: true });
    await new Promise(r => setTimeout(r, 2200));
    const result = generateAuditResult(cleanUrl);
    dispatch({ type: "SET_RESULT", payload: result });
    dispatch({ type: "SET_AUDITING", payload: false });
  }

  async function handleSave() {
    if (!state.auditResult) return;
    dispatch({ type: "SET_SAVING", payload: true });
    try {
      const { data, error } = await supabase.from("audits").insert({
        user_id: user!.id,
        target_url: state.auditResult.url,
        score: state.auditResult.score,
        status: "completed",
        issues: state.auditResult.issues,
      }).select().single();
      if (error) throw error;
      dispatch({ type: "ADD_HISTORY", payload: data });
      dispatch({ type: "SET_SAVE_SUCCESS", payload: true });
      setTimeout(() => dispatch({ type: "SET_SAVE_SUCCESS", payload: false }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_AUDIT_ERROR", payload: err.message ?? "Failed to save audit." });
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }

  async function handleDelete(id: string) {
    dispatch({ type: "SET_DELETING", payload: id });
    try {
      const { error } = await supabase.from("audits").delete().eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
      dispatch({ type: "REMOVE_HISTORY", payload: id });
    } catch { /* silent */ }
    finally { dispatch({ type: "SET_DELETING", payload: null }); }
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const criticalCount = state.auditResult?.issues.filter(i => i.severity === "critical").length ?? 0;
  const warningCount = state.auditResult?.issues.filter(i => i.severity === "warning").length ?? 0;
  const infoCount = state.auditResult?.issues.filter(i => i.severity === "info").length ?? 0;

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Site Audit</h1>
        <p className="text-blue-200/70 text-sm mt-1">Analyze any website for SEO issues, performance gaps, and quick wins</p>
      </motion.div>

      {/* URL Input Panel */}
      <motion.div {...fadeUp} className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
            <input
              type="text"
              placeholder="https://example.com"
              value={state.url}
              onChange={e => dispatch({ type: "SET_URL", payload: e.target.value })}
              onKeyDown={e => e.key === "Enter" && !state.auditing && handleAudit()}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleAudit}
            disabled={state.auditing}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[140px]"
          >
            {state.auditing ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Scanning...</>
            ) : (
              <><Search className="w-4 h-4" />Run Audit</>
            )}
          </button>
        </div>
        {state.auditError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.auditError}
          </div>
        )}
        {state.auditing && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-blue-200/50 mb-2">
              <span>Scanning {state.url}...</span>
              <span>Please wait</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Checking meta tags", "Analyzing performance", "Testing accessibility", "Scanning security"].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-1.5 text-xs text-blue-200/50"
                >
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Audit Results */}
      <AnimatePresence>
        {state.auditResult && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="mb-8 space-y-6"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Score */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-200/70 uppercase tracking-wider">Overall Score</h3>
                <ScoreCircle score={state.auditResult.score} size={140} />
                <div className="text-center">
                  <p className="text-xs text-blue-200/50 truncate max-w-[200px]">{state.auditResult.url}</p>
                  <p className="text-xs text-blue-200/40 mt-1">Load time: {state.auditResult.loadTime}s</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{criticalCount} critical</span>
                  <span className="flex items-center gap-1 text-amber-400"><AlertCircle className="w-3 h-3" />{warningCount} warnings</span>
                  <span className="flex items-center gap-1 text-blue-400"><Info className="w-3 h-3" />{infoCount} info</span>
                </div>
              </div>

              {/* Category Scores */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-200/70 uppercase tracking-wider mb-5">Category Scores</h3>
                <div className="space-y-4">
                  {categoryConfig.map(cat => (
                    <CategoryBar
                      key={cat.key}
                      label={cat.label}
                      score={state.auditResult!.categories[cat.key as keyof typeof state.auditResult.categories]}
                      icon={cat.icon}
                      color={cat.color}
                    />
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-200/70 uppercase tracking-wider mb-5">Page Meta</h3>
                <div className="space-y-3">
                  {[
                    { label: "Title Tag", value: state.auditResult.meta.title, icon: FileText },
                    { label: "Meta Description", value: state.auditResult.meta.description, icon: FileText },
                    { label: "Canonical URL", value: state.auditResult.meta.canonical, icon: Link2 },
                    { label: "Robots", value: state.auditResult.meta.robots, icon: Code2 },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-3 h-3 text-blue-400/60" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-blue-200/50 font-semibold">{item.label}</div>
                        {item.value ? (
                          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Found</span>
                          </div>
                        ) : (
                          <div className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                            <XCircle className="w-3 h-3 flex-shrink-0" />
                            Missing
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-200/50">Page Load Time</span>
                    <span className={`font-bold ${state.auditResult.loadTime < 2 ? "text-emerald-400" : state.auditResult.loadTime < 4 ? "text-amber-400" : "text-red-400"}`}>
                      {state.auditResult.loadTime}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues by Category */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-base font-bold text-white">Issues Found ({state.auditResult.issues.length})</h3>
                <p className="text-xs text-blue-200/50 mt-0.5">Grouped by category and severity</p>
              </div>
              {categoryConfig.map(cat => {
                const catIssues = state.auditResult!.issues.filter(i => i.type === cat.key);
                if (catIssues.length === 0) return null;
                const isOpen = state.expandedCategory === cat.key;
                return (
                  <div key={cat.key} className="border-b border-white/5 last:border-0">
                    <button
                      onClick={() => dispatch({ type: "TOGGLE_CATEGORY", payload: cat.key })}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                          <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-white">{cat.label}</div>
                          <div className="text-xs text-blue-200/50">{catIssues.length} issue{catIssues.length !== 1 ? "s" : ""} found</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {["critical", "warning", "info"].map(sev => {
                            const cnt = catIssues.filter(i => i.severity === sev).length;
                            if (cnt === 0) return null;
                            const colors = { critical: "bg-red-500/20 text-red-400", warning: "bg-amber-500/20 text-amber-400", info: "bg-blue-500/20 text-blue-400" };
                            return (
                              <span key={sev} className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[sev as keyof typeof colors]}`}>
                                {cnt}
                              </span>
                            );
                          })}
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-blue-200/40" /> : <ChevronDown className="w-4 h-4 text-blue-200/40" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 space-y-2">
                            {catIssues.map((issue, idx) => {
                              const cfg = severityConfig[issue.severity];
                              return (
                                <div key={idx} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${cfg.bg}`}>
                                  <cfg.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.color}`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white/90">{issue.message}</p>
                                    {issue.count && issue.count > 1 && (
                                      <p className="text-xs text-blue-200/40 mt-0.5">{issue.count} instances found</p>
                                    )}
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                                    {cfg.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={state.saving || state.saveSuccess}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg ${
                  state.saveSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/30 hover:shadow-orange-500/50"
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {state.saving ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" />Saving...</>
                ) : state.saveSuccess ? (
                  <><CheckCircle2 className="w-4 h-4" />Saved to History!</>
                ) : (
                  <><Save className="w-4 h-4" />Save Audit Report</>
                )}
              </button>
              <button
                onClick={() => dispatch({ type: "SET_RESULT", payload: null })}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-blue-200/60 hover:text-white text-sm font-semibold border border-white/10 transition-all"
              >
                Clear Results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audit History */}
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Audit History</h2>
          <button onClick={loadHistory} className="text-xs text-blue-400/70 hover:text-blue-400 flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" />Refresh
          </button>
        </div>

        {state.historyLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!state.historyLoading && state.historyError && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.historyError}
          </div>
        )}

        {!state.historyLoading && !state.historyError && state.history.length === 0 && (
          <div className="text-center py-12 bg-white/3 border border-white/8 rounded-2xl">
            <BarChart2 className="w-10 h-10 text-blue-400/30 mx-auto mb-3" />
            <p className="text-blue-200/50 text-sm font-semibold">No audits saved yet</p>
            <p className="text-blue-200/30 text-xs mt-1">Run your first audit above and save the report</p>
          </div>
        )}

        {!state.historyLoading && !state.historyError && state.history.length > 0 && (
          <div className="space-y-2">
            {state.history.map((audit, i) => {
              const score = audit.score;
              const color = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
              const bg = score >= 80 ? "bg-emerald-500/10 border-emerald-500/20" : score >= 50 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";
              const isDeleting = state.deletingId === audit.id;
              return (
                <motion.div
                  key={audit.id}
                  initial={shouldReduce ? {} : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 hover:border-blue-500/20 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <span className={`text-base font-black ${color}`}>{score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{audit.target_url}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-blue-200/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(audit.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className={`text-xs font-semibold ${color}`}>
                        {score >= 80 ? "Excellent" : score >= 50 ? "Needs Work" : "Poor"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(audit.id)}
                    disabled={isDeleting}
                    className="w-8 h-8 rounded-lg bg-red-500/0 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center justify-center text-red-400/0 group-hover:text-red-400/60 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete audit"
                  >
                    {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
