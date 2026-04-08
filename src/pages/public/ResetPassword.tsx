import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { supabase } from "../../lib/supabase"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Lock,
  KeyRound,
  Clock3,
} from "lucide-react"

const tips = [
  "Use a strong password",
  "Keep it private",
  "Update it regularly",
  "Return to your workspace",
]

const steps = [
  { number: "01", title: "Enter new password", text: "Choose a secure new password for your account." },
  { number: "02", title: "Confirm it", text: "Make sure both password fields match exactly." },
  { number: "03", title: "Sign back in", text: "Return to the dashboard with your updated password." },
]

export default function ResetPassword() {
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

    if (!password.trim()) {
      setError("Password is required.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess("Password updated successfully. Redirecting to login...")

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.")
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
        {/* Left */}
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Secure password reset
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-6xl">
            Create a{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              new password
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
            Choose a strong new password and get back into your Hi-SEO workspace safely and quickly.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {tips.map((item) => (
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

        {/* Right */}
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
                <KeyRound className="h-4 w-4 text-primary" />
                Reset your password
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Set a new password</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Enter a new password below. After saving it, you can sign back in to your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">New password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background/80 backdrop-blur"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Confirm password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-background/80 backdrop-blur"
                  required
                />
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
                {loading ? "Updating password..." : "Update password"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="relative mt-8 border-t pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
