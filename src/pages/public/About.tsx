import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  Globe,
  Target,
  Users,
  Sparkles,
  ShieldCheck,
  Workflow,
  CheckCircle2,
  TrendingUp,
  Bot,
} from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Clarity",
    text: "We believe SEO tools should be simple to understand and easy to act on.",
  },
  {
    icon: Workflow,
    title: "Workflow",
    text: "A good product should help users move faster without feeling overwhelmed.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    text: "Secure auth, clear structure, and thoughtful UX build confidence.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    text: "Every feature should help teams improve their SEO results over time.",
  },
]

const pillars = [
  "Premium UI and smooth UX",
  "Built for founders, marketers, and agencies",
  "Clean dashboard with action-driven design",
  "Designed to support real SEO work",
]

export default function About() {
  const reduceMotion = useReducedMotion()

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-[8rem] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            About Hi-SEO
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            We are building a{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              premium SEO workspace
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Hi-SEO exists to make SEO easier to manage by bringing keywords, audits, reports, backlinks, and strategy into one clear and modern platform.
          </p>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Bot className="h-4 w-4" />
                  Our mission
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Make SEO work feel simple and powerful</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  We want teams to spend less time switching between tools and more time taking action. Hi-SEO brings the core SEO workflow into one premium dashboard so users can focus on growth.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-4"
            >
              {pillars.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-sm font-medium shadow-sm">
            <Users className="h-4 w-4 text-primary" />
            Who we build for
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Built for people who need clarity and speed
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            We design for founders, marketers, agencies, and teams that want a product they can understand quickly and use every day.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Globe,
              title: "Founders",
              text: "Stay close to SEO performance without needing a large team.",
            },
            {
              icon: Target,
              title: "Marketers",
              text: "Get a workflow that supports research, tracking, and reporting.",
            },
            {
              icon: TrendingUp,
              title: "Agencies",
              text: "Handle client SEO tasks with a cleaner and more organized system.",
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Our values
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              The principles behind Hi-SEO
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              We focus on the parts of product design that help users feel confident and move faster.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {values.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                    <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-3xl font-bold tracking-tight">Why Hi-SEO feels different</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              We are not trying to make the interface noisy or complicated. Our goal is to build a premium product that looks modern, feels fast, and helps users stay focused on results.
            </p>
          </Card>

          <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-3xl font-bold tracking-tight">What users get</h2>
            <div className="mt-5 space-y-4">
              {[
                "A clean dashboard experience",
                "Tools that are easy to find",
                "Clear action buttons and flow",
                "A product that feels polished",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to explore the platform?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Start free and see how Hi-SEO can improve your SEO workflow.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start Free Trial
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
