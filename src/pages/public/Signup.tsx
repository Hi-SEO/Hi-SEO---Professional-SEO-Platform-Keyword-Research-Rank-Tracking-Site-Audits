import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useAuth } from "../../context/AuthContext"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Users,
  Zap,
  BarChart3,
  Search,
  TrendingUp,
} from "lucide-react"

const benefits = [
  "Premium dashboard experience",
  "SEO tools in one place",
  "Built for fast workflows",
  "Secure Supabase auth",
]

const steps = [
  { number: "01", title: "Create account", text: "Use your email to get started in seconds." },
  { number: "02", title: "Set up workspace", text: "Add your project and organize your SEO work." },
  { number: "03", title: "Start exploring", text: "Run audits, track keywords, and save reports." },
]

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess("Account created successfully. Please check your email to verify your account.")
      setTimeout(() => navigate("/login"), 1800)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-[8rem] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        {/* Left side */}
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Start your premium SEO workspace
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Create your{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              Hi-SEO account
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
            Join Hi-SEO and manage keyword research, audits, ranking data, backlinks, and reports in one polished dashboard built for speed and clarity.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-xl border bg-card/70 px-4 py-3 text-sm font-medium shadow-sm backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Search, label: "Keyword research" },
              { icon: BarChart3, label: "SEO dashboards" },
              { icon: TrendingUp, label: "Growth tracking" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.label} className="border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">{item.label}</p>
                </Card>
              )
            })}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="h-full border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm font-semibold text-primary">{step.number}</p>
                  <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side form */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, x: 40, scale: 0.97 }}
          whileInView={reduceMotion ? {} : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_30%)]" />

            <div className="relative mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure signup
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Enter your details below to start your SEO workspace. After signup, you may need to verify your email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/80 backdrop-blur"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background/80 backdrop-blur"
                  required
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Use at least 6 characters for your password.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <Button type="submit" size="lg" className="h-12 w-full shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="relative mt-8 border-t pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
