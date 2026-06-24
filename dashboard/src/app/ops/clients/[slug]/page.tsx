import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SovLineChart } from "@/components/sov-line-chart"
import {
  getClient,
  getLatestSov,
  getSovHistory,
  getContentQueue,
} from "@/lib/queries"
import { formatDate, formatPct } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function ClientDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const client = await getClient(slug)
  if (!client) notFound()

  const [latest, history, queue] = await Promise.all([
    getLatestSov(slug),
    getSovHistory(slug, 30),
    getContentQueue(slug),
  ])

  const competitorTop = latest?.competitor_top
    ? Object.entries(latest.competitor_top)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5)
    : []

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground">
          ← 운영자 콘솔
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold">{client.brand_name}</h1>
          <Badge variant="outline">{client.slug}</Badge>
          <Badge
            variant={
              client.status === "active"
                ? "success"
                : client.status === "paused"
                ? "warning"
                : "destructive"
            }
          >
            {client.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          타깃 쿼리:{" "}
          <span className="font-mono text-foreground">{client.primary_query ?? "—"}</span>
          {client.primary_url ? (
            <>
              {" "}
              ·{" "}
              <a
                href={client.primary_url}
                target="_blank"
                className="underline hover:text-foreground"
                rel="noopener"
              >
                primary URL
              </a>
            </>
          ) : null}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>최근 SOV</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {latest ? formatPct(latest.sov_percent) : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>우리 인용</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {latest ? `${latest.cited_us}/${latest.queries_success}` : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>측정 실패</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {latest ? latest.queries_failed : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>온보딩</CardDescription>
            <CardTitle className="text-base font-mono">
              {formatDate(client.onboarded_at)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">SOV 추이 (30일)</h2>
        <Card>
          <CardContent className="pt-6">
            <SovLineChart data={history} target={30} />
            <p className="text-xs text-muted-foreground mt-2">
              점선: 3개월 목표 30%
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>경쟁사 인용 TOP 5</CardTitle>
            <CardDescription>최근 측정 답변에서 등장한 빈도</CardDescription>
          </CardHeader>
          <CardContent>
            {competitorTop.length === 0 ? (
              <p className="text-sm text-muted-foreground">데이터 없음</p>
            ) : (
              <ul className="space-y-2">
                {competitorTop.map(([name, cnt]) => (
                  <li key={name} className="flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <Badge variant="secondary" className="font-mono">{String(cnt)}건</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>콘텐츠 큐</CardTitle>
            <CardDescription>{queue.length}건 (전체 상태)</CardDescription>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">콘텐츠 없음</p>
            ) : (
              <ul className="space-y-2">
                {queue.slice(0, 6).map((q) => (
                  <li key={q.id} className="flex items-center justify-between text-sm gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{q.title ?? q.target_query}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {q.content_type} · {formatDate(q.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        q.status === "approved" || q.status === "published"
                          ? "success"
                          : q.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {q.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
