import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

const TIERS = [
  {
    name: "진단",
    price: "무료",
    badge: "무료",
    badgeVariant: "outline" as const,
    description: "ChatGPT/Gemini 답변에 귀사가 있는지 측정 + PDF 진단서",
    features: [
      "카테고리 쿼리 30개 자동 측정",
      "AI 답변에 등장하는 경쟁사 분석",
      "Schema/사이트 갭 진단",
      "30/60/90일 액션 플랜",
      "1페이지 PDF 보고서",
    ],
    cta: "무료 진단 신청",
    highlight: false,
  },
  {
    name: "파일럿",
    price: "월 250만원",
    badge: "3개월 시작",
    badgeVariant: "default" as const,
    description: "AEO 풀패키지 — Schema + 자체 사이트 + 매체 어프로치 + 측정 보고",
    features: [
      "Schema.org 풀세트 + 자체 사이트 (Vercel 호스팅)",
      "Wikidata + OSM 엔티티 등록",
      "Tistory + Medium 멀티 도메인 분산",
      "매체 어프로치 5건 (월)",
      "Gemini + ChatGPT + Perplexity 인용 측정",
      "주간 보고서 + 일일 알림",
      "콘텐츠 자동 생성 / 운영자 검토",
    ],
    cta: "파일럿 상담",
    highlight: true,
  },
  {
    name: "운영",
    price: "월 400~600만원",
    badge: "12개월 약정",
    badgeVariant: "secondary" as const,
    description: "장기 운영 + KPI 보장. 매체 채택 1건 이상 또는 환불",
    features: [
      "파일럿 모든 기능 +",
      "콘텐츠 매월 8편 자동 생성·게재",
      "매체 어프로치 20건 / 월",
      "AI Overview 인용 스크린샷 자동 보관",
      "Looker Studio 대시보드 (클라이언트 전용)",
      "분기 전략 리뷰 미팅",
      "180일 매체 게재 1건 보장 또는 환불",
    ],
    cta: "운영 견적",
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Pricing</p>
        <h1 className="text-4xl font-semibold">가격</h1>
        <p className="text-muted-foreground max-w-2xl">
          3단계 패키지. 진단은 무료, 파일럿부터 결제. KPI 미달 시 환불.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {TIERS.map((t) => (
          <Card key={t.name} className={t.highlight ? "border-foreground shadow-md" : undefined}>
            <CardHeader className="space-y-3">
              <Badge variant={t.badgeVariant}>{t.badge}</Badge>
              <CardTitle className="text-2xl">{t.name}</CardTitle>
              <p className="text-3xl font-mono font-semibold">{t.price}</p>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-foreground/40 mt-0.5">✓</span>
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/agency/contact"
                className={
                  t.highlight
                    ? "block w-full text-center py-2.5 bg-foreground text-background rounded-md font-medium hover:opacity-90"
                    : "block w-full text-center py-2.5 border rounded-md font-medium hover:bg-accent"
                }
              >
                {t.cta} →
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">자주 묻는 질문</h2>
        <Card>
          <CardContent className="pt-6 space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-1">결제 조건은?</p>
              <p className="text-foreground/80">월 선불. 신용카드 또는 계좌이체.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">계약 해지 가능?</p>
              <p className="text-foreground/80">파일럿 — 3개월 약정. 운영 — 12개월 약정, 6개월 후 해지 가능.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">환불 정책?</p>
              <p className="text-foreground/80">KPI 미달 시 해당 월 환불 또는 무료 연장.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">중간에 패키지 업그레이드 가능?</p>
              <p className="text-foreground/80">언제든. 차액 일할 정산.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
