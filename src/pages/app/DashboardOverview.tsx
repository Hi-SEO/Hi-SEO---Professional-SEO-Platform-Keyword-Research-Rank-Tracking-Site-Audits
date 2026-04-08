import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import {
  ArrowUpRight,
  Globe,
  Search,
  Activity,
  Zap,
  FileText,
  Link2,
  Target,
  CheckCircle2,
  FolderOpen,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

type ProjectRow = {
  id: string
  name: string
  domain: string | null
  created_at: string
}

type AuditRow = {
  id: string
  target_url: string | null
  score: number | null
  status: string | null
  created_at: string
}

type ReportRow = {
  id: string
  title: string
  report_type: string
  created_at: string
}

type WeeklyDataPoint = {
  name: string
  audits: number
  keywords: number
  backlinks: number
}

type MetricCardProps = {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  color: string
  bg: string
  onClick: () => void
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-500"
  if (score >= 50) return "text-amber-500"
  return "text-red-500"
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 50) return "bg-amber-500"
  return "bg-red-500"
}

function getStatusBadge(status: string | null) {
  const s = (status || "").toLowerCase()
  if (s.includes("done") || s.includes("complete") || s.includes("success")) return "bg-emerald-100 text-emerald-700"
  if (s.includes("error") || s.includes("failed")) return "bg-red-100 text-red-700"
  return "bg-amber-100 text-amber-700"
}

function getLast7Days(): string[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const result: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result.push(days[d.getDay()])
  }
  return result
}

export default function DashboardOverview() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [projectCount, setProjectCount] = useState(0)
  const [keywordCount, setKeywordCount] = useState(0)
  const [auditCount, setAuditCount] = useState(0)
  const [reportCount, setReportCount] = useState(0)
  const [backlinkCount, setBacklinkCount] = useState(0)
  const [rankCount, setRankCount] = useState(0)

  const [recentProjects, setRecentProjects] = useState<ProjectRow[]>([])
  const [recentAudits, setRecentAudits] = useState<AuditRow[]>([])
  const [recentReports, setRecentReports] = useState<ReportRow[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let mounted = true

    const loadDashboardData = async () => {
      if (!user) {
        if (mounted) setLoading(false)
        return
      }

      setLoading(true)
      setError("")

      try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const sevenDaysAgoISO = sevenDaysAgo.toISOString()

        const [
          projectsResult,
          keywordsResult,
          auditsResult,
          reportsResult,
          backlinksResult,
          ranksResult,
          recentProjectsResult,
          recentAuditsResult,
          recentReportsResult,
          weeklyAuditsResult,
          weeklyKeywordsResult,
          weeklyBacklinksResult,
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("keywords").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("audits").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("reports").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("backlinks").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("rank_tracker").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("projects").select("id, name, domain, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4),
          supabase.from("audits").select("id, target_url, score, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("reports").select("id, title, report_type, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("audits").select("created_at").eq("user_id", user.id).gte("created_at", sevenDaysAgoISO),
          supabase.from("keywords").select("created_at").eq("user_id", user.id).gte("created_at", sevenDaysAgoISO),
          supabase.from("backlinks").select("created_at").eq("user_id", user.id).gte("created_at", sevenDaysAgoISO),
        ])

        if (!mounted) return

        setProjectCount(projectsResult.count || 0)
        setKeywordCount(keywordsResult.count || 0)
        setAuditCount(auditsResult.count || 0)
        setReportCount(reportsResult.count || 0)
        setBacklinkCount(backlinksResult.count || 0)
        setRankCount(ranksResult.count || 0)

        setRecentProjects(recentProjectsResult.data || [])
        setRecentAudits(recentAuditsResult.data || [])
        setRecentReports(recentReportsResult.data || [])

        const dayLabels = getLast7Days()
        const auditsByDay = new Array(7).fill(0)
        const keywordsByDay = new Array(7).fill(0)
        const backlinksByDay = new Array(7).fill(0)

        const today = new Date()
        today.setHours(23, 59, 59, 999)

        ;(weeklyAuditsResult.data || []).forEach((row: { created_at: string }) => {
          const d = new Date(row.created_at)
          const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays >= 0 && diffDays < 7) auditsByDay[6 - diffDays]++
        })

        ;(weeklyKeywordsResult.data || []).forEach((row: { created_at: string }) => {
          const d = new Date(row.created_at)
          const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays >= 0 && diffDays < 7) keywordsByDay[6 - diffDays]++
        })

        ;(weeklyBacklinksResult.data || []).forEach((row: { created_at: string }) => {
          const d = new Date(row.created_at)
          const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays >= 0 && diffDays < 7) backlinksByDay[6 - diffDays]++
        })

        setWeeklyData(
          dayLabels.map((name, i) => ({
            name,
            audits: auditsByDay[i],
            keywords: keywordsByDay[i],
            backlinks: backlinksByDay[i],
          }))
        )
      } catch (err) {
        console.error("Error loading dashboard:", err)
        if (mounted) setError("Failed to load dashboard data. Please try again.")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDashboardData()

    return () => {
      mounted = false
    }
  }, [user, reloadKey])

  const quickActions = [
    { label: "Run Site Audit", icon: Zap, href: "/app/site-audit", color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" },
    { label: "Explore Keywords", icon: Search, href: "/app/keyword-explorer", color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" },
    { label: "Track Rankings", icon: Target, href: "/app/rank-tracker", color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" },
    { label: "Backlink Analysis", icon: Link2, href: "/app/backlinks", color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" },
    { label: "Site Explorer", icon: Globe, href: "/app/site-explorer", color: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20" },
    { label: "View Reports", icon: FileText, href: "/app/reports", color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20" },
  ]

  const checklistItems = [
    { label: "Run a site audit", done: auditCount > 0, icon: Zap, href: "/app/site-audit" },
    { label: "Research keywords", done: keywordCount > 0, icon: Search, href: "/app/keyword-explorer" },
    { label: "Create a project", done: projectCount > 0, icon: FolderOpen, href: "/app/projects" },
    { label: "Track rankings", done: rankCount > 0, icon: Target, href: "/app/rank-tracker" },
    { label: "Analyze backlinks", done: backlinkCount > 0, icon: Link2, href: "/app/backlinks" },
    { label: "Save a report", done: reportCount > 0, icon: FileText, href: "/app/reports" },
  ]

  const completedItems = checklistItems.filter((item) => item.done).length
  const checklistPercent = Math.round((completedItems / checklistItems.length) * 100)

  const getReportTypeIcon = (type: string) => {
    if (type === "site-audit") return <Zap className="h-4 w-4 text-blue-500" />
    if (type === "keyword-explorer") return <Search className="h-4 w-4 text-purple-500" />
    if (type === "rank-tracker") return <Target className="h-4 w-4 text-amber-500" />
    if (type === "backlink-analytics") return <Link2 className="h-4 w-4 text-emerald-500" />
    return <FileText className="h-4 w-4 text-muted-foreground" />
  }

  const getReportTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "site-audit": "Site Audit",
      "keyword-explorer": "Keyword Research",
      "rank-tracker": "Rank Tracker",
      "backlink-analytics": "Backlink Analysis",
    }
    return map[type] || type
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Premium SEO workspace
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            {getGreeting()}, {profile?.full_name ? profile.full_name.split(" ")[0] : user?.email ? user.email.split("@")[0] : "there"}!
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Here is your SEO workspace overview for today. Track progress, open tools fast, and see what needs attention next.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/app/reports")}>
            <FileText className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button variant="premium" onClick={() => navigate("/app/site-audit")}>
            <Zap className="mr-2 h-4 w-4" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Hero summary */}
      <Card className="overflow-hidden border-border/60 bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 shadow-sm backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="text-sm font-medium text-primary">Workspace status</p>
            <h2 className="mt-2 text-2xl font-bold">Everything you need to manage SEO in one place</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Use this dashboard to see your activity, open your most important tools, and keep your SEO process organized and easy to follow.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { label: "Projects", value: projectCount },
                { label: "Audits", value: auditCount },
                { label: "Keywords", value: keywordCount },
                { label: "Reports", value: reportCount },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border bg-background/70 px-4 py-2">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold">{loading ? "..." : item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Setup progress</p>
              <p className="mt-1 text-3xl font-black">{checklistPercent}%</p>
              <p className="text-sm text-muted-foreground">
                {completedItems} of {checklistItems.length} tasks complete
              </p>
            </div>
            <div className="rounded-2xl border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="mt-1 text-2xl font-bold capitalize">{profile?.plan || "free"}</p>
              <p className="text-sm text-muted-foreground">Your current workspace plan</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">Could not load dashboard data</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        <MetricCard
          title="Projects"
          value={loading ? "..." : String(projectCount)}
          subtitle="Active workspaces"
          icon={FolderOpen}
          color="text-blue-500"
          bg="bg-blue-500/10"
          onClick={() => navigate("/app/projects")}
        />
        <MetricCard
          title="Saved Keywords"
          value={loading ? "..." : String(keywordCount)}
          subtitle="Tracked keywords"
          icon={Search}
          color="text-purple-500"
          bg="bg-purple-500/10"
          onClick={() => navigate("/app/keyword-explorer")}
        />
        <MetricCard
          title="Audits Run"
          value={loading ? "..." : String(auditCount)}
          subtitle="SEO audits completed"
          icon={Zap}
          color="text-amber-500"
          bg="bg-amber-500/10"
          onClick={() => navigate("/app/site-audit")}
        />
        <MetricCard
          title="Reports Saved"
          value={loading ? "..." : String(reportCount)}
          subtitle="Total reports saved"
          icon={BarChart3}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
          onClick={() => navigate("/app/reports")}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Jump into your most used SEO tools.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.href}
                onClick={() => navigate(action.href)}
                className={"flex flex-col items-center gap-2 rounded-xl border border-transparent p-4 transition-all hover:border-border hover:shadow-sm " + action.color}
              >
                <Icon className="h-6 w-6" />
                <span className="text-center text-xs font-medium">{action.label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Weekly Activity</h3>
            <p className="text-sm text-muted-foreground">Audits, keywords, and backlinks this week.</p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Legend />
                <Bar dataKey="audits" name="Audits" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="keywords" name="Keywords" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="backlinks" name="Backlinks" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold">SEO Setup Progress</h3>
          <p className="mb-4 text-sm text-muted-foreground">Complete your workspace setup.</p>

          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - checklistPercent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{checklistPercent}%</span>
                <span className="text-xs text-muted-foreground">Complete</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {completedItems} of {checklistItems.length} tasks done
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
            <h3 className="font-semibold">Recent Projects</h3>
            <button onClick={() => navigate("/app/projects")} className="text-xs text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : recentProjects.length > 0 ? (
              recentProjects.map((row) => (
                <div key={row.id} className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{row.domain || "No domain"}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No projects yet.
                <button onClick={() => navigate("/app/projects")} className="mx-auto mt-2 block text-xs text-primary hover:underline">
                  Create your first project
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
            <h3 className="font-semibold">Recent Audits</h3>
            <button onClick={() => navigate("/app/site-audit")} className="text-xs text-primary hover:underline">
              Run new
            </button>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : recentAudits.length > 0 ? (
              recentAudits.map((row) => (
                <div key={row.id} className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/10">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.target_url || "Unknown URL"}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {row.score !== null && (
                        <>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className={"h-full rounded-full " + getScoreBg(row.score)}
                              style={{ width: `${row.score}%` }}
                            />
                          </div>
                          <span className={"text-xs font-medium " + getScoreColor(row.score)}>
                            {row.score}/100
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={"rounded-full px-2 py-1 text-xs font-medium " + getStatusBadge(row.status)}>
                    {row.status || "done"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No audits yet.
                <button onClick={() => navigate("/app/site-audit")} className="mx-auto mt-2 block text-xs text-primary hover:underline">
                  Run your first audit
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
            <h3 className="font-semibold">Recent Reports</h3>
            <button onClick={() => navigate("/app/reports")} className="text-xs text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : recentReports.length > 0 ? (
              recentReports.map((row) => (
                <div key={row.id} className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    {getReportTypeIcon(row.report_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{getReportTypeLabel(row.report_type)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No reports yet.
                <button onClick={() => navigate("/app/reports")} className="mx-auto mt-2 block text-xs text-primary hover:underline">
                  View reports
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* SEO Checklist */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Activity className="h-5 w-5 text-primary" />
          SEO Health Checklist
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {checklistItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-sm " +
                  (item.done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-border bg-muted/20 hover:bg-muted/40")
                }
              >
                {item.done ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                ) : (
                  <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-muted-foreground/30" />
                )}
                <div className="flex items-center gap-2">
                  <Icon className={"h-4 w-4 " + (item.done ? "text-emerald-500" : "text-muted-foreground")} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, color, bg, onClick }: MetricCardProps) {
  return (
    <Card className="cursor-pointer p-6 transition-all hover:shadow-md group" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className={"flex h-10 w-10 items-center justify-center rounded-xl " + bg + " transition-transform group-hover:scale-110"}>
          <Icon className={"h-5 w-5 " + color} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>
        <p className="mt-1 text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card>
  )
}
