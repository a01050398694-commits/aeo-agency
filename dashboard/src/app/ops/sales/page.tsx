import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProspects } from "@/lib/queries"
import { formatDate, formatPct, formatRelativeKo } from "@/lib/utils"

export const dynamic = "force-dynamic"

const STATUS_TONE: Record<string, "outline" | "secondary" | "success" | "destructive" | "warning"> = {
  discovered: "outline",
  contacted: "secondary",
  interested: "warning",
  meeting_scheduled: "warning",
  negotiating: "warning",
  won: "success",
  lost: "destructive",
}

const STATUS_LABEL: Record<string, string> = {
  discovered: "발굴",
  contacted: "접촉",
  interested: "관심",
  meeting_scheduled: "미팅 예약",
  negotiating: "협상",
  won: "계약!",
  lost: "실패",
}

export default async function SalesPage() {
  const prospects = await getProspects()
  const total = prospects.length
  const byStatus = prospects.reduce<Record<string, typeof prospects>>((acc, p) => {
    if (!acc[p.status]) acc[p.status] = []
    acc[p.status].push(p)
    return acc
  }, {})
  const avgSov =
    prospects.filter((p) => p.baseline_sov !== null).reduce((s, p) => s + Number(p.baseline_sov || 0), 0) /
    Math.max(1, prospects.filter((p) => p.baseline_sov !== null).length)

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground">
          ← 운영자 콘솔
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold">영업 / 진단</h1>
          <Badge variant="outline" className="font-mono">{total}건</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          잠재 클라이언트 발굴 + 자동 진단 결과 + 영업 단계 추적
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>전체 prospect</CardDescription>
            <CardTitle className="text-3xl font-mono">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>평균 베이스라인 SOV</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {Number.isFinite(avgSov) ? formatPct(avgSov) : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>관심·협상</CardDescription>
            <CardTitle className="text-3xl font-mono">
              {((byStatus.interested?.length ?? 0) +
                (byStatus.meeting_scheduled?.length ?? 0) +
                (byStatus.negotiating?.length ?? 0))}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>계약 (won)</CardDescription>
            <CardTitle className="text-3xl font-mono">{byStatus.won?.length ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Prospect 목록</h2>
        {total === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground space-y-2">
              <p>prospect 없음</p>
              <p className="text-xs">
                <code>python scripts/sales/diagnose.py --name &quot;채널톡&quot; --domain channel.io --industry &quot;B2B SaaS&quot; --queries ...</code>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {prospects.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between gap-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{p.business_name}</span>
                      {p.domain ? <code className="text-xs text-muted-foreground">{p.domain}</code> : null}
                      <Badge variant="outline" className="text-[10px]">{p.industry ?? "—"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      베이스라인 {p.baseline_date ? formatDate(p.baseline_date) : "—"}
                      {p.baseline_sov !== null ? ` · SOV ${formatPct(p.baseline_sov)}` : ""}
                      {p.contact_email ? ` · ${p.contact_email}` : ""}
                    </p>
                    {p.diagnosis_pdf ? (
                      <p className="text-xs">
                        <Link href={p.diagnosis_pdf} className="underline text-foreground/70 hover:text-foreground">
                          진단 보고서 →
                        </Link>
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={STATUS_TONE[p.status] ?? "outline"}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground">
                      {formatRelativeKo(p.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
