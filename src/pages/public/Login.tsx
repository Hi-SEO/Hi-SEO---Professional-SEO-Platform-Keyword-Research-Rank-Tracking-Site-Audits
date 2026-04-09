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
      setError("Please enter your email and password")
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
    { icon: "search", text: "Keyword research with real volume data" },
    { icon: "shield", text: "Full site audits in seconds" },
    { icon: "trending", text: "Rank tracking across all search engines" },
    { icon: "zap", text: "AI-powered content strategy tools" },
  ]

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #07123f 0%, #0b1729 100%)" }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-overlay opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="hero-blob hero-blob-blue animate-blob"
          style={{ width: "400px", height: "400px", top: "-100px", left: "-100px", opacity: 0.3 }}
        />
        <div
          className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2"
          style={{ width: "300px", height: "300px", bottom: "-50px", right: "-50px", opacity: 0.2 }}
        />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
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
                }}
              >
                SEO
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
              Welcome back to your SEO command center
            </h2>
            <p className="text-blue-200/60 text-lg leading-relaxed">
              Pick up right where you left off. Your rankings, audits, and keyword data are waiting.
            </p>
          </motion.div>

          <div className="space-y-4">
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
                  style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" }}
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
                    </svg>
                  )}
                  {f.icon === "zap" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-white/70">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2">
            {[
              { value: "10K+", label: "Active users" },
              { value: "98%", label: "Uptime" },
              { value: "4.9", label: "User rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-white/40 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/25 font-medium">
            Trusted by founders, agencies, and SEO professionals worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}
              >
                <div className="flex flex-col items-center leading-none">
                  <span className="text-white font-black" style={{ fontSize: "6px" }}>HI</span>
                  <span className="text-white font-black" style={{ fontSize: "9px", lineHeight: 1 }}>SEO</span>
                </div>
              </div>
              <span className="font-black text-lg text-white">Hi-SEO</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                Sign in to your account
              </h1>
              <p className="text-white/50 text-sm font-medium">
                Do not have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Start for free
                </Link>
              </p>
            </div>

            {success && (
              <div
                className="mb-6 p-4 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span className="text-emerald-400 text-sm font-semibold">Signed in successfully! Redirecting...</span>
              </div>
            )}

            {error && (
              <div
                className="mb-6 p-4 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span className="text-red-400 text-sm font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-white/80">
                  Email address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-0 w-11 h-12 flex items-center justify-center text-white/35 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white/80">
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
                  dark={true}
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: loading ? "rgba(59,130,246,0.6)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Signing in...
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

            <div className="mt-8 pt-6 border-t border-white/8">
              <div className="flex items-center justify-center gap-6">
                {[
                  { icon: "shield", label: "Secure login" },
                  { icon: "lock", label: "Encrypted" },
                  { icon: "eye-off", label: "Private" },
                ].map((trust) => (
                  <div key={trust.label} className="flex items-center gap-1.5 text-white/30">
                    {trust.icon === "shield" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {trust.icon === "lock" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                    {trust.icon === "eye-off" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      </svg>
                    )}
                    <span className="text-xs font-medium">{trust.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center mt-6 text-xs text-white/25 font-medium">
            By signing in you agree to our{" "}
            <Link to="/terms" className="text-white/40 hover:text-white/60 underline transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-white/40 hover:text-white/60 underline transition-colors">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
