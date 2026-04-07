import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Search, Globe, ChevronDown, Filter, Download } from "lucide-react"

export default function SiteExplorer() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Explorer</h1>
        <p className="text-muted-foreground mt-1">Get an in-depth look at the organic search traffic and backlink profile of any website.</p>
      </div>

      {/* Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center bg-card border-primary/20 shadow-soft">
        <div className="flex-1 w-full relative flex items-center">
          <Globe className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Enter domain, subdomain or exact URL (e.g. yourcompetitor.com)" 
            className="pl-12 h-14 text-lg bg-background border-border/50 w-full"
            defaultValue="vercel.com"
          />
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <select className="h-14 rounded-md border border-input bg-background px-4 py-2 font-medium w-full md:w-48">
            <option>*.domain.com/*</option>
            <option>domain.com/*</option>
            <option>Exact URL</option>
          </select>
          <Button variant="premium" className="h-14 px-8 w-full md:w-auto text-base">
            <Search className="w-5 h-5 mr-2" /> Analyze
          </Button>
        </div>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 border-b pb-8">
        <Metric title="Domain Rating" value="89" subtitle="Excellent" />
        <Metric title="Backlinks" value="2.4M" subtitle="+12K this month" />
        <Metric title="Ref. Domains" value="145K" subtitle="+1.2K this month" />
        <Metric title="Organic Traffic" value="1.8M" subtitle="Value: $4.2M" />
        <Metric title="Organic Keywords" value="450K" subtitle="Top 3: 12.5K" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Top Organic Pages</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">URL</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Traffic</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Value</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Keywords</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Ref. Domains</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-background">
              {[
                { url: "/docs", t: "450K", v: "$1.2M", k: "45K", d: "12.4K" },
                { url: "/", t: "380K", v: "$950K", k: "12K", d: "45.2K" },
                { url: "/templates", t: "210K", v: "$650K", k: "34K", d: "8.5K" },
                { url: "/blog/nextjs-14", t: "125K", v: "$320K", k: "8K", d: "2.1K" },
                { url: "/pricing", t: "85K", v: "$850K", k: "2K", d: "4.8K" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-6 py-4">
                    <a href="#" className="font-medium text-primary hover:underline block truncate max-w-[300px]">
                      {row.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{row.t}</td>
                  <td className="px-6 py-4 text-right">{row.v}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{row.k}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}

function Metric({ title, value, subtitle }: any) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}