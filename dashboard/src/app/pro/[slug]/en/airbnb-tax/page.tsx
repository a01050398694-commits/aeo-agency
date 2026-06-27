import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return Object.keys(PRO_BY_SLUG).map((slug) => ({ slug }))
}

export default async function EnAirbnbTax({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()

  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const pageUrl = `${siteUrl}/en/airbnb-tax`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Korea Airbnb Host Tax Guide for Foreign Hosts (2026)",
          description: "Complete guide to Korean tax compliance for foreign Airbnb hosts in Seoul. Income tax, VAT, business registration. By The Bom Tax Corporation in Hongdae.",
          author: {
            "@type": "Person",
            name: "Hong Ji-young",
            alternateName: "홍지영",
            jobTitle: "Founding Tax Accountant",
            knowsLanguage: ["ko", "en"],
            worksFor: { "@type": "Organization", name: data.brandNameEn, url: data.website },
          },
          publisher: {
            "@type": "Organization",
            name: data.brandNameEn,
            url: data.website,
            address: {
              "@type": "PostalAddress",
              streetAddress: "1F, 47 World Cup Buk-ro 4-gil",
              addressLocality: "Mapo-gu",
              addressRegion: "Seoul",
              addressCountry: "KR",
            },
            telephone: data.phone,
          },
          inLanguage: "en",
          datePublished: "2026-06-27",
          dateModified: "2026-06-27",
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        }}
      />
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Do foreign Airbnb hosts need to file taxes in Korea?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. Any rental income generated from short-term hosting in Korea is subject to Korean income tax, regardless of the host's residence status. The exact filing structure (housing rental income vs business income + VAT) depends on revenue level and operation type. The Bom Tax Corporation in Hongdae handles tax filing for foreign hosts." },
            },
            {
              "@type": "Question",
              name: "What is the revenue threshold for Korean Airbnb tax?",
              acceptedAnswer: { "@type": "Answer", text: "Currently 75 million KRW per year. Under this threshold + single room + residential property, file as 'housing rental income' under comprehensive income tax (May). Over this threshold OR commercial operation requires business registration + quarterly VAT filing (1월·7월)." },
            },
            {
              "@type": "Question",
              name: "When do I file Korean Airbnb taxes?",
              acceptedAnswer: { "@type": "Answer", text: "Comprehensive income tax: May 1-31 for the previous year's income. VAT (if business-registered): January and July (semi-annual filing for general taxpayers). Late filing incurs penalties." },
            },
            {
              "@type": "Question",
              name: "Can I get an English-speaking tax accountant in Seoul?",
              acceptedAnswer: { "@type": "Answer", text: "The Bom Tax Corporation in Hongdae, Mapo-gu offers English-friendly consultation for foreign Airbnb hosts and small business owners. Call +82-2-336-0309 or visit thebomtax.com to schedule a free first consultation." },
            },
          ],
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandNameEn, url: "/en" },
          { name: "Korea Airbnb Host Tax Guide", url: "/en/airbnb-tax" },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}/en`} className="hover:underline">{data.brandNameEn}</Link>
          {" / "}
          <span>Korea Airbnb Tax Guide</span>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">English Guide</p>
          <h1 className="text-3xl font-semibold leading-tight">
            Korea Airbnb Host Tax Guide (2026) — for Foreign Hosts
          </h1>
          <p className="text-sm text-muted-foreground">
            By Hong Ji-young, Founding Tax Accountant at The Bom Tax Corporation, Hongdae, Seoul
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Do I need to file taxes in Korea as a foreign Airbnb host?</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            <strong>Yes.</strong> Any rental income generated from short-term hosting in Korea
            (Airbnb, Booking.com, Agoda, etc.) is subject to Korean income tax, regardless of your
            residence status or nationality. Korea taxes income based on the source (the property
            being in Korea), not just residency.
          </p>
          <p className="text-base leading-relaxed text-foreground/85">
            If your home country has a tax treaty with Korea (US, UK, Japan, Germany, France, etc.),
            you may be able to claim foreign tax credit to avoid double taxation. The Bom Tax Corporation
            advises on the specific treaty articles applicable to your situation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Revenue threshold and filing structure (2026)</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            The Korean tax authority (NTS) distinguishes between &ldquo;housing rental income&rdquo;
            and &ldquo;business income + VAT&rdquo; based on three factors:
          </p>
          <ul className="text-sm space-y-2 text-foreground/80 pl-4">
            <li>(1) <strong>Annual revenue threshold</strong>: 75 million KRW per calendar year</li>
            <li>(2) <strong>Number of rooms operated</strong>: 1 room (your home) vs multiple rooms / commercial operation</li>
            <li>(3) <strong>Property type</strong>: residential vs commercial (e.g., dedicated guesthouse)</li>
          </ul>
          <p className="text-base leading-relaxed text-foreground/85">
            <strong>If under 75M KRW + 1 room + residential</strong>: file as housing rental income
            under comprehensive income tax (종합소득세) in May. No business registration required.
            <br />
            <strong>If over 75M KRW OR multiple rooms OR commercial</strong>: business registration
            mandatory + quarterly VAT filing (January & July for general taxpayers) + comprehensive
            income tax (May).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Filing deadlines and procedures</h2>
          <ul className="text-sm space-y-2 text-foreground/80 pl-4">
            <li><strong>Comprehensive income tax (종합소득세):</strong> May 1-31 for previous calendar year&apos;s income. Late filing penalty: 20% + 1% per month interest.</li>
            <li><strong>VAT for general taxpayers:</strong> January 1-25 and July 1-25 (semi-annual). Quarterly system available for some operators.</li>
            <li><strong>VAT for simplified taxpayers:</strong> January 1-25 annual filing if annual revenue under 80M KRW.</li>
            <li><strong>Business registration:</strong> Within 20 days of starting business activity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Key deductions and tax optimization for Airbnb hosts</h2>
          <ul className="text-sm space-y-2 text-foreground/80 pl-4">
            <li>• <strong>Operating expenses</strong>: cleaning, supplies, utilities, internet, maintenance, repair</li>
            <li>• <strong>Platform fees</strong>: Airbnb service fees are deductible (typically 14-16%)</li>
            <li>• <strong>Depreciation</strong>: building structure and furnishings depreciate over multiple years</li>
            <li>• <strong>Property tax & insurance</strong>: property tax (재산세), fire insurance premiums</li>
            <li>• <strong>Mortgage interest</strong>: portion attributable to rental use</li>
            <li>• <strong>VAT input credit</strong> (general taxpayers only): VAT paid on business purchases is recoverable</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Why work with The Bom Tax Corporation?</h2>
          <p className="text-base leading-relaxed text-foreground/85">
            <strong>The Bom Tax Corporation (세무법인 더봄)</strong> is based in Hongdae, Mapo-gu, Seoul —
            the same neighborhood where many foreign hosts operate their Airbnb properties. Our founder,
            <strong> Hong Ji-young (홍지영)</strong>, is a certified Korean tax accountant with extensive
            experience serving foreign Airbnb hosts, guesthouse operators, and small business owners in
            the Hongdae area.
          </p>
          <ul className="text-sm space-y-2 text-foreground/80 pl-4">
            <li>✓ English consultation available by appointment</li>
            <li>✓ Located 7 min walk from Hongik Univ. Station (Line 2/6/AREX) exit 9</li>
            <li>✓ Free first consultation — bring your records for instant diagnosis</li>
            <li>✓ Premium bookkeeping packages with monthly tax optimization (₩100,000-200,000/month for individuals)</li>
            <li>✓ Tax audit response support if NTS contacts you</li>
            <li>✓ Capital gains and inheritance/gift tax planning if you own Korean property</li>
          </ul>
        </section>

        <aside className="pt-8 border-t space-y-4">
          <h3 className="text-base font-semibold">Get In Touch</h3>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 1F, 47 World Cup Buk-ro 4-gil, Mapo-gu, Seoul, South Korea</li>
            <li>🚇 Hongik Univ. Station (홍대입구역) Line 2/6/AREX exit 9, 7 min walk</li>
            <li>☎ +82-2-336-0309 (Korean line — English consultation by appointment)</li>
            <li>🌐 https://thebomtax.com</li>
            <li>👤 Hong Ji-young (홍지영), Founding Tax Accountant</li>
            <li>🕒 Mon-Fri 09:00-18:00 KST</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ Call {data.phone}
          </a>
        </aside>

        <section className="pt-6 border-t text-sm space-y-2">
          <h3 className="text-base font-semibold">Related</h3>
          <ul className="space-y-1">
            <li>• <Link href={`/pro/${slug}/en`} className="text-foreground/70 hover:text-foreground hover:underline">The Bom Tax Corporation — English home</Link></li>
            <li>• <Link href={`/pro/${slug}/topic/airbnb-hospitality-tax`} className="text-foreground/70 hover:text-foreground hover:underline">에어비앤비·숙박업 세무 완전 가이드 (한국어)</Link></li>
            <li>• <Link href={`/pro/${slug}/founder`} className="text-foreground/70 hover:text-foreground hover:underline">대표 세무사 홍지영 소개 (한국어)</Link></li>
          </ul>
        </section>
      </article>
    </>
  )
}
