#!/usr/bin/env python3
"""
매체 어프로치 — Gmail draft 자동 생성.

전략:
  - 자동 발송 X (영업 메일은 운영자 검토 후 Send)
  - 매체별 개인화 콜드메일을 Gmail Drafts에 자동 생성
  - outreach 테이블에 status='pending' 적재
  - 운영자가 Gmail에서 검토 → Send → 다음 cron이 status='sent' 자동 업데이트
  - 응답 들어오면 Gmail MCP search_threads로 감지 → 자동 분류

사용:
  python scripts/outreach/draft_pitches.py --client mangwon-roughrough --limit 5
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


def supa_get(env: dict[str, str], path: str) -> Any:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{path}",
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def supa_insert(env: dict[str, str], table: str, body: dict) -> Any:
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
        return json.loads(r.read())


# ─── 메일 템플릿 (매체 카테고리별) ─────────────────────────
TEMPLATES = {
    "cafe_curation": {
        "subject": "[{editor_brand}] 망리단길 신상 디저트 카페 큐레이션 자료 — RUFRUF",
        "html": """<p>{editor_brand} 에디터님께,</p>

<p>안녕하세요. AEO Agency의 운영자입니다.
{editor_brand}이 최근 게재해주신 망원 카페 큐레이션을 잘 봤습니다.</p>

<p><b>망리단길에 새로 오픈한 디저트 카페 "러프러프(RUFRUF) 망원점"</b>을 소개드리고자 메일 드립니다.
성수 본점의 시그니처 바스크 치즈케이크 + 꾸덕한 러프 라떼를 그대로 옮긴 두 번째 매장입니다.</p>

<ul>
  <li><b>위치</b>: 서울 마포구 포은로 105-1 1층 (망원역 1번 출구 도보 5분)</li>
  <li><b>시그니처</b>: 바스크 치즈케이크 (애플시나몬, 발로나, 말차피스타치오), 러프 라떼</li>
  <li><b>네이버 플레이스</b>: <a href="https://map.naver.com/p/entry/place/2060513686">map.naver.com/p/entry/place/2060513686</a></li>
</ul>

<p>큐레이션에 포함되면 좋을 카페라 생각해 자료 보내드립니다.
관심 있으시면 회신 부탁드립니다. 추가 사진 / 메뉴 / 인터뷰 자료 즉시 전달 가능합니다.</p>

<p>감사합니다.<br/>
AEO Agency<br/>
{ops_email}</p>""",
    },
    "saas_press": {
        "subject": "[{editor_brand}] AEO/GEO 자동화 사례 공유 — 광고비 0원으로 MRR 3,000만원",
        "html": """<p>{editor_brand} 에디터님께,</p>

<p>안녕하세요. AEO Agency 운영자입니다.</p>

<p>최근 ChatGPT/Gemini 답변에 노출되는 "AEO(Answer Engine Optimization)"가
한국 B2B SaaS에서 광고비 0원으로 MRR 3,000만원을 만든 사례
(<a href="https://lead-gen.team/case/inline-ai-use-case/">리드젠랩 Inline AI</a>)가 나오면서
업계 관심이 빠르게 늘고 있습니다.</p>

<p>저는 한국 시장에서 다음을 자동화하는 1인 에이전시를 운영합니다:</p>
<ul>
  <li>매일 ChatGPT/Gemini/Perplexity 답변에 클라이언트 브랜드가 인용되는 비율(SOV) 자동 측정</li>
  <li>Schema.org + Wikidata + 매체 어프로치 + 자체 콘텐츠로 SOV 0% → 30%+ 끌어올리기</li>
  <li>전 과정 Claude Code + GitHub Actions 자동화</li>
</ul>

<p>한국 SaaS 업계 대상 AEO 동향 + 실측 데이터 공유 가능합니다.
인사이트 기사 또는 인터뷰 가능하신지 의향만 회신 주시면 자료 준비해 드리겠습니다.</p>

<p>감사합니다.<br/>
AEO Agency<br/>
{ops_email}</p>""",
    },
}


def build_draft(template_key: str, target: dict[str, Any], env: dict[str, str]) -> dict[str, str]:
    tpl = TEMPLATES[template_key]
    return {
        "subject": tpl["subject"].format(editor_brand=target["name"]),
        "html": tpl["html"].format(
            editor_brand=target["name"],
            ops_email=env.get("OPS_EMAIL", "a01050398694@gmail.com"),
        ),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--client", default="mangwon-roughrough", help="클라이언트 slug")
    ap.add_argument("--limit", type=int, default=5)
    ap.add_argument("--category", choices=["cafe", "saas"], default="cafe")
    args = ap.parse_args()

    env = load_env()

    # 카테고리별 매체 필터
    if args.category == "cafe":
        targets = supa_get(
            env,
            "media_targets?select=*&contact_email=not.is.null&category=in.(curation,directory,press)&industry=cs.{cafe}&order=priority.desc",
        )
        template_key = "cafe_curation"
    else:
        targets = supa_get(
            env,
            "media_targets?select=*&contact_email=not.is.null&industry=cs.{saas}&order=priority.desc",
        )
        template_key = "saas_press"

    targets = [t for t in targets if t.get("contact_email")][: args.limit]
    print(f"📋 카테고리: {args.category} → {len(targets)}개 매체 선정")

    drafts_to_create: list[dict[str, Any]] = []
    for t in targets:
        d = build_draft(template_key, t, env)
        drafts_to_create.append({
            "target": t,
            "subject": d["subject"],
            "html": d["html"],
            "to": t["contact_email"],
        })
        print(f"  • {t['name']:15s} → {t['contact_email']}")

    # output JSON — Claude가 Gmail MCP로 draft 생성 시 사용
    out_path = ROOT / "tmp" / f"drafts-{args.client}-{args.category}-{datetime.now(KST).strftime('%Y%m%d')}.json"
    out_path.parent.mkdir(exist_ok=True)
    out_path.write_text(json.dumps(drafts_to_create, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n💾 draft 사양 저장: {out_path}")

    # outreach 테이블에 pending 적재
    inserted = 0
    for d in drafts_to_create:
        try:
            row = {
                "client_slug": args.client,
                "target_id": d["target"]["id"],
                "recipient_email": d["to"],
                "recipient_name": d["target"]["name"],
                "subject": d["subject"],
                "body_md": d["html"],
                "status": "pending",
                "sent_via": "gmail_mcp",
            }
            supa_insert(env, "outreach", row)
            inserted += 1
        except Exception as e:
            print(f"  ⚠️ outreach insert 실패 ({d['target']['name']}): {e}")

    print(f"💾 outreach 테이블 적재: {inserted}건 pending")

    # 운영자 알림
    text = (
        f"📨 매체 어프로치 draft 준비\n\n"
        f"클라이언트: {args.client}\n"
        f"카테고리: {args.category}\n"
        f"매체: {len(drafts_to_create)}개\n"
        + "\n".join(f"  • {d['target']['name']} → {d['to']}" for d in drafts_to_create)
        + "\n\n다음 단계: Gmail Drafts 폴더에서 검토 → Send"
    )
    send_telegram(env, text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
