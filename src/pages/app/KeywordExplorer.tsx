import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Search, Target, Filter, Plus, Zap } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type KeywordRow = {
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  intentCode: "I" | "C" | "T" | "N";
  kd: number;
  volume: number;
  cpc: number;
  trend: "Rising" | "Stable" | "Seasonal";
};

type Project = {
  id: string;
  name: string;
  domain: string | null;
};

function detectIntent(keyword: string): KeywordRow["intent"] {
  const k = keyword.toLowerCase();

  if (
    k.includes("buy") ||
    k.includes("pricing") ||
    k.includes("price") ||
    k.includes("service") ||
    k.includes("hire") ||
    k.includes("tool")
  ) {
    return "Transactional";
  }

  if (
    k.includes("best") ||
    k.includes("top") ||
    k.includes("review") ||
    k.includes("compare") ||
    k.includes("alternative") ||
    k.includes("vs")
  ) {
    return "Commercial";
  }

  if (
    k.includes("login") ||
    k.includes("dashboard") ||
    k.includes("homepage") ||
    k.includes("official")
  ) {
    return "Navigational";
  }

  return "Informational";
}

function getIntentCode(intent: KeywordRow["intent"]): KeywordRow["intentCode"] {
  if (intent === "Informational") return "I";
  if (intent === "Commercial") return "C";
  if (intent === "Transactional") return "T";
  return "N";
}

function estimateKD(keyword: string) {
  const words = keyword.trim().split(/\s+/).length;
  if (words <= 2) return Math.floor(Math.random() * 30) + 60;
  if (words === 3) return Math.floor(Math.random() * 25) + 35;
  return Math.floor(Math.random() * 25) + 10;
}

function estimateVolume(keyword: string) {
  const words = keyword.trim().split(/\s+/).length;
  if (words <= 2) return Math.floor(Math.random() * 40000) + 5000;
  if (words === 3) return Math.floor(Math.random() * 15000) + 1000;
  return Math.floor(Math.random() * 5000) + 100;
}

function estimateCPC(intent: KeywordRow["intent"]) {
  if (intent === "Transactional") return Number((Math.random() * 20 + 5).toFixed(2));
  if (intent === "Commercial") return Number((Math.random() * 10 + 2).toFixed(2));
  if (intent === "Navigational") return Number((Math.random() * 3 + 0.5).toFixed(2));
  return Number((Math.random() * 4 + 0.2).toFixed(2));
}

function estimateTrend(keyword: string): KeywordRow["trend"] {
  const k = keyword.toLowerCase();
  if (k.includes("2025") || k.includes("new") || k.includes("latest")) return "Rising";
  if (k.includes("christmas") || k.includes("black friday") || k.includes("seasonal")) return "Seasonal";
  return "Stable";
}

function generateKeywordIdeas(seed: string): KeywordRow[] {
  const base = seed.trim().toLowerCase();
  if (!base) return [];

  const variants = [
    `${base}`,
    `best ${base}`,
    `${base} tool`,
    `${base} tools`,
    `${base} pricing`,
    `${base} for small business`,
    `${base} for agencies`,
    `free ${base}`,
    `how to use ${base}`,
    `what is ${base}`,
    `${base} vs semrush`,
    `${base} vs ahrefs`,
    `${base} alternatives`,
    `${base} strategy`,
    `${base} checklist`,
    `${base} template`,
    `${base} guide`,
    `${base} software`,
    `${base} service`,
    `${base} dashboard`,
  ];

  const unique = Array.from(new Set(variants));

  return unique.map((keyword) => {
    const intent = detectIntent(keyword);
    return {
      keyword,
      intent,
      intentCode: getIntentCode(intent),
      kd: estimateKD(keyword),
      volume: estimateVolume(keyword),
      cpc: estimateCPC(intent),
      trend: estimateTrend(keyword),
    };
  });
}

function formatVolume(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}

export default function KeywordExplorer() {
  const { user } = useAuth();

  const [query, setQuery] = useState("seo tools");
  const [submittedQuery, setSubmittedQuery] = useState("seo tools");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDomain, setNewProjectDomain] = useState("");

  const [saving, setSaving] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const results = useMemo(() => generateKeywordIdeas(submittedQuery), [submittedQuery]);

  const loadProjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, domain")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleExplore = () => {
    setSubmittedQuery(query.trim());
    setSaveMessage("");
    setSaveError("");
  };

  const handleCreateProject = async () => {
    if (!user) {
      setSaveError("You must be logged in to create a project.");
      return;
    }

    if (!newProjectName.trim()) {
      setSaveError("Project name is required.");
      return;
    }

    setCreatingProject(true);
    setSaveMessage("");
    setSaveError("");

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: newProjectName.trim(),
        domain: newProjectDomain.trim() || null,
      })
      .select("id, name, domain")
      .single();

    if (error) {
      setSaveError(error.message);
      setCreatingProject(false);
      return;
    }

    if (data) {
      setProjects((prev) => [data, ...prev]);
      setSelectedProjectId(data.id);
      setNewProjectName("");
      setNewProjectDomain("");
      setSaveMessage("Project created successfully.");
    }

    setCreatingProject(false);
  };

  const handleSaveKeywords = async () => {
    if (!user) {
      setSaveError("You must be logged in to save keywords.");
      return;
    }

    if (!selectedProjectId) {
      setSaveError("Please create or select a project first.");
      return;
    }

    if (results.length === 0) {
      setSaveError("No keywords to save.");
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    const payload = results.map((row) => ({
      user_id: user.id,
      project_id: selectedProjectId,
      keyword: row.keyword,
      intent: row.intent,
      difficulty: String(row.kd),
      volume: row.volume,
      cpc: row.cpc,
      trend: row.trend,
    }));

    const { error } = await supabase.from("keywords").insert(payload);

    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }

    setSaveMessage("Keywords saved successfully to selected project.");
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Keyword Explorer</h1>
        <p className="text-muted-foreground mt-1">
          Discover keyword ideas, estimate difficulty, and find content opportunities.
        </p>
      </div>

      <Card className="p-4 space-y-4 bg-card shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <Input
            placeholder="Project domain (optional)"
            value={newProjectDomain}
            onChange={(e) => setNewProjectDomain(e.target.value)}
          />
          <Button onClick={handleCreateProject} disabled={creatingProject}>
            {creatingProject ? "Creating..." : "Create Project"}
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Project</label>
          <select
            className="h-12 rounded-md border border-input bg-background px-4 py-2 font-medium w-full"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} {project.domain ? `(${project.domain})` : ""}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center bg-card shadow-soft">
        <div className="flex-1 w-full relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter a seed keyword"
            className="pl-12 h-14 text-lg w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <select className="h-14 rounded-md border border-input bg-background px-4 py-2 font-medium w-full md:w-48">
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Global</option>
          </select>
          <Button variant="premium" className="h-14 px-8 w-full md:w-auto text-base" onClick={handleExplore}>
            <Search className="w-5 h-5 mr-2" /> Explore
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20">
          <Target className="w-4 h-4 mr-2" /> Free MVP
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20">
          Intent Detection
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20">
          Estimated KD
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-muted/20 border-dashed border-primary/50 text-primary">
          <Filter className="w-4 h-4 mr-2" /> More Filters Later
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold">
            Matching Terms
            <span className="text-muted-foreground font-normal text-sm ml-2">
              {results.length} keywords
            </span>
          </h3>
          <Button variant="outline" size="sm" onClick={handleSaveKeywords} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Keywords"}
          </Button>
        </div>

        {(saveError || saveMessage) && (
          <div className="px-6 py-3 border-b">
            {saveError && <p className="text-sm text-red-500">{saveError}</p>}
            {saveMessage && <p className="text-sm text-green-600">{saveMessage}</p>}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Keyword</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Intent</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">KD</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Volume</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">CPC</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Trend</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results.map((row, i) => {
                const intentColor =
                  row.intent === "Informational"
                    ? "bg-blue-500"
                    : row.intent === "Commercial"
                    ? "bg-amber-500"
                    : row.intent === "Transactional"
                    ? "bg-emerald-500"
                    : "bg-purple-500";

                const kdColor =
                  row.kd >= 70
                    ? "bg-red-500"
                    : row.kd >= 40
                    ? "bg-orange-500"
                    : "bg-emerald-500";

                return (
                  <tr key={i} className="hover:bg-muted/10 group">
                    <td className="px-6 py-4 font-medium">{row.keyword}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" title={row.intent}>
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${intentColor}`}
                        >
                          {row.intentCode}
                        </span>
                        <span className="text-muted-foreground">{row.intent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium">{row.kd}</span>
                        <div className={`w-2 h-2 rounded-full ${kdColor}`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatVolume(row.volume)}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">${row.cpc.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">{row.trend}</td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}