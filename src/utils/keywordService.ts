export type KeywordData = {
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  intentCode: "I" | "C" | "T" | "N";
  kd: number;
  volume: number;
  cpc: number;
  trend: "Rising" | "Stable" | "Declining" | "Seasonal";
  competition: "Low" | "Medium" | "High";
  opportunity: number;
};

export type KeywordResult = {
  seed: string;
  total: number;
  keywords: KeywordData[];
  summary: {
    avgKD: number;
    avgVolume: number;
    avgCPC: number;
    totalVolume: number;
    lowCompetition: number;
    highVolume: number;
  };
};

function detectIntent(keyword: string): KeywordData["intent"] {
  const k = keyword.toLowerCase();
  if (k.includes("buy") || k.includes("price") || k.includes("pricing") || k.includes("hire") || k.includes("order") || k.includes("cheap") || k.includes("deal") || k.includes("discount") || k.includes("shop")) return "Transactional";
  if (k.includes("best") || k.includes("top") || k.includes("review") || k.includes("compare") || k.includes("vs") || k.includes("alternative") || k.includes("versus")) return "Commercial";
  if (k.includes("login") || k.includes("sign in") || k.includes("dashboard") || k.includes("official") || k.includes("website") || k.includes("homepage")) return "Navigational";
  return "Informational";
}

function getIntentCode(intent: KeywordData["intent"]): KeywordData["intentCode"] {
  const map: Record<KeywordData["intent"], KeywordData["intentCode"]> = {
    Informational: "I",
    Commercial: "C",
    Transactional: "T",
    Navigational: "N",
  };
  return map[intent];
}

function seededRandom(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  return Math.floor(normalized * (max - min + 1)) + min;
}

function estimateKD(keyword: string): number {
  const words = keyword.trim().split(/\s+/).length;
  const base = seededRandom(keyword, 10, 90);
  if (words === 1) return Math.min(90, base + 20);
  if (words === 2) return Math.min(80, base + 5);
  if (words >= 4) return Math.max(10, base - 20);
  return base;
}

function estimateVolume(keyword: string, intent: KeywordData["intent"]): number {
  const words = keyword.trim().split(/\s+/).length;
  const base = seededRandom(keyword + "vol", 100, 90000);
  const intentMultiplier = intent === "Transactional" ? 0.6 : intent === "Informational" ? 1.2 : 1.0;
  const lengthMultiplier = words === 1 ? 1.5 : words === 2 ? 1.2 : words === 3 ? 0.8 : 0.4;
  return Math.floor(base * intentMultiplier * lengthMultiplier);
}

function estimateCPC(keyword: string, intent: KeywordData["intent"]): number {
  const base = seededRandom(keyword + "cpc", 10, 2000) / 100;
  const multiplier = intent === "Transactional" ? 2.5 : intent === "Commercial" ? 1.8 : intent === "Navigational" ? 0.5 : 0.8;
  return Number((base * multiplier).toFixed(2));
}

function estimateTrend(keyword: string): KeywordData["trend"] {
  const k = keyword.toLowerCase();
  if (k.includes("2025") || k.includes("new") || k.includes("latest") || k.includes("ai") || k.includes("chatgpt")) return "Rising";
  if (k.includes("christmas") || k.includes("black friday") || k.includes("halloween") || k.includes("summer") || k.includes("holiday")) return "Seasonal";
  const rand = seededRandom(keyword + "trend", 0, 10);
  if (rand > 7) return "Declining";
  return "Stable";
}

function getCompetition(kd: number): KeywordData["competition"] {
  if (kd >= 70) return "High";
  if (kd >= 40) return "Medium";
  return "Low";
}

function getOpportunity(volume: number, kd: number): number {
  const score = Math.round((volume / 1000) * (1 - kd / 100) * 10);
  return Math.min(100, Math.max(1, score));
}

function generateVariants(seed: string): string[] {
  const base = seed.trim().toLowerCase();
  return Array.from(new Set([
    base,
    `best ${base}`,
    `${base} tool`,
    `${base} tools`,
    `${base} software`,
    `${base} pricing`,
    `${base} cost`,
    `${base} free`,
    `free ${base}`,
    `${base} for beginners`,
    `${base} for small business`,
    `${base} for agencies`,
    `how to do ${base}`,
    `how to use ${base}`,
    `what is ${base}`,
    `${base} guide`,
    `${base} tutorial`,
    `${base} checklist`,
    `${base} template`,
    `${base} strategy`,
    `${base} tips`,
    `${base} tricks`,
    `${base} examples`,
    `${base} vs semrush`,
    `${base} vs ahrefs`,
    `${base} alternatives`,
    `best ${base} tools 2025`,
    `${base} services`,
    `${base} agency`,
    `${base} dashboard`,
  ]));
}

export async function fetchKeywordData(seed: string): Promise<KeywordResult> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const variants = generateVariants(seed);

  const keywords: KeywordData[] = variants.map((keyword) => {
    const intent = detectIntent(keyword);
    const kd = estimateKD(keyword);
    const volume = estimateVolume(keyword, intent);
    const cpc = estimateCPC(keyword, intent);
    const trend = estimateTrend(keyword);
    const competition = getCompetition(kd);
    const opportunity = getOpportunity(volume, kd);

    return {
      keyword,
      intent,
      intentCode: getIntentCode(intent),
      kd,
      volume,
      cpc,
      trend,
      competition,
      opportunity,
    };
  });

  keywords.sort((a, b) => b.volume - a.volume);

  const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);
  const avgKD = Math.round(keywords.reduce((sum, k) => sum + k.kd, 0) / keywords.length);
  const avgVolume = Math.round(totalVolume / keywords.length);
  const avgCPC = Number((keywords.reduce((sum, k) => sum + k.cpc, 0) / keywords.length).toFixed(2));
  const lowCompetition = keywords.filter(k => k.competition === "Low").length;
  const highVolume = keywords.filter(k => k.volume >= 10000).length;

  return {
    seed,
    total: keywords.length,
    keywords,
    summary: {
      avgKD,
      avgVolume,
      avgCPC,
      totalVolume,
      lowCompetition,
      highVolume,
    },
  };
}
