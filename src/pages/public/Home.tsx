import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Users,
  FileText,
  Gauge,
  Bot,
  Link2,
  LineChart,
  Star,
  Workflow,
} from "lucide-react"

const trustItems = [
  "Built for founders, marketers, and agencies",
  "Secure auth and workspace control",
  "Fast SEO workflows in one dashboard",
]

const stats = [
  { value: "10+", label: "SEO tools" },
  { value: "1 click", label: "Fast audits" },
  { value: "Real time", label: "Dashboard updates" },
  { value: "Free + Premium", label: "Plans" },
]

const featureCards = [
  {
    icon: Search,
    title: "Keyword Explorer",
    text: "Find search terms people are already using and turn them into traffic opportunities.",
  },
  {
    icon: ShieldCheck,
    title: "Site Audit",
    text: "Spot SEO problems early and understand what needs attention first.",
  },
  {
    icon: TrendingUp,
    title: "Rank Tracker",
    text: "Track movement across keywords and quickly see what is improving or falling.",
  },
  {
    icon: Link2,
    title: "Backlink Analytics",
    text: "Review links, authority signals, and discover where your site is growing.",
  },
  {
    icon: Gauge,
    title: "SERP Analysis",
    text: "See what appears in search results so you can compete with more clarity.",
  },
  {
    icon: Bot,
    title: "AI Writer",
    text: "Generate content ideas and save time while planning SEO-friendly writing.",
  },
]

const processSteps = [
  {
    number: "01",
    title: "Create your workspace",
    text: "Add your project and organize your SEO work in one place.",
  },
  {
    number: "02",
    title: "Run tools",
    text: "Use audits, keyword research, and analysis tools to collect insights.",
  },
  {
    number: "03",
    title: "Act with clarity",
    text: "Use reports and dashboard views to make better decisions faster.",
  },
]

const benefits = [
  "Elegant dashboard experience",
  "Simple and fast daily workflow",
  "Made for solo users and teams",
  "Clear reports and action steps",
  "Scales with your SEO needs",
  "Easy to understand for new users",
]

const testimonials = [
  {
    name: "Amina K.",
    role: "Growth Marketer",
    quote:
      "Hi-SEO makes it much easier to manage SEO work without jumping between too many tools.",
  },
  {
    name: "David T.",
    role: "Agency Owner",
    quote:
      "The dashboard feels premium and organized. It gives the product a real SaaS feel.",
  },
  {
    name: "Lara M.",
    role: "Founder",
    quote:
      "I like that the product explains itself well. The interface makes SEO feel simpler.",
  },
]

const faqs = [
  {
    q: "What is Hi-SEO?",
    a: "Hi-SEO is an SEO SaaS platform that helps users manage keywords, audits, reports, and SEO analysis in one workspace.",
  },
  {
    q: "Who is it for?",
    a: "It is built for founders, marketers, agencies, and small teams that want a cleaner SEO workflow.",
  },
  {
    q: "Can I start free?",
    a: "Yes. You can start on the free plan and upgrade when you need more tools and access.",
  },
  {
    q: "Why does it feel premium?",
    a: "Because it is designed with modern UI, smooth motion, clear copy, and a clean SaaS-style layout.",
  },
]

export default function Home() {
  const reduceMotion = useReducedMotion()

  const fadeUp = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.55 },
    viewport: { once: true, amount: 0.2 },
  }

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-[8rem] h-[30rem] w-[30rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[15%] h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left */}
          <motion.div {...fadeIn} className="relative">
            <motion.div
              {...fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              Premium SEO SaaS for growing teams
            </motion.div>

            <motion.h1
              {...fadeUp}
              className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl lg:text-7xl"
            >
              Turn SEO into a{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
                clear, beautiful workflow
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
            >
              Hi-SEO helps you manage keyword research, audits, backlinks, rankings, reports, and content strategy in one premium dashboard.
              Instead of switching between tools, you get one focused place to understand what matters and what to do next.
            </motion.p>

            <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-background/70 backdrop-blur">
                <Link to="/features">Explore Features</Link>
              </Button>
            </motion.div>

            <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-2 text-sm font-medium shadow-sm backdrop-blur"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {stats.map((item) => (
                <Card
                  key={item.label}
                  className="border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur transition-transform hover:-translate-y-1"
                >
                  <p className="text-2xl font-bold tracking-tight">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </Card>
              ))}
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, x: 40, scale: 0.96 }}
            whileInView={reduceMotion ? {} : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <Card className="relative overflow-hidden border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_30%)]" />

              <div className="relative mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workspace Overview</p>
                  <h2 className="text-2xl font-bold">Hi-SEO Dashboard</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </div>
              </div>

              <div className="relative grid gap-4 sm:grid-cols-2">
                <Card className="border-border/50 bg-background/70 p-4 backdrop-blur">
                  <p className="text-sm text-muted-foreground">Projects</p>
                  <p className="mt-2 text-3xl font-bold">12</p>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 w-[72%] rounded-full bg-primary" />
                  </div>
                </Card>

                <Card className="border-border/50 bg-background/70 p-4 backdrop-blur">
                  <p className="text-sm text-muted-foreground">Audits Run</p>
                  <p className="mt-2 text-3xl font-bold">48</p>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 w-[58%] rounded-full bg-emerald-500" />
                  </div>
                </Card>

                <Card className="border-border/50 bg-background/70 p-4 backdrop-blur">
                  <p className="text-sm text-muted-foreground">Saved Keywords</p>
                  <p className="mt-2 text-3xl font-bold">356</p>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 w-[84%] rounded-full bg-purple-500" />
                  </div>
                </Card>

                <Card className="border-border/50 bg-background/70 p-4 backdrop-blur">
                  <p className="text-sm text-muted-foreground">Reports</p>
                  <p className="mt-2 text-3xl font-bold">29</p>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 w-[46%] rounded-full bg-amber-500" />
                  </div>
                </Card>
              </div>

              <div className="relative mt-6 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Weekly SEO Activity</p>
                </div>

                <div className="grid grid-cols-7 items-end gap-3">
                  {[35, 54, 28, 68, 46, 82, 61].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="flex h-40 items-end"
                    >
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-primary to-purple-500 shadow-md shadow-primary/20"
                        style={{ height: `${height}%` }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { title: "Site Score", value: "92/100", accent: "emerald" },
                  { title: "Tracked Keywords", value: "356", accent: "blue" },
                  { title: "Weekly Growth", value: "+18%", accent: "purple" },
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
                    whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12, duration: 0.45 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border bg-background/70 p-4 backdrop-blur"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{card.title}</p>
                      <span
                        className={
                          "h-2.5 w-2.5 rounded-full " +
                          (card.accent === "emerald"
                            ? "bg-emerald-500"
                            : card.accent === "blue"
                            ? "bg-blue-500"
                            : "bg-purple-500")
                        }
                      />
                    </div>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why section */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
              <Target className="h-4 w-4 text-primary" />
              Why Hi-SEO
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Built for clarity, speed, and better decisions
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              The product is designed to feel premium while still being easy enough for new users to understand quickly.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="group h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary transition-transform group-hover:scale-105">
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

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div {...fadeUp}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-sm font-medium shadow-sm">
              <Workflow className="h-4 w-4 text-primary" />
              Clean workflow
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              One platform for the full SEO journey
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              From discovery to reporting, Hi-SEO keeps your work moving in a single place.
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((item) => (
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
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
              <Layers3 className="h-4 w-4 text-primary" />
              Simple process
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A straightforward workflow that makes SEO easier to manage every day.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                  <p className="text-sm font-semibold text-primary">{step.number}</p>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="mb-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-sm font-medium shadow-sm">
            <Star className="h-4 w-4 text-amber-500" />
            User feedback
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            What users might love about this experience
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Strong copy and clean design help people trust the product faster.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <div className="mb-4 flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
              <FileText className="h-4 w-4 text-primary" />
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Quick answers
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((item, index) => (
              <motion.div
                key={item.q}
                initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="text-lg font-semibold">{item.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-emerald-500 opacity-95" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center text-primary-foreground">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to experience Hi-SEO?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-primary-foreground/85 md:text-lg">
            Start free, explore the interface, and see how a premium SEO workspace should feel.
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
