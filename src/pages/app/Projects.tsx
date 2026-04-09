import { useState, useEffect, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Plus, Search, Globe, Trash2, ExternalLink, FolderOpen,
  Calendar, BarChart2, AlertCircle, CheckCircle2, Clock,
  Filter, X, TrendingUp, Shield, Zap, RefreshCw
} from "lucide-react";

interface Project {
  id: string;
  user_id: string;
  name: string;
  domain: string;
  created_at: string;
}

interface AuditSummary {
  project_domain: string;
  score: number | null;
  status: string | null;
}

type FilterType = "all" | "recent" | "alphabetical";

interface State {
  projects: Project[];
  auditMap: Record<string, AuditSummary>;
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  deleting: string | null;
  searchQuery: string;
  filter: FilterType;
  showCreatePanel: boolean;
  newName: string;
  newDomain: string;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DATA"; payload: { projects: Project[]; auditMap: Record<string, AuditSummary> } }
  | { type: "SET_CREATING"; payload: boolean }
  | { type: "SET_CREATE_ERROR"; payload: string | null }
  | { type: "SET_DELETING"; payload: string | null }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTER"; payload: FilterType }
  | { type: "TOGGLE_CREATE_PANEL" }
  | { type: "SET_NEW_NAME"; payload: string }
  | { type: "SET_NEW_DOMAIN"; payload: string }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "REMOVE_PROJECT"; payload: string }
  | { type: "RESET_FORM" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_DATA": return { ...state, projects: action.payload.projects, auditMap: action.payload.auditMap, loading: false };
    case "SET_CREATING": return { ...state, creating: action.payload };
    case "SET_CREATE_ERROR": return { ...state, createError: action.payload };
    case "SET_DELETING": return { ...state, deleting: action.payload };
    case "SET_SEARCH": return { ...state, searchQuery: action.payload };
    case "SET_FILTER": return { ...state, filter: action.payload };
    case "TOGGLE_CREATE_PANEL": return { ...state, showCreatePanel: !state.showCreatePanel, createError: null };
    case "SET_NEW_NAME": return { ...state, newName: action.payload };
    case "SET_NEW_DOMAIN": return { ...state, newDomain: action.payload };
    case "ADD_PROJECT": return { ...state, projects: [action.payload, ...state.projects] };
    case "REMOVE_PROJECT": return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case "RESET_FORM": return { ...state, newName: "", newDomain: "", createError: null, showCreatePanel: false };
    default: return state;
  }
}

const initialState: State = {
  projects: [],
  auditMap: {},
  loading: true,
  error: null,
  creating: false,
  createError: null,
  deleting: null,
  searchQuery: "",
  filter: "all",
  showCreatePanel: false,
  newName: "",
  newDomain: "",
};

function scoreColor(score: number | null): string {
  if (score === null) return "text-slate-400";
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number | null): string {
  if (score === null) return "bg-slate-700";
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 50) return "bg-amber-500/20 border-amber-500/30";
  return "bg-red-500/20 border-red-500/30";
}

function ScoreRing({ score }: { score: number | null }) {
  const pct = score ?? 0;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
      <circle
        cx="28" cy="28" r={r} fill="none"
        stroke={score === null ? "#475569" : score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"}
        strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700"
        fill={score === null ? "#94a3b8" : score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"}>
        {score !== null ? score : "--"}
      </text>
    </svg>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const [projectsRes, auditsRes] = await Promise.all([
        supabase.from("projects").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("audits").select("target_url, score, status").eq("user_id", user!.id).order("created_at", { ascending: false }),
      ]);
      if (projectsRes.error) throw projectsRes.error;
      const auditMap: Record<string, AuditSummary> = {};
      (auditsRes.data ?? []).forEach((a: any) => {
        try {
          const domain = new URL(a.target_url).hostname.replace("www.", "");
          if (!auditMap[domain]) auditMap[domain] = { project_domain: domain, score: a.score, status: a.status };
        } catch { /* skip invalid urls */ }
      });
      dispatch({ type: "SET_DATA", payload: { projects: projectsRes.data ?? [], auditMap } });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message ?? "Failed to load projects." });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  async function handleCreate() {
    if (!state.newName.trim()) { dispatch({ type: "SET_CREATE_ERROR", payload: "Project name is required." }); return; }
    if (!state.newDomain.trim()) { dispatch({ type: "SET_CREATE_ERROR", payload: "Domain is required." }); return; }
    let domain = state.newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    dispatch({ type: "SET_CREATING", payload: true });
    dispatch({ type: "SET_CREATE_ERROR", payload: null });
    try {
      const { data, error } = await supabase.from("projects").insert({
        user_id: user!.id,
        name: state.newName.trim(),
        domain,
      }).select().single();
      if (error) throw error;
      dispatch({ type: "ADD_PROJECT", payload: data });
      dispatch({ type: "RESET_FORM" });
    } catch (err: any) {
      dispatch({ type: "SET_CREATE_ERROR", payload: err.message ?? "Failed to create project." });
    } finally {
      dispatch({ type: "SET_CREATING", payload: false });
    }
  }

  async function handleDelete(id: string) {
    dispatch({ type: "SET_DELETING", payload: id });
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id).eq("user_id", user!.id);
      if (error) throw error;
      dispatch({ type: "REMOVE_PROJECT", payload: id });
    } catch { /* silently fail */ }
    finally { dispatch({ type: "SET_DELETING", payload: null }); }
  }

  const filtered = state.projects
    .filter(p =>
      p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(state.searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (state.filter === "alphabetical") return a.name.localeCompare(b.name);
      return 0;
    });

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
  const stagger = (i: number) => shouldReduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.07 } };

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Projects</h1>
          <p className="text-blue-200/70 text-sm mt-1">Manage your SEO projects and track domain performance</p>
        </div>
        <button
          onClick={() => dispatch({ type: "TOGGLE_CREATE_PANEL" })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: state.projects.length, icon: FolderOpen, color: "text-blue-400" },
          { label: "Audited", value: Object.keys(state.auditMap).length, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "High Score", value: state.projects.filter(p => (state.auditMap[p.domain]?.score ?? 0) >= 80).length, icon: TrendingUp, color: "text-cyan-400" },
          { label: "Need Attention", value: state.projects.filter(p => { const s = state.auditMap[p.domain]?.score; return s !== null && s !== undefined && s < 50; }).length, icon: AlertCircle, color: "text-amber-400" },
        ].map((stat, i) => (
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

      {/* Create Panel */}
      <AnimatePresence>
        {state.showCreatePanel && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-gradient-to-br from-blue-900/60 to-[#0b1729] border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-blue-900/30"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Create New Project</h2>
                <p className="text-blue-200/60 text-sm">Add a domain to start tracking SEO performance</p>
              </div>
              <button onClick={() => dispatch({ type: "TOGGLE_CREATE_PANEL" })} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-blue-200/60 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200/70 mb-1.5 uppercase tracking-wider">Project Name</label>
                <input
                  type="text"
                  placeholder="My Website"
                  value={state.newName}
                  onChange={e => dispatch({ type: "SET_NEW_NAME", payload: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200/70 mb-1.5 uppercase tracking-wider">Domain</label>
                <input
                  type="text"
                  placeholder="example.com"
                  value={state.newDomain}
                  onChange={e => dispatch({ type: "SET_NEW_DOMAIN", payload: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
            {state.createError && (
              <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {state.createError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={state.creating}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
              >
                {state.creating ? <><RefreshCw className="w-4 h-4 animate-spin" />Creating...</> : <><Plus className="w-4 h-4" />Create Project</>}
              </button>
              <button
                onClick={() => dispatch({ type: "RESET_FORM" })}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-blue-200/70 hover:text-white font-semibold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter */}
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/40" />
          <input
            type="text"
            placeholder="Search projects..."
            value={state.searchQuery}
            onChange={e => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "recent", "alphabetical"] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                state.filter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white/5 text-blue-200/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {state.loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
                <div className="w-14 h-14 bg-white/5 rounded-full" />
              </div>
              <div className="h-3 bg-white/5 rounded w-full mb-2" />
              <div className="h-8 bg-white/5 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!state.loading && state.error && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 font-semibold mb-2">Failed to load projects</p>
          <p className="text-blue-200/50 text-sm mb-4">{state.error}</p>
          <button onClick={loadData} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!state.loading && !state.error && filtered.length === 0 && (
        <motion.div {...fadeUp} className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <FolderOpen className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {state.searchQuery ? "No projects match your search" : "No projects yet"}
          </h3>
          <p className="text-blue-200/50 text-sm mb-6 max-w-sm mx-auto">
            {state.searchQuery ? "Try a different search term or clear the filter." : "Create your first project to start tracking SEO performance for your domains."}
          </p>
          {!state.searchQuery && (
            <button
              onClick={() => dispatch({ type: "TOGGLE_CREATE_PANEL" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </button>
          )}
        </motion.div>
      )}

      {/* Project Grid */}
      {!state.loading && !state.error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const audit = state.auditMap[project.domain];
            const score = audit?.score ?? null;
            const isDeleting = state.deleting === project.id;
            return (
              <motion.div key={project.id} {...stagger(i)}>
                <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/8 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30 hover:border-blue-500/30 transition-all duration-300 cursor-default">
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/60 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{project.name}</h3>
                      <a
                        href={`https://${project.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors flex items-center gap-1 truncate"
                      >
                        {project.domain}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                    <div className="flex-shrink-0">
                      <ScoreRing score={score} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-4">
                    {score !== null ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${scoreBg(score)} ${scoreColor(score)}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {score >= 80 ? "Excellent" : score >= 50 ? "Needs Work" : "Critical Issues"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700/50 border border-slate-600/30 text-slate-400">
                        <Clock className="w-3 h-3" />
                        Not audited
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-200/40 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {score !== null && (
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-3 h-3" />
                        Score: {score}/100
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/app/site-audit?domain=${project.domain}`}
                      className="flex-1 text-center px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 text-xs font-semibold border border-blue-500/20 transition-all duration-200"
                    >
                      Run Audit
                    </a>
                    <a
                      href={`/app/site-explorer?domain=${project.domain}`}
                      className="flex-1 text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-blue-200/70 hover:text-white text-xs font-semibold border border-white/10 transition-all duration-200"
                    >
                      Explore
                    </a>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={isDeleting}
                      className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400/70 hover:text-red-400 transition-all duration-200 flex-shrink-0"
                      title="Delete project"
                    >
                      {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA for free users */}
      {!state.loading && state.projects.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Need more projects?</h3>
              <p className="text-blue-200/60 text-xs">Upgrade to Pro for unlimited projects and advanced analytics.</p>
            </div>
          </div>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105 whitespace-nowrap"
          >
            <Shield className="w-4 h-4" />
            Upgrade Plan
          </a>
        </motion.div>
      )}
    </div>
  );
}
