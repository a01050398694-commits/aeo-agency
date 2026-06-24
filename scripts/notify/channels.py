"""
멀티 채널 알림 — Telegram + Resend(이메일).
의존성 0 (stdlib만).
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


def load_env(env_file: Path | None = None) -> dict[str, str]:
    env_file = env_file or Path(__file__).resolve().parents[2] / ".env"
    env: dict[str, str] = {}
    if not env_file.exists():
        return env
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def send_telegram(env: dict[str, str], text: str) -> tuple[bool, str]:
    token = env.get("TELEGRAM_BOT_TOKEN")
    chat_id = env.get("TELEGRAM_OPS_CHAT_ID")
    if not token or not chat_id:
        return False, "TELEGRAM_BOT_TOKEN 또는 chat_id 없음"
    body = {
        "chat_id": int(chat_id),
        "text": text,
        "disable_web_page_preview": True,
        "parse_mode": "Markdown",
    }
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            res = json.loads(r.read())
            return bool(res.get("ok")), f"message_id={res.get('result',{}).get('message_id')}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')[:200]}"
    except Exception as e:
        return False, f"{type(e).__name__}: {e}"


def send_email(
    env: dict[str, str],
    subject: str,
    html: str,
    *,
    to: str | list[str] | None = None,
    text: str | None = None,
    reply_to: str | None = None,
    attachments: list[dict[str, Any]] | None = None,
) -> tuple[bool, str]:
    """
    Resend API로 이메일 발송.
    - to 기본값: 운영자 (system 등록 이메일)
    - 첨부: [{"filename": "x.pdf", "content": "<base64>"}]
    """
    key = env.get("RESEND_API_KEY")
    if not key:
        return False, "RESEND_API_KEY 없음"
    sender = env.get("FROM_EMAIL", "noreply@askbit.co")
    recipient = to or env.get("OPS_EMAIL", "a01050398694@gmail.com")
    if isinstance(recipient, str):
        recipient = [recipient]

    body: dict[str, Any] = {
        "from": f"AEO Agency <{sender}>",
        "to": recipient,
        "subject": subject,
        "html": html,
    }
    if text:
        body["text"] = text
    if reply_to:
        body["reply_to"] = reply_to
    if attachments:
        body["attachments"] = attachments

    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=data,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "aeo-agency/1.0 (python-urllib)",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            res = json.loads(r.read())
            return True, f"email_id={res.get('id')}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')[:200]}"
    except Exception as e:
        return False, f"{type(e).__name__}: {e}"


def notify_both(env: dict[str, str], subject: str, text: str, html: str | None = None) -> dict[str, str]:
    """Telegram + Email 둘 다 발사. 결과 dict 반환."""
    tg_ok, tg_msg = send_telegram(env, text)
    em_ok, em_msg = send_email(env, subject, html or text.replace("\n", "<br>"), text=text)
    return {
        "telegram": f"{'OK' if tg_ok else 'FAIL'} {tg_msg}",
        "email": f"{'OK' if em_ok else 'FAIL'} {em_msg}",
    }
