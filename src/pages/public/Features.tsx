import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Gauge,
  Globe,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
} from "lucide-react"

const coreFeatures = [
  {
    icon: Search,
    title: "Keyword Explorer",
    text: "Discover search terms, search intent, and ranking opportunities faster.",
  },
  {
    icon: ShieldCheck,
    title: "Site Audit",
    text: "Run checks to find technical SEO issues and prioritize fixes.",
  },
  {
    icon: TrendingUp,
    title: "Rank Tracker",
    text: "Monitor rankings over time and spot changes before they become problems.",
  },
  {
    icon: Globe,
    title: "Site Explorer",
    text: "Analyze domains, pages, and SEO signals from a single workspace.",
  },
  {
    icon: Layers3,
    title: "Content Strategy",
    text: "Plan content tasks with a clearer workflow and better structure.",
  },
  {
    icon: Gauge,
    title: "SERP Analysis",
    text: "Understand search result pages and see what you are competing against.",
  },
]

const premiumBenefits = [
  "Fast workflow and clean dashboard UX",
  "Built for solo founders, teams, and agencies",
  "Easy to learn and simple to use",
  "Secure auth with Supabase",
]

export default function Features() {
  const reduceMotion = useReducedMotion()

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Premium features built for SEO teams
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              manage SEO better
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Hi-SEO brings your most important SEO tasks into one polished workspace so you can move faster and stay organized.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
              <WandSparkles className="h-4 w-4 text-primary" />
              Core tools
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Powerful features in one workspace
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Each tool is designed to help you make better SEO decisions with less friction.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="group h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary transition-transform group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.text}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Flow */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-sm font-medium shadow-sm">
            <Target className="h-4 w-4 text-primary" />
            Simple workflow
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Built to make SEO work easier
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Use one clean system instead of switching between many different tools.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "1. Add your project",
              text: "Create a workspace for your website and keep everything in one place.",
            },
            {
              title: "2. Run SEO tools",
              text: "Audit pages, explore keywords, and analyze ranking opportunities.",
            },
            {
              title: "3. Act on results",
              text: "Use the dashboard, reports, and insights to improve faster.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.45 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold text-primary">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeUp}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
                <Bot className="h-4 w-4 text-primary" />
                Premium experience
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                Designed for speed, clarity, and growth
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Hi-SEO keeps your team focused with a premium interface and easy-to-use tools.
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              {premiumBenefits.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border bg-card/80 p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-emerald-500 opacity-95" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center text-primary-foreground">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Want to build SEO work the better way?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-primary-foreground/85 md:text-lg">
            Start free and use a modern platform that makes SEO easier to manage.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
