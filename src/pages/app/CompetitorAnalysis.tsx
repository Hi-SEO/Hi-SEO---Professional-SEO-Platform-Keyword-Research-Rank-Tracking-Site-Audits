import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Search, Users, BarChart3, Target, Save, RotateCcw,
  TrendingUp, TrendingDown, Globe, Link2, FileText
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

type CompetitorRow = {
  domain: string;
  visibility: number;
  sharedKeywords: number;
  authority: number;
  contentGap: number;
  backlinks: number;
  trafficShare: number;
};

function generateCompetitorData(yourDomain: string, competitors: string[]): CompetitorRow[] {
  return competitors.filter(c => c.trim()).map((domain) => {
    const authority = Math.floor(Math.random() * 55) + 25;
    const visibility = Math.floor(Math.random() * 65) + 15;
    return {
      domain: domain.trim(),
      visibility,
      sharedKeywords: Math.floor(Math.random() * 800) + 100,
      authority,
      contentGap: Math.floor(Math.random() * 300) + 20,
      backlinks: Math.floor(Math.random() * 50000) + 1000,
      trafficShare: Math.floor(Math.random() * 30) + 5,
    };
  });
}

export default function CompetitorAnalysis() {
  const { user } = useAuth();

  const [yourDomain, setYourDomain] = useState("yourdomain.com");
  const [competitorInput, setCompetitorInput] = useState("competitor1.com, competitor2.com, competitor3.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompetitorRow[] | null>(null);
  const [submittedDomain, setSubmittedDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!yourDomain.trim()) { setError("Please enter your domain."); return; }
    setLoading(true);
    setError("");
    setMessage("");

    await new Promise(r => setTimeout(r, 1000));

    const list = competitorInput.split(",").map(c => c.trim()).filter(Boolean);
    const result = generateCompetitorData(yourDomain.trim(), list);
    setData(result);
    setSubmittedDomain(yourDomain.trim());
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) { setError("You must be logged in."); return; }
    if (!data) { setError("No data to save."); return; }
    setSaving(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      title: `Competitor Analysis - ${submittedDomain}`,
      report_type: "competitor-analysis",
      data: { yourDomain: submittedDomain, competitors: data },
    });
    if (error) setError(error.message);
    else setMessage("Competitor analysis saved successfully.");
    setSaving(false);
  };

  const radarData = data ? [
    { metric: "Visibility", you: 45, ...Object.fromEntries(data.map(d => [d.domain, d.visibility])) },
    { metric: "Authority", you: 38, ...Object.fromEntries(data.map(d => [d.domain, d.authority])) },
    { metric: "Traffic", you: 52, ...Object.fromEntries(data.map(d => [d.domain, d.trafficShare * 2])) },
    { metric: "Keywords", you: 40, ...Object.fromEntries(data.map(d => [d.domain, Math.floor(d.sharedKeywords / 10)])) },
    { metric: "Backlinks", you: 35, ...Object.fromEntries(data.map(d => [d.domain, Math.floor(d.backlinks / 1000)])) },
  ] : [];

  const barData = data ? data.map(d => ({
    domain: d.domain.length > 15 ? d.domain.substring(0, 12) + "..." : d.domain,
    Authority: d.authority,
    Visibility: d.visibility,
    "Traffic Share": d.trafficShare,
  })) : [];

  const colors = ["#3b82f6", "#f59e0b", "#10b981", "#a855f7"];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Compare your domain against competitors and identify content opportunities.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || !data}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Analysis"}
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Domain Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Your domain (e.g. yourdomain.com)"
              className="pl-10 h-12"
              value={yourDomain}
              onChange={(e) => setYourDomain(e.target.value)}
            />
          </div>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Competitors separated by commas"
              className="pl-10 h-12"
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
            />
          </div>
        </div>
        <Button variant="premium" onClick={handleAnalyze} disabled={loading} className="h-12 px-8">
          {loading ? (
            <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 animate-spin" /> Analyzing...</span>
          ) : (
            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Analyze Competitors</span>
          )}
        </Button>
      </Card>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {loading && (
        <Card className="p-12 flex flex-col items-center gap-4">
          <RotateCcw className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Analyzing competitors...</p>
        </Card>
      )}

      {data && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Your Domain</p>
                  <p className="font-bold truncate">{submittedDomain}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Competitors</p>
                  <p className="text-3xl font-bold">{data.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Authority</p>
                  <p className="text-3xl font-bold">
                    {Math.round(data.reduce((s, d) => s + d.authority, 0) / data.length)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Content Gap</p>
                  <p className="text-3xl font-bold">{data.reduce((s, d) => s + d.contentGap, 0)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Competitor Bar Chart</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Authority" fill="#3b82f6" radius={[4,4,0,0]} />
                    <Bar dataKey="Visibility" fill="#f59e0b" radius={[4,4,0,0]} />
                    <Bar dataKey="Traffic Share" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Competitive Radar</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Radar name="You" dataKey="you" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    {data.slice(0, 3).map((d, i) => (
                      <Radar key={d.domain} name={d.domain} dataKey={d.domain} stroke={colors[i+1]} fill={colors[i+1]} fillOpacity={0.2} />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <h3 className="font-semibold text-lg">Competitor Comparison Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/10 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Domain</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Authority</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Visibility</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Shared Keywords</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Backlinks</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Content Gap</th>
                    <th className="px-6 py-4 text-center font-medium text-muted-foreground">Traffic Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((item, i) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.domain}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${item.authority >= 60 ? "text-red-500" : item.authority >= 40 ? "text-amber-500" : "text-emerald-500"}`}>
                          {item.authority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">{item.visibility}%</td>
                      <td className="px-6 py-4 text-center">{item.sharedKeywords.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">{item.backlinks.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-amber-600 font-medium">{item.contentGap}</span>
                      </td>
                      <td className="px-6 py-4 text-center">{item.trafficShare}%</td>
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
