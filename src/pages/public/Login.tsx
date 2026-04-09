import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { PasswordInput } from "../../components/ui/input"

export default function Login() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }
    setLoading(true)
    const { error: authError } = await signIn(email, password)
    setLoading(false)
    if (authError) {
      setError(authError)
      return
    }
    setSuccess(true)
    setTimeout(() => navigate("/app"), 800)
  }

  const features = [
    { icon: "search", text: "Keyword research with real search volume data" },
    { icon: "shield", text: "Full technical site audits in seconds" },
    { icon: "trending", text: "Rank tracking across all major search engines" },
    { icon: "zap", text: "AI-powered content strategy and writing tools" },
  ]

  const stats = [
    { value: "50K+", label: "Active users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User rating" },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "linear-gradient(135deg, #07123f 0%, #0b1729 100%)" }}>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col lg:w-[45%] xl:w-[480px] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-overlay opacity-25" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 70% at 30% 50%, rgba(59,130,246,0.22) 0%, transparent 70%)" }}
        />
        <div
          className="hero-blob hero-blob-blue animate-blob"
          style={{ width: "500px", height: "500px", top: "-150px", left: "-150px", opacity: 0.28 }}
        />
        <div
          className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2"
          style={{ width: "350px", height: "350px", bottom: "-80px", right: "-60px", opacity: 0.2 }}
        />
        <div
          className="hero-blob hero-blob-orange animate-blob-slow animate-blob-delay-1"
          style={{ width: "200px", height: "200px", top: "60%", right: "10%", opacity: 0.15 }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
              }}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-white font-black" style={{ fontSize: "8px", letterSpacing: "0.12em" }}>HI</span>
                <span className="text-white font-black" style={{ fontSize: "11px", lineHeight: 1 }}>SEO</span>
              </div>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-black text-2xl text-white">Hi-</span>
              <span
                className="font-black text-2xl"
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SEO
              </span>
            </div>
          </Link>

          {/* Main content */}
          <div className="space-y-8 py-12">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                Welcome back to your SEO command center
              </h2>
              <p className="text-blue-200/55 text-base xl:text-lg leading-relaxed">
                Pick up right where you left off. Your rankings, audits, and keyword data are all waiting for you.
              </p>
            </motion.div>

            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.28)" }}
                  >
                    {f.icon === "search" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                      </svg>
                    )}
                    {f.icon === "shield" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {f.icon === "trending" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                    )}
                    {f.icon === "zap" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white/65">{f.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-center gap-8 pt-2"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/38 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom trust text */}
          <p className="text-xs text-white/22 font-medium">
            Trusted by founders, agencies, and SEO professionals worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-[440px] py-8 lg:py-0"
        >

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.5)",
              }}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-white font-black" style={{ fontSize: "7px", letterSpacing: "0.12em" }}>HI</span>
                <span className="text-white font-black" style={{ fontSize: "10px", lineHeight: 1 }}>SEO</span>
              </div>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-black text-xl text-white">Hi-</span>
              <span
                className="font-black text-xl"
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SEO
              </span>
            </div>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div className="mb-7">
              <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                Sign in to your account
              </h1>
              <p className="text-white/48 text-sm font-medium">
                Do not have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Start for free
                </Link>
              </p>
            </div>

            {/* Success state */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(16,185,129,0.2)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-emerald-400 text-sm font-semibold">Signed in successfully! Redirecting you now...</span>
              </motion.div>
            )}

            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl flex items-start gap-3"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span className="text-red-400 text-sm font-medium leading-relaxed">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-white/75">
                  Email address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-0 w-11 h-12 flex items-center justify-center text-white/30 pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-white placeholder:text-white/28 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.11)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)" }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white/75">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  dark={true}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-1"
                style={{
                  background: loading || success
                    ? "rgba(37,99,235,0.7)"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 24px rgba(59,130,246,0.42)",
                }}
                onMouseEnter={(e) => {
                  if (!loading && !success) e.currentTarget.style.boxShadow = "0 6px 32px rgba(59,130,246,0.65)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,0.42)"
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Signing in...
                  </>
                ) : success ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Redirecting...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-7 pt-6 border-t border-white/7">
              <div className="flex items-center justify-center gap-5">
                {[
                  { icon: "shield", label: "Secure login" },
                  { icon: "lock", label: "Encrypted" },
                  { icon: "eye-off", label: "Private" },
                ].map((trust) => (
                  <div key={trust.label} className="flex items-center gap-1.5 text-white/28">
                    {trust.icon === "shield" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {trust.icon === "lock" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                    {trust.icon === "eye-off" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      </svg>
                    )}
                    <span className="text-xs font-medium">{trust.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center mt-5 text-xs text-white/22 font-medium">
            By signing in you agree to our{" "}
            <Link to="/terms" className="text-white/38 hover:text-white/60 underline underline-offset-2 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-white/38 hover:text-white/60 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
