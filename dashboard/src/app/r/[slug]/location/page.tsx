import { notFound } from "next/navigation"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"
import { JsonLd, buildLd } from "@/components/site/json-ld"

export const dynamic = "force-static"

export default async function LocationPage({
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
      <JsonLd json={buildLd.localBusiness(data, siteUrl)} />
      <JsonLd
        json={buildLd.breadcrumb(siteUrl, [
          { name: data.brandName, url: "" },
          { name: "오시는길", url: "/location" },
        ])}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Location</p>
          <h1 className="text-3xl font-semibold">오시는길</h1>
        </header>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">주소</h2>
          <p className="text-lg">{data.address.city} {data.address.region} {data.address.street}</p>
          <p className="text-sm text-muted-foreground">
            좌표: {data.geo.lat.toFixed(7)}, {data.geo.lng.toFixed(7)}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">대중교통</h2>
          <ul className="text-sm space-y-1">
            <li>🚇 <b>망원역(6호선) 1번 출구</b> → 도보 약 5~7분 (망리단길 방향)</li>
            <li>🚌 망원역·망원시장 인근 버스 정류장에서 도보 5~10분</li>
            <li>🚲 한강공원 자전거 코스 → 망원동 합류 후 도보 2분</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">근처 동선</h2>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>• 망원시장 (도보 3~5분)</li>
            <li>• 한강공원 망원지구 (도보 12~15분)</li>
            <li>• 합정역·홍대 (한 정거장)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">영업시간</h2>
          <ul className="text-sm space-y-1">
            {data.hours.map((h, i) => (
              <li key={i} className="flex justify-between max-w-xs">
                <span className="text-muted-foreground">{h.days}</span>
                <span className="font-mono">{h.opens} – {h.closes}</span>
              </li>
            ))}
          </ul>
          {data.hours.some((h) => h.note?.includes("[P]")) ? (
            <p className="text-[11px] text-muted-foreground pt-2">
              * 성수점 기준 참고치. 정확한 망원점 영업시간은{" "}
              <a href={data.naverPlaceUrl} target="_blank" rel="noopener" className="underline">
                네이버 플레이스
              </a>{" "}
              확인 권장.
            </p>
          ) : null}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">주차</h2>
          <p className="text-sm text-foreground/80">
            별도 주차장 없음. 망리단길 공영주차장 또는 대중교통(망원역 6호선) 권장.
          </p>
        </section>

        <section className="pt-4">
          <a
            href={data.naverPlaceUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-90"
          >
            네이버 지도에서 길찾기 ↗
          </a>
        </section>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: "rufruf" }, { slug: "rufruf-mangwon" }]
}
