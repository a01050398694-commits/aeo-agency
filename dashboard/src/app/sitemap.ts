import type { MetadataRoute } from "next"

const SITE = "https://a01050398694-commits.github.io/aeo-agency"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    "/",
    "/agency/",
    "/agency/about/",
    "/agency/services/",
    "/agency/pricing/",
    "/agency/case-studies/",
    "/agency/case-studies/aeo-agency-bootstrap/",
    "/agency/case-studies/rufruf-mangwon/",
    "/agency/contact/",
    "/pro/thebom-tax/",
    "/pro/thebom-tax/about/",
    "/pro/thebom-tax/services/",
    "/pro/thebom-tax/faq/",
    "/pro/thebom-tax/contact/",
    "/pro/thebom/",
    "/pro/thebom/about/",
    "/pro/thebom/services/",
    "/pro/thebom/faq/",
    "/pro/thebom/contact/",
    "/r/rufruf/",
    "/r/rufruf/menu/",
    "/r/rufruf/faq/",
    "/r/rufruf/location/",
    "/r/rufruf/contact/",
    "/r/rufruf-mangwon/",
    "/r/rufruf-mangwon/menu/",
    "/r/rufruf-mangwon/faq/",
    "/r/rufruf-mangwon/location/",
    "/r/rufruf-mangwon/contact/",
  ]
  return routes.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1.0 : p.endsWith("/faq/") ? 0.9 : 0.7,
  }))
}
