import Link from "next/link"
import { notFound } from "next/navigation"
import { getProSite } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

export default async function ProHome({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const siteUrl = `https://aeo-agency.vercel.app/pro/${slug}`
  const base = `/pro/${slug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd json={ld.accountingService} />
      <ProJsonLd json={ld.faqPage} />
      <ProJsonLd json={ld.breadcrumb([{ name: data.brandName }])} />

      <section className="border-b">
        <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24 space-y-5">
          <Badge variant="outline">{data.serviceType}</Badge>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            {data.brandName}
          </h1>
          <p className="text-xl text-muted-foreground">{data.shortDescription}</p>
          <p className="text-base text-foreground/80 max-w-2xl leading-relaxed">
            {data.longDescription}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md text-sm font-medium"
            >
              ☎ {data.phone} 상담
            </a>
            <Link
              href={`${base}/services`}
              className="inline-flex items-center px-5 py-2.5 border rounded-md text-sm font-medium hover:bg-accent"
            >
              서비스 보기 →
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">대상 고객</p>
          <h2 className="text-2xl font-semibold mt-1">이런 분들을 위한 세무법인입니다</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.targetCustomers.map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="text-foreground/40 mt-1">●</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">서비스</p>
            <h2 className="text-2xl font-semibold mt-1">원스탑 세무 서비스</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((s) => (
              <Card key={s.name}>
                <CardHeader>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="text-xs">{s.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">강점</p>
          <h2 className="text-2xl font-semibold mt-1">왜 더봄을 선택하나</h2>
        </div>
        <ul className="space-y-3">
          {data.strengths.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm border-l-2 border-border pl-4 py-1">
              <span className="text-muted-foreground font-mono shrink-0">{i + 1}.</span>
              <span className="text-foreground/80">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-16 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">FAQ</p>
            <h2 className="text-2xl font-semibold mt-1">자주 묻는 질문</h2>
          </div>
          <dl className="space-y-6">
            {data.faqs.slice(0, 4).map((f, i) => (
              <div key={i} className="border-b pb-4">
                <dt className="font-semibold mb-2">{f.q}</dt>
                <dd className="text-sm text-foreground/80 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
          <Link href={`${base}/faq`} className="text-sm underline hover:opacity-70">
            전체 FAQ 보기 →
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-20 text-center space-y-5">
        <h2 className="text-3xl font-semibold">첫 상담은 무료입니다</h2>
        <p className="text-muted-foreground">
          {data.brandName} {data.founder.name} {data.founder.title}과 직접 상담하세요.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone}
          </a>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: "thebom-tax" }, { slug: "thebom" }]
}
