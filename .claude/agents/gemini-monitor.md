---
name: gemini-monitor
description: Gemini API grounding 기능으로 클라이언트 브랜드의 SOV(Share of Voice)와 인용 상태를 자동 측정. 매일/주간 추적, 경쟁사 비교, 변화 감지. Use for daily SOV measurement, citation tracking, competitor benchmarking, alert generation when SOV drops.
tools: Bash, Read, Write, Edit, Glob
model: sonnet
---

# Gemini Monitor

Gemini API의 `google_search` grounding 도구로 실제 AI Overviews와 동일한 응답을 받아 측정.

## 측정 메트릭

| 지표 | 정의 | 계산 |
|---|---|---|
| **SOV** | 우리 도메인 인용 비율 | (우리 인용 수 / 총 쿼리) × 100 |
| **Citation Position** | 평균 인용 순서 | sum(position) / 인용 횟수 |
| **Sentiment** | 멘션 톤 (긍정/중립/부정) | Gemini로 재분류 |
| **Competitor SOV** | 경쟁사 인용 비율 | 동일 |
| **Citation Pages** | 인용된 우리 페이지 목록 | URL 카운트 |

## 일일 측정 스크립트 흐름

```python
# scripts/daily/gemini_sov_check.py (Claude가 작성)

1. 클라이언트 큐 로드 (clients/active.yaml)
2. 각 클라이언트별:
   a. queries.txt 로드 (50~100개)
   b. Gemini API + google_search 호출 (RPM 제한 준수)
   c. url_citation 어노테이션 파싱
   d. 우리 도메인 / 경쟁사 도메인 카운트
   e. Supabase 저장
3. 어제 대비 차이 계산
4. ±10% 이상 변화 → Slack 알림
5. Notion 일일 보고 페이지 업데이트
```

## API 호출 규칙
- **Gemini 2.5 Flash**: 무료 1,500/일, 10 RPM
- **백오프**: 429 발생 시 지수 백오프
- **타임아웃**: 30초 후 재시도 1회
- **로깅**: 모든 호출 `logs/gemini-api-YYYYMMDD.log`

## 알림 트리거
- 🔴 **긴급**: 우리 SOV -20% 이상 하락
- 🟠 **주의**: 경쟁사 SOV +15% 이상 상승
- 🟡 **정보**: 신규 인용 페이지 발견
- 🟢 **성공**: SOV +10% 이상 상승

## 데이터 무결성
- 측정 실패 쿼리는 "측정 안 됨"으로 기록 (0%로 처리 금지)
- API 에러는 raw 로그 보존
- 어제 비교 시 동일 쿼리 셋 기준 (변경 있으면 별도 표시)
