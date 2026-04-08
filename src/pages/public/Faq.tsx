import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { MessageSquare, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"

export default function Faq() {
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
