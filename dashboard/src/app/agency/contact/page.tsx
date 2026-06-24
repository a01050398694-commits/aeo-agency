import { AGENCY } from "@/lib/agency/data"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-static"

export default function ContactPage() {
  const mailto = `mailto:${AGENCY.founder.email}?subject=${encodeURIComponent("[AEO] 무료 베이스라인 진단 신청")}&body=${encodeURIComponent(
    `안녕하세요, AEO Agency 무료 진단을 신청합니다.\n\n` +
      `1. 회사명 / 도메인:\n` +
      `2. 업종 / 주요 제품:\n` +
      `3. 타깃 카테고리 쿼리 (예: "한국 인사관리 SaaS 추천"):\n` +
      `4. 현재 마케팅 채널:\n` +
      `5. 알고 싶은 것 (자유 기술):\n\n` +
      `회신 받을 이메일: \n전화 (선택): \n`
  )}`

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Contact</p>
        <h1 className="text-4xl font-semibold">무료 베이스라인 진단</h1>
        <p className="text-muted-foreground max-w-2xl">
          귀사 카테고리에서 ChatGPT/Gemini가 누구를 추천하는지, 귀사는 어디 있는지 측정해 드립니다.
          1페이지 PDF + 액션 플랜 24~48시간 내 회신.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">이메일</p>
            <a
              href={mailto}
              className="text-xl font-mono underline hover:text-foreground/70"
            >
              {AGENCY.founder.email}
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              아래 양식이 자동으로 채워진 메일이 열립니다
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">진단 신청 시 알려주실 정보:</p>
            <ol className="space-y-1.5 text-sm text-foreground/80 list-decimal list-inside">
              <li>회사명 / 도메인</li>
              <li>업종 / 주요 제품·서비스</li>
              <li>타깃 카테고리 쿼리 (예: "한국 인사관리 SaaS 추천")</li>
              <li>현재 마케팅 채널</li>
              <li>알고 싶은 것 (자유 기술)</li>
            </ol>
          </div>

          <div className="pt-4 border-t">
            <a
              href={mailto}
              className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium hover:opacity-90"
            >
              메일 양식 자동 채우기 →
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3 text-sm">
          <p className="font-semibold">진단 응답에 포함되는 것</p>
          <ul className="space-y-1 text-foreground/80">
            <li>● ChatGPT / Gemini / Perplexity 답변에 귀사 등장 여부</li>
            <li>● 그 자리를 차지한 경쟁사 (TOP 5)</li>
            <li>● 귀사 사이트 Schema/엔티티 갭 분석</li>
            <li>● 30/60/90일 액션 플랜</li>
            <li>● 적합 패키지 추천 + 견적</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
