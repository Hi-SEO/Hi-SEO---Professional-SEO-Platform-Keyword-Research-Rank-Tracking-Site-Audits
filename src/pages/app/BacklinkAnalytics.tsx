import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Search, Link2, Globe, BarChart3 } from "lucide-react";

type BacklinkRow = {
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  authority: number;
  type: "dofollow" | "nofollow";
};

function generateBacklinks(domain: string): BacklinkRow[] {
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return [
    {
      sourceDomain: "techcrunch-example.com",
      targetUrl: `https://${clean}/`,
      anchorText: clean,
      authority: 78,
      type: "dofollow",
    },
    {
      sourceDomain: "marketingweekly.io",
      targetUrl: `https://${clean}/blog`,
      anchorText: "best seo platform",
      authority: 64,
      type: "dofollow",
    },
    {
      sourceDomain: "startupgrowthhub.com",
      targetUrl: `https://${clean}/pricing`,
      anchorText: "seo software pricing",
      authority: 51,
      type: "nofollow",
    },
    {
      sourceDomain: "agencyinsider.net",
      targetUrl: `https://${clean}/features`,
      anchorText: "rank tracking tools",
      authority: 72,
      type: "dofollow",
    },
    {
      sourceDomain: "serpjournal.org",
      targetUrl: `https://${clean}/compare`,
      anchorText: "seo tools comparison",
      authority: 59,
      type: "dofollow",
    },
    {
      sourceDomain: "digitalworldforum.com",
      targetUrl: `https://${clean}/`,
      anchorText: clean,
      authority: 46,
      type: "nofollow",
    },
  ];
}

export default function BacklinkAnalytics() {
  const [domain, setDomain] = useState("digitaltoolkt.com.ng");
  const [submittedDomain, setSubmittedDomain] = useState("digitaltoolkt.com.ng");

  const backlinks = useMemo(() => generateBacklinks(submittedDomain), [submittedDomain]);

  const referringDomains = backlinks.length;
  const totalBacklinks = backlinks.length * 4;
  const avgAuthority = Math.round(
    backlinks.reduce((sum, row) => sum + row.authority, 0) / backlinks.length
  );

  const anchorSummary = useMemo(() => {
    const counts: Record<string, number> = {};

    backlinks.forEach((row) => {
      counts[row.anchorText] = (counts[row.anchorText] || 0) + 1;
    });

    return Object.entries(counts).map(([term, count]) => ({
      term,
      percentage: Math.round((count / backlinks.length) * 100),
    }));
  }, [backlinks]);

  const handleAnalyze = () => {
    if (domain.trim()) {
      setSubmittedDomain(domain.trim());
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backlink Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Analyze backlink profiles, referring domains, anchor text, and authority metrics.
        </p>
      </div>

      <Card className="p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter a domain"
            className="pl-12 h-14 text-lg"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <Button variant="premium" className="h-14 px-8 w-full md:w-auto" onClick={handleAnalyze}>
          Analyze Domain
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Referring Domains</div>
          <div className="text-3xl font-bold">{referringDomains}</div>
          <div className="text-xs text-muted-foreground flex items-center">
            <Globe className="w-3 h-3 mr-1" /> Unique linking domains
          </div>
        </Card>

        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Total Backlinks</div>
          <div className="text-3xl font-bold">{totalBacklinks}</div>
          <div className="text-xs text-muted-foreground flex items-center">
            <Link2 className="w-3 h-3 mr-1" /> Estimated total link count
          </div>
        </Card>

        <Card className="p-6 space-y-2 border-border/50">
          <div className="text-sm font-medium text-muted-foreground">Average Authority</div>
          <div className="text-3xl font-bold">{avgAuthority}</div>
          <div className="text-xs text-muted-foreground flex items-center">
            <BarChart3 className="w-3 h-3 mr-1" /> Referring domain strength
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50">
          <h3 className="font-semibold mb-4">Top Anchor Texts</h3>
          <div className="space-y-4">
            {anchorSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-40 truncate text-sm font-medium">{item.term}</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/50">
          <h3 className="font-semibold mb-4">Link Type Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="font-medium">Dofollow Links</span>
              <span className="text-emerald-600 font-semibold">
                {backlinks.filter((b) => b.type === "dofollow").length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="font-medium">Nofollow Links</span>
              <span className="text-amber-600 font-semibold">
                {backlinks.filter((b) => b.type === "nofollow").length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Backlink Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Source Domain
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Target URL
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Anchor Text
                </th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Authority
                </th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {backlinks.map((row, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-6 py-4 font-medium">{row.sourceDomain}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.targetUrl}</td>
                  <td className="px-6 py-4">{row.anchorText}</td>
                  <td className="px-6 py-4 text-right">{row.authority}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        row.type === "dofollow"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}