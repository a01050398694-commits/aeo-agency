import Link from "next/link"
import { AGENCY } from "@/lib/agency/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

const DELIVERABLES = [
  "Schema.org 풀세트 마크업 (Organization · Product · FAQPage · Article · Review)",
  "자체 사이트 구축 (Next.js + Vercel, 도메인 무료)",
  "Wikidata 엔티티 등록 + sameAs 연결",
  "OpenStreetMap POI 등록 (로컬 비즈니스)",
  "Tistory + Medium + Hashnode 멀티 도메인 분산 콘텐츠",
  "Pinterest 보드 (사진 SEO)",
  "GSC + Bing Webmaster + Naver Webmaster 등록",
  "IndexNow 즉시 인덱싱 푸시",
  "매체 어프로치 (디에디트 / 세시간전 / 플래텀 / 매거진B 등)",
  "Gemini/ChatGPT/Perplexity 답변 인용 모니터링 (Ahrefs Brand Radar)",
  "주간 보고서 PDF + 이메일 자동 발송",
  "AI Overview 인용 스크린샷 자동 저장",
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Services</p>
        <h1 className="text-4xl font-semibold">서비스</h1>
        <p className="text-muted-foreground max-w-2xl">
          3단계로 나뉜 패키지. 무료 진단부터 시작해 결과 보고 확장.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {AGENCY.services.map((s, i) => (
          <Card key={s.title} className={i === 1 ? "border-foreground" : undefined}>
            <CardHeader>
              <Badge variant={i === 0 ? "outline" : i === 1 ? "default" : "secondary"}>
                {i === 0 ? "1단계 — 진단" : i === 1 ? "2단계 — 파일럿" : "3단계 — 운영"}
              </Badge>
              <CardTitle className="text-lg mt-2">{s.title}</CardTitle>
              <CardDescription className="font-mono text-xl text-foreground">{s.price}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/80 leading-relaxed">{s.desc}</p>
              <Link href="/agency/contact" className="text-sm underline hover:opacity-70 block pt-2">
                {s.cta} →
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">제공 산출물 (파일럿/운영 패키지)</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DELIVERABLES.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm">
              <span className="text-foreground/40 mt-0.5">●</span>
              <span className="text-foreground/80">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">KPI 보장</h2>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="font-medium">계약서에 명시되는 측정 가능한 약속:</p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>• <b>30일 내</b>: 카테고리 메인 쿼리 1개 이상에서 AI 답변 인용 진입</li>
              <li>• <b>90일 내</b>: SOV(Share of Voice) 0% → 5~15% (업종별 조건부)</li>
              <li>• <b>180일 내</b>: 매체 게재 1건 이상 (디에디트/플래텀 등) 또는 환불</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2 border-t mt-3">
              * KPI 미달 시 해당 월 환불 또는 무료 1개월 연장 (계약서 명시)
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">최적 업종 (검증 데이터 기반)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { t: "B2B SaaS (한국 + 외국 진출)", s: 87 },
            { t: "한국 전문직 (세무 · 노무 · IT)", s: 86 },
            { t: "한국 진출 외국 소프트웨어", s: 86 },
            { t: "헬스케어 (미용 · 비급여)", s: 76 },
            { t: "온라인 강의 / 부트캠프", s: 72 },
            { t: "비교 · 리뷰 미디어", s: 71 },
          ].map((x) => (
            <Card key={x.t}>
              <CardContent className="flex items-center justify-between py-4">
                <span className="text-sm font-medium">{x.t}</span>
                <Badge variant="outline" className="font-mono">{x.s}/100</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          * 점수 = AI 노출 + 클릭 + 매출 전환 + CLI 자동화 + 한국 시장 적합도 (각 20점).
          데이터 출처: Ahrefs (146M SERPs), Conductor, Previsible, OpenSurvey 2025~2026.
        </p>
      </section>
    </div>
  )
}
