import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QueueCard } from "./queue-card"
import { getContentQueue } from "@/lib/queries"
import type { ContentQueueStatus } from "@/lib/types"

export const dynamic = "force-dynamic"

const COLUMNS: { status: ContentQueueStatus; title: string; description: string; tone: "outline" | "default" | "destructive" | "success" }[] = [
  { status: "pending", title: "검토 대기", description: "내 승인 필요", tone: "outline" },
  { status: "approved", title: "승인됨", description: "게재 준비", tone: "default" },
  { status: "published", title: "게재 완료", description: "라이브", tone: "success" },
  { status: "rejected", title: "반려", description: "재검토 필요", tone: "destructive" },
]

export default async function QueuePage() {
  const all = await getContentQueue()

  const byStatus = COLUMNS.reduce<Record<ContentQueueStatus, typeof all>>((acc, c) => {
    acc[c.status] = all.filter((x) => x.status === c.status)
    return acc
  }, {} as Record<ContentQueueStatus, typeof all>)

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10 space-y-6">
      <header className="space-y-2">
        <Link href="/ops" className="text-sm text-muted-foreground hover:text-foreground">
          ← 운영자 콘솔
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold">콘텐츠 큐</h1>
          <Badge variant="outline" className="font-mono">{all.length}건 전체</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          답변 블록 / FAQ / 블로그 / 소셜 / Schema 게재 워크플로 — 카드를 클릭해 승인/반려.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = byStatus[col.status]
          return (
            <Card key={col.status} className="bg-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{col.title}</CardTitle>
                  <Badge variant={col.tone === "default" ? "secondary" : col.tone} className="font-mono">
                    {items.length}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{col.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-3">
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">비어있음</p>
                ) : (
                  items.map((it) => <QueueCard key={it.id} item={it} />)
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
