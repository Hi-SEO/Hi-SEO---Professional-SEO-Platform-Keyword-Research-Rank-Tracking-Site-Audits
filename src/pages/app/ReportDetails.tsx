import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Copy, Download, ArrowLeft, CheckCircle2,
  AlertTriangle, ShieldAlert, FileText,
  Search, Target, Link2, Zap, BarChart3, Users, Layers
} from "lucide-react";

type Report = {
  id: string;
  title: string;
  report_type: string | null;
  data: any;
  created_at: string;
};

function SiteAuditRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Health Score</p>
          <p className={`text-3xl font-bold mt-1 ${data?.score >= 80 ? "text-emerald-500" : data?.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
            {data?.score}/100
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Total Checks</p>
          <p className="text-3xl font-bold mt-1">{data?.summary?.total || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Critical Issues</p>
          <p className="text-3xl font-bold mt-1 text-red-500">{data?.summary?.critical || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Passed</p>
          <p className="text-3xl font-bold mt-1 text-emerald-500">{data?.summary?.good || 0}</p>
        </Card>
      </div>

      <Card className="p-6 space-y-3">
        <h3 className="font-semibold">Page Meta</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-muted/20 border">
            <span className="text-muted-foreground">URL</span>
            <span className="font-medium">{data?.url}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20 border">
            <span className="text-muted-foreground">Title</span>
            <span className="font-medium">{data?.meta?.title || "Not found"}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20 border">
            <span className="text-muted-foreground">H1</span>
            <span className="font-medium">{data?.meta?.h1 || "Not found"}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/20 border">
            <span className="text-muted-foreground">Load Time</span>
            <span className="font-medium">{data?.performance?.loadTime}</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Audit Issues</h3>
        </div>
        <div className="divide-y">
          {data?.issues?.map((item: any, index: number) => (
            <div key={index} className="p-4 flex items-start gap-3 hover:bg-muted/10">
              {item.status === "good" && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
              {item.status === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
              {item.status === "critical" && <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
              <div>
                <p className="font-medium text-sm">{item.issue}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.details}</p>
                {item.recommendation && (
                  <p className="text-xs text-primary mt-1">{item.recommendation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KeywordRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Seed Keyword</p>
          <p className="font-bold mt-1">{data?.seed}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Total Keywords</p>
          <p className="text-3xl font-bold mt-1">{data?.total || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Avg Difficulty</p>
          <p className="text-3xl font-bold mt-1">{data?.summary?.avgKD || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Avg CPC</p>
          <p className="text-3xl font-bold mt-1">${data?.summary?.avgCPC || 0}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Keywords</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Keyword</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Intent</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">KD</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Volume</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">CPC</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.keywords?.slice(0, 20).map((kw: any, index: number) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-6 py-3 font-medium">{kw.keyword}</td>
                  <td className="px-6 py-3 text-muted-foreground">{kw.intent}</td>
                  <td className="px-6 py-3 text-right">{kw.kd}</td>
                  <td className="px-6 py-3 text-right">{kw.volume?.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right">${kw.cpc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RankTrackerRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Domain</p>
          <p className="font-bold mt-1 truncate">{data?.domain}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Keywords Tracked</p>
          <p className="text-3xl font-bold mt-1">{data?.totalKeywords || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Avg Position</p>
          <p className="text-3xl font-bold mt-1">{data?.averagePosition || 0}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Keyword</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Position</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Change</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.positions?.map((pos: any, index: number) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-6 py-3 font-medium">{pos.keyword}</td>
                  <td className="px-6 py-3 text-center font-bold">#{pos.currentPosition}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`font-medium ${pos.change > 0 ? "text-emerald-500" : pos.change < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                      {pos.change > 0 ? "+" : ""}{pos.change}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">{pos.volume?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BacklinkRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Domain</p>
          <p className="font-bold mt-1 truncate">{data?.domain}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Domain Rating</p>
          <p className="text-3xl font-bold mt-1 text-blue-500">{data?.domainRating}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Referring Domains</p>
          <p className="text-3xl font-bold mt-1">{data?.referringDomains}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Total Backlinks</p>
          <p className="text-3xl font-bold mt-1">{data?.totalBacklinks?.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Top Backlinks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Anchor</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Authority</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.backlinks?.map((link: any, index: number) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-6 py-3 font-medium">{link.sourceDomain}</td>
                  <td className="px-6 py-3 text-muted-foreground">{link.anchorText}</td>
                  <td className="px-6 py-3 text-center">{link.authority}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${link.type === "dofollow" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                      {link.type}
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

function ContentStrategyRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-2">
        <h3 className="font-semibold">Pillar Page</h3>
        <p className="text-xl font-bold">{data?.pillarTitle}</p>
        <p className="text-sm text-muted-foreground">{data?.angle}</p>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Content Ideas</h3>
        </div>
        <div className="divide-y">
          {data?.contentIdeas?.map((item: any, index: number) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-muted/10">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.intent} - {item.type}</p>
              </div>
              {item.priority && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.priority === "High" ? "bg-red-100 text-red-700" : item.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                  {item.priority}
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AIWriterRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5"><p className="text-xs text-muted-foreground">Topic</p><p className="font-bold mt-1">{data?.topic}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Type</p><p className="font-bold mt-1">{data?.contentType}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Word Count</p><p className="font-bold mt-1">{data?.wordCount?.toLocaleString()}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Reading Time</p><p className="font-bold mt-1">{data?.readingTime} min</p></Card>
      </div>
      <Card className="p-6 space-y-2">
        <h3 className="font-semibold">Meta Description</h3>
        <p className="text-sm bg-muted/20 p-4 rounded-lg border">{data?.metaDescription}</p>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4"><h3 className="font-semibold">Title Ideas</h3></div>
        <div className="divide-y">
          {data?.titleIdeas?.map((title: string, index: number) => (
            <div key={index} className="px-6 py-4 hover:bg-muted/10">{title}</div>
          ))}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4"><h3 className="font-semibold">Article Structure</h3></div>
        <div className="divide-y">
          {data?.headings?.map((heading: string, index: number) => (
            <div key={index} className="px-6 py-4 hover:bg-muted/10">{heading}</div>
          ))}
        </div>
      </Card>
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold">Target Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {data?.targetKeywords?.map((kw: string, index: number) => (
            <span key={index} className="rounded-full border px-4 py-2 text-sm bg-primary/5 text-primary">{kw}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SerpRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5"><p className="text-xs text-muted-foreground">Keyword</p><p className="font-bold mt-1 truncate">{data?.keyword}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Intent</p><p className="font-bold mt-1">{data?.intent}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Difficulty</p><p className="text-3xl font-bold mt-1">{data?.difficulty}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Click Opportunity</p><p className="text-3xl font-bold mt-1">{data?.clickOpportunity}%</p></Card>
      </div>
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4"><h3 className="font-semibold">SERP Features</h3></div>
        <div className="divide-y">
          {data?.features?.map((feature: any, index: number) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-muted/10">
              <span className="font-medium text-sm">{feature.name}</span>
              <span className={`text-sm font-medium ${feature.present ? "text-emerald-600" : "text-muted-foreground"}`}>
                {feature.present ? "Present" : "Not Present"}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold">Recommendations</h3>
        {data?.recommendations?.map((item: string, index: number) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/10">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{index + 1}</span>
            <p className="text-sm">{item}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}

function CompetitorRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-2">Your Domain</h3>
        <p className="text-xl font-bold">{data?.yourDomain}</p>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4"><h3 className="font-semibold">Competitor Comparison</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Domain</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Authority</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Visibility</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Shared Keywords</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Content Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.competitors?.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-6 py-3 font-medium">{item.domain}</td>
                  <td className="px-6 py-3 text-center">{item.authority}</td>
                  <td className="px-6 py-3 text-center">{item.visibility}%</td>
                  <td className="px-6 py-3 text-center">{item.sharedKeywords?.toLocaleString()}</td>
                  <td className="px-6 py-3 text-center">{item.contentGap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RenderReportData({ report }: { report: Report }) {
  if (report.report_type === "site-audit") return <SiteAuditRenderer data={report.data} />;
  if (report.report_type === "keyword-explorer") return <KeywordRenderer data={report.data} />;
  if (report.report_type === "rank-tracker") return <RankTrackerRenderer data={report.data} />;
  if (report.report_type === "backlink-analytics") return <BacklinkRenderer data={report.data} />;
  if (report.report_type === "content-strategy") return <ContentStrategyRenderer data={report.data} />;
  if (report.report_type === "ai-writer") return <AIWriterRenderer data={report.data} />;
  if (report.report_type === "serp-analysis") return <SerpRenderer data={report.data} />;
  if (report.report_type === "competitor-analysis") return <CompetitorRenderer data={report.data} />;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Raw Report Data</h3>
      <pre className="whitespace-pre-wrap break-words text-sm bg-muted/20 p-4 rounded-lg overflow-auto">
        {JSON.stringify(report.data, null, 2)}
      </pre>
    </Card>
  );
}

export default function ReportDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      if (!user || !id) { setLoading(false); return; }
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("reports")
        .select("id, title, report_type, data, created_at")
        .eq("user_id", user.id)
        .eq("id", id)
        .single();

      if (error) { setError(error.message); setLoading(false); return; }

      setReport(data);
      setLoading(false);
    };

    loadReport();
  }, [user, id]);

  const handleCopyJson = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(JSON.stringify(report.data, null, 2));
    setMessage("Report JSON copied to clipboard.");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reportTypeLabels: Record<string, string> = {
    "site-audit": "Site Audit",
    "keyword-explorer": "Keyword Research",
    "rank-tracker": "Rank Tracker",
    "backlink-analytics": "Backlink Analytics",
    "content-strategy": "Content Strategy",
    "ai-writer": "AI Writer",
    "serp-analysis": "SERP Analysis",
    "competitor-analysis": "Competitor Analysis",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/app/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
        </Button>
      </div>

      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading report...</Card>
      ) : error ? (
        <Card className="p-6 text-red-500">{error}</Card>
      ) : report ? (
        <>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{report.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {reportTypeLabels[report.report_type || ""] || report.report_type}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleCopyJson}>
                  <Copy className="w-4 h-4 mr-2" /> Copy JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadJson}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          </Card>

          <RenderReportData report={report} />
        </>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">Report not found.</Card>
      )}
    </div>
  );
}

