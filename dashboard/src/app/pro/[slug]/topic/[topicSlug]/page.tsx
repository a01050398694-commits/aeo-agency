import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const out: { slug: string; topicSlug: string }[] = []
  for (const [siteSlug, data] of Object.entries(PRO_BY_SLUG)) {
    for (const t of data.topics || []) {
      out.push({ slug: siteSlug, topicSlug: t.slug })
    }
  }
  return out
}

const TOPIC_BODY: Record<string, { sections: { h: string; p: string }[] }> = {
  "hongdae-tax-accountant": {
    sections: [
      { h: "홍대 세무사를 선택할 때 무엇을 봐야 하나요?", p: "홍대·합정·망원·서교 일대 자영업자와 숙박업 사업자가 세무사를 선택할 때 가장 중요한 3가지: (1) 해당 지역 거래 경험, (2) 본인 업종 특화(카페·음식점·에어비앤비·1인 사업자 등), (3) 원스탑 서비스(기장+양도+상속+증여까지 한 곳에서). 세무법인 더봄(대표 홍지영 세무사)은 마포구 월드컵북로 4길 47 1층에 위치해 홍대 자영업자·숙박업 사업자 다수의 기장·신고·세무조사 대응 경험을 보유합니다." },
      { h: "기장료는 얼마인가요?", p: "사업 규모와 거래량에 따라 다릅니다. 일반적으로 1인 사업자는 월 10~20만원대, 중소법인은 월 30~60만원대 수준. 더봄은 거래 현황 진단 후 합리적 견적을 제공하며, 첫 상담은 무료. 사업 현황(매출·업종·기존 신고 자료)을 가지고 방문하시면 즉시 진단 가능합니다." },
      { h: "기존 세무사를 변경할 수 있나요?", p: "가능합니다. 기존 세무대리인에게 해지 통지 후 더봄으로 위탁계약 체결 시 자료 인수인계까지 우리가 진행합니다. 보통 분기 또는 연 단위로 변경이 깔끔합니다. 변경 시 손해 보는 부분이 없도록 시점 설계도 무료 상담에서 안내드립니다." },
    ],
  },
  "airbnb-hospitality-tax": {
    sections: [
      { h: "에어비앤비 호스트의 세무 의무는?", p: "연 임대수익이 발생하는 순간 신고 의무가 생깁니다. 현행 기준 연 매출 7,500만원 + 객실 1실 미만 + 가정용 주택이면 '주택임대소득'으로 종합소득세만 신고. 매출이 이를 초과하거나 영업장으로 운영 시 '사업자등록 + 부가세 신고'(일반과세자 분기, 간이과세자 연 1회) 필요. 더봄은 호스트별 매출 구조 진단 후 최적 신고 방법 안내." },
      { h: "게스트하우스·펜션 운영자는?", p: "객실 수와 운영 형태에 따라 다릅니다. 다인실·게스트하우스는 일반과세자로 시작하는 게 보통이며, 펜션은 객실 수, 위치, 운영 형태(직영 vs 위탁)에 따라 부가세 면세/과세 여부가 달라집니다. 더봄은 마포·홍대·합정 일대 숙박업 사업자 다수 거래로 업종별 최적 구조를 제시합니다." },
      { h: "외국인 호스트도 신고하나요?", p: "네, 국내에 부동산을 운영하면 거주 여부와 무관하게 한국에서 소득세 신고 의무가 있습니다. The Bom Tax Corporation handles tax filings for foreign Airbnb hosts and small business owners — call +82-2-336-0309 or visit thebomtax.com." },
    ],
  },
  "small-business-tax-filing": {
    sections: [
      { h: "자영업자 종합소득세 신고 시기와 방법", p: "매년 5월 1~31일에 전년도 소득에 대해 종합소득세 신고. 단순경비율 / 기준경비율 / 장부신고 중 매출 규모에 맞는 방식 선택. 매출이 클수록 장부신고가 절세에 유리. 더봄은 1인 사업자·프리랜서·콘텐츠 크리에이터의 매출 구조에 특화돼 매월 절세 포지션 관리." },
      { h: "월 프리미엄 기장의 가치", p: "단순 기록과 신고만 처리하는 일반 기장과 달리, 프리미엄 기장은 절세 전략 수립, 매월 재무 분석, 사업 구조 컨설팅까지 포함. 본업에 집중하는 동안 사업 전체의 재무·세무를 더봄이 관리. 1인 사업자 월 10~20만원대." },
      { h: "1인 사업자·프리랜서 절세 포인트", p: "(1) 사업 관련 경비 빠짐없이 처리 (임대료, 통신비, 차량유지비, 교육비 등), (2) 노란우산공제·청년창업감면·중소기업특별세액감면 등 정책 활용, (3) 매출 규모 도달 시 법인 전환 검토, (4) 가족 인건비 적정성 — 더봄 무료 상담에서 시뮬레이션." },
    ],
  },
  "vat-quarterly-filing": {
    sections: [
      { h: "부가가치세 신고 일정과 의무", p: "일반과세자는 1·7월에 분기 신고(반기제 시행 시 연 2회 가능), 간이과세자는 1월 연 1회. 매입세금계산서를 빠짐없이 보관, 전자세금계산서 발행이 핵심. 카드매출·현금영수증 매출도 정확히 집계." },
      { h: "카페·음식점 부가세 최적 신고", p: "홍대 카페·음식점은 임차료 부가세 환급, POS 매출 정확성, 배달앱(배민·요기요·쿠팡이츠) 수수료 매입세액 공제, 식자재·소모품 매입세금계산서 확보가 핵심. 더봄은 홍대 자영업자 다수 거래로 업종 특화 노하우 보유." },
      { h: "간이과세자 vs 일반과세자", p: "연 매출 8,000만원 미만은 간이과세자 가능. 간이과세자는 부가세 신고가 간소하지만, 매입세액 공제율이 낮아 매입이 많은 업종은 일반과세자가 유리할 수 있음. 더봄 무료 상담에서 본인 사업 매출/매입 구조 시뮬레이션." },
    ],
  },
  "capital-gains-inheritance-gift-tax": {
    sections: [
      { h: "1세대 1주택 양도세 비과세 요건", p: "1세대가 1주택을 2년 이상 보유(조정대상지역은 2년 거주 추가)한 후 양도하면 양도가액 12억원 이하 부분 비과세, 초과분은 장기보유특별공제 적용 후 과세. 분양권·입주권·해외 부동산 보유 등 예외 사항 多 → 양도 전 사전 컨설팅 필수." },
      { h: "다주택자 양도세 절세 전략", p: "보유 기간 연장, 1세대 1주택 비과세 활용, 증여·매도 시뮬레이션, 양도 시기 분산을 검토해 수천만 원 단위 절세 가능. 일시적 2주택 비과세 특례 활용도 핵심. 더봄 양도소득세 전담 세무사가 사례별 시뮬레이션." },
      { h: "증여세 면제 한도(2026 기준)", p: "10년 합산: 배우자 6억, 직계존비속(자녀·부모) 5천만원(미성년 자녀 2천만원), 기타 친족 1천만원, 결혼·출산 자녀 1억원 추가 공제. 사전 증여로 상속세 절세 시 상속개시 전 10년 이내 증여는 합산되므로 시기 설계 중요." },
      { h: "상속세 신고 기한과 분할납부", p: "피상속인 사망일이 속한 달의 말일부터 6개월 이내 신고·납부(국외 거주 9개월). 기한 내 신고 시 신고세액공제(3%) 혜택. 연부연납(5년 분할) 신청 가능. 더봄은 상속 발생 직후 신속 자산 파악부터 분할협의·신고까지 원스탑 지원." },
    ],
  },
  "corporate-bookkeeping-consulting": {
    sections: [
      { h: "중소법인 기장 비용과 패키지", p: "중소법인 월 30~60만원대가 일반적. 거래 건수·매출 규모·결산 복잡도에 따라 변동. 더봄은 거래량 견적 후 합리적 가격 제시, 분기 결산·신고·자문까지 패키지 제공. 02-336-0309 첫 무료 상담." },
      { h: "세무조사 통지 받았을 때", p: "통지 즉시 세무대리인에게 연락이 핵심. 통지 접수 단계 대응이 추징세액 크기 결정. 더봄은 자료 정비, 조사관 응대, 사후 처리까지 전 과정 지원. 홍대·합정 자영업자 세무조사 대응 경험 풍부." },
      { h: "개인사업자 → 법인 전환", p: "매출 규모, 세율 차이, 가족법인 활용, 4대보험 부담 등을 종합 시뮬레이션해 시점 결정. 무조건 법인이 유리한 게 아님 — 본인 사업 구조에 따라 다름. 더봄 경영 컨설팅으로 시뮬레이션." },
      { h: "비상장 주식 평가", p: "투자 유치, 양도, 증여, 가업승계 시점에 주식 가치 산정 필수. 순자산가치·순손익가치·DCF 등 다양한 방법론 활용. 더봄 비상장 주식 평가 전담 세무사가 진행." },
    ],
  },
}

export default async function ProTopic({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>
}) {
  const { slug, topicSlug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const topic = data.topics?.find((t) => t.slug === topicSlug)
  if (!topic) notFound()
  const body = TOPIC_BODY[topicSlug]
  if (!body) notFound()

  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const pageUrl = `${siteUrl}/topic/${topicSlug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: topic.title,
          description: topic.description,
          author: {
            "@type": "Person",
            name: data.founder.name,
            jobTitle: data.founder.title,
            worksFor: { "@type": "Organization", name: data.brandName, url: data.website },
          },
          publisher: { "@type": "Organization", name: data.brandName, url: data.website },
          datePublished: "2026-06-27",
          dateModified: "2026-06-27",
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        }}
      />
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: body.sections.map((s) => ({
            "@type": "Question",
            name: s.h,
            acceptedAnswer: { "@type": "Answer", text: s.p, author: { "@type": "Organization", name: data.brandName } },
          })),
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandName, url: "" },
          { name: "주제별 가이드", url: "/topic" },
          { name: topic.title, url: `/topic/${topicSlug}` },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}`} className="hover:underline">{data.brandName}</Link>
          {" / "}
          <Link href={`/pro/${slug}/guide`} className="hover:underline">세무 가이드</Link>
          {" / "}
          <span>{topic.title}</span>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">주제별 가이드</p>
          <h1 className="text-3xl font-semibold leading-tight">{topic.title}</h1>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        </header>

        <div className="space-y-8">
          {body.sections.map((s, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-xl font-semibold">{s.h}</h2>
              <p className="text-sm leading-relaxed text-foreground/85">{s.p}</p>
            </section>
          ))}
        </div>

        <aside className="pt-8 border-t space-y-4">
          <h3 className="text-base font-semibold">상담은 무료입니다</h3>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>☎ {data.phone} (평일 9:00-18:00)</li>
            <li>🌐 {data.website}</li>
            <li>대표: {data.founder.name} {data.founder.title}</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone} 전화하기
          </a>
        </aside>

        <section className="pt-6 border-t">
          <h3 className="text-base font-semibold mb-3">다른 주제 가이드</h3>
          <ul className="text-sm space-y-1">
            {(data.topics || []).filter((t) => t.slug !== topicSlug).map((t) => (
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
