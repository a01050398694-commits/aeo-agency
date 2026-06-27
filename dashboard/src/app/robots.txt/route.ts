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

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

# 한국 검색엔진
User-agent: Yeti
Allow: /

User-agent: NaverBot
Allow: /

User-agent: Daum
Allow: /

User-agent: Daumoa
Allow: /

Sitemap: https://a01050398694-commits.github.io/aeo-agency/sitemap.xml
`
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
  })
}
