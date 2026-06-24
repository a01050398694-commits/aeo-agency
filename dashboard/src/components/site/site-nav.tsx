import Link from "next/link"
import type { CafeSiteData } from "@/lib/site-data/types"

export function SiteNav({ data, base }: { data: CafeSiteData; base: string }) {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href={base} className="font-semibold text-lg tracking-tight">
          {data.brandName}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href={`${base}/menu`} className="hover:text-foreground">메뉴</Link>
          <Link href={`${base}/faq`} className="hover:text-foreground">FAQ</Link>
          <Link href={`${base}/location`} className="hover:text-foreground">오시는길</Link>
          <Link href={`${base}/contact`} className="hover:text-foreground">문의</Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter({ data, base }: { data: CafeSiteData; base: string }) {
  return (
    <footer className="border-t mt-16 bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8 text-sm space-y-4">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold mb-2">{data.brandName}</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {data.address.city} {data.address.region} {data.address.street}
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2 text-xs uppercase">메뉴</p>
            <ul className="text-muted-foreground text-xs space-y-1">
              <li><Link href={`${base}/menu`} className="hover:text-foreground">전체 메뉴</Link></li>
              <li><Link href={`${base}/faq`} className="hover:text-foreground">자주 묻는 질문</Link></li>
              <li><Link href={`${base}/location`} className="hover:text-foreground">오시는길</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2 text-xs uppercase">외부 링크</p>
            <ul className="text-muted-foreground text-xs space-y-1">
              <li>
                <a href={data.naverPlaceUrl} target="_blank" rel="noopener" className="hover:text-foreground">
                  네이버 플레이스 ↗
                </a>
              </li>
              {data.press.slice(0, 2).map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener" className="hover:text-foreground">
                    {p.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-4 border-t">
          © {new Date().getFullYear()} {data.brandName}
        </p>
      </div>
    </footer>
  )
}
