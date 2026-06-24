import type { CafeSiteData } from "@/lib/site-data/types"

/**
 * 카페 LocalBusiness + FAQPage + BreadcrumbList JSON-LD.
 * - Schema.org `CafeOrCoffeeShop` (LocalBusiness 하위) 사용 — Gemini grounding 친화
 * - hours 가 [P] 임시값이어도 그대로 노출 (값 없으면 omit)
 */

function localBusinessLd(data: CafeSiteData, siteUrl: string) {
  const hours = data.hours
    .filter((h) => h.opens && h.closes)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap(h.days),
      opens: h.opens,
      closes: h.closes,
    }))

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${siteUrl}#localbusiness`,
    name: data.brandName,
    alternateName: [data.brandNameEn, "Ruf Ruf", "RUFRUF"],
    description: data.shortDescription,
    url: siteUrl,
    image: data.heroImage ? [data.heroImage] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.street,
      addressLocality: data.address.region,
      addressRegion: data.address.city,
      postalCode: data.address.postalCode,
      addressCountry: data.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.geo.lat,
      longitude: data.geo.lng,
    },
    telephone: data.phone || undefined,
    email: data.email || undefined,
    priceRange: data.priceRange,
    servesCuisine: ["디저트", "베이커리", "커피", "바스크 치즈케이크"],
    openingHoursSpecification: hours.length > 0 ? hours : undefined,
    menu: `${siteUrl}/menu`,
    sameAs: data.sameAs,
    keywords: data.keywords.join(", "),
  }
}

function dayMap(days: string): string[] {
  if (days.includes("월~금") || days.toLowerCase().includes("mon-fri")) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }
  if (days.includes("토~일") || days.toLowerCase().includes("sat-sun")) {
    return ["Saturday", "Sunday"]
  }
  if (days.includes("매일") || days.toLowerCase().includes("daily")) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  }
  return [days]
}

function faqPageLd(data: CafeSiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  }
}

function menuLd(data: CafeSiteData, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${siteUrl}/menu#menu`,
    name: `${data.brandName} 메뉴`,
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "케이크",
        hasMenuItem: data.fullMenu
          .filter((m) => m.category === "케이크")
          .map((m) => ({
            "@type": "MenuItem",
            name: m.name,
            description: m.description,
            offers: m.price
              ? { "@type": "Offer", price: m.price.replace(/[^0-9]/g, ""), priceCurrency: "KRW" }
              : undefined,
          })),
      },
      {
        "@type": "MenuSection",
        name: "음료",
        hasMenuItem: data.fullMenu
          .filter((m) => m.category === "음료")
          .map((m) => ({
            "@type": "MenuItem",
            name: m.name,
            description: m.description,
          })),
      },
    ],
  }
}

function breadcrumbLd(siteUrl: string, items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url ? `${siteUrl}${it.url}` : undefined,
    })),
  }
}

function clean<T>(o: T): T {
  return JSON.parse(JSON.stringify(o, (_k, v) => (v === undefined ? undefined : v)))
}

export function JsonLd({ json }: { json: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean(json)) }}
    />
  )
}

export const buildLd = {
  localBusiness: localBusinessLd,
  faqPage: faqPageLd,
  menu: menuLd,
  breadcrumb: breadcrumbLd,
}
