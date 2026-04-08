import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Crown,
  Sparkles,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Great for getting started and exploring the product.",
    icon: Sparkles,
  },
  {
    name: "Premium",
    price: "₦15,000",
    description: "Best for active SEO teams that need the full workflow.",
    icon: Crown,
    popular: true,
  },
  {
    name: "Agency",
    price: "Custom",
    description: "For teams that need more scale, support, and flexibility.",
    icon: Users,
  },
]

const rows = [
  { label: "Dashboard access", free: true, premium: true, agency: true },
  { label: "Keyword explorer", free: false, premium: true, agency: true },
  { label: "Site audit tools", free: false, premium: true, agency: true },
  { label: "Rank tracker", free: false, premium: true, agency: true },
  { label: "Backlink analytics", free: false, premium: true, agency: true },
  { label: "Reports export", free: false, premium: true, agency: true },
  { label: "Team support", free: false, premium: false, agency: true },
  { label: "Priority support", free: false, premium: false, agency: true },
]

const reasons = [
  {
    icon: Zap,
    title: "Fast workflow",
    text: "Everything is designed to help you move faster without switching tools all day.",
  },
  {
    icon: ShieldCheck,
    title: "Secure platform",
    text: "Auth and sensitive logic are built with secure backend-first patterns.",
  },
  {
    icon: BarChart3,
    title: "Clear insights",
    text: "Use reports and dashboards to make better SEO decisions with less noise.",
  },
]

export default function Compare() {
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
            Compare plans
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Pick the plan that fits your{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              SEO workflow
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Start free, upgrade when you are ready, and choose the level of support that matches your growth.
          </p>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.name}
                  initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card
                    className={
                      "relative h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl " +
                      (plan.popular ? "ring-2 ring-primary/40" : "")
                    }
                  >
                    {plan.popular && (
                      <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{plan.description}</p>

                    <div className="mt-6 flex items-end gap-1">
                      <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                      <span className="pb-1 text-sm text-muted-foreground">{plan.name === "Agency" ? "" : "/ month"}</span>
                    </div>

                    <div className="mt-8">
                      {plan.name === "Agency" ? (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/contact">
                            Contact Sales
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : plan.popular ? (
                        <Button asChild className="w-full">
                          <Link to="/signup">
                            Start Premium
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/signup">
                            Start Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Feature comparison</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            A simple look at what each plan includes.
          </p>
        </motion.div>

        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <div className="grid grid-cols-4 gap-0 border-b bg-muted/30 px-4 py-4 text-sm font-semibold md:px-6">
            <div>Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center">Premium</div>
            <div className="text-center">Agency</div>
          </div>

          <div className="divide-y">
            {rows.map((row, index) => (
              <motion.div
                key={row.label}
                initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-4 gap-0 px-4 py-4 text-sm md:px-6"
              >
                <div className="font-medium">{row.label}</div>
                <div className="flex justify-center">
                  {row.free ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.premium ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.agency ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-sm font-medium shadow-sm">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Why choose Hi-SEO
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Built to feel premium and easy to use
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {reasons.map((item, index) => {
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
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to choose your plan?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Start free today and upgrade whenever you need more power.
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
