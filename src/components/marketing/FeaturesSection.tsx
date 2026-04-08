import { Card } from "../ui/card"
import {
  Activity,
  BarChart2,
  FileText,
  Globe,
  Search,
  Target,
  type LucideIcon,
} from "lucide-react"

type Feature = {
  title: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: "Site Explorer",
    description: "Analyze the organic traffic, backlink profile, and paid search data of any website or URL in seconds.",
    icon: Search,
  },
  {
    title: "Keyword Explorer",
    description: "Discover high-value keyword ideas, ranking difficulty, and traffic potential with clarity.",
    icon: Target,
  },
  {
    title: "Site Audit",
    description: "Automatically scan your website for 100+ technical and on-page SEO issues preventing growth.",
    icon: Activity,
  },
  {
    title: "Rank Tracker",
    description: "Monitor rankings over time and compare performance against competitors for targeted keywords.",
    icon: BarChart2,
  },
  {
    title: "Content Explorer",
    description: "Research top-performing content in your niche and find low-competition topics that drive traffic.",
    icon: Globe,
  },
  {
    title: "AI Content Writer",
    description: "Generate complete SEO briefs and optimized content that matches search intent and outranks competitors.",
    icon: FileText,
  },
]

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <Card className="group border-border/60 bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
    </Card>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Everything you need to rank higher.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Replace your fragmented tool stack with one unified, deeply integrated platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
