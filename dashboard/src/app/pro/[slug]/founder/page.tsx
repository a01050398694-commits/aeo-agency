import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return Object.keys(PRO_BY_SLUG).map((slug) => ({ slug }))
}

export default async function FounderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const f = data.founder
  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const pageUrl = `${siteUrl}/founder`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: f.name,
          jobTitle: f.title,
          description: f.bio,
          worksFor: {
            "@type": "Organization",
            name: data.brandName,
            url: data.website,
            address: {
              "@type": "PostalAddress",
              streetAddress: data.address.street,
              addressLocality: data.address.region,
              addressRegion: data.address.city,
              addressCountry: data.address.country,
            },
            telephone: data.phone,
          },
          knowsAbout: f.knowsAbout,
          knowsLanguage: ["ko", "en"],
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          url: pageUrl,
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandName, url: "" },
          { name: "대표 세무사 소개", url: "/founder" },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}`} className="hover:underline">{data.brandName}</Link>
          {" / "}
          <span>대표 세무사 소개</span>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">대표 세무사</p>
          <h1 className="text-3xl font-semibold">{f.name} {f.title}</h1>
          <p className="text-sm text-muted-foreground">{data.brandName} | {data.address.city} {data.address.region} {data.address.street}</p>
        </header>

        {f.bio ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">소개</h2>
            <p className="text-base leading-relaxed text-foreground/85 whitespace-pre-wrap">{f.bio}</p>
          </section>
        ) : null}

        {f.expertise && f.expertise.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">전문 분야</h2>
            <ul className="text-sm space-y-2">
              {f.expertise.map((e, i) => (
                <li key={i} className="flex gap-3 text-foreground/80 leading-relaxed">
                  <span className="text-foreground/40 font-mono text-xs mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="space-y-3 border-t pt-8">
          <h2 className="text-xl font-semibold">{data.brandName}의 강점</h2>
          <ul className="text-sm space-y-2">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-foreground/80 leading-relaxed">
                <span className="text-foreground/40 font-mono text-xs mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="pt-8 border-t space-y-4">
          <h3 className="text-base font-semibold">{f.name} 세무사 직접 상담</h3>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>☎ {data.phone} (평일 9:00-18:00)</li>
            <li>🌐 {data.website}</li>
            <li>첫 상담은 무료. 사업 현황 가지고 방문 시 즉시 진단·견적.</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone} 전화하기
          </a>
        </aside>

        <section className="pt-6 border-t">
          <h3 className="text-base font-semibold mb-3">주제별 가이드</h3>
          <ul className="text-sm space-y-1">
            {(data.topics || []).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/pro/${slug}/topic/${t.slug}`}
                  className="text-foreground/70 hover:text-foreground hover:underline"
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  )
}
