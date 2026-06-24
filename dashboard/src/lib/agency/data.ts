export const AGENCY = {
  name: "AEO Agency",
  tagline: "Gemini · ChatGPT · Perplexity 답변에 인용되는 브랜드를 만듭니다",
  description:
    "AI 검색 시대, 'AI가 추천하는 브랜드'가 매출의 50%를 가져갑니다. " +
    "Claude Code + GitHub Actions 풀자동화로 한국 브랜드의 LLM 답변 인용률(SOV)을 0% → 30%+로 끌어올리는 1인 에이전시입니다.",
  founder: {
    name: "운영자",
    email: "a01050398694@gmail.com",
    role: "Founder & AEO Engineer",
  },
  services: [
    {
      title: "AEO 베이스라인 진단",
      desc: "ChatGPT / Gemini / Perplexity 답변에 귀사 브랜드가 얼마나 나오는지 측정 + 30/60/90일 개선 액션 도출. 무료 1페이지 진단 PDF 제공.",
      price: "무료",
      cta: "진단 신청",
    },
    {
      title: "AEO 풀패키지 (3개월 파일럿)",
      desc: "자체 사이트 Schema 풀세트 + Wikidata/OSM 엔티티 등록 + 멀티 도메인 콘텐츠 분산 + 매체 어프로치 + Gemini/ChatGPT 인용 측정 주간 보고",
      price: "월 250만원",
      cta: "상담 요청",
    },
    {
      title: "AEO 운영 (장기)",
      desc: "파일럿 결과 기반 12개월 운영. KPI: 카테고리 쿼리 SOV 30%+ 도달 또는 환불. 콘텐츠 자동 생성·게재·갱신, 매체 회신 응대까지.",
      price: "월 400~600만원",
      cta: "견적 요청",
    },
  ],
  cases: [
    {
      slug: "rufruf-mangwon",
      title: "망원 러프러프 — 망원동 디저트 카페",
      summary:
        "Gemini '망원카페 추천' 답변에 0건 인용 → 30일 후 SOV 측정 진행 중",
      bullets: [
        "베이스라인: 80쿼리 측정 (성공 20건 중 0건 인용)",
        "전략: Schema.org 풀세트 + 자체 사이트 + 매체 어프로치 (디에디트/세시간전 콜드메일)",
        "검색엔진 인덱싱: IndexNow + Wikidata + OSM",
      ],
      url: "/r/rufruf",
    },
  ],
  faq: [
    {
      q: "AEO가 뭔가요? SEO와 다른가요?",
      a: "AEO(Answer Engine Optimization)는 ChatGPT/Gemini/Perplexity 같은 AI가 답변을 생성할 때 우리 브랜드를 인용하도록 최적화하는 작업입니다. 전통 SEO는 검색 순위를 올리는 데 집중하지만, AEO는 'AI가 직접 답하는 답변'에 들어가는 것이 목표입니다. Ahrefs 데이터에 따르면 AI Overview가 있는 쿼리의 유기 CTR이 61% 하락한 대신, AI에 인용된 브랜드의 클릭은 35~91% 증가했습니다.",
    },
    {
      q: "한국 시장에서 효과 있나요?",
      a: "있습니다. OpenSurvey 2026 데이터에 따르면 한국인의 54.5%가 ChatGPT를 사용하고 Gemini 사용률이 9.5% → 28.9%로 3배 증가했습니다. 다만 업종별로 효과 차이가 큽니다. B2B SaaS / 전문직(세무·노무) / 정보 미디어가 가장 효과적이고, F&B 로컬은 천장이 25~30%입니다.",
    },
    {
      q: "효과를 어떻게 증명하나요?",
      a: "(1) 매일 자동 측정 — Gemini API + Ahrefs Brand Radar로 답변 인용 횟수 추적. (2) Before/After SOV 비교 데이터. (3) GSC 브랜드 쿼리 임프레션 추이. (4) AI Overview 인용 스크린샷. 계약서에 KPI 명시 — 30일 내 카테고리 쿼리 1개 이상에서 답변 인용 진입 보장. 미달 시 환불 또는 무료 연장.",
    },
    {
      q: "권한이나 인증을 우리 측에서 줘야 하나요?",
      a: "필수 아닙니다. 자체 사이트 + Wikidata + 매체 어프로치만으로 SOV 5~15% 도달 가능. 다이닝코드/네이버 스마트플레이스 등 권한 받으시면 25~30%까지 가능. B2B SaaS는 권한 없이도 30%+ 가능 (G2/Capterra 등록만으로).",
    },
    {
      q: "왜 1인 운영인가요?",
      a: "Claude Code + GitHub Actions 풀자동화로 5~10 클라이언트 동시 운영 가능. 측정·콘텐츠 생성·게재·보고 전 과정이 자동입니다. 사람이 하는 일은 전략 결정·매체 응대·클라이언트 미팅뿐. 인건비 0이라 가격이 낮습니다.",
    },
  ],
  metrics: [
    { label: "측정 엔진", value: "Gemini 2.5 Flash + Ahrefs Brand Radar" },
    { label: "자동화 인프라", value: "Claude Code + GitHub Actions" },
    { label: "측정 쿼리 / 클라이언트", value: "80개 / 일" },
    { label: "최대 동시 운영", value: "10 클라이언트" },
    { label: "보고 주기", value: "주간 PDF + 일일 알림" },
  ],
  techStack: [
    "Claude Code",
    "Next.js 16",
    "Supabase (Seoul)",
    "Vercel",
    "GitHub Actions",
    "Gemini API",
    "Ahrefs MCP",
    "Resend",
    "Notion",
  ],
}
