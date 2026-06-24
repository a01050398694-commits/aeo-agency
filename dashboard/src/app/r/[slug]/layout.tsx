import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSiteData } from "@/lib/site-data/rufruf-mangwon"
import { SiteNav, SiteFooter } from "@/components/site/site-nav"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = getSiteData(slug)
  if (!data) return { title: "Not found" }
  return {
    title: `${data.brandName} — ${data.shortDescription}`,
    description: data.longDescription.slice(0, 150),
    keywords: data.keywords,
    openGraph: {
      title: `${data.brandName} — ${data.shortDescription}`,
      description: data.shortDescription,
      locale: "ko_KR",
      type: "website",
    },
  }
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getSiteData(slug)
  if (!data) notFound()
  const base = `/r/${slug}`

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav data={data} base={base} />
      <main className="flex-1">{children}</main>
      <SiteFooter data={data} base={base} />
    </div>
  )
}
