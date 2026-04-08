import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { runSiteAudit, AuditResult } from "../../utils/auditService"
import {
  Search,
  Globe,
  RotateCcw,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
} from "lucide-react"

function Metric({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"

  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={"h-2 rounded-full transition-all duration-1000 " + color}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    new URL(withProtocol)
    return withProtocol
  } catch {
    return ""
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Failed to analyze. Please try again."
}

export default function SiteExplorer() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    const normalizedUrl = normalizeUrl(url)

    if (!normalizedUrl) {
      setError("Please enter a valid domain or URL.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const data = await runSiteAudit(normalizedUrl)
      setResult(data)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-emerald-500" }
    if (score >= 60) return { label: "Good", color: "text-blue-500" }
    if (score >= 40) return { label: "Needs Work", color: "text-amber-500" }
    return { label: "Poor", color: "text-red-500" }
  }

  const scoreLabel = result ? getScoreLabel(result.score) : { label: "", color: "" }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Explorer</h1>
        <p className="mt-1 text-muted-foreground">
          Get an in-depth look at any website's SEO health, meta data, and page structure.
        </p>
      </div>

      <Card className="flex flex-col items-center gap-4 border-primary/20 bg-card p-4 shadow-soft md:flex-row">
        <div className="relative flex w-full flex-1 items-center">
          <Globe className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter domain or URL (e.g. https://example.com)"
            className="h-14 w-full border-border/50 bg-background pl-12 text-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>

        <Button
          variant="premium"
          className="h-14 w-full px-8 text-base md:w-auto"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 animate-spin" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Analyze
            </span>
          )}
        </Button>
      </Card>

      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError("")}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </Card>
      )}

      {loading && (
        <Card className="flex flex-col items-center justify-center gap-4 p-12">
          <RotateCcw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Exploring site structure...</p>
          <p className="text-sm text-muted-foreground">Fetching and analyzing page data</p>
        </Card>
      )}

      {result && !loading && (
        <>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-4">
            <Globe className="h-5 w-5 text-primary" />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {result.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-8 lg:grid-cols-4">
            <Metric
              title="SEO Score"
              value={`${result.score}/100`}
              subtitle={scoreLabel.label}
            />
            <Metric
              title="Total Checks"
              value={`${result.summary.total}`}
              subtitle="Issues analyzed"
            />
            <Metric
              title="Links Found"
              value={`${result.performance.requests}`}
              subtitle="Internal & external"
            />
            <Metric
              title="Page Size"
              value={result.performance.pageSize}
              subtitle={`Load: ${result.performance.loadTime}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                On-Page SEO
              </h3>
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title Tag</span>
                    <span className="font-medium">
                      {result.meta.title ? `${result.meta.title.length} chars` : "Missing"}
                    </span>
                  </div>
                  {result.meta.title && (
                    <p className="truncate text-xs text-muted-foreground">{result.meta.title}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meta Description</span>
                    <span className="font-medium">
                      {result.meta.description ? `${result.meta.description.length} chars` : "Missing"}
                    </span>
                  </div>
                  {result.meta.description && (
                    <p className="truncate text-xs text-muted-foreground">{result.meta.description}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">H1 Heading</span>
                  <span className="font-medium">{result.meta.h1 ? "Found" : "Missing"}</span>
                </div>
                {result.meta.h1 && (
                  <p className="truncate text-xs text-muted-foreground">{result.meta.h1}</p>
                )}
              </div>
            </Card>

            <Card className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Technical SEO
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HTTPS</span>
                  <span className={`font-medium ${result.url.startsWith("https") ? "text-emerald-500" : "text-red-500"}`}>
                    {result.url.startsWith("https") ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canonical</span>
                  <span className={`font-medium ${result.meta.canonical ? "text-emerald-500" : "text-amber-500"}`}>
                    {result.meta.canonical ? "Set" : "Missing"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Robots Meta</span>
                  <span className="font-medium">{result.meta.robots || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{result.meta.language || "Not set"}</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Globe className="h-4 w-4 text-primary" />
                Performance
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Load Time</span>
                  <span className="font-medium">{result.performance.loadTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Page Size</span>
                  <span className="font-medium">{result.performance.pageSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Links</span>
                  <span className="font-medium">{result.performance.requests}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="space-y-4 p-6">
            <h3 className="text-lg font-semibold">Overall SEO Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className={`font-bold ${scoreLabel.color}`}>
                  {result.score}/100 - {scoreLabel.label}
                </span>
              </div>
              <ScoreBar score={result.score} />
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-500/10 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Passed</p>
                  <p className="font-bold text-emerald-600">{result.summary.good}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-500/10 p-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                  <p className="font-bold text-amber-600">{result.summary.warnings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-500/10 p-3">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Critical</p>
                  <p className="font-bold text-red-600">{result.summary.critical}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="text-lg font-semibold">Detailed Findings</h3>
            </div>

            <div className="divide-y">
              {result.issues?.length ? (
                result.issues.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-5 transition-colors hover:bg-muted/10">
                    <div className="mt-0.5">
                      {item.status === "good" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {item.status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                      {item.status === "critical" && <ShieldAlert className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{item.issue}</h4>
                        <span className="rounded-full border bg-muted px-2 py-0.5 text-xs capitalize">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
                      <p className="mt-1 text-xs text-primary">{item.recommendation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No issues found in the analysis.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
