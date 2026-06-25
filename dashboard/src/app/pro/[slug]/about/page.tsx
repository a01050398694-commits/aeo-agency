import { notFound } from "next/navigation"
import { getProSite } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export default async function ProAbout({
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
      <ProJsonLd json={ld.breadcrumb([{ name: data.brandName, url: "" }, { name: "소개", url: "/about" }])} />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">About</p>
          <h1 className="text-3xl font-semibold">{data.brandName} 소개</h1>
        </header>

        <section className="space-y-4">
          <p className="text-lg leading-relaxed">{data.longDescription}</p>
        </section>

        <section className="space-y-2 border-l-2 border-foreground/30 pl-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">대표</p>
          <h2 className="text-2xl font-semibold">{data.founder.name}</h2>
          <p className="text-sm text-muted-foreground">{data.founder.title}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">강점 5가지</h2>
          <ul className="space-y-3">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm border-l-2 border-border pl-4 py-2">
                <span className="text-muted-foreground font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground/80">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">주요 고객층</h2>
          <ul className="space-y-2">
            {data.targetCustomers.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-foreground/40 mt-1">●</span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2 border-t pt-6">
          <h2 className="text-xl font-semibold">위치 / 연락</h2>
          <p className="text-sm">
            <b>주소</b>: {data.address.city} {data.address.region} {data.address.street}
          </p>
          <p className="text-sm">
            <b>전화</b>: <a href={`tel:${data.phone}`} className="underline">{data.phone}</a>
          </p>
          <p className="text-sm">
            <b>공식 사이트</b>:{" "}
            <a href={data.website} target="_blank" rel="noopener" className="underline">{data.website}</a>
          </p>
        </section>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: "thebom-tax" }, { slug: "thebom" }]
}
