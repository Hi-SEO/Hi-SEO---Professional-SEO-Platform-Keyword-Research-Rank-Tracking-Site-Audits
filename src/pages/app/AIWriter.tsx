import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  PenTool,
  FileText,
  Sparkles,
  Target,
  Save,
  RotateCcw,
  Copy,
  Check,
  Hash,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../context/AuthContext"

type Tone = "Professional" | "Conversational" | "Authoritative" | "Friendly" | "Educational"
type ContentType = "Long-form Guide" | "Blog Post" | "Tutorial" | "Landing Page"

type AIBrief = {
  topic: string
  titleIdeas: string[]
  metaDescription: string
  headings: string[]
  targetKeywords: string[]
  cta: string
  wordCount: number
  readingTime: number
  contentType: ContentType
  tone: Tone
}

function generateBrief(topic: string, tone: Tone, contentType: ContentType): AIBrief {
  const base = topic.trim()
  const lower = base.toLowerCase()

  const titleIdeas = [
    "The Complete Guide to " + base + " (2025)",
    base + ": Best Practices and Strategies",
    "How to Master " + base + " in 30 Days",
    base + " Strategy: A Step-by-Step Framework",
    "Why " + base + " Matters and How to Get Started",
    base + ": Everything You Need to Know",
  ]

  const headings = [
    "What is " + base + "?",
    "Why " + base + " matters for your business",
    "How to get started with " + base,
    "Best practices for " + base,
    base + " tools and resources",
    "Common " + base + " mistakes to avoid",
    "How to measure " + base + " success",
    base + " case studies and examples",
    "Future of " + base,
    "Final thoughts on " + base,
  ]

  const targetKeywords = [
    lower,
    lower + " strategy",
    lower + " guide",
    "best " + lower,
    "how to use " + lower,
    lower + " for beginners",
    lower + " tips",
    lower + " tools",
  ]

  const wordCount =
    contentType === "Long-form Guide"
      ? 3500
      : contentType === "Blog Post"
        ? 2000
        : contentType === "Tutorial"
          ? 2500
          : 1500

  return {
    topic: base,
    titleIdeas,
    metaDescription:
      "Learn everything about " +
      lower +
      " with practical strategies, real examples, and expert tips to help you improve results in 2025.",
    headings,
    targetKeywords,
    cta: "Start applying " + lower + " strategies today and turn your efforts into measurable growth.",
    wordCount,
    readingTime: Math.round(wordCount / 250),
    contentType,
    tone,
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Something went wrong. Please try again."
}

export default function AIWriter() {
  const { user } = useAuth()

  const [topic, setTopic] = useState("SEO content strategy")
  const [tone, setTone] = useState<Tone>("Professional")
  const [contentType, setContentType] = useState<ContentType>("Long-form Guide")
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<AIBrief | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedMeta, setCopiedMeta] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")
    setBrief(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setBrief(generateBrief(topic.trim(), tone, contentType))
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in.")
      return
    }

    if (!brief) {
      setError("No brief to save.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        title: "AI Writer Brief - " + brief.topic,
        report_type: "ai-writer",
        data: brief,
      })

      if (error) throw error

      setMessage("AI brief saved successfully.")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      setError("Failed to copy to clipboard.")
    }
  }

  const copyMeta = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMeta(true)
      setTimeout(() => setCopiedMeta(false), 2000)
    } catch {
      setError("Failed to copy to clipboard.")
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Writer</h1>
          <p className="mt-1 text-muted-foreground">
            Generate SEO-optimized content briefs, title ideas, and writing structure.
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving || !brief}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Brief"}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">AI Writer error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="space-y-4 p-6">
        <h3 className="font-semibold">Brief Settings</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <PenTool className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Topic or keyword"
              className="h-12 pl-10"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          <select
            className="h-12 rounded-md border border-input bg-background px-4 font-medium"
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
          >
            <option>Professional</option>
            <option>Conversational</option>
            <option>Authoritative</option>
            <option>Friendly</option>
            <option>Educational</option>
          </select>

          <select
            className="h-12 rounded-md border border-input bg-background px-4 font-medium"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
          >
            <option>Long-form Guide</option>
            <option>Blog Post</option>
            <option>Tutorial</option>
            <option>Landing Page</option>
          </select>
        </div>

        <Button
          variant="premium"
          className="h-12 px-8"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Brief
            </span>
          )}
        </Button>
      </Card>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      {loading && (
        <Card className="flex flex-col items-center gap-4 p-12">
          <Sparkles className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-lg font-medium">Generating your content brief...</p>
        </Card>
      )}

      {brief && !loading && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Content Type</p>
              <p className="mt-1 font-bold">{brief.contentType}</p>
            </Card>

            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Tone</p>
              <p className="mt-1 font-bold">{brief.tone}</p>
            </Card>

            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Target Word Count</p>
              <p className="mt-1 text-2xl font-bold">{brief.wordCount.toLocaleString()}</p>
            </Card>

            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Reading Time</p>
              <p className="mt-1 text-2xl font-bold">{brief.readingTime} min</p>
            </Card>
          </div>

          <Card className="space-y-3 p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" /> Meta Description
              </h3>
              <Button variant="outline" size="sm" onClick={() => copyMeta(brief.metaDescription)}>
                {copiedMeta ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copiedMeta ? "Copied!" : "Copy"}
              </Button>
            </div>

            <p className="rounded-lg border bg-muted/30 p-4 text-sm">{brief.metaDescription}</p>
            <p className="text-xs text-muted-foreground">
              {brief.metaDescription.length} / 160 characters
            </p>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="font-semibold">Title Ideas</h3>
              <p className="mt-1 text-xs text-muted-foreground">Click copy to use any title</p>
            </div>

            <div className="divide-y">
              {brief.titleIdeas.map((title, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 font-mono text-xs text-muted-foreground">{index + 1}</span>
                    <span className="font-medium">{title}</span>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(title, index)}>
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="font-semibold">Article Structure</h3>
              <p className="mt-1 text-xs text-muted-foreground">Suggested headings for your content</p>
            </div>

            <div className="divide-y">
              {brief.headings.map((heading, index) => (
                <div key={index} className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/10">
                  <Hash className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="flex-1">{heading}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 text-primary" /> Target Keywords
              </h3>

              <div className="flex flex-wrap gap-2">
                {brief.targetKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="cursor-pointer rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    onClick={() => copyToClipboard(keyword, index + 100)}
                  >
                    {copiedIndex === index + 100 ? "Copied!" : keyword}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-amber-500" /> Call To Action
              </h3>
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">{brief.cta}</p>
              <Button variant="outline" size="sm" onClick={() => copyMeta(brief.cta)}>
                <Copy className="mr-2 h-4 w-4" /> Copy CTA
              </Button>
            </Card>
          </div>
        </>
      )}

      {!brief && !loading && (
        <Card className="p-12 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No brief generated yet</h3>
          <p className="mt-2 text-muted-foreground">
            Enter a topic and click "Generate Brief" to create your SEO outline.
          </p>
        </Card>
      )}
    </div>
  )
}
