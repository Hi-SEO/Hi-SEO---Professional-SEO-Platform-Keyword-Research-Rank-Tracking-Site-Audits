import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
  Globe,
  Target,
  Search,
  CalendarDays,
  TrendingUp,
  FileText,
  CheckCircle2,
} from "lucide-react"

/* =========================
   BLOG PAGE
========================= */
export function BlogPage() {
  const reduceMotion = useReducedMotion()

  const posts = [
    {
      tag: "SEO Strategy",
      title: "How to build a better SEO workflow without feeling overwhelmed",
      date: "Today",
      read: "5 min read",
      summary:
        "A simple guide to organizing audits, keywords, reports, and content into one clear system.",
    },
    {
      tag: "Keyword Research",
      title: "What to look for when choosing keywords that can actually rank",
      date: "This week",
      read: "4 min read",
      summary:
        "Focus on search intent, competition, and opportunities that bring the right traffic.",
    },
    {
      tag: "Product Updates",
      title: "Why a premium dashboard experience matters for SEO teams",
      date: "This week",
      read: "3 min read",
      summary:
        "Great tools are easier to use when the interface is clean, fast, and easy to understand.",
    },
  ]

  const featured = posts[0]

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
            <BookOpen className="h-4 w-4 text-primary" />
            Hi-SEO Blog
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Learn SEO with{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              clear guides and updates
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Read practical SEO advice, product updates, and workflow tips designed to help teams move faster and make better decisions.
          </p>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Featured */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-full overflow-hidden border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Featured article
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {featured.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {featured.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {featured.read}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1">
                    {featured.tag}
                  </span>
                </div>

                <div className="mt-8">
                  <Button asChild>
                    <Link to="/signup">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
                <h3 className="text-xl font-semibold">Why read the blog?</h3>
                <div className="mt-5 space-y-4">
                  {[
                    "Learn SEO in simple language",
                    "See product updates and workflow ideas",
                    "Get tips to use Hi-SEO better",
                    "Stay organized with better processes",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Articles */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="h-full border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-3 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {post.tag}
                  </div>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.summary}</p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.read}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* =========================
   CONTACT PAGE
========================= */
export function ContactPage() {
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
            Need help with onboarding, billing, product support, or SEO strategy? Send us a message and we will get back to you.
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

/* =========================
   FAQ PAGE
========================= */
export function FaqPage() {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: "What does Hi-SEO do?",
      a: "Hi-SEO gives you one premium workspace for keyword research, site audits, ranking checks, backlinks, reports, and more.",
    },
    {
      q: "Who is this product for?",
      a: "It is built for founders, marketers, agencies, and in-house teams who want a cleaner SEO workflow.",
    },
    {
      q: "Can I start free?",
      a: "Yes. You can begin with the free plan and upgrade later when you need premium access.",
    },
    {
      q: "Why does the product feel premium?",
      a: "Because the UI is designed to be clean, modern, and easy to understand, with a strong focus on user experience.",
    },
    {
      q: "Is my account secure?",
      a: "Yes. Authentication is handled with Supabase, and sensitive actions should be managed through secure server-side logic.",
    },
  ]

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
            <MessageSquare className="h-4 w-4 text-primary" />
            Frequently asked questions
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Quick answers for{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              new and existing users
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Learn what Hi-SEO does, how it works, and how to use the platform with confidence.
          </p>
        </motion.div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="space-y-4">
            {faqs.map((item, index) => {
              const open = activeIndex === index
              return (
                <motion.div
                  key={item.q}
                  initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur">
                    <button
                      onClick={() => setActiveIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-lg font-semibold">{item.q}</span>
                      <span className="text-2xl font-light text-muted-foreground">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open && (
                      <div className="border-t px-6 py-5 text-sm leading-7 text-muted-foreground">
                        {item.a}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div {...fadeUp} className="mt-10 text-center">
            <Card className="border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
              <h2 className="text-2xl font-bold">Still have questions?</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Contact us if you want help with onboarding, billing, or product details.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link to="/contact">
                    Contact Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

/* Default export not needed if routes point directly to separate files,
   but this file can also be used as a shared source if you want. */
export default function Placeholder() {
  return null
}
