import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

export default function BacklinkAnalytics() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backlink Analytics</h1>
        <p className="text-muted-foreground mt-1">Analyze the backlink profile of any domain with the fastest link crawler on the market.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 space-y-4 border-border/50 bg-muted/10 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-4">
            Hi
          </div>
          <h2 className="text-2xl font-bold">Backlink Dashboard</h2>
          <p className="text-muted-foreground max-w-sm">
            Monitor referring domains, new & lost backlinks, and anchor text distribution.
          </p>
          <Button variant="outline" className="mt-4">Import Disavow File</Button>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6 border-border/50">
            <h3 className="font-semibold mb-4">Link Growth (Last 6 Months)</h3>
            <div className="h-40 flex items-end gap-2 w-full">
              {[40, 45, 60, 80, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 border-border/50">
            <h3 className="font-semibold mb-4">Top Anchor Texts</h3>
            <div className="space-y-4">
              {[
                { term: "hi-seo", p: 45 },
                { term: "best seo platform", p: 25 },
                { term: "rank tracking software", p: 15 },
                { term: "https://hi-seo.com", p: 10 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 truncate text-sm font-medium">{item.term}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${item.p}%` }}></div>
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">{item.p}%</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}