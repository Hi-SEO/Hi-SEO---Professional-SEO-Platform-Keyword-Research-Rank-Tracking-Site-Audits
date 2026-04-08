import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  FileText,
  Trash2,
  Search,
  Zap,
  Target,
  Link2,
  BarChart3,
  Users,
  Layers,
  RefreshCw,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"

type ReportRow = {
  id: string
  title: string
  report_type: string | null
  created_at: string
}

type ReportTypeConfig = {
  label: string
  icon: LucideIcon
  color: string
  bg: string
}

const reportTypeConfig: Record<string, ReportTypeConfig> = {
  "site-audit": { label: "Site Audit", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
  "keyword-explorer": { label: "Keyword Research", icon: Search, color: "text-purple-500", bg: "bg-purple-500/10" },
  "rank-tracker": { label: "Rank Tracker", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10" },
  "backlink-analytics": { label: "Backlink Analytics", icon: Link2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "content-strategy": { label: "Content Strategy", icon: Layers, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  "ai-writer": { label: "AI Writer", icon: FileText, color: "text-pink-500", bg: "bg-pink-500/10" },
  "serp-analysis": { label: "SERP Analysis", icon: BarChart3, color: "text-orange-500", bg: "bg-orange-500/10" },
  "competitor-analysis": { label: "Competitor Analysis", icon: Users, color: "text-red-500", bg: "bg-red-500/10" },
}

export default function Reports() {
  const { user } = useAuth()

  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [reportType, setReportType] = useState("all")
    const [reloadKey, setReloadKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const loadReports = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase
        .from("reports")
        .select("id, title, report_type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setReports(data || [])
    } catch (err) {
      console.error("Error loading reports:", err)
      setError("Failed to load reports. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reloadKey])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = reportType === "all" || report.report_type === reportType
      return matchesSearch && matchesType
    })
  }, [reports, search, reportType])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    reports.forEach((r) => {
      const type = r.report_type || "unknown"
      counts[type] = (counts[type] || 0) + 1
    })
    return counts
  }, [reports])

    const handleDelete = (id: string) => {
    if (!user) return
    setDeleteTarget(id)
  }

  const confirmDelete = async () => {
    if (!user || !deleteTarget) return

    setMessage("")
    setError("")

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", deleteTarget)
        .eq("user_id", user.id)

      if (error) throw error

      setReports((prev) => prev.filter((report) => report.id !== deleteTarget))
      setMessage("Report deleted successfully.")
      clearMessageSoon()
    } catch (err) {
      console.error("Error deleting report:", err)
      setError("Failed to delete report. Please try again.")
    } finally {
      setDeleteTarget(null)
    }
  }

  const visibleTypes = Object.entries(reportTypeConfig)

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-6 md:p-8">
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-xl font-semibold">Delete report?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone. The report will be removed from your workspace.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all saved SEO reports and generated outputs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <div className="text-sm text-muted-foreground">
            {reports.length} total reports saved
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Could not load reports</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Type Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {visibleTypes.slice(0, 4).map(([type, config]) => {
          const Icon = config.icon
          return (
            <Card
              key={type}
              className={[
                "flex cursor-pointer items-center gap-3 p-4 transition-all hover:shadow-md",
                reportType === type ? "ring-1 ring-primary" : "",
              ].join(" ")}
              onClick={() => setReportType(reportType === type ? "all" : type)}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{config.label}</p>
                <p className="text-xl font-bold">{typeCounts[type] || 0}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reports by title"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="all">All report types</option>
            {visibleTypes.map(([type, config]) => (
              <option key={type} value={type}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      {/* Reports List */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">
            Saved Reports
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {filteredReports.length} results
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading reports...</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No reports found. Start using the SEO tools to generate reports.
          </div>
        ) : (
          <div className="divide-y">
            {filteredReports.map((report) => {
              const config = reportTypeConfig[report.report_type || ""] || {
                label: report.report_type || "Unknown",
                icon: FileText,
                color: "text-muted-foreground",
                bg: "bg-muted",
              }

              const Icon = config.icon

              return (
                <div
                  key={report.id}
                  className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-muted/10 md:flex-row md:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="mt-0.5 text-sm text-muted-foreground">{config.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/app/reports/${report.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(report.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

