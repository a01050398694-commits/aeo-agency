import { notFound } from "next/navigation"
import Link from "next/link"
import { getCase, CASE_STUDIES } from "@/lib/case-studies/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JsonLd } from "@/components/site/json-ld"
import type { Metadata } from "next"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) return { title: "Case study not found" }
  return {
    title: `${c.title} — AEO Agency Case Study`,
    description: c.hero,
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) notFound()

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.hero,
    author: { "@type": "Organization", name: "AEO Agency" },
    datePublished: c.publishedAt,
    inLanguage: "ko",
    articleSection: "Case Study",
    about: c.industry,
  }

  return (
    <>
      <JsonLd json={articleLd} />

      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-3">
          <Link
            href="/agency/case-studies"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 모든 사례
          </Link>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{c.industry}</Badge>
            <Badge variant={c.status === "completed" ? "success" : "warning"}>
              {c.status === "completed" ? "완료" : "진행 중"}
            </Badge>
            <Badge variant="secondary">{c.duration}</Badge>
          </div>
          <h1 className="text-4xl font-semibold leading-tight">{c.title}</h1>
          <p className="text-lg text-muted-foreground">{c.hero}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">상황</h2>
          <p className="text-foreground/80 leading-relaxed">{c.problem}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">접근법</h2>
          <ol className="space-y-2">
            {c.approach.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-muted-foreground font-mono shrink-0 w-6">{i + 1}.</span>
                <span className="text-foreground/80">{a}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">결과</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {c.results.map((r) => (
              <Card key={r.metric}>
                <CardHeader>
                  <CardDescription className="text-xs">{r.metric}</CardDescription>
                  <CardTitle className="text-2xl font-mono">{r.value}</CardTitle>
                </CardHeader>
                {r.change ? (
                  <CardContent className="text-xs text-muted-foreground">
                    {r.change}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">타임라인</h2>
          <ul className="space-y-3">
            {c.timeline.map((t, i) => (
              <li key={i} className="flex gap-4 border-l-2 border-border pl-4 py-1">
                <span className="text-xs font-mono text-muted-foreground shrink-0 w-16 pt-0.5">
                  {t.day}
                </span>
                <span className="text-sm text-foreground/80">{t.what}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">배운 점</h2>
          <ul className="space-y-2">
            {c.takeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                <span className="text-foreground/40 shrink-0">●</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-8 border-t">
          <h2 className="text-xl font-semibold mb-3">비슷한 성과를 원하시면</h2>
          <Link
            href="/agency/contact"
            className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-md font-medium hover:opacity-90"
          >
            무료 진단 신청 →
          </Link>
        </section>
      </div>
    </>
  )
}
