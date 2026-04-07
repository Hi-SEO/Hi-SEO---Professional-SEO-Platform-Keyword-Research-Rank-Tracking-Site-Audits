import { useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Layers, Video, MessageSquare, FileText } from "lucide-react";

type SerpFeature = {
  name: string;
  present: boolean;
};

function detectIntent(keyword: string) {
  const k = keyword.toLowerCase();

  if (
    k.includes("buy") ||
    k.includes("pricing") ||
    k.includes("price") ||
    k.includes("service")
  ) {
    return "Transactional";
  }

  if (
    k.includes("best") ||
    k.includes("top") ||
    k.includes("review") ||
    k.includes("vs")
  ) {
    return "Commercial";
  }

  return "Informational";
}

function generateSerpData(keyword: string) {
  const intent = detectIntent(keyword);

  const features: SerpFeature[] = [
    { name: "Featured Snippet", present: true },
    { name: "People Also Ask", present: true },
    { name: "Video Results", present: keyword.toLowerCase().includes("how") || keyword.toLowerCase().includes("guide") },
    { name: "Ads", present: intent === "Transactional" || intent === "Commercial" },
    { name: "Image Pack", present: keyword.toLowerCase().includes("examples") || keyword.toLowerCase().includes("ideas") },
    { name: "Sitelinks", present: true },
  ];

  return {
    intent,
    difficulty: Math.floor(Math.random() * 50) + 35,
    competitionLevel: Math.floor(Math.random() * 40) + 50,
    clickOpportunity: Math.floor(Math.random() * 30) + 50,
    features,
    recommendations: [
      "Target a featured snippet with concise question-based answers.",
      "Add FAQ sections to improve People Also Ask visibility.",
      "Use comparison or list-style content if the SERP shows commercial intent.",
      "Optimize headings and schema markup to increase rich result eligibility.",
    ],
  };
}

export default function SerpAnalysis() {
  const [keyword, setKeyword] = useState("best seo tools");
  const [submittedKeyword, setSubmittedKeyword] = useState("best seo tools");

  const serpData = useMemo(() => generateSerpData(submittedKeyword), [submittedKeyword]);

  const handleAnalyze = () => {
    if (keyword.trim()) {
      setSubmittedKeyword(keyword.trim());
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SERP Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Analyze keyword intent, SERP features, and ranking opportunities.
        </p>
      </div>

      <Card className="p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter a keyword"
            className="pl-12 h-14 text-lg"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button variant="premium" className="h-14 px-8 w-full md:w-auto" onClick={handleAnalyze}>
          Analyze SERP
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Keyword</div>
          <div className="mt-2 text-xl font-bold">{submittedKeyword}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Intent</div>
          <div className="mt-2 text-xl font-bold">{serpData.intent}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Estimated Difficulty</div>
          <div className="mt-2 text-3xl font-bold">{serpData.difficulty}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Click Opportunity</div>
          <div className="mt-2 text-3xl font-bold">{serpData.clickOpportunity}%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">SERP Features</h3>
          <div className="space-y-4">
            {serpData.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  {feature.name === "Featured Snippet" && <FileText className="w-4 h-4 text-primary" />}
                  {feature.name === "People Also Ask" && <MessageSquare className="w-4 h-4 text-primary" />}
                  {feature.name === "Video Results" && <Video className="w-4 h-4 text-primary" />}
                  {!["Featured Snippet", "People Also Ask", "Video Results"].includes(feature.name) && (
                    <Layers className="w-4 h-4 text-primary" />
                  )}
                  <span className="font-medium">{feature.name}</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    feature.present ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  {feature.present ? "Present" : "Not Present"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recommendations</h3>
          <div className="space-y-4">
            {serpData.recommendations.map((item, index) => (
              <div key={index} className="rounded-lg border p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}