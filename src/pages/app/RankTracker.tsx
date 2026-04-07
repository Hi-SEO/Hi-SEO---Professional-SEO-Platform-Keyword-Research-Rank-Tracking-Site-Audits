import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type TrackedDomain = {
  id: string;
  domain: string;
  label: string | null;
};

type TrackedKeyword = {
  id: string;
  keyword: string;
  project_id: string | null;
  volume: number | null;
  difficulty: string | null;
  trend: string | null;
};

const rankingData = [
  { date: "Jan 1", yourDomain: 15, competitor: 12 },
  { date: "Jan 8", yourDomain: 14, competitor: 13 },
  { date: "Jan 15", yourDomain: 10, competitor: 14 },
  { date: "Jan 22", yourDomain: 8, competitor: 15 },
  { date: "Jan 29", yourDomain: 5, competitor: 15 },
  { date: "Feb 5", yourDomain: 3, competitor: 18 },
];

export default function RankTracker() {
  const { user } = useAuth();

  const [domains, setDomains] = useState<TrackedDomain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [trackedKeywords, setTrackedKeywords] = useState<TrackedKeyword[]>([]);

  const [newDomain, setNewDomain] = useState("");
  const [newDomainLabel, setNewDomainLabel] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const [loadingDomain, setLoadingDomain] = useState(false);
  const [loadingKeyword, setLoadingKeyword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedDomain = useMemo(
    () => domains.find((d) => d.id === selectedDomainId) || null,
    [domains, selectedDomainId]
  );

  const loadDomains = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tracked_domains")
      .select("id, domain, label")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDomains(data);
      if (data.length > 0 && !selectedDomainId) {
        setSelectedDomainId(data[0].id);
      }
    }
  };

  const loadTrackedKeywords = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("keywords")
      .select("id, keyword, project_id, volume, difficulty, trend")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTrackedKeywords(data);
    }
  };

  useEffect(() => {
    loadDomains();
    loadTrackedKeywords();
  }, [user]);

  const handleCreateDomain = async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!newDomain.trim()) {
      setError("Domain is required.");
      return;
    }

    setLoadingDomain(true);
    setError("");
    setMessage("");

    const { data, error } = await supabase
      .from("tracked_domains")
      .insert({
        user_id: user.id,
        domain: newDomain.trim(),
        label: newDomainLabel.trim() || null,
      })
      .select("id, domain, label")
      .single();

    if (error) {
      setError(error.message);
      setLoadingDomain(false);
      return;
    }

    if (data) {
      setDomains((prev) => [data, ...prev]);
      setSelectedDomainId(data.id);
      setNewDomain("");
      setNewDomainLabel("");
      setMessage("Tracked domain created successfully.");
    }

    setLoadingDomain(false);
  };

  const handleAddKeyword = async () => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!selectedDomainId) {
      setError("Please create or select a tracked domain first.");
      return;
    }

    if (!newKeyword.trim()) {
      setError("Keyword is required.");
      return;
    }

    setLoadingKeyword(true);
    setError("");
    setMessage("");

    const estimatedVolume = Math.floor(Math.random() * 10000) + 100;
    const estimatedDifficulty = String(Math.floor(Math.random() * 80) + 10);
    const trendOptions = ["Rising", "Stable", "Seasonal"];
    const estimatedTrend =
      trendOptions[Math.floor(Math.random() * trendOptions.length)];

    const { data, error } = await supabase
      .from("keywords")
      .insert({
        user_id: user.id,
        keyword: newKeyword.trim(),
        volume: estimatedVolume,
        difficulty: estimatedDifficulty,
        trend: estimatedTrend,
      })
      .select("id, keyword, project_id, volume, difficulty, trend")
      .single();

    if (error) {
      setError(error.message);
      setLoadingKeyword(false);
      return;
    }

    if (data) {
      setTrackedKeywords((prev) => [data, ...prev]);
      setNewKeyword("");
      setMessage("Keyword added for tracking.");
    }

    setLoadingKeyword(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rank Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Add domains, track keywords, and monitor ranking trends over time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Tracking MVP
          </Button>
          <Button variant="premium">Live API Later</Button>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Add Tracked Domain</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Domain (example.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <Input
            placeholder="Label (optional)"
            value={newDomainLabel}
            onChange={(e) => setNewDomainLabel(e.target.value)}
          />
          <Button onClick={handleCreateDomain} disabled={loadingDomain}>
            {loadingDomain ? "Creating..." : "Create Tracked Domain"}
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Tracked Domain</label>
          <select
            className="h-12 rounded-md border border-input bg-background px-4 py-2 font-medium w-full"
            value={selectedDomainId}
            onChange={(e) => setSelectedDomainId(e.target.value)}
          >
            <option value="">Choose a tracked domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.domain} {domain.label ? `(${domain.label})` : ""}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Add Keyword for Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <Input
            placeholder="Enter keyword to track"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
          />
          <Button onClick={handleAddKeyword} disabled={loadingKeyword}>
            {loadingKeyword ? "Adding..." : "Add Keyword"}
          </Button>
        </div>

        {selectedDomain && (
          <p className="text-sm text-muted-foreground">
            Tracking keywords for: <span className="font-medium">{selectedDomain.domain}</span>
          </p>
        )}

        {(error || message) && (
          <div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Tracked Domains</div>
          <div className="text-3xl font-bold">{domains.length}</div>
          <div className="text-xs text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Active tracking setup
          </div>
        </Card>
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Tracked Keywords</div>
          <div className="text-3xl font-bold">{trackedKeywords.length}</div>
          <div className="text-xs text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Saved in database
          </div>
        </Card>
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Selected Domain</div>
          <div className="text-lg font-bold truncate">
            {selectedDomain?.domain || "None"}
          </div>
          <div className="text-xs text-muted-foreground">Current tracking target</div>
        </Card>
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Tracking Status</div>
          <div className="text-3xl font-bold">MVP</div>
          <div className="text-xs text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Ready for live data later
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border/50">
        <h3 className="font-semibold text-lg mb-6">Ranking Trend Preview</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rankingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dy={10}
              />
              <YAxis
                reversed
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                domain={[1, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="yourDomain"
                name="Your Domain"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="competitor"
                name="Competitor"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Tracked Keywords</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Keyword</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Volume</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Difficulty</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trackedKeywords.map((item) => (
                <tr key={item.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4 font-medium">{item.keyword}</td>
                  <td className="px-6 py-4 text-right">{item.volume ?? "-"}</td>
                  <td className="px-6 py-4 text-right">{item.difficulty ?? "-"}</td>
                  <td className="px-6 py-4 text-center">{item.trend ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}