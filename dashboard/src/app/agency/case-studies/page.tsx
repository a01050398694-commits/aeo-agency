import Link from "next/link"
import { CASE_STUDIES } from "@/lib/case-studies/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Case Studies</p>
        <h1 className="text-4xl font-semibold">실제 사례</h1>
        <p className="text-muted-foreground max-w-2xl">
          진행 중인 클라이언트 + 자사 시스템 구축 사례 — 모든 데이터 실측·자동 측정.
        </p>
      </header>

      <section className="space-y-4">
        {CASE_STUDIES.map((c) => (
          <Link key={c.slug} href={`/agency/case-studies/${c.slug}`}>
            <Card className="hover:border-foreground/40 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{c.industry}</Badge>
                  <Badge variant={c.status === "completed" ? "success" : "warning"}>
                    {c.status === "completed" ? "완료" : "진행 중"}
                  </Badge>
                  <Badge variant="secondary">{c.duration}</Badge>
                </div>
                <CardTitle className="text-2xl mt-2">{c.title}</CardTitle>
                <CardDescription>{c.hero}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3 pt-2 border-t mt-2">
                {c.results.slice(0, 3).map((r) => (
                  <div key={r.metric}>
                    <p className="text-xs text-muted-foreground">{r.metric}</p>
                    <p className="text-xl font-mono font-semibold">{r.value}</p>
                  </div>
                ))}
              </CardContent>
              <CardContent className="text-sm text-foreground/60 hover:text-foreground">
                전체 사례 보기 →
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="space-y-4 pt-8 border-t">
        <h2 className="text-xl font-semibold">참고 — 글로벌 AEO 사례</h2>
        <ul className="space-y-3 text-sm text-foreground/80">
          <li className="border-l-2 pl-3">
            <b>리드젠랩 Inline AI</b> — 한국 B2B SaaS. 광고비 0원으로 MRR 3,000만원 달성 (AEO 단독).{" "}
            <a href="https://lead-gen.team/case/inline-ai-use-case/" target="_blank" rel="noopener" className="underline">출처</a>
          </li>
          <li className="border-l-2 pl-3">
            <b>Webflow</b> — ChatGPT 트래픽 전환율 24% (Google 대비 6배).{" "}
            <a href="https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/" target="_blank" rel="noopener" className="underline">출처</a>
          </li>
          <li className="border-l-2 pl-3">
            <b>Discovered Labs</b> — AEO 4주 만에 AI 레퍼럴 트라이얼 550 → 2,300+ (4배).{" "}
            <a href="https://discoveredlabs.com/blog/how-to-leverage-claude-code-for-aeo-geo-optimization" target="_blank" rel="noopener" className="underline">출처</a>
          </li>
        </ul>
      </section>
    </div>
  )
}
