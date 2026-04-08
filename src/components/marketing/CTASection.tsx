import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export function CTASection() {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-4xl px-6 lg:px-12 text-center">
        <h2 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Ready to scale your organic growth?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
          Join thousands of SEO professionals using Hi-SEO to uncover hidden opportunities and track their success.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="premium" className="w-full px-10 text-base sm:w-auto" asChild>
            <Link to="/signup">Start Free Trial</Link>
          </Button>

          <Button size="lg" variant="outline" className="w-full px-10 text-base sm:w-auto" asChild>
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
