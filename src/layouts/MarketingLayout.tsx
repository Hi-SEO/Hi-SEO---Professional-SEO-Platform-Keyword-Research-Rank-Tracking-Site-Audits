import { Outlet, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { LayoutDashboard } from "lucide-react"

export function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-2xl tracking-tighter">
              <span className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-1 shadow-md">Hi</span>
              <span className="text-foreground">SEO</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground ml-6">
              <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
              <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link>
              <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">Sign In</Link>
            <Button asChild variant="premium">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      <footer className="border-t py-12 md:py-16 bg-muted/20">
        <div className="container grid grid-cols-2 md:grid-cols-5 gap-8 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tighter">
              <span className="bg-primary text-white rounded-md w-6 h-6 flex items-center justify-center text-sm mr-1">Hi</span>
              SEO
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The complete SEO platform for modern growth teams. Dominate search with data-driven insights and AI.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/changelog" className="hover:text-foreground">Changelog</Link></li>
              <li><Link to="/integrations" className="hover:text-foreground">Integrations</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
              <li><Link to="/glossary" className="hover:text-foreground">SEO Glossary</Link></li>
              <li><Link to="/academy" className="hover:text-foreground">Academy</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="container mt-12 pt-8 border-t px-6 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Hi-SEO. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">By Charles Izuma</span>
          </div>
        </div>
      </footer>
    </div>
  )
}