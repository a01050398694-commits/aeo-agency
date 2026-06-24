#!/usr/bin/env python3
"""
잠재 클라이언트 콜드메일 Draft 자동 생성.

Day 16~17: prospects 테이블에서 contact_email 있는 곳 모두에게
업종별 개인화 콜드메일을 Gmail Drafts에 자동 생성.

사용:
  python scripts/outreach/prospect_drafts.py --industry-prefix "세무"
  python scripts/outreach/prospect_drafts.py --industry-prefix "노무"
  python scripts/outreach/prospect_drafts.py --industry-prefix "B2B SaaS"
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.notify.channels import load_env, send_telegram  # noqa: E402

KST = timezone(timedelta(hours=9))


def supa_get(env: dict[str, str], path: str) -> list[dict[str, Any]]:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{path}",
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def supa_post(env: dict[str, str], table: str, body: dict) -> dict:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{table}",
        data=json.dumps([body]).encode("utf-8"),
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


def template_tax(p: dict[str, Any], ops_email: str) -> dict[str, str]:
    """세무사·세무법인용."""
    name = p["business_name"]
    industry = p.get("industry", "세무")
    subject = f"[{name}] '강남 세무사 추천' 검색하면 어디 나오는지 보셨나요?"
    html = f"""<p>{name} 대표님 안녕하세요. AEO Agency 운영자입니다.</p>

<p>최근 ChatGPT와 Google Gemini에 "<b>강남 세무사 추천</b>", "<b>스타트업 세무사 어디가 좋아</b>" 같은 질문을 직접 입력해보면
답변에 등장하는 사무소가 4~6곳 정도로 좁혀집니다. AI Overview가 깔린 검색은 일반 검색 대비 클릭률이 61% 떨어진 대신,
AI 답변에 인용된 사무소는 클릭이 오히려 35~91% 늘어났다는 데이터가 있습니다(Seer Interactive 2025.09, Digital Bloom 2026).</p>

<p>{name}이 이런 답변에 등장하지 않는다면, 단순히 SEO가 약해서가 아닙니다.
AI는 구글 검색 결과 + 매체 인용 + 구조화 데이터(Schema.org) + 지식 그래프(Wikidata 등)를 종합해
"신뢰할 만한 후보"를 좁혀 추천합니다.</p>

<p><b>AEO Agency가 무료로 진단해 드립니다.</b></p>
<ul>
  <li>"{industry}" 카테고리 쿼리 30개에서 ChatGPT/Gemini가 어디를 추천하는지 자동 측정</li>
  <li>{name} 등장 여부 + 답변에 들어간 경쟁 사무소 분석</li>
  <li>Schema/사이트 갭 진단</li>
  <li>30/60/90일 액션 플랜 — 1페이지 PDF로 24~48시간 내 회신</li>
</ul>

<p>혹시 관심 있으시면 회신만 부탁드립니다. 진단은 비용 없습니다 (계약 강요도 없음, 결과만 보세요).</p>

<p>감사합니다.<br/>
AEO Agency<br/>
<a href="mailto:{ops_email}">{ops_email}</a></p>"""
    return {"subject": subject, "html": html}


def template_labor(p: dict[str, Any], ops_email: str) -> dict[str, str]:
    """노무사·노무법인용."""
    name = p["business_name"]
    industry = p.get("industry", "노무")
    subject = f"[{name}] 'IT 회사 노무사 추천' 검색하면 어디 나올까요?"
    html = f"""<p>{name} 대표님 안녕하세요. AEO Agency 운영자입니다.</p>

<p>요즘 스타트업 대표들이 노무사 찾을 때 ChatGPT나 Gemini에 먼저 묻습니다.
"IT 회사 노무사 추천", "스타트업 사규 정비 어디서 받아", "포괄임금제 합법성" 같은 질문에
AI가 직접 답을 만들고, 그 답에 등장한 사무소가 사실상 첫 후보가 됩니다.</p>

<p>전통 검색 클릭률은 61% 떨어졌습니다. 대신 AI 답변에 인용된 사무소는 클릭 35~91% 증가
(Seer Interactive 2025, Digital Bloom 2026 데이터).</p>

<p>{name}이 이런 답변에 안 나오는 이유는 SEO 점수가 아니라,
AI가 신뢰하는 신호(매체 인용 / Schema.org 마크업 / Wikidata 같은 지식 그래프)가
충분히 누적되지 않았기 때문입니다.</p>

<p><b>무료 베이스라인 진단 — 24~48시간 내 PDF 회신:</b></p>
<ul>
  <li>"{industry}" 카테고리 쿼리 30개에서 AI가 누구를 추천하는지 자동 측정</li>
  <li>{name} 등장 여부 + 자리를 차지한 경쟁 사무소 분석</li>
  <li>홈페이지 Schema/엔티티 갭 진단</li>
  <li>30/60/90일 액션 플랜 (실제 작업 견적은 별도)</li>
</ul>

<p>관심 있으시면 회신만 주세요. 영업 전화는 하지 않습니다.</p>

<p>감사합니다.<br/>
AEO Agency<br/>
<a href="mailto:{ops_email}">{ops_email}</a></p>"""
    return {"subject": subject, "html": html}


def template_saas(p: dict[str, Any], ops_email: str) -> dict[str, str]:
    """B2B SaaS용 (이미 Day 5에 있지만 prospects 흐름용)."""
    name = p["business_name"]
    industry = p.get("industry", "B2B SaaS")
    subject = f"[{name}] ChatGPT 답변에 안 나오는 이유 — 무료 진단 제안"
    html = f"""<p>{name} 마케팅·성장 담당자님께,</p>

<p>요즘 B2B 구매자의 89%가 벤더 리서치를 ChatGPT/Gemini로 시작합니다(G2 2025).
한국에서도 OpenSurvey 2026 데이터 기준 ChatGPT 사용률이 54.5% (미국 29%, 일본 14.8%)로 가장 높습니다.</p>

<p>최근 "{industry} 추천" 같은 카테고리 쿼리에 ChatGPT가 5~7개 벤더를 직접 추천합니다.
이 답변에 등장한 벤더의 트라이얼 전환율이 일반 검색 대비 4.4~23배 (Ahrefs 자체 데이터).
반대로 답변에 안 들어간 벤더는 클릭 자체가 -61% 감소.</p>

<p>{name}이 이 답변에 들어가 있는지, 어떤 경쟁사가 자리를 차지했는지 무료로 측정해 드립니다.</p>

<p><b>제공 사항</b>:</p>
<ul>
  <li>카테고리 쿼리 30개 자동 측정 (ChatGPT + Gemini + Perplexity)</li>
  <li>경쟁사 답변 인용 분석 + Schema/Wikidata 갭 진단</li>
  <li>30/60/90일 액션 플랜 (PDF, 24~48시간 내 회신)</li>
  <li>리드젠랩 Inline AI는 동일 작전으로 광고비 0원에 MRR 3,000만 달성</li>
</ul>

<p>관심 있으면 회신만 주세요. 진단 무료, 계약 강요 없음.</p>

<p>감사합니다.<br/>
AEO Agency<br/>
<a href="mailto:{ops_email}">{ops_email}</a></p>"""
    return {"subject": subject, "html": html}


TEMPLATES = {
    "세무": template_tax,
    "회계": template_tax,
    "노무": template_labor,
    "B2B SaaS": template_saas,
}


def pick_template(industry: str):
    for k, v in TEMPLATES.items():
        if industry.startswith(k):
            return v
    return template_saas


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--industry-prefix", default=None, help="필터링 (예: '세무', '노무')")
    ap.add_argument("--limit", type=int, default=10)
    args = ap.parse_args()

    env = load_env()
    ops = env.get("OPS_EMAIL", "a01050398694@gmail.com")

    filter_q = "contact_email=not.is.null&status=eq.discovered"
    if args.industry_prefix:
        filter_q += f"&industry=ilike.{args.industry_prefix}%25"
    prospects = supa_get(env, f"prospects?select=*&{filter_q}&order=created_at.asc&limit={args.limit}")
    print(f"📋 콜드메일 대상: {len(prospects)}건")

    drafts: list[dict[str, Any]] = []
    for p in prospects:
        tpl_fn = pick_template(p.get("industry", ""))
        d = tpl_fn(p, ops)
        drafts.append({
            "prospect": p,
            "subject": d["subject"],
            "html": d["html"],
            "to": p["contact_email"],
        })
        print(f"  • {p['business_name']:30s} → {p['contact_email']}")

    # outreach 적재
    inserted = 0
    for d in drafts:
        try:
            supa_post(env, "outreach", {
                "recipient_email": d["to"],
                "recipient_name": d["prospect"]["business_name"],
                "subject": d["subject"],
                "body_md": d["html"],
                "status": "pending",
                "sent_via": "gmail_mcp",
            })
            inserted += 1
            # prospect status 업데이트
            url = f"{env['SUPABASE_URL']}/rest/v1/prospects?id=eq.{d['prospect']['id']}"
            req = urllib.request.Request(
                url,
                data=json.dumps({"status": "contacted"}).encode("utf-8"),
                headers={
                    "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
                    "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
                    "Content-Type": "application/json",
                },
                method="PATCH",
            )
            urllib.request.urlopen(req, timeout=20).read()
        except Exception as e:
            print(f"  ⚠️ outreach insert 실패 ({d['prospect']['business_name']}): {e}")

    # JSON 출력 (Gmail MCP 호출용 사양)
    out_path = ROOT / "tmp" / f"prospect-drafts-{datetime.now(KST).strftime('%Y%m%d-%H%M')}.json"
    out_path.parent.mkdir(exist_ok=True)
    out_path.write_text(json.dumps(drafts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n💾 사양 저장: {out_path}")
    print(f"💾 outreach 적재: {inserted}건")

    text = (
        f"📨 prospect 콜드메일 사양 준비\n\n"
        + "\n".join(f"  • {d['prospect']['business_name']} → {d['to']}" for d in drafts)
        + "\n\nGmail Drafts에 생성 후 검토하시면 발송"
    )
    send_telegram(env, text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
