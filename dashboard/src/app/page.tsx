import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">AEO Agency</h1>
          <p className="text-muted-foreground">
            Gemini / ChatGPT 답변 인용을 자동화·측정·보고하는 운영 시스템.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/ops">
            <Card className="hover:border-foreground/40 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>운영자 콘솔</CardTitle>
                <CardDescription>
                  모든 클라이언트 SOV · 콘텐츠 큐 · 매체 어프로치
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                /ops →
              </CardContent>
            </Card>
          </Link>

          <Link href="/mangwon-roughrough">
            <Card className="hover:border-foreground/40 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>클라이언트 포털 (샘플)</CardTitle>
                <CardDescription>
                  망원 러프러프 — 베이스라인 + 추이 차트
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                /mangwon-roughrough →
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className="text-xs text-muted-foreground pt-4 border-t">
          PLAN.md v1.1 · 4주 마스터플랜 자동 진행 중
        </footer>
      </div>
    </main>
  )
}
