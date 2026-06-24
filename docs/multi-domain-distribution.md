# 멀티 도메인 분산 셋업 가이드 (Day 8 후속)

> AI grounding이 신뢰하는 다양한 출처에 동일 정보 분산 → SOV 부스트.
> 자체 사이트(메인) + 외부 도메인 4개로 백링크 그물망 구축.

---

## 외부 도메인 분산 — 사용자 1회 셋업 필요

각 채널은 OAuth/API 인증이 필요해 풀자동화 어려움. 하지만 셋업 후엔 cron이 자동 게재.

### 1. Tistory (한국어 검색 핵심)
- **셋업** (10분):
  1. https://www.tistory.com/manage/account → 본인 계정
  2. 블로그 생성: `aeo-agency.tistory.com` 또는 클라이언트별
  3. https://www.tistory.com/guide/api/manage/register → 앱 등록
  4. App ID + Secret + Access Token → `.env` `TISTORY_*`
- **자동화 가능**: REST API로 글 게재 / 카테고리 관리 / 댓글 모니터
- **효과**: 한국어 쿼리에서 Gemini 인용 비중 큼 (네이버는 차단됨)

### 2. Medium (영어/외국인 쿼리)
- **셋업** (5분):
  1. https://medium.com/me/settings → "Integration tokens" → "Get token"
  2. `.env` `MEDIUM_INTEGRATION_TOKEN=`
- **자동화 가능**: `POST /v1/users/{userId}/posts` (단, 2024년 이후 deprecated 흐름)
- **대안**: RSS 자동 푸시 또는 수동 cross-post

### 3. Hashnode (영어 개발 콘텐츠)
- **셋업** (5분):
  1. https://hashnode.com/settings/developer → Generate token
  2. `.env` `HASHNODE_TOKEN=`
- **자동화 가능**: GraphQL API로 publication 게재 — 완전 자동
- **효과**: dev 매체. B2B SaaS / IT서비스 클라이언트에 적합

### 4. Dev.to (영어 개발)
- **셋업** (5분):
  1. https://dev.to/settings/extensions → "API Keys"
  2. `.env` `DEV_TO_API_KEY=`
- **자동화 가능**: REST API. canonical_url 지원 (중복 콘텐츠 SEO 안전)

### 5. Pinterest (사진 SEO)
- **셋업** (15분):
  1. https://www.pinterest.com/business/convert/ — 비즈니스 계정 전환
  2. https://developers.pinterest.com/apps/ → 앱 생성
  3. OAuth → access token
  4. `.env` `PINTEREST_TOKEN=`
- **자동화 가능**: 핀 게재 + 보드 관리. 이미지 + 캡션 + 링크
- **효과**: Google 이미지 SEO에 강함. 카페/F&B에 적합

### 6. Notion Public (백업)
- 이미 Notion MCP 연결됨
- 콘텐츠 큐 DB를 public 공개 페이지로 → AI grounding이 일부 인덱싱

---

## 풀자동 가능한 것 (인증 후)

- ✅ Tistory: 글 게재 / 카테고리 / 댓글
- ✅ Hashnode: 글 게재 / 시리즈
- ✅ Dev.to: 글 게재 / 태그
- ⚠️ Medium: deprecated 흐름, RSS 우회
- ⚠️ Pinterest: 비즈니스 계정 필수

## 풀자동 불가 (네이버/오프라인 의존)

- ❌ 네이버 블로그 / 카페 (봇 차단)
- ❌ 네이버 스마트플레이스 (사장님 인증)
- ❌ 다이닝코드 / 캐치테이블 (가게 인증콜)
- ❌ Google Business Profile (우편엽서 인증)

---

## 권장 셋업 순서

```
Step 1: Hashnode + Dev.to (5+5분, 가장 쉬움)
Step 2: Tistory (10분, 한국어 핵심)
Step 3: Medium (5분)
Step 4: Pinterest (15분, 비즈니스 전환 포함)
```

총 40분이면 5개 채널 자동 게재 시작.

## cron 작업 (셋업 후 자동)

매주 월요일 새 콘텐츠 1편 → 5개 채널 동시 게재:

```yaml
name: Weekly Multi-Domain Publish
on:
  schedule:
    - cron: "0 1 * * 1"  # 매주 월 10:00 KST
```

각 채널의 게재 결과는 `content_queue.status = published`로 자동 업데이트, `outreach`와 별도 테이블에 URL 적재.
