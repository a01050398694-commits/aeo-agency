---
name: content-refresh
description: 90일 신선도 룰(Gemini 가중치 10%)에 따라 오래된 콘텐츠를 자동 식별·리프레시. GSC 데이터 + 페이지 lastModified 기반. Triggers when user says "리프레시 필요한 페이지", "오래된 콘텐츠", or monthly cron 1st 09:00.
---

# Content Refresh

## 식별 기준

| 조건 | 액션 |
|---|---|
| 최종 수정 90일 초과 | 자동 큐에 추가 |
| 최종 수정 60~90일 | "리프레시 예정" 표시 |
| 클릭 -30% 이상 하락 | 우선순위 ↑ |
| 평균 순위 5위 → 10위 이상 하락 | 우선순위 ↑↑ |

## 리프레시 작업 표준

### 1. 현재 상태 캡처
- 페이지 URL `WebFetch`
- 현재 콘텐츠 백업: `clients/<이름>/content/archive/<페이지>-YYYYMMDD.md`

### 2. 갭 분석
- 최신 검색 결과 1~10위 분석 (WebSearch)
- 우리 페이지 vs 경쟁 페이지 차이점 추출
- 누락된 주제, 새로운 사실, 업데이트된 통계 식별

### 3. 리프레시 작성
- **Answer Block** 갱신 (첫 단락)
- **새 통계/사실** 추가 (출처 인용)
- **업데이트 날짜** 명시 ("최종 업데이트: YYYY-MM-DD")
- **새 FAQ 1~2개** 추가
- **기존 링크** 점검 (broken link)

### 4. 메타데이터 갱신
- `<meta property="article:modified_time">`
- Schema.org `dateModified`
- 사이트맵 lastmod

### 5. 승인 큐 진입
- `clients/<이름>/content/pending/refresh-<slug>-<date>.md`
- Notion 승인 큐에 카드 추가

## 90일 룰 효과 (검증된 데이터)
- Gemini AI Overviews 랭킹에서 **freshness 10% 가중치**
- 90일 이내 업데이트 페이지 = 인용률 유의미 상승

## 절대 금지
- ❌ 원본 콘텐츠 무단 삭제 (반드시 archive 보존)
- ❌ 가짜 업데이트 (날짜만 바꾸고 본문 그대로)
- ❌ 출처 없는 새 통계 추가
- ✅ Substantive change만 dateModified 갱신
