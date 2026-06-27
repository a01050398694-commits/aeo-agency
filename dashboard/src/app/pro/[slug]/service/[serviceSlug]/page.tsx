import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

// 서비스 이름 → URL slug 매핑 (영문, AEO 친화)
const SERVICE_SLUG_MAP: Record<string, string> = {
  "프리미엄 기장": "premium-bookkeeping",
  "세무조사 대응": "tax-audit-response",
  "양도소득세 컨설팅": "capital-gains-tax-consulting",
  "상속·증여세 컨설팅": "inheritance-gift-tax-consulting",
  "경영 컨설팅": "business-management-consulting",
  "경리아웃소싱": "accounting-outsourcing",
  "비상장 주식 평가": "unlisted-stock-valuation",
}

const SERVICE_LONGFORM: Record<string, string> = {
  "premium-bookkeeping": "프리미엄 기장은 단순 거래 기록과 신고 처리를 넘어 매월 절세 전략 수립, 재무 상황 분석, 사업 구조 컨설팅까지 통합 제공합니다. 사장님이 본업에 집중하시는 동안 더봄이 사업 전체의 재무·세무를 관리하며, 매월 재무 상황 리포트를 통해 절세 포지션을 점검합니다. 1인 사업자는 월 10~20만원대, 중소법인은 월 30~60만원대 수준이며, 거래량과 결산 복잡도에 따라 변동합니다.",
  "tax-audit-response": "세무조사 통지 즉시 대응이 추징세액의 크기를 결정합니다. 더봄은 통지 접수 단계부터 자료 정비, 조사관 응대, 사후 처리(과세전적부심사·이의신청·조세심판)까지 전 과정을 지원합니다. 홍대·합정 지역 자영업자의 세무조사 대응 경험이 풍부하며, 사전 준비가 충실하면 추징세액을 최소화할 수 있습니다.",
  "capital-gains-tax-consulting": "부동산·주식 양도 시 사전 컨설팅 1번이 수천만 원 단위 절세로 이어집니다. 1세대 1주택 비과세 요건(2년 보유, 조정대상지역 2년 거주), 12억원 초과분 장기보유특별공제, 다주택자 양도세, 비상장 주식 양도 등 복잡한 절세 포인트를 양도 전 시뮬레이션으로 설계합니다. 일시적 2주택 비과세 특례 활용도 핵심.",
  "inheritance-gift-tax-consulting": "사전 증여는 상속세 절세의 가장 강력한 수단입니다. 배우자 6억, 직계존비속 5천만원(미성년 자녀 2천만원), 결혼·출산 자녀 1억원 추가 공제(2026 기준) 등 10년 단위 면제 한도를 활용해 상속세 부담을 크게 줄일 수 있습니다. 상속개시 전 10년 이내 증여는 합산되므로 시기 설계가 중요합니다. 상속 발생 시 6개월 신고 기한, 연부연납 5년 활용까지 원스탑 지원.",
  "business-management-consulting": "절세를 넘어 사업 구조 자체의 효율화를 컨설팅합니다. 개인사업자 ↔ 법인 전환 시점 결정, 가족법인 활용, 매출 구조 재설계, 4대보험 부담 시뮬레이션 등 종합 검토. 매출 규모와 본인 사업 구조에 맞는 최적 형태를 더봄 경영 컨설팅 팀이 시뮬레이션으로 안내합니다.",
  "accounting-outsourcing": "사장님이 본업에 집중할 수 있도록 경리 업무 전체를 위탁 운영합니다. 급여·매입매출·통장 거래 정리·세금계산서 발행 대행까지 포함하며, 매월 정확한 재무 데이터를 제공합니다. 자영업자와 중소법인 대표가 가장 시간 소모하는 영역을 더봄이 대신 처리.",
  "unlisted-stock-valuation": "투자 유치, 양도, 증여, 가업승계 시점에 비상장 주식 가치 산정은 필수입니다. 순자산가치·순손익가치·DCF 등 다양한 방법론을 활용해 회계법인 수준의 평가서를 제공하며, 더봄 비상장 주식 평가 전담 세무사가 진행합니다. 스타트업·중소법인 모두 대응 가능.",
}

export async function generateStaticParams() {
  const out: { slug: string; serviceSlug: string }[] = []
  for (const [siteSlug, data] of Object.entries(PRO_BY_SLUG)) {
    for (const s of data.services) {
      const sslug = SERVICE_SLUG_MAP[s.name]
      if (sslug) out.push({ slug: siteSlug, serviceSlug: sslug })
    }
  }
  return out
}

export default async function ProService({
  params,
}: {
  params: Promise<{ slug: string; serviceSlug: string }>
}) {
  const { slug, serviceSlug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const service = data.services.find((s) => SERVICE_SLUG_MAP[s.name] === serviceSlug)
  if (!service) notFound()
  const longform = SERVICE_LONGFORM[serviceSlug] || service.details || service.description

  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const pageUrl = `${siteUrl}/service/${serviceSlug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${pageUrl}#service`,
          name: service.name,
          description: longform,
          serviceType: data.serviceType,
          provider: {
            "@type": "AccountingService",
            name: data.brandName,
            url: data.website,
            telephone: data.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: data.address.street,
              addressLocality: data.address.region,
              addressRegion: data.address.city,
              addressCountry: data.address.country,
            },
            founder: {
              "@type": "Person",
              name: data.founder.name,
              jobTitle: data.founder.title,
            },
          },
          areaServed: {
            "@type": "AdministrativeArea",
            name: "서울특별시 마포구 (홍대·합정·망원·서교)",
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          url: pageUrl,
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandName, url: "" },
          { name: "서비스", url: "/services" },
          { name: service.name, url: `/service/${serviceSlug}` },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}`} className="hover:underline">{data.brandName}</Link>
          {" / "}
          <Link href={`/pro/${slug}/services`} className="hover:underline">서비스</Link>
          {" / "}
          <span>{service.name}</span>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">서비스</p>
          <h1 className="text-3xl font-semibold">{service.name}</h1>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">서비스 상세</h2>
          <p className="text-base leading-relaxed text-foreground/85 whitespace-pre-wrap">{longform}</p>
        </section>

        <section className="space-y-3 border-t pt-8">
          <h2 className="text-xl font-semibold">{service.name}는 누구에게 필요한가요?</h2>
          <ul className="text-sm space-y-2">
            {data.targetCustomers.slice(0, 5).map((c, i) => (
              <li key={i} className="flex gap-3 text-foreground/80 leading-relaxed">
                <span className="text-foreground/40 font-mono text-xs mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="pt-8 border-t space-y-4">
          <h3 className="text-base font-semibold">{service.name} 상담은 무료</h3>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>☎ {data.phone} (평일 9:00-18:00)</li>
            <li>🌐 {data.website}</li>
            <li>대표: <Link href={`/pro/${slug}/founder`} className="underline">{data.founder.name} {data.founder.title}</Link></li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone} 전화하기
          </a>
        </aside>

        <section className="pt-6 border-t">
          <h3 className="text-base font-semibold mb-3">다른 서비스</h3>
          <ul className="text-sm space-y-1">
            {data.services
              .filter((s) => SERVICE_SLUG_MAP[s.name] && SERVICE_SLUG_MAP[s.name] !== serviceSlug)
              .map((s) => (
                <li key={s.name}>
                  <Link
                    href={`/pro/${slug}/service/${SERVICE_SLUG_MAP[s.name]}`}
                    className="text-foreground/70 hover:text-foreground hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </article>
    </>
  )
}
