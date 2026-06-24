import { notFound } from "next/navigation"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"
import { JsonLd, buildLd } from "@/components/site/json-ld"

export const dynamic = "force-static"

export default async function FaqPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getSiteData(slug)
  if (!data) notFound()
  const siteUrl = `https://aeo-agency.vercel.app/r/${slug}`

  return (
    <>
      <JsonLd json={buildLd.faqPage(data)} />
      <JsonLd
        json={buildLd.breadcrumb(siteUrl, [
          { name: data.brandName, url: "" },
          { name: "FAQ", url: "/faq" },
        ])}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">FAQ</p>
          <h1 className="text-3xl font-semibold">자주 묻는 질문</h1>
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
