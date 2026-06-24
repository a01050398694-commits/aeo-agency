import Link from "next/link"
import { AGENCY } from "@/lib/agency/data"
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
          진행 중인 클라이언트 — Before/After SOV 데이터 누적 중.
        </p>
      </header>

      <section className="space-y-6">
        {AGENCY.cases.map((c) => (
          <Card key={c.slug}>
            <CardHeader>
              <Badge variant="outline">진행 중 (Day 1~30)</Badge>
              <CardTitle className="text-2xl mt-2">{c.title}</CardTitle>
              <CardDescription>{c.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-foreground/80">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-foreground/40">●</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 pt-2">
                <Link
                  href={c.url}
                  className="text-sm underline hover:opacity-70"
                >
                  클라이언트 사이트 보기 ↗
                </Link>
                <Link
                  href={`/${c.slug}`}
                  className="text-sm underline hover:opacity-70"
                >
                  SOV 측정 포털 ↗
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
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
