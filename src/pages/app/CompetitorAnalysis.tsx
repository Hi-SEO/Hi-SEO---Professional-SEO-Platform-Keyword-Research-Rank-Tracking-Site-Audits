import { useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Users, BarChart3, Target } from "lucide-react";

type CompetitorRow = {
  domain: string;
  visibility: number;
  sharedKeywords: number;
  authority: number;
  contentGap: number;
};

function generateCompetitorData(yourDomain: string, competitors: string[]): CompetitorRow[] {
  return competitors
    .filter((item) => item.trim())
    .map((domain) => ({
      domain: domain.trim(),
      visibility: Math.floor(Math.random() * 70) + 20,
      sharedKeywords: Math.floor(Math.random() * 500) + 50,
      authority: Math.floor(Math.random() * 60) + 20,
      contentGap: Math.floor(Math.random() * 200) + 10,
    }));
}

export default function CompetitorAnalysis() {
  const [yourDomain, setYourDomain] = useState("yourdomain.com");
  const [competitorInput, setCompetitorInput] = useState(
    "competitor1.com, competitor2.com, competitor3.com"
  );
  const [submittedYourDomain, setSubmittedYourDomain] = useState("yourdomain.com");
  const [submittedCompetitors, setSubmittedCompetitors] = useState([
    "competitor1.com",
    "competitor2.com",
    "competitor3.com",
  ]);

  const competitorData = useMemo(
    () => generateCompetitorData(submittedYourDomain, submittedCompetitors),
    [submittedYourDomain, submittedCompetitors]
  );

  const handleAnalyze = () => {
    const list = competitorInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setSubmittedYourDomain(yourDomain.trim());
    setSubmittedCompetitors(list);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Compare your domain against competitors and identify keyword and content opportunities.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Your domain"
            value={yourDomain}
            onChange={(e) => setYourDomain(e.target.value)}
          />
          <Input
            placeholder="Competitors separated by commas"
            value={competitorInput}
            onChange={(e) => setCompetitorInput(e.target.value)}
          />
        </div>

        <Button variant="premium" onClick={handleAnalyze}>
          <Search className="w-4 h-4 mr-2" />
          Analyze Competitors
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Your Domain</div>
          <div className="mt-2 text-xl font-bold truncate">{submittedYourDomain}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Competitors</div>
          <div className="mt-2 text-3xl font-bold">{competitorData.length}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Users className="w-3 h-3 mr-1" /> Tracked competitors
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Avg Authority</div>
          <div className="mt-2 text-3xl font-bold">
            {competitorData.length > 0
              ? Math.round(
                  competitorData.reduce((sum, item) => sum + item.authority, 0) /
                    competitorData.length
                )
              : 0}
          </div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <BarChart3 className="w-3 h-3 mr-1" /> Authority benchmark
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Content Gap</div>
          <div className="mt-2 text-3xl font-bold">
            {competitorData.reduce((sum, item) => sum + item.contentGap, 0)}
          </div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Target className="w-3 h-3 mr-1" /> Opportunity pages
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Competitor Comparison Table</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Competitor</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Visibility</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Shared Keywords</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Authority</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Content Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {competitorData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-6 py-4 font-medium">{item.domain}</td>
                  <td className="px-6 py-4 text-right">{item.visibility}%</td>
                  <td className="px-6 py-4 text-right">{item.sharedKeywords}</td>
                  <td className="px-6 py-4 text-right">{item.authority}</td>
                  <td className="px-6 py-4 text-right">{item.contentGap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}