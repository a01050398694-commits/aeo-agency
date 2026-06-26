import { notFound } from "next/navigation"
import Link from "next/link"
import { getSiteData, SITE_BY_SLUG } from "@/lib/site-data/rufruf-mangwon"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const out: { slug: string; qslug: string }[] = []
  for (const [siteSlug, data] of Object.entries(SITE_BY_SLUG)) {
    for (const f of data.faqs) {
      if (!f.slug) continue
      out.push({ slug: siteSlug, qslug: f.slug })
    }
  }
  return out
}

export default async function CafeFaqDetail({
  params,
}: {
  params: Promise<{ slug: string; qslug: string }>
}) {
  const { slug, qslug } = await params
  const data = getSiteData(slug)
  if (!data) notFound()
  const faq = data.faqs.find((f) => f.slug === qslug)
  if (!faq) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                  },
                },
              },
            ],
          }),
        }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/r/${slug}`} className="hover:underline">{data.brandName}</Link>
          {" / "}
          <Link href={`/r/${slug}/faq`} className="hover:underline">FAQ</Link>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <h1 className="text-2xl font-semibold leading-snug">{faq.q}</h1>
          <p className="text-xs text-muted-foreground">{data.brandName}</p>
        </header>

        <section>
          <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {faq.a}
          </p>
        </section>

        <aside className="pt-8 border-t space-y-3 text-sm">
          <ul className="text-foreground/80 space-y-1">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>🚇 망원역(6호선) 1번 출구 도보 5~7분</li>
            {data.naverPlaceUrl ? (
              <li>
                🗺{" "}
                <a href={data.naverPlaceUrl} target="_blank" rel="noreferrer" className="underline">
                  네이버 지도
                </a>
              </li>
            ) : null}
          </ul>
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
                    href={`/r/${slug}/faq/${f.slug}`}
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
