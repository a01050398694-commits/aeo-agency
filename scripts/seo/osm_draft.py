#!/usr/bin/env python3
"""
OpenStreetMap POI 등록 사양 자동 생성.

OSM도 anonymous 자동 등록 어려움 → 사용자 1회 액션:
  1. https://www.openstreetmap.org/edit#map=18/37.5564948/126.9046239
  2. iD editor에서 우측 + 버튼 → Point 추가
  3. 좌표에 마커 찍기 (자동 위치)
  4. Preset = "Cafe / 카페"
  5. 아래 태그 사양대로 입력
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "tmp" / "osm-rufruf-mangwon.json"


SPEC = {
    "geometry": {"type": "Point", "coordinates": [126.9046239, 37.5564948]},
    "tags": {
        "name": "러프러프 망원점",
        "name:en": "RUFRUF Mangwon",
        "name:ko": "러프러프 망원점",
        "amenity": "cafe",
        "cuisine": "cake;coffee_shop",
        "addr:country": "KR",
        "addr:city": "서울특별시",
        "addr:district": "마포구",
        "addr:place": "망원동",
        "addr:street": "포은로",
        "addr:housenumber": "105-1",
        "addr:floor": "1",
        "opening_hours": "Mo-Fr 11:00-22:00; Sa-Su 11:00-23:00",
        "website": "",
        "naver:place_id": "2060513686",
        "wheelchair": "yes",
        "internet_access": "wlan",
        "dog": "yes",
        "outdoor_seating": "no",
        "takeaway": "yes",
        "wikidata": "",
        "description": "망리단길 바스크 치즈케이크 카페. 시그니처 러프 라떼와 크럼블 치즈케이크.",
        "description:en": "Basque cheesecake cafe in Mangwon-dong, Mapo-gu, Seoul. Signature: RUF Latte and crumble cheesecake.",
    },
    "_notes": {
        "editor_url": "https://www.openstreetmap.org/edit#map=18/37.5564948/126.9046239",
        "manual_step": "위 좌표에서 iD editor로 마커 추가 후 위 태그 입력. 5분.",
        "after_deployment": "website / wikidata 태그는 URL/Q-number 받으면 갱신",
    },
}


def main() -> int:
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(SPEC, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ OSM 사양 저장: {OUT}")
    print()
    print("📋 등록 절차:")
    print(f"  1. {SPEC['_notes']['editor_url']}")
    print("  2. 우측 + 'Point' 클릭 → 좌표에 마커 찍기")
    print("  3. Preset 검색: '카페' 또는 'cafe'")
    print("  4. 'All tags' 탭에서 위 태그 입력")
    print("  5. 'Save' → 커밋 메시지: 'Add RUFRUF Mangwon cafe' → 업로드")
    print("  6. 등록 OSM ID를 .env OSM_NODE_ID 에 저장")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
