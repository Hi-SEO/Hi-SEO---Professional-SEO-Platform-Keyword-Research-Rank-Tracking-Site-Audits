import { writeFileSync } from "fs";

const content = `import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PenTool, FileText, Sparkles, Target, Save, RotateCcw, Copy, Check, Hash, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function generateBrief(topic, tone, contentType) {
  const base = topic.trim();
  const lower = base.toLowerCase();
  const titleIdeas = [
    "The Complete Guide to " + base + " (2025)",
    base + ": Best Practices and Strategies",
    "How to Master " + base + " in 30 Days",
    base + " Strategy: A Step-by-Step Framework",
    "Why " + base + " Matters and How to Get Started",
    base + ": Everything You Need to Know",
  ];
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
  ];
  const targetKeywords = [
    lower,
    lower + " strategy",
    lower + " guide",
    "best " + lower,
    "how to use " + lower,
    lower + " for beginners",
    lower + " tips",
    lower + " tools",
  ];
  const wordCount = contentType === "Long-form Guide" ? 3500 : contentType === "Blog Post" ? 2000 : contentType === "Tutorial" ? 2500 : 1500;
  return {
    topic: base,
    titleIdeas,
    metaDescription: "Learn everything about " + lower + " with practical strategies, real examples, and expert tips to help you improve results in 2025.",
    headings,
    targetKeywords,
    cta: "Start applying " + lower + " strategies today and turn your efforts into measurable growth.",
    wordCount,
    readingTime: Math.round(wordCount / 250),
    contentType,
    tone,
  };
}

export default function AIWriter() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("SEO content strategy");
  const [tone, setTone] = useState("Professional");
  const [contentType, setContentType] = useState("Long-form Guide");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedMeta, setCopiedMeta] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please enter a topic."); return; }
    setLoading(true);
    setError("");
    setMessage("");
    await new Promise(r => setTimeout(r, 900));
    setBrief(generateBrief(topic.trim(), tone, contentType));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) { setError("You must be logged in."); return; }
    if (!brief) { setError("No brief to save."); return; }
    setSaving(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      title: "AI Writer Brief - " + brief.topic,
      report_type: "ai-writer",
      data: brief,
    });
    if (error) setError(error.message);
    else setMessage("AI brief saved successfully.");
    setSaving(false);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyMeta = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Writer</h1>
          <p className="text-muted-foreground mt-1">Generate SEO-optimized content briefs, title ideas, and writing structure.</p>
        </div>
        <Button onClick={handleSave} disabled={saving || !brief}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Brief"}
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Brief Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Topic or keyword"
              className="pl-10 h-12"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>
          <select className="h-12 rounded-md border border-input bg-background px-4 font-medium" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Professional</option>
            <option>Conversational</option>
            <option>Authoritative</option>
            <option>Friendly</option>
            <option>Educational</option>
          </select>
          <select className="h-12 rounded-md border border-input bg-background px-4 font-medium" value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option>Long-form Guide</option>
            <option>Blog Post</option>
            <option>Tutorial</option>
            <option>Landing Page</option>
          </select>
        </div>
        <Button variant="premium" className="h-12 px-8" onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 animate-spin" /> Generating...</span>
          ) : (
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate Brief</span>
          )}
        </Button>
      </Card>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {loading && (
        <Card className="p-12 flex flex-col items-center gap-4">
          <Sparkles className="w-10 h-10 animate-pulse text-primary" />
          <p className="text-lg font-medium">Generating your content brief...</p>
        </Card>
      )}

      {brief && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Content Type</p>
              <p className="font-bold mt-1">{brief.contentType}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Tone</p>
              <p className="font-bold mt-1">{brief.tone}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Target Word Count</p>
              <p className="font-bold mt-1 text-2xl">{brief.wordCount.toLocaleString()}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-muted-foreground">Reading Time</p>
              <p className="font-bold mt-1 text-2xl">{brief.readingTime} min</p>
            </Card>
          </div>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Meta Description
              </h3>
              <Button variant="outline" size="sm" onClick={() => copyMeta(brief.metaDescription)}>
                {copiedMeta ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copiedMeta ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-sm bg-muted/30 p-4 rounded-lg border">{brief.metaDescription}</p>
            <p className="text-xs text-muted-foreground">{brief.metaDescription.length} / 160 characters</p>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="font-semibold">Title Ideas</h3>
              <p className="text-xs text-muted-foreground mt-1">Click copy to use any title</p>
            </div>
            <div className="divide-y">
              {brief.titleIdeas.map((title, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-4">{index + 1}</span>
                    <span className="font-medium">{title}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(title, index)}>
                    {copiedIndex === index ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="font-semibold">Article Structure</h3>
              <p className="text-xs text-muted-foreground mt-1">Suggested headings for your content</p>
            </div>
            <div className="divide-y">
              {brief.headings.map((heading, index) => (
                <div key={index} className="px-6 py-4 flex items-center gap-3 hover:bg-muted/10 transition-colors">
                  <Hash className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="flex-1">{heading}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Target Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {brief.targetKeywords.map((keyword, index) => (
                  <span key={index} className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => copyToClipboard(keyword, index + 100)}>
                    {copiedIndex === index + 100 ? "Copied!" : keyword}
                  </span>
                ))}
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Call To Action
              </h3>
              <p className="text-sm bg-amber-50 border border-amber-200 p-4 rounded-lg">{brief.cta}</p>
              <Button variant="outline" size="sm" onClick={() => copyMeta(brief.cta)}>
                <Copy className="w-4 h-4 mr-2" /> Copy CTA
              </Button>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
`;

writeFileSync("src/pages/app/AIWriter.tsx", content, "utf8");
console.log("AIWriter.tsx written successfully");
