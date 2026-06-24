#!/usr/bin/env python3
"""
IndexNow API — Bing/Yandex/Naver 즉시 인덱싱 푸시.

사용:
  python scripts/seo/indexnow.py --host aeo-agency.vercel.app
  python scripts/seo/indexnow.py --host <host> --urls /r/rufruf /r/rufruf/menu

호스트 검증:
  https://<host>/<INDEXNOW_KEY>.txt 가 키와 동일 텍스트 반환해야 함.
  dashboard/src/app/<KEY>.txt/route.ts 가 자동 제공.
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.notify.channels import load_env  # noqa: E402

DEFAULT_PATHS = [
    "/r/rufruf",
    "/r/rufruf/menu",
    "/r/rufruf/faq",
    "/r/rufruf/location",
    "/r/rufruf/contact",
    "/r/rufruf/sitemap.xml",
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", required=True, help="예: aeo-agency.vercel.app")
    ap.add_argument("--urls", nargs="*", default=DEFAULT_PATHS, help="path 리스트 (기본: 망원 사이트 6개)")
    args = ap.parse_args()

    env = load_env()
    key = env.get("INDEXNOW_KEY")
    if not key:
        sys.exit("❌ INDEXNOW_KEY 누락")

    host = args.host.replace("https://", "").replace("http://", "").rstrip("/")
    full_urls = [f"https://{host}{p}" for p in args.urls]

    # 1. 키 검증 (호스트가 키 파일 제공하는지)
    verify_url = f"https://{host}/{key}.txt"
    print(f"🔑 키 검증: {verify_url}")
    try:
        with urllib.request.urlopen(verify_url, timeout=10) as r:
            content = r.read().decode("utf-8").strip()
            if content != key:
                sys.exit(f"❌ 키 불일치: got {content[:20]}...")
            print(f"   ✅ {content[:8]}... OK")
    except Exception as e:
        sys.exit(f"❌ 키 파일 접근 실패: {e}")

    # 2. IndexNow 푸시 (Bing 메인)
    body = {
        "host": host,
        "key": key,
        "keyLocation": f"https://{host}/{key}.txt",
        "urlList": full_urls,
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        "https://api.indexnow.org/IndexNow",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            print(f"✅ IndexNow OK — HTTP {r.status}, {len(full_urls)}개 URL 푸시")
            return 0
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:300]
        print(f"❌ HTTP {e.code}: {body}")
        # 422 = URL이 같은 host 아님, 400 = 키 위치 잘못
        return 1
    except Exception as e:
        print(f"❌ {type(e).__name__}: {e}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
