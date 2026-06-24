/**
 * GET /api/health
 * - Supabase 연결 확인
 * - DB 9개 테이블 ping
 * - 환경변수 누락 즉시 감지
 */
import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const REQUIRED_TABLES = [
  "clients",
  "sov_measurements",
  "citations",
  "content_queue",
  "media_targets",
  "outreach",
  "prospects",
  "jobs_log",
  "weekly_reports",
] as const

export async function GET() {
  const startedAt = new Date().toISOString()
  const env_ok = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    GEMINI_API_KEY: Boolean(process.env.GEMINI_API_KEY),
  }

  if (!env_ok.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        ok: false,
        startedAt,
        env_ok,
        message: "SUPABASE_SERVICE_ROLE_KEY 누락. dashboard/.env.local 확인.",
      },
      { status: 503 }
    )
  }

  try {
    const supa = createServiceClient()
    const tables: Record<string, { ok: boolean; rows?: number; error?: string }> = {}

    for (const t of REQUIRED_TABLES) {
      const { count, error } = await supa
        .from(t)
        .select("*", { count: "exact", head: true })
      if (error) {
        tables[t] = { ok: false, error: error.message }
      } else {
        tables[t] = { ok: true, rows: count ?? 0 }
      }
    }

    const ok = Object.values(tables).every((x) => x.ok)

    return NextResponse.json(
      { ok, startedAt, finishedAt: new Date().toISOString(), env_ok, tables },
      { status: ok ? 200 : 503 }
    )
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        startedAt,
        env_ok,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    )
  }
}
