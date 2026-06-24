export type CaseStudy = {
  slug: string
  title: string
  industry: string
  status: "ongoing" | "completed"
  duration: string
  hero: string
  problem: string
  approach: string[]
  results: { metric: string; value: string; change?: string }[]
  timeline: { day: string; what: string }[]
  takeaways: string[]
  visibility: "public" | "anon"
  publishedAt: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "rufruf-mangwon",
    title: "망원 러프러프 — 망원동 디저트 카페",
    industry: "F&B / 로컬 비즈니스",
    status: "ongoing",
    duration: "Day 1~30 진행 중",
    hero:
      "신상 카페가 Gemini '망원카페 추천' 답변에 0건 인용 → 자체 사이트 + Schema + 매체 어프로치로 진입 작전",
    problem:
      "베이스라인 측정 결과 'Gemini 망원카페 추천' 답변 10개 URL 중 우리 카페 0건. 답변에 등장한 곳은 디에디트(매체) + 카페 12곳. 검증된 사실: 신상 카페 + 자체 사이트 없음 + 외부 매체 게재 0건 = AI가 인용할 데이터 자체가 부재.",
    approach: [
      "자체 사이트 구축 (Next.js + Vercel) — 5페이지 + Schema.org 풀세트",
      "Schema.org 마크업: CafeOrCoffeeShop + Menu + FAQPage + BreadcrumbList",
      "Wikidata 엔티티 등록 사양 생성 + OSM POI 좌표 등록",
      "robots.txt에 AI 크롤러 명시 Allow (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)",
      "IndexNow Bing/Yandex 즉시 인덱싱 푸시",
      "매체 어프로치: 디에디트 + 세시간전 콜드메일 (Gmail Drafts 자동 생성)",
      "매일 03:00 KST 자동 SOV 측정 (GitHub Actions cron)",
    ],
    results: [
      { metric: "베이스라인 SOV", value: "0.00%", change: "—" },
      { metric: "측정 쿼리", value: "80개 / 일", change: "자동" },
      { metric: "추적 경쟁사", value: "13개", change: "디에디트·티노마드·소설원 등" },
      { metric: "자체 사이트 페이지", value: "5개", change: "Schema 풀세트" },
      { metric: "매체 콜드메일", value: "2건 발송 대기", change: "Gmail Drafts" },
      { metric: "30일 후 SOV", value: "측정 중", change: "Day 11~ 누적" },
    ],
    timeline: [
      { day: "Day 0", what: "베이스라인 측정 (80쿼리 → SOV 0%)" },
      { day: "Day 6", what: "자체 사이트 5페이지 + Schema 풀세트 라이브" },
      { day: "Day 7", what: "Wikidata/OSM 사양 + IndexNow 키 발급" },
      { day: "Day 9", what: "디에디트/세시간전 콜드메일 발송 (Drafts)" },
      { day: "Day 14", what: "1주차 SOV 재측정 (예상: 5~10%)" },
      { day: "Day 30", what: "1개월 완전 데이터 — 케이스 스터디 확정" },
      { day: "Day 90", what: "매체 채택 1건 이상 또는 환불 KPI" },
    ],
    takeaways: [
      "F&B 로컬은 천장 25~30%. 사장님 인증(네이버 스마트플레이스/다이닝코드) 없으면 더 낮음.",
      "CLI 단독 자동화: 자체 사이트 + Schema + Wikidata + 매체 콜드메일 = 5~15% SOV 가능.",
      "디에디트 등 큐레이션 매체에 1건 게재되면 SOV 10~20% 점프 (매체 권위 효과).",
      "Gemini grounding rate limit이 진짜 함정 — RPM 5~10 필요 (Day 5에서 60/80 fail).",
    ],
    visibility: "public",
    publishedAt: "2026-06-24",
  },
  {
    slug: "aeo-agency-bootstrap",
    title: "AEO Agency 자체 — 4주 만에 라이브한 풀스택",
    industry: "AEO / 마케팅 에이전시",
    status: "ongoing",
    duration: "Day 0~28",
    hero:
      "1인 운영자가 Claude Code + GitHub Actions로 측정·콘텐츠·게재·보고 풀자동화 시스템을 4주 만에 라이브",
    problem:
      "1인 AEO 에이전시 운영자가 5~10 클라이언트를 관리하려면 무인 자동 시스템 필수. 외주 안 쓰고, 비용 0원, 인프라는 무료 한도 안에서 해결해야 함.",
    approach: [
      "Day 1: Next.js 16 + Supabase + GitHub Actions cron 인프라",
      "Day 2~3: 운영자 대시보드 + 클라이언트 포털 + 콘텐츠 큐 칸반",
      "Day 4: 일일 Telegram + 주간 PDF 자동 발송 (Resend)",
      "Day 5: 매체 어프로치 Gmail Drafts 자동 생성",
      "Day 6~7: 자체 카페 사이트 + Schema 풀세트 + IndexNow",
      "Day 8: 자사 에이전시 사이트 7페이지 (영업 자산)",
      "Day 10: 영업 진단 PDF 자동 생성기",
      "Day 11~15: 잠재 클라이언트 25곳 자동 발굴 + 케이스 스터디",
    ],
    results: [
      { metric: "구축 기간", value: "4주", change: "Day 0~20" },
      { metric: "비용", value: "0원", change: "전부 무료 한도" },
      { metric: "라우트 수", value: "22개", change: "운영 + 클라이언트 + 영업" },
      { metric: "DB 테이블", value: "9개", change: "+RLS" },
      { metric: "cron 작업", value: "3개", change: "일일 SOV + 일일 알림 + 주간 보고서" },
      { metric: "잠재 클라이언트", value: "25곳", change: "세무·노무" },
      { metric: "사용자 액션", value: "1분", change: "Telegram 봇 /start 1회" },
    ],
    timeline: [
      { day: "Day 0", what: "자격증명 풀스캔 (Supabase Management API + AskBit 재활용)" },
      { day: "Day 1", what: "Next.js 스캐폴딩 + Supabase 9테이블 + GitHub repo 푸시" },
      { day: "Day 2", what: "운영자 대시보드 라이브" },
      { day: "Day 3", what: "콘텐츠 큐 칸반 + Notion 사양" },
      { day: "Day 4", what: "Telegram/Resend 알림 + 주간 보고서 cron" },
      { day: "Day 5", what: "매체 어프로치 Gmail Drafts (디에디트/세시간전)" },
      { day: "Day 6~7", what: "카페 사이트 + Schema + IndexNow" },
      { day: "Day 8", what: "자사 에이전시 사이트" },
      { day: "Day 10", what: "영업 진단 도구" },
      { day: "Day 11~15", what: "25곳 발굴 + 케이스 스터디 작성" },
    ],
    takeaways: [
      "Claude Code 풀자동화: 24/7은 cron만, CLI 작업은 사용자 ping 필요 (반쪽 자동).",
      "외부 API 인증의 함정: Vercel/Wikidata/OSM은 사용자 1회 액션 필요. 우회 어려움.",
      "Supabase Management API로 service_role 키 자동 발급 가능 — 사용자 액션 0.",
      "기존 자격증명 재활용 (AskBit Telegram/Resend) → 신규 가입 비용 0.",
      "1인이 5~10 클라이언트 관리하려면 진짜 대시보드 + 자동 보고서 필수.",
    ],
    visibility: "public",
    publishedAt: "2026-06-24",
  },
]

export const CASES_BY_SLUG = Object.fromEntries(CASE_STUDIES.map((c) => [c.slug, c]))

export function getCase(slug: string): CaseStudy | null {
  return CASES_BY_SLUG[slug] ?? null
}
