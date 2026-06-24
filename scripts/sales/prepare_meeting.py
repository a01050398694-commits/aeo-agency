#!/usr/bin/env python3
"""
미팅 자료 자동 준비 — 회신 받은 prospect와 미팅 직전.

산출물 (1 HTML 문서):
1. 클라이언트 컨텍스트 (회사 정보 + 진단 결과)
2. 베이스라인 SOV + 답변에 등장한 경쟁사
3. 30/60/90일 액션 플랜
4. 패키지 추천 + 견적
5. 우리 자체 케이스 스터디 (망원 + 자사)
6. 계약서 요약 + KPI 보장 조항

사용:
  python scripts/sales/prepare_meeting.py --prospect-id 3
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.notify.channels import load_env, send_email  # noqa: E402

KST = timezone(timedelta(hours=9))


def supa_one(env: dict, path: str) -> dict | None:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{path}",
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        data = json.loads(r.read())
        return data[0] if isinstance(data, list) and data else (data if isinstance(data, dict) else None)


def render_html(p: dict, notes: dict | None) -> str:
    name = p["business_name"]
    industry = p.get("industry", "")
    sov = p.get("baseline_sov")
    top_comps = (notes or {}).get("top_competitors", []) if notes else []

    return f"""<!doctype html>
<html lang="ko"><head><meta charset="utf-8"/>
<style>
body{{font-family:-apple-system,'Segoe UI','Noto Sans KR',sans-serif;max-width:760px;margin:0 auto;padding:32px;background:#fff;color:#1f2328;line-height:1.6}}
h1{{font-size:28px;margin:0 0 8px}}
h2{{font-size:20px;margin:32px 0 12px;border-bottom:1px solid #e1e4e8;padding-bottom:8px}}
.metric{{background:#f6f8fa;border-radius:8px;padding:16px;display:inline-block;margin:4px}}
.metric-label{{font-size:11px;color:#666;text-transform:uppercase}}
.metric-value{{font-size:24px;font-family:monospace;font-weight:600;margin-top:4px}}
ul{{padding-left:20px}}
.box{{border:1px solid #e1e4e8;border-radius:8px;padding:16px;margin:16px 0;background:#fafbfc}}
.kpi{{border-left:3px solid #1a7f37;background:#dafbe1;padding:12px;margin:8px 0;border-radius:4px}}
.warn{{border-left:3px solid #d4a72c;background:#fff8c5;padding:12px;margin:8px 0;border-radius:4px}}
table{{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px}}
td,th{{padding:8px 12px;border-bottom:1px solid #e1e4e8;text-align:left}}
.footer{{margin-top:48px;padding-top:16px;border-top:1px solid #e1e4e8;text-align:center;color:#666;font-size:12px}}
</style></head>
<body>

<header>
  <p style="color:#666;font-size:12px;letter-spacing:1px;margin:0">AEO AGENCY · MEETING BRIEF</p>
  <h1>{name}</h1>
  <p style="color:#666;margin:0">{industry} · 베이스라인 측정 완료 · {p.get('baseline_date','')}</p>
</header>

<h2>1. 현재 상태</h2>
<div class="metric">
  <div class="metric-label">베이스라인 SOV</div>
  <div class="metric-value">{f'{sov:.2f}%' if sov is not None else '—'}</div>
</div>
<div class="metric">
  <div class="metric-label">측정 쿼리</div>
  <div class="metric-value">{(notes or {}).get('cited_count', '?')}/30 인용</div>
</div>
<div class="metric">
  <div class="metric-label">도메인</div>
  <div class="metric-value" style="font-size:14px">{p.get('domain','—')}</div>
</div>

<h2>2. 답변에 등장한 경쟁사 TOP 5</h2>
<table>
  <tr><th>순위</th><th>경쟁사</th><th>인용 횟수</th></tr>
  {"".join(f'<tr><td>{i+1}</td><td>{c[0]}</td><td>{c[1]}회</td></tr>' for i, c in enumerate(top_comps[:5])) or '<tr><td colspan=3 style="color:#999;text-align:center">데이터 없음</td></tr>'}
</table>

<h2>3. 30 / 60 / 90일 액션 플랜</h2>
<div class="box">
  <b>Day 1~30 (기반 구축)</b>
  <ul>
    <li>Schema.org 풀세트 마크업 (Organization · Service · FAQPage)</li>
    <li>핵심 카테고리 쿼리 8개 답변 블록 작성 + 자체 사이트 게재</li>
    <li>Wikidata 엔티티 등록 + sameAs 연결</li>
    <li>매일 SOV 자동 측정 cron 가동</li>
  </ul>
  <b>Day 31~60 (도메인 분산)</b>
  <ul>
    <li>Tistory + Hashnode + Dev.to 멀티 도메인 게재 (주 1편)</li>
    <li>매체 어프로치 5건 (업종 매체)</li>
    <li>Bing Webmaster + Naver Webmaster 등록</li>
  </ul>
  <b>Day 61~90 (확장)</b>
  <ul>
    <li>매체 채택 1건 이상 (또는 환불 KPI 발동)</li>
    <li>SOV 5~15% 도달 목표 (업종별)</li>
    <li>리뷰/사례 콘텐츠 누적</li>
  </ul>
</div>

<h2>4. 패키지 추천</h2>
<div class="box">
  <p><b>{name}에 적합: 파일럿 (월 250만원, 3개월 약정)</b></p>
  <p>이유: {industry} 업종은 정보형 쿼리가 풍부하고 한국 시장 적합도가 높음. 첫 3개월에 시스템 구축 + 1차 매체 어프로치까지 가능.</p>
  <table>
    <tr><th>항목</th><th>월별 비용</th></tr>
    <tr><td>1단계 진단 (이미 진행)</td><td>무료</td></tr>
    <tr><td>2단계 파일럿 (Day 1~90)</td><td>250만원 × 3 = 750만원</td></tr>
    <tr><td>3단계 운영 (Day 91~)</td><td>400만원 × 9 = 3,600만원 (12개월 계약)</td></tr>
  </table>
</div>

<h2>5. KPI 보장 (계약서 명시)</h2>
<div class="kpi">
  ✓ <b>30일 내</b>: 카테고리 메인 쿼리 1개 이상에서 AI 답변 인용 진입<br>
  ✓ <b>90일 내</b>: SOV 0% → 5~15% 도달 (업종별 조건부)<br>
  ✓ <b>180일 내</b>: 매체 게재 1건 이상 또는 환불<br>
  ✓ 미달 시 해당 월 환불 또는 무료 1개월 연장
</div>

<h2>6. 자체 검증 — 우리도 이렇게 하고 있습니다</h2>
<div class="box">
  <p><b>망원 러프러프 (F&B 로컬, 진행 중)</b></p>
  <ul>
    <li>베이스라인 SOV 0% → 자체 사이트 + Schema + 매체 어프로치</li>
    <li>Day 30 SOV 측정 중. F&B 천장 25~30% 예상.</li>
  </ul>
  <p><b>AEO Agency 자사 (4주 풀스택, 비용 0원)</b></p>
  <ul>
    <li>22 routes Next.js + Supabase 9테이블 + 3 cron + 25 prospects 자동 발굴</li>
    <li>1인 운영자 × Claude Code 자동화 = 5~10 클라이언트 동시 가능</li>
  </ul>
</div>

<h2>7. 첫 미팅 아젠다 (30분)</h2>
<ol>
  <li>현재 마케팅 채널 / 매출 구조 (5분)</li>
  <li>위 진단 결과 함께 확인 (10분)</li>
  <li>30/60/90일 액션 플랜 조정 (10분)</li>
  <li>계약 시작 일정 + 결제 (5분)</li>
</ol>

<div class="footer">
  AEO Agency · {datetime.now(KST).strftime('%Y-%m-%d')} 생성<br>
  github.com/a01050398694-commits/aeo-agency
</div>

</body></html>
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--prospect-id", type=int, required=True)
    ap.add_argument("--email", action="store_true", help="운영자 이메일로 발송")
    args = ap.parse_args()

    env = load_env()
    p = supa_one(env, f"prospects?select=*&id=eq.{args.prospect_id}")
    if not p:
        sys.exit(f"❌ prospect id={args.prospect_id} 없음")

    notes = None
    try:
        notes = json.loads(p.get("notes") or "{}")
    except Exception:
        pass

    html = render_html(p, notes)

    out_path = ROOT / "tmp" / "meetings" / f"prospect-{args.prospect_id}-{datetime.now(KST).strftime('%Y%m%d')}.html"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")
    print(f"📄 미팅 자료 저장: {out_path}")
    print(f"   브라우저에서 열어 검토 후 PDF 인쇄 (Ctrl+P)")

    if args.email:
        ok, msg = send_email(
            env,
            f"[미팅 자료] {p['business_name']}",
            html,
            text=f"미팅 자료 — {p['business_name']}. HTML 본문 참조.",
        )
        print(f"📧 발송: {'OK' if ok else 'FAIL'} {msg}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
