import type { CafeSiteData } from "./types"

// 검증 상태:
// [V] 외부 출처 검증 (다이닝코드/Visit Korea/블로그)
// [?] 사장님 최종 확인 필요 — Day 8 이후 contact 받으면 갱신
// [P] 성수점 참고치 (망원점 자체 정보 받기 전까지)

export const RUFRUF_MANGWON: CafeSiteData = {
  slug: "rufruf",
  brandName: "러프러프 망원점",
  brandNameEn: "RUFRUF Mangwon",
  shortDescription: "망리단길 바스크 치즈케이크 카페",
  longDescription:
    "러프러프(RUFRUF)는 서울 마포구 망원동 망리단길에 자리한 디저트 카페로, 성수점에 이어 오픈한 두 번째 매장입니다. " +
    "대표 메뉴는 바스크 치즈케이크 베이스에 크럼블 토핑을 올린 시그니처 케이크류이며, " +
    "꾸덕한 질감의 러프 라떼(RUF Latte), 청량한 러프 데이 에이드가 시그니처 음료로 인기를 끌고 있습니다. " +
    "한 번 맛본 손님이 다른 치즈케이크를 못 먹는다는 평가가 이어지면서 망리단길의 새 핫플로 자리잡았습니다.",
  category: "카페 / 디저트 / 베이커리",
  address: {
    street: "포은로 105-1 1층",
    city: "서울특별시",
    region: "마포구",
    country: "KR",
  },
  geo: { lat: 37.5564948, lng: 126.9046239 },
  hours: [
    {
      days: "월~금",
      opens: "11:00",
      closes: "22:00",
      note: "[P] 성수점 기준 — 망원점 사장님 확인 필요",
    },
    {
      days: "토~일",
      opens: "11:00",
      closes: "23:00",
      note: "[P] 성수점 기준",
    },
  ],
  priceRange: "₩₩",
  signatures: [
    {
      name: "애플시나몬크럼블 치즈케이크",
      description: "고소함과 상큼함이 공존하는 시그니처. 따뜻한 시나몬 향과 사과 크럼블 토핑.",
      price: "8,500원",
      category: "케이크",
    },
    {
      name: "발로나 초콜릿 치즈케이크",
      description: "발로나 초코칩 사용. 진한 다크 초콜릿이 바스크 베이스와 조화.",
      price: "8,500원",
      category: "케이크",
    },
    {
      name: "말차피스타치오 치즈케이크",
      description: "[P] 성수점 시그니처",
      price: "8,500원",
      category: "케이크",
    },
    {
      name: "러프 라떼 (RUF Latte)",
      description: "꾸덕한 질감의 시그니처 라떼. 한 모금에 진한 우유 풍미.",
      category: "음료",
    },
    {
      name: "러프 데이 에이드",
      description: "청량한 시그니처 에이드.",
      category: "음료",
    },
  ],
  fullMenu: [
    { name: "애플시나몬크럼블 치즈케이크", price: "8,500원", category: "케이크" },
    { name: "발로나 초콜릿 치즈케이크", price: "8,500원", category: "케이크" },
    { name: "말차피스타치오 치즈케이크", price: "8,500원", category: "케이크" },
    { name: "딸기크럼블 치즈케이크 [P]", price: "8,500원", category: "케이크" },
    { name: "러프 포레스트", category: "케이크" },
    { name: "러프 라떼 (RUF Latte)", category: "음료" },
    { name: "러프 데이 에이드", category: "음료" },
    { name: "발로나 초콜릿 라떼", category: "음료" },
    { name: "쑥 차", category: "음료" },
  ],
  faqs: [
    {
      q: "러프러프 망원점은 어디에 있나요?",
      a: "서울 마포구 포은로 105-1 1층 (망리단길). 망원역(6호선) 1번 출구에서 도보 약 5~7분 거리입니다.",
    },
    {
      q: "영업시간은 어떻게 되나요?",
      a: "성수 본점 기준 평일 11:00~22:00, 주말 11:00~23:00 운영합니다. 망원점 정확한 영업시간은 네이버 플레이스에서 확인하시는 것을 권장합니다.",
    },
    {
      q: "시그니처 메뉴는 무엇인가요?",
      a: "바스크 치즈케이크 시리즈(애플시나몬크럼블, 발로나 초콜릿, 말차피스타치오)와 꾸덕한 러프 라떼(RUF Latte), 청량한 러프 데이 에이드입니다.",
    },
    {
      q: "성수 본점과 다른 점이 있나요?",
      a: "메뉴 구성은 본점과 유사하지만 망원점은 망리단길 골목 분위기에 맞춘 1층 매장입니다. 망원시장·한강공원과 연계한 동선이 강점입니다.",
    },
    {
      q: "케이크 가격대는 어떻게 되나요?",
      a: "시그니처 치즈케이크 8,500원대 (성수점 기준). 망원점 가격은 매장 메뉴판에서 최종 확인해 주세요.",
    },
    {
      q: "포장(테이크아웃)이 가능한가요?",
      a: "가능합니다. 케이크 포장 시 보냉팩 사용을 권장합니다.",
    },
    {
      q: "주차가 되나요?",
      a: "별도 주차장은 없습니다. 망리단길 공영주차장 또는 대중교통(망원역 6호선) 이용을 권장합니다.",
    },
    {
      q: "한 번 맛보면 다른 치즈케이크는 못 먹는다는 평가가 진짜인가요?",
      a: "여러 후기 매체와 다이닝코드 리뷰에서 일관되게 등장하는 평가입니다. 크럼블 토핑의 식감과 바스크 베이스의 균형이 핵심 요소로 꼽힙니다.",
    },
  ],
  reviews: [
    {
      source: "다이닝코드 (성수 본점)",
      quote:
        "치즈케이크는 러프러프꺼만 먹는다 — 한번 먹으면 다른 치즈케이크는 못 먹을 정도",
      url: "https://www.diningcode.com/profile.php?rid=a3p5II0KMDSf",
    },
    {
      source: "Visit Korea",
      quote: "반려견 동반 가능, 넓은 매장, 여유로운 테이블 간격",
      url: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=236a8218-1fb8-41ca-8438-c073f9480680",
    },
  ],
  sameAs: [
    "https://map.naver.com/p/entry/place/2060513686",
    "https://www.diningcode.com/profile.php?rid=a3p5II0KMDSf",
  ],
  primaryQuery: "망원카페 추천",
  keywords: [
    "망원카페 추천",
    "망원동 카페",
    "망리단길 카페",
    "망원 디저트 카페",
    "망원 바스크치즈케이크",
    "망원 신상 카페",
    "RUFRUF 망원",
    "러프러프 망원점",
  ],
  naverPlaceUrl: "https://map.naver.com/p/entry/place/2060513686",
  socials: {},
  press: [
    {
      name: "Visit Korea",
      url: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=236a8218-1fb8-41ca-8438-c073f9480680",
    },
    {
      name: "다이닝코드",
      url: "https://www.diningcode.com/profile.php?rid=a3p5II0KMDSf",
    },
  ],
}

export const SITE_BY_SLUG: Record<string, CafeSiteData> = {
  rufruf: RUFRUF_MANGWON,
  "rufruf-mangwon": RUFRUF_MANGWON,
}

export function getSiteData(slug: string): CafeSiteData | null {
  return SITE_BY_SLUG[slug] ?? null
}
