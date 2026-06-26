#!/usr/bin/env python3
"""
Gemini SOV 측정 — 일일 자동화 스크립트
================================================
사용법:
  python scripts/daily/gemini_sov.py --client mangwon-roughrough
  python scripts/daily/gemini_sov.py --client mangwon-roughrough --date 2026-06-24
  python scripts/daily/gemini_sov.py --client mangwon-roughrough --limit 10  (테스트용)

출력:
  clients/<slug>/logs/sov-YYYY-MM-DD.json
  stdout: 요약 (전체 SOV%, 인용 쿼리 수, 경쟁사 비교)

엔진: Google Gemini 2.5 Flash + google_search grounding (무료 1,500 req/day)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

# --- 경로 ---
ROOT = Path(__file__).resolve().parents[2]
CLIENTS_DIR = ROOT / "clients"
ENV_FILE = ROOT / ".env"

# --- 한국 시간대 ---
KST = timezone(timedelta(hours=9))

# --- Gemini ---
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)


# ============================================================
# 환경변수 로딩 (python-dotenv 없이 stdlib만)
# ============================================================
def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


# ============================================================
# 클라이언트 로딩
# ============================================================
def load_client(slug: str) -> dict[str, Any]:
    """YAML 파싱은 stdlib에 없으므로 단순 라인 파싱 (의존성 0)."""
    profile_path = CLIENTS_DIR / slug / "profile.yaml"
    if not profile_path.exists():
        sys.exit(f"❌ 클라이언트 프로필 없음: {profile_path}")

    queries_path = CLIENTS_DIR / slug / "queries.txt"
    queries: list[str] = []
    if queries_path.exists():
        for line in queries_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            queries.append(line)

    competitors_path = CLIENTS_DIR / slug / "competitors.txt"
    competitors: list[dict[str, str]] = []
    if competitors_path.exists():
        for line in competitors_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "|" in line:
                name, _, url_or_domain = line.partition("|")
                competitors.append(
                    {"name": name.strip(), "ref": url_or_domain.strip()}
                )
            else:
                competitors.append({"name": line, "ref": ""})

    # 클라이언트별 매칭 패턴 — domain 우선(citations), name 보조(본문, 질문 미포함 시만)
    if slug == "mangwon-roughrough":
        domain_pats = ["place/2060513686", "rufruf.com"]
        name_pats = ["러프러프", "RUFRUF", "Ruf Ruf", "포은로 105-1"]
        place_id = "2060513686"
    elif slug == "thebom-tax":
        domain_pats = ["thebomtax.com", "thebomtax"]
        name_pats = ["세무법인 더봄", "홍지영", "월드컵북로 4길 47"]
        place_id = ""
    else:
        domain_pats = []
        name_pats = []
        place_id = ""

    return {
        "slug": slug,
        "queries": queries,
        "competitors": competitors,
        "domain_patterns": domain_pats,
        "name_patterns": name_pats,
        "naver_place_id": place_id,
    }


# ============================================================
# Gemini grounding 호출
# ============================================================
@dataclass
class QueryResult:
    query: str
    success: bool
    answer_text: str = ""
    citations: list[dict[str, str]] = field(default_factory=list)
    cited_us: bool = False
    cited_competitors: list[str] = field(default_factory=list)
    error: str = ""
    duration_ms: int = 0


def call_gemini(api_key: str, query: str, *, retries: int = 3) -> QueryResult:
    """Gemini 2.5 Flash + google_search grounding 호출."""
    body = {
        "contents": [{"parts": [{"text": query}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1024,
        },
    }
    data = json.dumps(body).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    }
    last_err = ""
    delay = 1.0
    for attempt in range(retries):
        t0 = time.time()
        try:
            req = urllib.request.Request(
                GEMINI_URL, data=data, headers=headers, method="POST"
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                raw = resp.read().decode("utf-8")
            payload = json.loads(raw)
            duration = int((time.time() - t0) * 1000)
            return parse_gemini_response(query, payload, duration)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:500]
            last_err = f"HTTP {e.code}: {err_body}"
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(delay)
                delay *= 2
                continue
            break
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
            time.sleep(delay)
            delay *= 2
    return QueryResult(query=query, success=False, error=last_err)


def parse_gemini_response(
    query: str, payload: dict[str, Any], duration_ms: int
) -> QueryResult:
    """응답에서 텍스트 + grounding citation URL 추출."""
    try:
        candidate = payload.get("candidates", [{}])[0]
    except (IndexError, AttributeError):
        return QueryResult(
            query=query,
            success=False,
            error="응답에 candidates 없음",
            duration_ms=duration_ms,
        )

    parts = candidate.get("content", {}).get("parts", []) or []
    answer = "".join(p.get("text", "") for p in parts).strip()

    citations: list[dict[str, str]] = []
    grounding = candidate.get("groundingMetadata") or {}
    chunks = grounding.get("groundingChunks", []) or []
    for ch in chunks:
        web = ch.get("web") or {}
        uri = web.get("uri", "")
        title = web.get("title", "")
        if uri:
            citations.append({"uri": uri, "title": title})

    return QueryResult(
        query=query,
        success=True,
        answer_text=answer,
        citations=citations,
        duration_ms=duration_ms,
    )


# ============================================================
# 인용 매칭
# ============================================================
def detect_mentions(
    result: QueryResult,
    domain_patterns: list[str],
    name_patterns: list[str],
    competitors: list[dict[str, str]],
) -> None:
    """SOV 카운트는 둘 중 하나일 때 True:
    1) citations URL의 도메인이 우리 패턴과 일치 (강력 신호)
    2) 본문에 우리 이름 패턴 — 단 질문에 그 패턴이 이미 있으면 False positive로 제외
    """
    q_low = result.query.lower()
    ans_low = result.answer_text.lower()

    url_hit = False
    for c in result.citations:
        uri_low = (c.get("uri", "") or "").lower()
        for pat in domain_patterns:
            if pat.lower() in uri_low:
                url_hit = True
                break
        if url_hit:
            break

    text_hit = False
    for pat in name_patterns:
        pat_low = pat.lower()
        if pat_low in q_low:
            continue
        if pat_low in ans_low:
            text_hit = True
            break

    result.cited_us = url_hit or text_hit

    cited: list[str] = []
    for comp in competitors:
        name = comp.get("name", "").strip()
        ref = comp.get("ref", "").strip()
        if not name:
            continue
        domain = re.sub(r"^https?://", "", ref).split("/")[0].lower() if ref else ""
        comp_url_hit = False
        if domain:
            for c in result.citations:
                if domain in (c.get("uri", "") or "").lower():
                    comp_url_hit = True
                    break
        comp_text_hit = False
        name_low = name.lower()
        if name_low not in q_low and name_low in ans_low:
            comp_text_hit = True
        if comp_url_hit or comp_text_hit:
            cited.append(name)
    result.cited_competitors = sorted(set(cited))


# ============================================================
# 메인
# ============================================================
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--client", required=True, help="클라이언트 슬러그")
    ap.add_argument("--date", default=None, help="YYYY-MM-DD (기본: 오늘 KST)")
    ap.add_argument("--limit", type=int, default=0, help="N개만 측정 (테스트용)")
    ap.add_argument(
        "--rpm", type=int, default=10, help="분당 최대 요청 (무료 10 RPM)"
    )
    args = ap.parse_args()

    env = load_env(ENV_FILE)
    api_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        sys.exit("❌ GEMINI_API_KEY 없음 (.env 또는 환경변수)")

    client = load_client(args.client)
    queries = client["queries"]
    if args.limit > 0:
        queries = queries[: args.limit]

    if not queries:
        sys.exit(f"❌ queries.txt가 비어있음")

    today = args.date or datetime.now(KST).strftime("%Y-%m-%d")
    print(f"🎯 클라이언트: {args.client}")
    print(f"📅 날짜: {today}")
    print(f"🔢 쿼리 수: {len(queries)}")
    print(f"⏱  Rate limit: {args.rpm} RPM ({60.0/args.rpm:.1f}초/쿼리)")
    print()

    results: list[QueryResult] = []
    interval = 60.0 / max(1, args.rpm)
    for i, q in enumerate(queries, 1):
        t0 = time.time()
        result = call_gemini(api_key, q)
        if result.success:
            detect_mentions(result, client["domain_patterns"], client["name_patterns"], client["competitors"])
        mark = "✓" if result.cited_us else " "
        comp_n = len(result.cited_competitors)
        status = "OK" if result.success else f"FAIL({result.error[:40]})"
        print(
            f"  [{i:3d}/{len(queries)}] {mark} comp={comp_n:2d} {status:25s} "
            f"{q[:50]}"
        )
        results.append(result)

        elapsed = time.time() - t0
        if i < len(queries) and elapsed < interval:
            time.sleep(interval - elapsed)

    # --- 집계 ---
    total = len(results)
    success = sum(1 for r in results if r.success)
    failed = total - success
    cited_us = sum(1 for r in results if r.cited_us)
    sov = (cited_us / success) if success > 0 else 0.0

    competitor_counts: dict[str, int] = {}
    for r in results:
        for c in r.cited_competitors:
            competitor_counts[c] = competitor_counts.get(c, 0) + 1

    summary = {
        "client": args.client,
        "date": today,
        "engine": GEMINI_MODEL,
        "queries_total": total,
        "queries_success": success,
        "queries_failed": failed,
        "cited_us": cited_us,
        "sov_percent": round(sov * 100, 2),
        "competitor_mentions": dict(
            sorted(competitor_counts.items(), key=lambda x: -x[1])
        ),
        "results": [asdict(r) for r in results],
        "generated_at": datetime.now(KST).isoformat(),
    }

    # --- 저장 ---
    logs_dir = CLIENTS_DIR / args.client / "logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    out_path = logs_dir / f"sov-{today}.json"
    out_path.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print()
    print("=" * 60)
    print(f"📊 SOV 결과 — {args.client} ({today})")
    print(f"   전체 쿼리: {total}")
    print(f"   성공: {success}  /  실패: {failed}")
    print(f"   우리 인용: {cited_us}건")
    print(f"   SOV: {sov*100:.2f}% (성공 쿼리 기준)")
    print()
    if competitor_counts:
        print("🥊 경쟁사 인용 TOP 5:")
        for name, cnt in list(competitor_counts.items())[:5]:
            print(f"   - {name}: {cnt}건")
    else:
        print("🥊 경쟁사 인용 0건")
    print()
    print(f"💾 저장: {out_path}")

    # --- Supabase upsert (Day N 추적용 영구 저장) ---
    sb_url = env.get("SUPABASE_URL", "").rstrip("/") or os.environ.get("SUPABASE_URL", "").rstrip("/")
    sb_key = env.get("SUPABASE_SERVICE_ROLE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if sb_url and sb_key:
        try:
            top5 = dict(list(competitor_counts.items())[:5])
            row = {
                "client_slug": args.client,
                "measured_date": today,
                "engine": GEMINI_MODEL,
                "queries_total": total,
                "queries_success": success,
                "queries_failed": failed,
                "cited_us": cited_us,
                "sov_percent": round(sov * 100, 2),
                "competitor_top": top5,
                "raw_json_path": str(out_path.relative_to(ROOT)),
            }
            data = json.dumps(row).encode("utf-8")
            req = urllib.request.Request(
                f"{sb_url}/rest/v1/sov_measurements?on_conflict=client_slug,measured_date,engine",
                data=data,
                headers={
                    "apikey": sb_key,
                    "Authorization": f"Bearer {sb_key}",
                    "Content-Type": "application/json",
                    "Prefer": "resolution=merge-duplicates,return=minimal",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=20) as r:
                code = r.status
            print(f"🗄  sov_measurements upsert OK (HTTP {code})")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:300]
            print(f"⚠️  sov_measurements upsert 실패 HTTP {e.code}: {body}")
        except Exception as e:
            print(f"⚠️  sov_measurements upsert 실패 {type(e).__name__}: {e}")

        # citations bulk upsert (성공한 쿼리별 디테일)
        try:
            citation_rows = []
            for r in results:
                if not r.success:
                    continue
                citation_rows.append({
                    "client_slug": args.client,
                    "measured_date": today,
                    "engine": GEMINI_MODEL,
                    "query": r.query,
                    "cited_us": bool(r.cited_us),
                    "cited_competitors": r.cited_competitors or [],
                    "citation_urls": [c.get("uri", "") for c in (r.citations or []) if c.get("uri")],
                    "answer_text": (r.answer_text or "")[:2000],
                    "duration_ms": r.duration_ms or 0,
                })
            if citation_rows:
                req = urllib.request.Request(
                    f"{sb_url}/rest/v1/citations?on_conflict=client_slug,measured_date,engine,query",
                    data=json.dumps(citation_rows).encode("utf-8"),
                    headers={
                        "apikey": sb_key,
                        "Authorization": f"Bearer {sb_key}",
                        "Content-Type": "application/json",
                        "Prefer": "resolution=merge-duplicates,return=minimal",
                    },
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=30) as r:
                    print(f"🗄  citations bulk upsert OK ({len(citation_rows)} rows, HTTP {r.status})")
        except urllib.error.HTTPError as e:
            print(f"⚠️  citations upsert 실패 HTTP {e.code}: {e.read().decode()[:200]}")
        except Exception as e:
            print(f"⚠️  citations upsert 실패 {type(e).__name__}: {e}")
    else:
        print("ℹ️  Supabase 자격증명 없음 — JSON 파일만 저장")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
