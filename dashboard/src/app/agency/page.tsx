import Link from "next/link"
import { AGENCY } from "@/lib/agency/data"
import { JsonLd } from "@/components/site/json-ld"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

export default function AgencyHome() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: AGENCY.name,
    description: AGENCY.description,
    url: "https://aeo-agency.vercel.app/agency",
    email: AGENCY.founder.email,
    founder: { "@type": "Person", name: AGENCY.founder.name },
    knowsAbout: [
      "Answer Engine Optimization",
      "Generative Engine Optimization",
      "AI Search",
      "ChatGPT",
      "Gemini",
      "Perplexity",
      "Schema.org",
      "Wikidata",
    ],
  }

  return (
    <>
      <JsonLd json={orgLd} />

      <section className="border-b">
        <div className="container mx-auto max-w-5xl px-4 py-20 sm:py-28 space-y-6">
          <Badge variant="outline">1인 AEO 에이전시 · 한국</Badge>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            ChatGPT가 추천하는<br />브랜드를 만듭니다
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {AGENCY.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/agency/contact"
              className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium hover:opacity-90"
            >
              무료 베이스라인 진단 신청 →
            </Link>
            <Link
              href="/agency/case-studies"
              className="inline-flex items-center px-6 py-3 border rounded-md font-medium hover:bg-accent"
            >
              실제 사례 보기
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            현재 진단 무료 · 첫 미팅 30분 · 결과 미달 시 환불 또는 무료 연장
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">데이터로 검증된 사실</p>
          <h2 className="text-3xl font-semibold mt-2">왜 지금 AEO인가</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>전통 검색 CTR</CardDescription>
              <CardTitle className="text-4xl font-mono">-61%</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              AI Overview가 있는 쿼리. Seer Interactive 2025.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>AI 인용된 브랜드 클릭</CardDescription>
              <CardTitle className="text-4xl font-mono">+35~91%</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              유기/유료 클릭 모두 상승. Digital Bloom 2026.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>한국 ChatGPT 사용률</CardDescription>
              <CardTitle className="text-4xl font-mono">54.5%</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              미국 29%, 일본 14.8%. OpenSurvey 2025.12.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">서비스</p>
            <h2 className="text-3xl font-semibold mt-2">3가지 단계</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {AGENCY.services.map((s) => (
              <Card key={s.title}>
                <CardHeader>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription className="font-mono text-lg text-foreground">{s.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground/80 leading-relaxed">{s.desc}</p>
                  <Link
                    href="/agency/contact"
                    className="text-sm text-foreground underline hover:opacity-70"
                  >
                    {s.cta} →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">기술 스택</p>
          <h2 className="text-3xl font-semibold mt-2">풀자동화 인프라</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Claude Code + GitHub Actions가 매일 03:00 자동 측정, 매주 자동 보고서, 매월 자동 콘텐츠 리프레시.
            사람은 전략과 클라이언트 미팅에만 집중.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {AGENCY.techStack.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">자주 묻는 질문</p>
            <h2 className="text-3xl font-semibold mt-2">FAQ</h2>
          </div>
          <dl className="space-y-6">
            {AGENCY.faq.map((f, i) => (
              <div key={i} className="border-b pb-6">
                <dt className="font-semibold text-base mb-2">{f.q}</dt>
                <dd className="text-sm text-foreground/80 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-semibold">
          1분이면 베이스라인 측정 시작
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          귀사 카테고리에서 ChatGPT/Gemini가 누구를 추천하는지, 귀사는 어디 있는지 무료로 측정해 드립니다.
          PDF로 답변 + 30/60/90일 액션 플랜 함께 보내드립니다.
        </p>
        <Link
          href="/agency/contact"
          className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium"
        >
          무료 진단 신청 →
        </Link>
      </section>
    </>
  )
}
