import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { PasswordInput } from "../../components/ui/input"

export default function Signup() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!fullName || !email || !password || !confirm) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    const { error: authError } = await signUp(email, password, fullName)
    setLoading(false)
    if (authError) {
      setError(authError)
      return
    }
    setSuccess(true)
  }

  const benefits = [
    "Free forever plan with core SEO tools",
    "Site audits, keyword research, and rank tracking",
    "AI-powered content strategy and writing tools",
    "Upgrade anytime as your team grows",
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
            background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(249,115,22,0.15) 0%, rgba(59,130,246,0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="hero-blob hero-blob-orange animate-blob"
          style={{ width: "350px", height: "350px", top: "-80px", right: "-80px", opacity: 0.25 }}
        />
        <div
          className="hero-blob hero-blob-blue animate-blob animate-blob-delay-1"
          style={{ width: "400px", height: "400px", bottom: "-100px", left: "-100px", opacity: 0.25 }}
        />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
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
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{
                background: "rgba(249,115,22,0.15)",
                border: "1px solid rgba(249,115,22,0.3)",
                color: "#fb923c",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Free to start. No credit card required.
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
              Join thousands of SEO professionals growing with Hi-SEO
            </h2>
            <p className="text-blue-200/60 text-lg leading-relaxed">
              Get your free account and start auditing, tracking, and optimizing your website in minutes.
            </p>
          </motion.div>

          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/70">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)" }}
              >
                A
              </div>
              <div>
                <p className="text-sm font-bold text-white">Adewale O.</p>
                <p className="text-xs text-white/40">SEO Manager at TechCorp NG</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed italic">
              Hi-SEO transformed how we approach organic growth. Our traffic increased 340 percent in 6 months using their audit and keyword tools.
            </p>
            <div className="flex items-center gap-0.5 mt-3">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#f97316">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/25 font-medium">
            No credit card required. Free plan available forever.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
                Create your free account
              </h1>
              <p className="text-white/50 text-sm font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "rgba(16,185,129,0.2)", border: "2px solid rgba(16,185,129,0.4)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white">Account created!</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  We sent a confirmation email to <strong className="text-white/80">{email}</strong>. Please check your inbox and verify your account to get started.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                  }}
                >
                  Go to Sign In
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ) : (
              <>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/80">
                      Full name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-0 w-11 h-12 flex items-center justify-center text-white/35 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                      />
                    </div>
                  </div>

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
                        className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                      />
                    </div>
                  </div>

                  <PasswordInput
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    dark={true}
                    hint="Must be at least 6 characters"
                  />

                  <PasswordInput
                    label="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    dark={true}
                    error={confirm && confirm !== password ? "Passwords do not match" : undefined}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #ea6c04)",
                      boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Free Account
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-white/8 text-center">
                  <p className="text-xs text-white/25 font-medium">
                    By creating an account you agree to our{" "}
                    <Link to="/terms" className="text-white/40 hover:text-white/60 underline transition-colors">Terms</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-white/40 hover:text-white/60 underline transition-colors">Privacy Policy</Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
