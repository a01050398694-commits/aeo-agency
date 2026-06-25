import Link from "next/link"
import { notFound } from "next/navigation"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JsonLd, buildLd } from "@/components/site/json-ld"

export const dynamic = "force-static"

export default async function SiteHome({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getSiteData(slug)
  if (!data) notFound()

  const siteUrl = `https://aeo-agency.vercel.app/r/${slug}`
  const base = `/r/${slug}`

  return (
    <>
      <JsonLd json={buildLd.localBusiness(data, siteUrl)} />
      <JsonLd json={buildLd.faqPage(data)} />
      <JsonLd json={buildLd.breadcrumb(siteUrl, [{ name: data.brandName }])} />

      {/* Hero */}
      <section className="border-b">
        <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24 space-y-6">
          <div className="space-y-3">
            <Badge variant="outline">{data.category}</Badge>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              {data.brandName}
            </h1>
            <p className="text-xl text-muted-foreground">
              {data.shortDescription}
            </p>
          </div>
          <p className="text-base leading-relaxed max-w-2xl text-foreground/80">
            {data.longDescription}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`${base}/menu`}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-90"
            >
              메뉴 보기 →
            </Link>
            <a
              href={data.naverPlaceUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center px-5 py-2.5 border rounded-md text-sm font-medium hover:bg-accent"
            >
              네이버 지도 ↗
            </a>
          </div>
        </div>
      </section>

      {/* Signatures */}
      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">시그니처</p>
          <h2 className="text-2xl font-semibold mt-1">대표 메뉴</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.signatures.map((m) => (
            <Card key={m.name}>
              <CardHeader>
                <CardTitle className="text-base">{m.name}</CardTitle>
                {m.price ? <CardDescription className="font-mono">{m.price}</CardDescription> : null}
              </CardHeader>
              {m.description ? (
                <CardContent className="text-sm text-foreground/70 leading-relaxed">
                  {m.description}
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      {/* Location quick */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-12 grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">위치</p>
            <h2 className="text-2xl font-semibold">{data.address.street}</h2>
            <p className="text-sm text-muted-foreground">
              {data.address.city} {data.address.region} · 망원역(6호선) 1번 출구 도보 5분
            </p>
            <div className="pt-2">
              <Link href={`${base}/location`} className="text-sm underline hover:text-foreground">
                상세 오시는길 →
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">영업시간</p>
            <ul className="text-sm space-y-1">
              {data.hours.map((h, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-muted-foreground">{h.days}</span>
                  <span className="font-mono">{h.opens} – {h.closes}</span>
                </li>
              ))}
            </ul>
            {data.hours.some((h) => h.note?.includes("[P]")) ? (
              <p className="text-[11px] text-muted-foreground">
                * 성수점 기준 참고 — 정확한 망원점 영업시간은 네이버 플레이스 확인
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Press */}
      {data.press.length > 0 ? (
        <section className="container mx-auto max-w-5xl px-4 py-16 space-y-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">매체</p>
          <h2 className="text-2xl font-semibold">언급된 곳</h2>
          <ul className="grid gap-3 sm:grid-cols-2 mt-4">
            {data.press.map((p) => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="block border rounded-lg p-4 hover:border-foreground/40 transition-colors"
                >
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.url}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: "rufruf" }, { slug: "rufruf-mangwon" }]
}
