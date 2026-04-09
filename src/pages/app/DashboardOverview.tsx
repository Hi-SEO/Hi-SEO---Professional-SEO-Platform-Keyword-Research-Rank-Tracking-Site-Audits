import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { useAuth } from "../../context/AuthContext"
import { getDashboardData } from "../../lib/supabase"
import type { DbProject, DbAudit, DbReport, DbKeyword } from "../../lib/supabase"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
})

interface DashStats {
  projects: DbProject[]
  keywords: DbKeyword[]
  audits: DbAudit[]
  reports: DbReport[]
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getWeeklyData(audits: DbAudit[], keywords: DbKeyword[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const now = new Date()
  return days.map((day, i) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (6 - i))
    const dayAudits = audits.filter((a) => {
      const d = new Date(a.created_at)
      return d.toDateString() === date.toDateString()
    }).length
    const dayKeywords = keywords.filter((k) => {
      const d = new Date(k.created_at)
      return d.toDateString() === date.toDateString()
    }).length
    return { day, audits: dayAudits, keywords: dayKeywords, total: dayAudits + dayKeywords }
  })
}

const QUICK_ACTIONS = [
  { label: "New Site Audit", href: "/app/site-audit", icon: "shield", color: "#06b6d4", desc: "Check your site health" },
  { label: "Keyword Research", href: "/app/keyword-explorer", icon: "search", color: "#3b82f6", desc: "Find ranking opportunities" },
  { label: "Track Rankings", href: "/app/rank-tracker", icon: "trending", color: "#f97316", desc: "Monitor positions" },
  { label: "Analyze Backlinks", href: "/app/backlinks", icon: "link", color: "#a855f7", desc: "Review your link profile" },
  { label: "Competitor Analysis", href: "/app/competitors", icon: "users", color: "#10b981", desc: "Spy on competitors" },
  { label: "AI Writer", href: "/app/ai-writer", icon: "zap", color: "#f59e0b", desc: "Generate SEO content" },
]

function QuickActionIcon({ type, color }: { type: string; color: string }) {
  const props = { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <>
      {type === "shield" && <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      {type === "search" && <svg {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>}
      {type === "trending" && <svg {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>}
      {type === "link" && <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
      {type === "users" && <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
      {type === "zap" && <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
    </>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="h-3 rounded w-1/2 mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="h-8 rounded w-1/3 mb-2" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="h-2 rounded w-2/3" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-xl text-xs font-semibold" style={{ background: "#0f2040", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}>
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardOverview() {
  const { user, profile } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getDashboardData(user.id)
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load dashboard data")
        setLoading(false)
      })
  }, [user])

  const weeklyData = stats ? getWeeklyData(stats.audits, stats.keywords) : []
  const recentProjects = stats?.projects.slice(0, 4) || []
  const recentAudits = stats?.audits.slice(0, 4) || []

  const checklistItems = [
    { label: "Create your first project", done: (stats?.projects.length || 0) > 0, href: "/app/projects" },
    { label: "Run a site audit", done: (stats?.audits.length || 0) > 0, href: "/app/site-audit" },
    { label: "Research keywords", done: (stats?.keywords.length || 0) > 0, href: "/app/keyword-explorer" },
    { label: "Set up rank tracking", done: false, href: "/app/rank-tracker" },
    { label: "Analyze your backlinks", done: false, href: "/app/backlinks" },
    { label: "Upgrade your plan", done: profile?.plan !== "free", href: "/app/billing" },
  ]

  const completedChecklist = checklistItems.filter((i) => i.done).length
  const checklistProgress = Math.round((completedChecklist / checklistItems.length) * 100)

  const METRIC_CARDS = [
    {
      label: "Projects",
      value: loading ? "-" : stats?.projects.length ?? 0,
      icon: "folder",
      color: "#3b82f6",
      href: "/app/projects",
      change: null,
    },
    {
      label: "Saved Keywords",
      value: loading ? "-" : stats?.keywords.length ?? 0,
      icon: "tag",
      color: "#06b6d4",
      href: "/app/keyword-explorer",
      change: null,
    },
    {
      label: "Audits Run",
      value: loading ? "-" : stats?.audits.length ?? 0,
      icon: "shield",
      color: "#f97316",
      href: "/app/site-audit",
      change: null,
    },
    {
      label: "Reports",
      value: loading ? "-" : stats?.reports.length ?? 0,
      icon: "file",
      color: "#a855f7",
      href: "/app/reports",
      change: null,
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen" style={{ background: "#0b1729" }}>

      {/* HEADER */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {getGreeting()}, {profile?.full_name?.split(" ")[0] || "there"} 👋
          </h2>
          <p className="text-white/40 text-sm font-medium mt-1">
            Here is what is happening with your SEO today.
          </p>
        </div>
        <Link
          to="/app/site-audit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] shrink-0"
          style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 16px rgba(249,115,22,0.4)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Run New Audit
        </Link>
      </motion.div>

      {error && (
        <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          <span className="text-red-400 text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : METRIC_CARDS.map((card, i) => (
            <motion.div key={card.label} {...fadeUp(i * 0.08)}>
              <Link
                to={card.href}
                className="block rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `${card.color}08` }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">{card.label}</p>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${card.color}18` }}>
                      {card.icon === "folder" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
                      {card.icon === "tag" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>}
                      {card.icon === "shield" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                      {card.icon === "file" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">{card.value}</div>
                </div>
              </Link>
            </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* WEEKLY CHART */}
        <motion.div {...fadeUp(0.15)} className="lg:col-span-2 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-white">Weekly SEO Activity</h3>
              <p className="text-xs text-white/40 font-medium mt-0.5">Audits and keywords this week</p>
            </div>
          </div>
          {loading ? (
            <div className="h-48 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ) : weeklyData.every((d) => d.total === 0) ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <p className="text-sm text-white/30 font-medium">No activity yet this week</p>
              <Link to="/app/site-audit" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Run your first audit</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="audits" name="Audits" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="keywords" name="Keywords" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* SEO CHECKLIST */}
        <motion.div {...fadeUp(0.2)} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-black text-white">SEO Setup</h3>
            <span className="text-xs font-bold text-white/40">{completedChecklist}/{checklistItems.length}</span>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${checklistProgress}%`, background: "linear-gradient(90deg, #3b82f6, #06b6d4)" }}
              />
            </div>
            <p className="text-xs text-white/35 font-medium">{checklistProgress}% complete</p>
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 group"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: item.done ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                    border: item.done ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {item.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${item.done ? "text-white/40 line-through" : "text-white/70 group-hover:text-white"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}
      <motion.div {...fadeUp(0.25)}>
        <h3 className="text-base font-black text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div key={action.label} {...fadeUp(i * 0.06)}>
              <Link
                to={action.href}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 group"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${action.color}18`, border: `1px solid ${action.color}25` }}
                >
                  <QuickActionIcon type={action.icon} color={action.color} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/80 leading-tight">{action.label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 font-medium">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT PROJECTS */}
        <motion.div {...fadeUp(0.3)} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <h3 className="text-sm font-black text-white">Recent Projects</h3>
            <Link to="/app/projects" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">View all</Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm text-white/30 font-medium">No projects yet</p>
              <Link to="/app/projects" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Create your first project</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/3 transition-colors">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #1d4ed8, #06b6d4)" }}
                  >
                    {project.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white/85 truncate">{project.name}</p>
                    <p className="text-xs text-white/35 font-medium truncate">{project.domain}</p>
                  </div>
                  <Link
                    to="/app/site-audit"
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors hover:bg-white/8"
                    style={{ color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}
                  >
                    Audit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* RECENT AUDITS */}
        <motion.div {...fadeUp(0.35)} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <h3 className="text-sm font-black text-white">Recent Audits</h3>
            <Link to="/app/site-audit" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">View all</Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : recentAudits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="text-sm text-white/30 font-medium">No audits run yet</p>
              <Link to="/app/site-audit" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Run your first audit</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentAudits.map((audit) => {
                const score = audit.score ?? 0
                const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
                return (
                  <div key={audit.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/3 transition-colors">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: `${scoreColor}18`, color: scoreColor, border: `1px solid ${scoreColor}25` }}
                    >
                      {score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/85 truncate">{audit.target_url}</p>
                      <p className="text-xs text-white/35 font-medium">
                        {new Date(audit.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        background: score >= 80 ? "rgba(16,185,129,0.12)" : score >= 60 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                        color: scoreColor,
                      }}
                    >
                      {score >= 80 ? "Good" : score >= 60 ? "Fair" : "Poor"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* UPGRADE BANNER */}
      {profile?.plan === "free" && (
        <motion.div
          {...fadeUp(0.4)}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,108,4,0.08))", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          <div className="absolute inset-0 bg-grid-overlay opacity-20" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white mb-1">Unlock the full power of Hi-SEO</h3>
              <p className="text-sm text-white/50 font-medium">Upgrade to Pro for unlimited audits, 100 tracked keywords, AI writer, and priority support.</p>
            </div>
            <Link
              to="/app/billing"
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)", boxShadow: "0 4px 16px rgba(249,115,22,0.4)" }}
            >
              Upgrade to Pro
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
