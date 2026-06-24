import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const base = "https://aeo-agency.vercel.app/agency"
  const today = new Date().toISOString().slice(0, 10)
  const paths = ["", "/services", "/case-studies", "/pricing", "/about", "/contact"]
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  })
}
