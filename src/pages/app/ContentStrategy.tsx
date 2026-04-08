import { useMemo, useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  Search,
  Layers,
  Lightbulb,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  Circle,
  Tag,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"

type ContentIntent = "Informational" | "Commercial" | "Transactional"
type ContentPriority = "High" | "Medium" | "Low"

type ContentIdea = {
  id: string
  title: string
  intent: ContentIntent
  type: string
  priority: ContentPriority
  estimatedWords: number
}

type ContentStrategyResult = {
  topic: string
  pillarTitle: string
  angle: string
  contentIdeas: ContentIdea[]
  totalWords: number
  highPriority: number
}

function generateContentStrategy(topic: string): ContentStrategyResult {
  const base = topic.trim().toLowerCase()

  const ideas: Omit<ContentIdea, "id">[] = [
    { title: "What is " + base + "?", intent: "Informational", type: "Blog Post", priority: "High", estimatedWords: 1500 },
    { title: "Best " + base + " tools in 2025", intent: "Commercial", type: "Comparison Article", priority: "High", estimatedWords: 2500 },
    { title: "How to build a " + base + " strategy", intent: "Informational", type: "Guide", priority: "High", estimatedWords: 3000 },
    { title: base + " checklist for beginners", intent: "Informational", type: "Checklist", priority: "Medium", estimatedWords: 1200 },
    { title: base + " for small businesses", intent: "Informational", type: "Tutorial", priority: "Medium", estimatedWords: 2000 },
    { title: base + " examples and case studies", intent: "Informational", type: "Examples Post", priority: "Medium", estimatedWords: 2200 },
    { title: "Best " + base + " alternatives", intent: "Commercial", type: "Comparison Article", priority: "High", estimatedWords: 2800 },
    { title: base + " mistakes to avoid", intent: "Informational", type: "Educational Post", priority: "Low", estimatedWords: 1800 },
    { title: base + " pricing guide", intent: "Transactional", type: "Pricing Page", priority: "High", estimatedWords: 1000 },
    { title: base + " vs competitors", intent: "Commercial", type: "VS Article", priority: "High", estimatedWords: 2000 },
    { title: "Free " + base + " tools", intent: "Informational", type: "Resource List", priority: "Medium", estimatedWords: 1500 },
    { title: base + " tips and tricks", intent: "Informational", type: "Tips Article", priority: "Low", estimatedWords: 1200 },
  ]

  const contentIdeas: ContentIdea[] = ideas.map((idea, index) => ({
    ...idea,
    id: `${base}-${index}`,
  }))

  const totalWords = contentIdeas.reduce((s, i) => s + i.estimatedWords, 0)
  const highPriority = contentIdeas.filter((i) => i.priority === "High").length

  return {
    topic: base,
    pillarTitle: "The Complete Guide to " + base + " (2025)",
    angle: "Build topical authority around " + base + " with a pillar page and " + contentIdeas.length + " supporting articles.",
    contentIdeas,
    totalWords,
    highPriority,
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Something went wrong. Please try again."
}

export default function ContentStrategy() {
  const { user } = useAuth()

  const [topic, setTopic] = useState("seo content strategy")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ContentStrategyResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [filterIntent, setFilterIntent] = useState<"all" | ContentIntent>("all")
  const [filterPriority, setFilterPriority] = useState<"all" | ContentPriority>("all")
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")
    setResult(null)
    setCompleted(new Set())

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setResult(generateContentStrategy(topic.trim()))
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in.")
      return
    }

    if (!result) {
      setError("No strategy to save.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        title: "Content Strategy - " + result.topic,
        report_type: "content-strategy",
        data: result,
      })

      if (error) throw error

      setMessage("Content strategy saved successfully.")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const toggleCompleted = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredIdeas = useMemo(() => {
    if (!result) return []

    return result.contentIdeas
      .filter((i) => filterIntent === "all" || i.intent === filterIntent)
      .filter((i) => filterPriority === "all" || i.priority === filterPriority)
  }, [result, filterIntent, filterPriority])

  const intentColors: Record<ContentIntent, string> = {
    Informational: "bg-blue-100 text-blue-700",
    Commercial: "bg-amber-100 text-amber-700",
    Transactional: "bg-emerald-100 text-emerald-700",
  }

  const priorityColors: Record<ContentPriority, string> = {
    High: "text-red-500",
    Medium: "text-amber-500",
    Low: "text-muted-foreground",
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Strategy</h1>
          <p className="mt-1 text-muted-foreground">
            Build topic clusters, pillar pages, and supporting content ideas.
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving || !result}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Strategy"}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Content strategy error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="flex flex-col items-center gap-4 p-6 md:flex-row">
        <div className="relative w-full flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Enter a topic (e.g. seo content strategy)"
            className="h-14 pl-12 text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <Button
          variant="premium"
          className="h-14 w-full px-8 md:w-auto"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Strategy"
          )}
        </Button>
      </Card>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      {loading && (
        <Card className="flex flex-col items-center gap-4 p-12">
          <RotateCcw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Building your content strategy...</p>
        </Card>
      )}

      {result && !loading && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Articles</p>
                  <p className="text-3xl font-bold">{result.contentIdeas.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                  <p className="text-3xl font-bold text-red-500">{result.highPriority}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Words</p>
                  <p className="text-3xl font-bold">{result.totalWords.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-emerald-500">{completed.size}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="space-y-3 p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <Lightbulb className="h-5 w-5 text-amber-500" /> Pillar Page
            </h3>
            <p className="text-xl font-bold">{result.pillarTitle}</p>
            <p className="text-sm text-muted-foreground">{result.angle}</p>
          </Card>

          <Card className="overflow-hidden">
            <div className="space-y-4 border-b bg-muted/20 px-6 py-4">
              <h3 className="text-lg font-semibold">
                Content Ideas{" "}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {filteredIdeas.length} articles
                </span>
              </h3>

              <div className="flex flex-wrap gap-3">
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filterIntent}
                  onChange={(e) => setFilterIntent(e.target.value as "all" | ContentIntent)}
                >
                  <option value="all">All Intents</option>
                  <option value="Informational">Informational</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Transactional">Transactional</option>
                </select>

                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as "all" | ContentPriority)}
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/10">
                  <tr>
                    <th className="w-8 px-6 py-4 text-left font-medium text-muted-foreground"></th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Title</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Intent</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Priority</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Est. Words</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredIdeas.map((item) => (
                    <tr
                      key={item.id}
                      className={"cursor-pointer transition-colors hover:bg-muted/10 " + (completed.has(item.id) ? "opacity-50" : "")}
                      onClick={() => toggleCompleted(item.id)}
                    >
                      <td className="px-6 py-4">
                        {completed.has(item.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className={completed.has(item.id) ? "line-through" : ""}>
                          {item.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={"rounded-full px-2 py-1 text-xs font-medium " + intentColors[item.intent]}>
                          {item.intent}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Tag className="h-3 w-3" />
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={"text-xs font-medium " + priorityColors[item.priority]}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.estimatedWords.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {!result && !loading && (
        <Card className="p-12 text-center">
          <Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No strategy generated yet</h3>
          <p className="mt-2 text-muted-foreground">
            Enter a topic and click "Generate Strategy" to build a content plan.
          </p>
        </Card>
      )}
    </div>
  )
}
