import { useState, useReducer } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Plus, Search, FileText, Target, TrendingUp, BarChart2,
  RefreshCw, AlertCircle, Trash2, CheckCircle2, X,
  Lightbulb, Calendar, Tag, ArrowRight, Zap, Globe,
  BookOpen, PenTool, Layout, Hash, Star, Clock,
  ChevronDown, ChevronUp, Filter, Download, Copy
} from "lucide-react";

interface ContentTopic {
  id: string;
  title: string;
  keyword: string;
  volume: number;
  difficulty: number;
  intent: "informational" | "commercial" | "transactional";
  contentType: "blog" | "guide" | "landing" | "video" | "infographic";
  priority: "high" | "medium" | "low";
  status: "idea" | "planned" | "writing" | "published";
  wordCount: number;
  estimatedTraffic: number;
  pillar: string;
}

interface ContentPillar {
  id: string;
  name: string;
  description: string;
  topicCount: number;
  color: string;
  icon: any;
}

interface State {
  keyword: string;
  generating: boolean;
  topics: ContentTopic[];
  error: string | null;
  hasGenerated: boolean;
  activeTab: "topics" | "calendar" | "pillars";
  filterStatus: string;
  filterPriority: string;
  filterPillar: string;
  expandedTopic: string | null;
  copiedId: string | null;
}

type Action =
  | { type: "SET_KEYWORD"; payload: string }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "SET_TOPICS"; payload: ContentTopic[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_HAS_GENERATED"; payload: boolean }
  | { type: "SET_TAB"; payload: State["activeTab"] }
  | { type: "SET_FILTER_STATUS"; payload: string }
  | { type: "SET_FILTER_PRIORITY"; payload: string }
  | { type: "SET_FILTER_PILLAR"; payload: string }
  | { type: "TOGGLE_TOPIC"; payload: string }
  | { type: "SET_COPIED"; payload: string | null }
  | { type: "UPDATE_STATUS"; payload: { id: string; status: ContentTopic["status"] } }
  | { type: "UPDATE_PRIORITY"; payload: { id: string; priority: ContentTopic["priority"] } }
  | { type: "REMOVE_TOPIC"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_KEYWORD": return { ...state, keyword: action.payload };
    case "SET_GENERATING": return { ...state, generating: action.payload };
    case "SET_TOPICS": return { ...state, topics: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_HAS_GENERATED": return { ...state, hasGenerated: action.payload };
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "SET_FILTER_STATUS": return { ...state, filterStatus: action.payload };
    case "SET_FILTER_PRIORITY": return { ...state, filterPriority: action.payload };
    case "SET_FILTER_PILLAR": return { ...state, filterPillar: action.payload };
    case "TOGGLE_TOPIC": return { ...state, expandedTopic: state.expandedTopic === action.payload ? null : action.payload };
    case "SET_COPIED": return { ...state, copiedId: action.payload };
    case "UPDATE_STATUS": return {
      ...state,
      topics: state.topics.map(t => t.id === action.payload.id ? { ...t, status: action.payload.status } : t),
    };
    case "UPDATE_PRIORITY": return {
      ...state,
      topics: state.topics.map(t => t.id === action.payload.id ? { ...t, priority: action.payload.priority } : t),
    };
    case "REMOVE_TOPIC": return { ...state, topics: state.topics.filter(t => t.id !== action.payload) };
    default: return state;
  }
}

const initialState: State = {
  keyword: "",
  generating: false,
  topics: [],
  error: null,
  hasGenerated: false,
  activeTab: "topics",
  filterStatus: "all",
  filterPriority: "all",
  filterPillar: "all",
  expandedTopic: null,
  copiedId: null,
};

const PILLARS = [
  { id: "seo-basics", name: "SEO Fundamentals", description: "Core SEO concepts and beginner guides", color: "#3b82f6", icon: BookOpen },
  { id: "technical", name: "Technical SEO", description: "Site speed, crawling, indexing, and structure", color: "#8b5cf6", icon: Layout },
  { id: "content", name: "Content Marketing", description: "Content creation, optimization, and strategy", color: "#f97316", icon: PenTool },
  { id: "links", name: "Link Building", description: "Backlink acquisition and authority building", color: "#06b6d4", icon: Hash },
  { id: "local", name: "Local SEO", description: "Local search optimization and Google My Business", color: "#34d399", icon: Globe },
];

const CONTENT_TEMPLATES = [
  { type: "blog", titles: ["Ultimate Guide to {kw}", "How to Master {kw} in 2025", "{kw}: Everything You Need to Know", "Top 10 {kw} Strategies That Work", "Why {kw} Matters for Your Business"] },
  { type: "guide", titles: ["The Complete {kw} Handbook", "Step-by-Step {kw} Tutorial", "{kw} Checklist for Beginners", "Advanced {kw} Techniques", "The {kw} Playbook"] },
  { type: "landing", titles: ["{kw} Services", "Professional {kw} Solutions", "{kw} for Business", "Enterprise {kw} Platform", "Get Started with {kw}"] },
  { type: "video", titles: ["{kw} Explained in 5 Minutes", "How to Do {kw} (Video Tutorial)", "{kw} Case Study Walkthrough", "Live {kw} Audit", "{kw} Q and A Session"] },
  { type: "infographic", titles: ["{kw} Stats and Facts", "The {kw} Process Visualized", "{kw} vs Traditional Methods", "{kw} Trends This Year", "How {kw} Works"] },
];

const INTENTS: ContentTopic["intent"][] = ["informational", "commercial", "transactional"];
const TYPES: ContentTopic["contentType"][] = ["blog", "guide", "landing", "video", "infographic"];
const PRIORITIES: ContentTopic["priority"][] = ["high", "medium", "low"];
const STATUSES: ContentTopic["status"][] = ["idea", "planned", "writing", "published"];
const PILLAR_IDS = PILLARS.map(p => p.id);

function generateTopics(keyword: string): ContentTopic[] {
  const seed = keyword.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number, off = 0) =>
    Math.floor(((seed * (off + 1) * 137) % (max - min + 1)) + min);

  return Array.from({ length: 12 }, (_, i) => {
    const typeIdx = (seed + i * 3) % TYPES.length;
    const template = CONTENT_TEMPLATES[typeIdx];
    const titleTemplate = template.titles[(seed + i * 7) % template.titles.length];
    const title = titleTemplate.replace(/\{kw\}/g, keyword);
    const vol = r(200, 45000, i + 1);
    return {
      id: `topic-${i}-${seed}`,
      title,
      keyword: i === 0 ? keyword : `${["best", "how to", "what is", "top", "free", "guide to", "learn"][i % 7]} ${keyword}`,
      volume: vol,
      difficulty: r(15, 85, i + 2),
      intent: INTENTS[(seed + i * 5) % INTENTS.length],
      contentType: TYPES[typeIdx],
      priority: PRIORITIES[(seed + i * 4) % PRIORITIES.length],
      status: STATUSES[i === 0 ? 3 : i === 1 ? 2 : i < 4 ? 1 : 0],
      wordCount: r(800, 4500, i + 3),
      estimatedTraffic: Math.floor(vol * 0.03 + r(20, 300, i + 4)),
      pillar: PILLAR_IDS[(seed + i * 6) % PILLAR_IDS.length],
    };
  });
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const intentConfig = {
  informational: { label: "Info", color: "text-blue-400 bg-blue-500/15 border-blue-500/25" },
  commercial: { label: "Commercial", color: "text-amber-400 bg-amber-500/15 border-amber-500/25" },
  transactional: { label: "Transactional", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" },
};

const typeConfig = {
  blog: { label: "Blog Post", icon: FileText, color: "text-blue-400" },
  guide: { label: "Guide", icon: BookOpen, color: "text-purple-400" },
  landing: { label: "Landing Page", icon: Layout, color: "text-orange-400" },
  video: { label: "Video", icon: Zap, color: "text-red-400" },
  infographic: { label: "Infographic", icon: BarChart2, color: "text-cyan-400" },
};

const priorityConfig = {
  high: { label: "High", color: "text-red-400 bg-red-500/15 border-red-500/25" },
  medium: { label: "Medium", color: "text-amber-400 bg-amber-500/15 border-amber-500/25" },
  low: { label: "Low", color: "text-blue-400 bg-blue-500/15 border-blue-500/25" },
};

const statusConfig = {
  idea: { label: "Idea", color: "text-slate-400 bg-slate-500/15 border-slate-500/25" },
  planned: { label: "Planned", color: "text-blue-400 bg-blue-500/15 border-blue-500/25" },
  writing: { label: "Writing", color: "text-amber-400 bg-amber-500/15 border-amber-500/25" },
  published: { label: "Published", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" },
};

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ContentStrategy() {
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);

  async function handleGenerate() {
    if (!state.keyword.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a keyword or topic to generate content ideas." });
      return;
    }
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_GENERATING", payload: true });
    dispatch({ type: "SET_HAS_GENERATED", payload: false });
    await new Promise(r => setTimeout(r, 1800));
    const topics = generateTopics(state.keyword.trim().toLowerCase());
    dispatch({ type: "SET_TOPICS", payload: topics });
    dispatch({ type: "SET_HAS_GENERATED", payload: true });
    dispatch({ type: "SET_GENERATING", payload: false });
    dispatch({ type: "SET_TAB", payload: "topics" });
  }

  function handleCopyTitle(id: string, title: string) {
    navigator.clipboard.writeText(title).then(() => {
      dispatch({ type: "SET_COPIED", payload: id });
      setTimeout(() => dispatch({ type: "SET_COPIED", payload: null }), 2000);
    });
  }

  function exportCSV() {
    const rows = [
      ["Title", "Keyword", "Volume", "Difficulty", "Intent", "Type", "Priority", "Status", "Word Count", "Est. Traffic"],
      ...state.topics.map(t => [t.title, t.keyword, t.volume, t.difficulty, t.intent, t.contentType, t.priority, t.status, t.wordCount, t.estimatedTraffic]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `content-strategy-${state.keyword}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = state.topics
    .filter(t => state.filterStatus === "all" || t.status === state.filterStatus)
    .filter(t => state.filterPriority === "all" || t.priority === state.filterPriority)
    .filter(t => state.filterPillar === "all" || t.pillar === state.filterPillar);

  const publishedCount = state.topics.filter(t => t.status === "published").length;
  const writingCount = state.topics.filter(t => t.status === "writing").length;
  const plannedCount = state.topics.filter(t => t.status === "planned").length;
  const ideaCount = state.topics.filter(t => t.status === "idea").length;
  const totalEstTraffic = state.topics.reduce((sum, t) => sum + t.estimatedTraffic, 0);

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const now = new Date();
  const calendarMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      label: `${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
      topics: state.topics.filter((_, ti) => ti % 6 === i).slice(0, 3),
    };
  });

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Content Strategy</h1>
        <p className="text-blue-200/70 text-sm mt-1">Generate keyword-driven content ideas, map topics to pillars, and plan your editorial calendar</p>
      </motion.div>

      {/* Generator Input */}
      <motion.div {...fadeUp} className="mb-8 bg-gradient-to-br from-blue-900/40 to-[#0b1729] border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Lightbulb className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" />
            <input
              type="text"
              placeholder='Enter a topic or keyword (e.g. "SEO for beginners", "link building")'
              value={state.keyword}
              onChange={e => dispatch({ type: "SET_KEYWORD", payload: e.target.value })}
              onKeyDown={e => e.key === "Enter" && !state.generating && handleGenerate()}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={state.generating}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[180px]"
          >
            {state.generating
              ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</>
              : <><Lightbulb className="w-4 h-4" />Generate Ideas</>}
          </button>
        </div>
        {state.error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
            <button onClick={() => dispatch({ type: "SET_ERROR", payload: null })} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {state.generating && (
          <div className="mt-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: "0%" }} animate={{ width: "88%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }} />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Analyzing topic", "Finding keywords", "Mapping to pillars", "Building calendar"].map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.35 }}
                  className="flex items-center gap-1.5 text-xs text-blue-200/40">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />{s}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {!state.hasGenerated && !state.generating && (
        <motion.div {...fadeUp} className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <PenTool className="w-10 h-10 text-blue-400/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Build Your Content Strategy</h3>
          <p className="text-blue-200/50 text-sm max-w-md mx-auto mb-6">
            Enter any keyword or topic to instantly generate a full content plan with titles, keyword mappings, content types, priority scores, and a 6-month editorial calendar.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {["Topic Ideas", "Keyword Mapping", "Content Pillars", "Editorial Calendar", "Priority Scoring", "Traffic Estimates"].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-200/50">
                <CheckCircle2 className="w-3 h-3 text-blue-400/40" />{f}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state.hasGenerated && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: "Total Topics", value: state.topics.length, color: "text-blue-400", icon: FileText },
                { label: "Published", value: publishedCount, color: "text-emerald-400", icon: CheckCircle2 },
                { label: "In Progress", value: writingCount, color: "text-amber-400", icon: PenTool },
                { label: "Planned", value: plannedCount, color: "text-cyan-400", icon: Calendar },
                { label: "Est. Traffic", value: formatNum(totalEstTraffic), color: "text-purple-400", icon: TrendingUp },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-blue-200/40">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {([
                { key: "topics", label: `Topics (${filtered.length})`, icon: FileText },
                { key: "calendar", label: "Calendar", icon: Calendar },
                { key: "pillars", label: "Pillars", icon: Layout },
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

              {/* TOPICS TAB */}
              {state.activeTab === "topics" && (
                <motion.div key="topics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    <Filter className="w-3.5 h-3.5 text-blue-200/40 self-center" />
                    {[
                      { label: "Status", value: state.filterStatus, action: "SET_FILTER_STATUS", opts: ["all", "idea", "planned", "writing", "published"] },
                      { label: "Priority", value: state.filterPriority, action: "SET_FILTER_PRIORITY", opts: ["all", "high", "medium", "low"] },
                    ].map(f => (
                      <select key={f.label} value={f.value}
                        onChange={e => dispatch({ type: f.action as any, payload: e.target.value })}
                        className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/70 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 capitalize">
                        {f.opts.map(o => <option key={o} value={o} className="capitalize">{o === "all" ? `All ${f.label}` : o}</option>)}
                      </select>
                    ))}
                    <select value={state.filterPillar}
                      onChange={e => dispatch({ type: "SET_FILTER_PILLAR", payload: e.target.value })}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/70 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                      <option value="all">All Pillars</option>
                      {PILLARS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button onClick={exportCSV}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-blue-200/60 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-white/10 ml-auto">
                      <Download className="w-3.5 h-3.5" />Export CSV
                    </button>
                  </div>

                  {/* Topic Cards */}
                  <div className="space-y-3">
                    {filtered.map((topic, i) => {
                      const isExpanded = state.expandedTopic === topic.id;
                      const typeCfg = typeConfig[topic.contentType];
                      const pillar = PILLARS.find(p => p.id === topic.pillar);
                      const isCopied = state.copiedId === topic.id;
                      return (
                        <motion.div key={topic.id}
                          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all backdrop-blur-sm group"
                        >
                          <div className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                <typeCfg.icon className={`w-4 h-4 ${typeCfg.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="text-sm font-bold text-white leading-snug">{topic.title}</h3>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button onClick={() => handleCopyTitle(topic.id, topic.title)}
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isCopied ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-blue-200/40 hover:text-white hover:bg-white/10"}`}
                                      title="Copy title">
                                      {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                    <button onClick={() => dispatch({ type: "REMOVE_TOPIC", payload: topic.id })}
                                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/0 hover:bg-red-500/10 text-red-400/0 group-hover:text-red-400/50 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => dispatch({ type: "TOGGLE_TOPIC", payload: topic.id })}
                                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-blue-200/40 hover:text-white transition-all">
                                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="text-xs text-blue-200/40 flex items-center gap-1">
                                    <Tag className="w-3 h-3" />{topic.keyword}
                                  </span>
                                  <span className="text-xs text-blue-200/30">|</span>
                                  <span className="text-xs text-blue-200/40">{formatNum(topic.volume)}/mo</span>
                                  <span className="text-xs text-blue-200/30">|</span>
                                  <span className="text-xs text-blue-200/40">KD: {topic.difficulty}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${intentConfig[topic.intent].color}`}>
                                    {intentConfig[topic.intent].label}
                                  </span>
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityConfig[topic.priority].color}`}>
                                    {priorityConfig[topic.priority].label} Priority
                                  </span>
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusConfig[topic.status].color}`}>
                                    {statusConfig[topic.status].label}
                                  </span>
                                  {pillar && (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                                      style={{ color: pillar.color, backgroundColor: `${pillar.color}18`, borderColor: `${pillar.color}35` }}>
                                      {pillar.name}
                                    </span>
                                  )}
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
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                    {[
                                      { label: "Word Count", value: `${topic.wordCount.toLocaleString()} words` },
                                      { label: "Est. Traffic", value: `${formatNum(topic.estimatedTraffic)}/mo` },
                                      { label: "Content Type", value: typeCfg.label },
                                      { label: "Difficulty", value: `${topic.difficulty}/100` },
                                    ].map(item => (
                                      <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                                        <div className="text-sm font-black text-white">{item.value}</div>
                                        <div className="text-xs text-blue-200/40 mt-0.5">{item.label}</div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <div>
                                      <span className="text-xs text-blue-200/40 block mb-1">Update Status</span>
                                      <div className="flex gap-1.5">
                                        {STATUSES.map(s => (
                                          <button key={s} onClick={() => dispatch({ type: "UPDATE_STATUS", payload: { id: topic.id, status: s } })}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${topic.status === s ? statusConfig[s].color : "bg-white/5 border-white/10 text-blue-200/40 hover:text-white"}`}>
                                            {statusConfig[s].label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="sm:ml-6">
                                      <span className="text-xs text-blue-200/40 block mb-1">Update Priority</span>
                                      <div className="flex gap-1.5">
                                        {PRIORITIES.map(p => (
                                          <button key={p} onClick={() => dispatch({ type: "UPDATE_PRIORITY", payload: { id: topic.id, priority: p } })}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all capitalize ${topic.priority === p ? priorityConfig[p].color : "bg-white/5 border-white/10 text-blue-200/40 hover:text-white"}`}>
                                            {p}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {filtered.length === 0 && (
                    <div className="text-center py-12 bg-white/3 border border-white/8 rounded-2xl">
                      <Filter className="w-8 h-8 text-blue-400/20 mx-auto mb-2" />
                      <p className="text-blue-200/40 text-sm">No topics match your filters</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* CALENDAR TAB */}
              {state.activeTab === "calendar" && (
                <motion.div key="calendar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {calendarMonths.map((month, mi) => (
                      <motion.div key={month.label}
                        initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: mi * 0.08 }}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-blue-500/20 transition-all"
                      >
                        <div className="px-5 py-3 border-b border-white/5 bg-white/3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-bold text-white">{month.label}</span>
                          </div>
                          <span className="text-xs text-blue-200/40">{month.topics.length} posts</span>
                        </div>
                        <div className="p-4 space-y-2.5">
                          {month.topics.length > 0 ? month.topics.map((topic, ti) => {
                            const typeCfg = typeConfig[topic.contentType];
                            return (
                              <div key={topic.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                                <typeCfg.icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${typeCfg.color}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-white leading-snug line-clamp-2">{topic.title}</p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${statusConfig[topic.status].color}`}>
                                      {statusConfig[topic.status].label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }) : (
                            <div className="text-center py-4 text-blue-200/25 text-xs">No content scheduled</div>
                          )}
                          {mi < 3 && (
                            <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-white/10 hover:border-blue-500/30 text-blue-200/30 hover:text-blue-400 text-xs transition-all">
                              <Plus className="w-3 h-3" />Add topic
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PILLARS TAB */}
              {state.activeTab === "pillars" && (
                <motion.div key="pillars" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PILLARS.map((pillar, i) => {
                      const pillarTopics = state.topics.filter(t => t.pillar === pillar.id);
                      const published = pillarTopics.filter(t => t.status === "published").length;
                      const pct = pillarTopics.length > 0 ? Math.round((published / pillarTopics.length) * 100) : 0;
                      return (
                        <motion.div key={pillar.id}
                          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all group backdrop-blur-sm"
                          style={{ borderColor: `${pillar.color}25` }}
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: `${pillar.color}18`, border: `1px solid ${pillar.color}35` }}>
                              <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-white">{pillar.name}</h3>
                              <p className="text-xs text-blue-200/40 mt-0.5 leading-relaxed">{pillar.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-blue-200/50">{pillarTopics.length} topics assigned</span>
                            <span className="font-bold" style={{ color: pillar.color }}>{pct}% published</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                            <motion.div className="h-full rounded-full"
                              style={{ backgroundColor: pillar.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }} />
                          </div>
                          <div className="space-y-1.5">
                            {pillarTopics.slice(0, 3).map(topic => (
                              <div key={topic.id} className="flex items-center gap-2 text-xs text-blue-200/50 truncate">
                                <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: pillar.color }} />
                                <span className="truncate">{topic.title}</span>
                              </div>
                            ))}
                            {pillarTopics.length > 3 && (
                              <p className="text-xs text-blue-200/30 pl-5">+{pillarTopics.length - 3} more topics</p>
                            )}
                            {pillarTopics.length === 0 && (
                              <p className="text-xs text-blue-200/25 italic">No topics assigned yet</p>
                            )}
                          </div>
                        </motion.div>
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
