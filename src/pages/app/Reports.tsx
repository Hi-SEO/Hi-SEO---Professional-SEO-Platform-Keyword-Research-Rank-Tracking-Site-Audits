import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  FileText, Search, Filter, Trash2, RefreshCw, AlertCircle,
  BarChart2, Globe, Key, Link2, Target, Sparkles,
  Clock, Download, Eye, Plus, X, CheckCircle2,
  TrendingUp, Shield, PenTool, ChevronRight, FolderOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Report {
  id: string;
  user_id: string;
  title: string;
  report_type: string;
  data: any;
  created_at: string;
}

type FilterType = "all" | "site_audit" | "keyword" | "backlink" | "rank" | "competitor" | "ai_content" | "serp";

interface State {
  reports: Report[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterType: FilterType;
  sortDir: "desc" | "asc";
  deletingId: string | null;
  selectedIds: string[];
  bulkDeleting: boolean;
}

type Action =
  | { type: "SET_REPORTS"; payload: Report[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTER"; payload: FilterType }
  | { type: "SET_SORT_DIR"; payload: "desc" | "asc" }
  | { type: "SET_DELETING"; payload: string | null }
  | { type: "REMOVE_REPORT"; payload: string }
  | { type: "REMOVE_REPORTS"; payload: string[] }
  | { type: "TOGGLE_SELECT"; payload: string }
  | { type: "SELECT_ALL"; payload: string[] }
  | { type: "CLEAR_SELECT" }
  | { type: "SET_BULK_DELETING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_REPORTS": return { ...state, reports: action.payload };
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_SEARCH": return { ...state, searchQuery: action.payload };
    case "SET_FILTER": return { ...state, filterType: action.payload };
    case "SET_SORT_DIR": return { ...state, sortDir: action.payload };
    case "SET_DELETING": return { ...state, deletingId: action.payload };
    case "REMOVE_REPORT": return { ...state, reports: state.reports.filter(r => r.id !== action.payload) };
    case "REMOVE_REPORTS": return { ...state, reports: state.reports.filter(r => !action.payload.includes(r.id)) };
    case "TOGGLE_SELECT": return {
      ...state,
      selectedIds: state.selectedIds.includes(action.payload)
        ? state.selectedIds.filter(id => id !== action.payload)
        : [...state.selectedIds, action.payload],
    };
    case "SELECT_ALL": return { ...state, selectedIds: action.payload };
    case "CLEAR_SELECT": return { ...state, selectedIds: [] };
    case "SET_BULK_DELETING": return { ...state, bulkDeleting: action.payload };
    default: return state;
  }
}

const initialState: State = {
  reports: [],
  loading: true,
  error: null,
  searchQuery: "",
  filterType: "all",
  sortDir: "desc",
  deletingId: null,
  selectedIds: [],
  bulkDeleting: false,
};

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  site_audit: { label: "Site Audit", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/25", icon: Globe },
  keyword: { label: "Keywords", color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/25", icon: Key },
  backlink: { label: "Backlinks", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/25", icon: Link2 },
  rank: { label: "Rankings", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/25", icon: TrendingUp },
  competitor: { label: "Competitor", color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/25", icon: Target },
  ai_content: { label: "AI Content", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/25", icon: Sparkles },
  serp: { label: "SERP", color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/25", icon: BarChart2 },
  default: { label: "Report", color: "text-slate-400", bg: "bg-slate-500/15", border: "border-slate-500/25", icon: FileText },
};

function getTypeConfig(reportType: string) {
  return typeConfig[reportType] ?? typeConfig.default;
}

function getReportSummary(report: Report): string {
  const d = report.data;
  if (!d) return "No summary available.";
  if (report.report_type === "site_audit") {
    const score = d.score ?? d.data?.score ?? null;
    const issues = d.issues?.length ?? d.data?.issues?.length ?? 0;
    return score !== null ? `SEO Score: ${score}/100 - ${issues} issues found` : "Audit completed";
  }
  if (report.report_type === "ai_content") {
    const content = d.content ?? d;
    return `${content?.wordCount ?? "N/A"} words - SEO Score: ${content?.seoScore ?? "N/A"}/100`;
  }
  if (report.report_type === "keyword") {
    return `Keyword: ${d.keyword ?? "N/A"} - Volume: ${d.volume ?? "N/A"}`;
  }
  if (report.report_type === "backlink") {
    return `Source: ${d.source_url ?? "N/A"} - DA: ${d.authority ?? "N/A"}`;
  }
  return report.title ?? "Report generated";
}

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All Reports" },
  { key: "site_audit", label: "Site Audits" },
  { key: "ai_content", label: "AI Content" },
  { key: "keyword", label: "Keywords" },
  { key: "backlink", label: "Backlinks" },
  { key: "rank", label: "Rankings" },
  { key: "competitor", label: "Competitors" },
  { key: "serp", label: "SERP" },
];

export default function Reports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) return;
    loadReports();
  }, [user]);

  async function loadReports() {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      dispatch({ type: "SET_REPORTS", payload: data ?? [] });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message ?? "Failed to load reports." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function handleDelete(id: string) {
    dispatch({ type: "SET_DELETING", payload: id });
    try {
      const { error } = await supabase.from("reports").delete().eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
      dispatch({ type: "REMOVE_REPORT", payload: id });
    } catch { /* silent */ }
    finally { dispatch({ type: "SET_DELETING", payload: null }); }
  }

  async function handleBulkDelete() {
    if (state.selectedIds.length === 0) return;
    dispatch({ type: "SET_BULK_DELETING", payload: true });
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .in("id", state.selectedIds)
        .eq("user_id", user!.id);
      if (error) throw error;
      dispatch({ type: "REMOVE_REPORTS", payload: state.selectedIds });
      dispatch({ type: "CLEAR_SELECT" });
    } catch { /* silent */ }
    finally { dispatch({ type: "SET_BULK_DELETING", payload: false }); }
  }

  function handleExport(report: Report) {
    const blob = new Blob([JSON.stringify(report.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = state.reports
    .filter(r => {
      if (state.filterType !== "all" && r.report_type !== state.filterType) return false;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.report_type.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return state.sortDir === "desc" ? db - da : da - db;
    });

  const allFilteredIds = filtered.map(r => r.id);
  const allSelected = filtered.length > 0 && filtered.every(r => state.selectedIds.includes(r.id));

  const typeCounts = state.reports.reduce((acc, r) => {
    acc[r.report_type] = (acc[r.report_type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Reports</h1>
          <p className="text-blue-200/70 text-sm mt-1">View, manage, and export all your saved SEO reports</p>
        </div>
        <button onClick={loadReports}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/70 hover:text-white text-sm font-semibold transition-all self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Reports", value: state.reports.length, icon: FileText, color: "text-blue-400" },
          { label: "Site Audits", value: typeCounts["site_audit"] ?? 0, icon: Globe, color: "text-cyan-400" },
          { label: "AI Content", value: typeCounts["ai_content"] ?? 0, icon: Sparkles, color: "text-emerald-400" },
          { label: "This Month", value: state.reports.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length, icon: Clock, color: "text-amber-400" },
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-xl font-black text-white">{state.loading ? "--" : stat.value}</div>
              <div className="text-xs text-blue-200/50">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div {...fadeUp} className="flex flex-wrap gap-2 mb-5">
        {FILTER_OPTIONS.map(opt => {
          const count = opt.key === "all" ? state.reports.length : (typeCounts[opt.key] ?? 0);
          return (
            <button key={opt.key} onClick={() => dispatch({ type: "SET_FILTER", payload: opt.key })}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                state.filterType === opt.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white/5 text-blue-200/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}>
              {opt.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${state.filterType === opt.key ? "bg-white/20 text-white" : "bg-white/10 text-blue-200/60"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Search + Sort + Bulk */}
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/40" />
          <input
            type="text"
            placeholder="Search reports..."
            value={state.searchQuery}
            onChange={e => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {state.searchQuery && (
            <button onClick={() => dispatch({ type: "SET_SEARCH", payload: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => dispatch({ type: "SET_SORT_DIR", payload: state.sortDir === "desc" ? "asc" : "desc" })}
            className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-blue-200/60 hover:text-white text-sm font-semibold transition-all hover:bg-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {state.sortDir === "desc" ? "Newest First" : "Oldest First"}
          </button>
          {state.selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} disabled={state.bulkDeleting}
              className="h-11 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-60">
              {state.bulkDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete ({state.selectedIds.length})
            </button>
          )}
        </div>
      </motion.div>

      {/* Loading */}
      {state.loading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {!state.loading && state.error && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-semibold mb-4">{state.error}</p>
          <button onClick={loadReports}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!state.loading && !state.error && filtered.length === 0 && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <FolderOpen className="w-10 h-10 text-blue-400/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {state.searchQuery || state.filterType !== "all" ? "No reports match your filters" : "No Reports Yet"}
          </h3>
          <p className="text-blue-200/50 text-sm max-w-sm mx-auto mb-6">
            {state.searchQuery || state.filterType !== "all"
              ? "Try adjusting your search or filter to find what you are looking for."
              : "Reports are automatically saved when you run site audits, keyword research, AI content generation, and other tools."}
          </p>
          {(state.searchQuery || state.filterType !== "all") && (
            <button onClick={() => { dispatch({ type: "SET_SEARCH", payload: "" }); dispatch({ type: "SET_FILTER", payload: "all" }); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all">
              <X className="w-4 h-4" />Clear Filters
            </button>
          )}
          {!state.searchQuery && state.filterType === "all" && (
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {[
                { label: "Run a Site Audit", href: "/app/site-audit", icon: Globe },
                { label: "Use AI Writer", href: "/app/ai-writer", icon: Sparkles },
                { label: "Explore Keywords", href: "/app/keyword-explorer", icon: Key },
              ].map(item => (
                <a key={item.label} href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-200/60 hover:text-white hover:border-blue-500/30 transition-all">
                  <item.icon className="w-3.5 h-3.5 text-blue-400" />{item.label}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Reports List */}
      {!state.loading && !state.error && filtered.length > 0 && (
        <div className="space-y-3">
          {/* Select All Bar */}
          <div className="flex items-center gap-3 px-2">
            <button onClick={() => allSelected ? dispatch({ type: "CLEAR_SELECT" }) : dispatch({ type: "SELECT_ALL", payload: allFilteredIds })}
              className="flex items-center gap-2 text-xs text-blue-200/50 hover:text-white transition-colors">
              <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${allSelected ? "bg-blue-600 border-blue-600" : "border-white/20 bg-white/5"}`}>
                {allSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              {allSelected ? "Deselect All" : "Select All"}
            </button>
            <span className="text-xs text-blue-200/30">{filtered.length} report{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {filtered.map((report, i) => {
            const cfg = getTypeConfig(report.report_type);
            const isDeleting = state.deletingId === report.id;
            const isSelected = state.selectedIds.includes(report.id);
            const summary = getReportSummary(report);

            return (
              <motion.div key={report.id}
                initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`group bg-white/5 border rounded-2xl p-5 hover:bg-white/8 transition-all backdrop-blur-sm ${
                  isSelected ? "border-blue-500/40 bg-blue-500/5" : "border-white/10 hover:border-blue-500/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button onClick={() => dispatch({ type: "TOGGLE_SELECT", payload: report.id })}
                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-blue-600 border-blue-600" : "border-white/20 bg-white/5 group-hover:border-white/40"}`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.border}`}>
                    <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white truncate leading-snug">{report.title}</h3>
                        <p className="text-xs text-blue-200/40 mt-1 truncate">{summary}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => handleExport(report)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-blue-200/40 hover:text-white transition-all"
                          title="Export JSON">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => navigate(`/app/reports/${report.id}`)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all"
                          title="View report">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(report.id)} disabled={isDeleting}
                          className="w-8 h-8 rounded-lg bg-white/0 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center justify-center text-red-400/0 group-hover:text-red-400/50 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete report">
                          {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                      <span className="text-xs text-blue-200/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button onClick={() => navigate(`/app/reports/${report.id}`)}
                        className="ml-auto text-xs text-blue-400/60 hover:text-blue-400 transition-colors flex items-center gap-1 font-semibold">
                        View Full Report <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
