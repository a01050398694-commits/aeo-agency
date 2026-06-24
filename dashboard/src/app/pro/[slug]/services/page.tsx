import { notFound } from "next/navigation"
import { getProSite } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-static"

export default async function ProServices({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const siteUrl = `https://aeo-agency.vercel.app/pro/${slug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd json={ld.accountingService} />
      <ProJsonLd json={ld.breadcrumb([{ name: data.brandName, url: "" }, { name: "서비스", url: "/services" }])} />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Services</p>
          <h1 className="text-3xl font-semibold">서비스 7개</h1>
          <p className="text-sm text-muted-foreground">
            기장부터 양도·상속·증여, 세무조사 대응까지 원스탑.
          </p>
        </header>

        <div className="space-y-4">
          {data.services.map((s, i) => (
            <Card key={s.name}>
              <CardHeader>
                <CardDescription className="text-xs font-mono">{String(i + 1).padStart(2, "0")}</CardDescription>
                <CardTitle className="text-xl">{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-foreground/80">{s.description}</p>
                {s.details ? (
                  <p className="text-foreground/60 leading-relaxed">{s.details}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="pt-8 border-t">
          <h2 className="text-xl font-semibold mb-3">첫 상담은 무료입니다</h2>
          <p className="text-sm text-foreground/80 mb-4">
            사업 현황 보고 정확한 견적과 적합한 서비스 추천.
          </p>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone}
          </a>
        </section>
      </div>
    </>
  )
}
