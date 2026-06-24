import type { Metadata } from "next"
import Link from "next/link"
import { AGENCY } from "@/lib/agency/data"

export const metadata: Metadata = {
  title: `${AGENCY.name} — ${AGENCY.tagline}`,
  description: AGENCY.description.slice(0, 160),
  keywords: [
    "AEO",
    "Answer Engine Optimization",
    "AEO 대행",
    "GEO 컨설팅",
    "한국 AEO",
    "ChatGPT 노출",
    "Gemini 노출",
    "AI 검색 최적화",
    "B2B SaaS 마케팅",
  ],
  openGraph: {
    title: `${AGENCY.name} — ${AGENCY.tagline}`,
    description: AGENCY.description.slice(0, 200),
    locale: "ko_KR",
    type: "website",
  },
}

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/agency" className="font-semibold tracking-tight">
            AEO Agency
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/agency/services" className="hover:text-foreground">서비스</Link>
            <Link href="/agency/case-studies" className="hover:text-foreground">사례</Link>
            <Link href="/agency/pricing" className="hover:text-foreground">가격</Link>
            <Link href="/agency/about" className="hover:text-foreground">소개</Link>
            <Link
              href="/agency/contact"
              className="bg-foreground text-background px-3 py-1.5 rounded-md text-xs"
            >
              무료 진단
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-8 text-sm grid gap-4 sm:grid-cols-3">
          <div>
            <p className="font-semibold mb-1">{AGENCY.name}</p>
            <p className="text-muted-foreground text-xs">{AGENCY.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase mb-2">서비스</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><Link href="/agency/services">AEO 진단</Link></li>
              <li><Link href="/agency/services">풀패키지</Link></li>
              <li><Link href="/agency/pricing">가격</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase mb-2">연락</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>{AGENCY.founder.email}</li>
              <li><Link href="/agency/contact">무료 진단 신청</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
