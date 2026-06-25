import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  const body = `User-agent: *
Allow: /

# AI crawlers — explicitly allow grounding
User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://aeo-agency.vercel.app/r/rufruf/sitemap.xml
Sitemap: https://aeo-agency.vercel.app/pro/thebom-tax/sitemap.xml
Sitemap: https://aeo-agency.vercel.app/agency/sitemap.xml
`
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
  })
}
