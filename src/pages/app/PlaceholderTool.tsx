import { Button } from "../../components/ui/button"

export default function PlaceholderTool({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{description}</p>
      </div>
      
      <div className="border border-dashed border-border/60 rounded-xl p-12 text-center bg-muted/10 space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-primary font-bold text-xl">Hi</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Tool Under Development</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This feature is currently in design-phase as part of the Hi-SEO ecosystem. 
            The full production app will feature hundreds of specific tools following this architecture.
          </p>
        </div>
        <Button variant="outline" className="mt-4">Join Waitlist for {title}</Button>
      </div>
    </div>
  )
}