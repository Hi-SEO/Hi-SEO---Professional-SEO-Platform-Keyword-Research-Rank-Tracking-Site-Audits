import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Plus, Filter, Download } from "lucide-react"

const rankingData = [
  { date: "Jan 1", "hi-seo.com": 15, "competitor.com": 12 },
  { date: "Jan 8", "hi-seo.com": 14, "competitor.com": 13 },
  { date: "Jan 15", "hi-seo.com": 10, "competitor.com": 14 },
  { date: "Jan 22", "hi-seo.com": 8, "competitor.com": 15 },
  { date: "Jan 29", "hi-seo.com": 5, "competitor.com": 15 },
  { date: "Feb 5", "hi-seo.com": 3, "competitor.com": 18 },
]

export default function RankTracker() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rank Tracker</h1>
          <p className="text-muted-foreground mt-1">Monitor your rankings across 170+ countries on desktop and mobile.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Keywords</Button>
          <Button variant="premium">Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Visibility</div>
          <div className="text-3xl font-bold">14.5%</div>
          <div className="text-xs text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +2.4% vs last week</div>
        </Card>
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Est. Traffic</div>
          <div className="text-3xl font-bold">45.2K</div>
          <div className="text-xs text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +5.1K vs last week</div>
        </Card>
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Avg. Position</div>
          <div className="text-3xl font-bold">12.4</div>
          <div className="text-xs text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +1.2 vs last week</div>
        </Card>
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Positions 1-3</div>
          <div className="text-3xl font-bold">145</div>
          <div className="text-xs text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12 vs last week</div>
        </Card>
      </div>

      <Card className="p-6 border-border/50">
        <h3 className="font-semibold text-lg mb-6">Competitor Share of Voice</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rankingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis reversed axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[1, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="hi-seo.com" name="Your Domain" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="competitor.com" name="Competitor" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}