import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOutreach } from "@/lib/queries"
import { createServiceClient } from "@/lib/supabase/server"
import { formatDate, formatRelativeKo } from "@/lib/utils"
import type { OutreachStatus, MediaTarget } from "@/lib/types"

export const dynamic = "force-dynamic"

const STATUS_LABEL: Record<OutreachStatus, string> = {
  pending: "대기 (Gmail draft)",
  sent: "발송됨",
  bounced: "반송",
  replied_positive: "긍정 회신",
  replied_negative: "거절",
  no_response: "무응답",
  accepted: "채택!",
}

const STATUS_TONE: Record<OutreachStatus, "outline" | "default" | "secondary" | "destructive" | "success" | "warning"> = {
  pending: "outline",
  sent: "secondary",
  bounced: "destructive",
  replied_positive: "success",
  replied_negative: "destructive",
  no_response: "warning",
  accepted: "success",
}

export default async function OutreachPage() {
  const items = await getOutreach()
  const supa = createServiceClient()
  const { data: targets } = await supa.from("media_targets").select("*").order("priority", { ascending: false })
  const allTargets = (targets ?? []) as MediaTarget[]

  const grouped = items.reduce<Record<OutreachStatus, typeof items>>((acc, x) => {
    const k = x.status
    if (!acc[k]) acc[k] = []
    acc[k].push(x)
    return acc
  }, {} as Record<OutreachStatus, typeof items>)

  const totalContacts = allTargets.filter((t) => t.contact_email).length

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground">
          ← 운영자 콘솔
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold">매체 어프로치</h1>
          <Badge variant="outline" className="font-mono">{items.length}건 이력</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          매체 {allTargets.length}개 카탈로그 · 컨택 이메일 확보 {totalContacts}건 · Gmail Drafts 자동 생성
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        {(["pending", "sent", "replied_positive", "accepted"] as OutreachStatus[]).map((s) => (
          <Card key={s}>
            <CardHeader>
              <CardDescription>{STATUS_LABEL[s]}</CardDescription>
              <CardTitle className="text-3xl font-mono">
                {(grouped[s] ?? []).length}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">진행 중 어프로치</h2>
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              아직 어프로치 없음 — <code className="text-xs">python scripts/outreach/draft_pitches.py</code>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((x) => (
              <Card key={x.id}>
                <CardContent className="flex items-center justify-between gap-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{x.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      → {x.recipient_name ?? x.recipient_email} ({x.recipient_email}) · {x.client_slug ?? "—"}
                    </p>
                    {x.sent_at ? (
                      <p className="text-[11px] text-muted-foreground">
                        발송 {formatRelativeKo(x.sent_at)}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        생성 {formatRelativeKo(x.created_at)} · Gmail Drafts 확인
                      </p>
                    )}
                  </div>
                  <Badge variant={STATUS_TONE[x.status]}>{STATUS_LABEL[x.status]}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">매체 카탈로그 ({allTargets.length})</h2>
        <Card>
          <CardContent className="px-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 px-4">매체</th>
                  <th className="py-2 px-4">분류</th>
                  <th className="py-2 px-4">컨택</th>
                  <th className="py-2 px-4 text-right">우선순위</th>
                </tr>
              </thead>
              <tbody>
                {allTargets.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="py-2 px-4 font-medium">
                      {t.name}
                      {t.domain ? (
                        <span className="text-muted-foreground text-xs ml-2">{t.domain}</span>
                      ) : null}
                    </td>
                    <td className="py-2 px-4">
                      <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    </td>
                    <td className="py-2 px-4 text-xs">
                      {t.contact_email ? (
                        <span className="font-mono">{t.contact_email}</span>
                      ) : (
                        <span className="text-muted-foreground">미발굴</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-xs">{t.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
