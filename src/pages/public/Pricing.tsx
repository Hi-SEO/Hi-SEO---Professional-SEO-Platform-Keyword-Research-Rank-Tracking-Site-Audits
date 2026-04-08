import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "/ month",
    description: "Perfect for getting started and exploring the product.",
    icon: Sparkles,
    features: [
      "Basic dashboard access",
      "Limited SEO tools",
      "Profile settings",
      "Public pages access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Premium",
    price: "₦15,000",
    period: "/ month",
    description: "Best for serious growth teams and active SEO work.",
    icon: Crown,
    features: [
      "Full SEO dashboard",
      "Keyword explorer",
      "Site audit tools",
      "Rank tracking",
      "Backlink analytics",
      "Reports and exports",
    ],
    cta: "Get Premium",
    popular: true,
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description: "For teams that need more scale, support, and flexibility.",
    icon: Users,
    features: [
      "Multiple client workspaces",
      "Priority support",
      "Advanced reporting",
      "Custom setup",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const highlights = [
  {
    icon: ShieldCheck,
    title: "Secure",
    text: "Built with Supabase auth and server-side payment logic.",
  },
  {
    icon: Zap,
    title: "Fast",
    text: "Smooth workflows and a clean dashboard for daily SEO work.",
  },
  {
    icon: Star,
    title: "Premium",
    text: "A polished SaaS experience designed to feel modern and clear.",
  },
]

const faq = [
  {
    q: "Can I start on the free plan?",
    a: "Yes. You can start free and upgrade later when you need more tools.",
  },
  {
    q: "What is included in Premium?",
    a: "Premium includes the full SEO dashboard, keyword tools, audits, rankings, reports, and more.",
  },
  {
    q: "Can I contact sales?",
    a: "Yes. The Agency plan is for teams that need a custom setup or support.",
  },
]

export default function Pricing() {
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
        <div className="absolute right-[-8rem] top-[8rem] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Simple pricing for growing SEO teams
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Choose the plan that fits your{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              SEO workflow
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Start free, upgrade when you are ready, and use a premium SEO platform that keeps work simple and organized.
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
                      <span className="pb-1 text-sm text-muted-foreground">{plan.period}</span>
                    </div>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      {plan.name === "Agency" ? (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/contact">
                            {plan.cta}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : plan.popular ? (
                        <Button asChild className="w-full">
                          <Link to="/signup">
                            {plan.cta}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/signup">
                            {plan.cta}
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
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Why upgrade?</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Premium gives you the tools you need to move faster and manage SEO in one place.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => {
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
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Common questions</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A few quick answers about pricing and plans.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <motion.div
                key={item.q}
                initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                  <h3 className="text-lg font-semibold">{item.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to get started?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Start free today and upgrade whenever your SEO workflow needs more power.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
