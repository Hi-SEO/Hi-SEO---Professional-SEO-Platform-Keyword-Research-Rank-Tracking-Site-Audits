import { Card } from "../ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

const metrics = [
  { value: "150B+", label: "Pages Crawled" },
  { value: "25B+", label: "Keywords Database" },
  { value: "4T+", label: "Live Backlinks" },
  { value: "99.9%", label: "Data Accuracy" },
]

const proofPoints = [
  "150+ Billion indexed pages",
  "25+ Billion keywords tracked globally",
  "4+ Trillion known backlinks",
  "Daily updates across 170+ countries",
]

export function MetricsSection() {
  return (
    <section className="relative overflow-hidden border-y bg-card py-24">
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
              The most accurate SEO database in the industry.
            </h2>
            <p className="text-lg text-muted-foreground">
              We crawl billions of pages a day to provide the freshest backlink data and keyword metrics available anywhere.
            </p>

            <ul className="space-y-4">
              {proofPoints.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="outline" size="lg" asChild>
              <Link to="/features">Explore Data Quality</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <Card
                key={metric.label}
                className={[
                  "space-y-2 p-6 shadow-soft",
                  index % 2 === 1 ? "translate-y-8" : "",
                  index === 0 ? "border-primary/20 bg-primary/5 shadow-none" : "bg-background",
                ].join(" ")}
              >
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
