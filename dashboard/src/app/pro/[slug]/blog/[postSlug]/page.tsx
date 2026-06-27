import { notFound } from "next/navigation"
import Link from "next/link"
import { getProSite, PRO_BY_SLUG } from "@/lib/pro-data/thebom-tax"
import { THEBOM_POSTS } from "@/lib/pro-data/thebom-blog"
import { ProJsonLd, buildProLd } from "@/components/site/pro-json-ld"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const out: { slug: string; postSlug: string }[] = []
  for (const slug of Object.keys(PRO_BY_SLUG)) {
    for (const p of THEBOM_POSTS) {
      out.push({ slug, postSlug: p.slug })
    }
  }
  return out
}

export default async function ProBlogPost({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>
}) {
  const { slug, postSlug } = await params
  const data = getProSite(slug)
  if (!data) notFound()
  const post = THEBOM_POSTS.find((p) => p.slug === postSlug)
  if (!post) notFound()

  const siteUrl = `https://a01050398694-commits.github.io/aeo-agency/pro/${slug}`
  const pageUrl = `${siteUrl}/blog/${postSlug}`
  const ld = buildProLd(data, siteUrl)

  return (
    <>
      <ProJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${pageUrl}#post`,
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          articleSection: post.category,
          keywords: post.keywords.join(", "),
          inLanguage: "ko",
          author: {
            "@type": "Person",
            name: data.founder.name,
            jobTitle: data.founder.title,
            worksFor: { "@type": "Organization", name: data.brandName, url: data.website },
          },
          publisher: {
            "@type": "Organization",
            name: data.brandName,
            url: data.website,
            address: {
              "@type": "PostalAddress",
              streetAddress: data.address.street,
              addressLocality: data.address.region,
              addressRegion: data.address.city,
              addressCountry: data.address.country,
            },
            telephone: data.phone,
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        }}
      />
      <ProJsonLd
        json={ld.breadcrumb([
          { name: data.brandName, url: "" },
          { name: "세무 블로그", url: "/blog" },
          { name: post.title.slice(0, 50), url: `/blog/${postSlug}` },
        ])}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
        <nav className="text-xs text-muted-foreground">
          <Link href={`/pro/${slug}`} className="hover:underline">{data.brandName}</Link>
          {" / "}
          <Link href={`/pro/${slug}/blog`} className="hover:underline">세무 블로그</Link>
        </nav>

        <header className="space-y-3 border-b pb-6">
          <div className="text-xs text-muted-foreground space-x-2">
            <span>{post.publishedAt}</span>
            <span>·</span>
            <span>{post.category}</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight">{post.title}</h1>
          <p className="text-sm text-muted-foreground">{post.description}</p>
          <p className="text-xs text-muted-foreground">
            글쓴이: <Link href={`/pro/${slug}/founder`} className="underline">{data.founder.name} {data.founder.title}</Link>
          </p>
        </header>

        <div className="space-y-8">
          {post.sections.map((s, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-xl font-semibold">{s.h}</h2>
              <p className="text-base leading-relaxed text-foreground/85">{s.p}</p>
            </section>
          ))}
        </div>

        <aside className="pt-8 border-t space-y-4">
          <h3 className="text-base font-semibold">개별 상담은 무료입니다</h3>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>📍 {data.address.city} {data.address.region} {data.address.street}</li>
            <li>☎ {data.phone} (평일 9:00-18:00)</li>
            <li>🌐 {data.website}</li>
          </ul>
          <a
            href={`tel:${data.phone}`}
            className="inline-flex items-center px-5 py-2.5 bg-foreground text-background rounded-md font-medium"
          >
            ☎ {data.phone} 전화하기
          </a>
        </aside>

        <section className="pt-6 border-t">
          <h3 className="text-base font-semibold mb-3">다른 글</h3>
          <ul className="text-sm space-y-1">
            {THEBOM_POSTS.filter((p) => p.slug !== postSlug).slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/pro/${slug}/blog/${p.slug}`}
                  className="text-foreground/70 hover:text-foreground hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  )
}
