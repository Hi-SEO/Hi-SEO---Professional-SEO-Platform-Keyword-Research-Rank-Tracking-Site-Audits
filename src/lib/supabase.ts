import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "hi-seo-auth",
  },
  global: {
    headers: {
      "x-application-name": "hi-seo",
    },
  },
})

// ============================================
// DATABASE TYPES
// ============================================

export interface DbProfile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
  plan: string
  created_at: string
}

export interface DbProject {
  id: string
  user_id: string
  name: string
  domain: string
  created_at: string
}

export interface DbKeyword {
  id: string
  user_id: string
  keyword: string
  volume: number | null
  difficulty: number | null
  created_at: string
}

export interface DbAudit {
  id: string
  user_id: string
  target_url: string
  score: number | null
  status: string
  issues: AuditIssues | null
  created_at: string
}

export interface AuditIssues {
  critical: number
  warnings: number
  passed: number
  details?: AuditIssueDetail[]
}

export interface AuditIssueDetail {
  type: "critical" | "warning" | "passed"
  category: string
  message: string
}

export interface DbReport {
  id: string
  user_id: string
  title: string
  report_type: string
  data: Record<string, unknown> | null
  created_at: string
}

export interface DbPayment {
  id: string
  user_id: string
  reference: string
  amount: number
  currency: string
  status: string
  plan: string
  paid_at: string | null
  created_at: string
}

export interface DbBacklink {
  id: string
  user_id: string
  source_url: string
  target_url: string
  authority: number | null
  created_at: string
}

export interface DbRankTracker {
  id: string
  user_id: string
  keyword: string
  position: number | null
  created_at: string
}

// ============================================
// QUERY HELPERS
// ============================================

export async function getProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.warn("getProfile error:", error.message)
    return null
  }
  return data as DbProfile
}

export async function getProjects(userId: string): Promise<DbProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getProjects error:", error.message)
    return []
  }
  return (data as DbProject[]) || []
}

export async function getKeywords(userId: string): Promise<DbKeyword[]> {
  const { data, error } = await supabase
    .from("keywords")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getKeywords error:", error.message)
    return []
  }
  return (data as DbKeyword[]) || []
}

export async function getAudits(userId: string): Promise<DbAudit[]> {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getAudits error:", error.message)
    return []
  }
  return (data as DbAudit[]) || []
}

export async function getReports(userId: string): Promise<DbReport[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getReports error:", error.message)
    return []
  }
  return (data as DbReport[]) || []
}

export async function getPayments(userId: string): Promise<DbPayment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getPayments error:", error.message)
    return []
  }
  return (data as DbPayment[]) || []
}

export async function getBacklinks(userId: string): Promise<DbBacklink[]> {
  const { data, error } = await supabase
    .from("backlinks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getBacklinks error:", error.message)
    return []
  }
  return (data as DbBacklink[]) || []
}

export async function getRankTrackers(userId: string): Promise<DbRankTracker[]> {
  const { data, error } = await supabase
    .from("rank_tracker")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("getRankTrackers error:", error.message)
    return []
  }
  return (data as DbRankTracker[]) || []
}

export async function getDashboardData(userId: string) {
  const [projects, keywords, audits, reports, backlinks, rankTrackers] =
    await Promise.all([
      getProjects(userId),
      getKeywords(userId),
      getAudits(userId),
      getReports(userId),
      getBacklinks(userId),
      getRankTrackers(userId),
    ])

  return {
    projects,
    keywords,
    audits,
    reports,
    backlinks,
    rankTrackers,
  }
}

export default supabase
