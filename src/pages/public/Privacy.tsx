import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Lock,
  Eye,
  Database,
  MessageSquare,
} from "lucide-react"

const sections = [
  {
    title: "1. Data we collect",
    text: "We may collect account details, workspace data, and usage information needed to run Hi-SEO and provide support.",
  },
  {
    title: "2. How we use data",
    text: "We use data to provide SEO tools, manage your account, improve the product, and help with support requests.",
  },
  {
    title: "3. Sharing",
    text: "We do not sell your personal data. We only share data when it is needed to run the service or meet legal requirements.",
  },
  {
    title: "4. Your choices",
    text: "You can request updates or deletion of your account based on our support process and platform rules.",
  },
]

const highlights = [
  "Account and workspace data only",
  "No unnecessary sharing",
  "Support for user requests",
  "Security-first approach",
]

export default function Privacy() {
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
            <ShieldCheck className="h-4 w-4 text-primary" />
            Privacy Policy
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Your data is handled with{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              care and transparency
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            This page explains what information we collect, how we use it, and how we try to keep your account and workspace data safe.
          </p>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Lock className="h-4 w-4" />
                  Privacy first
                </div>
                <h2 className="text-3xl font-bold tracking-tight">We keep privacy simple</h2>
                <div className="mt-6 space-y-4">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <div className="space-y-4">
              {sections.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Database, title: "Stored securely", text: "Account and workspace data" },
            { icon: Eye, title: "Transparent use", text: "Used to run the product" },
            { icon: MessageSquare, title: "Support ready", text: "Help when needed" },
            { icon: ShieldCheck, title: "Security focus", text: "Built with care" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </Card>
            )
          })}
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Need help with your data or account?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Contact us if you need support, account changes, or clarification about how your information is used.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/terms">View Terms</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
