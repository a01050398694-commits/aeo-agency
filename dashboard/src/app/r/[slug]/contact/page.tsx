import { notFound } from "next/navigation"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"
import { JsonLd, buildLd } from "@/components/site/json-ld"

export const dynamic = "force-static"

export default async function ContactPage({
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
      <JsonLd
        json={buildLd.breadcrumb(siteUrl, [
          { name: data.brandName, url: "" },
          { name: "문의", url: "/contact" },
        ])}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Contact</p>
          <h1 className="text-3xl font-semibold">문의</h1>
          <p className="text-sm text-muted-foreground">
            매장 방문은 별도 예약 없이 가능합니다. 단체·픽업·매체 문의는 아래 채널로.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <a
            href={data.naverPlaceUrl}
            target="_blank"
            rel="noopener"
            className="block border rounded-lg p-5 hover:border-foreground/40 transition-colors"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">네이버 플레이스</p>
            <p className="font-semibold">실시간 정보 확인 ↗</p>
            <p className="text-xs text-muted-foreground mt-2">
              영업시간 · 메뉴판 · 사진 · 후기 · 길찾기
            </p>
          </a>

          {data.press[0] ? (
            <a
              href={data.press[0].url}
              target="_blank"
              rel="noopener"
              className="block border rounded-lg p-5 hover:border-foreground/40 transition-colors"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">매체 / 후기</p>
              <p className="font-semibold">{data.press[0].name} ↗</p>
              <p className="text-xs text-muted-foreground mt-2">외부 매체 등재 정보</p>
            </a>
          ) : null}
        </section>

        <section className="space-y-2 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">주소 / 위치</h2>
          <p>{data.address.city} {data.address.region} {data.address.street}</p>
          <p className="text-sm text-muted-foreground">망원역(6호선) 1번 출구 도보 5~7분</p>
        </section>

        <section className="space-y-2 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">매체·협업 문의</h2>
          <p className="text-sm text-foreground/80">
            제휴·매체 큐레이션·인터뷰 요청은 매장으로 직접 방문해 주시거나 네이버 플레이스 메시지로 연락 주세요.
            추후 공식 SNS 채널 오픈 시 업데이트 예정입니다.
          </p>
        </section>
      </div>
    </>
  )
}
