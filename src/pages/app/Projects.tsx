import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FolderOpen,
  Globe,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  ShieldCheck,
  Clock3,
  FileText,
} from "lucide-react"

type Project = {
  id: number
  name: string
  domain: string
  status: "Active" | "Paused" | "Draft"
  score: number
  updatedAt: string
  owner: string
}

const initialProjects: Project[] = [
  { id: 1, name: "Hi-SEO Main Site", domain: "hiseo.com", status: "Active", score: 92, updatedAt: "Today", owner: "Charles" },
  { id: 2, name: "Client A Landing Pages", domain: "clienta.com", status: "Active", score: 84, updatedAt: "2 days ago", owner: "Team" },
  { id: 3, name: "Agency Blog", domain: "agencyblog.com", status: "Paused", score: 71, updatedAt: "This week", owner: "Charles" },
  { id: 4, name: "Product Review Site", domain: "reviewsite.com", status: "Draft", score: 58, updatedAt: "This week", owner: "Team" },
]

export default function Projects() {
  const reduceMotion = useReducedMotion()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [query, setQuery] = useState("")
  const [name, setName] = useState("")
  const [domain, setDomain] = useState("")
  const [message, setMessage] = useState("")

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    )
  }, [projects, query])

  const activeCount = projects.filter((p) => p.status === "Active").length
  const draftCount = projects.filter((p) => p.status === "Draft").length
  const avgScore = Math.round(projects.reduce((sum, p) => sum + p.score, 0) / projects.length)

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !domain.trim()) return

    const newProject: Project = {
      id: Date.now(),
      name,
      domain,
      status: "Draft",
      score: 60,
      updatedAt: "Just now",
      owner: "You",
    }

    setProjects((prev) => [newProject, ...prev])
    setName("")
    setDomain("")
    setMessage("Project created successfully.")
    setTimeout(() => setMessage(""), 2500)
  }

  const getStatusClass = (status: Project["status"]) => {
    if (status === "Active") return "bg-emerald-100 text-emerald-700"
    if (status === "Paused") return "bg-amber-100 text-amber-700"
    return "bg-muted text-muted-foreground"
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-[8rem] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px] space-y-8 p-6 md:p-8">
        {/* Header */}
        <motion.div {...fadeUp} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Premium project workspace
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Projects</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Manage all your SEO projects in one place. Track performance, keep work organized, and jump into any project fast.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button variant="premium">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Projects", value: projects.length, icon: FolderOpen, color: "text-blue-500" },
            { label: "Active", value: activeCount, icon: Globe, color: "text-emerald-500" },
            { label: "Drafts", value: draftCount, icon: Clock3, color: "text-amber-500" },
            { label: "Average Score", value: `${avgScore}%`, icon: BarChart3, color: "text-purple-500" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.label} {...fadeUp}>
                <Card className="border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-3xl font-black">{item.value}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Main grid */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          {/* Left: projects list */}
          <motion.div {...fadeUp}>
            <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <div className="border-b bg-muted/20 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Your Projects</h2>
                    <p className="text-sm text-muted-foreground">Search, review, and manage your SEO workspaces.</p>
                  </div>
                  <div className="relative w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm text-muted-foreground">No projects found.</p>
                  </div>
                ) : (
                  filtered.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
                      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      viewport={{ once: true, amount: 0.2 }}
                      className="p-5 transition-colors hover:bg-muted/10"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <FolderOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-lg font-semibold">{project.name}</h3>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(project.status)}`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{project.domain}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {project.owner}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                Updated {project.updatedAt}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-sm font-bold ${getScoreColor(project.score)}`}>{project.score}%</p>
                            <div className="mt-1 h-2 w-28 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${project.score >= 80 ? "bg-emerald-500" : project.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${project.score}%` }}
                              />
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Right: create project / insights */}
          <div className="space-y-6">
            <motion.div {...fadeUp}>
              <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <div className="mb-5 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Create new project</h2>
                </div>

                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Project name</label>
                    <Input
                      placeholder="My Website"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Domain</label>
                    <Input
                      placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  {message && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                      {message}
                    </div>
                  )}

                  <Button type="submit" className="w-full" variant="premium">
                    Create Project
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </motion.div>

            <motion.div {...fadeUp}>
              <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <h2 className="text-xl font-bold">What you can do here</h2>
                <div className="mt-5 space-y-4">
                  {[
                    "Add and organize multiple SEO projects",
                    "Review status and performance fast",
                    "Open each project when you need it",
                    "Keep your workflow clean and premium",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
