import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getActiveClients, getLatestSov } from "@/lib/queries"
import { formatDate, formatPct } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function OpsHome() {
  const clients = await getActiveClients()
  const withSov = await Promise.all(
    clients.map(async (c) => ({
      client: c,
      latest: await getLatestSov(c.slug),
    }))
  )

  const avgSov =
    withSov.length === 0
      ? null
      : withSov.reduce((s, x) => s + (x.latest?.sov_percent ?? 0), 0) /
        withSov.length

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Operations
        </p>
        <h1 className="text-3xl font-semibold">운영자 콘솔</h1>
        <p className="text-muted-foreground">
          활성 클라이언트 {clients.length}명 · 평균 SOV{" "}
          <span className="font-mono">{formatPct(avgSov)}</span>
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>활성 클라이언트</CardDescription>
            <CardTitle className="text-3xl font-mono">{clients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>평균 SOV (전체)</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {formatPct(avgSov)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>이번 주</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">클라이언트</h2>
          <nav className="flex gap-3 text-sm text-muted-foreground">
            <Link href="/ops/queue" className="hover:text-foreground">
              콘텐츠 큐 →
            </Link>
            <Link href="/ops/outreach" className="hover:text-foreground">
              매체 어프로치 →
            </Link>
          </nav>
        </div>

        {clients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              활성 클라이언트 없음
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {withSov.map(({ client, latest }) => (
              <Link key={client.slug} href={`/ops/clients/${client.slug}`}>
                <Card className="hover:border-foreground/40 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{client.brand_name}</span>
                        <Badge variant="outline">{client.slug}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {client.primary_query ?? "—"} · 온보딩{" "}
                        {formatDate(client.onboarded_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">SOV</p>
                      <p className="text-2xl font-mono font-semibold">
                        {latest ? formatPct(latest.sov_percent) : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {latest
                          ? `${latest.cited_us}/${latest.queries_success}건`
                          : "측정 전"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
