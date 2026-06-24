/**
 * 대시보드에서 자주 쓰는 Supabase 쿼리 모음.
 * - 서버 컴포넌트에서만 사용 (service_role).
 */
import { createServiceClient } from "./supabase/server"
import type {
  Client,
  ContentQueueItem,
  Outreach,
  Prospect,
  SovMeasurement,
} from "./types"

export async function getActiveClients(): Promise<Client[]> {
  const supa = createServiceClient()
  const { data, error } = await supa
    .from("clients")
    .select("*")
    .eq("status", "active")
    .order("onboarded_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as Client[]
}

export async function getClient(slug: string): Promise<Client | null> {
  const supa = createServiceClient()
  const { data, error } = await supa
    .from("clients")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as Client | null
}

export async function getLatestSov(slug: string): Promise<SovMeasurement | null> {
  const supa = createServiceClient()
  const { data, error } = await supa
    .from("sov_measurements")
    .select("*")
    .eq("client_slug", slug)
    .order("measured_date", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as SovMeasurement | null
}

export async function getSovHistory(
  slug: string,
  days: number = 30
): Promise<SovMeasurement[]> {
  const supa = createServiceClient()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  const { data, error } = await supa
    .from("sov_measurements")
    .select("*")
    .eq("client_slug", slug)
    .gte("measured_date", since)
    .order("measured_date", { ascending: true })
  if (error) throw error
  return (data ?? []) as SovMeasurement[]
}

export async function getContentQueue(
  slug?: string,
  status?: ContentQueueItem["status"]
): Promise<ContentQueueItem[]> {
  const supa = createServiceClient()
  let q = supa.from("content_queue").select("*").order("created_at", { ascending: false })
  if (slug) q = q.eq("client_slug", slug)
  if (status) q = q.eq("status", status)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as ContentQueueItem[]
}

export async function getOutreach(slug?: string): Promise<Outreach[]> {
  const supa = createServiceClient()
  let q = supa.from("outreach").select("*").order("created_at", { ascending: false })
  if (slug) q = q.eq("client_slug", slug)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Outreach[]
}

export async function getProspects(): Promise<Prospect[]> {
  const supa = createServiceClient()
  const { data, error } = await supa
    .from("prospects")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as Prospect[]
}
