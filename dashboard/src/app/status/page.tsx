import { SovLineChart } from "@/components/sov-line-chart"
import Link from "next/link"

export const dynamic = "force-static"
export const revalidate = false

type SovRow = {
  client_slug: string
  measured_date: string
  engine: string
  queries_total: number
  queries_success: number
  cited_us: number
  sov_percent: string | number
}

async function fetchSovData(): Promise<SovRow[]> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) return []
  try {
    const r = await fetch(
      `${url}/rest/v1/sov_measurements?select=*&order=measured_date.asc&engine=eq.gpt-4o-mini-search-preview`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    )
    if (!r.ok) return []
    return await r.json()
  } catch {
    return []
  }
}

const CLIENT_INFO: Record<string, { name: string; emoji: string; pageHref: string }> = {
  "thebom-tax": {
    name: "세무법인 더봄",
    emoji: "💼",
    pageHref: "/pro/thebom-tax/",
  },
  "mangwon-roughrough": {
    name: "러프러프 망원점",
    emoji: "🥐",
    pageHref: "/r/rufruf/",
  },
}

export default async function StatusPage() {
  const all = await fetchSovData()
  const byClient = new Map<string, SovRow[]>()
  for (const r of all) {
    if (!byClient.has(r.client_slug)) byClient.set(r.client_slug, [])
    byClient.get(r.client_slug)!.push(r)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">실시간 SOV 추적</p>
        <h1 className="text-3xl font-semibold">AEO 케이스 스터디 — 30일 변화</h1>
        <p className="text-sm text-muted-foreground">
          매일 03:00 KST에 ChatGPT(gpt-4o-mini-search-preview)로 클라이언트별 80개 검색어
          측정 → 답변/citations에 우리가 인용된 비율(SOV). 사이트 라이브 후 첫 30일 추적.
        </p>
        <p className="text-xs text-muted-foreground">
          엔진: ChatGPT (Gemini는 free quota 제약으로 보조). 데이터 출처: Supabase 자동 적재.
        </p>
      </header>

      {Array.from(byClient.entries()).map(([slug, rows]) => {
        const info = CLIENT_INFO[slug] ?? { name: slug, emoji: "📊", pageHref: "/" }
        const day0 = rows[0]
        const latest = rows[rows.length - 1]
        const day0Sov = Number(day0?.sov_percent ?? 0)
        const latestSov = Number(latest?.sov_percent ?? 0)
        const delta = latestSov - day0Sov
        const deltaSign = delta > 0 ? "+" : ""
        const deltaColor = delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-foreground/60"

        return (
          <section key={slug} className="space-y-4 border-t pt-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold">
                {info.emoji} {info.name}
              </h2>
              <Link
                href={info.pageHref}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                사이트 보기 →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="border rounded-md p-3">
                <div className="text-xs text-muted-foreground">Day 0 (시작)</div>
                <div className="text-2xl font-semibold">{day0Sov.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">{day0?.measured_date}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-xs text-muted-foreground">최신</div>
                <div className="text-2xl font-semibold">{latestSov.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">{latest?.measured_date}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-xs text-muted-foreground">변화 (Δ)</div>
                <div className={`text-2xl font-semibold ${deltaColor}`}>
                  {deltaSign}{delta.toFixed(2)}%p
                </div>
                <div className="text-xs text-muted-foreground">{rows.length}일 측정</div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <SovLineChart
                data={rows.map((r) => ({
                  client_slug: r.client_slug,
                  measured_date: r.measured_date,
                  sov_percent: Number(r.sov_percent),
                  cited_us: r.cited_us,
                  queries_success: r.queries_success,
                  queries_total: r.queries_total,
                  engine: r.engine,
                })) as never[]}
                height={240}
              />
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer text-foreground/70 hover:text-foreground">
                일별 상세 ({rows.length}건)
              </summary>
              <table className="w-full mt-3 text-xs">
                <thead className="text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2">날짜</th>
                    <th className="text-right py-2">측정 80쿼리 중 인용</th>
                    <th className="text-right py-2">SOV</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice().reverse().map((r) => (
                    <tr key={r.measured_date} className="border-b">
                      <td className="py-2 font-mono">{r.measured_date}</td>
                      <td className="text-right py-2">{r.cited_us}/{r.queries_success}</td>
                      <td className="text-right py-2 font-semibold">{Number(r.sov_percent).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </section>
        )
      })}

      {byClient.size === 0 && (
        <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
          측정 데이터가 아직 없습니다. 매일 03:00 KST cron이 자동 측정합니다.
        </div>
      )}

      <footer className="text-xs text-muted-foreground border-t pt-6 space-y-1">
        <p>📅 데이터는 빌드 시점 기준. 매일 03:00 KST 자동 측정 + 빌드 시 자동 반영.</p>
        <p>🎯 30일 케이스 스터디 종료: 2026-07-25</p>
        <p>🤖 측정 도구: Gemini API + ChatGPT API (web search grounding)</p>
      </footer>
    </div>
  )
}
