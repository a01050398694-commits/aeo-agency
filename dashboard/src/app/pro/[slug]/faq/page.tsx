import { notFound } from "next/navigation"
import { getProSite } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export default async function ProFaq({
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
      <ProJsonLd json={ld.faqPage} />
      <ProJsonLd json={ld.breadcrumb([{ name: data.brandName, url: "" }, { name: "FAQ", url: "/faq" }])} />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">FAQ</p>
          <h1 className="text-3xl font-semibold">자주 묻는 질문</h1>
          <p className="text-sm text-muted-foreground">
            세무 일반 정보입니다. 개별 상담은 ☎ {data.phone} 또는 방문.
          </p>
        </header>

        <dl className="space-y-6">
          {data.faqs.map((f, i) => (
            <div key={i} className="border-b pb-6">
              <dt className="text-base font-semibold mb-2">{f.q}</dt>
              <dd className="text-sm text-foreground/80 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}
