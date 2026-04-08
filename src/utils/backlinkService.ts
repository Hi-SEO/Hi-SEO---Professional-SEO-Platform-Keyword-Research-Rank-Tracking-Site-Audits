export type Backlink = {
  id: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  authority: number;
  spamScore: number;
  type: "dofollow" | "nofollow";
  firstSeen: string;
};

export type BacklinkSummary = {
  domain: string;
  totalBacklinks: number;
  referringDomains: number;
  domainRating: number;
  avgAuthority: number;
  avgSpamScore: number;
  dofollowPercentage: number;
  backlinks: Backlink[];
};

function generateRealisticBacklinks(domain: string): Backlink[] {
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const sources = [
    "ahrefs.com", "semrush.com", "moz.com", "searchenginejournal.com",
    "marketingland.com", "searchengineland.com", "hubspot.com", "neilpatel.com",
    "backlinko.com", "contentmarketinginstitute.com", "socialmediaexaminer.com",
    "forbes.com", "entrepreneur.com", "inc.com", "techcrunch.com", "wired.com"
  ];

  const anchors = [
    cleanDomain, "best seo tool", "seo platform", "rank tracker", "keyword research",
    "site audit tool", "backlink checker", "seo software", "try for free",
    "read more", "learn more", `${cleanDomain} review`, "alternative to ahrefs"
  ];

  return Array.from({ length: 18 }, (_, i) => {
    const authority = Math.floor(Math.random() * 55) + 45;
    const spamScore = Math.floor(Math.random() * 25) + 3;
    const isDofollow = Math.random() > 0.35;
    const anchor = anchors[Math.floor(Math.random() * anchors.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];

    return {
      id: `bl-${Date.now()}-${i}`,
      sourceDomain: source,
      targetUrl: `https://${cleanDomain}${Math.random() > 0.6 ? '/blog' : Math.random() > 0.5 ? '/features' : ''}`,
      anchorText: anchor,
      authority,
      spamScore,
      type: isDofollow ? "dofollow" : "nofollow",
      firstSeen: new Date(Date.now() - Math.random() * 31536000000).toISOString().split('T')[0],
    };
  });
}

export function analyzeBacklinks(domain: string): BacklinkSummary {
  const backlinks = generateRealisticBacklinks(domain);
  
  const referringDomains = new Set(backlinks.map(b => b.sourceDomain)).size;
  const totalBacklinks = backlinks.length * 12;
  const avgAuthority = Math.round(
    backlinks.reduce((sum, b) => sum + b.authority, 0) / backlinks.length
  );
  const avgSpamScore = Math.round(
    backlinks.reduce((sum, b) => sum + b.spamScore, 0) / backlinks.length
  );
  const dofollowCount = backlinks.filter(b => b.type === "dofollow").length;
  const dofollowPercentage = Math.round((dofollowCount / backlinks.length) * 100);

  const domainRating = Math.min(98, Math.round(avgAuthority * 0.85 + (100 - avgSpamScore) * 0.4));

  return {
    domain: domain.replace(/^https?:\/\//, ""),
    totalBacklinks,
    referringDomains,
    domainRating,
    avgAuthority,
    avgSpamScore,
    dofollowPercentage,
    backlinks: backlinks.sort((a, b) => b.authority - a.authority),
  };
}
