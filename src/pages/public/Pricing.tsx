import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Check, Info } from "lucide-react"

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen py-24">
      <div className="container max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, transparent pricing.</h1>
          <p className="text-xl text-muted-foreground">
            Get the data you need to dominate your industry. Choose the plan that fits your team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Lite */}
          <Card className="p-8 space-y-6 bg-background flex flex-col border-border/50">
            <div>
              <h3 className="text-2xl font-bold">Lite</h3>
              <p className="text-muted-foreground mt-2">Essential tools for small businesses and solo SEOs.</p>
            </div>
            <div className="my-4">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/signup">Start Lite</Link>
            </Button>
            <div className="space-y-4 pt-4 flex-1">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 1 User seat</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 5 Projects</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 750 Tracked keywords</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 100K Crawl credits per month</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 5 AI Writer credits</li>
              </ul>
            </div>
          </Card>

          {/* Pro */}
          <Card className="p-8 space-y-6 bg-background flex flex-col border-primary ring-1 ring-primary relative shadow-premium">
            <div className="absolute top-0 right-6 translate-y-[-50%] bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              MOST POPULAR
            </div>
            <div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-muted-foreground mt-2">For growing agencies and in-house marketing teams.</p>
            </div>
            <div className="my-4">
              <span className="text-4xl font-bold">$199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button className="w-full" variant="premium" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <div className="space-y-4 pt-4 flex-1">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 3 User seats</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 20 Projects</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 2,000 Tracked keywords</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 500K Crawl credits per month</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 25 AI Writer credits</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> API Access</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> Looker Studio Integration</li>
              </ul>
            </div>
          </Card>

          {/* Advanced */}
          <Card className="p-8 space-y-6 bg-background flex flex-col border-border/50">
            <div>
              <h3 className="text-2xl font-bold">Advanced</h3>
              <p className="text-muted-foreground mt-2">For large agencies and enterprise SEO operations.</p>
            </div>
            <div className="my-4">
              <span className="text-4xl font-bold">$399</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/signup">Start Advanced</Link>
            </Button>
            <div className="space-y-4 pt-4 flex-1">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 5 User seats</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 50 Projects</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 5,000 Tracked keywords</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 1.5M Crawl credits per month</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> 100 AI Writer credits</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> Priority Support</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}