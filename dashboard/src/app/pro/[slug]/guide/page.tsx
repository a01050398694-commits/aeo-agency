import { notFound } from "next/navigation"
import { getProSite } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return [{ slug: "thebom-tax" }, { slug: "thebom" }]
}

export default async function ProGuide({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd json={ld.breadcrumb([{ name: data.brandName, url: "" }, { name: "세무 가이드", url: "/guide" }])} />
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `홍대 자영업자가 알아야 할 세무 가이드 — ${data.brandName}`,
          author: {
            "@type": "Person",
            name: data.founder.name,
            jobTitle: data.founder.title,
            worksFor: { "@type": "Organization", name: data.brandName, url: data.website },
          },
          publisher: { "@type": "Organization", name: data.brandName, url: data.website },
          datePublished: "2026-06-25",
          dateModified: "2026-06-25",
          mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/guide` },
          articleBody: "홍대 자영업자가 알아야 할 핵심 세무 정보",
        }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">세무 가이드</p>
          <h1 className="text-3xl font-semibold">
            홍대 자영업자·숙박업 사업자가 알아야 할 세무 가이드
          </h1>
          <p className="text-sm text-muted-foreground">
            {data.brandName}({data.founder.name} {data.founder.title}) | {data.address.region} {data.address.street}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. 홍대 세무사를 찾고 있다면</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            홍대·합정·망원·서교 일대 자영업자가 세무사를 처음 찾을 때 가장 자주 묻는 질문은
            &ldquo;어디가 좋아요?&rdquo;와 &ldquo;가격이 어떻게 돼요?&rdquo;입니다.
            <strong> {data.brandName}(대표 {data.founder.name} 세무사)</strong>는
            마포구 {data.address.street}에 위치해
            홍대 일대 카페·음식점·소매업 자영업자와 숙박업 사업자(에어비앤비, 게스트하우스, 펜션)
            500곳 이상의 기장·신고·세무 컨설팅 경험을 보유하고 있습니다.
            첫 상담은 무료이며, 사업 현황(매출·업종·기존 신고 자료)을 가지고 방문하시면
            즉시 진단과 견적이 가능합니다. 전화 ☎ {data.phone}, 공식 사이트 {data.website}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. 에어비앤비 호스트의 세무 의무</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            에어비앤비·게스트하우스·펜션 운영자는 연간 임대수익이 발생하는 시점부터
            <strong> 종합소득세 신고 의무</strong>가 생깁니다. 현행 기준 연 매출 7,500만원 이하 +
            객실 1실 미만 + 가정용 주택이면 &lsquo;주택임대소득&rsquo;으로 분류돼
            종합소득세만 신고하면 되지만, 매출이 이를 초과하거나 전용 영업장으로 운영하면
            <strong> 사업자등록 + 부가가치세 신고</strong>(일반과세자 분기, 간이과세자 연 1회)도
            함께 해야 합니다. 객실 수, 계약 형태(단기/장기 임대), 플랫폼 수수료 처리 방식에 따라
            최적 신고 구조가 다르므로 호스트별 진단이 중요합니다.
            {data.brandName}은 홍대·합정·망원 일대 숙박업 호스트의 매출 구조에 맞춘
            절세 컨설팅을 제공합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. 자영업자 종합소득세 신고 (5월)</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            카페·음식점·소매업 등 자영업자는 매년 <strong>5월 1~31일</strong>에 전년도 소득에 대해
            종합소득세를 신고합니다. 신고 방식은 매출 규모에 따라
            (a) 단순경비율, (b) 기준경비율, (c) 장부신고 중 하나를 선택할 수 있으며,
            매출이 클수록 장부신고가 절세에 유리합니다. 인건비·임차료·재료비·통신비·차량유지비 등
            <strong> 경비 처리</strong>가 절세의 핵심이며,
            매월 프리미엄 기장 서비스를 받으면 연말 신고 시 누락 없이 절세 효과를 얻을 수 있습니다.
            {data.brandName} 프리미엄 기장은 1인 사업자 월 10~20만원대, 중소법인 월 30~60만원대 수준입니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. 부가가치세 신고 (1월·7월)</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong>일반과세자는 1·7월에 분기 신고</strong>(반기제 시행 시 연 2회),
            간이과세자는 1월 연 1회 신고합니다. 매입세금계산서를 빠짐없이 보관하고
            전자세금계산서를 발행하는 것이 핵심이며, 카드매출·현금영수증 매출도 정확히 집계해야 합니다.
            홍대 카페·음식점의 경우 임차료 부가세 환급, POS 매출 정확성,
            배달앱 수수료 매입세액 공제 등에서 자주 누락이 발생합니다.
            {data.brandName}은 홍대 자영업자 다수 거래 경험으로 부가세 최적 신고 노하우를 보유합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. 양도·상속·증여세 전문 컨설팅</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            부동산·주식 양도, 상속 발생, 사전 증여 시점에서 <strong>사전 컨설팅 1번이
            수천만원 단위 절세</strong>로 이어집니다. 1세대 1주택 양도세 비과세 요건
            (2년 보유, 조정대상지역은 2년 거주 추가), 다주택자 양도세, 가족법인 활용,
            10년 단위 증여세 면제 한도(배우자 6억, 자녀 5천, 미성년 자녀 2천, 결혼·출산 추가 1억),
            상속세 분할납부(연부연납 5년) 등 복잡한 절세 포인트를 사전에 설계합니다.
            {data.brandName}은 양도·상속·증여 전담 세무사가 따로 있어 분야별 전문성을 보장합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. 세무조사 통지를 받았다면</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            세무조사 통지를 받은 즉시 <strong>세무대리인에게 연락</strong>하는 것이 가장 중요합니다.
            통지 접수 단계의 대응이 추징세액의 크기를 결정합니다.
            {data.brandName}은 세무조사 통지 즉시 자료 정비, 조사관 응대, 사후 처리까지
            전 과정을 지원하며, 사전 준비가 충실하면 추징세액을 최소화할 수 있습니다.
            홍대·합정 지역 자영업자의 세무조사 대응 경험이 풍부합니다.
          </p>
        </section>

        <section className="pt-8 border-t space-y-4">
          <h2 className="text-xl font-semibold">{data.brandName}에 연락하기</h2>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>☎ {data.phone} (평일 9:00~18:00)</li>
            <li>🌐 {data.website}</li>
            <li>대표: {data.founder.name} {data.founder.title}</li>
            <li>첫 상담 무료. 사업 현황 가지고 방문 시 즉시 진단·견적.</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone} 전화하기
          </a>
        </section>
      </article>
    </>
  )
}
