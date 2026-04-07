import { useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PenTool, FileText, Sparkles, Target } from "lucide-react";

function generateBrief(topic: string) {
  const base = topic.trim();

  return {
    titleIdeas: [
      `Complete Guide to ${base}`,
      `${base}: Best Practices for 2025`,
      `How to Use ${base} to Grow Faster`,
      `${base} Strategy: Step-by-Step Framework`,
    ],
    metaDescription: `Learn how to use ${base} effectively with practical strategies, examples, and SEO best practices to improve results.`,
    headings: [
      `What is ${base}?`,
      `Why ${base} matters`,
      `How to get started with ${base}`,
      `Best practices for ${base}`,
      `Common mistakes to avoid`,
      `Tools and resources for ${base}`,
      `Final thoughts on ${base}`,
    ],
    targetKeywords: [
      base.toLowerCase(),
      `${base.toLowerCase()} strategy`,
      `${base.toLowerCase()} guide`,
      `best ${base.toLowerCase()}`,
      `how to use ${base.toLowerCase()}`,
    ],
    cta: `Start applying ${base} today and turn your strategy into measurable growth.`,
  };
}

export default function AIWriter() {
  const [topic, setTopic] = useState("SEO content brief");
  const [submittedTopic, setSubmittedTopic] = useState("SEO content brief");

  const brief = useMemo(() => generateBrief(submittedTopic), [submittedTopic]);

  const handleGenerate = () => {
    if (topic.trim()) {
      setSubmittedTopic(topic.trim());
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Writer</h1>
        <p className="text-muted-foreground mt-1">
          Generate content briefs, title ideas, headings, and SEO writing structure.
        </p>
      </div>

      <Card className="p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <Input
            placeholder="Enter a topic or keyword"
            className="h-14 text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <Button variant="premium" className="h-14 px-8 w-full md:w-auto" onClick={handleGenerate}>
          Generate Brief
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Primary Topic</div>
          <div className="mt-2 text-xl font-bold">{submittedTopic}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Target className="w-3 h-3 mr-1" /> Target writing topic
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">SEO Meta Description</div>
          <div className="mt-2 text-sm font-medium">{brief.metaDescription}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <FileText className="w-3 h-3 mr-1" /> Search snippet draft
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Call To Action</div>
          <div className="mt-2 text-sm font-medium">{brief.cta}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Sparkles className="w-3 h-3 mr-1" /> Closing conversion prompt
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Title Ideas</h3>
        </div>
        <div className="divide-y">
          {brief.titleIdeas.map((title, index) => (
            <div key={index} className="px-6 py-4 font-medium hover:bg-muted/10">
              {title}
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Suggested Headings</h3>
        </div>
        <div className="divide-y">
          {brief.headings.map((heading, index) => (
            <div key={index} className="px-6 py-4 flex items-center gap-3 hover:bg-muted/10">
              <PenTool className="w-4 h-4 text-primary" />
              <span>{heading}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Target Keywords</h3>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          {brief.targetKeywords.map((keyword, index) => (
            <span
              key={index}
              className="rounded-full border px-4 py-2 text-sm font-medium bg-background"
            >
              {keyword}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}