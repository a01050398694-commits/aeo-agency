import { notFound } from "next/navigation"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"
import { JsonLd, buildLd } from "@/components/site/json-ld"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-static"

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getSiteData(slug)
  if (!data) notFound()
  const siteUrl = `https://aeo-agency.vercel.app/r/${slug}`

  const cakes = data.fullMenu.filter((m) => m.category === "케이크")
  const drinks = data.fullMenu.filter((m) => m.category === "음료")

  return (
    <>
      <JsonLd json={buildLd.menu(data, siteUrl)} />
      <JsonLd
        json={buildLd.breadcrumb(siteUrl, [
          { name: data.brandName, url: "" },
          { name: "메뉴", url: "/menu" },
        ])}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-12">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Menu</p>
          <h1 className="text-3xl font-semibold">메뉴</h1>
          <p className="text-sm text-muted-foreground">
            가격은 변동될 수 있습니다. 매장 메뉴판이 최신 기준입니다.
          </p>
        </header>

        {cakes.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">케이크</h2>
            <ul className="divide-y">
              {cakes.map((m) => (
                <li key={m.name} className="py-3 flex items-baseline justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {m.name}
                      {m.name.includes("[P]") ? (
                        <Badge variant="outline" className="ml-2 text-[10px]">참고</Badge>
                      ) : null}
                    </p>
                    {m.description ? (
                      <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                    ) : null}
                  </div>
                  {m.price ? (
                    <span className="font-mono text-sm shrink-0">{m.price}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {drinks.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">음료</h2>
            <ul className="divide-y">
              {drinks.map((m) => (
                <li key={m.name} className="py-3 flex items-baseline justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{m.name}</p>
                    {m.description ? (
                      <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                    ) : null}
                  </div>
                  {m.price ? (
                    <span className="font-mono text-sm shrink-0">{m.price}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: "rufruf" }, { slug: "rufruf-mangwon" }]
}
