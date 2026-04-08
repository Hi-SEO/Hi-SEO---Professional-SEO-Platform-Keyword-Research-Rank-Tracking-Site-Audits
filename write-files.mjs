import { writeFileSync } from "fs";

const contentStrategy = `import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Layers, Lightbulb, FileText, Save, RotateCcw, CheckCircle2, Circle, Tag, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

function generateContentStrategy(topic) {
  const base = topic.trim().toLowerCase();
  const contentIdeas = [
    { title: "What is " + base + "?", intent: "Informational", type: "Blog Post", priority: "High", estimatedWords: 1500 },
    { title: "Best " + base + " tools in 2025", intent: "Commercial", type: "Comparison Article", priority: "High", estimatedWords: 2500 },
    { title: "How to build a " + base + " strategy", intent: "Informational", type: "Guide", priority: "High", estimatedWords: 3000 },
    { title: base + " checklist for beginners", intent: "Informational", type: "Checklist", priority: "Medium", estimatedWords: 1200 },
    { title: base + " for small businesses", intent: "Informational", type: "Tutorial", priority: "Medium", estimatedWords: 2000 },
    { title: base + " examples and case studies", intent: "Informational", type: "Examples Post", priority: "Medium", estimatedWords: 2200 },
    { title: "Best " + base + " alternatives", intent: "Commercial", type: "Comparison Article", priority: "High", estimatedWords: 2800 },
    { title: base + " mistakes to avoid", intent: "Informational", type: "Educational Post", priority: "Low", estimatedWords: 1800 },
    { title: base + " pricing guide", intent: "Transactional", type: "Pricing Page", priority: "High", estimatedWords: 1000 },
    { title: base + " vs competitors", intent: "Commercial", type: "VS Article", priority: "High", estimatedWords: 2000 },
    { title: "Free " + base + " tools", intent: "Informational", type: "Resource List", priority: "Medium", estimatedWords: 1500 },
    { title: base + " tips and tricks", intent: "Informational", type: "Tips Article", priority: "Low", estimatedWords: 1200 },
  ];
  const totalWords = contentIdeas.reduce((s, i) => s + i.estimatedWords, 0);
  const highPriority = contentIdeas.filter(i => i.priority === "High").length;
  return {
    topic: base,
    pillarTitle: "The Complete Guide to " + base + " (2025)",
    angle: "Build topical authority around " + base + " with a pillar page and " + contentIdeas.length + " supporting articles.",
    contentIdeas,
    totalWords,
    highPriority,
  };
}

export default function ContentStrategy() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("seo content strategy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filterIntent, setFilterIntent] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [completed, setCompleted] = useState(new Set());

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please enter a topic."); return; }
    setLoading(true);
    setError("");
    setMessage("");
    await new Promise(r => setTimeout(r, 800));
    setResult(generateContentStrategy(topic.trim()));
    setCompleted(new Set());
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) { setError("You must be logged in."); return; }
    if (!result) { setError("No strategy to save."); return; }
    setSaving(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      title: "Content Strategy - " + result.topic,
      report_type: "content-strategy",
      data: result,
    });
    if (error) setError(error.message);
    else setMessage("Content strategy saved successfully.");
    setSaving(false);
  };

  const toggleCompleted = (index) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const filteredIdeas = result
    ? result.contentIdeas
        .filter(i => filterIntent === "all" || i.intent === filterIntent)
        .filter(i => filterPriority === "all" || i.priority === filterPriority)
    : [];

  const intentColors = {
    Informational: "bg-blue-100 text-blue-700",
    Commercial: "bg-amber-100 text-amber-700",
    Transactional: "bg-emerald-100 text-emerald-700",
  };

  const priorityColors = {
    High: "text-red-500",
    Medium: "text-amber-500",
    Low: "text-muted-foreground",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Strategy</h1>
          <p className="text-muted-foreground mt-1">Build topic clusters, pillar pages and supporting content ideas.</p>
        </div>
        <Button onClick={handleSave} disabled={saving || !result}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Strategy"}
        </Button>
      </div>

      <Card className="p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter a topic (e.g. seo content strategy)"
            className="pl-12 h-14 text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>
        <Button variant="premium" className="h-14 px-8 w-full md:w-auto" onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 animate-spin" /> Generating...</span>
          ) : "Generate Strategy"}
        </Button>
      </Card>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {loading && (
        <Card className="p-12 flex flex-col items-center gap-4">
          <RotateCcw className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Building your content strategy...</p>
        </Card>
      )}

      {result && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Articles</p>
                  <p className="text-3xl font-bold">{result.contentIdeas.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                  <p className="text-3xl font-bold text-red-500">{result.highPriority}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Words</p>
                  <p className="text-3xl font-bold">{result.totalWords.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-emerald-500">{completed.size}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Pillar Page
            </h3>
            <p className="text-xl font-bold">{result.pillarTitle}</p>
            <p className="text-sm text-muted-foreground">{result.angle}</p>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 space-y-4">
              <h3 className="font-semibold text-lg">Content Ideas <span className="text-muted-foreground font-normal text-sm ml-2">{filteredIdeas.length} articles</span></h3>
              <div className="flex flex-wrap gap-3">
                <select className="px-3 py-2 text-sm rounded-md border border-input bg-background" value={filterIntent} onChange={(e) => setFilterIntent(e.target.value)}>
                  <option value="all">All Intents</option>
                  <option value="Informational">Informational</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Transactional">Transactional</option>
                </select>
                <select className="px-3 py-2 text-sm rounded-md border border-input bg-background" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/10 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground w-8"></th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Title</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Intent</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Priority</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Est. Words</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredIdeas.map((item, index) => (
                    <tr key={index} className={"hover:bg-muted/10 transition-colors cursor-pointer " + (completed.has(index) ? "opacity-50" : "")} onClick={() => toggleCompleted(index)}>
                      <td className="px-6 py-4">
                        {completed.has(index) ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                      </td>
                      <td className="px-6 py-4 font-medium"><span className={completed.has(index) ? "line-through" : ""}>{item.title}</span></td>
                      <td className="px-6 py-4"><span className={"text-xs px-2 py-1 rounded-full font-medium " + (intentColors[item.intent] || "")}>{item.intent}</span></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1 text-muted-foreground"><Tag className="w-3 h-3" />{item.type}</div></td>
                      <td className="px-6 py-4 text-center"><span className={"font-medium text-xs " + (priorityColors[item.priority] || "")}>{item.priority}</span></td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{item.estimatedWords.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
`;

writeFileSync("src/pages/app/ContentStrategy.tsx", contentStrategy, "utf8");
console.log("ContentStrategy.tsx written successfully");
