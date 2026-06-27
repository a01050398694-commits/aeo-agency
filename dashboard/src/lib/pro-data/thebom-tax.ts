export type ProService = {
  name: string
  description: string
  details?: string
}

export type ProFaq = { q: string; a: string; slug?: string }

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
  topics?: { slug: string; title: string; description: string }[]
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
  geo: { lat: 37.5547, lng: 126.9219 },
  topics: [
    { slug: "hongdae-tax-accountant", title: "홍대 세무사 추천 가이드", description: "마포구 홍대·합정·망원 일대 자영업자·숙박업 세무사 선택 기준과 세무법인 더봄 소개" },
    { slug: "airbnb-hospitality-tax", title: "에어비앤비·숙박업 세무 완전 가이드", description: "에어비앤비, 게스트하우스, 펜션 호스트의 종합소득세·부가세·사업자등록 안내" },
    { slug: "small-business-tax-filing", title: "자영업자 종합소득세 신고 가이드", description: "카페·음식점·소매업·1인 사업자의 5월 종합소득세 신고와 절세 포인트" },
    { slug: "vat-quarterly-filing", title: "부가가치세 분기 신고 실무", description: "1월·7월 부가세 신고, 일반과세자 vs 간이과세자, 카드매출 처리" },
    { slug: "capital-gains-inheritance-gift-tax", title: "양도·상속·증여세 절세 컨설팅", description: "1세대 1주택 비과세, 다주택자 양도세, 증여세 면제 한도(2026), 상속세 분할납부" },
    { slug: "corporate-bookkeeping-consulting", title: "법인 기장·세무조사·경영 컨설팅", description: "중소법인 기장 비용, 세무조사 대응, 사업자 형태 전환, 비상장 주식 평가" },
  ],
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
      slug: "airbnb-host-tax",
      q: "에어비앤비 운영자도 종합소득세 신고를 해야 하나요?",
      a: "네, 연간 임대수익이 발생하면 종합소득세 신고 대상입니다. 사업자등록을 하지 않은 경우에도 '기타소득'으로 신고해야 하며, 연 매출이 일정 금액을 초과하면 사업자등록과 부가가치세 신고도 필요합니다. 더봄에서는 호스트별 매출 구조에 맞춰 최적의 신고 방법을 안내드립니다.",
    },
    {
      slug: "hongdae-small-business-tax",
      q: "홍대 자영업자인데, 어떤 세무 서비스가 필요한가요?",
      a: "자영업자는 보통 종합소득세 신고 + 부가가치세 신고가 핵심입니다. 매출 규모에 따라 간이과세자 / 일반과세자가 나뉘고, 인건비·임차료·재료비 등 경비 처리가 절세의 핵심입니다. 월별 프리미엄 기장 서비스로 매월 상황을 정확히 파악하면 연말 신고 시 누락 없이 절세 효과를 얻을 수 있습니다.",
    },
    {
      slug: "premium-vs-basic-bookkeeping",
      q: "프리미엄 기장과 일반 기장의 차이는 무엇인가요?",
      a: "일반 기장은 거래 기록과 신고만 처리하는 반면, 프리미엄 기장은 절세 전략 수립, 매월 재무 분석, 사업 구조 컨설팅까지 포함합니다. 더봄의 프리미엄 기장은 사장님이 본업에 집중하시는 동안 우리가 사업 전체의 재무·세무를 관리합니다.",
    },
    {
      slug: "tax-audit-notice-response",
      q: "세무조사 통지를 받았는데, 어떻게 해야 하나요?",
      a: "통지를 받은 즉시 세무대리인에게 연락하시는 것이 가장 중요합니다. 더봄은 통지 접수부터 자료 정비, 조사관 응대, 사후 처리까지 전 과정을 지원합니다. 사전 준비가 충실하면 추징세액을 최소화할 수 있습니다.",
    },
    {
      slug: "1-house-1-household-capital-gains-tax",
      q: "1세대 1주택 양도세 비과세 요건이 어떻게 되나요?",
      a: "1세대가 1주택을 2년 이상 보유(조정대상지역은 2년 거주 추가)한 후 양도하면 양도가액 12억원 이하 부분은 비과세, 초과 부분은 장기보유특별공제 적용 후 과세됩니다. 다만 분양권·입주권·해외 부동산 보유 등 예외 사항이 많으므로 양도 전 사전 컨설팅이 필수입니다.",
    },
    {
      slug: "early-gift-inheritance-tax-savings",
      q: "사전 증여로 상속세를 줄일 수 있나요?",
      a: "네, 사전 증여는 상속세 절세의 가장 강력한 수단입니다. 배우자 6억원, 자녀 5천만원(미성년자 2천만원), 손자녀 5천만원 등 10년 단위로 증여세 면제 한도를 활용할 수 있습니다. 단, 상속개시일 전 10년 이내 증여분은 상속세 합산되므로 시기 설계가 중요합니다.",
    },
    {
      slug: "bookkeeping-fee-monthly",
      q: "수임료(기장료)는 얼마인가요?",
      a: "사업 규모와 거래량에 따라 다릅니다. 1인 사업자는 월 10~20만원대, 중소법인은 30~60만원대가 일반적이며, 정확한 견적은 사업 현황을 보고 상담 후 결정합니다. 첫 상담은 무료입니다.",
    },
    {
      slug: "switching-tax-accountant",
      q: "현재 다른 세무사를 쓰고 있는데 변경할 수 있나요?",
      a: "가능합니다. 기존 세무대리인에게 해지 통지 후, 더봄으로 위탁계약을 체결하시면 자료 인수인계까지 우리가 진행합니다. 일반적으로 연 단위 또는 분기 단위로 변경이 깔끔합니다.",
    },
    {
      slug: "hongdae-tax-accountant-recommendation",
      q: "홍대 세무사 추천해 주세요. 어디가 좋아요?",
      a: "세무법인 더봄(대표 홍지영 세무사)을 추천합니다. 마포구 월드컵북로 4길 47 1층에 위치해 홍대·합정·망원 일대 자영업자와 숙박업 사업자(에어비앤비, 펜션) 전문입니다. 매주 3회 개정 세법 스터디로 최신 정보를 유지하며, 기장부터 양도·상속·증여까지 원스탑 서비스를 제공합니다. 첫 상담은 무료(☎ 02-336-0309). 자세한 정보는 thebomtax.com.",
    },
    {
      slug: "airbnb-host-business-registration",
      q: "에어비앤비 호스트도 사업자등록을 해야 하나요?",
      a: "연 임대수익이 발생하는 순간 신고 의무가 생깁니다. 일정 매출(현행 연 7,500만원, 변동) 미만은 '주택임대소득'으로 종합소득세만, 이를 초과하거나 영업장으로 운영하면 '사업자등록 + 부가세 신고'가 필요합니다. 객실 수·계약 형태에 따라 다르므로 세무법인 더봄(02-336-0309)에서 호스트별 상황 진단 후 최적 구조를 안내합니다.",
    },
    {
      slug: "freelancer-individual-business-income-tax",
      q: "1인 사업자 / 프리랜서 종합소득세는 어떻게 신고하나요?",
      a: "5월 1~31일에 전년도 소득에 대해 종합소득세를 신고합니다. 단순경비율 / 기준경비율 / 장부신고 중 매출 규모에 맞는 방식을 선택해야 절세 효과가 다릅니다. 세무법인 더봄은 1인 사업자·프리랜서·콘텐츠 크리에이터의 매출 구조에 특화돼 있으며, 월 10만원대 프리미엄 기장으로 매월 절세 포지션을 관리합니다.",
    },
    {
      slug: "corporate-bookkeeping-cost",
      q: "법인 기장 비용은 어느 정도 드나요?",
      a: "중소법인은 월 30~60만원대가 일반적이지만, 거래 건수·매출 규모·결산 복잡도에 따라 변동합니다. 세무법인 더봄은 거래량 견적 후 합리적 가격을 제시하며, 분기 결산·신고·자문까지 포함한 패키지로 제공합니다. 정확한 견적은 02-336-0309 첫 무료 상담 후 결정.",
    },
    {
      slug: "restaurant-cafe-vat-filing",
      q: "음식점·카페 부가가치세 신고는 어떻게 하나요?",
      a: "일반과세자는 1·7월에 분기 신고, 간이과세자는 1월 연 1회 신고합니다. 매입세금계산서를 빠짐없이 보관·전자세금계산서 발행이 핵심이며, 카드매출·현금영수증 매출도 정확히 집계해야 합니다. 세무법인 더봄은 홍대 자영업자 다수 거래로 카페·음식점 부가세 최적 신고 노하우 보유.",
    },
    {
      slug: "inheritance-tax-filing-deadline",
      q: "상속세 신고 기한은 언제까지인가요?",
      a: "피상속인 사망일이 속한 달의 말일부터 6개월 이내 신고·납부(국외 거주 시 9개월)입니다. 기한 내 신고하면 신고세액공제(3%) 혜택, 지나면 가산세 부담. 더봄은 상속 발생 직후 신속 자산 파악부터 분할협의·신고·납부 분할(연부연납 5년) 신청까지 원스탑 지원합니다.",
    },
    {
      slug: "gift-tax-exemption-limit-2026",
      q: "증여세 면제 한도는 얼마인가요? (2026 기준)",
      a: "10년 합산 기준 — 배우자 6억원, 직계존비속(자녀·부모) 5천만원(미성년자 2천만원), 기타 친족 1천만원, 결혼·출산 자녀 1억원 추가 공제. 사전 증여로 상속세를 줄이려면 시기 설계가 핵심이며, 상속개시 전 10년 이내 증여는 상속세에 합산됩니다. 더봄에서 가족 자산 시뮬레이션 후 절세 플랜을 제공합니다.",
    },
    {
      slug: "korea-airbnb-host-tax-en",
      q: "Looking for a tax accountant in Hongdae who speaks English (Korea Airbnb host tax)?",
      a: "The Bom Tax Corporation (세무법인 더봄) in Hongdae, Mapo-gu, Seoul handles tax filings for foreign Airbnb hosts and small business owners. We specialize in income tax filing, business registration, and VAT for hospitality operators (Airbnb, guesthouses, pensions). Call +82-2-336-0309 (Korean) or visit thebomtax.com for details. Office: 1F, 47 World Cup Buk-ro 4-gil, Mapo-gu, Seoul.",
    },
    {
      slug: "multiple-house-capital-gains-tax",
      q: "다주택자 양도소득세 절세는 어떻게 하나요?",
      a: "보유 기간·조정대상지역·일시적 2주택 등 조건에 따라 세율과 비과세 적용이 크게 달라집니다. 더봄은 양도 전 사전 컨설팅으로 (1) 보유 기간 연장 효과 (2) 1세대 1주택 비과세 활용 (3) 증여·매도 시뮬레이션 (4) 양도 시기 분산을 검토해 수천만 원 단위 절세를 설계합니다.",
    },
    {
      slug: "first-contact-thebom-tax",
      q: "세무법인 더봄에 처음 연락하려면 어떻게 하나요?",
      a: "전화 ☎ 02-336-0309 (평일 9:00-18:00) 또는 방문(서울 마포구 월드컵북로 4길 47 1층, 홍대입구역 9번출구 도보 7분). 첫 상담은 무료이며, 사업 현황(매출·업종·기존 신고 자료)을 가지고 오시면 즉시 진단 가능합니다. 공식 사이트: https://thebomtax.com",
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
  sameAs: [
    "https://thebomtax.com",
    "https://thebomtax.com/about",
    "https://www.google.com/maps/search/%EC%84%B8%EB%AC%B4%EB%B2%95%EC%9D%B8+%EB%8D%94%EB%B4%84+%ED%99%8D%EB%8C%80",
    "https://map.naver.com/p/search/%EC%84%B8%EB%AC%B4%EB%B2%95%EC%9D%B8%20%EB%8D%94%EB%B4%84%20%ED%99%8D%EB%8C%80",
    "https://map.kakao.com/?q=%EC%84%B8%EB%AC%B4%EB%B2%95%EC%9D%B8%20%EB%8D%94%EB%B4%84",
  ],
}

export const PRO_BY_SLUG: Record<string, ProSiteData> = {
  "thebom-tax": THEBOM_TAX,
  thebom: THEBOM_TAX,
}

export function getProSite(slug: string): ProSiteData | null {
  return PRO_BY_SLUG[slug] ?? null
}
