---
name: gemini-sov-check
description: Gemini API의 google_search grounding으로 클라이언트 브랜드의 SOV(Share of Voice)를 측정. Triggers when user says "SOV 체크", "Gemini 노출 확인", "오늘 인용 어땠어", or runs daily cron at 03:00 KST.
---

# Gemini SOV Check Skill

## 사용 시점
- 사용자가 명시적 요청: "오늘 SOV 측정해줘"
- 일일 cron 자동 실행 (03:00 KST)
- 클라이언트 온보딩 베이스라인 측정
- 콘텐츠 게재 후 7일 효과 측정

## 실행 절차

### 1. 사전 조건 확인
- `clients/<이름>/credentials.env` 에 `GEMINI_API_KEY` 존재 확인
- `clients/<이름>/queries.txt` 존재 + 50개 이상 쿼리
- `clients/<이름>/competitors.txt` 존재

### 2. 측정 실행
```python
# scripts/daily/gemini_sov.py 호출
python scripts/daily/gemini_sov.py --client <이름> --date $(date +%Y-%m-%d)
```

### 3. 결과 파싱
- 각 쿼리당 인용 URL 추출
- 우리 도메인 매칭 카운트
- 경쟁사 도메인 매칭 카운트
- 인용 위치(첫번째/두번째/...) 기록

### 4. 저장
- Supabase 테이블 `sov_measurements`
- 로컬 백업: `clients/<이름>/logs/sov-YYYYMMDD.json`

### 5. 보고
- 어제 대비 변화율 계산
- ±10% 이상 → Slack 알림 트리거
- Notion `🏢 클라이언트 DB` 페이지 업데이트

## 무료 한도 관리
- Gemini 2.5 Flash: 1,500 req/day, 10 RPM
- 클라이언트 1명당 100 쿼리 → 15명까지 무료
- 초과 시: 클라이언트별 2일에 1번 측정으로 분산

## 에러 처리
- 429 Rate Limit → 지수 백오프 (1s → 2s → 4s → 8s)
- 5xx 서버 에러 → 1회 재시도
- 인증 실패 → 즉시 알림, 측정 중단
- 부분 실패 → 성공한 부분만 저장, 실패 쿼리 별도 로그

## 절대 금지
- ❌ 측정 실패한 쿼리를 0%로 처리 ("측정 실패"로 별도 표시)
- ❌ 한 쿼리 결과를 다른 클라이언트에 재사용
- ❌ Mock 데이터로 결과 채우기
