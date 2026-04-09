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
    { label: "Blog", href: "/blog" },
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", width: "100%", overflowX: "hidden" }}>

      {/* ===== NAVBAR ===== */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          background: scrolled ? "rgba(7,18,63,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

            {/* Logo */}
            <Link
              to="/"
              style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59,130,246,0.4)" }}>
                <Zap size={18} color="white" />
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
                Hi<span style={{ color: "#06b6d4" }}>-SEO</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: "none", alignItems: "center", gap: 4 }} className="lg-nav">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button style={{ display: "flex", alignItems: "center", gap: 4, color: "#bfdbfe", fontWeight: 500, padding: "8px 14px", borderRadius: 8, background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}>
                      {link.label}
                      <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: openDropdown === link.label ? "rotate(180deg)" : "rotate(0)" }} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, width: 200, background: "rgba(7,18,63,0.98)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", overflow: "hidden" }}
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              style={{ display: "block", padding: "10px 16px", color: "#bfdbfe", fontSize: "0.875rem", textDecoration: "none", transition: "all 0.15s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#bfdbfe"; }}
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
                    style={{ color: "#bfdbfe", fontWeight: 500, padding: "8px 14px", borderRadius: 8, fontSize: "0.9rem", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#bfdbfe"; (e.currentTarget as HTMLElement).style.background = "none"; }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div style={{ display: "none", alignItems: "center", gap: 10 }} className="lg-auth">
              <Link
                to="/login"
                style={{ color: "#bfdbfe", fontWeight: 600, padding: "8px 16px", borderRadius: 8, fontSize: "0.9rem", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#bfdbfe"; (e.currentTarget as HTMLElement).style.background = "none"; }}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                style={{ display: "inline-flex", alignItems: "center", backgroundColor: "#f97316", color: "white", fontWeight: 700, padding: "9px 20px", borderRadius: 10, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 0 20px rgba(249,115,22,0.35)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                Start Free
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", transition: "all 0.2s" }}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden", background: "rgba(7,18,63,0.99)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 1.25rem 1.5rem" }}>

                {/* Mobile nav links */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "1rem" }}>
                  {navLinks.map((link) =>
                    link.children ? (
                      <div key={link.label}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", padding: "12px 12px 6px" }}>
                          {link.label}
                        </div>
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            style={{ display: "block", color: "#bfdbfe", padding: "10px 12px", borderRadius: 8, fontSize: "0.95rem", textDecoration: "none", transition: "all 0.15s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#bfdbfe"; }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.href}
                        style={{ display: "block", color: "#bfdbfe", fontWeight: 500, padding: "10px 12px", borderRadius: 8, fontSize: "0.95rem", textDecoration: "none", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#bfdbfe"; }}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>

                {/* Mobile auth buttons */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link
                    to="/login"
                    style={{ display: "block", textAlign: "center", color: "white", fontWeight: 600, padding: "12px", borderRadius: 10, fontSize: "0.95rem", textDecoration: "none", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    style={{ display: "block", textAlign: "center", backgroundColor: "#f97316", color: "white", fontWeight: 700, padding: "12px", borderRadius: 10, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 15px rgba(249,115,22,0.4)" }}
                  >
                    Start Free - No Card Needed
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Responsive styles injected */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-nav { display: flex !important; }
          .lg-auth { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, width: "100%", minWidth: 0 }}>
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ backgroundColor: "#07123f", borderTop: "1px solid rgba(255,255,255,0.08)", width: "100%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.25rem 2rem" }}>

          {/* Footer grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>

            {/* Brand */}
            <div style={{ gridColumn: "span 1" }}>
              <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: "1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={18} color="white" />
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "white" }}>
                  Hi<span style={{ color: "#06b6d4" }}>-SEO</span>
                </span>
              </Link>
              <p style={{ color: "#93c5fd", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1rem", maxWidth: 220 }}>
                The all-in-one SEO platform built for African businesses. Rank higher, grow faster, win online.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#34d399", display: "inline-block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.75rem", color: "#7dd3fc", fontWeight: 500 }}>All systems operational</span>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 style={{ color: "white", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                  {category}
                </h4>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        style={{ color: "#93c5fd", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#93c5fd"; }}
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
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <p style={{ color: "#60a5fa", fontSize: "0.8rem" }}>
              2025 Hi-SEO. All rights reserved. Built for African businesses.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {[{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Contact", href: "/contact" }].map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  style={{ color: "#60a5fa", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#60a5fa"; }}
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
