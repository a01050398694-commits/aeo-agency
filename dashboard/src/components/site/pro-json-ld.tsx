import type { ProSiteData } from "@/lib/pro-data/thebom-tax"

export function buildProLd(data: ProSiteData, siteUrl: string) {
  return {
    accountingService: {
      "@context": "https://schema.org",
      "@type": ["AccountingService", "ProfessionalService", "LocalBusiness"],
      "@id": `${siteUrl}#service`,
      name: data.brandName,
      alternateName: [data.brandNameEn, "더봄세무"],
      description: data.shortDescription,
      url: siteUrl,
      mainEntityOfPage: data.website,
      sameAs: data.sameAs,
      telephone: data.phone,
      email: data.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: data.address.street,
        addressLocality: data.address.region,
        addressRegion: data.address.city,
        addressCountry: data.address.country,
      },
      ...(data.geo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: data.geo.lat,
              longitude: data.geo.lng,
            },
          }
        : {}),
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      priceRange: "₩₩₩",
      founder: {
        "@type": "Person",
        name: data.founder.name,
        jobTitle: data.founder.title,
        description: data.founder.bio,
        knowsAbout: data.founder.knowsAbout,
        knowsLanguage: ["ko", "en"],
        worksFor: {
          "@type": "Organization",
          name: data.brandName,
          url: data.website,
        },
        url: `${siteUrl}/founder`,
      },
      employee: {
        "@type": "Person",
        name: data.founder.name,
        jobTitle: data.founder.title,
      },
      serviceType: data.serviceType,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "세무 서비스",
        itemListElement: data.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description },
        })),
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "서울특별시 마포구 (홍대·합정·망원·서교)",
      },
      audience: data.targetCustomers.map((t) => ({
        "@type": "Audience",
        name: t,
      })),
      knowsAbout: data.keywords,
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumb: (items: { name: string; url?: string }[]) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.url ? `${siteUrl}${it.url}` : undefined,
      })),
    }),
  }
}

export function ProJsonLd({ json }: { json: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON.parse(JSON.stringify(json))) }}
    />
  )
}
