/**
 * 클라이언트 공개 사이트 데이터 타입 — /r/[slug] 라우트가 소비.
 * 추후 Supabase clients.site_data jsonb 로 이전 예정.
 */
export type CafeMenuItem = {
  name: string
  description?: string
  price?: string
  category?: string
}

export type CafeFaq = {
  q: string
  a: string
}

export type CafeReview = {
  source: string
  quote: string
  url?: string
}

export type CafeSiteData = {
  slug: string
  brandName: string
  brandNameEn: string
  shortDescription: string
  longDescription: string
  category: string
  address: {
    street: string
    city: string
    region: string
    country: string
    postalCode?: string
  }
  geo: { lat: number; lng: number }
  phone?: string
  email?: string
  hours: {
    days: string
    opens: string
    closes: string
    note?: string
  }[]
  priceRange: string
  signatures: CafeMenuItem[]
  fullMenu: CafeMenuItem[]
  faqs: CafeFaq[]
  reviews: CafeReview[]
  sameAs: string[]
  primaryQuery: string
  keywords: string[]
  naverPlaceUrl: string
  socials: {
    instagram?: string
    blog?: string
  }
  press: { name: string; url: string; date?: string }[]
  // 이미지는 추후 Higgsfield로 생성 — 우선 placeholder
  heroImage?: string
}
