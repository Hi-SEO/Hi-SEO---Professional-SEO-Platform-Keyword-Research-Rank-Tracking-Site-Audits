import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Search,
  Plus,
  RotateCcw,
  TrendingUp,
  Target,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"
import {
  generateRankingData,
  RankTrackerData,
  getPositionChangeColor,
  getPositionChangeIcon,
} from "../../utils/rankService"

type Project = {
  id: string
  name: string
  domain: string | null
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Failed to generate ranking data."
}

function MetricCard({
  title,
  value,
}: {
  title: string
  value: string | number
}) {
  return (
    <Card className="p-6">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
    </Card>
  )
}

export default function RankTracker() {
  const { user } = useAuth()

  const [domain, setDomain] = useState("yourwebsite.com")
  const [data, setData] = useState<RankTrackerData | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [creatingProject, setCreatingProject] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

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
    handleUpdateRankings(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reloadKey])

  const handleUpdateRankings = async (shouldSave = true) => {
    if (!domain.trim()) {
      setError("Please enter a domain.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const result = generateRankingData(domain.trim())
      setData(result)

      if (shouldSave && user && selectedProjectId) {
        const { error } = await supabase.from("reports").insert({
          user_id: user.id,
          project_id: selectedProjectId,
          title: `Ranking Snapshot - ${domain.trim()}`,
          report_type: "rank-tracker",
          data: result,
        })

        if (error) throw error

        setMessage("Ranking snapshot saved automatically.")
      }
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
          domain: domain.trim(),
        })
        .select("id, name, domain")
        .single()

      if (error) throw error

      if (newProject) {
        setProjects((prev) => [newProject, ...prev])
        setSelectedProjectId(newProject.id)
        setNewProjectName("")
        setMessage("Project created and linked.")
      }
    } catch (err) {
      console.error("Error creating project:", err)
      setError("Failed to create project. Please try again.")
    } finally {
      setCreatingProject(false)
    }
  }

  const handleSaveSnapshot = async () => {
    if (!user || !data) {
      setError("No ranking data to save.")
      return
    }

    if (!selectedProjectId) {
      setError("Please select a project first.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        project_id: selectedProjectId,
        title: `Rankings - ${data.domain}`,
        report_type: "rank-tracker",
        data,
      })

      if (error) throw error

      setMessage("Ranking snapshot saved successfully.")
    } catch (err) {
      console.error("Error saving snapshot:", err)
      setError("Failed to save snapshot. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const positions = data?.positions || []

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rank Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your keyword rankings and track performance over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)} disabled={projectsLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={handleSaveSnapshot} disabled={saving || !data}>
            <Plus className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Snapshot"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Rank tracker error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Project & Domain Section */}
      <Card className="space-y-4 p-6">
        <h3 className="font-semibold">Project & Domain</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourwebsite.com"
          />
          <Button onClick={handleCreateProject} disabled={creatingProject}>
            {creatingProject ? "Creating..." : "Create Project"}
          </Button>
          <Button variant="premium" onClick={() => handleUpdateRankings(true)} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 animate-spin" />
                Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Update Rankings
              </span>
            )}
          </Button>
        </div>

        <select
          className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 font-medium"
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
      </Card>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      {loading && (
        <Card className="flex flex-col items-center justify-center gap-4 p-12">
          <RotateCcw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Updating ranking data...</p>
          <p className="text-sm text-muted-foreground">Generating simulated ranking trends</p>
        </Card>
      )}

      {data && !loading && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <MetricCard title="Domain" value={data.domain} />
            <MetricCard title="Keywords Tracked" value={data.totalKeywords} />
            <MetricCard title="Avg. Position" value={data.averagePosition} />
            <MetricCard title="Last Updated" value="Just now" />
          </div>

          {/* Ranking Trend Chart */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <BarChart3 className="h-5 w-5" />
              Ranking Trend (Last 30 Days)
            </h3>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis reversed domain={[1, 50]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {positions.slice(0, 5).map((pos, i) => (
                    <Line
                      key={pos.id}
                      type="monotone"
                      dataKey={`keyword${i}`}
                      name={pos.keyword.length > 18 ? pos.keyword.substring(0, 15) + "..." : pos.keyword}
                      stroke={`hsl(${i * 60}, 70%, 50%)`}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Rankings Table */}
          <Card className="overflow-hidden">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h3 className="text-lg font-semibold">Current Rankings</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Keyword</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Current</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Previous</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Change</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Volume</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Best</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {positions.length > 0 ? (
                    positions.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">{item.keyword}</td>
                        <td className="px-6 py-4 text-center text-lg font-bold">#{item.currentPosition}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground">
                          {item.previousPosition ? `#${item.previousPosition}` : "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 font-medium ${getPositionChangeColor(item.change)}`}>
                            {getPositionChangeIcon(item.change)}
                            {Math.abs(item.change)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {item.volume.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                          #{item.bestPosition}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-8 text-center text-muted-foreground" colSpan={6}>
                        No rankings available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {!data && !loading && (
        <Card className="p-12 text-center">
          <Target className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No ranking data yet</h3>
          <p className="mt-2 text-muted-foreground">
            Click "Update Rankings" to simulate tracking data
          </p>
        </Card>
      )}
    </div>
  )
}
