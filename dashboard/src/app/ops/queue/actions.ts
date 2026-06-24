"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import type { ContentQueueStatus } from "@/lib/types"

const ALLOWED: ContentQueueStatus[] = ["pending", "approved", "rejected", "published"]

export async function changeQueueStatus(
  id: number,
  next: ContentQueueStatus,
  note?: string
) {
  if (!ALLOWED.includes(next)) {
    throw new Error(`잘못된 status: ${next}`)
  }
  const supa = createServiceClient()
  const update: Record<string, unknown> = {
    status: next,
    reviewer_note: note ?? null,
  }
  if (next === "approved" || next === "rejected") {
    update.reviewed_at = new Date().toISOString()
  } else if (next === "published") {
    update.published_at = new Date().toISOString()
  }
  const { error } = await supa.from("content_queue").update(update).eq("id", id)
  if (error) throw error
  revalidatePath("/ops/queue")
  revalidatePath("/ops")
}
