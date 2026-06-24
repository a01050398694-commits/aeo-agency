/**
 * Supabase 클라이언트 (서버 컴포넌트 / API 라우트)
 * - service_role 키 사용 — RLS 우회, 모든 데이터 접근
 * - 절대 클라이언트로 노출하지 말 것 (NEXT_PUBLIC_ 금지)
 */
import { createClient as createSupaClient } from "@supabase/supabase-js"

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase service client 초기화 실패: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 누락. " +
        ".env.local 확인 필요."
    )
  }

  return createSupaClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
