import React, { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { clsx } from "clsx"
import { useAuth } from "../context/AuthContext"
import { PlanBadge } from "../components/ui/badge"

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        href: "/app",
        label: "Dashboard",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
        exact: true,
      },
      {
        href: "/app/projects",
        label: "Projects",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        href: "/app/reports",
        label: "Reports",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "SEO Tools",
    items: [
      {
        href: "/app/site-explorer",
        label: "Site Explorer",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        ),
      },
      {
        href: "/app/site-audit",
        label: "Site Audit",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        ),
      },
      {
        href: "/app/keyword-explorer",
        label: "Keywords",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        ),
      },
      {
        href: "/app/rank-tracker",
        label: "Rank Tracker",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        ),
      },
      {
        href: "/app/backlinks",
        label: "Backlinks",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        ),
      },
      {
        href: "/app/serp-analysis",
        label: "SERP Analysis",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        href: "/app/competitors",
        label: "Competitors",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        href: "/app/content-strategy",
        label: "Content Strategy",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      },
      {
        href: "/app/ai-writer",
        label: "AI Writer",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
        badge: "AI",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href: "/app/settings",
        label: "Settings",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
      {
        href: "/app/billing",
        label: "Billing",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        ),
      },
    ],
  },
]

const PAGE_TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/projects": "Projects",
  "/app/reports": "Reports",
  "/app/site-explorer": "Site Explorer",
  "/app/site-audit": "Site Audit",
  "/app/keyword-explorer": "Keyword Explorer",
  "/app/rank-tracker": "Rank Tracker",
  "/app/backlinks": "Backlink Analytics",
  "/app/competitors": "Competitor Analysis",
  "/app/content-strategy": "Content Strategy",
  "/app/ai-writer": "AI Writer",
  "/app/serp-analysis": "SERP Analysis",
  "/app/settings": "Settings",
  "/app/billing": "Billing",
}

function SidebarContent({
  onClose,
  profile,
  onSignOut,
}: {
  onClose?: () => void
  profile: any
  onSignOut: () => void
}) {
  const location = useLocation()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href
    return location.pathname === href || location.pathname.startsWith(href + "/")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/6">
        <Link
          to="/app"
          className="flex items-center gap-2.5 group"
          onClick={onClose}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
              boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
            }}
          >
            <div className="relative z-10 flex flex-col items-center leading-none">
              <span className="text-white font-black" style={{ fontSize: "6px", letterSpacing: "0.12em" }}>HI</span>
              <span className="text-white font-black" style={{ fontSize: "9px", lineHeight: 1 }}>SEO</span>
            </div>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-black text-lg text-white tracking-tight">Hi-</span>
            <span
              className="font-black text-lg tracking-tight"
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
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group",
                      active
                        ? "text-white bg-blue-600/20 border border-blue-500/20"
                        : "text-white/55 hover:text-white/90 hover:bg-white/6"
                    )}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #3b82f6, #06b6d4)" }}
                      />
                    )}
                    <span className={clsx("shrink-0", active ? "text-blue-400" : "text-white/35 group-hover:text-white/60")}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span
                        className="px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                        style={{
                          background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.3))",
                          border: "1px solid rgba(99,102,241,0.3)",
                          color: "#a5b4fc",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      {profile?.plan === "free" || !profile?.plan ? (
        <div className="px-3 pb-3">
          <Link
            to="/app/billing"
            onClick={onClose}
            className="block w-full p-3 rounded-xl relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,108,4,0.1))",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #f97316, #ea6c04)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white/90">Upgrade to Pro</p>
                <p className="text-[10px] text-white/40 font-medium">Unlock all features</p>
              </div>
            </div>
          </Link>
        </div>
      ) : null}

      {/* User Profile */}
      <div className="px-3 pb-4 pt-2 border-t border-white/6">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/6 transition-colors duration-200 cursor-default">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
          >
            {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/80 truncate">
              {profile?.full_name || "User"}
            </p>
            <div className="mt-0.5">
              <PlanBadge plan={profile?.plan || "free"} />
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all duration-200"
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard"

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleSignOut = async () => {
    await signOut()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0b1729" }}>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[260px] z-40"
        style={{
          background: "#07111f",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <SidebarContent profile={profile} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={shouldReduceMotion ? { opacity: 0 } : { x: -280, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[260px] z-50 lg:hidden"
              style={{
                background: "#07111f",
                borderRight: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <SidebarContent
                onClose={() => setMobileOpen(false)}
                profile={profile}
                onSignOut={handleSignOut}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-[260px] min-h-screen">

        {/* Top Header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 h-16 shrink-0"
          style={{
            background: "rgba(7,17,31,0.95)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Left: Mobile menu + Page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/8 transition-colors duration-200"
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
              <span className="block w-4 h-0.5 bg-white/70 rounded-full" />
              <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
            </button>

            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-[11px] text-white/35 font-medium hidden sm:block">
                Hi-SEO Dashboard
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/6 transition-all duration-200 border border-white/8">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-xs font-medium hidden md:block">Search...</span>
              <kbd className="hidden md:block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/8 text-white/30">
                K
              </kbd>
            </button>

            {/* Notification bell */}
            <button
              className="relative p-2.5 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/6 transition-all duration-200"
              aria-label="Notifications"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: "#f97316" }}
              />
            </button>

            {/* Avatar */}
            <Link
              to="/app/settings"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/6 transition-all duration-200"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
