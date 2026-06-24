import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getProSite } from "@/lib/pro-data/thebom-tax"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) return { title: "Not found" }
  return {
    title: `${data.brandName} — ${data.shortDescription}`,
    description: data.longDescription.slice(0, 150),
    keywords: data.keywords,
    openGraph: {
      title: `${data.brandName} — ${data.shortDescription}`,
      description: data.shortDescription,
      locale: "ko_KR",
    },
  }
}

export default async function ProLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const base = `/pro/${slug}`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href={base} className="font-semibold tracking-tight">
            {data.brandName}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href={`${base}/services`} className="hover:text-foreground">서비스</Link>
            <Link href={`${base}/faq`} className="hover:text-foreground">FAQ</Link>
            <Link href={`${base}/about`} className="hover:text-foreground">소개</Link>
            <Link href={`${base}/contact`} className="hover:text-foreground bg-foreground text-background px-3 py-1.5 rounded-md text-xs">
              상담
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-16 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-8 text-sm space-y-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-semibold">{data.brandName}</p>
              <p className="text-muted-foreground text-xs">{data.shortDescription}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-1">연락처</p>
              <p className="text-xs text-muted-foreground">
                {data.address.city} {data.address.region} {data.address.street}<br/>
                ☎ {data.phone}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-1">공식 사이트</p>
              <a href={data.website} target="_blank" rel="noopener" className="text-xs underline">
                {data.website} ↗
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
