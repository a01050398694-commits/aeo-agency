#!/usr/bin/env python3
"""
영업 진단 도구 — 잠재 클라이언트 자동 측정 + 보고서 생성.

사용:
  python scripts/sales/diagnose.py --name "채널톡" --domain channel.io --industry "B2B SaaS" \\
    --queries "한국 고객지원 SaaS 추천" "B2B 채팅 솔루션 비교" "한국 인사이드 세일즈 도구"

산출물:
  - Gemini 측정 결과 (모든 쿼리에서 등장 여부 + 경쟁사)
  - prospects 테이블 row 적재 (baseline_sov 자동 계산)
  - HTML 진단 보고서 (URL: /diagnose/[id])
  - 운영자 알림 (Telegram + Email)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.notify.channels import load_env, notify_both  # noqa: E402

KST = timezone(timedelta(hours=9))
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


def call_gemini(api_key: str, query: str, retries: int = 3) -> dict:
    body = {
        "contents": [{"parts": [{"text": query}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 1024},
    }
    data = json.dumps(body).encode("utf-8")
    headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}
    delay = 1.0
    for _ in range(retries):
        try:
            req = urllib.request.Request(GEMINI_URL, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(delay); delay *= 2; continue
            return {"error": f"HTTP {e.code}"}
        except Exception as e:
            return {"error": str(e)}
    return {"error": "max retries"}


def parse_answer(payload: dict) -> tuple[str, list[str]]:
    if "error" in payload:
        return "", []
    try:
        c = payload.get("candidates", [{}])[0]
        parts = c.get("content", {}).get("parts", []) or []
        text = "".join(p.get("text", "") for p in parts)
        grounding = c.get("groundingMetadata") or {}
        chunks = grounding.get("groundingChunks", []) or []
        cites = []
        for ch in chunks:
            w = ch.get("web") or {}
            if w.get("title"):
                cites.append(w["title"])
        return text, cites
    except Exception:
        return "", []


def detect_mentions(text: str, brand_patterns: list[str]) -> bool:
    haystack = text.lower()
    for p in brand_patterns:
        if p.lower() in haystack:
            return True
    return False


def extract_competitors(text: str, top_n: int = 5) -> list[str]:
    """답변에서 ** ** 또는 카페·회사 명사 패턴으로 경쟁사 추출."""
    bolds = re.findall(r"\*\*([^*\n]{2,40})\*\*", text)
    cleaned = []
    for b in bolds:
        b = b.strip(" .,:")
        # 너무 짧거나 일반 단어 필터
        if len(b) < 2 or b in ("1", "2", "3", "4", "5", "참고", "주의"):
            continue
        cleaned.append(b)
    # 중복 제거 + 등장 순서 보존
    seen, out = set(), []
    for c in cleaned:
        if c.lower() not in seen:
            seen.add(c.lower())
            out.append(c)
        if len(out) >= top_n:
            break
    return out


def supa_post(env: dict, table: str, body: dict) -> dict:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{table}",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        res = json.loads(r.read())
        return res[0] if isinstance(res, list) and res else res


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--domain", required=True)
    ap.add_argument("--industry", required=True)
    ap.add_argument("--queries", nargs="+", required=True, help="카테고리 쿼리 3~10개")
    ap.add_argument("--brand-patterns", nargs="*", default=[], help="브랜드 별칭 매칭 패턴 (기본: name + domain prefix)")
    ap.add_argument("--rpm", type=int, default=5, help="분당 요청 (무료 grounding 안전치)")
    args = ap.parse_args()

    env = load_env()
    api_key = env.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("❌ GEMINI_API_KEY 누락")

    patterns = args.brand_patterns or [
        args.name,
        args.domain,
        args.domain.split(".")[0],
    ]

    today = datetime.now(KST).date()
    print(f"🔍 진단 시작 — {args.name} ({args.domain})")
    print(f"   카테고리: {args.industry}")
    print(f"   쿼리: {len(args.queries)}개, 매칭 패턴: {patterns}")
    print()

    results = []
    interval = 60.0 / max(1, args.rpm)
    cited_count = 0
    all_competitors: dict[str, int] = {}

    for i, q in enumerate(args.queries, 1):
        t0 = time.time()
        payload = call_gemini(api_key, q)
        text, cites = parse_answer(payload)
        cited = detect_mentions(text, patterns) if text else False
        comps = extract_competitors(text) if text else []
        for c in comps:
            all_competitors[c] = all_competitors.get(c, 0) + 1

        if cited:
            cited_count += 1
            mark = "✓"
        else:
            mark = " "

        print(f"  [{i:2d}/{len(args.queries)}] {mark} {q[:60]}")
        if comps[:3]:
            print(f"           답변 인용: {', '.join(comps[:3])}")

        results.append({
            "query": q,
            "answer_text": text,
            "cited_us": cited,
            "competitors": comps,
            "citation_titles": cites,
        })

        elapsed = time.time() - t0
        if i < len(args.queries) and elapsed < interval:
            time.sleep(interval - elapsed)

    sov = (cited_count / len([r for r in results if r["answer_text"]])) * 100 if any(r["answer_text"] for r in results) else 0
    top_competitors = sorted(all_competitors.items(), key=lambda x: -x[1])[:8]

    # prospect 적재 (upsert)
    diagnosis_path = f"/diagnose/{args.domain.replace('.','-')}"
    prospect = supa_post(env, "prospects", {
        "business_name": args.name,
        "domain": args.domain,
        "industry": args.industry,
        "baseline_sov": round(sov, 2),
        "baseline_date": str(today),
        "diagnosis_pdf": diagnosis_path,
        "source": "auto-diagnose",
        "status": "discovered",
        "notes": json.dumps({
            "queries": args.queries,
            "top_competitors": top_competitors,
            "cited_count": cited_count,
            "results_summary": [{"q": r["query"], "cited": r["cited_us"], "comps": r["competitors"][:3]} for r in results],
        }, ensure_ascii=False),
    })

    # 보고서 데이터 저장 (브라우저로 열어볼 수 있게)
    report_dir = ROOT / "tmp" / "diagnoses"
    report_dir.mkdir(parents=True, exist_ok=True)
    report_data = {
        "name": args.name,
        "domain": args.domain,
        "industry": args.industry,
        "baseline_sov": round(sov, 2),
        "baseline_date": str(today),
        "cited_count": cited_count,
        "queries_total": len(args.queries),
        "top_competitors": top_competitors,
        "results": results,
        "prospect_id": prospect.get("id") if isinstance(prospect, dict) else None,
    }
    json_path = report_dir / f"{args.domain.replace('.','-')}.json"
    json_path.write_text(json.dumps(report_data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n💾 진단 데이터 저장: {json_path}")

    # 알림 발사
    text_msg = (
        f"🎯 진단 완료 — {args.name}\n\n"
        f"도메인: {args.domain}\n"
        f"산업: {args.industry}\n"
        f"베이스라인 SOV: *{sov:.2f}%* ({cited_count}/{len(args.queries)} 쿼리)\n\n"
        f"답변에 자주 등장한 경쟁사:\n"
        + "\n".join(f"  • {c} ({n}회)" for c, n in top_competitors[:5])
        + f"\n\n→ 대시보드: /ops/sales"
    )
    notify_both(env, f"[진단] {args.name} — SOV {sov:.1f}%", text_msg)

    print()
    print("=" * 60)
    print(f"📊 SOV: {sov:.2f}% ({cited_count}/{len(args.queries)})")
    print(f"🥊 경쟁사 TOP 5:")
    for c, n in top_competitors[:5]:
        print(f"   - {c}: {n}회")
    print(f"💾 prospect_id: {prospect.get('id') if isinstance(prospect, dict) else '?'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
