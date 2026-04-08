import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { analyzeBacklinks, BacklinkSummary } from "../../utils/backlinkService"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"
import {
  Search,
  Save,
  RotateCcw,
  Link2,
  Globe,
  Award,
  ShieldAlert,
  RefreshCw,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"

type Project = {
  id: string
  name: string
  domain: string | null
}

type BacklinkRow = BacklinkSummary["backlinks"][number]

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Failed to analyze backlinks. Please try again."
}

function MetricCard({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon
  title: string
  value: string | number
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  )
}

export default function BacklinkAnalytics() {
  const { user } = useAuth()

  const [domainInput, setDomainInput] = useState("digitaltoolkit.com.ng")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BacklinkSummary | null>(null)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [creatingProject, setCreatingProject] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(true)

  const loadProjects = async () => {
    if (!user) {
      setProjectsLoading(false)
      return
    }

    setProjectsLoading(true)

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, domain")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const rows = data || []
      setProjects(rows)

      if (rows.length > 0 && !selectedProjectId) {
        setSelectedProjectId(rows[0].id)
      }
    } catch (err) {
      console.error("Error loading projects:", err)
      setError("Failed to load projects.")
    } finally {
      setProjectsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reloadKey])

  const handleAnalyze = async () => {
    if (!domainInput.trim()) {
      setError("Please enter a domain")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")
    setData(null)

    try {
      const result = analyzeBacklinks(domainInput.trim())
      setData(result)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!user) {
      setError("You must be logged in.")
      return
    }

    if (!newProjectName.trim()) {
      setError("Please enter a project name.")
      return
    }

    setCreatingProject(true)
    setError("")
    setMessage("")

    try {
      const { data: newProject, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: newProjectName.trim(),
          domain: domainInput.trim() || null,
        })
        .select("id, name, domain")
        .single()

      if (error) throw error

      if (newProject) {
        setProjects((prev) => [newProject, ...prev])
        setSelectedProjectId(newProject.id)
        setNewProjectName("")
        setMessage("Project created successfully.")
      }
    } catch (err) {
      console.error("Error creating project:", err)
      setError("Failed to create project. Please try again.")
    } finally {
      setCreatingProject(false)
    }
  }

  const handleSaveReport = async () => {
    if (!user || !data) {
      setError("No data to save.")
      return
    }

    if (!selectedProjectId) {
      setError("Please select or create a project first.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        project_id: selectedProjectId,
        title: `Backlink Analysis - ${data.domain}`,
        report_type: "backlink-analytics",
        data,
      })

      if (error) throw error

      setMessage("Backlink report saved successfully.")
    } catch (err) {
      console.error("Error saving report:", err)
      setError("Failed to save report. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const backlinks: BacklinkRow[] = data?.backlinks || []

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backlink Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Analyze any website's backlink profile, authority, and link quality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={projectsLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Projects
          </Button>

          <Button onClick={handleSaveReport} disabled={saving || !data}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Report"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Backlink analytics error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Input Section */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter domain (e.g. example.com)"
              className="h-14 pl-12 text-lg"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
          </div>

          <Button
            variant="premium"
            className="h-14 px-10"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Analyze Domain"
            )}
          </Button>
        </div>
      </Card>

      {/* Project Selection */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Project</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />

          <Button onClick={handleCreateProject} disabled={creatingProject}>
            {creatingProject ? "Creating..." : "Create & Link Project"}
          </Button>

          <select
            className="h-12 rounded-md border border-input bg-background px-4 py-2 font-medium"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={projectsLoading}
          >
            <option value="">{projectsLoading ? "Loading projects..." : "Select Project"}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.domain ? `(${p.domain})` : ""}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      {loading && (
        <Card className="flex flex-col items-center justify-center gap-4 p-12">
          <RotateCcw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Analyzing backlink profile...</p>
        </Card>
      )}

      {data && !loading && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <MetricCard icon={Globe} title="Domain Rating" value={data.domainRating} />
            <MetricCard icon={Link2} title="Referring Domains" value={data.referringDomains} />
            <MetricCard icon={Award} title="Total Backlinks" value={data.totalBacklinks.toLocaleString()} />
            <MetricCard icon={ShieldAlert} title="Avg Spam Score" value={data.avgSpamScore} />
          </div>

          {/* Backlinks Table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
              <h3 className="text-lg font-semibold">Top Backlinks</h3>
              <p className="text-sm text-muted-foreground">
                Showing {backlinks.length} high-quality links
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Source Domain</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Anchor Text</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Authority</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Spam Score</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">First Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {backlinks.map((link) => (
                    <tr key={link.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{link.sourceDomain}</td>
                      <td className="px-6 py-4 text-muted-foreground">{link.anchorText}</td>
                      <td className="px-6 py-4 text-center font-bold">{link.authority}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-medium ${link.spamScore > 15 ? "text-red-500" : "text-emerald-500"}`}>
                          {link.spamScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            link.type === "dofollow"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {link.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                        {link.firstSeen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
