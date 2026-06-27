import type { MetadataRoute } from "next"
import { PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { SITE_BY_SLUG } from "@/lib/site-data/rufruf-mangwon"

const SITE = "https://a01050398694-commits.github.io/aeo-agency"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base = [
    "/",
    "/agency/",
    "/agency/about/",
    "/agency/services/",
    "/agency/pricing/",
    "/agency/case-studies/",
    "/agency/case-studies/aeo-agency-bootstrap/",
    "/agency/case-studies/rufruf-mangwon/",
    "/agency/contact/",
    "/status/",
  ]

  const proRoutes: string[] = []
  for (const [siteSlug, data] of Object.entries(PRO_BY_SLUG)) {
    proRoutes.push(`/pro/${siteSlug}/`)
    proRoutes.push(`/pro/${siteSlug}/about/`)
    proRoutes.push(`/pro/${siteSlug}/services/`)
    proRoutes.push(`/pro/${siteSlug}/faq/`)
    proRoutes.push(`/pro/${siteSlug}/contact/`)
    proRoutes.push(`/pro/${siteSlug}/guide/`)
    for (const f of data.faqs) {
      if (f.slug) proRoutes.push(`/pro/${siteSlug}/faq/${f.slug}/`)
    }
    for (const t of data.topics || []) {
      proRoutes.push(`/pro/${siteSlug}/topic/${t.slug}/`)
    }
  }

  const cafeRoutes: string[] = []
  for (const [siteSlug, data] of Object.entries(SITE_BY_SLUG)) {
    cafeRoutes.push(`/r/${siteSlug}/`)
    cafeRoutes.push(`/r/${siteSlug}/menu/`)
    cafeRoutes.push(`/r/${siteSlug}/faq/`)
    cafeRoutes.push(`/r/${siteSlug}/location/`)
    cafeRoutes.push(`/r/${siteSlug}/contact/`)
    cafeRoutes.push(`/r/${siteSlug}/guide/`)
    for (const f of data.faqs) {
      if (f.slug) cafeRoutes.push(`/r/${siteSlug}/faq/${f.slug}/`)
    }
  }

  return [...base, ...proRoutes, ...cafeRoutes].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1.0 : p.includes("/faq/") ? 0.8 : p.endsWith("/guide/") ? 0.85 : 0.7,
  }))
}
