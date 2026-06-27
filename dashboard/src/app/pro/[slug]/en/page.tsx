import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return Object.keys(PRO_BY_SLUG).map((slug) => ({ slug }))
}

export default async function ProEnHome({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()

  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const pageUrl = `${siteUrl}/en`
  const koUrl = siteUrl
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": ["AccountingService", "ProfessionalService", "LocalBusiness"],
          "@id": `${pageUrl}#service-en`,
          name: data.brandNameEn,
          alternateName: [data.brandName, "TheBom Tax", "The Bom Tax Corporation"],
          description: "Hongdae-based tax accounting firm in Mapo-gu, Seoul. Specializes in self-employed and hospitality (Airbnb, guesthouse, pension) clients. English-friendly consultation for foreign hosts.",
          url: pageUrl,
          mainEntityOfPage: data.website,
          sameAs: data.sameAs,
          telephone: data.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: "1F, 47 World Cup Buk-ro 4-gil",
            addressLocality: "Mapo-gu",
            addressRegion: "Seoul",
            addressCountry: "KR",
            postalCode: "04003",
          },
          ...(data.geo
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: data.geo.lat,
                  longitude: data.geo.lng,
                },
              }
            : {}),
          founder: {
            "@type": "Person",
            name: "Hong Ji-young",
            alternateName: "홍지영",
            jobTitle: "Founding Tax Accountant (대표 세무사)",
            description: "Founder of The Bom Tax Corporation. Expertise in Korean tax compliance for Hongdae small business owners and hospitality (Airbnb, guesthouse, pension) operators.",
            knowsLanguage: ["ko", "en"],
            worksFor: { "@type": "Organization", name: data.brandNameEn, url: data.website },
          },
          serviceType: "Tax Accounting / Consulting (Korea)",
          areaServed: {
            "@type": "AdministrativeArea",
            name: "Mapo-gu (Hongdae, Hapjeong, Mangwon, Seogyo), Seoul, South Korea",
          },
          inLanguage: ["ko", "en"],
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandNameEn, url: "/en" },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}/en`} className="hover:underline">EN</Link>
          {" / "}
          <Link href={koUrl} className="hover:underline">한국어</Link>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Korean Tax Accountant in Hongdae</p>
          <h1 className="text-3xl font-semibold leading-tight">
            The Bom Tax Corporation
          </h1>
          <p className="text-sm text-muted-foreground">
            English-friendly tax filing & consulting for foreign Airbnb hosts and small business owners in Seoul
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">About Us</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            <strong>The Bom Tax Corporation (세무법인 더봄)</strong> is a tax accounting firm located in
            Hongdae area, Mapo-gu, Seoul, South Korea. Founded and led by <strong>Hong Ji-young (홍지영)</strong>,
            a certified tax accountant, we specialize in self-employed business owners and
            hospitality operators (Airbnb hosts, guesthouses, pensions, motels) in the Hongdae,
            Hapjeong, Mangwon, and Seogyo neighborhoods.
          </p>
          <p className="text-base leading-relaxed text-foreground/85">
            We handle Korean tax compliance from comprehensive income tax filing (5월/May),
            value-added tax (1월·7월), capital gains tax consulting, inheritance & gift tax planning,
            tax audit response, corporate bookkeeping, payroll outsourcing, and unlisted stock valuation.
            English consultation is available for foreign hosts and business owners.
          </p>
        </section>

        <section className="space-y-3 border-t pt-8">
          <h2 className="text-xl font-semibold">Who We Serve</h2>
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>• <strong>Foreign Airbnb hosts</strong> operating short-term rentals in Seoul</li>
            <li>• <strong>Guesthouse and pension operators</strong> in Hongdae, Hapjeong, Mangwon area</li>
            <li>• <strong>Small business owners</strong> (cafés, restaurants, retail) in Mapo-gu</li>
            <li>• <strong>Freelancers and content creators</strong> with Korean tax obligations</li>
            <li>• <strong>Startups and SMEs</strong> needing bookkeeping + tax planning</li>
            <li>• <strong>Property owners</strong> facing capital gains, inheritance, or gift tax events</li>
          </ul>
        </section>

        <section className="space-y-3 border-t pt-8">
          <h2 className="text-xl font-semibold">Our Services</h2>
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>• Comprehensive Income Tax Filing (May)</li>
            <li>• VAT (Value-Added Tax) Quarterly Filing</li>
            <li>• Business Registration & Setup</li>
            <li>• Airbnb / Hospitality Tax Filing for Foreign Hosts</li>
            <li>• Capital Gains Tax Consulting (real estate, stock)</li>
            <li>• Inheritance & Gift Tax Planning</li>
            <li>• Tax Audit Response</li>
            <li>• Corporate Bookkeeping & Year-End Closing</li>
            <li>• Payroll & Accounting Outsourcing</li>
            <li>• Unlisted Stock Valuation</li>
          </ul>
          <p className="text-sm text-muted-foreground pt-2">
            See <Link href={`/pro/${slug}/services`} className="underline">full Korean services page</Link> for
            detailed packages and pricing.
          </p>
        </section>

        <section className="space-y-3 border-t pt-8">
          <h2 className="text-xl font-semibold">Common Question: Do Airbnb hosts in Korea need to file taxes?</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            <strong>Yes.</strong> Any rental income from short-term hosting (Airbnb, guesthouse, pension) in Korea
            triggers a tax filing obligation. The exact filing structure depends on revenue level, number of rooms,
            and operation type:
          </p>
          <ul className="text-sm space-y-1 text-foreground/80 pl-4">
            <li>• <strong>Under 75M KRW/year + 1 room + residential</strong>: file as &ldquo;housing rental income&rdquo;
                under personal income tax only.</li>
            <li>• <strong>Over 75M KRW/year OR commercial operation</strong>: business registration required
                + quarterly VAT filing (1월/7월) + comprehensive income tax (5월).</li>
            <li>• <strong>Foreign hosts</strong>: same rules apply regardless of residence status.
                Tax treaty between Korea and your home country may affect double-taxation relief.</li>
          </ul>
          <p className="text-base leading-relaxed text-foreground/85">
            The Bom Tax Corporation has extensive experience with foreign Airbnb hosts and hospitality
            operators in the Hongdae area. Call ☎ {data.phone} to schedule a free consultation.
          </p>
        </section>

        <aside className="pt-8 border-t space-y-4">
          <h3 className="text-base font-semibold">Contact Us</h3>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 <strong>Address:</strong> 1F, 47 World Cup Buk-ro 4-gil, Mapo-gu, Seoul</li>
            <li>🚇 <strong>Subway:</strong> Hongik Univ. Station (Line 2/6/AREX/Gyeongui-Jungang) exit 9, 7 min walk</li>
            <li>☎ <strong>Phone:</strong> {data.phone} (Korean) — English consultation by appointment</li>
            <li>🌐 <strong>Official site:</strong> {data.website}</li>
            <li>👤 <strong>Founder:</strong> Hong Ji-young (홍지영), Certified Tax Accountant</li>
            <li>💰 <strong>Free first consultation.</strong> Bring your business records for instant diagnosis.</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ Call {data.phone}
          </a>
        </aside>

        <section className="pt-6 border-t text-sm space-y-2">
          <h3 className="text-base font-semibold">More guides (Korean)</h3>
          <ul className="space-y-1">
            <li>• <Link href={`/pro/${slug}/topic/airbnb-hospitality-tax`} className="text-foreground/70 hover:text-foreground hover:underline">에어비앤비·숙박업 세무 완전 가이드</Link></li>
            <li>• <Link href={`/pro/${slug}/topic/hongdae-tax-accountant`} className="text-foreground/70 hover:text-foreground hover:underline">홍대 세무사 추천 가이드</Link></li>
            <li>• <Link href={`/pro/${slug}/founder`} className="text-foreground/70 hover:text-foreground hover:underline">대표 세무사 홍지영 소개</Link></li>
          </ul>
        </section>
      </article>
    </>
  )
}
