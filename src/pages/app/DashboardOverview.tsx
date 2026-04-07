import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { ArrowUpRight, ArrowDownRight, Globe, Search, Activity, Zap } from "lucide-react"

const trafficData = [
  { name: "Mon", organic: 4000, paid: 2400 },
  { name: "Tue", organic: 3000, paid: 1398 },
  { name: "Wed", organic: 2000, paid: 9800 },
  { name: "Thu", organic: 2780, paid: 3908 },
  { name: "Fri", organic: 1890, paid: 4800 },
  { name: "Sat", organic: 2390, paid: 3800 },
  { name: "Sun", organic: 3490, paid: 4300 },
]

const rankingData = [
  { date: "Jan 1", pos: 45 },
  { date: "Jan 8", pos: 38 },
  { date: "Jan 15", pos: 30 },
  { date: "Jan 22", pos: 22 },
  { date: "Jan 29", pos: 12 },
  { date: "Feb 5", pos: 8 },
]

export default function DashboardOverview() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor the SEO performance of your primary domain.</p>
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
          title="Organic Traffic" 
          value="124.5K" 
          change="+14.2%" 
          trend="up" 
          icon={Globe} 
        />
        <MetricCard 
          title="Tracked Keywords" 
          value="2,845" 
          change="+128" 
          trend="up" 
          icon={Search} 
        />
        <MetricCard 
          title="Site Health" 
          value="94%" 
          change="+2%" 
          trend="up" 
          icon={Activity} 
        />
        <MetricCard 
          title="Toxic Links" 
          value="12" 
          change="-3" 
          trend="down" 
          icon={Zap} 
          inverseGood
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-2 p-6 shadow-sm border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Traffic Overview</h3>
              <p className="text-sm text-muted-foreground">Organic vs Paid search traffic</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
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
            <h3 className="font-semibold text-lg">Search Visibility</h3>
            <p className="text-sm text-muted-foreground">Average position trend</p>
          </div>
          <div className="flex-1 min-h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rankingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis reversed axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[1, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="pos" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden shadow-sm border-border/50">
          <div className="p-6 border-b bg-muted/20">
            <h3 className="font-semibold">Top Rising Keywords</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/10 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Keyword</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Pos</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Change</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Vol</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { kw: "best seo tools 2025", pos: 3, change: "+12", vol: "14.5K" },
                  { kw: "how to rank higher on google", pos: 8, change: "+5", vol: "8.2K" },
                  { kw: "b2b saas marketing strategies", pos: 1, change: "+2", vol: "3.4K" },
                  { kw: "keyword clustering guide", pos: 5, change: "+8", vol: "2.1K" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.kw}</td>
                    <td className="px-6 py-4 text-right">{row.pos}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3 h-3" /> {row.change}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{row.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden shadow-sm border-border/50">
          <div className="p-6 border-b bg-muted/20">
            <h3 className="font-semibold">Recent Site Issues</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/10 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Issue Type</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Pages</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { issue: "404 Not Found Errors", pages: 12, sev: "High", color: "text-destructive bg-destructive/10" },
                  { issue: "Missing Meta Descriptions", pages: 45, sev: "Medium", color: "text-amber-600 bg-amber-500/10" },
                  { issue: "Slow Page Load Speed", pages: 8, sev: "High", color: "text-destructive bg-destructive/10" },
                  { issue: "Orphaned Pages", pages: 23, sev: "Low", color: "text-blue-600 bg-blue-500/10" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.issue}</td>
                    <td className="px-6 py-4 text-right">{row.pages}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.color}`}>
                        {row.sev}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, trend, icon: Icon, inverseGood = false }: any) {
  const isUp = trend === "up"
  const isGood = inverseGood ? !isUp : isUp
  
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
        <span className={`flex items-center font-medium ${isGood ? "text-emerald-600" : "text-destructive"}`}>
          {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
          {change}
        </span>
        <span className="text-muted-foreground ml-2">vs last month</span>
      </div>
    </Card>
  )
}