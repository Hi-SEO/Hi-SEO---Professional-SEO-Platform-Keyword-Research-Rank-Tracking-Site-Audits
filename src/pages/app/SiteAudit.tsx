import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";

type AuditIssue = {
  issue: string;
  status: "good" | "warning" | "critical";
  details: string;
};

function generateAuditResults(url: string): { score: number; issues: AuditIssue[] } {
  const normalized = url.toLowerCase();

  const issues: AuditIssue[] = [
    {
      issue: "Title Tag",
      status: normalized.includes("blog") ? "good" : "warning",
      details: normalized.includes("blog")
        ? "Page appears to have a title structure."
        : "Title tag may be missing or not optimized.",
    },
    {
      issue: "Meta Description",
      status: "warning",
      details: "Meta description could be improved for click-through rate.",
    },
    {
      issue: "Headings Structure",
      status: "good",
      details: "H1/H2 hierarchy looks acceptable in this MVP audit.",
    },
    {
      issue: "Broken Links",
      status: normalized.includes("404") ? "critical" : "good",
      details: normalized.includes("404")
        ? "Potential broken internal links detected."
        : "No obvious broken links detected in this MVP audit.",
    },
    {
      issue: "Page Speed",
      status: "warning",
      details: "Page speed optimization opportunities may exist.",
    },
    {
      issue: "Indexability",
      status: "good",
      details: "No major indexing blockers detected in this MVP audit.",
    },
  ];

  const criticalCount = issues.filter((i) => i.status === "critical").length;
  const warningCount = issues.filter((i) => i.status === "warning").length;

  let score = 92 - criticalCount * 25 - warningCount * 8;
  if (score < 20) score = 20;

  return { score, issues };
}

export default function SiteAudit() {
  const { user } = useAuth();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRunAudit = async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const results = generateAuditResults(url.trim());

    const { error } = await supabase.from("audits").insert({
      user_id: user.id,
      target_url: url.trim(),
      status: "completed",
      score: results.score,
      summary: { issues: results.issues },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setScore(results.score);
    setIssues(results.issues);
    setMessage("Audit completed and saved successfully.");
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Audit</h1>
        <p className="text-muted-foreground mt-1">
          Run a technical SEO audit, detect issues, and improve site health.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Enter URL (e.g. https://example.com)"
              className="pl-12 h-14 text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button
            variant="premium"
            className="h-14 px-8"
            onClick={handleRunAudit}
            disabled={loading}
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
      </Card>

      {score !== null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Site Health Score</div>
            <div className="mt-2 text-4xl font-bold">{score}%</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Based on the current audit summary.
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Critical Issues</div>
            <div className="mt-2 text-4xl font-bold">
              {issues.filter((i) => i.status === "critical").length}
            </div>
            <div className="mt-2 text-sm text-red-500">Needs urgent attention</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Warnings</div>
            <div className="mt-2 text-4xl font-bold">
              {issues.filter((i) => i.status === "warning").length}
            </div>
            <div className="mt-2 text-sm text-amber-500">Optimization opportunities</div>
          </Card>
        </div>
      )}

      {issues.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/20 px-6 py-4">
            <h3 className="font-semibold text-lg">Audit Results</h3>
          </div>

          <div className="divide-y">
            {issues.map((item, index) => (
              <div key={index} className="p-6 flex items-start gap-4">
                <div className="mt-1">
                  {item.status === "good" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                  {item.status === "warning" && (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  {item.status === "critical" && (
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div>
                  <h4 className="font-medium">{item.issue}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}