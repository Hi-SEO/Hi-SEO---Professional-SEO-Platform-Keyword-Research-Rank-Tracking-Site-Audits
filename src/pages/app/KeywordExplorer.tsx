import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Search, Target, Filter, Plus, Zap } from "lucide-react"

export default function KeywordExplorer() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Keyword Explorer</h1>
        <p className="text-muted-foreground mt-1">Discover thousands of great keyword ideas, analyze difficulty and calculate traffic potential.</p>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center bg-card shadow-soft">
        <div className="flex-1 w-full relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Enter one or multiple seed keywords separated by commas" 
            className="pl-12 h-14 text-lg w-full"
            defaultValue="seo tools, keyword research, rank tracking"
          />
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <select className="h-14 rounded-md border border-input bg-background px-4 py-2 font-medium w-full md:w-48">
            <option>🇺🇸 United States</option>
            <option>🇬🇧 United Kingdom</option>
            <option>🇨🇦 Canada</option>
            <option>🇦🇺 Australia</option>
            <option>🌍 Global</option>
          </select>
          <Button variant="premium" className="h-14 px-8 w-full md:w-auto text-base">
            <Search className="w-5 h-5 mr-2" /> Explore
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20">
          <Target className="w-4 h-4 mr-2" /> KD: 0-30
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20">
          Volume: 1000+
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20">
          Word count: 3+
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20 border-dashed border-primary/50 text-primary">
          <Filter className="w-4 h-4 mr-2" /> More Filters
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold">Matching Terms <span className="text-muted-foreground font-normal text-sm ml-2">24,530 keywords</span></h3>
          <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add to List</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Keyword</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Intent</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">KD</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Volume</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">GV</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">CPC</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">SERP</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { kw: "best seo tools", i: "C", intText: "Commercial", kd: 85, vol: "45K", gv: "110K", cpc: "$12.50", kdColor: "bg-red-500", intentColor: "bg-amber-500" },
                { kw: "free keyword research tool", i: "I", intText: "Informational", kd: 62, vol: "22K", gv: "85K", cpc: "$4.20", kdColor: "bg-orange-500", intentColor: "bg-blue-500" },
                { kw: "how to do keyword research", i: "I", intText: "Informational", kd: 45, vol: "14K", gv: "42K", cpc: "$3.80", kdColor: "bg-amber-500", intentColor: "bg-blue-500" },
                { kw: "hi-seo pricing", i: "N", intText: "Navigational", kd: 12, vol: "8.5K", gv: "12K", cpc: "$1.50", kdColor: "bg-emerald-500", intentColor: "bg-purple-500" },
                { kw: "buy rank tracker software", i: "T", intText: "Transactional", kd: 58, vol: "3.2K", gv: "8.5K", cpc: "$24.00", kdColor: "bg-orange-500", intentColor: "bg-emerald-500" },
                { kw: "what is search intent", i: "I", intText: "Informational", kd: 32, vol: "12K", gv: "35K", cpc: "$2.10", kdColor: "bg-emerald-500", intentColor: "bg-blue-500" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/10 group cursor-pointer">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground group-hover:text-primary transition-colors">
                    {row.kw}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" title={row.intText}>
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${row.intentColor}`}>
                        {row.i}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-medium">{row.kd}</span>
                      <div className={`w-2 h-2 rounded-full ${row.kdColor}`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{row.vol}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{row.gv}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{row.cpc}</td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}