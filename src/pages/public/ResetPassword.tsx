import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { PasswordInput } from "../../components/ui/input"

export default function ResetPassword() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!password || !confirm) {
      setError("Please fill in both fields")
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
    const { error: authError } = await updatePassword(password)
    setLoading(false)
    if (authError) {
      setError(authError)
      return
    }
    setSuccess(true)
    setTimeout(() => navigate("/login"), 2500)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #07123f 0%, #0b1729 100%)" }}
    >
      <div className="absolute inset-0 bg-grid-overlay opacity-30" />
      <div
        className="hero-blob hero-blob-blue animate-blob"
        style={{ width: "500px", height: "500px", top: "-150px", left: "-100px", opacity: 0.25 }}
      />
      <div
        className="hero-blob hero-blob-orange animate-blob animate-blob-delay-1"
        style={{ width: "350px", height: "350px", bottom: "-100px", right: "-80px", opacity: 0.2 }}
      />

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
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
                style={{ background: "rgba(16,185,129,0.2)", border: "2px solid rgba(16,185,129,0.4)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white">Password updated!</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Your password has been changed successfully. Redirecting you to sign in...
              </p>
              <div className="flex justify-center">
                <div
                  className="w-32 h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                  Set a new password
                </h1>
                <p className="text-white/50 text-sm font-medium leading-relaxed">
                  Choose a strong password for your Hi-SEO account. You will use it to sign in going forward.
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
                <PasswordInput
                  label="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  dark={true}
                  hint="Choose something strong and unique"
                />

                <PasswordInput
                  label="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  required
                  dark={true}
                  error={confirm && confirm !== password ? "Passwords do not match" : undefined}
                />

                {password.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white/40">Password strength</span>
                      <span className="text-xs font-bold" style={{
                        color: password.length < 6 ? "#ef4444" : password.length < 10 ? "#f59e0b" : "#10b981"
                      }}>
                        {password.length < 6 ? "Too short" : password.length < 10 ? "Fair" : "Strong"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4].map((bar) => (
                        <div
                          key={bar}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: bar <= (password.length < 6 ? 1 : password.length < 10 ? 2 : 4)
                              ? (password.length < 6 ? "#ef4444" : password.length < 10 ? "#f59e0b" : "#10b981")
                              : "rgba(255,255,255,0.1)"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

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
                      Updating password...
                    </>
                  ) : (
                    <>
                      Update Password
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/8 text-center">
                <Link
                  to="/login"
                  className="text-sm text-white/40 hover:text-white/70 font-semibold transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
