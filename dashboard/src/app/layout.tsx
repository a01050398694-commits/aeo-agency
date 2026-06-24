import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AEO Agency Ops",
  description: "Gemini AEO 자동화 운영 대시보드",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
