import { Card } from "../ui/card"
import {
  ArrowUpRight,
  BarChart3,
  Link2,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

type Metric = {
  label: string
  value: string
  delta: string
  icon: LucideIcon
}

const topMetrics: Metric[] = [
  { label: "Organic Traffic", value: "128.4K", delta: "+18.2%", icon: TrendingUp },
  { label: "Keywords Tracked", value: "24,680", delta: "+1.4K", icon: Search },
  { label: "Backlinks Gained", value: "3,482", delta: "+12.7%", icon: Link2 },
]

const sidebarItems = [
  "Dashboard",
  "Rank Tracker",
  "Keyword Explorer",
  "Site Audit",
  "Reports",
]

const keywordRows = [
  { keyword: "seo audit software", position: "3", change: "+2", volume: "9.8K" },
  { keyword: "keyword tracker", position: "5", change: "+1", volume: "6.1K" },
  { keyword: "content optimization", position: "8", change: "+4", volume: "4.4K" },
  { keyword: "backlink analysis", position: "11", change: "+3", volume: "3.2K" },
]

const chartPoints = "0,128 54,120 108,112 162,96 216,104 270,78 324,70 378,58 432,62 486,44 540,52 594,36"

export function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_30px_80px_-30px_rgba(2,6,23,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-indigo-500/10" />

      {/* Browser bar */}
      <div className="flex h-11 items-center gap-2 border-b bg-muted/30 px-4">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>

        <div className="mx-auto flex items-center gap-2 rounded-md border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
          <Shield className="h-3 w-3 text-primary" />
          app.hi-seo.com/workspace
        </div>
      </div>

      <div className="grid gap-0 bg-background/90 md:grid-cols-[230px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden border-r bg-card/70 p-4 md:flex md:flex-col">
          <div className="mb-4 rounded-2xl border bg-background/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Hi-SEO</p>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              const active = index === 0
              return (
                <div
                  key={item}
                  className={[
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                  {item}
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border bg-background/80 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Project health
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">92</p>
                <p className="text-xs text-muted-foreground">SEO Score</p>
              </div>
              <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                +7 this week
              </div>
            </div>
          </div>
        </aside>

        {/* Main dashboard */}
        <div className="space-y-4 p-4 md:p-6">
          {/* Top metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            {topMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <Card key={metric.label} className="border-border/60 bg-background p-4 shadow-soft">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-tight">{metric.value}</p>
                    </div>
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                    {metric.delta}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Charts + table */}
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <Card className="border-border/60 bg-background p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Organic Traffic</p>
                  <p className="text-sm text-muted-foreground">
                    Last 30 days performance for hi-seo.com
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  +18.2%
                </div>
              </div>

              <div className="mt-5 rounded-2xl border bg-muted/20 p-4">
                <svg viewBox="0 0 600 240" className="h-[240px] w-full">
                  <defs>
                    <linearGradient id="traffic-gradient" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="rgb(79 70 229)" />
                    </linearGradient>
                    <linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <g className="opacity-25">
                    {[48, 88, 128, 168].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="600"
                        y1={y}
                        y2={y}
                        stroke="currentColor"
                        strokeDasharray="4 8"
                      />
                    ))}
                  </g>

                  <path
                    d={`M 0 240 L 0 128 ${chartPoints.replaceAll(" ", " L ")} L 600 240 Z`}
                    fill="url(#area-gradient)"
                  />
                  <polyline
                    fill="none"
                    points={chartPoints}
                    stroke="url(#traffic-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {[
                    [54, 120],
                    [162, 96],
                    [270, 78],
                    [378, 58],
                    [486, 44],
                    [594, 36],
                  ].map(([x, y], index) => (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                    />
                  ))}
                </svg>
              </div>
            </Card>

            <Card className="border-border/60 bg-background p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Rank Movement</p>
                  <p className="text-sm text-muted-foreground">Top tracked keywords</p>
                </div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mt-4 space-y-3">
                {keywordRows.map((row) => (
                  <div key={row.keyword} className="rounded-2xl border bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{row.keyword}</p>
                        <p className="text-xs text-muted-foreground">Vol. {row.volume}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">#{row.position}</p>
                        <p className="text-xs font-medium text-emerald-600">{row.change}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
