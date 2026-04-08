import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import {
  ArrowRight,
  Mail,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Users,
  Sparkles,
} from "lucide-react"

export default function Contact() {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Thanks for reaching out. Our team will reply soon.")
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
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
            <Mail className="h-4 w-4 text-primary" />
            Contact Hi-SEO
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Talk to our team about{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              your SEO goals
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Need help with onboarding, billing, support, or strategy? Send us a message and we will get back to you.
          </p>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
                <h2 className="text-2xl font-bold">Send a message</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share your question or request and we will respond as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-12 md:col-span-2"
                    required
                  />
                  <textarea
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[180px] rounded-lg border bg-background px-4 py-3 text-sm outline-none md:col-span-2"
                    required
                  />

                  {status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 md:col-span-2">
                      {status}
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <Button type="submit">
                      Send message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>

            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="space-y-4">
                {[
                  {
                    icon: Users,
                    title: "Support",
                    text: "support@hi-seo.com",
                    desc: "General help and product questions.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Security",
                    text: "We care about your account safety.",
                    desc: "Sensitive account and payment topics.",
                  },
                  {
                    icon: Clock3,
                    title: "Response time",
                    text: "Usually within 24 hours.",
                    desc: "We aim to reply quickly and clearly.",
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <Card key={item.title} className="border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur">
                      <div className="flex items-start gap-3">
                        <Icon className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.text}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
