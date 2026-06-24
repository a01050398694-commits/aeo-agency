"use client"

import { useState, useTransition } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { changeQueueStatus } from "./actions"
import type { ContentQueueItem, ContentQueueStatus } from "@/lib/types"
import { formatRelativeKo } from "@/lib/utils"

const NEXT_ACTIONS: Record<
  ContentQueueStatus,
  { next: ContentQueueStatus; label: string; variant: "default" | "destructive" | "outline" | "secondary" }[]
> = {
  pending: [
    { next: "approved", label: "승인", variant: "default" },
    { next: "rejected", label: "반려", variant: "destructive" },
  ],
  approved: [
    { next: "published", label: "게재", variant: "default" },
    { next: "pending", label: "되돌리기", variant: "outline" },
  ],
  rejected: [{ next: "pending", label: "재검토", variant: "outline" }],
  published: [],
}

const TYPE_LABEL: Record<string, string> = {
  answer_block: "답변블록",
  faq: "FAQ",
  blog: "블로그",
  social: "소셜",
  schema: "스키마",
}

export function QueueCard({ item }: { item: ContentQueueItem }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const actions = NEXT_ACTIONS[item.status] ?? []

  return (
    <Card className="gap-3 py-4">
      <CardContent className="space-y-2 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">
              {item.title ?? item.target_query ?? "(제목 없음)"}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.client_slug} · {TYPE_LABEL[item.content_type] ?? item.content_type}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            #{item.id}
          </Badge>
        </div>

        {item.target_query && item.title ? (
          <p className="text-xs text-muted-foreground">
            🎯 <span className="font-mono">{item.target_query}</span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {open ? "▾ 본문 숨기기" : "▸ 본문 보기"}
        </button>

        {open && item.body_md ? (
          <div className="prose prose-sm dark:prose-invert max-w-none border-l-2 border-border pl-3 text-xs">
            <ReactMarkdown>{item.body_md}</ReactMarkdown>
          </div>
        ) : null}

        {item.reviewer_note ? (
          <p className="text-xs text-warning border-l-2 border-warning pl-2">
            💬 {item.reviewer_note}
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground">
            {formatRelativeKo(item.created_at)}
          </span>
          {actions.length > 0 ? (
            <div className="flex gap-1">
              {actions.map((a) => (
                <Button
                  key={a.next}
                  size="sm"
                  variant={a.variant}
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        await changeQueueStatus(item.id, a.next)
                      } catch (e) {
                        console.error(e)
                        alert("상태 변경 실패: " + (e instanceof Error ? e.message : String(e)))
                      }
                    })
                  }
                  className="h-7 text-xs px-2"
                >
                  {a.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
