import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"

export default function ForgotPassword() {
  const shouldReduceMotion = useReducedMotion()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) {
      setError("Please enter your email address")
      return
    }
    setLoading(true)
    const { error: authError } = await resetPassword(email)
    setLoading(false)
    if (authError) {
      setError(authError)
      return
    }
    setSuccess(true)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #07123f 0%, #0b1729 100%)" }}
    >
      <div className="absolute inset-0 bg-grid-overlay opacity-30" />
      <div
        className="hero-blob hero-blob-blue animate-blob"
        style={{ width: "500px", height: "500px", top: "-150px", right: "-100px", opacity: 0.25 }}
      />
      <div
        className="hero-blob hero-blob-cyan animate-blob animate-blob-delay-2"
        style={{ width: "400px", height: "400px", bottom: "-100px", left: "-100px", opacity: 0.2 }}
      />

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white/80 transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Sign In
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
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
                }}
              >
                SEO
              </span>
            </div>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "rgba(59,130,246,0.2)", border: "2px solid rgba(59,130,246,0.4)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white">Check your inbox</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                We sent a password reset link to{" "}
                <strong className="text-white/80">{email}</strong>. The link expires in 1 hour.
              </p>
              <p className="text-white/30 text-xs">
                Did not receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline"
                >
                  try again
                </button>
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] mt-2"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                }}
              >
                Back to Sign In
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                  Reset your password
                </h1>
                <p className="text-white/50 text-sm font-medium leading-relaxed">
                  Enter the email address linked to your Hi-SEO account and we will send you a secure reset link.
                </p>
              </div>

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
                      className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium text-white placeholder:text-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/8 text-center">
                <p className="text-sm text-white/40 font-medium">
                  Remembered your password?{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
