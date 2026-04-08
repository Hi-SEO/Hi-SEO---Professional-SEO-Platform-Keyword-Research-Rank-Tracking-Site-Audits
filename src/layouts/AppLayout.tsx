import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  Zap,
  LayoutDashboard,
  Search,
  BarChart3,
  Link2,
  LogOut,
  Settings as SettingsIcon,
  FolderOpen,
  CreditCard,
  FileText,
  Globe,
  ShieldCheck,
  Users,
  PenTool,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Projects", href: "/app/projects", icon: FolderOpen },
  { label: "Reports", href: "/app/reports", icon: FileText },
  { label: "Site Explorer", href: "/app/site-explorer", icon: Globe },
  { label: "Site Audit", href: "/app/site-audit", icon: ShieldCheck },
  { label: "Keyword Explorer", href: "/app/keyword-explorer", icon: Search },
  { label: "Rank Tracker", href: "/app/rank-tracker", icon: TrendingUp },
  { label: "Backlinks", href: "/app/backlinks", icon: Link2 },
  { label: "Competitors", href: "/app/competitors", icon: Users },
  { label: "Content Strategy", href: "/app/content-strategy", icon: BarChart3 },
  { label: "AI Writer", href: "/app/ai-writer", icon: PenTool },
  { label: "SERP Analysis", href: "/app/serp-analysis", icon: BarChart3 },
  { label: "Settings", href: "/app/settings", icon: SettingsIcon },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
];

function getPageTitle(pathname: string) {
  if (pathname === "/app") return "Dashboard";
  if (pathname.includes("/projects")) return "Projects";
  if (pathname.includes("/reports/")) return "Report Details";
  if (pathname.includes("/reports")) return "Reports";
  if (pathname.includes("/site-explorer")) return "Site Explorer";
  if (pathname.includes("/site-audit")) return "Site Audit";
  if (pathname.includes("/keyword-explorer")) return "Keyword Explorer";
  if (pathname.includes("/rank-tracker")) return "Rank Tracker";
  if (pathname.includes("/backlinks")) return "Backlinks";
  if (pathname.includes("/competitors")) return "Competitors";
  if (pathname.includes("/content-strategy")) return "Content Strategy";
  if (pathname.includes("/ai-writer")) return "AI Writer";
  if (pathname.includes("/serp-analysis")) return "SERP Analysis";
  if (pathname.includes("/settings")) return "Settings";
  if (pathname.includes("/billing")) return "Billing";
  return "Workspace";
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      <div className="border-b border-border p-6">
        <h1 className="text-xl font-bold">HI-SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">Advanced SEO Suite</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/app"}
              onClick={onNavClick}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg border border-border bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm font-medium">
            {profile?.full_name || user?.email}
          </p>
          {profile?.plan && (
            <span className="text-xs font-medium capitalize text-primary">
              {profile.plan} plan
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );
}

export function AppLayout() {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/30 backdrop-blur-xl md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex h-full w-72 flex-col bg-card shadow-xl">
            <button
              className="absolute right-4 top-4 rounded-md p-1 hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/30 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 transition-colors hover:bg-muted md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold">{pageTitle}</h2>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your SEO operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {profile?.plan !== "premium" && (
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-2 lg:flex"
                onClick={() => navigate("/app/billing")}
              >
                <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                Upgrade Plan
              </Button>
            )}

            <button
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="hidden items-center gap-3 rounded-full border border-border bg-background/60 px-3 py-2 md:flex">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-medium text-white">
                {(profile?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
              <div className="text-sm leading-tight">
                <p className="max-w-[140px] truncate font-medium">
                  {profile?.full_name || user?.email}
                </p>
                <p className="capitalize text-xs text-muted-foreground">
                  {profile?.plan ? profile.plan + " plan" : "Free plan"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
