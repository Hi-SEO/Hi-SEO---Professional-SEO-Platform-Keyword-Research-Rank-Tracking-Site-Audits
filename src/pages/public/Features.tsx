import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"

export default function Features() {
  return (
    <div className="flex flex-col min-h-screen py-24">
      <div className="container max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Complete SEO Feature Set.</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to run high-level SEO campaigns from start to finish.
        </p>
      </div>
      <div className="container max-w-5xl mx-auto mt-16 text-center">
        <div className="p-12 bg-muted/30 border rounded-xl shadow-soft space-y-6">
          <h2 className="text-2xl font-bold text-muted-foreground">Detailed Feature Breakdown</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            In the production version, this page deeply explains Keyword Research, Site Audit, Backlink Analysis, and AI Tools with beautiful UI previews.
          </p>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}