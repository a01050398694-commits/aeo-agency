import { NextResponse } from "next/server"

// IndexNow 키 검증 파일
// https://www.bing.com/indexnow 등록 시 이 파일을 통해 호스트 권한 검증
export const dynamic = "force-static"

export async function GET() {
  return new NextResponse("f2f88cfbe500b8f7004c777bc8cb015a", {
    headers: { "Content-Type": "text/plain" },
  })
}
