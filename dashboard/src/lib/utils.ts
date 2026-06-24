import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPct(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—"
  return `${n.toFixed(digits)}%`
}

export function formatDate(s: string | Date | null | undefined): string {
  if (!s) return "—"
  const d = typeof s === "string" ? new Date(s) : s
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function formatRelativeKo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  const diffMs = Date.now() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return "방금 전"
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}시간 전`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}일 전`
  return formatDate(d)
}
