import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { ArrowRight, Search, Target, Activity, Zap, Shield, BarChart2, Globe, FileText, CheckCircle2 } from "lucide-react"

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } }
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="container relative max-w-7xl mx-auto px-6 lg:px-12 text-center z-10">
          <motion.div initial="hidden" animate="show" variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }} className="max-w-4xl mx-auto space-y-8">
            <motion.div variants={FADE_UP}>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 ring-1 ring-inset ring-primary/20">
                <Zap className="w-4 h-4 mr-1.5" />
                Introducing Hi-SEO 2.0. The new standard for search.
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight text-balance bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Dominate Search with Intelligent SEO Software.
              </h1>
            </motion.div>
            
            <motion.div variants={FADE_UP}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                An enterprise-grade, all-in-one platform for keyword research, rank tracking, 
                and AI-assisted content optimization. Built by Charles Izuma for serious growth teams.
              </p>
            </motion.div>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="premium" className="w-full sm:w-auto text-base group px-8" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
                <Link to="/compare">Compare to Ahrefs</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="mt-20 relative max-w-5xl mx-auto rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none z-10"></div>
            <div className="h-10 border-b bg-muted/30 flex items-center px-4 space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
              </div>
              <div className="mx-auto bg-background border rounded-md px-32 py-1 text-xs text-muted-foreground flex items-center shadow-sm">
                <Shield className="w-3 h-3 mr-2 text-primary" />
                app.hi-seo.com/dashboard
              </div>
            </div>
            {/* Dashboard Mock Content */}
            <div className="p-8 grid grid-cols-12 gap-6 bg-background/50 backdrop-blur-sm relative z-0">
              <div className="col-span-3 space-y-4">
                <div className="h-8 bg-muted rounded-md w-full"></div>
                <div className="h-8 bg-muted rounded-md w-3/4"></div>
                <div className="h-8 bg-muted rounded-md w-5/6"></div>
                <div className="h-8 bg-muted rounded-md w-2/3"></div>
              </div>
              <div className="col-span-9 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 bg-card border rounded-lg shadow-sm p-4 flex flex-col justify-between">
                      <div className="h-4 bg-muted w-1/2 rounded"></div>
                      <div className="h-8 bg-primary/20 w-3/4 rounded mt-auto"></div>
                    </div>
                  ))}
                </div>
                <div className="h-64 bg-card border rounded-lg shadow-sm p-4">
                  <div className="h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 dark:opacity-10"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y bg-muted/10">
        <div className="container max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">Trusted by advanced marketing teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            {/* Placeholder Logos */}
            {['Acme Corp', 'GlobalTech', 'Innovate', 'Stellar', 'NexGen'].map(name => (
              <span key={name} className="text-xl font-bold tracking-tighter text-foreground/80">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">Everything you need to rank higher.</h2>
            <p className="text-lg text-muted-foreground">Replace your fragmented tool stack with one unified, deeply integrated platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Search}
              title="Site Explorer"
              description="Analyze the organic traffic, backlink profile, and paid search data of any website or URL in seconds."
            />
            <FeatureCard 
              icon={Target}
              title="Keyword Explorer"
              description="Discover thousands of great keyword ideas, analyze their ranking difficulty and calculate traffic potential."
            />
            <FeatureCard 
              icon={Activity}
              title="Site Audit"
              description="Automatically scan your website for 100+ technical and on-page SEO issues preventing you from ranking."
            />
            <FeatureCard 
              icon={BarChart2}
              title="Rank Tracker"
              description="Monitor your rankings over time and chart your performance against competitors for targeted keywords."
            />
            <FeatureCard 
              icon={Globe}
              title="Content Explorer"
              description="Research top-performing content in your niche and find low-competition topics that drive massive traffic."
            />
            <FeatureCard 
              icon={FileText}
              title="AI Content Writer"
              description="Generate complete SEO briefs and optimized content that satisfies search intent and beats competitors."
            />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-card border-y relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">The most accurate SEO database in the industry.</h2>
              <p className="text-lg text-muted-foreground">
                We crawl billions of pages a day to provide you with the freshest backlink data and keyword metrics available anywhere.
              </p>
              
              <ul className="space-y-4">
                {[
                  "150+ Billion indexed pages",
                  "25+ Billion keywords tracked globally",
                  "4+ Trillion known backlinks",
                  "Daily updates across 170+ countries"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/features">Explore Data Quality</Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 space-y-2 border-primary/20 bg-primary/5 shadow-none">
                  <div className="text-3xl font-bold text-primary">150B+</div>
                  <div className="text-sm font-medium text-muted-foreground">Pages Crawled</div>
                </Card>
                <Card className="p-6 space-y-2 translate-y-8 shadow-soft">
                  <div className="text-3xl font-bold text-foreground">25B+</div>
                  <div className="text-sm font-medium text-muted-foreground">Keywords Database</div>
                </Card>
                <Card className="p-6 space-y-2 shadow-soft">
                  <div className="text-3xl font-bold text-foreground">4T+</div>
                  <div className="text-sm font-medium text-muted-foreground">Live Backlinks</div>
                </Card>
                <Card className="p-6 space-y-2 translate-y-8 shadow-soft">
                  <div className="text-3xl font-bold text-foreground">99.9%</div>
                  <div className="text-sm font-medium text-muted-foreground">Data Accuracy</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container max-w-4xl mx-auto px-6 lg:px-12 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to scale your organic growth?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of SEO professionals using Hi-SEO to uncover hidden opportunities and track their success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="premium" className="w-full sm:w-auto text-base px-10" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-10" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="p-6 space-y-4 bg-background group hover:border-primary/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  )
}