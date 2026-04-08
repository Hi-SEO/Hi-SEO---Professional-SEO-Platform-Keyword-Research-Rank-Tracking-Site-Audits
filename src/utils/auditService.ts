export type AuditIssue = {
  issue: string
  category: "on-page" | "technical" | "performance" | "content"
  status: "good" | "warning" | "critical"
  details: string
  recommendation: string
}

export type AuditResult = {
  url: string
  score: number
  issues: AuditIssue[]
  summary: {
    total: number
    good: number
    warnings: number
    critical: number
  }
  meta: {
    title: string
    description: string
    h1: string
    canonical: string
    robots: string
    language: string
  }
  performance: {
    pageSize: string
    loadTime: string
    requests: number
  }
}

function normalizeUrl(targetUrl: string) {
  const trimmed = targetUrl.trim()
  if (!trimmed) return ""

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    new URL(withProtocol)
    return withProtocol
  } catch {
    return ""
  }
}

function buildSummary(issues: AuditIssue[]) {
  return {
    total: issues.length,
    good: issues.filter((i) => i.status === "good").length,
    warnings: issues.filter((i) => i.status === "warning").length,
    critical: issues.filter((i) => i.status === "critical").length,
  }
}

function calculateScore(issues: AuditIssue[], fetchFailed: boolean) {
  const good = issues.filter((i) => i.status === "good").length
  const warnings = issues.filter((i) => i.status === "warning").length
  const critical = issues.filter((i) => i.status === "critical").length

  let score = 100
  score -= warnings * 8
  score -= critical * 18
  score += good * 2

  if (fetchFailed) {
    score -= 10
  }

  return Math.max(10, Math.min(100, Math.round(score)))
}

function buildFallbackResult(normalized: string, loadTime: string, pageSize: string): AuditResult {
  const issues: AuditIssue[] = []

  if (!normalized.startsWith("https://")) {
    issues.push({
      issue: "HTTPS / SSL",
      category: "technical",
      status: "critical",
      details: "Page not using HTTPS.",
      recommendation: "Install SSL and redirect to HTTPS.",
    })
  }

  issues.push({
    issue: "Page Fetch",
    category: "technical",
    status: "warning",
    details: "Could not fetch live page HTML. Results are limited to URL-level checks.",
    recommendation:
      "Ensure the URL is publicly accessible or move the audit to a server-side fetch function.",
  })

  return {
    url: normalized,
    score: calculateScore(issues, true),
    issues,
    summary: buildSummary(issues),
    meta: {
      title: "",
      description: "",
      h1: "",
      canonical: "",
      robots: "",
      language: "",
    },
    performance: {
      pageSize,
      loadTime,
      requests: 0,
    },
  }
}

export async function runSiteAudit(targetUrl: string): Promise<AuditResult> {
  const normalized = normalizeUrl(targetUrl)
  if (!normalized) {
    throw new Error("Please enter a valid domain or URL.")
  }

  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(normalized)}`

  let html = ""
  let loadTime = "N/A"
  let pageSize = "N/A"

  try {
    const start = Date.now()
    const res = await fetch(proxyUrl)

    if (!res.ok) {
      throw new Error(`Proxy request failed with status ${res.status}`)
    }

    const data = await res.json()

    loadTime = `${((Date.now() - start) / 1000).toFixed(2)}s`
    html = typeof data?.contents === "string" ? data.contents : ""
    pageSize = html ? `${(new Blob([html]).size / 1024).toFixed(1)} KB` : "N/A"
  } catch {
    return buildFallbackResult(normalized, loadTime, pageSize)
  }

  if (!html.trim()) {
    return buildFallbackResult(normalized, loadTime, pageSize)
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  const title = doc.querySelector("title")?.textContent?.trim() || ""
  const description =
    doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || ""
  const h1 = doc.querySelector("h1")?.textContent?.trim() || ""
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || ""
  const robots = doc.querySelector('meta[name="robots"]')?.getAttribute("content")?.trim() || ""
  const language = doc.documentElement?.getAttribute("lang") || ""
  const h2s = doc.querySelectorAll("h2")
  const images = doc.querySelectorAll("img")
  const imagesWithoutAlt = Array.from(images).filter((img) => !img.getAttribute("alt"))
  const links = doc.querySelectorAll("a")
  const metaViewport = doc.querySelector('meta[name="viewport"]')
  const ogTitle = doc.querySelector('meta[property="og:title"]')
  const ogDesc = doc.querySelector('meta[property="og:description"]')
  const schemaScript = doc.querySelector('script[type="application/ld+json"]')

  const issues: AuditIssue[] = []

  if (!normalized.startsWith("https://")) {
    issues.push({
      issue: "HTTPS / SSL",
      category: "technical",
      status: "critical",
      details: "Page not using HTTPS.",
      recommendation: "Install SSL and redirect to HTTPS.",
    })
  } else {
    issues.push({
      issue: "HTTPS / SSL",
      category: "technical",
      status: "good",
      details: "Page served over HTTPS.",
      recommendation: "SSL properly configured.",
    })
  }

  if (!title) {
    issues.push({
      issue: "Title Tag",
      category: "on-page",
      status: "critical",
      details: "No title tag found.",
      recommendation: "Add a unique title tag between 50-60 characters.",
    })
  } else if (title.length < 30) {
    issues.push({
      issue: "Title Tag",
      category: "on-page",
      status: "warning",
      details: `Title too short (${title.length} chars): "${title}"`,
      recommendation: "Expand title to 50-60 characters.",
    })
  } else if (title.length > 60) {
    issues.push({
      issue: "Title Tag",
      category: "on-page",
      status: "warning",
      details: `Title too long (${title.length} chars): "${title}"`,
      recommendation: "Shorten title to under 60 characters.",
    })
  } else {
    issues.push({
      issue: "Title Tag",
      category: "on-page",
      status: "good",
      details: `Title looks good (${title.length} chars): "${title}"`,
      recommendation: "Title tag is well optimized.",
    })
  }

  if (!description) {
    issues.push({
      issue: "Meta Description",
      category: "on-page",
      status: "critical",
      details: "No meta description found.",
      recommendation: "Add a meta description between 150-160 characters.",
    })
  } else if (description.length < 100) {
    issues.push({
      issue: "Meta Description",
      category: "on-page",
      status: "warning",
      details: `Meta description too short (${description.length} chars).`,
      recommendation: "Expand to 150-160 characters.",
    })
  } else if (description.length > 160) {
    issues.push({
      issue: "Meta Description",
      category: "on-page",
      status: "warning",
      details: `Meta description too long (${description.length} chars).`,
      recommendation: "Shorten to under 160 characters.",
    })
  } else {
    issues.push({
      issue: "Meta Description",
      category: "on-page",
      status: "good",
      details: `Meta description looks good (${description.length} chars).`,
      recommendation: "Well optimized.",
    })
  }

  if (!h1) {
    issues.push({
      issue: "H1 Heading",
      category: "on-page",
      status: "critical",
      details: "No H1 heading found.",
      recommendation: "Add exactly one H1 heading.",
    })
  } else {
    issues.push({
      issue: "H1 Heading",
      category: "on-page",
      status: "good",
      details: `H1 found: "${h1}"`,
      recommendation: "H1 is present.",
    })
  }

  if (h2s.length === 0) {
    issues.push({
      issue: "H2 Headings",
      category: "on-page",
      status: "warning",
      details: "No H2 headings found.",
      recommendation: "Add H2 headings to structure content.",
    })
  } else {
    issues.push({
      issue: "H2 Headings",
      category: "on-page",
      status: "good",
      details: `${h2s.length} H2 heading(s) found.`,
      recommendation: "Good heading structure.",
    })
  }

  if (!canonical) {
    issues.push({
      issue: "Canonical Tag",
      category: "technical",
      status: "warning",
      details: "No canonical tag found.",
      recommendation: "Add a canonical tag to prevent duplicate content.",
    })
  } else {
    issues.push({
      issue: "Canonical Tag",
      category: "technical",
      status: "good",
      details: `Canonical: ${canonical}`,
      recommendation: "Canonical tag is present.",
    })
  }

  if (robots.includes("noindex")) {
    issues.push({
      issue: "Robots Meta",
      category: "technical",
      status: "critical",
      details: `Page set to noindex: "${robots}"`,
      recommendation: "Remove noindex to allow search engine indexing.",
    })
  } else {
    issues.push({
      issue: "Robots Meta",
      category: "technical",
      status: "good",
      details: robots ? `Robots: "${robots}"` : "No robots restrictions.",
      recommendation: "Page is indexable.",
    })
  }

  if (!language) {
    issues.push({
      issue: "Language Attribute",
      category: "technical",
      status: "warning",
      details: "No lang attribute on <html>.",
      recommendation: 'Add lang="en" to the <html> tag.',
    })
  } else {
    issues.push({
      issue: "Language Attribute",
      category: "technical",
      status: "good",
      details: `Language: "${language}"`,
      recommendation: "Language attribute present.",
    })
  }

  if (!metaViewport) {
    issues.push({
      issue: "Viewport Meta Tag",
      category: "technical",
      status: "critical",
      details: "No viewport meta tag found.",
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
    })
  } else {
    issues.push({
      issue: "Viewport Meta Tag",
      category: "technical",
      status: "good",
      details: "Viewport meta tag present.",
      recommendation: "Mobile viewport configured.",
    })
  }

  if (images.length > 0) {
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        issue: "Image Alt Text",
        category: "content",
        status: imagesWithoutAlt.length > 5 ? "critical" : "warning",
        details: `${imagesWithoutAlt.length} of ${images.length} images missing alt text.`,
        recommendation: "Add descriptive alt text to all images.",
      })
    } else {
      issues.push({
        issue: "Image Alt Text",
        category: "content",
        status: "good",
        details: `All ${images.length} images have alt text.`,
        recommendation: "Good image accessibility.",
      })
    }
  }

  if (!ogTitle || !ogDesc) {
    issues.push({
      issue: "Open Graph Tags",
      category: "content",
      status: "warning",
      details: "Missing og:title or og:description.",
      recommendation: "Add Open Graph tags for better social sharing.",
    })
  } else {
    issues.push({
      issue: "Open Graph Tags",
      category: "content",
      status: "good",
      details: "Open Graph tags present.",
      recommendation: "Social sharing tags look good.",
    })
  }

  if (!schemaScript) {
    issues.push({
      issue: "Schema Markup",
      category: "content",
      status: "warning",
      details: "No JSON-LD schema markup found.",
      recommendation: "Add structured data for rich snippets.",
    })
  } else {
    issues.push({
      issue: "Schema Markup",
      category: "content",
      status: "good",
      details: "JSON-LD schema found.",
      recommendation: "Structured data present.",
    })
  }

  const score = calculateScore(issues, false)
  const summary = buildSummary(issues)

  return {
    url: normalized,
    score,
    issues,
    summary,
    meta: {
      title,
      description,
      h1,
      canonical,
      robots,
      language,
    },
    performance: {
      pageSize,
      loadTime,
      requests: links.length,
    },
  }
}
