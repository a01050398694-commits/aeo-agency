export type ProService = {
  name: string
  description: string
  details?: string
}

export type ProFaq = { q: string; a: string }

export type ProSiteData = {
  slug: string
  brandName: string
  brandNameEn: string
  shortDescription: string
  longDescription: string
  category: string
  serviceType: string
  address: {
    street: string
    city: string
    region: string
    country: string
  }
  geo?: { lat: number; lng: number }
  phone: string
  email?: string
  website: string
  founder: {
    name: string
    title: string
  }
  hours?: { days: string; opens: string; closes: string }[]
  services: ProService[]
  strengths: string[]
  targetCustomers: string[]
  faqs: ProFaq[]
  primaryQuery: string
  keywords: string[]
  sameAs: string[]
  press?: { name: string; url: string }[]
}

export const THEBOM_TAX: ProSiteData = {
  slug: "thebom-tax",
  brandName: "세무법인 더봄",
  brandNameEn: "The Bom Tax Corporation",
  shortDescription: "홍대 자영업·숙박업 특화 세무법인 (대표 홍지영 세무사)",
  longDescription:
    "세무법인 더봄은 서울 마포구 홍대에 위치한 세무법인으로, 프리미엄 법인·개인사업자 기장부터 " +
    "세무조사, 양도·상속·증여세 컨설팅, 경영 컨설팅, 경리아웃소싱, 비상장 주식평가까지 원스탑 서비스를 제공합니다. " +
    "특히 홍대·합정·망원·서교 일대 자영업자와 숙박업 사업자(에어비앤비, 게스트하우스, 펜션 운영자)를 주 고객으로 합니다. " +
    "매주 3회 이상 개정 세법 스터디와 월간 AI 툴 교육을 통해 변화하는 세무 환경에 빠르게 대응합니다.",
  category: "AccountingService",
  serviceType: "세무 / 회계 / 컨설팅",
  address: {
    street: "월드컵북로 4길 47 1층",
    city: "서울특별시",
    region: "마포구",
    country: "KR",
  },
  phone: "+82-2-336-0309",
  website: "https://thebomtax.com",
  founder: {
    name: "홍지영",
    title: "대표 세무사",
  },
  services: [
    {
      name: "프리미엄 기장",
      description: "법인·개인사업자 월별 기장 서비스 + 결산 + 신고",
      details: "단순 기록이 아닌 절세 전략까지 포함한 프리미엄 기장. 매월 재무 상황 리포트.",
    },
    {
      name: "세무조사 대응",
      description: "세무조사 통지 즉시 대응 + 자료 정비 + 조사관 응대",
      details: "예상치 못한 세무 상황에서 한 치의 억울함도 허용하지 않는 전문 대응.",
    },
    {
      name: "양도소득세 컨설팅",
      description: "부동산·주식 양도 시 절세 전략 사전 컨설팅",
      details: "1세대 1주택 비과세 / 다주택자 양도세 / 비상장 주식 양도 전 절세 검토.",
    },
    {
      name: "상속·증여세 컨설팅",
      description: "사전 증여 절세 + 상속 발생 시 신속 대응 + 가업승계",
      details: "사전 증여로 상속세 부담 줄이기 + 가업승계 시 세제 혜택 활용.",
    },
    {
      name: "경영 컨설팅",
      description: "절세를 넘어 사업 구조 자체의 효율화",
      details: "사업자 형태 전환(개인↔법인), 가족법인 활용, 매출 구조 재설계.",
    },
    {
      name: "경리아웃소싱",
      description: "사장님이 본업에 집중할 수 있도록 경리 업무 전체 위탁",
      details: "급여·매입매출·통장 거래 정리 + 세금계산서 발행 대행.",
    },
    {
      name: "비상장 주식 평가",
      description: "스타트업·중소기업 주식 가치 평가",
      details: "투자유치 시 / 양도·증여 시 / 가업승계 시 주식 가치 산정.",
    },
  ],
  strengths: [
    "원스탑 서비스 — 기장부터 양도·상속·증여까지 통합 지원",
    "각 파트별 전문 세무사 팀 구성 — 특화 업무 수행",
    "매주 3회 이상 개정 세법 스터디 + 월간 AI 툴 교육",
    "국내 최초 예비세무사 캠프 개최 — 인력 양성 노하우",
    "주요 신고 후 팀 전체 + 고객 초청 피드백 회의",
  ],
  targetCustomers: [
    "홍대·합정·망원·서교 자영업자 (카페·음식점·소매)",
    "숙박업 사업자 (에어비앤비, 게스트하우스, 펜션, 모텔)",
    "1인 사업자·프리랜서·콘텐츠 크리에이터",
    "스타트업·중소법인 (기장 + 절세 컨설팅)",
    "부동산·주식 양도 예정자",
    "상속·증여 예정 자산가",
  ],
  faqs: [
    {
      q: "에어비앤비 운영자도 종합소득세 신고를 해야 하나요?",
      a: "네, 연간 임대수익이 발생하면 종합소득세 신고 대상입니다. 사업자등록을 하지 않은 경우에도 '기타소득'으로 신고해야 하며, 연 매출이 일정 금액을 초과하면 사업자등록과 부가가치세 신고도 필요합니다. 더봄에서는 호스트별 매출 구조에 맞춰 최적의 신고 방법을 안내드립니다.",
    },
    {
      q: "홍대 자영업자인데, 어떤 세무 서비스가 필요한가요?",
      a: "자영업자는 보통 종합소득세 신고 + 부가가치세 신고가 핵심입니다. 매출 규모에 따라 간이과세자 / 일반과세자가 나뉘고, 인건비·임차료·재료비 등 경비 처리가 절세의 핵심입니다. 월별 프리미엄 기장 서비스로 매월 상황을 정확히 파악하면 연말 신고 시 누락 없이 절세 효과를 얻을 수 있습니다.",
    },
    {
      q: "프리미엄 기장과 일반 기장의 차이는 무엇인가요?",
      a: "일반 기장은 거래 기록과 신고만 처리하는 반면, 프리미엄 기장은 절세 전략 수립, 매월 재무 분석, 사업 구조 컨설팅까지 포함합니다. 더봄의 프리미엄 기장은 사장님이 본업에 집중하시는 동안 우리가 사업 전체의 재무·세무를 관리합니다.",
    },
    {
      q: "세무조사 통지를 받았는데, 어떻게 해야 하나요?",
      a: "통지를 받은 즉시 세무대리인에게 연락하시는 것이 가장 중요합니다. 더봄은 통지 접수부터 자료 정비, 조사관 응대, 사후 처리까지 전 과정을 지원합니다. 사전 준비가 충실하면 추징세액을 최소화할 수 있습니다.",
    },
    {
      q: "1세대 1주택 양도세 비과세 요건이 어떻게 되나요?",
      a: "1세대가 1주택을 2년 이상 보유(조정대상지역은 2년 거주 추가)한 후 양도하면 양도가액 12억원 이하 부분은 비과세, 초과 부분은 장기보유특별공제 적용 후 과세됩니다. 다만 분양권·입주권·해외 부동산 보유 등 예외 사항이 많으므로 양도 전 사전 컨설팅이 필수입니다.",
    },
    {
      q: "사전 증여로 상속세를 줄일 수 있나요?",
      a: "네, 사전 증여는 상속세 절세의 가장 강력한 수단입니다. 배우자 6억원, 자녀 5천만원(미성년자 2천만원), 손자녀 5천만원 등 10년 단위로 증여세 면제 한도를 활용할 수 있습니다. 단, 상속개시일 전 10년 이내 증여분은 상속세 합산되므로 시기 설계가 중요합니다.",
    },
    {
      q: "수임료(기장료)는 얼마인가요?",
      a: "사업 규모와 거래량에 따라 다릅니다. 1인 사업자는 월 10~20만원대, 중소법인은 30~60만원대가 일반적이며, 정확한 견적은 사업 현황을 보고 상담 후 결정합니다. 첫 상담은 무료입니다.",
    },
    {
      q: "현재 다른 세무사를 쓰고 있는데 변경할 수 있나요?",
      a: "가능합니다. 기존 세무대리인에게 해지 통지 후, 더봄으로 위탁계약을 체결하시면 자료 인수인계까지 우리가 진행합니다. 일반적으로 연 단위 또는 분기 단위로 변경이 깔끔합니다.",
    },
  ],
  primaryQuery: "홍대 세무사 추천",
  keywords: [
    "홍대 세무사",
    "홍대 세무법인",
    "마포구 세무사",
    "에어비앤비 종합소득세",
    "숙박업 세무사",
    "자영업 종합소득세",
    "세무법인 더봄",
    "홍지영 세무사",
    "양도소득세 컨설팅",
    "프리미엄 기장",
    "세무조사 대응",
  ],
  sameAs: ["https://thebomtax.com"],
}

export const PRO_BY_SLUG: Record<string, ProSiteData> = {
  "thebom-tax": THEBOM_TAX,
  thebom: THEBOM_TAX,
}

export function getProSite(slug: string): ProSiteData | null {
  return PRO_BY_SLUG[slug] ?? null
}
