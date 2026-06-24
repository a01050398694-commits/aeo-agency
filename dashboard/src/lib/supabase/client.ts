/**
 * Supabase 클라이언트 (브라우저용)
 * - anon 키 사용 — RLS로 보호됨
 * - 클라이언트 포털 /[clientSlug] 에서 public read 가능 (RLS 정책으로 slug 매칭만 허용)
 */
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
