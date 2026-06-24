#!/usr/bin/env python3
"""
Gmail 회신 자동 모니터링 → outreach 상태 업데이트 + 알림.

전제: 사용자가 Gmail App Password 발급 (https://myaccount.google.com/apppasswords)
.env: GMAIL_USER + GMAIL_APP_PASSWORD

cron: 매일 04:30 KST (.github/workflows/daily-checks.yml 에 후크)

흐름:
1. outreach.status='sent' 인 row 가져옴
2. 각 recipient_email 로부터 온 새 메일이 있는지 IMAP 조회
3. 회신 발견 → GPT 분류 (긍정/거절/무응답) — 단순화: 회신 자체만 감지
4. outreach.status='replied_positive' (긍정 추정) 또는 'replied_negative' 업데이트
5. 운영자 Gmail + Telegram 알림
"""
from __future__ import annotations

import email
import imaplib
import json
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from email.header import decode_header
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.notify.channels import load_env, notify_both  # noqa: E402

KST = timezone(timedelta(hours=9))


def supa(env: dict, path: str) -> Any:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{path}",
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def supa_patch(env: dict, table: str, query: str, body: dict) -> None:
    req = urllib.request.Request(
        f"{env['SUPABASE_URL']}/rest/v1/{table}?{query}",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
            "Content-Type": "application/json",
        },
        method="PATCH",
    )
    urllib.request.urlopen(req, timeout=20).read()


def decode_subject(raw: bytes | str) -> str:
    if isinstance(raw, bytes):
        try:
            raw = raw.decode("utf-8", errors="replace")
        except Exception:
            raw = str(raw)
    parts = decode_header(raw)
    out = []
    for txt, enc in parts:
        if isinstance(txt, bytes):
            out.append(txt.decode(enc or "utf-8", errors="replace"))
        else:
            out.append(txt)
    return "".join(out)


def classify_reply(subject: str, body: str) -> str:
    """단순 키워드 분류 — 정교한 분류는 추후 LLM 호출."""
    text = (subject + " " + body).lower()
    negative_kw = ["관심없", "거절", "괜찮습니다", "수신거부", "unsubscribe", "not interested", "no thanks"]
    positive_kw = ["관심있", "더 알", "상담", "미팅", "회의", "interested", "tell me more", "schedule", "더 자세"]
    if any(k in text for k in negative_kw):
        return "replied_negative"
    if any(k in text for k in positive_kw):
        return "replied_positive"
    return "replied_positive"  # 기본: 회신 자체가 긍정 신호


def main() -> int:
    env = load_env()
    user = env.get("GMAIL_USER", env.get("OPS_EMAIL", ""))
    pw = env.get("GMAIL_APP_PASSWORD", "")
    if not user or not pw:
        print("⚠️  GMAIL_USER + GMAIL_APP_PASSWORD 누락 — App Password 발급 필요")
        print("   https://myaccount.google.com/apppasswords")
        print("   발급 후 .env GMAIL_APP_PASSWORD= 에 입력")
        return 0  # 비정상 종료 아님 (셋업 대기)

    sent = supa(env, "outreach?select=*&status=eq.sent&order=sent_at.desc&limit=50")
    print(f"📬 모니터링 대상 outreach: {len(sent)}건")
    if not sent:
        return 0

    # Gmail IMAP 연결
    try:
        M = imaplib.IMAP4_SSL("imap.gmail.com")
        M.login(user, pw)
        M.select("INBOX")
    except Exception as e:
        print(f"❌ IMAP 연결 실패: {e}")
        return 1

    detected = []
    for o in sent:
        recipient = o["recipient_email"]
        # 그 수신자로부터 새 메일 검색
        status, data = M.search(None, f'(FROM "{recipient}")')
        if status != "OK" or not data[0]:
            continue
        ids = data[0].split()
        # 최신 1개만
        latest_id = ids[-1]
        status, msg_data = M.fetch(latest_id, "(RFC822)")
        if status != "OK":
            continue
        msg = email.message_from_bytes(msg_data[0][1])
        subject = decode_subject(msg.get("Subject", ""))
        body_parts = []
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    try:
                        body_parts.append(part.get_payload(decode=True).decode("utf-8", errors="replace"))
                    except Exception:
                        pass
        else:
            try:
                body_parts.append(msg.get_payload(decode=True).decode("utf-8", errors="replace"))
            except Exception:
                pass
        body = "\n".join(body_parts)[:2000]

        # 이미 처리된 회신인지 outreach.reply_at 으로 확인
        if o.get("reply_at"):
            continue

        new_status = classify_reply(subject, body)
        supa_patch(env, "outreach", f"id=eq.{o['id']}", {
            "status": new_status,
            "reply_at": datetime.now(KST).isoformat(),
            "reply_body": body[:1500],
        })
        detected.append({
            "recipient": recipient,
            "name": o.get("recipient_name"),
            "subject": subject,
            "new_status": new_status,
            "preview": body[:200],
        })

    M.logout()

    if detected:
        text = "🎉 새 회신 감지!\n\n" + "\n\n".join(
            f"📩 *{d['name']}* ({d['recipient']})\n"
            f"   상태: {d['new_status']}\n"
            f"   제목: {d['subject']}\n"
            f"   미리보기: {d['preview']}"
            for d in detected
        )
        notify_both(env, "[AEO] 새 회신 도착", text)
    else:
        print("✅ 새 회신 없음")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
