import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"
import { runSiteAudit, AuditResult } from "../../utils/auditService"
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Clock,
  FileText,
  Code2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RefreshCw,
  type LucideIcon,
} from "lucide-react"

type AuditCategory = "all" | "on-page" | "technical" | "performance" | "content"

const categoryColors: Record<Exclude<AuditCategory, "all">, string> = {
  "on-page": "bg-blue-500/10 text-blue-600 border-blue-200",
  technical: "bg-purple-500/10 text-purple-600 border-purple-200",
  performance: "bg-amber-500/10 text-amber-600 border-amber-200",
  content: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
}

const categoryIcons: Record<Exclude<AuditCategory, "all">, LucideIcon> = {
  "on-page": FileText,
  technical: Code2,
  performance: Clock,
  content: Globe,
}

const categories: AuditCategory[] = ["all", "on-page", "technical", "content", "performance"]

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="-rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold" style={{ color }}>
          {score}
        </div>
        <div className="text-xs text-muted-foreground">/ 100</div>
      </div>
    </div>
  )
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Audit failed. Please try again."
}

export default function SiteAudit() {
  const { user } = useAuth()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [activeCategory, setActiveCategory] = useState<AuditCategory>("all")
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)

  const handleRunAudit = async () => {
    if (!user) {
      setError("You must be logged in.")
      return
    }

    if (!url.trim()) {
      setError("Please enter a URL.")
      return
    }

    setLoading(true)
    setMessage("")
    setError("")
    setResult(null)
    setExpandedIssue(null)
    setActiveCategory("all")

    try {
      const auditResult = await runSiteAudit(url.trim())
      setResult(auditResult)

      const { error: auditError } = await supabase.from("audits").insert({
        user_id: user.id,
        target_url: auditResult.url,
        status: "completed",
        score: auditResult.score,
        summary: { issues: auditResult.issues, summary: auditResult.summary },
      })

      if (auditError) {
        throw new Error(`Audit saved locally, but database save failed: ${auditError.message}`)
      }

      const { error: reportError } = await supabase.from("reports").insert({
        user_id: user.id,
        title: `Site Audit - ${auditResult.url}`,
        report_type: "site-audit",
        data: auditResult,
      })

      if (reportError) {
        throw new Error(`Audit completed, but report save failed: ${reportError.message}`)
      }

      setMessage("Audit completed and saved successfully.")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const filteredIssues = result
    ? activeCategory === "all"
      ? result.issues
      : result.issues.filter((i) => i.category === activeCategory)
    : []

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Audit</h1>
        <p className="mt-1 text-muted-foreground">
          Run a full technical SEO audit and get actionable recommendations.
        </p>
      </div>

      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter URL (e.g. https://example.com)"
              className="h-14 pl-12 text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunAudit()}
            />
          </div>

          <Button variant="premium" className="h-14 px-8" onClick={handleRunAudit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Run Audit
              </span>
            )}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}
      </Card>

      {loading && (
        <Card className="flex flex-col items-center justify-center gap-4 p-12">
          <RotateCcw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Crawling and analyzing your page...</p>
          <p className="text-sm text-muted-foreground">This may take a few seconds</p>
        </Card>
      )}

      {result && !loading && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="flex flex-col items-center justify-center gap-2 p-6 md:row-span-1">
              <p className="text-sm font-medium text-muted-foreground">Health Score</p>
              <ScoreRing score={result.score} />
              <p className="text-center text-xs text-muted-foreground">
                {result.score >= 80 ? "Great! Keep it up." : result.score >= 50 ? "Needs some work." : "Critical issues found."}
              </p>
            </Card>

            <Card className="flex flex-col justify-center gap-1 p-6">
              <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
              <p className="text-4xl font-bold text-red-500">{result.summary.critical}</p>
              <p className="text-xs text-muted-foreground">Needs urgent attention</p>
            </Card>

            <Card className="flex flex-col justify-center gap-1 p-6">
              <p className="text-sm font-medium text-muted-foreground">Warnings</p>
              <p className="text-4xl font-bold text-amber-500">{result.summary.warnings}</p>
              <p className="text-xs text-muted-foreground">Optimization opportunities</p>
            </Card>

            <Card className="flex flex-col justify-center gap-1 p-6">
              <p className="text-sm font-medium text-muted-foreground">Passed Checks</p>
              <p className="text-4xl font-bold text-emerald-500">{result.summary.good}</p>
              <p className="text-xs text-muted-foreground">Out of {result.summary.total} total checks</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="space-y-3 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Page Meta
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Title: </span>
                  <span className="font-medium">{result.meta.title || "Not found"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Description: </span>
                  <span className="font-medium">
                    {result.meta.description ? result.meta.description.slice(0, 80) + "..." : "Not found"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">H1: </span>
                  <span className="font-medium">{result.meta.h1 || "Not found"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Language: </span>
                  <span className="font-medium">{result.meta.language || "Not set"}</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-3 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Code2 className="h-4 w-4 text-primary" />
                Technical
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Canonical: </span>
                  <span className="font-medium">{result.meta.canonical || "Not set"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Robots: </span>
                  <span className="font-medium">{result.meta.robots || "Not set"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">HTTPS: </span>
                  <span className="font-medium">{result.url.startsWith("https") ? "Yes" : "No"}</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-3 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Load Time: </span>
                  <span className="font-medium">{result.performance.loadTime}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Page Size: </span>
                  <span className="font-medium">{result.performance.pageSize}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Links Found: </span>
                  <span className="font-medium">{result.performance.requests}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b bg-muted/20 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <h3 className="font-semibold text-lg">Audit Results</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      activeCategory === cat
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat === "all" ? `All (${result.issues.length})` : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((item, index) => {
                  const CategoryIcon = categoryIcons[item.category]
                  return (
                    <div
                      key={`${item.issue}-${index}`}
                      className="cursor-pointer p-5 transition-colors hover:bg-muted/10"
                      onClick={() => setExpandedIssue(expandedIssue === index ? null : index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          {item.status === "good" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                          {item.status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                          {item.status === "critical" && <ShieldAlert className="h-5 w-5 text-red-500" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-medium">{item.issue}</h4>
                            <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs capitalize ${categoryColors[item.category]}`}>
                              <CategoryIcon className="h-3 w-3" />
                              {item.category}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>

                          {expandedIssue === index && (
                            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                              <p className="mb-1 font-medium text-primary">Recommendation</p>
                              <p className="text-muted-foreground">{item.recommendation}</p>
                            </div>
                          )}
                        </div>

                        <div className="text-muted-foreground">
                          {expandedIssue === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No issues found for the selected filter.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
