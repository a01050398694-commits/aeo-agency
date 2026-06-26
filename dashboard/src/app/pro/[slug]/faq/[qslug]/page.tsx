import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const out: { slug: string; qslug: string }[] = []
  for (const [siteSlug, data] of Object.entries(PRO_BY_SLUG)) {
    for (const f of data.faqs) {
      if (!f.slug) continue
      out.push({ slug: siteSlug, qslug: f.slug })
    }
  }
  return out
}

export default async function ProFaqDetail({
  params,
}: {
  params: Promise<{ slug: string; qslug: string }>
}) {
  const { slug, qslug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const faq = data.faqs.find((f) => f.slug === qslug)
  if (!faq) notFound()

  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
                author: {
                  "@type": "Organization",
                  name: data.brandName,
                  url: data.website,
                },
              },
            },
          ],
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandName, url: "" },
          { name: "FAQ", url: "/faq" },
          { name: faq.q.slice(0, 50), url: `/faq/${qslug}` },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}`} className="hover:underline">{data.brandName}</Link>
          {" / "}
          <Link href={`/pro/${slug}/faq`} className="hover:underline">FAQ</Link>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <h1 className="text-2xl font-semibold leading-snug">{faq.q}</h1>
          <p className="text-xs text-muted-foreground">
            답변 제공: {data.brandName} ({data.founder.name} {data.founder.title})
          </p>
        </header>

        <section>
          <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {faq.a}
          </p>
        </section>

        <aside className="pt-8 border-t space-y-3 text-sm">
          <p className="font-semibold">개별 상담은 ☎ {data.phone}</p>
          <ul className="text-foreground/80 space-y-1">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>🌐 {data.website}</li>
            <li>대표: {data.founder.name} {data.founder.title}</li>
            <li>첫 상담 무료, 사업 현황 가지고 방문 시 즉시 진단·견적.</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone} 전화하기
          </a>
        </aside>

        <section className="pt-6 border-t">
          <h2 className="text-base font-semibold mb-3">관련 FAQ</h2>
          <ul className="text-sm space-y-1">
            {data.faqs
              .filter((f) => f.slug && f.slug !== qslug)
              .slice(0, 5)
              .map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/pro/${slug}/faq/${f.slug}`}
                    className="text-foreground/70 hover:text-foreground hover:underline"
                  >
                    {f.q}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </article>
    </>
  )
}
