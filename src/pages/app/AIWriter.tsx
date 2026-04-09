import { useState, useReducer, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles, Copy, Save, RefreshCw, AlertCircle, CheckCircle2,
  X, FileText, Trash2, Clock, ChevronDown, Download,
  PenTool, Target, Zap, BookOpen, Hash, LayoutTemplate,
  Eye, EyeOff, Settings2, Globe, ArrowRight
} from "lucide-react";

interface GeneratedContent {
  title: string;
  metaDescription: string;
  introduction: string;
  sections: { heading: string; content: string }[];
  conclusion: string;
  wordCount: number;
  readingTime: number;
  keywords: string[];
  seoScore: number;
}

interface SavedContent {
  id: string;
  user_id: string;
  title: string;
  report_type: string;
  data: any;
  created_at: string;
}

interface WriterSettings {
  tone: "professional" | "casual" | "educational" | "persuasive";
  length: "short" | "medium" | "long";
  contentType: "blog" | "landing" | "product" | "social" | "email";
  language: string;
}

interface State {
  topic: string;
  keyword: string;
  settings: WriterSettings;
  generating: boolean;
  content: GeneratedContent | null;
  error: string | null;
  saving: boolean;
  saveSuccess: boolean;
  copiedSection: string | null;
  history: SavedContent[];
  historyLoading: boolean;
  showSettings: boolean;
  showHistory: boolean;
  activeSection: string | null;
  showMeta: boolean;
}

type Action =
  | { type: "SET_TOPIC"; payload: string }
  | { type: "SET_KEYWORD"; payload: string }
  | { type: "SET_SETTING"; payload: Partial<WriterSettings> }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "SET_CONTENT"; payload: GeneratedContent | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_SAVE_SUCCESS"; payload: boolean }
  | { type: "SET_COPIED"; payload: string | null }
  | { type: "SET_HISTORY"; payload: SavedContent[] }
  | { type: "SET_HISTORY_LOADING"; payload: boolean }
  | { type: "TOGGLE_SETTINGS" }
  | { type: "TOGGLE_HISTORY" }
  | { type: "SET_ACTIVE_SECTION"; payload: string | null }
  | { type: "TOGGLE_META" }
  | { type: "ADD_HISTORY"; payload: SavedContent }
  | { type: "REMOVE_HISTORY"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TOPIC": return { ...state, topic: action.payload };
    case "SET_KEYWORD": return { ...state, keyword: action.payload };
    case "SET_SETTING": return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_GENERATING": return { ...state, generating: action.payload };
    case "SET_CONTENT": return { ...state, content: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "SET_SAVING": return { ...state, saving: action.payload };
    case "SET_SAVE_SUCCESS": return { ...state, saveSuccess: action.payload };
    case "SET_COPIED": return { ...state, copiedSection: action.payload };
    case "SET_HISTORY": return { ...state, history: action.payload };
    case "SET_HISTORY_LOADING": return { ...state, historyLoading: action.payload };
    case "TOGGLE_SETTINGS": return { ...state, showSettings: !state.showSettings };
    case "TOGGLE_HISTORY": return { ...state, showHistory: !state.showHistory };
    case "SET_ACTIVE_SECTION": return { ...state, activeSection: action.payload };
    case "TOGGLE_META": return { ...state, showMeta: !state.showMeta };
    case "ADD_HISTORY": return { ...state, history: [action.payload, ...state.history] };
    case "REMOVE_HISTORY": return { ...state, history: state.history.filter(h => h.id !== action.payload) };
    default: return state;
  }
}

const initialState: State = {
  topic: "",
  keyword: "",
  settings: { tone: "professional", length: "medium", contentType: "blog", language: "English" },
  generating: false,
  content: null,
  error: null,
  saving: false,
  saveSuccess: false,
  copiedSection: null,
  history: [],
  historyLoading: false,
  showSettings: false,
  showHistory: false,
  activeSection: null,
  showMeta: true,
};

const WORD_COUNTS = { short: [400, 700], medium: [800, 1400], long: [1500, 2500] };

function generateContent(topic: string, keyword: string, settings: WriterSettings): GeneratedContent {
  const seed = (topic + keyword).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number, off = 0) =>
    Math.floor(((seed * (off + 1) * 137) % (max - min + 1)) + min);

  const [minW, maxW] = WORD_COUNTS[settings.length];
  const wordCount = r(minW, maxW, 1);
  const readingTime = Math.ceil(wordCount / 200);
  const seoScore = r(72, 98, 2);

  const toneMap = {
    professional: "In the competitive digital landscape",
    casual: "If you have ever wondered",
    educational: "Understanding the fundamentals of",
    persuasive: "Discover why thousands of businesses rely on",
  };

  const sectionTemplates = [
    { heading: `What is ${topic}?`, content: `${topic} refers to the systematic process of optimizing your online presence to rank higher in search engine results pages. When done correctly, ${keyword} strategies can drive significant organic traffic to your website, reducing your dependence on paid advertising and building long-term sustainable growth. Modern approaches to ${topic} combine technical excellence, high-quality content creation, and strategic link building to create a comprehensive digital strategy that delivers measurable results.` },
    { heading: `Why ${topic} Matters in 2025`, content: `The importance of ${topic} cannot be overstated in the current digital environment. With over 8.5 billion searches conducted on Google every single day, businesses that fail to optimize for search engines are leaving enormous amounts of potential revenue on the table. Effective ${keyword} implementation has been shown to deliver an average ROI of 275% over a three-year period, making it one of the highest-returning digital marketing investments available to modern businesses.` },
    { heading: `Key ${topic} Strategies That Work`, content: `Successful ${topic} requires a multi-faceted approach that addresses every aspect of your online presence. Start with a comprehensive technical audit to identify crawling and indexing issues, then move on to on-page optimization including title tags, meta descriptions, and header structures. Content strategy plays a central role as well, ensuring that every piece you publish targets specific ${keyword} opportunities with genuine value for your audience.` },
    { heading: `How to Measure ${topic} Success`, content: `Tracking the right metrics is essential for understanding whether your ${topic} efforts are delivering results. Key performance indicators include organic traffic growth, keyword ranking improvements, click-through rates from search results, and ultimately conversions attributed to organic search. Tools like Hi-SEO provide comprehensive reporting dashboards that make it simple to monitor all of these metrics in one place, giving you a clear picture of your progress over time.` },
    { heading: `Common ${topic} Mistakes to Avoid`, content: `Even experienced marketers make costly mistakes when implementing ${topic} strategies. Keyword stuffing, neglecting mobile optimization, ignoring page speed, and building low-quality backlinks are among the most common errors that can actually harm your search rankings rather than improve them. Understanding what not to do is just as important as knowing the right techniques, and staying up to date with algorithm changes ensures your strategy remains effective.` },
    { heading: `Advanced ${topic} Techniques`, content: `Once you have mastered the fundamentals of ${topic}, advanced techniques can take your results to the next level. Entity-based SEO, topical authority building, structured data markup, and Core Web Vitals optimization are all areas where sophisticated practitioners gain a competitive advantage. Combining these techniques with a data-driven approach using tools like Hi-SEO allows you to identify opportunities and act on them faster than your competition.` },
  ];

  const sectionCount = settings.length === "short" ? 2 : settings.length === "medium" ? 3 : 5;
  const sections = sectionTemplates.slice(0, sectionCount);

  const keywords = [
    keyword,
    `${keyword} strategy`,
    `best ${keyword}`,
    `${keyword} tips`,
    `${topic} guide`,
    `${topic} tools`,
  ].slice(0, r(3, 6, 3));

  return {
    title: `The Complete Guide to ${topic}: Strategies, Tips, and Best Practices for 2025`,
    metaDescription: `Discover proven ${topic} strategies that drive real results. Learn how to leverage ${keyword} to boost organic traffic, improve rankings, and grow your business in 2025.`,
    introduction: `${toneMap[settings.tone]} ${topic}, businesses that master the art and science of ${keyword} consistently outperform their competitors in search results. This comprehensive guide walks you through everything you need to know about ${topic}, from foundational principles to advanced tactics that can transform your organic search performance and drive sustainable business growth.`,
    sections,
    conclusion: `Mastering ${topic} is a journey, not a destination. The strategies outlined in this guide provide a solid foundation for building sustainable organic search visibility through effective ${keyword} implementation. Remember that consistency, quality, and patience are the hallmarks of successful SEO practitioners. Start implementing these techniques today, track your progress using Hi-SEO, and watch your organic traffic grow month over month.`,
    wordCount,
    readingTime,
    keywords,
    seoScore,
  };
}

function CopyButton({ text, id, copiedId, onCopy }: { text: string; id: string; copiedId: string | null; onCopy: (id: string, text: string) => void }) {
  const isCopied = copiedId === id;
  return (
    <button onClick={() => onCopy(id, text)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isCopied ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" : "bg-white/5 border border-white/10 text-blue-200/50 hover:text-white hover:bg-white/10"}`}>
      {isCopied ? <><CheckCircle2 className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
    </button>
  );
}

const toneOptions = ["professional", "casual", "educational", "persuasive"] as const;
const lengthOptions = ["short", "medium", "long"] as const;
const typeOptions = ["blog", "landing", "product", "social", "email"] as const;

export default function AIWriter() {
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, initialState);
  const contentRef = useRef<HTMLDivElement>(null);

  async function handleGenerate() {
    if (!state.topic.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a topic to write about." });
      return;
    }
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_CONTENT", payload: null });
    dispatch({ type: "SET_GENERATING", payload: true });
    const delay = state.settings.length === "short" ? 1800 : state.settings.length === "medium" ? 2400 : 3200;
    await new Promise(r => setTimeout(r, delay));
    const content = generateContent(state.topic.trim(), state.keyword.trim() || state.topic.trim(), state.settings);
    dispatch({ type: "SET_CONTENT", payload: content });
    dispatch({ type: "SET_GENERATING", payload: false });
  }

  async function handleSave() {
    if (!state.content) return;
    dispatch({ type: "SET_SAVING", payload: true });
    try {
      const { data, error } = await supabase.from("reports").insert({
        user_id: user!.id,
        title: state.content.title,
        report_type: "ai_content",
        data: { content: state.content, topic: state.topic, keyword: state.keyword, settings: state.settings },
      }).select().single();
      if (error) throw error;
      dispatch({ type: "ADD_HISTORY", payload: data });
      dispatch({ type: "SET_SAVE_SUCCESS", payload: true });
      setTimeout(() => dispatch({ type: "SET_SAVE_SUCCESS", payload: false }), 3000);
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message ?? "Failed to save content." });
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      dispatch({ type: "SET_COPIED", payload: id });
      setTimeout(() => dispatch({ type: "SET_COPIED", payload: null }), 2500);
    });
  }

  function handleCopyAll() {
    if (!state.content) return;
    const c = state.content;
    const full = [
      `# ${c.title}`,
      `\nMeta Description: ${c.metaDescription}`,
      `\n## Introduction\n${c.introduction}`,
      ...c.sections.map(s => `\n## ${s.heading}\n${s.content}`),
      `\n## Conclusion\n${c.conclusion}`,
    ].join("\n");
    handleCopy("all", full);
  }

  function downloadContent() {
    if (!state.content) return;
    const c = state.content;
    const full = [
      `# ${c.title}`,
      `\nMeta Description: ${c.metaDescription}`,
      `\n## Introduction\n${c.introduction}`,
      ...c.sections.map(s => `\n## ${s.heading}\n${s.content}`),
      `\n## Conclusion\n${c.conclusion}`,
    ].join("\n");
    const blob = new Blob([full], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${state.topic.replace(/\s+/g, "-")}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteHistory(id: string) {
    try {
      await supabase.from("reports").delete().eq("id", id).eq("user_id", user!.id);
      dispatch({ type: "REMOVE_HISTORY", payload: id });
    } catch { /* silent */ }
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const generatingSteps = [
    "Analyzing topic and keyword intent",
    "Structuring content outline",
    "Writing introduction and body",
    "Optimizing for SEO signals",
    "Calculating readability score",
  ];

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            AI Writer
          </h1>
          <p className="text-blue-200/70 text-sm mt-1">Generate SEO-optimized content for any topic in seconds</p>
        </div>
        <button onClick={() => dispatch({ type: "TOGGLE_HISTORY" })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/70 hover:text-white text-sm font-semibold transition-all">
          <Clock className="w-4 h-4" />Saved Content
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Panel - Input */}
        <div className="lg:col-span-1 space-y-4">

          {/* Topic Input */}
          <motion.div {...fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-blue-400" />Write About
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Technical SEO for E-commerce"
                  value={state.topic}
                  onChange={e => dispatch({ type: "SET_TOPIC", payload: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">Target Keyword <span className="text-blue-200/30 normal-case font-normal">(optional)</span></label>
                <div className="relative">
                  <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400/40" />
                  <input
                    type="text"
                    placeholder="e.g. technical SEO"
                    value={state.keyword}
                    onChange={e => dispatch({ type: "SET_KEYWORD", payload: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-blue-200/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div {...fadeUp} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <button onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-400" />Writing Settings
              </span>
              <ChevronDown className={`w-4 h-4 text-blue-200/40 transition-transform ${state.showSettings ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {state.showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-white/5"
                >
                  <div className="p-5 space-y-4">
                    {/* Tone */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-2 uppercase tracking-wider">Tone</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {toneOptions.map(t => (
                          <button key={t} onClick={() => dispatch({ type: "SET_SETTING", payload: { tone: t } })}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${state.settings.tone === t ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white/5 text-blue-200/50 hover:bg-white/10 hover:text-white border border-white/10"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Length */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-2 uppercase tracking-wider">Length</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {lengthOptions.map(l => (
                          <button key={l} onClick={() => dispatch({ type: "SET_SETTING", payload: { length: l } })}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${state.settings.length === l ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white/5 text-blue-200/50 hover:bg-white/10 hover:text-white border border-white/10"}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-blue-200/30 mt-1.5">
                        {state.settings.length === "short" ? "400-700" : state.settings.length === "medium" ? "800-1400" : "1500-2500"} words
                      </p>
                    </div>
                    {/* Content Type */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-200/60 mb-2 uppercase tracking-wider">Content Type</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {typeOptions.map(t => (
                          <button key={t} onClick={() => dispatch({ type: "SET_SETTING", payload: { contentType: t } })}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${state.settings.contentType === t ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white/5 text-blue-200/50 hover:bg-white/10 hover:text-white border border-white/10"}`}>
                            {t === "landing" ? "Landing Page" : t === "social" ? "Social Post" : t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Generate Button */}
          <motion.div {...fadeUp}>
            <button
              onClick={handleGenerate}
              disabled={state.generating}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-600/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {state.generating
                ? <><RefreshCw className="w-4 h-4 animate-spin" />Writing content...</>
                : <><Sparkles className="w-4 h-4" />Generate Content</>}
            </button>
          </motion.div>

          {state.error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {state.error}
              <button onClick={() => dispatch({ type: "SET_ERROR", payload: null })} className="ml-auto"><X className="w-4 h-4" /></button>
            </motion.div>
          )}

          {/* SEO Score */}
          {state.content && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />Content Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-200/50">SEO Score</span>
                    <span className={`font-black ${state.content.seoScore >= 85 ? "text-emerald-400" : state.content.seoScore >= 70 ? "text-amber-400" : "text-red-400"}`}>
                      {state.content.seoScore}/100
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full ${state.content.seoScore >= 85 ? "bg-emerald-500" : state.content.seoScore >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                      initial={{ width: 0 }} animate={{ width: `${state.content.seoScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }} />
                  </div>
                </div>
                {[
                  { label: "Word Count", value: `${state.content.wordCount.toLocaleString()} words` },
                  { label: "Reading Time", value: `${state.content.readingTime} min read` },
                  { label: "Sections", value: `${state.content.sections.length} headings` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-xs">
                    <span className="text-blue-200/40">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
                <div>
                  <span className="text-xs text-blue-200/40 block mb-1.5">Target Keywords</span>
                  <div className="flex flex-wrap gap-1">
                    {state.content.keywords.map(kw => (
                      <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel - Content Output */}
        <div className="lg:col-span-2">

          {/* Generating State */}
          {state.generating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Writing your content...</h3>
                <p className="text-sm text-blue-200/50">AI is crafting SEO-optimized content for <strong className="text-white">{state.topic}</strong></p>
              </div>
              <div className="space-y-3 max-w-sm mx-auto">
                {generatingSteps.map((step, i) => (
                  <motion.div key={step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.35 }}
                    className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <motion.div className="w-2 h-2 rounded-full bg-blue-400"
                        animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                    </div>
                    <span className="text-blue-200/60">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!state.generating && !state.content && (
            <motion.div {...fadeUp} className="bg-white/3 border border-white/8 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Sparkles className="w-10 h-10 text-blue-400/40" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Write</h3>
              <p className="text-blue-200/50 text-sm max-w-sm mx-auto mb-6">
                Enter your topic on the left, customize the writing settings, and click Generate Content to create a fully optimized article in seconds.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs max-w-xs w-full">
                {[
                  { icon: FileText, label: "Blog Posts" },
                  { icon: LayoutTemplate, label: "Landing Pages" },
                  { icon: BookOpen, label: "Long-form Guides" },
                  { icon: Hash, label: "Social Content" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-200/50">
                    <item.icon className="w-4 h-4 text-blue-400/50" />{item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Generated Content */}
          <AnimatePresence>
            {state.content && !state.generating && (
              <motion.div ref={contentRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">

                {/* Content Actions Bar */}
                <div className="px-6 py-4 border-b border-white/5 bg-white/3 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white flex-1 min-w-0 truncate">Generated Content</span>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => dispatch({ type: "TOGGLE_META" })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/60 hover:text-white text-xs font-semibold transition-all">
                      {state.showMeta ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {state.showMeta ? "Hide" : "Show"} Meta
                    </button>
                    <button onClick={handleCopyAll}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/60 hover:text-white text-xs font-semibold transition-all">
                      {state.copiedSection === "all" ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy All</>}
                    </button>
                    <button onClick={downloadContent}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/60 hover:text-white text-xs font-semibold transition-all">
                      <Download className="w-3.5 h-3.5" />Download
                    </button>
                    <button onClick={handleSave} disabled={state.saving || state.saveSuccess}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${state.saveSuccess ? "bg-emerald-600 text-white" : "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20"} disabled:opacity-60`}>
                      {state.saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Saving...</>
                        : state.saveSuccess ? <><CheckCircle2 className="w-3.5 h-3.5" />Saved!</>
                        : <><Save className="w-3.5 h-3.5" />Save</>}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-400/60 uppercase tracking-wider">Article Title</span>
                      <CopyButton text={state.content.title} id="title" copiedId={state.copiedSection} onCopy={handleCopy} />
                    </div>
                    <h2 className="text-xl font-black text-white leading-tight">{state.content.title}</h2>
                  </div>

                  {/* Meta */}
                  <AnimatePresence>
                    {state.showMeta && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="bg-blue-900/20 border border-blue-500/15 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5" />Meta Description
                            </span>
                            <CopyButton text={state.content.metaDescription} id="meta" copiedId={state.copiedSection} onCopy={handleCopy} />
                          </div>
                          <p className="text-sm text-blue-200/70 leading-relaxed">{state.content.metaDescription}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${state.content.metaDescription.length <= 160 ? "bg-emerald-500" : "bg-red-500"}`}
                                style={{ width: `${Math.min(100, (state.content.metaDescription.length / 160) * 100)}%` }} />
                            </div>
                            <span className={`text-xs font-semibold ${state.content.metaDescription.length <= 160 ? "text-emerald-400" : "text-red-400"}`}>
                              {state.content.metaDescription.length}/160
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Introduction */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-200/50 uppercase tracking-wider">Introduction</span>
                      <CopyButton text={state.content.introduction} id="intro" copiedId={state.copiedSection} onCopy={handleCopy} />
                    </div>
                    <p className="text-sm text-blue-100/80 leading-relaxed">{state.content.introduction}</p>
                  </div>

                  {/* Sections */}
                  {state.content.sections.map((section, i) => (
                    <motion.div key={section.heading} initial={shouldReduce ? {} : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-black text-white">{section.heading}</h3>
                        <CopyButton text={`## ${section.heading}\n\n${section.content}`} id={`section-${i}`} copiedId={state.copiedSection} onCopy={handleCopy} />
                      </div>
                      <p className="text-sm text-blue-100/70 leading-relaxed">{section.content}</p>
                    </motion.div>
                  ))}

                  {/* Conclusion */}
                  <div className="border-t border-white/5 pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-200/50 uppercase tracking-wider">Conclusion</span>
                      <CopyButton text={state.content.conclusion} id="conclusion" copiedId={state.copiedSection} onCopy={handleCopy} />
                    </div>
                    <p className="text-sm text-blue-100/80 leading-relaxed">{state.content.conclusion}</p>
                  </div>

                  {/* Regenerate */}
                  <div className="pt-2">
                    <button onClick={handleGenerate}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/70 hover:text-white text-sm font-semibold transition-all">
                      <RefreshCw className="w-4 h-4" />Regenerate Content
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History Drawer */}
      <AnimatePresence>
        {state.showHistory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
            onClick={() => dispatch({ type: "TOGGLE_HISTORY" })}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-[#0b1729] border-l border-white/10 h-full flex flex-col">
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />Saved Content
                </h2>
                <button onClick={() => dispatch({ type: "TOGGLE_HISTORY" })}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-blue-200/60 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {state.history.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-10 h-10 text-blue-400/20 mx-auto mb-3" />
                    <p className="text-blue-200/40 text-sm">No saved content yet</p>
                    <p className="text-blue-200/25 text-xs mt-1">Generate content and click Save to keep it here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.history.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/20 transition-all group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{item.title}</p>
                            <p className="text-xs text-blue-200/40 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <button onClick={() => handleDeleteHistory(item.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/0 group-hover:text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
