import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { THEBOM_POSTS } from "@/lib/pro-data/thebom-blog"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  return Object.keys(PRO_BY_SLUG).map((slug) => ({ slug }))
}

export default async function ProBlog({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${siteUrl}/blog#blog`,
          name: `${data.brandName} 세무 블로그`,
          description: "세무법인 더봄이 운영하는 세무 실무 블로그. 자영업자·숙박업·양도·상속·증여 세무 가이드.",
          url: `${siteUrl}/blog`,
          inLanguage: "ko",
          publisher: {
            "@type": "Organization",
            name: data.brandName,
            url: data.website,
            founder: {
              "@type": "Person",
              name: data.founder.name,
              jobTitle: data.founder.title,
            },
          },
          blogPost: THEBOM_POSTS.map((p) => ({
            "@type": "BlogPosting",
            "@id": `${siteUrl}/blog/${p.slug}`,
            headline: p.title,
            description: p.description,
            datePublished: p.publishedAt,
            dateModified: p.updatedAt || p.publishedAt,
            articleSection: p.category,
          })),
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandName, url: "" },
          { name: "세무 블로그", url: "/blog" },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <header className="space-y-3 border-b pb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">세무 블로그</p>
          <h1 className="text-3xl font-semibold">{data.brandName} 세무 실무 블로그</h1>
          <p className="text-sm text-muted-foreground">
            홍대·마포 자영업자·숙박업 사업자에 도움이 될 세무 실무 가이드.
            대표 세무사 홍지영과 더봄 팀이 작성.
          </p>
        </header>

        <ul className="space-y-6">
          {THEBOM_POSTS.map((p) => (
            <li key={p.slug} className="border-b pb-6 space-y-2">
              <div className="text-xs text-muted-foreground space-x-2">
                <span>{p.publishedAt}</span>
                <span>·</span>
                <span>{p.category}</span>
              </div>
              <h2 className="text-xl font-semibold">
                <Link href={`/pro/${slug}/blog/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>
              <Link
                href={`/pro/${slug}/blog/${p.slug}`}
                className="text-xs text-foreground/60 hover:text-foreground underline"
              >
                전체 읽기 →
              </Link>
            </li>
          ))}
        </ul>

        <aside className="pt-8 border-t space-y-2 text-sm">
          <p className="font-semibold">개별 상담은 ☎ {data.phone}</p>
          <p className="text-foreground/70">
            <Link href={`/pro/${slug}/founder`} className="underline">홍지영 대표 세무사</Link> 직접 상담 가능 (첫 상담 무료).
          </p>
        </aside>
      </article>
    </>
  )
}
