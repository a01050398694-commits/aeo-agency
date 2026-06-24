#!/usr/bin/env python3
"""
일일 임계치 감지 → 알림 발사.

매일 04:00 KST cron이 실행:
1. 어제 vs 그제 SOV ±10% 변화
2. 콘텐츠 큐 24h 이상 pending
3. 매체 어프로치 sent_at > 7일 + no_response (재발송 후보)
4. 측정 cron 실패 (오늘 sov_measurements row 없음)
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

from scripts.notify.channels import load_env, notify_both  # noqa: E402

KST = timezone(timedelta(hours=9))


def supa_select(env: dict[str, str], table: str, params: str = "") -> list[dict[str, Any]]:
    url = f"{env['SUPABASE_URL']}/rest/v1/{table}?{params}"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def check_sov_changes(env: dict[str, str]) -> list[str]:
    alerts: list[str] = []
    today = datetime.now(KST).date()
    rows = supa_select(
        env,
        "sov_measurements",
        f"select=client_slug,measured_date,sov_percent&measured_date=gte.{today - timedelta(days=7)}&order=client_slug,measured_date.desc",
    )
    by_slug: dict[str, list[dict[str, Any]]] = {}
    for r in rows:
        by_slug.setdefault(r["client_slug"], []).append(r)
    for slug, items in by_slug.items():
        if len(items) < 2:
            continue
        latest = float(items[0]["sov_percent"])
        prev = float(items[1]["sov_percent"])
        delta = latest - prev
        if abs(delta) >= 10.0:
            arrow = "📈" if delta > 0 else "📉"
            alerts.append(
                f"{arrow} *{slug}* SOV {prev:.1f}% → {latest:.1f}% "
                f"({'+' if delta > 0 else ''}{delta:.1f}%)"
            )
    return alerts


def check_stale_queue(env: dict[str, str]) -> list[str]:
    cutoff = (datetime.now(KST) - timedelta(hours=24)).isoformat()
    rows = supa_select(
        env,
        "content_queue",
        f"select=id,client_slug,title,created_at&status=eq.pending&created_at=lt.{cutoff}&order=created_at.asc&limit=20",
    )
    if not rows:
        return []
    msg = f"⏰ 콘텐츠 큐 24h+ 미처리: *{len(rows)}건*"
    for r in rows[:5]:
        msg += f"\n   • #{r['id']} {r.get('title','')[:50]} ({r['client_slug']})"
    return [msg]


def check_outreach_stale(env: dict[str, str]) -> list[str]:
    cutoff = (datetime.now(KST) - timedelta(days=7)).isoformat()
    rows = supa_select(
        env,
        "outreach",
        f"select=id,recipient_email,subject,sent_at&status=eq.sent&sent_at=lt.{cutoff}&order=sent_at.asc&limit=10",
    )
    if not rows:
        return []
    return [f"📭 매체 어프로치 7일+ 응답 없음: *{len(rows)}건* — 재발송 검토"]


def check_measurement_today(env: dict[str, str]) -> list[str]:
    today = datetime.now(KST).date()
    rows = supa_select(
        env,
        "sov_measurements",
        f"select=client_slug&measured_date=eq.{today}",
    )
    if not rows:
        return [
            f"🚨 *오늘({today}) SOV 측정 row 없음* — cron 실패 또는 미실행. GitHub Actions 확인 필요."
        ]
    return []


def main() -> int:
    env = load_env()
    print(f"🔍 임계치 체크 시작 {datetime.now(KST).isoformat()}")

    alerts: list[str] = []
    for check in (
        check_measurement_today,
        check_sov_changes,
        check_stale_queue,
        check_outreach_stale,
    ):
        try:
            alerts.extend(check(env))
        except Exception as e:
            alerts.append(f"⚠️ {check.__name__} 실패: {e}")

    if not alerts:
        print("✅ 알림 없음")
        return 0

    text = "🔔 AEO Agency 일일 알림\n\n" + "\n\n".join(alerts)
    html = "<h3>🔔 AEO Agency 일일 알림</h3>" + "".join(
        f"<p>{a.replace('*','<b>',1).replace('*','</b>',1)}</p>" for a in alerts
    )
    res = notify_both(env, "[AEO] 일일 알림 — " + datetime.now(KST).strftime("%Y-%m-%d"), text, html)
    print("발송 결과:", res)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
