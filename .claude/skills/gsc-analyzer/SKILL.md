---
name: gsc-analyzer
description: Google Search Console MCP 서버로 클라이언트 GSC 데이터를 자동 분석. 트래픽 하락, Quick Wins(노출 高 CTR 低), 콘텐츠 디케이, AI Overview 클릭 추적. Triggers when user says "GSC 분석", "트래픽 점검", "Quick Wins 찾아줘", or weekly cron Mon 09:00.
---

# GSC Analyzer

## 사전 조건
- GSC MCP 서버 설치 + OAuth 인증 완료
  - `claude mcp add gsc-mcp -- uvx mcp-gsc`
- 클라이언트별 GSC 사이트 권한 부여

## 분석 메뉴

### 1. 트래픽 이상 감지 (일일)
```
어제 vs 지난 7일 평균
- 클릭 수 -20% 이상 ↓ → 🔴 긴급
- 노출 수 -30% 이상 ↓ → 🔴 긴급
- CTR -15% 이상 ↓ → 🟠 주의
```

### 2. Quick Wins (주간)
**조건**: 노출 1,000+ AND CTR 1% 미만 AND 평균 순위 5~15
**액션**: 해당 페이지의 title/meta description 재작성

### 3. 콘텐츠 디케이 (월간)
**조건**: 3개월 전 대비 클릭 -50% 이상
**액션**: 90일 룰 적용, 콘텐츠 리프레시 큐에 추가

### 4. AI Overview 클릭 추적
**조건**: 쿼리 중 "AI Overview" 노출 페이지 식별
**액션**: 해당 페이지를 Gemini-friendly 콘텐츠로 강화

### 5. 신규 쿼리 발견 (주간)
**조건**: 지난주 신규 등장한 쿼리 (노출 100+)
**액션**: 콘텐츠 갭 분석, 새 페이지/FAQ 추천

## 출력 형식

`clients/<이름>/reports/gsc-YYYYMMDD.md`

```markdown
# GSC 주간 분석 — [클라이언트명]
**기간**: YYYY-MM-DD ~ YYYY-MM-DD

## 🔴 긴급 (즉시 대응)
- [페이지] 클릭 -X%, 원인 추정: ...

## 🟠 Quick Wins (우선 작업)
- [페이지] 노출 X, CTR Y% → 목표 Z%

## 🔵 신규 기회
- [쿼리] 신규 노출 X회 → 콘텐츠 작성 권장

## 📊 전체 지표
- 총 클릭: X (전주 대비 ±Y%)
- 총 노출: X
- 평균 CTR: X%
- 평균 순위: X
```

## 절대 금지
- ❌ 다른 클라이언트 GSC 데이터 접근
- ❌ "약 X%" 모호한 수치 (정확한 값 사용)
- ❌ GSC 24~48시간 지연 데이터를 실시간으로 표시
