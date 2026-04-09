import React, { useState, useEffect, useRef } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { clsx } from "clsx"

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Glossary", href: "/glossary" },
  { label: "Contact", href: "/contact" },
]

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare Plans", href: "/compare" },
    { label: "Changelog", href: "/blog" },
    { label: "Roadmap", href: "/blog" },
  ],
  Resources: [
    { label: "SEO Glossary", href: "/glossary" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "About Us", href: "/about" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #0ea5e9 100%)",
          boxShadow: "0 4px 16px rgba(59,130,246,0.45)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center leading-none">
          <span className="text-white font-black" style={{ fontSize: "7px", letterSpacing: "0.12em" }}>HI</span>
          <span className="text-white font-black" style={{ fontSize: "10px", letterSpacing: "-0.02em", lineHeight: 1 }}>SEO</span>
        </div>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className={clsx("font-black text-xl tracking-tight", dark ? "text-slate-900" : "text-white")}>
          Hi-
        </span>
        <span
          className="font-black text-xl tracking-tight"
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
  )
}

function TopBar() {
  return (
    <div
      className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs font-medium"
      style={{
        background: "rgba(7,18,63,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-white/50">Premium SEO workflow for modern teams</span>
      <div className="flex items-center gap-4 text-white/40">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secure
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Fast
        </span>
      </div>
    </div>
  )
}

export default function MarketingLayout() {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top accent line */}
      <div
        className="h-[3px] w-full"
        style={{
          background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #06b6d4, #f97316, #06b6d4, #3b82f6)",
          backgroundSize: "200% 100%",
        }}
      />

      <TopBar />

      {/* Sticky Header */}
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
            : ""
        )}
        style={{
          background: scrolled
            ? "rgba(7,18,63,0.97)"
            : "rgba(7,18,63,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                    isActive(link.href)
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors duration-200 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white",
                  "transition-all duration-300",
                  "shadow-[0_4px_20px_rgba(249,115,22,0.4)]",
                  "hover:shadow-[0_6px_30px_rgba(249,115,22,0.65)]",
                  "hover:scale-[1.02] active:scale-[0.98]"
                )}
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea6c04)",
                }}
              >
                Start Free Trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-white rounded-full"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden border-t border-white/8"
              style={{
                background: "rgba(7,18,63,0.98)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="section-container py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={link.href}
                      className={clsx(
                        "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                        isActive(link.href)
                          ? "text-white bg-blue-600/20 border border-blue-500/20"
                          : "text-white/70 hover:text-white hover:bg-white/8"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-3 pt-3 border-t border-white/8 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white/80 border border-white/15 hover:bg-white/8 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #ea6c04)",
                      boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                    }}
                  >
                    Start Free Trial
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "linear-gradient(180deg, #07111f 0%, #03080f 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* CTA Band */}
        <div
          className="py-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1239a8 0%, #07123f 100%)",
          }}
        >
          <div className="absolute inset-0 bg-grid-overlay opacity-30" />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(59,130,246,0.2) 0%, transparent 70%)",
            }}
          />
          <div className="section-container relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                Ready to dominate search rankings?
              </h3>
              <p className="text-blue-200/70 text-base">
                Join thousands of teams already using Hi-SEO to grow organic traffic.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea6c04)",
                  boxShadow: "0 4px 24px rgba(249,115,22,0.45)",
                }}
              >
                Start Free Trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="section-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
                Hi-SEO is the premium all-in-one SEO platform built for founders, marketers, and agencies who want real results from organic search.
              </p>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: "shield", label: "Secure Auth" },
                  { icon: "zap", label: "Fast Audits" },
                  { icon: "lock", label: "Private Data" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/50 border border-white/10"
                  >
                    {badge.icon === "shield" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {badge.icon === "zap" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    )}
                    {badge.icon === "lock" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-white/80 mb-4 tracking-wide uppercase text-xs">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="divider-glow my-10" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-medium">
              2025 Hi-SEO. All rights reserved. Built for serious SEO professionals.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
                Terms
              </Link>
              <Link to="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
                Privacy
              </Link>
              <div className="flex items-center gap-3">
                {/* Twitter/X */}
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-white/40 hover:text-white/80 hover:border-white/20 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.631 5.903-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-white/40 hover:text-white/80 hover:border-white/20 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
