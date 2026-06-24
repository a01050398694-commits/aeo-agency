#!/usr/bin/env python3
"""
Supabase content_queue → Notion 큐 DB 동기화.

방향:
  - Supabase → Notion (단방향, 매시간 cron)
  - 신규 row insert, 기존 row 상태/내용 update
  - Supabase ID(NUMBER 속성)를 키로 매칭

향후 양방향:
  - Notion에서 상태 변경 → webhook 또는 polling으로 Supabase 갱신
  - Day 3에서는 단방향만 (양방향은 Day 8+ 강화)
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = ROOT / ".env"

NOTION_API = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        return env
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def notion_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


def http(
    method: str, url: str, headers: dict[str, str], body: dict | None = None
) -> tuple[int, dict | str]:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            payload = r.read().decode("utf-8")
            try:
                return r.status, json.loads(payload)
            except json.JSONDecodeError:
                return r.status, payload
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, str(e)
    except Exception as e:
        return 0, f"{type(e).__name__}: {e}"


def supa_get_queue(env: dict[str, str]) -> list[dict[str, Any]]:
    """Supabase content_queue 전체 조회 (service_role)."""
    url = f"{env['SUPABASE_URL']}/rest/v1/content_queue?select=*&order=created_at.desc"
    status, body = http(
        "GET",
        url,
        {
            "apikey": env["SUPABASE_SERVICE_ROLE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_ROLE_KEY']}",
        },
    )
    if status != 200:
        raise RuntimeError(f"Supabase fetch 실패: {status} {body}")
    return body if isinstance(body, list) else []


def notion_query_existing(
    env: dict[str, str], db_id: str
) -> dict[int, str]:
    """Notion DB의 모든 페이지를 'Supabase ID' → page_id 맵으로 반환."""
    token = env["NOTION_TOKEN"]
    out: dict[int, str] = {}
    cursor: str | None = None
    while True:
        body: dict[str, Any] = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        status, resp = http(
            "POST",
            f"{NOTION_API}/databases/{db_id}/query",
            notion_headers(token),
            body,
        )
        if status != 200 or not isinstance(resp, dict):
            raise RuntimeError(f"Notion query 실패: {status} {resp}")
        for page in resp.get("results", []):
            props = page.get("properties", {})
            sid = props.get("Supabase ID", {}).get("number")
            if sid is not None:
                out[int(sid)] = page["id"]
        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
    return out


def build_properties(row: dict[str, Any]) -> dict[str, Any]:
    title = row.get("title") or row.get("target_query") or f"(no title #{row['id']})"
    body_md = (row.get("body_md") or "")[:1900]  # Notion rich_text 2000자 한도
    props: dict[str, Any] = {
        "Title": {"title": [{"text": {"content": title[:200]}}]},
        "Status": {"select": {"name": row.get("status", "pending")}},
        "Type": {"select": {"name": row.get("content_type", "answer_block")}},
        "Client": {
            "rich_text": [{"text": {"content": row.get("client_slug", "") or ""}}]
        },
        "Target Query": {
            "rich_text": [{"text": {"content": (row.get("target_query") or "")[:300]}}]
        },
        "Supabase ID": {"number": row["id"]},
        "Body": {"rich_text": [{"text": {"content": body_md}}]},
    }
    if row.get("created_at"):
        props["Created"] = {"date": {"start": row["created_at"][:10]}}
    return props


def notion_create_page(
    env: dict[str, str], db_id: str, row: dict[str, Any]
) -> str:
    token = env["NOTION_TOKEN"]
    body = {
        "parent": {"database_id": db_id},
        "properties": build_properties(row),
    }
    status, resp = http(
        "POST", f"{NOTION_API}/pages", notion_headers(token), body
    )
    if status not in (200, 201) or not isinstance(resp, dict):
        raise RuntimeError(f"Notion create 실패: {status} {resp}")
    return resp["id"]


def notion_update_page(
    env: dict[str, str], page_id: str, row: dict[str, Any]
) -> None:
    token = env["NOTION_TOKEN"]
    body = {"properties": build_properties(row)}
    status, resp = http(
        "PATCH", f"{NOTION_API}/pages/{page_id}", notion_headers(token), body
    )
    if status != 200:
        raise RuntimeError(f"Notion update 실패: {status} {resp}")


def main() -> int:
    env = load_env()
    db_id = env.get("NOTION_QUEUE_DB_ID")
    if not db_id:
        print("❌ NOTION_QUEUE_DB_ID 누락")
        return 1
    if not env.get("SUPABASE_SERVICE_ROLE_KEY"):
        print("❌ SUPABASE_SERVICE_ROLE_KEY 누락")
        return 1

    print(f"📥 Supabase 큐 조회...")
    rows = supa_get_queue(env)
    print(f"   {len(rows)}건 발견")

    print(f"📋 Notion DB 기존 행 조회...")
    existing = notion_query_existing(env, db_id)
    print(f"   {len(existing)}건 동기화 상태")

    created, updated = 0, 0
    for row in rows:
        sid = row["id"]
        try:
            if sid in existing:
                notion_update_page(env, existing[sid], row)
                updated += 1
            else:
                notion_create_page(env, db_id, row)
                created += 1
            time.sleep(0.4)  # Notion rate limit: 3 req/s
        except Exception as e:
            print(f"   ⚠️  #{sid} 실패: {e}")

    print()
    print(f"✅ 동기화 완료 — 신규 {created}건, 갱신 {updated}건")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
