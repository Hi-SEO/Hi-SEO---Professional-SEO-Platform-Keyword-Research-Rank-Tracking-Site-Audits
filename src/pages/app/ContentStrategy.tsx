import { useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Layers, Lightbulb, FileText } from "lucide-react";

type ClusterItem = {
  title: string;
  intent: string;
  type: string;
};

function generateContentStrategy(topic: string) {
  const base = topic.trim().toLowerCase();

  const pillarTitle = `Complete Guide to ${base}`;
  const contentIdeas: ClusterItem[] = [
    { title: `What is ${base}?`, intent: "Informational", type: "Blog Post" },
    { title: `Best ${base} tools`, intent: "Commercial", type: "Comparison Article" },
    { title: `How to build a ${base} strategy`, intent: "Informational", type: "Guide" },
    { title: `${base} checklist`, intent: "Informational", type: "Checklist" },
    { title: `${base} for beginners`, intent: "Informational", type: "Tutorial" },
    { title: `${base} examples`, intent: "Informational", type: "Examples Post" },
    { title: `${base} vs alternatives`, intent: "Commercial", type: "Comparison Article" },
    { title: `${base} mistakes to avoid`, intent: "Informational", type: "Educational Post" },
  ];

  return {
    pillarTitle,
    contentIdeas,
    angle:
      `Build topical authority around "${base}" by publishing a pillar page and supporting articles targeting informational and commercial intent.`,
  };
}

export default function ContentStrategy() {
  const [topic, setTopic] = useState("seo content strategy");
  const [submittedTopic, setSubmittedTopic] = useState("seo content strategy");

  const strategy = useMemo(
    () => generateContentStrategy(submittedTopic),
    [submittedTopic]
  );

  const handleGenerate = () => {
    if (topic.trim()) {
      setSubmittedTopic(topic.trim());
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Strategy</h1>
        <p className="text-muted-foreground mt-1">
          Build topic clusters, supporting content ideas, and pillar page strategies.
        </p>
      </div>

      <Card className="p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Enter a topic"
            className="pl-12 h-14 text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <Button variant="premium" className="h-14 px-8 w-full md:w-auto" onClick={handleGenerate}>
          Generate Strategy
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Topic Cluster</div>
          <div className="mt-2 text-xl font-bold">{submittedTopic}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Layers className="w-3 h-3 mr-1" /> Cluster seed topic
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Pillar Page</div>
          <div className="mt-2 text-xl font-bold">{strategy.pillarTitle}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <FileText className="w-3 h-3 mr-1" /> Main authority page
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Content Angle</div>
          <div className="mt-2 text-sm font-medium">{strategy.angle}</div>
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Lightbulb className="w-3 h-3 mr-1" /> Strategic recommendation
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4">
          <h3 className="font-semibold">Supporting Content Ideas</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Intent</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {strategy.contentIdeas.map((item, index) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4">{item.intent}</td>
                  <td className="px-6 py-4">{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}