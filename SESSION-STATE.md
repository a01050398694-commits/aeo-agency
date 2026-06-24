# 세션 상태 스냅샷

> 이 파일은 새 세션 시작 시 `/status` 커맨드가 자동 읽음.
> 작업 종료 시 반드시 업데이트 (다음 세션의 시작점).

---

## 📅 최종 업데이트
**날짜**: 2026-06-24
**세션 종료 시점**: Phase 1 ✅ + Phase E ✅ + Phase A ✅ + Phase B ✅ + **PLAN.md v1.0 작성 완료**

## 🗺️ 4주 마스터 플랜 (PLAN.md)
**Day 0 (현재)**: 사용자 5분 액션 대기 — Supabase Service Role / Resend API / Telegram Bot Token
**Day 1~5**: 시스템 인프라 (대시보드 + 알림 + 보고서 + 매체 워크플로)
**Day 6~10**: 자체 검증 (망원 사이트 + 자사 사이트 + 영업 도구)
**Day 11~15**: 측정 누적 + 케이스 스터디 + 30곳 발굴
**Day 16~20**: 콜드메일 45건 + 미팅 + 첫 계약

자세한 내용은 `D:\aeo\PLAN.md` 참조.
TaskList #9~21 등록 완료 (의존성 그래프로 chain).

---

## 🎯 프로젝트 정의 (불변)

- **사업 모델**: 1인 AEO 에이전시. Gemini AEO 자동화로 5~15개 클라이언트 동시 운영.
- **타깃 엔진**: Gemini 우선 (API 개방, 자동화 가능), ChatGPT 부차 (수동).
- **운영자**: Windows + Claude CLI 단일 사용자. 한국어 기본.
- **인프라**: Claude CLI(설계) + GitHub Actions(cron) + Supabase(DB) + Notion(운영) + Looker Studio(보고)
- **비즈니스 목표**: 클라이언트당 SOV 17% → 30~40% 끌어올리기

---

## ✅ Phase 1 — 셋업 완료

### 핵심 파일 (5)
- `CLAUDE.md`, `.claude/settings.json`, `.gitignore` (SOV JSON 추적 예외 추가), `.gitattributes`, `.env` (실키 주입)

### 서브에이전트 7
truth-verifier · aeo-researcher · content-writer · schema-builder · gemini-monitor · client-onboarder · dashboard-builder

### 스킬 5
gemini-sov-check · schema-markup-generator · gsc-analyzer · content-refresh · client-onboarding

### 슬래시 커맨드 6
/new-client · /daily-check · /weekly-report · /verify-truth · /refresh-content · /status

---

## ✅ Phase E — 첫 클라이언트 (망원 러프러프) 실전 투입

**slug**: `mangwon-roughrough`
**Place URL**: https://map.naver.com/p/entry/place/2060513686
**주소**: 서울 마포구 포은로 105-1 1층 (망리단길)
**타깃 쿼리**: "망원카페 추천"

생성된 파일:
- `clients/mangwon-roughrough/profile.yaml` (검증 상태 [V]/[?]/[P] 표기 적용)
- `clients/mangwon-roughrough/queries.txt` — 80개 (Tier 1~6 카테고리)
- `clients/mangwon-roughrough/competitors.txt` — 직접+광역+큐레이션 매체
- `clients/mangwon-roughrough/restrictions.yaml` — F&B 업종 가드 (표시광고법)
- `clients/mangwon-roughrough/credentials.env.example`
- `clients/mangwon-roughrough/content/answer-blocks/01_mangwon-cafe-recommendation.md` (60/150/300자)
- `clients/mangwon-roughrough/content/faq/faq-page.md` (10문항)
- `clients/mangwon-roughrough/content/schema/local-business.json` (CafeOrCoffeeShop JSON-LD, 네이버 지도 좌표 반영)
- `clients/active.yaml` — 등록 완료

### 🎯 베이스라인 SOV 측정 (2026-06-24)
- **엔진**: Gemini 2.5 Flash + google_search grounding
- **80쿼리 중 20개 성공 / 60개 실패** (Rate Limit 429 — grounding은 추정 6~8 RPM 한도)
- **우리 인용: 0건 → SOV = 0.00%**
- **경쟁사 인용 TOP**:
  - 디에디트(매체) 5건
  - 디에디트 망원 카페 4(매체) 5건
  - 티노마드 2건
  - 소설원 망원 1건
- 핵심 쿼리 답변에 들어간 URL 수:
  - "망원카페 추천": 10개 URL — 러프러프 0
  - "망원동 카페 추천": 10개 URL — 디에디트만
  - "망리단길 카페 추천": 8개 URL — 티노마드만
  - "망원 디저트 카페": 7개 URL — 디에디트, 티노마드
  - "망원 핫플 카페": 13개 URL — 디에디트, 소설원

### 📝 베이스라인 인사이트
1. **디에디트(the-edit.co.kr)가 망원 카페 큐레이션의 dominant 인용 소스** → 1순위 어프로치 대상
2. 다이닝코드는 성수점만 등록 → 망원점 등록 필요
3. 네이버 블로그/인스타에 망원 러프러프 후기 거의 없음 → 자체 콘텐츠 + 협업 블로거 동시 진행

---

## ✅ Phase A — Supabase 무료 프로젝트

- **프로젝트**: `aeo-agency` (ref: `qrcaacrevijtwcibzrep`, Seoul ap-northeast-2)
- **URL**: https://qrcaacrevijtwcibzrep.supabase.co
- **테이블 4개**: `clients` / `sov_measurements` / `citations` / `content_queue`
- **RLS**: 활성화 (service_role만 통과)
- **현재 데이터**:
  - `clients` 1 row (mangwon-roughrough)
  - `sov_measurements` 1 row (2026-06-24 baseline)
  - `content_queue` 3 rows (answer_block / faq / schema — 모두 pending)
- **Service role 키**: 대시보드에서 별도 발급 필요 (MCP 비노출)
  → https://supabase.com/dashboard/project/qrcaacrevijtwcibzrep/settings/api
- 스키마 마이그레이션: `aeo_initial_schema_v1` 적용 완료
- 마이그레이션 소스: `scripts/setup/supabase-schema.sql`

---

## ✅ Phase B — GitHub Actions cron

- `.github/workflows/daily-sov.yml` — 매일 03:00 KST 자동 측정 (수동 트리거 지원)
- `docs/github-actions-setup.md` — Secrets 등록 가이드 (gh CLI 명령 포함)
- **레포 푸시는 아직 안 함** (사용자가 public/private 선택 + 1회 푸시 필요)
- 권장: **public repo** (Actions 무제한 — 클라이언트 5~10명까지 무료)

---

## ⚠️ 즉시 해결 필요 (다음 세션 시작 시)

### 1. Gemini Rate Limit 429 (60/80 실패)
- 현재: `--rpm 10` (6초 간격) → 약 75% 실패
- 원인 추정: Gemini 2.5 Flash + grounding은 일반 Flash보다 낮은 RPM (추정 5~8 RPM)
- 해결 옵션:
  - (a) `--rpm 5` (12초 간격) → 80쿼리 = 16분, 무료 한도 안전
  - (b) 쿼리를 두 회차로 분할 (40개씩) → cron 시간 두 슬롯
  - (c) 유료 티어 전환 (월 ~$1~5)
- 권장: (a)로 수정 후 재측정 — 무료 유지

### 2. Supabase service_role 키 입력
- 현재 `.env` 빈 칸 — 대시보드에서 복사 후 입력
- 필요 시점: cron이 Supabase에 직접 쓸 때 (현재는 로컬 JSON만 저장)

### 3. GitHub 레포 초기 푸시
- `git init` 안 되어 있음 → 사용자가 push 트리거 필요
- 가이드: `docs/github-actions-setup.md`

### 4. 사장님 컨택 항목 (콘텐츠 정확도)
- 정확 영업시간 / 휴무일 / 전화번호 / 인스타 핸들
- 망원점 정확한 메뉴와 가격
- 네이버 스마트플레이스 사장님 권한 위임
- Google 비즈니스 프로필 권한 위임

---

## ⏭️ Phase 3 다음 우선순위

### 옵션 A: 콘텐츠 게재 작전 (즉시 효과 검증)
- 디에디트에 망원 신상 카페 큐레이션 후속 제안
- 다이닝코드 망원점 등록
- 네이버 블로그 — 협업 블로거 3명 동시 콘텐츠 게재
- 인스타 비즈니스 활성화 → 주 3회 포스팅
- 7~14일 후 SOV 재측정

### 옵션 B: Rate Limit 해결 + 2차 베이스라인
- `gemini_sov.py` `--rpm 5` 기본화
- 어제 실패한 60개 재측정 (오늘 한도 따로 카운트되므로 가능)
- 통합 베이스라인 확정

### 옵션 C: 두번째 클라이언트 온보딩
- 같은 동선 검증 (반복가능성 테스트)
- `/new-client <slug>` 워크플로 다듬기

### 옵션 D: Notion 운영 칸반
- 승인 대기열 시각화
- content_queue 테이블 → Notion DB 양방향 동기화

### 옵션 E: 대시보드 초기화 (Next.js)
- `dashboard/` Next.js 16 App Router
- shadcn/ui + Supabase 연결
- `/ops` 운영 / `/[clientSlug]` 클라이언트 보고

---

## 🔧 환경변수 상태 (.env)

- ✅ GEMINI_API_KEY (Gemini #1 — AskBit 공유)
- ⚠️ ANTHROPIC_API_KEY (Claude Code OAuth로 처리 — 별도 키 미입력)
- ✅ SUPABASE_URL / ANON_KEY / PUBLISHABLE_KEY
- ⚠️ SUPABASE_SERVICE_ROLE_KEY (대시보드에서 복사 필요)
- ✅ NOTION_TOKEN (사용 시점 대기)
- ✅ GITHUB_PAT (cron Secrets 등록 시 사용)
- ✅ VERCEL_TOKEN (대시보드 배포 시 사용)
- ❌ SLACK_WEBHOOK_URL (알림 활성화 안 함)
- ❌ RESEND_API_KEY (이메일 알림 안 함)

---

## 📋 작업 트래커 상태

세션 종료 시점 TaskList 모두 completed:
- #1 .env 자동 생성 ✅
- #2 카페 리서치 ✅
- #3 클라이언트 폴더/파일 6종 ✅
- #4 SOV 스크립트 ✅
- #5 베이스라인 측정 ✅
- #6 Supabase 셋업 ✅
- #7 cron 워크플로 ✅
- #8 SESSION-STATE 갱신 ✅

---

## 🚀 다음 세션 권장 시작 흐름

```
사용자: /status
Claude: [현재 상태 출력 → 위 Phase 3 옵션 제시]
사용자: "A로 가자" (콘텐츠 게재) 또는 "B로 가자" (RPM 수정 후 재측정) 등
Claude: 해당 작업 시작 + 7일 후 SOV 재측정으로 효과 검증
```

---

## 📚 참조 (이 세션에서 검증된 사실)

- Gemini 2.5 Flash + grounding: 80쿼리 측정 시 60건 429 (분당 한도 6~8 추정)
- Supabase 무료 프로젝트 ap-northeast-2: 즉시 ACTIVE_HEALTHY
- 망원 러프러프 주소: 마포구 포은로 105-1 1층 (다이닝코드/블로그/Visit Korea 교차 확인)
- 망원 카페 큐레이션 dominant 매체: 디에디트(the-edit.co.kr), 다이닝코드, 트립닷컴
- 망원 러프러프 네이버 좌표: lat 37.5564948, lng 126.9046239 (사용자 제공 URL)

---

## 🔐 보안 메모

- `.env` 는 .gitignore 적용 — 절대 커밋 금지
- `clients/*/credentials.env` 동일
- API_REGISTRY.md (D:\claude\)는 별도 관리 — 본 레포에 복사 금지
