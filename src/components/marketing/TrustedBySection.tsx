import { Card } from "../ui/card"
import { BadgeCheck, Sparkles } from "lucide-react"

const brands = [
  { name: "Northstar", tag: "B2B SaaS", initials: "N", accent: "from-sky-500 to-cyan-400" },
  { name: "MetricForge", tag: "Analytics", initials: "M", accent: "from-indigo-500 to-violet-500" },
  { name: "PulseRank", tag: "SEO Agency", initials: "P", accent: "from-emerald-500 to-teal-400" },
  { name: "OrbitLabs", tag: "Growth Team", initials: "O", accent: "from-fuchsia-500 to-pink-500" },
  { name: "SignalMint", tag: "Marketing Ops", initials: "S", accent: "from-amber-500 to-orange-500" },
]

export function TrustedBySection() {
  return (
    <section className="border-y bg-muted/10 py-12">
      <div className="container mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <BadgeCheck className="h-4 w-4" />
            Trusted by modern SEO teams
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-balance">
            Distinctive brands, designed for high-performance marketing.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Fictional brand marks styled like premium SaaS partner logos — perfect as a polished trust strip until you swap in real customer logos.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {brands.map((brand) => (
            <Card key={brand.name} className="border-border/60 bg-background/90 p-4 shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${brand.accent} text-white shadow-lg`}
                >
                  <span className="text-lg font-bold">{brand.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.tag}</p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full w-4/5 rounded-full bg-gradient-to-r ${brand.accent}`} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Premium partner
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
