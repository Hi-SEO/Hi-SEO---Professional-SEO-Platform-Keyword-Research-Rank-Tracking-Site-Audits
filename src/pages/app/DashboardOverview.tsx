import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowUpRight,
  Globe,
  Search,
  Activity,
  Zap,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const trafficData = [
  { name: "Mon", organic: 4000, paid: 2400 },
  { name: "Tue", organic: 3000, paid: 1398 },
  { name: "Wed", organic: 2000, paid: 9800 },
  { name: "Thu", organic: 2780, paid: 3908 },
  { name: "Fri", organic: 1890, paid: 4800 },
  { name: "Sat", organic: 2390, paid: 3800 },
  { name: "Sun", organic: 3490, paid: 4300 },
];

const rankingData = [
  { date: "Jan 1", pos: 45 },
  { date: "Jan 8", pos: 38 },
  { date: "Jan 15", pos: 30 },
  { date: "Jan 22", pos: 22 },
  { date: "Jan 29", pos: 12 },
  { date: "Feb 5", pos: 8 },
];

type ProjectRow = {
  id: string;
  name: string;
  domain: string | null;
  created_at: string;
};

type AuditRow = {
  id: string;
  target_url: string | null;
  score: number | null;
  status: string | null;
  created_at: string;
};

export default function DashboardOverview() {
  const { user } = useAuth();

  const [projectCount, setProjectCount] = useState(0);
  const [keywordCount, setKeywordCount] = useState(0);
  const [trackedDomainCount, setTrackedDomainCount] = useState(0);
  const [auditCount, setAuditCount] = useState(0);

  const [recentProjects, setRecentProjects] = useState<ProjectRow[]>([]);
  const [recentAudits, setRecentAudits] = useState<AuditRow[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setLoading(true);

      const [
        projectsResult,
        keywordsResult,
        trackedDomainsResult,
        auditsResult,
        recentProjectsResult,
        recentAuditsResult,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("keywords")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("tracked_domains")
          .select("*", { count: "exact", head: "exact" as any })
          .eq("user_id", user.id),

        supabase
          .from("audits")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("projects")
          .select("id, name, domain, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),

        supabase
          .from("audits")
          .select("id, target_url, score, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setProjectCount(projectsResult.count || 0);
      setKeywordCount(keywordsResult.count || 0);
      setTrackedDomainCount((trackedDomainsResult as any).count || 0);
      setAuditCount(auditsResult.count || 0);

      if (recentProjectsResult.data) setRecentProjects(recentProjectsResult.data);
      if (recentAuditsResult.data) setRecentAudits(recentAuditsResult.data);

      setLoading(false);
    };

    loadDashboardData();
  }, [user]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your SEO workspace performance and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>
          <Button variant="premium">Generate Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Projects"
          value={loading ? "..." : String(projectCount)}
          change="+ active"
          icon={Globe}
        />
        <MetricCard
          title="Saved Keywords"
          value={loading ? "..." : String(keywordCount)}
          change="+ tracked"
          icon={Search}
        />
        <MetricCard
          title="Tracked Domains"
          value={loading ? "..." : String(trackedDomainCount)}
          change="+ connected"
          icon={Activity}
        />
        <MetricCard
          title="Audits Run"
          value={loading ? "..." : String(auditCount)}
          change="+ completed"
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-2 p-6 shadow-sm border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Traffic Overview</h3>
              <p className="text-sm text-muted-foreground">
                Demo chart for workspace visualization
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="organic" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="paid" fill="#93c5fd" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Visibility Chart */}
        <Card className="col-span-1 p-6 shadow-sm border-border/50 flex flex-col">
          <div>
            <h3 className="font-semibold text-lg">Ranking Trend Preview</h3>
            <p className="text-sm text-muted-foreground">Demo trend visualization</p>
          </div>
          <div className="flex-1 min-h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rankingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                <YAxis reversed axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} domain={[1, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pos"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden shadow-sm border-border/50">
          <div className="p-6 border-b bg-muted/20">
            <h3 className="font-semibold">Recent Projects</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/10 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Project</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Domain</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentProjects.length > 0 ? (
                  recentProjects.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.domain || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-6 text-center text-muted-foreground">
                      No projects yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden shadow-sm border-border/50">
          <div className="p-6 border-b bg-muted/20">
            <h3 className="font-semibold">Recent Audits</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/10 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Target URL</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Score</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentAudits.length > 0 ? (
                  recentAudits.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.target_url || "-"}</td>
                      <td className="px-6 py-4 text-right">{row.score ?? "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {row.status || "unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-muted-foreground">
                      No audits yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon }: any) {
  return (
    <Card className="p-6 shadow-sm border-border/50 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
      </div>
      <div className="mt-1 flex items-center text-sm">
        <span className="flex items-center font-medium text-emerald-600">
          <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
          {change}
        </span>
        <span className="text-muted-foreground ml-2">workspace data</span>
      </div>
    </Card>
  );
}