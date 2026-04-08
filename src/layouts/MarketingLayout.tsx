import { useEffect, useState } from "react"
import { Outlet, Link, NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Menu, X, ArrowRight, Mail, BookOpen, ShieldCheck, Zap } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Glossary", href: "/glossary" },
  { label: "Contact", href: "/contact" },
]

export function MarketingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        {/* top bar */}
        <div className="border-b border-border/40 bg-primary/5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-muted-foreground lg:px-12">
            <p className="hidden sm:block">Premium SEO workflow for modern teams</p>
            <p className="sm:hidden">Premium SEO workflow</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Fast
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-black tracking-tighter"
            >
              <span className="mr-1 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm text-white shadow-md">
                Hi
              </span>
              <span className="text-foreground">SEO</span>
            </Link>

            <nav className="hidden gap-6 text-sm font-medium md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-foreground transition-colors"
                      : "text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <Button asChild className="shadow-sm">
                <Link to="/app">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <Button asChild className="shadow-sm">
                  <Link to="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="rounded-md p-2 transition-colors hover:bg-muted md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border/60 bg-background px-6 py-4 md:hidden"
          >
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              {user ? (
                <Button asChild className="w-full">
                  <Link to="/app" onClick={() => setMobileOpen(false)}>
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                      Start Free Trial
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-5 lg:px-12">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-black tracking-tighter">
              <span className="mr-1 flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm text-white">
                Hi
              </span>
              SEO
            </Link>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Hi-SEO is a premium SEO workspace built to help teams manage keyword research, audits, reports, backlinks, and content planning in one place.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure auth
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Fast workflow
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="transition-colors hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link></li>
              <li><Link to="/compare" className="transition-colors hover:text-foreground">Compare</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/glossary" className="transition-colors hover:text-foreground">Glossary</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-foreground">Blog</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-foreground">Terms</Link></li>
              <li><Link to="/privacy" className="transition-colors hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-muted-foreground md:flex-row lg:px-12">
            <p>&copy; {new Date().getFullYear()} Hi-SEO. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="transition-colors hover:text-foreground">Terms of Service</Link>
              <span className="rounded bg-primary/10 px-2 py-1 font-medium text-primary">By Charles Izuma</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
