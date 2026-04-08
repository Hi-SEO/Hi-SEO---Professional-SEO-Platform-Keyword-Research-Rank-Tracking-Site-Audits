import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  Lock,
  Users,
  BadgeCheck,
} from "lucide-react"

const sections = [
  {
    title: "1. Use of the service",
    text: "Hi-SEO is provided for lawful SEO, marketing, and business use. You agree not to misuse the platform, try to break it, or use it in a harmful way.",
  },
  {
    title: "2. Accounts",
    text: "You are responsible for keeping your login details safe and for actions taken in your account. Please keep your profile information accurate.",
  },
  {
    title: "3. Payments",
    text: "Paid plans and premium access should be activated only after payment is verified. Billing actions must follow the platform rules and payment provider rules.",
  },
  {
    title: "4. Service changes",
    text: "We may improve, update, or change features over time. We will try to keep the experience clear and stable, but some changes may be needed.",
  },
]

const highlights = [
  "Clear and simple platform rules",
  "Designed for professional use",
  "Secure account and payment handling",
  "Premium SaaS experience",
]

export default function Terms() {
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
            <FileText className="h-4 w-4 text-primary" />
            Terms of Service
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Clear rules for using{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              Hi-SEO
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            These terms explain how the platform should be used and what you can expect when working inside Hi-SEO.
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
                  <ShieldCheck className="h-4 w-4" />
                  Main points
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Simple terms, easy to understand</h2>
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
        <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Account responsibility",
              text: "Keep your account secure and accurate.",
            },
            {
              icon: Lock,
              title: "Safe usage",
              text: "Use the platform in a lawful and safe way.",
            },
            {
              icon: BadgeCheck,
              title: "Updates",
              text: "We may improve the service over time.",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </Card>
            )
          })}
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <motion.h2 {...fadeUp} className="text-3xl font-bold tracking-tight md:text-5xl">
            Need help understanding the terms?
          </motion.h2>
          <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            You can contact us anytime if you need clarification or support.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/privacy">View Privacy Policy</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
