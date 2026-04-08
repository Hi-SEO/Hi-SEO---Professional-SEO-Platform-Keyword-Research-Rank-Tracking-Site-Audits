import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { BookOpen, Search, Target, TrendingUp, Link2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react"

const terms = [
  { icon: Search, term: "Keyword Research", desc: "Finding search terms people use to discover your content." },
  { icon: Target, term: "SERP", desc: "Search Engine Results Page. The page you see after a search query." },
  { icon: TrendingUp, term: "Ranking", desc: "Your position on the search results page for a keyword." },
  { icon: Link2, term: "Backlink", desc: "A link from another website pointing to your site." },
  { icon: ShieldCheck, term: "Site Audit", desc: "A review of technical SEO issues on your website." },
]

export default function Glossary() {
  const reduceMotion = useReducedMotion()

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            SEO glossary and learning hub
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Learn SEO terms{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              faster and easier
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            A simple glossary for keywords, rankings, audits, and the key SEO concepts inside Hi-SEO.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/features">Explore Features</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              SEO terms
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Important terms in one place
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Keep your team aligned with clear definitions for common SEO ideas.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {terms.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.term}
                  initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.term}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-2xl font-bold">Why this glossary helps</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              SEO has many terms that can be confusing at first. This glossary helps new users and teams understand the platform more quickly.
            </p>
          </Card>
          <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-2xl font-bold">What to do next</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Explore the features page, start a free trial, or create your first project in the dashboard.
            </p>
          </Card>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to use these SEO tools?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Start free and build your SEO workflow in a premium workspace.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
