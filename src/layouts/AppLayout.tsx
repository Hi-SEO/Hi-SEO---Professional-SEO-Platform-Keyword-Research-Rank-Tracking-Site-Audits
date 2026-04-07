import { Outlet, Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, Search, LineChart, Link2, 
  Settings, Bell, SearchCode, BookOpen, PenTool,
  Target, Zap, Shield, User, ChevronRight, Activity
} from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Site Explorer", href: "/app/site-explorer", icon: Search },
  { name: "Keyword Explorer", href: "/app/keyword-explorer", icon: Target },
  { name: "Rank Tracker", href: "/app/rank-tracker", icon: LineChart },
  { name: "Backlink Analytics", href: "/app/backlinks", icon: Link2 },
  { name: "Site Audit", href: "/app/site-audit", icon: Activity },
  { name: "Competitor Analysis", href: "/app/competitors", icon: Shield },
  { name: "Content Strategy", href: "/app/content-strategy", icon: BookOpen },
  { name: "AI Writer", href: "/app/ai-writer", icon: PenTool },
  { name: "SERP Analysis", href: "/app/serp-analysis", icon: SearchCode },
]

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-full hidden md:flex z-10 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link to="/app" className="flex items-center space-x-2 text-xl font-bold tracking-tighter">
            <span className="bg-primary text-white rounded-md w-7 h-7 flex items-center justify-center mr-1 shadow-md text-sm">Hi</span>
            <span>SEO</span>
          </Link>
        </div>
        
        <div className="px-4 py-3 border-b border-border/50">
          <button className="w-full flex items-center justify-between bg-muted/50 hover:bg-muted p-2 rounded-md transition-colors text-sm border border-transparent hover:border-border">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-5 h-5 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-sm"></div>
              Main Workspace
            </div>
            <span className="text-muted-foreground">↓</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <div className="mb-4">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Core Tools</p>
            {navItems.slice(0, 6).map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          <div className="mb-4">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content & Strategy</p>
            {navItems.slice(6).map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border/50 mt-auto">
          <Link
            to="/app/settings"
            className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-card/80 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex-1 flex items-center gap-4">
            {/* Command Palette Trigger */}
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border/50 rounded-md transition-colors md:w-64 max-w-full">
              <Search className="w-4 h-4" />
              <span>Search projects, keywords...</span>
              <span className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border shadow-sm">⌘K</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden lg:flex gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Upgrade Plan
            </Button>
            
            <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
            </button>
            
            <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-background shadow-sm hover:opacity-90 transition-opacity">
              CI
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}