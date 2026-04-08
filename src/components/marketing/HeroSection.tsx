import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { DashboardMockup } from "./DashboardMockup"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 16 } },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_45%)]" />

      <div className="container relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              Introducing Hi-SEO 2.0
            </span>

            <h1 className="mt-6 text-balance text-5xl font-bold tracking-tighter leading-tight md:text-7xl">
              Dominate Search with Intelligent SEO Software.
            </h1>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-xl text-muted-foreground">
              An enterprise-grade platform for keyword research, rank tracking, and AI-assisted content optimization.
              Built for serious growth teams that need clean workflows and fast insights.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="premium" className="w-full px-8 text-base sm:w-auto" asChild>
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="w-full px-8 text-base sm:w-auto" asChild>
              <Link to="/compare">Compare to Ahrefs</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {["Live rank tracking", "AI briefs", "White-label reports"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-16 lg:mt-20"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  )
}
