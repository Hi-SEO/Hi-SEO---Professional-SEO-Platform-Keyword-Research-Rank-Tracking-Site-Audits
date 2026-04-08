export type RankingPosition = {
  id: string
  keyword: string
  currentPosition: number
  previousPosition: number | null
  change: number
  volume: number
  lastUpdated: string
  bestPosition: number
}

export type RankChartPoint = {
  date: string
} & Record<string, number>

export type RankTrackerData = {
  domain: string
  totalKeywords: number
  averagePosition: number
  positions: RankingPosition[]
  chartData: RankChartPoint[]
}

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed: string, min: number, max: number): number {
  const hash = hashString(seed)
  const normalized = (hash % 1000) / 1000
  return Math.floor(normalized * (max - min + 1)) + min
}

function normalizeDomain(domain: string) {
  return domain.trim() || "yourwebsite.com"
}

function getRandomPosition(seed: string, min: number = 1, max: number = 85): number {
  return seededRandom(seed, min, max)
}

function simulatePositionChange(seed: string, current: number): number {
  const delta = seededRandom(seed, -3, 3)
  return Math.max(1, Math.min(100, current + delta))
}

export function generateRankingData(domain: string, keywords: string[] = []): RankTrackerData {
  const normalizedDomain = normalizeDomain(domain)

  const seedKeywords =
    keywords.length > 0
      ? keywords
      : ["seo tools", "keyword research", "rank tracker", "site audit", "backlink checker"]

  const positions: RankingPosition[] = seedKeywords.map((keyword, index) => {
    const baseSeed = `${normalizedDomain}:${keyword}:${index}`

    const currentPosition = getRandomPosition(`${baseSeed}:current`, 3, 45)
    const previousPosition = simulatePositionChange(`${baseSeed}:previous`, currentPosition)
    const change = previousPosition - currentPosition
    const volume = seededRandom(`${baseSeed}:volume`, 800, 18800)

    return {
      id: `rank-${hashString(baseSeed)}`,
      keyword,
      currentPosition,
      previousPosition,
      change,
      volume,
      lastUpdated: new Date().toISOString(),
      bestPosition: Math.max(1, currentPosition - seededRandom(`${baseSeed}:best`, 1, 15)),
    }
  })

  const averagePosition = Math.round(
    positions.reduce((sum, p) => sum + p.currentPosition, 0) / positions.length
  )

  const chartData: RankChartPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    const dataPoint: RankChartPoint = { date: day }

    positions.forEach((pos, idx) => {
      const noise = seededRandom(`${normalizedDomain}:${pos.keyword}:${i}:noise`, -5, 5)
      const trendWave = Math.sin(i / 3) * 5
      dataPoint[`keyword${idx}`] = Math.max(1, Math.round(pos.currentPosition + trendWave + noise))
    })

    return dataPoint
  })

  return {
    domain: normalizedDomain,
    totalKeywords: positions.length,
    averagePosition,
    positions: positions.sort((a, b) => a.currentPosition - b.currentPosition),
    chartData,
  }
}

export function getPositionChangeColor(change: number): string {
  if (change > 0) return "text-emerald-500"
  if (change < 0) return "text-red-500"
  return "text-muted-foreground"
}

export function getPositionChangeIcon(change: number) {
  if (change > 0) return "▲"
  if (change < 0) return "▼"
  return "–"
}
