import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, Zap, LayoutDashboard, Search, BarChart3, Link2, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Button } from "../components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Site Explorer", href: "/app/site-explorer", icon: Search },
  { label: "Keyword Explorer", href: "/app/keyword-explorer", icon: Search },
  { label: "Rank Tracker", href: "/app/rank-tracker", icon: BarChart3 },
  { label: "Backlinks", href: "/app/backlinks", icon: Link2 },
  { label: "Settings", href: "/app/settings", icon: SettingsIcon },
];

export function AppLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card/30 backdrop-blur-xl flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">HI-SEO</h1>
          <p className="text-sm text-muted-foreground mt-1">Advanced SEO Suite</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/app"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="rounded-lg border border-border bg-background/50 p-3 mb-3">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium truncate">
              {profile?.full_name || user?.email}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur-xl flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold">Workspace</h2>
            <p className="text-sm text-muted-foreground">Manage your SEO operations</p>
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

            <div className="hidden md:flex items-center gap-3 rounded-full border border-border px-3 py-2 bg-background/60">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                {(profile?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
              <div className="text-sm leading-tight">
                <p className="font-medium truncate max-w-[180px]">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.plan ? `${profile.plan} plan` : "Authenticated User"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile top actions */}
        <div className="md:hidden border-b border-border px-4 py-3 flex items-center justify-between bg-card/20">
          <div>
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium truncate max-w-[180px]">
              {profile?.full_name || user?.email}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}