#!/usr/bin/env python3
"""
ChatGPT SOV 측정 — 일일 자동화 (Gemini 측정의 백업/대안)
================================================
gpt-4o-mini-search-preview + web_search_options grounding 사용.
gemini_sov.py와 동일한 인터페이스 + 동일한 Supabase 스키마.

사용법:
  python scripts/daily/chatgpt_sov.py --client mangwon-roughrough
  python scripts/daily/chatgpt_sov.py --client thebom-tax --limit 5
  python scripts/daily/chatgpt_sov.py --client mangwon-roughrough --date 2026-06-25

가격 (2026 기준):
  gpt-4o-mini-search-preview: input $0.15/1M, output $0.60/1M, 검색 포함
  80쿼리 측정 시 약 $0.02 — 사실상 무료

엔진: gpt-4o-mini-search-preview (web_search 내장)
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

ROOT = Path(__file__).resolve().parents[2]
CLIENTS_DIR = ROOT / "clients"
ENV_FILE = ROOT / ".env"

KST = timezone(timedelta(hours=9))

CHATGPT_MODEL = "gpt-4o-mini-search-preview"
CHATGPT_URL = "https://api.openai.com/v1/chat/completions"


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


def load_client(slug: str) -> dict[str, Any]:
    profile_path = CLIENTS_DIR / slug / "profile.yaml"
    if not profile_path.exists():
        sys.exit(f"❌ 클라이언트 프로필 없음: {profile_path}")

    queries: list[str] = []
    qp = CLIENTS_DIR / slug / "queries.txt"
    if qp.exists():
        for line in qp.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                queries.append(line)

    competitors: list[dict[str, str]] = []
    cp = CLIENTS_DIR / slug / "competitors.txt"
    if cp.exists():
        for line in cp.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "|" in line:
                name, _, ref = line.partition("|")
                competitors.append({"name": name.strip(), "ref": ref.strip()})
            else:
                competitors.append({"name": line, "ref": ""})

    # 클라이언트별 매칭 패턴 — domain 우선(citations), name 보조(본문, 질문 미포함 시만)
    if slug == "mangwon-roughrough":
        domain_pats = ["place/2060513686", "rufruf.com"]
        name_pats = ["러프러프", "RUFRUF", "Ruf Ruf", "포은로 105-1"]
    elif slug == "thebom-tax":
        domain_pats = ["thebomtax.com", "thebomtax"]
        name_pats = ["세무법인 더봄", "홍지영", "월드컵북로 4길 47"]
    else:
        domain_pats = []
        name_pats = []

    return {
        "slug": slug,
        "queries": queries,
        "competitors": competitors,
        "domain_patterns": domain_pats,
        "name_patterns": name_pats,
    }


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


def call_chatgpt(api_key: str, query: str, *, retries: int = 3) -> QueryResult:
    body = {
        "model": CHATGPT_MODEL,
        "web_search_options": {"search_context_size": "low"},
        "messages": [{"role": "user", "content": query}],
    }
    data = json.dumps(body).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    last_err = ""
    delay = 1.0
    for attempt in range(retries):
        t0 = time.time()
        try:
            req = urllib.request.Request(CHATGPT_URL, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=90) as resp:
                raw = resp.read().decode("utf-8")
            payload = json.loads(raw)
            duration = int((time.time() - t0) * 1000)
            return parse_chatgpt_response(query, payload, duration)
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


def parse_chatgpt_response(query: str, payload: dict[str, Any], duration_ms: int) -> QueryResult:
    try:
        msg = payload["choices"][0]["message"]
    except (IndexError, KeyError):
        return QueryResult(query=query, success=False, error="choices/message 누락", duration_ms=duration_ms)
    answer = msg.get("content", "") or ""
    citations: list[dict[str, str]] = []
    for a in (msg.get("annotations") or []):
        uc = a.get("url_citation") or {}
        url = uc.get("url", "")
        title = uc.get("title", "")
        if url:
            citations.append({"uri": url, "title": title})
    return QueryResult(
        query=query,
        success=True,
        answer_text=answer,
        citations=citations,
        duration_ms=duration_ms,
    )


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

    # 1) citations URL 매칭
    url_hit = False
    for c in result.citations:
        uri_low = (c.get("uri", "") or "").lower()
        for pat in domain_patterns:
            if pat.lower() in uri_low:
                url_hit = True
                break
        if url_hit:
            break

    # 2) 본문 매칭 (질문에 패턴 없을 때만)
    text_hit = False
    for pat in name_patterns:
        pat_low = pat.lower()
        if pat_low in q_low:
            continue  # 질문에 이미 있으면 본문 매칭은 false positive
        if pat_low in ans_low:
            text_hit = True
            break

    result.cited_us = url_hit or text_hit

    # 경쟁사 매칭 — 같은 로직
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


def upsert_supabase(env: dict[str, str], summary: dict[str, Any], out_path: Path) -> None:
    url = env.get("SUPABASE_URL", "").rstrip("/") or os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = env.get("SUPABASE_SERVICE_ROLE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not (url and key):
        print("ℹ️  Supabase 자격증명 없음 — JSON만 저장")
        return
    row = {
        "client_slug": summary["client"],
        "measured_date": summary["date"],
        "engine": summary["engine"],
        "queries_total": summary["queries_total"],
        "queries_success": summary["queries_success"],
        "queries_failed": summary["queries_failed"],
        "cited_us": summary["cited_us"],
        "sov_percent": summary["sov_percent"],
        "competitor_top": dict(list(summary["competitor_mentions"].items())[:5]),
        "raw_json_path": str(out_path.relative_to(ROOT)).replace("\\", "/"),
    }
    data = json.dumps(row).encode("utf-8")
    req = urllib.request.Request(
        f"{url}/rest/v1/sov_measurements?on_conflict=client_slug,measured_date,engine",
        data=data,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            print(f"🗄  Supabase upsert OK (HTTP {r.status})")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:300]
        print(f"⚠️  Supabase upsert 실패 HTTP {e.code}: {body}")
    except Exception as e:
        print(f"⚠️  Supabase upsert 실패 {type(e).__name__}: {e}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--client", required=True)
    ap.add_argument("--date", default=None)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--rpm", type=int, default=60, help="OpenAI Tier 1 기본 60 RPM, 안전하게 30 권장")
    args = ap.parse_args()

    env = load_env(ENV_FILE)
    api_key = env.get("OPENAI_API_KEY") or os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        sys.exit("❌ OPENAI_API_KEY 없음 (.env 또는 환경변수)")

    client = load_client(args.client)
    queries = client["queries"]
    if args.limit > 0:
        queries = queries[: args.limit]
    if not queries:
        sys.exit("❌ queries.txt가 비어있음")

    today = args.date or datetime.now(KST).strftime("%Y-%m-%d")
    print(f"🎯 클라이언트: {args.client}")
    print(f"📅 날짜: {today}")
    print(f"🔢 쿼리 수: {len(queries)}")
    print(f"🤖 엔진: {CHATGPT_MODEL}")
    print(f"⏱  Rate limit: {args.rpm} RPM ({60.0/args.rpm:.1f}초/쿼리)")
    print()

    results: list[QueryResult] = []
    interval = 60.0 / max(1, args.rpm)
    for i, q in enumerate(queries, 1):
        t0 = time.time()
        r = call_chatgpt(api_key, q)
        if r.success:
            detect_mentions(r, client["domain_patterns"], client["name_patterns"], client["competitors"])
        mark = "✓" if r.cited_us else " "
        comp_n = len(r.cited_competitors)
        status = "OK" if r.success else f"FAIL({r.error[:40]})"
        print(f"  [{i:3d}/{len(queries)}] {mark} comp={comp_n:2d} {status:25s} {q[:50]}")
        results.append(r)
        elapsed = time.time() - t0
        if i < len(queries) and elapsed < interval:
            time.sleep(interval - elapsed)

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
        "engine": CHATGPT_MODEL,
        "queries_total": total,
        "queries_success": success,
        "queries_failed": failed,
        "cited_us": cited_us,
        "sov_percent": round(sov * 100, 2),
        "competitor_mentions": dict(sorted(competitor_counts.items(), key=lambda x: -x[1])),
        "results": [asdict(r) for r in results],
        "generated_at": datetime.now(KST).isoformat(),
    }

    logs_dir = CLIENTS_DIR / args.client / "logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    out_path = logs_dir / f"sov-chatgpt-{today}.json"
    out_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    print()
    print("=" * 60)
    print(f"📊 ChatGPT SOV — {args.client} ({today})")
    print(f"   전체: {total}  성공: {success}  실패: {failed}")
    print(f"   우리 인용: {cited_us}건")
    print(f"   SOV: {sov*100:.2f}%")
    if competitor_counts:
        print("🥊 경쟁사 TOP 5:")
        for n, c in list(competitor_counts.items())[:5]:
            print(f"   - {n}: {c}건")
    print(f"💾 저장: {out_path}")

    upsert_supabase(env, summary, out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
