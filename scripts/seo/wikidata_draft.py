#!/usr/bin/env python3
"""
Wikidata 엔트리 사양 자동 생성 — 망원 러프러프.

Wikidata는 anonymous API 등록이 제한되므로 (CAPTCHA + 봇 차단),
사양 JSON을 자동 생성해 사용자가 wikidata.org/wiki/Special:NewItem 에
한 번 붙여넣으면 등록 완료.

사용:
  python scripts/seo/wikidata_draft.py
  → output/wikidata-rufruf-mangwon.json + 등록 URL
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "tmp" / "wikidata-rufruf-mangwon.json"


SPEC = {
    "labels": {
        "ko": {"language": "ko", "value": "러프러프 망원점"},
        "en": {"language": "en", "value": "RUFRUF Mangwon"},
        "ja": {"language": "ja", "value": "ラフラフ望遠店"},
    },
    "descriptions": {
        "ko": {"language": "ko", "value": "서울 마포구 망원동 망리단길의 바스크 치즈케이크 카페 (러프러프 두 번째 매장)"},
        "en": {"language": "en", "value": "Dessert cafe in Mangwon-dong, Mapo-gu, Seoul, South Korea, second branch of RUFRUF"},
    },
    "aliases": {
        "ko": [{"language": "ko", "value": "RUFRUF 망원"}, {"language": "ko", "value": "러프러프 망원"}],
        "en": [{"language": "en", "value": "Ruf Ruf Mangwon"}, {"language": "en", "value": "RUFRUF Manwon"}],
    },
    "claims_to_add": [
        {"property": "P31", "value": "Q30022", "note": "instance of: cafe"},
        {"property": "P17", "value": "Q884", "note": "country: South Korea"},
        {"property": "P131", "value": "Q620974", "note": "located in: Mapo-gu (확인 필요)"},
        {"property": "P625", "value": "37.5564948,126.9046239", "note": "coordinate location"},
        {"property": "P969", "value": "포은로 105-1 1층", "note": "street address (Korean)"},
        {"property": "P856", "value": "", "note": "official website — 배포 URL 받으면 입력"},
        {"property": "P2002", "value": "", "note": "Twitter handle (없음)"},
        {"property": "P2003", "value": "", "note": "Instagram username (확인 필요)"},
        {"property": "P749", "value": "Q-rufruf-seongsu", "note": "parent organization: RUFRUF Seongsu (본점 엔티티가 있다면)"},
    ],
    "sources": [
        "https://map.naver.com/p/entry/place/2060513686",
        "https://www.diningcode.com/profile.php?rid=a3p5II0KMDSf",
        "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=236a8218-1fb8-41ca-8438-c073f9480680",
    ],
    "_notes": {
        "registration_url": "https://www.wikidata.org/wiki/Special:NewItem",
        "manual_step": "Wikidata는 anonymous bot 등록이 제한되므로 위 URL에 로그인 후 위 사양을 수동 입력 (10분 작업)",
        "after_deployment": "사이트 배포 URL 받으면 P856(official website) 수정",
    },
}


def main() -> int:
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(SPEC, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ Wikidata 사양 저장: {OUT}")
    print()
    print("📋 등록 절차:")
    print("  1. https://www.wikidata.org/wiki/Special:UserLogin/signup (계정 없으면 가입)")
    print("  2. https://www.wikidata.org/wiki/Special:NewItem 열기")
    print("  3. Label/Description/Aliases 입력 (ko/en/ja)")
    print("  4. Add statement → P31 (instance of) → cafe (Q30022)")
    print("  5. P17 (country) → South Korea")
    print("  6. P625 (coordinate location) → 37.5564948 N, 126.9046239 E")
    print("  7. P969 (street address) → 포은로 105-1 1층")
    print("  8. Sources 추가 (naver place URL)")
    print("  9. 저장 → Q-number 발급됨")
    print(" 10. .env 에 WIKIDATA_QID=Q12345 등록")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
