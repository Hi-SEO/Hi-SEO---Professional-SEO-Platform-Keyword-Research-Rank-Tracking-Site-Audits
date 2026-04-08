import { writeFileSync } from "fs";

const content = `import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Layers, Video, MessageSquare, FileText, Save, RotateCcw, CheckCircle2, XCircle, Zap, BarChart3, Target, TrendingUp, Globe } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

function detectIntent(keyword) {
  const k = keyword.toLowerCase();
  if (k.includes("buy") || k.includes("price") || k.includes("pricing") || k.includes("order") || k.includes("cheap"))
    return { intent: "Transactional", color: "text-emerald-500" };
  if (k.includes("best") || k.includes("top") || k.includes("review") || k.includes("vs") || k.includes("compare"))
    return { intent: "Commercial", color: "text-amber-500" };
  if (k.includes("login") || k.includes("sign in") || k.includes("official"))
    return { intent: "Navigational", color: "text-purple-500" };
  return { intent: "Informational", color: "text-blue-500" };
}

function generateSerpData(keyword) {
  const { intent, color } = detectIntent(keyword);
  const k = keyword.toLowerCase();
  const difficulty = Math.floor(Math.random() * 45) + 30;
  const competitionLevel = Math.floor(Math.random() * 40) + 45;
  const clickOpportunity = Math.floor(Math.random() * 35) + 45;
  const searchVolume = Math.floor(Math.random() * 40000) + 2000;
  const cpc = Number((Math.random() * 8 + 0.5).toFixed(2));

  const features = [
    { name: "Featured Snippet", present: k.includes("what") || k.includes("how") || k.includes("why"), icon: "snippet", opportunity: "Write a concise 40-60 word answer to the query." },
    { name: "People Also Ask", present: true, icon: "paa", opportunity: "Add FAQ sections targeting related questions." },
    { name: "Video Results", present: k.includes("how") || k.includes("tutorial") || k.includes("guide"), icon: "video", opportunity: "Create a YouTube video targeting this keyword." },
    { name: "Ads", present: intent === "Transactional" || intent === "Commercial", icon: "ads", opportunity: "High commercial intent - consider running Google Ads." },
    { name: "Image Pack", present: k.includes("example") || k.includes("idea") || k.includes("template"), icon: "image", opportunity: "Add optimized images with descriptive alt text." },
    { name: "Sitelinks", present: intent === "Navigational", icon: "sitelinks", opportunity: "Improve site structure for sitelink eligibility." },
    { name: "Knowledge Panel", present: k.split(" ").length <= 2, icon: "knowledge", opportunity: "Add structured data to increase knowledge panel chances." },
    { name: "Local Pack", present: k.includes("near") || k.includes("local"), icon: "local", opportunity: "Optimize Google Business Profile for local searches." },
  ];

  const recommendations = [
    intent === "Informational" ? "Create comprehensive long-form content with clear headings." : "Focus on product pages with clear conversion elements.",
    features.find(f => f.name === "Featured Snippet" && f.present) ? "Target the featured snippet with a concise definition paragraph." : "Optimize for featured snippets by answering questions directly.",
    "With " + difficulty + " difficulty score, this keyword is " + (difficulty < 50 ? "achievable for newer sites." : "competitive and requires strong backlinks."),
    "CPC of $" + cpc + " suggests " + (cpc > 3 ? "high commercial value." : "moderate commercial interest."),
    "Build topical authority by creating supporting content around this keyword.",
  ];

  const radarData = [
    { metric: "Difficulty", value: difficulty },
    { metric: "Competition", value: competitionLevel },
    { metric: "Click Opp.", value: clickOpportunity },
    { metric: "Volume", value: Math.min(100, Math.round(searchVolume / 500)) },
    { metric: "CPC Value", value: Math.min(100, Math.round(cpc * 10)) },
  ];

  return { keyword, intent, intentColor: color, difficulty, competitionLevel, clickOpportunity, searchVolume, cpc, features, recommendations, radarData };
}

export default function SerpAnalysis() {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState("best seo tools");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!keyword.trim()) { setError("Please enter a keyword."); return; }
    setLoading(true);
    setError("");
    setMessage("");
    setResult(null);
    await new Promise(r => setTimeout(r, 900));
    setResult(generateSerpData(keyword.trim()));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) { setError("You must be logged in."); return; }
    if (!result) { setError("No data to save."); return; }
    setSaving(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      title: "SERP Analysis - " + result.keyword,
      report_type: "serp-analysis",
      data: result,
    });
    if (error) setError(error.message);
    else setMessage("SERP analysis saved successfully.");
    setSaving(false);
  };

  const featureIcons = { snippet: FileText, paa: MessageSquare, video: Video, ads: Zap, image: Globe, sitelinks: Layers, knowledge: BarChart3, local: Target };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SERP Analysis</h1>
          <p className="text-muted-foreground mt-1">Analyze keyword intent, SERP features, and ranking opportunities.</p>
        </div>
        <Button onClick={handleSave} disabled={saving || !result}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Analysis"}
        </Button>
      </div>

      <Card className="p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter a keyword to analyze (e.g. best seo tools)"
            className="pl-12 h-14 text-lg"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>
        <Button variant="premium" className="h-14 px-8 w-full md:w-auto" onClick={handleAnalyze} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 animate-spin" /> Analyzing...</span>
          ) : (
            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Analyze SERP</span>
          )}
        </Button>
      </Card>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {loading && (
        <Card className="p-12 flex flex-col items-center gap-4">
          <RotateCcw className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Analyzing SERP data...</p>
        </Card>
      )}

      {result && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-xs text-muted-foreground">Keyword</p>
              <p className="font-bold mt-1 truncate">{result.keyword}</p>
              <span className={"text-xs font-medium mt-1 block " + result.intentColor}>{result.intent} Intent</span>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-muted-foreground">Search Volume</p>
              <p className="text-3xl font-bold mt-1">{result.searchVolume >= 1000 ? (result.searchVolume / 1000).toFixed(1) + "K" : result.searchVolume}</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly searches</p>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-muted-foreground">Difficulty</p>
              <p className={"text-3xl font-bold mt-1 " + (result.difficulty >= 70 ? "text-red-500" : result.difficulty >= 40 ? "text-amber-500" : "text-emerald-500")}>{result.difficulty}</p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div className={"h-1.5 rounded-full " + (result.difficulty >= 70 ? "bg-red-500" : result.difficulty >= 40 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: result.difficulty + "%" }} />
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-muted-foreground">Click Opportunity</p>
              <p className="text-3xl font-bold mt-1 text-emerald-500">{result.clickOpportunity}%</p>
              <p className="text-xs text-muted-foreground mt-1">Organic click share</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> SERP Metrics Radar</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={result.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Key Metrics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-muted/20 border"><span className="text-muted-foreground">Intent</span><span className={"font-bold " + result.intentColor}>{result.intent}</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/20 border"><span className="text-muted-foreground">Competition Level</span><span className="font-bold">{result.competitionLevel}/100</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/20 border"><span className="text-muted-foreground">Avg CPC</span><span className="font-bold text-emerald-600">${result.cpc}</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/20 border"><span className="text-muted-foreground">Search Volume</span><span className="font-bold">{result.searchVolume.toLocaleString()}/mo</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/20 border"><span className="text-muted-foreground">Click Opportunity</span><span className="font-bold text-blue-500">{result.clickOpportunity}%</span></div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="font-semibold text-lg">SERP Features</h3>
              <p className="text-xs text-muted-foreground mt-1">Features present in this SERP and how to target them</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x">
              <div className="divide-y">
                {result.features.slice(0, 4).map((feature, index) => {
                  const Icon = featureIcons[feature.icon] || Layers;
                  return (
                    <div key={index} className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                      <div className={"w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 " + (feature.present ? "bg-emerald-500/10" : "bg-muted")}>
                        <Icon className={"w-4 h-4 " + (feature.present ? "text-emerald-500" : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{feature.name}</p>
                          {feature.present ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{feature.opportunity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="divide-y">
                {result.features.slice(4).map((feature, index) => {
                  const Icon = featureIcons[feature.icon] || Layers;
                  return (
                    <div key={index} className="p-5 flex items-start gap-4 hover:bg-muted/10 transition-colors">
                      <div className={"w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 " + (feature.present ? "bg-emerald-500/10" : "bg-muted")}>
                        <Icon className={"w-4 h-4 " + (feature.present ? "text-emerald-500" : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{feature.name}</p>
                          {feature.present ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{feature.opportunity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Recommendations</h3>
            <div className="space-y-3">
              {result.recommendations.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{index + 1}</div>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
`;

writeFileSync("src/pages/app/SerpAnalysis.tsx", content, "utf8");
console.log("SerpAnalysis.tsx written successfully");
