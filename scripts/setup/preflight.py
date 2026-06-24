#!/usr/bin/env python3
"""
Preflight 검증 — 4주 마스터플랜 Day 1 시작 전 필수.
사용: python scripts/setup/preflight.py
실패 시 exit code 1.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = ROOT / ".env"


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


def check(name: str, ok: bool, detail: str = "") -> bool:
    status = "✅ PASS" if ok else "❌ FAIL"
    print(f"  {status}  {name}  {detail}")
    return ok


def http_get(url: str, headers: dict[str, str], timeout: int = 10) -> tuple[int, str]:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", errors="replace")[:500]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace")[:500]
    except Exception as e:
        return 0, f"{type(e).__name__}: {e}"


def http_post(url: str, headers: dict[str, str], body: dict, timeout: int = 30) -> tuple[int, str]:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", errors="replace")[:500]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace")[:500]
    except Exception as e:
        return 0, f"{type(e).__name__}: {e}"


def main() -> int:
    print("=" * 60)
    print("AEO Agency — Preflight 검증")
    print("=" * 60)
    print()

    env = load_env(ENV_FILE)
    all_ok = True

    # --- 1. .env 필수 키 존재 (v1.2: 풀세트 — 기존 자격증명 재활용) ---
    print("[1] .env 필수 키 존재")
    required = [
        "GEMINI_API_KEY",
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "SUPABASE_ACCESS_TOKEN",
        "NOTION_TOKEN",
        "GITHUB_PAT",
        "VERCEL_TOKEN",
        "RESEND_API_KEY",
        "TELEGRAM_BOT_TOKEN",
        "TELEGRAM_OPS_CHAT_ID",
    ]
    for k in required:
        v = env.get(k, "")
        if not check(k, bool(v)):
            all_ok = False
    print()

    # --- 2. Gemini API 동작 ---
    print("[2] Gemini API 동작")
    if env.get("GEMINI_API_KEY"):
        status, _ = http_post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {"Content-Type": "application/json", "x-goog-api-key": env["GEMINI_API_KEY"]},
            {"contents": [{"parts": [{"text": "say OK"}]}], "generationConfig": {"maxOutputTokens": 5}},
        )
        if not check(f"Gemini API (HTTP {status})", status == 200):
            all_ok = False
    else:
        check("Gemini API", False, "(키 없음 — skip)")
        all_ok = False
    print()

    # --- 3. Supabase REST API ---
    print("[3] Supabase REST API 동작")
    if env.get("SUPABASE_URL") and env.get("SUPABASE_ANON_KEY"):
        status, _ = http_get(
            f"{env['SUPABASE_URL']}/rest/v1/clients?select=slug&limit=1",
            {"apikey": env["SUPABASE_ANON_KEY"], "Authorization": f"Bearer {env['SUPABASE_ANON_KEY']}"},
        )
        # anon은 RLS로 막혀서 빈 배열이 나오거나 권한 거부 — 둘 다 정상
        if not check(f"Supabase REST (HTTP {status})", status in (200, 401)):
            all_ok = False

        # service role 키로 실제 데이터 조회
        if env.get("SUPABASE_SERVICE_ROLE_KEY"):
            status2, body2 = http_get(
                f"{env['SUPABASE_URL']}/rest/v1/clients?select=slug&limit=1",
                {
                    "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
                    "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
                },
            )
            if not check(f"Supabase service_role 동작 (HTTP {status2})", status2 == 200):
                all_ok = False
    else:
        check("Supabase REST", False, "(URL/키 없음)")
        all_ok = False
    print()

    # --- 4. Telegram Bot ---
    print("[4] Telegram Bot")
    if env.get("TELEGRAM_BOT_TOKEN"):
        status, body = http_get(
            f"https://api.telegram.org/bot{env['TELEGRAM_BOT_TOKEN']}/getMe", {}
        )
        if not check(f"Telegram getMe (HTTP {status})", status == 200):
            all_ok = False
    else:
        check("Telegram Bot", False, "(토큰 없음)")
        all_ok = False
    print()

    # --- 5. Resend API ---
    # /domains 는 admin 권한 필요할 수 있음 → /api-keys 또는 401 외 모두 valid로 간주
    print("[5] Resend API")
    if env.get("RESEND_API_KEY"):
        status, body = http_get(
            "https://api.resend.com/api-keys",
            {"Authorization": f"Bearer {env['RESEND_API_KEY']}"},
        )
        # 401 = 키 무효. 200/403 = 키 유효 (단지 권한 범위)
        if not check(f"Resend API (HTTP {status})", status in (200, 403)):
            all_ok = False
    else:
        check("Resend API", False, "(키 없음)")
        all_ok = False
    print()

    # --- 6. GitHub PAT ---
    print("[6] GitHub PAT")
    if env.get("GITHUB_PAT"):
        status, _ = http_get(
            "https://api.github.com/user",
            {
                "Authorization": f"token {env['GITHUB_PAT']}",
                "User-Agent": "aeo-preflight",
            },
        )
        if not check(f"GitHub PAT (HTTP {status})", status == 200):
            all_ok = False
    else:
        check("GitHub PAT", False, "(토큰 없음)")
        all_ok = False
    print()

    # --- 7. 개발 환경 ---
    print("[7] 개발 환경")
    import shutil

    tools = ["python", "node", "npm", "git"]
    for t in tools:
        path = shutil.which(t)
        if not check(t, bool(path), f"({path})" if path else "(미설치)"):
            all_ok = False
    # gh CLI는 Day 1에 설치 — preflight 통과 조건 아님
    gh = shutil.which("gh")
    check("gh (Day 1에 설치 예정)", True, f"({gh})" if gh else "(미설치 — Day 1에 설치)")
    print()

    # --- 최종 ---
    print("=" * 60)
    if all_ok:
        print("🎉 모든 검증 통과 — Day 1 시작 가능")
        return 0
    else:
        print("⚠️  실패 항목 있음 — .env 보강 후 재실행")
        print()
        print("필요한 액션 (v1.1 — 1개만 남음):")
        print("  1. Supabase Service Role: https://supabase.com/dashboard/project/qrcaacrevijtwcibzrep/settings/api")
        print("     → 'Project API keys' → service_role → 복사 → .env SUPABASE_SERVICE_ROLE_KEY=")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
