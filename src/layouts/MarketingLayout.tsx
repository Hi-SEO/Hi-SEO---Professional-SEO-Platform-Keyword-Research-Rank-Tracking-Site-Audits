import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Zap } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "#",
    children: [
      { label: "SEO Glossary", href: "/glossary" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Compare Plans", href: "/compare" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare Plans", href: "/compare" },
    { label: "Changelog", href: "/blog" },
  ],
  Resources: [
    { label: "SEO Glossary", href: "/glossary" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function MarketingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ margin: 0, padding: 0 }}>

      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(7,18,63,0.97)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Hi<span style={{ color: "#06b6d4" }}>-SEO</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 text-blue-100 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                    >
                      {link.label}
                      <ChevronDown
                        className="w-4 h-4 transition-transform duration-200"
                        style={{ transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden"
                          style={{
                            background: "rgba(7,18,63,0.98)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="block px-4 py-3 text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-150"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-blue-100 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                to="/login"
                className="text-blue-100 hover:text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#f97316",
                  boxShadow: "0 0 20px rgba(249,115,22,0.35)",
                }}
              >
                Start Free
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
              style={{
                background: "rgba(7,18,63,0.98)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <div className="text-xs font-bold text-blue-400 uppercase tracking-widest px-3 pt-4 pb-2">
                        {link.label}
                      </div>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block text-blue-100 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors duration-150 text-sm"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="block text-blue-100 hover:text-white font-medium px-3 py-3 rounded-lg hover:bg-white/10 transition-colors duration-150 text-sm"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="pt-4 pb-2 border-t border-white/10 space-y-2 mt-2">
                  <Link
                    to="/login"
                    className="block text-center text-blue-100 hover:text-white font-medium px-3 py-3 rounded-xl hover:bg-white/10 transition-colors duration-150 text-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center text-white font-bold px-3 py-3 rounded-xl text-sm transition-all duration-300"
                    style={{ backgroundColor: "#f97316" }}
                  >
                    Start Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PAGE CONTENT - no top padding here, each page handles its own hero */}
      <main className="flex-1 w-full" style={{ margin: 0, padding: 0 }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#07123f", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">

            {/* Brand col */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  Hi<span style={{ color: "#06b6d4" }}>-SEO</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: "#93c5fd" }}>
                The all-in-one SEO platform built for African businesses and growth teams.
                Rank higher, grow faster, and win online with Hi-SEO.
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium" style={{ color: "#7dd3fc" }}>All systems operational</span>
              </div>
            </div>

            {/* Footer links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-widest">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm transition-colors duration-150 hover:text-white"
                        style={{ color: "#93c5fd" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm" style={{ color: "#60a5fa" }}>
              2025 Hi-SEO. All rights reserved. Built for African businesses.
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-sm transition-colors duration-150 hover:text-white"
                  style={{ color: "#60a5fa" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
