/**
 * Supabase 테이블 타입 — DB 스키마와 일치.
 * (추후 supabase generate-typescript-types 로 자동화)
 */

export type ClientStatus = "active" | "paused" | "churned"

export type Client = {
  id: number
  slug: string
  status: ClientStatus
  brand_name: string
  primary_query: string | null
  primary_url: string | null
  naver_place_id: string | null
  onboarded_at: string
  created_at: string
  updated_at: string
}

export type SovMeasurement = {
  id: number
  client_slug: string
  measured_date: string
  engine: string
  queries_total: number
  queries_success: number
  queries_failed: number
  cited_us: number
  sov_percent: number
  competitor_top: Record<string, number>
  raw_json_path: string | null
  created_at: string
}

export type ContentQueueStatus = "pending" | "approved" | "rejected" | "published"

export type ContentQueueItem = {
  id: number
  client_slug: string
  content_type: "answer_block" | "faq" | "blog" | "social" | "schema"
  target_query: string | null
  title: string | null
  body_md: string | null
  schema_json: Record<string, unknown> | null
  status: ContentQueueStatus
  reviewer_note: string | null
  created_at: string
  reviewed_at: string | null
  published_at: string | null
}

export type OutreachStatus =
  | "pending"
  | "sent"
  | "bounced"
  | "replied_positive"
  | "replied_negative"
  | "no_response"
  | "accepted"

export type Outreach = {
  id: number
  client_slug: string | null
  target_id: number | null
  recipient_email: string
  recipient_name: string | null
  subject: string
  body_md: string | null
  attachment_path: string | null
  sent_at: string | null
  sent_via: "gmail_mcp" | "manual"
  status: OutreachStatus
  reply_body: string | null
  reply_at: string | null
  followup_count: number
  created_at: string
  updated_at: string
}

export type MediaTarget = {
  id: number
  name: string
  domain: string | null
  contact_email: string | null
  contact_name: string | null
  category: "curation" | "press" | "blog" | "directory" | "other"
  industry: string[]
  language: string
  priority: number
  notes: string | null
  created_at: string
}

export type Prospect = {
  id: number
  business_name: string
  domain: string | null
  industry: string | null
  region: string
  contact_email: string | null
  contact_name: string | null
  contact_role: string | null
  source: string | null
  baseline_sov: number | null
  baseline_date: string | null
  diagnosis_pdf: string | null
  status:
    | "discovered"
    | "contacted"
    | "interested"
    | "meeting_scheduled"
    | "negotiating"
    | "won"
    | "lost"
  notes: string | null
  created_at: string
  updated_at: string
}

export type JobsLog = {
  id: number
  job_name: string
  client_slug: string | null
  started_at: string
  finished_at: string | null
  status: "running" | "succeeded" | "failed" | "partial"
  rows_processed: number | null
  rows_failed: number | null
  error_summary: string | null
  metadata: Record<string, unknown>
}
