import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft, Download, Trash2, RefreshCw, AlertCircle,
  FileText, Globe, Key, Link2, TrendingUp, Target,
  Sparkles, BarChart2, Clock, CheckCircle2, XCircle,
  Shield, Zap, Star, ExternalLink, Copy, Hash,
  BookOpen, PenTool, Eye, Info, Award
} from "lucide-react";

interface Report {
  id: string;
  user_id: string;
  title: string;
  report_type: string;
  data: any;
  created_at: string;
}

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any; gradient: string }> = {
  site_audit: { label: "Site Audit", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/25", icon: Globe, gradient: "from-blue-600/20 to-blue-900/20" },
  keyword: { label: "Keyword Research", color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/25", icon: Key, gradient: "from-cyan-600/20 to-blue-900/20" },
  backlink: { label: "Backlink Analysis", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/25", icon: Link2, gradient: "from-purple-600/20 to-blue-900/20" },
  rank: { label: "Rank Tracking", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/25", icon: TrendingUp, gradient: "from-amber-600/20 to-blue-900/20" },
  competitor: { label: "Competitor Analysis", color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/25", icon: Target, gradient: "from-orange-600/20 to-blue-900/20" },
  ai_content: { label: "AI Generated Content", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/25", icon: Sparkles, gradient: "from-emerald-600/20 to-blue-900/20" },
  serp: { label: "SERP Analysis", color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/25", icon: BarChart2, gradient: "from-rose-600/20 to-blue-900/20" },
  default: { label: "Report", color: "text-slate-400", bg: "bg-slate-500/15", border: "border-slate-500/25", icon: FileText, gradient: "from-slate-600/20 to-blue-900/20" },
};

function getTypeCfg(t: string) { return typeConfig[t] ?? typeConfig.default; }

function StatCard({ label, value, color = "text-white", sub }: { label: string; value: string | number; color?: string; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-blue-200/50 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-blue-200/30 mt-0.5">{sub}</div>}
    </div>
  );
}

function SectionCard({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="px-5 py-4 border-b border-white/5 bg-white/3 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-400" />}
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function AuditReportView({ data }: { data: any }) {
  const score = data?.score ?? data?.data?.score ?? null;
  const issues = data?.issues ?? data?.data?.issues ?? [];
  const url = data?.target_url ?? data?.url ?? "N/A";
  const loadTime = data?.loadTime ?? data?.data?.loadTime ?? null;
  const categories = data?.categories ?? data?.data?.categories ?? null;

  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const r2 = typeof score === "number" ? 38 : 0;
  const circ = 2 * Math.PI * 38;
  const dash = score !== null ? (score / 100) * circ : 0;

  const severityCounts = { critical: 0, warning: 0, info: 0 };
  issues.forEach((iss: any) => {
    if (iss.severity in severityCounts) severityCounts[iss.severity as keyof typeof severityCounts]++;
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle cx="50" cy="50" r="38" fill="none"
              stroke={score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${dash} ${circ}` }}
              transition={{ duration: 1.2, ease: "easeOut" }} />
            <text x="50" y="55" textAnchor="middle" fontSize="22" fontWeight="900"
              fill={score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"}>{score ?? "--"}</text>
          </svg>
          <span className={`text-xs font-bold ${scoreColor}`}>SEO Score</span>
        </div>
        <StatCard label="Critical Issues" value={severityCounts.critical} color="text-red-400" />
        <StatCard label="Warnings" value={severityCounts.warning} color="text-amber-400" />
        <StatCard label="Info Items" value={severityCounts.info} color="text-blue-400" />
      </div>

      <SectionCard title="Audited URL" icon={Globe}>
        <p className="text-sm text-blue-200/70 font-mono break-all">{url}</p>
        {loadTime && <p className="text-xs text-blue-200/40 mt-2">Load time: <span className={`font-bold ${loadTime < 2 ? "text-emerald-400" : loadTime < 4 ? "text-amber-400" : "text-red-400"}`}>{loadTime}s</span></p>}
      </SectionCard>

      {categories && (
        <SectionCard title="Category Scores" icon={BarChart2}>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categories).map(([cat, val]: [string, any]) => {
              const pct = val as number;
              const col = pct >= 80 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171";
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1 capitalize">
                    <span className="text-blue-200/60">{cat}</span>
                    <span className="font-black" style={{ color: col }}>{pct}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: col }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {issues.length > 0 && (
        <SectionCard title={`Issues Found (${issues.length})`} icon={AlertCircle}>
          <div className="space-y-2">
            {issues.slice(0, 15).map((iss: any, i: number) => {
              const sevColors = { critical: "text-red-400 bg-red-500/10 border-red-500/20", warning: "text-amber-400 bg-amber-500/10 border-amber-500/20", info: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
              const sev = iss.severity as keyof typeof sevColors;
              const Icon = sev === "critical" ? XCircle : sev === "warning" ? AlertCircle : Info;
              return (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${sevColors[sev] ?? sevColors.info}`}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90">{iss.message}</p>
                    {iss.count > 1 && <p className="text-xs text-blue-200/40 mt-0.5">{iss.count} instances</p>}
                  </div>
                  <span className="text-xs font-bold capitalize flex-shrink-0">{iss.severity}</span>
                </div>
              );
            })}
            {issues.length > 15 && <p className="text-xs text-blue-200/30 text-center pt-2">+ {issues.length - 15} more issues</p>}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function AIContentReportView({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const content = data?.content ?? data;
  const topic = data?.topic ?? "N/A";
  const keyword = data?.keyword ?? "N/A";
  const settings = data?.settings ?? {};

  function copyAll() {
    const full = [
      `# ${content?.title}`,
      `\nMeta: ${content?.metaDescription}`,
      `\n## Introduction\n${content?.introduction}`,
      ...(content?.sections ?? []).map((s: any) => `\n## ${s.heading}\n${s.content}`),
      `\n## Conclusion\n${content?.conclusion}`,
    ].join("\n");
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="SEO Score" value={`${content?.seoScore ?? "--"}/100`} color={content?.seoScore >= 85 ? "text-emerald-400" : "text-amber-400"} />
        <StatCard label="Word Count" value={content?.wordCount?.toLocaleString() ?? "--"} color="text-blue-400" />
        <StatCard label="Reading Time" value={`${content?.readingTime ?? "--"} min`} color="text-cyan-400" />
        <StatCard label="Sections" value={content?.sections?.length ?? "--"} color="text-purple-400" />
      </div>

      <SectionCard title="Content Settings" icon={PenTool}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: "Topic", value: topic },
            { label: "Target Keyword", value: keyword },
            { label: "Tone", value: settings?.tone ?? "N/A" },
            { label: "Content Type", value: settings?.contentType ?? "N/A" },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3">
              <div className="text-blue-200/40 mb-1 capitalize">{item.label}</div>
              <div className="text-white font-semibold capitalize">{item.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {content?.keywords?.length > 0 && (
        <SectionCard title="Target Keywords" icon={Key}>
          <div className="flex flex-wrap gap-2">
            {content.keywords.map((kw: string) => (
              <span key={kw} className="text-xs px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 font-semibold">{kw}</span>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Generated Content" icon={Sparkles}>
        <div className="flex justify-end mb-4">
          <button onClick={copyAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${copied ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-blue-200/60 hover:text-white hover:bg-white/10"}`}>
            {copied ? <><CheckCircle2 className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy All</>}
          </button>
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-xs text-blue-400/60 font-semibold uppercase tracking-wider mb-2">Title</p>
            <h2 className="text-lg font-black text-white leading-tight">{content?.title}</h2>
          </div>
          {content?.metaDescription && (
            <div className="bg-blue-900/20 border border-blue-500/15 rounded-xl p-4">
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Meta Description</p>
              <p className="text-sm text-blue-200/70">{content.metaDescription}</p>
              <p className={`text-xs mt-1 font-semibold ${content.metaDescription.length <= 160 ? "text-emerald-400" : "text-red-400"}`}>
                {content.metaDescription.length}/160 characters
              </p>
            </div>
          )}
          {content?.introduction && (
            <div>
              <p className="text-xs text-blue-200/40 font-semibold uppercase tracking-wider mb-2">Introduction</p>
              <p className="text-sm text-blue-100/80 leading-relaxed">{content.introduction}</p>
            </div>
          )}
          {(content?.sections ?? []).map((sec: any, i: number) => (
            <div key={i}>
              <h3 className="text-base font-black text-white mb-2">{sec.heading}</h3>
              <p className="text-sm text-blue-100/70 leading-relaxed">{sec.content}</p>
            </div>
          ))}
          {content?.conclusion && (
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-blue-200/40 font-semibold uppercase tracking-wider mb-2">Conclusion</p>
              <p className="text-sm text-blue-100/80 leading-relaxed">{content.conclusion}</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function GenericReportView({ data, reportType }: { data: any; reportType: string }) {
  if (!data) return <p className="text-blue-200/40 text-sm">No data available for this report.</p>;

  function renderValue(val: any, depth = 0): React.ReactNode {
    if (val === null || val === undefined) return <span className="text-blue-200/30 text-xs">N/A</span>;
    if (typeof val === "boolean") return <span className={val ? "text-emerald-400" : "text-red-400"}>{val ? "Yes" : "No"}</span>;
    if (typeof val === "number") return <span className="text-white font-bold">{val.toLocaleString()}</span>;
    if (typeof val === "string") return <span className="text-blue-100/80">{val.length > 120 ? val.substring(0, 120) + "..." : val}</span>;
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-blue-200/30 text-xs">Empty</span>;
      if (depth > 1) return <span className="text-blue-200/50 text-xs">[{val.length} items]</span>;
      return (
        <div className="space-y-1 mt-1">
          {val.slice(0, 5).map((item, i) => (
            <div key={i} className="pl-3 border-l border-white/10 text-xs">{renderValue(item, depth + 1)}</div>
          ))}
          {val.length > 5 && <div className="text-xs text-blue-200/30 pl-3">+ {val.length - 5} more</div>}
        </div>
      );
    }
    if (typeof val === "object") {
      if (depth > 2) return <span className="text-blue-200/40 text-xs">[Object]</span>;
      return (
        <div className="space-y-2 mt-1">
          {Object.entries(val).slice(0, 10).map(([k, v]) => (
            <div key={k} className="flex gap-2 text-xs">
              <span className="text-blue-200/40 capitalize font-semibold min-w-[100px] flex-shrink-0">{k.replace(/_/g, " ")}:</span>
              <span>{renderValue(v, depth + 1)}</span>
            </div>
          ))}
          {Object.keys(val).length > 10 && <div className="text-xs text-blue-200/30">+ {Object.keys(val).length - 10} more fields</div>}
        </div>
      );
    }
    return <span className="text-blue-200/60 text-xs">{String(val)}</span>;
  }

  return (
    <SectionCard title="Report Data" icon={FileText}>
      <div className="space-y-3">
        {typeof data === "object" && !Array.isArray(data)
          ? Object.entries(data).map(([key, val]) => (
              <div key={key} className="py-2 border-b border-white/5 last:border-0">
                <span className="text-xs font-bold text-blue-200/50 uppercase tracking-wider capitalize block mb-1">
                  {key.replace(/_/g, " ")}
                </span>
                {renderValue(val)}
              </div>
            ))
          : renderValue(data)
        }
      </div>
    </SectionCard>
  );
}

export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    loadReport();
  }, [user, id]);

  async function loadReport() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      setReport(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!report) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("reports").delete().eq("id", report.id).eq("user_id", user!.id);
      if (error) throw error;
      navigate("/app/reports");
    } catch (err: any) {
      setError(err.message ?? "Failed to delete report.");
    } finally {
      setDeleting(false);
    }
  }

  function handleExport() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "-").toLowerCase()}-${report.id.substring(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const fadeUp = shouldReduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-6 bg-white/5 rounded w-48 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-xl animate-pulse" />)}
          </div>
          <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
        <p className="text-blue-200/50 text-sm mb-6">{error ?? "This report does not exist or you do not have access to it."}</p>
        <button onClick={() => navigate("/app/reports")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all">
          <ArrowLeft className="w-4 h-4" />Back to Reports
        </button>
      </div>
    );
  }

  const cfg = getTypeCfg(report.report_type);

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-8 md:px-8">
      {/* Back + Actions */}
      <motion.div {...fadeUp} className="flex items-center justify-between gap-4 mb-6">
        <button onClick={() => navigate("/app/reports")}
          className="inline-flex items-center gap-2 text-sm text-blue-200/60 hover:text-white transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4" />Back to Reports
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/60 hover:text-white text-sm font-semibold transition-all">
            <Download className="w-4 h-4" />Export JSON
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-bold transition-all disabled:opacity-60">
            {deleting ? <><RefreshCw className="w-4 h-4 animate-spin" />Deleting...</> : <><Trash2 className="w-4 h-4" />Delete</>}
          </button>
        </div>
      </motion.div>

      {/* Report Header */}
      <motion.div {...fadeUp} className={`mb-8 rounded-2xl border p-6 bg-gradient-to-br ${cfg.gradient} ${cfg.border} backdrop-blur-sm`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.border}`}>
            <cfg.icon className={`w-7 h-7 ${cfg.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
            <h1 className="text-xl font-black text-white leading-tight mb-2">{report.title}</h1>
            <div className="flex items-center gap-3 text-xs text-blue-200/40">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Created {new Date(report.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                ID: {report.id.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Content */}
      <motion.div initial={shouldReduce ? {} : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        {report.report_type === "site_audit" && <AuditReportView data={report.data} />}
        {report.report_type === "ai_content" && <AIContentReportView data={report.data} />}
        {!["site_audit", "ai_content"].includes(report.report_type) && (
          <GenericReportView data={report.data} reportType={report.report_type} />
        )}
      </motion.div>

      {/* Bottom Actions */}
      <motion.div initial={shouldReduce ? {} : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap gap-3">
        <button onClick={() => navigate("/app/reports")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200/60 hover:text-white text-sm font-semibold transition-all">
          <ArrowLeft className="w-4 h-4" />Back to Reports
        </button>
        <button onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
          <Download className="w-4 h-4" />Export This Report
        </button>
      </motion.div>
    </div>
  );
}
