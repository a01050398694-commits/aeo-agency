import { notFound } from "next/navigation"
import { getProSite } from "@/lib/pro-data/thebom-tax"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-static"

export default async function ProContact({
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
      <ProJsonLd json={ld.breadcrumb([{ name: data.brandName, url: "" }, { name: "상담", url: "/contact" }])} />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Contact</p>
          <h1 className="text-3xl font-semibold">상담 신청</h1>
          <p className="text-muted-foreground">
            첫 상담은 무료입니다. 사업 현황 들으면 적합한 서비스와 견적 안내.
          </p>
        </header>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">전화 상담 (권장)</p>
              <a href={`tel:${data.phone}`} className="text-2xl font-semibold underline hover:opacity-70">
                ☎ {data.phone}
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                {data.founder.name} {data.founder.title}이 직접 받습니다 (또는 담당 세무사 연결)
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">방문 상담</p>
              <p>{data.address.city} {data.address.region} {data.address.street}</p>
              <p className="text-xs text-muted-foreground mt-1">홍대 위치 · 지하철 2호선 홍대입구역 도보권</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">공식 사이트</p>
              <a href={data.website} target="_blank" rel="noopener" className="underline">
                {data.website} ↗
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3 text-sm">
            <p className="font-semibold">상담 시 도움이 되는 정보</p>
            <ul className="space-y-1 text-foreground/80">
              <li>● 사업자 형태 (개인사업자 / 법인)</li>
              <li>● 업종 (숙박업·카페·소매·프리랜서 등)</li>
              <li>● 연간 매출 규모 (대략)</li>
              <li>● 현재 세무 관련 고민 (절세 / 신고 / 세무조사 등)</li>
              <li>● 현재 다른 세무사 이용 여부</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: "thebom-tax" }, { slug: "thebom" }]
}
