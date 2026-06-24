#!/usr/bin/env python3
"""
주간 보고서 HTML 이메일 자동 생성 + 발송.

매주 월 09:00 KST cron:
1. 활성 클라이언트별로 지난 7일 SOV 추이 계산
2. 핵심 KPI 요약 (SOV 평균, 변화율, 콘텐츠 게재 수, 매체 응답률)
3. HTML 이메일 생성 → 운영자 + (옵션) 클라이언트 발송
4. weekly_reports 테이블에 적재
"""
from __future__ import annotations

import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.notify.channels import load_env, send_email  # noqa: E402

KST = timezone(timedelta(hours=9))


def supa(env: dict[str, str], path: str) -> Any:
    url = f"{env['SUPABASE_URL']}/rest/v1/{path}"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def supa_insert(env: dict[str, str], table: str, body: dict | list[dict]) -> Any:
    url = f"{env['SUPABASE_URL']}/rest/v1/{table}"
    data = json.dumps(body if isinstance(body, list) else [body]).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
            "Content-Type": "application/json",
            "Prefer": "return=representation,resolution=merge-duplicates",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def iso_week(d: datetime) -> str:
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def build_client_section(env: dict[str, str], slug: str, brand: str) -> tuple[str, dict[str, Any]]:
    today = datetime.now(KST).date()
    week_ago = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)

    last7 = supa(
        env,
        f"sov_measurements?select=measured_date,sov_percent,cited_us,queries_success"
        f"&client_slug=eq.{slug}&measured_date=gte.{week_ago}&order=measured_date.asc",
    )
    prev7 = supa(
        env,
        f"sov_measurements?select=sov_percent"
        f"&client_slug=eq.{slug}&measured_date=gte.{two_weeks_ago}&measured_date=lt.{week_ago}",
    )
    queue = supa(
        env,
        f"content_queue?select=status,content_type"
        f"&client_slug=eq.{slug}",
    )

    avg_last7 = sum(float(r["sov_percent"]) for r in last7) / len(last7) if last7 else 0
    avg_prev7 = sum(float(r["sov_percent"]) for r in prev7) / len(prev7) if prev7 else 0
    change = avg_last7 - avg_prev7

    published = sum(1 for q in queue if q["status"] == "published")
    pending = sum(1 for q in queue if q["status"] == "pending")

    arrow = "↑" if change > 0 else ("↓" if change < 0 else "—")
    color = "#1a7f37" if change > 0 else ("#cf222e" if change < 0 else "#666")

    metrics = {
        "client_slug": slug,
        "iso_week": iso_week(datetime.now(KST)),
        "sov_avg": round(avg_last7, 2),
        "sov_change_pct": round(change, 2),
        "content_published": published,
    }

    rows_html = "".join(
        f"<tr><td style='padding:4px 8px;border-bottom:1px solid #eee'>{r['measured_date']}</td>"
        f"<td style='padding:4px 8px;border-bottom:1px solid #eee;text-align:right;font-family:monospace'>{float(r['sov_percent']):.2f}%</td>"
        f"<td style='padding:4px 8px;border-bottom:1px solid #eee;text-align:right;color:#666;font-size:11px'>{r['cited_us']}/{r['queries_success']}</td></tr>"
        for r in last7
    ) or "<tr><td colspan='3' style='padding:12px;text-align:center;color:#999'>측정 데이터 없음</td></tr>"

    section_html = f"""
<div style="margin:24px 0;padding:20px;border:1px solid #e1e4e8;border-radius:8px;background:#fff">
  <h2 style="margin:0 0 4px;font-size:20px">{brand}</h2>
  <p style="margin:0 0 12px;color:#666;font-size:13px;font-family:monospace">{slug}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
    <tr>
      <td style="padding:8px;background:#f6f8fa;border-radius:6px;width:33%">
        <div style="font-size:11px;color:#666">7일 평균 SOV</div>
        <div style="font-size:24px;font-family:monospace;font-weight:600">{avg_last7:.2f}%</div>
      </td>
      <td style="padding:8px;background:#f6f8fa;border-radius:6px;width:33%">
        <div style="font-size:11px;color:#666">전주 대비</div>
        <div style="font-size:24px;font-family:monospace;font-weight:600;color:{color}">{arrow} {abs(change):.2f}%</div>
      </td>
      <td style="padding:8px;background:#f6f8fa;border-radius:6px;width:33%">
        <div style="font-size:11px;color:#666">콘텐츠</div>
        <div style="font-size:24px;font-family:monospace;font-weight:600">{published} / {pending + published}</div>
      </td>
    </tr>
  </table>

  <details style="margin-top:8px">
    <summary style="cursor:pointer;color:#0969da;font-size:13px">📊 일별 측정 (7일)</summary>
    <table style="width:100%;margin-top:8px;border-collapse:collapse;font-size:13px">
      <tr style="background:#f6f8fa">
        <th style="padding:6px 8px;text-align:left">날짜</th>
        <th style="padding:6px 8px;text-align:right">SOV</th>
        <th style="padding:6px 8px;text-align:right;color:#666">인용/성공</th>
      </tr>
      {rows_html}
    </table>
  </details>
</div>
"""
    return section_html, metrics


def main() -> int:
    env = load_env()
    clients = supa(env, "clients?select=slug,brand_name&status=eq.active")
    print(f"📊 활성 클라이언트 {len(clients)}명 주간 보고서 생성")

    week = iso_week(datetime.now(KST))
    sections: list[str] = []
    metrics_list: list[dict[str, Any]] = []

    for c in clients:
        sec, m = build_client_section(env, c["slug"], c["brand_name"])
        sections.append(sec)
        metrics_list.append(m)

    overall_avg = (
        sum(m["sov_avg"] for m in metrics_list) / len(metrics_list)
        if metrics_list
        else 0
    )

    html = f"""
<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"/></head>
<body style="font-family:-apple-system,'Segoe UI',sans-serif;max-width:720px;margin:0 auto;padding:24px;background:#f6f8fa;color:#1f2328">
  <header style="text-align:center;margin-bottom:32px">
    <p style="margin:0;color:#666;font-size:12px;letter-spacing:1px">AEO AGENCY WEEKLY</p>
    <h1 style="margin:8px 0;font-size:28px">{week} 주간 보고서</h1>
    <p style="margin:0;color:#666">전체 평균 SOV: <b>{overall_avg:.2f}%</b> · 클라이언트 {len(clients)}명</p>
  </header>
  {''.join(sections)}
  <footer style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #e1e4e8;color:#666;font-size:12px">
    <p>대시보드: <a href="https://github.com/a01050398694-commits/aeo-agency" style="color:#0969da">github.com/a01050398694-commits/aeo-agency</a></p>
    <p>이 보고서는 AEO Agency 자동화 시스템이 생성했습니다.</p>
  </footer>
</body>
</html>
"""
    text = (
        f"AEO Agency 주간 보고서 {week}\n\n"
        f"전체 평균 SOV: {overall_avg:.2f}%\n\n"
        + "\n".join(
            f"• {c['brand_name']} ({c['slug']}): SOV {m['sov_avg']:.2f}% (Δ {m['sov_change_pct']:+.2f}%)"
            for c, m in zip(clients, metrics_list)
        )
    )

    ok, msg = send_email(env, f"[AEO] 주간 보고서 {week}", html, text=text)
    print(f"📧 이메일 발송: {'OK' if ok else 'FAIL'} {msg}")

    if ok:
        try:
            supa_insert(env, "weekly_reports", metrics_list)
            print("💾 weekly_reports 적재 완료")
        except Exception as e:
            print(f"⚠️  weekly_reports 적재 실패: {e}")

    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
