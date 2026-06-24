import { AGENCY } from "@/lib/agency/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">About</p>
        <h1 className="text-4xl font-semibold">소개</h1>
      </header>

      <section className="space-y-4">
        <p className="text-lg leading-relaxed">
          AEO Agency는 한국 시장에서 <b>ChatGPT · Gemini · Perplexity</b>의 답변에 인용되는 브랜드를 만드는 1인 에이전시입니다.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          전통 SEO는 검색 결과 1페이지를 노렸지만, AI 검색 시대에는 <b>AI가 직접 답하는 답변</b> 자체에 들어가야 합니다.
          Ahrefs 데이터 기준 AI Overview가 있는 쿼리의 유기 클릭은 61% 떨어졌고,
          한국에서 ChatGPT 사용률은 54.5%로 미국(29%)보다 높습니다.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          그래서 우리는 매일 자동으로 Gemini · ChatGPT · Perplexity 답변을 측정하고,
          Schema.org · Wikidata · 매체 어프로치로 클라이언트가 답변에 들어가는 비율(SOV)을 0%에서 30%+로 끌어올립니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">철학 — 솔직과 자동화</h2>
        <Card>
          <CardContent className="pt-6 space-y-3 text-sm">
            <p>
              <b>1. 거짓 보고 금지.</b> 측정 안 한 수치는 "확인 필요"로 명시. 효과 없으면 환불.
            </p>
            <p>
              <b>2. 출처 인용.</b> 모든 데이터 주장에 [출처: URL] 첨부. 모르면 "모릅니다" 라고 말함.
            </p>
            <p>
              <b>3. 풀자동화.</b> Claude Code + GitHub Actions가 측정·콘텐츠·보고를 자동. 사람은 전략과 미팅에만.
            </p>
            <p>
              <b>4. 진짜 효과.</b> AI 노출만 보지 않음. 클릭 → 매출 풀체인 추적.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">운영 지표 (현재)</h2>
        <ul className="space-y-2">
          {AGENCY.metrics.map((m) => (
            <li key={m.label} className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">{m.label}</span>
              <span className="font-mono font-medium">{m.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">기술 스택</h2>
        <div className="flex flex-wrap gap-2">
          {AGENCY.techStack.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">왜 1인 에이전시?</h2>
        <p className="text-foreground/80 leading-relaxed">
          AEO 작업은 <b>측정 · 콘텐츠 · 게재 · 보고</b> 전 과정이 자동화됩니다.
          큰 에이전시는 인건비 때문에 월 1,000만원+ 받지만, 1인 자동화는 그 1/4 가격에 동일 결과.
          5~10 클라이언트 동시 운영해도 운영자는 하루 1~2시간만 들어갑니다.
        </p>
      </section>
    </div>
  )
}
