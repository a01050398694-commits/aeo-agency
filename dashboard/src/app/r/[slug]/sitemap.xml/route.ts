import { NextResponse } from "next/server"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const data = getSiteData(slug)
  if (!data) {
    return new NextResponse("Not found", { status: 404 })
  }

  const base = `https://aeo-agency.vercel.app/r/${slug}`
  const today = new Date().toISOString().slice(0, 10)
  const paths = ["", "/menu", "/faq", "/location", "/contact"]

  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === "" ? "weekly" : "monthly"}</changefreq>
    <priority>${p === "" ? "1.0" : "0.7"}</priority>
  </url>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
