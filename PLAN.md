# AEO Agency — 4주 마스터 플랜 v1.1

> **목적**: 1인 AEO 에이전시 풀 자동화 시스템 + 자체 검증 데이터 + 첫 영업까지 4주 무중단 진행.
> **원칙**: 각 Day는 사전조건(IN) → 산출물(OUT) → 자동검증(VERIFY) → 차단(BLOCK if fail) 구조.
> **변경금지**: Day 1~20 구조는 동결. v1.2 분기 필요 시 changelog 추가.

## Changelog
- **v1.1 (2026-06-24)** — Telegram + Resend 제거. Gmail MCP 단일 채널로 통합. 사용자 사전 준비 5분 → 1분 (Supabase Service Role만). 도구 단순화로 신뢰성·유지보수성 향상.
- **v1.0 (2026-06-24)** — 초기 작성.

---

## 0. Mission & Constraints

**Mission**: 4주 후 다음 상태에 도달.
1. 운영자(나)가 CLI 안 켜고 핸드폰만으로 5~10 클라이언트 관리 가능
2. 자체 검증 데이터: 망원 러프러프 + 자사 에이전시 사이트에서 **Before SOV 0% → After SOV ≥10%** 실측
3. 첫 영업 미팅 1~2건 진행, 첫 계약 1건 클로징 시도

**Constraints (절대 어기지 마라)**:
- C1. **거짓 보고 금지**. 모든 진행 상태는 verify 통과 후 보고.
- C2. **데이터 날조 금지**. 모르는 수치는 "[확인 필요]" 표시.
- C3. **출처 인용**. 외부 사실 주장은 [출처: URL].
- C4. **클라이언트 데이터 격리**. RLS + .gitignore + 별도 폴더.
- C5. **무료 한도 유지**. 도메인 + 외부 결제 0원.
- C6. **24/7 안정**. 운영자 부재 시에도 cron 정상 작동.

---

## 1. Tech Stack (Frozen)

| 레이어 | 도구 | 버전 / 비고 |
|--------|------|------------|
| Frontend | Next.js | 16 App Router |
| UI | shadcn/ui + Tailwind | v4 |
| Charts | Recharts | 최신 |
| Backend | Supabase | Postgres 17 + RLS |
| Cron | GitHub Actions | public repo (무제한) |
| Email + Notify + Outreach | Gmail MCP (단일 채널) | 일 500 발송, 알림/보고/콜드메일 통합 |
| AI Eval | Gemini 2.5 Flash + Ahrefs Brand Radar MCP | Gemini 무료 1,500/일 |
| Hosting | Vercel | Hobby (자사 도메인은 미사용 시 자동 OK) |
| Media | Higgsfield MCP | 사용자 OAuth |
| CMS 분산 | Tistory REST + Medium API + Hashnode + Pinterest | 무료 |
| Indexing | GSC API + Bing Webmaster API + IndexNow | 무료 |
| Knowledge Graph | Wikidata API + OpenStreetMap | 무료 |

---

## 2. Architecture

```
┌─────────── 측정 레이어 ──────────────────────────────┐
│ GitHub Actions cron (매일 03:00 KST)                │
│   ├─ scripts/daily/gemini_sov.py  (모든 active client)│
│   ├─ scripts/daily/ahrefs_radar.py (Ahrefs MCP)      │
│   ├─ scripts/daily/gsc_pull.py    (GSC API)          │
│   └─ → Supabase 자동 적재 + Telegram 알림            │
└──────────────────────────────────────────────────────┘
                          │
┌────────── 저장 ─────────▼───────────────────────────┐
│ Supabase qrcaacrevijtwcibzrep (Seoul)               │
│  Tables: clients · sov_measurements · citations     │
│          content_queue · outreach · jobs_log        │
│  RLS: service_role bypass, slug-based public read   │
└──────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐ ┌────────────────┐ ┌────────────────┐
│ Next.js 대시 │ │ Telegram 알림  │ │ Resend 자동    │
│ board /ops   │ │  • SOV ±10%   │ │  주간 PDF      │
│ /[client]    │ │  • 큐 대기     │ │  월간 보고서   │
│ Vercel 배포  │ │  • 매체 회신  │ │  매체 회신     │
└──────────────┘ └────────────────┘ └────────────────┘
        │
        ▼
   운영자 / 클라이언트 (브라우저 또는 폰)
```

---

## 3. 사전 준비 (Day 0 — 사용자 1분 액션)

### 사용자가 직접 해야 할 것 (1개, 1분)

#### 3-1. Supabase Service Role Key
- URL: https://supabase.com/dashboard/project/qrcaacrevijtwcibzrep/settings/api
- "Project API keys" → `service_role` → 복사 (`eyJ...` 형식 JWT)
- `.env` `SUPABASE_SERVICE_ROLE_KEY=` 에 붙여넣기

**왜 필요한가**: GitHub Actions cron이 매일 03:00 KST 자동 실행될 때 Supabase에 SOV 결과를 쓰기 위한 권한. anon 키는 RLS로 막혀서 쓰기 불가.

**완료 신호**: `.env`에 입력 → `python scripts/setup/preflight.py` 실행 → 모두 OK 출력

### 자동 처리 가능한 사전 작업 (Day 1 시작 시 우리가 한다)
- `gh` CLI 설치 + 인증
- Next.js 16 프로젝트 스캐폴딩
- Supabase 추가 테이블 마이그레이션 (outreach, jobs_log, weekly_reports, media_targets, prospects)
- GitHub 레포 생성 + 푸시 + Secrets 등록 (GitHub PAT는 이미 .env에 있음)
- Gmail MCP 동작 확인 (인증된 사용자 Gmail로 자기 자신에게 테스트 메일 발송)

### 자동 처리 가능한 사전 작업 (Day 1 시작 시 우리가 한다)
- `gh` CLI 설치 (`winget install GitHub.cli`)
- Next.js 16 프로젝트 스캐폴딩
- Supabase 추가 테이블 마이그레이션 (outreach, jobs_log)
- GitHub 레포 생성 + 푸시 + Secrets 등록

---

## 4. Day-by-Day 플랜 (Day 1 ~ 20)

각 Day: **IN(사전) → OUT(산출물) → VERIFY(자동검증) → BLOCK(실패 시 차단여부)**.

---

### 📦 Week 1 — 시스템 인프라

#### Day 1 (4시간) — 프로젝트 골격 + 추가 마이그레이션
- **IN**: 사전준비 3-1~3-3 모두 완료. `.env` preflight OK.
- **OUT**:
  - `gh` CLI 설치 + 인증
  - `dashboard/` Next.js 16 프로젝트 생성 (shadcn/ui + Tailwind v4 + Recharts)
  - Supabase 추가 마이그레이션 적용: `outreach`, `jobs_log`, `weekly_reports`, `media_targets` 테이블
  - GitHub `aeo-agency` public repo 생성 + 초기 푸시 + Secrets 등록 (GEMINI / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)
  - 베이스라인 시드 데이터 입력
- **VERIFY**:
  - `cd dashboard && npm run build` → 성공
  - `python scripts/setup/verify_db.py` → 모든 테이블 + RLS 정책 OK
  - GitHub Actions tab에서 workflow 1회 수동 실행 → 성공
- **BLOCK**: 빌드 실패 또는 마이그레이션 실패 시 Day 2 진행 불가.

#### Day 2 (4시간) — 운영자 메인 대시보드 + 클라이언트 포털
- **IN**: Day 1 OUT 전부 검증 완료.
- **OUT**:
  - `/ops` 메인 페이지 — 클라이언트 카드 + 전체 SOV 평균 + 어제 변화율
  - `/ops/clients/[slug]` 상세 — 7/30/90일 SOV 추이 (Recharts), 경쟁사 인용 TOP, 쿼리별 인용 여부
  - `/[clientSlug]` 클라이언트 공개 포털 — slug-based access (인증 없이도 접근, RLS로 보호)
  - 다크모드, 모바일 반응형
- **VERIFY**:
  - 망원-러프러프 데이터로 차트 렌더링 확인
  - 모바일 viewport에서 레이아웃 깨짐 없음
  - Vercel preview 배포 성공 → 공개 URL 발급
- **BLOCK**: 차트 렌더링 안 되면 Day 3 차단.

#### Day 3 (3시간) — 콘텐츠 큐 + Notion 연동
- **IN**: Day 2 OUT 검증.
- **OUT**:
  - `/ops/queue` 칸반 (pending / approved / rejected / published)
  - Drag-and-drop 또는 클릭 한 번으로 상태 전환
  - Notion DB 미러링 (Notion MCP) — 양방향 sync
  - 콘텐츠 미리보기 (markdown rendering)
  - "승인 → 게재" 시 자동으로 Tistory/Medium에 발행 (옵션, Day 9에 완성)
- **VERIFY**:
  - 카드 3건 (이미 적재된 망원 시드) 모두 표시
  - Notion DB 동기화 확인 (수동 1건 → DB 변경 → 대시보드 반영 1분 내)
- **BLOCK**: Notion sync 실패는 Day 4 진행 가능 (선택 기능).

#### Day 4 (3시간) — Gmail 알림 + PDF 보고서
- **IN**: Day 3 OUT 검증.
- **OUT**:
  - `scripts/notify/gmail_alert.py` — Gmail MCP 래퍼 (운영자 자기 자신에게 발송)
  - cron에 후크: SOV ±10% 변화 / 새 회신 / 콘텐츠 큐 24h 이상 미처리 → 자기 이메일로 발송
  - `scripts/reports/weekly_pdf.py` — React-PDF 또는 puppeteer로 PDF 생성
  - 주간 PDF 자동 발송 (매주 월 09:00 KST) via Gmail MCP (운영자/클라이언트)
- **VERIFY**:
  - 테스트 알림 1건 본인 Gmail 받은편지함 도착
  - 망원-러프러프 PDF 1건 생성 → `clients/mangwon-roughrough/reports/2026-W26.pdf` 확인 → Gmail 첨부 발송 OK
- **BLOCK**: Gmail MCP 실패 시 OAuth 재인증.

#### Day 5 (3시간) — 매체 어프로치 자동 워크플로
- **IN**: Day 4 OUT 검증 + Resend 동작.
- **OUT**:
  - `media_targets` 시드 데이터 30개 (디에디트, 세시간전, 어반인사이드 등 + 한국 SaaS 매체 IT동아, 플래텀 등)
  - `scripts/outreach/cold_email.py` — Gmail MCP로 개인화 이메일 자동 발송 + `outreach` 테이블 적재
  - Gmail MCP로 inbox 모니터링 → 응답 자동 분류 (긍정/거절/무응답) → `outreach` 업데이트 + 운영자 자기 이메일 알림
  - `/ops/outreach` 페이지 — 매체별 상태 보드
- **VERIFY**:
  - 테스트 이메일 1건 자기 자신 발송 → 수신 확인
  - 매체 30개 카드 표시 정상
- **BLOCK**: Gmail MCP 실패 시 Resend만으로 발송 진행.

---

### 🧪 Week 2 — 자체 검증 (망원 + 자사)

#### Day 6 (4시간) — 망원 러프러프 자체 사이트
- **IN**: Week 1 모든 OUT 검증 완료.
- **OUT**:
  - `sites/mangwon-roughrough/` Next.js 16 분리 프로젝트 (또는 `dashboard/`의 동적 라우트 활용)
  - 페이지 8개: `/` `/menu` `/faq` `/location` `/press` `/blog` `/blog/[slug]` `/contact`
  - Schema.org 풀세트: LocalBusiness, Menu, FAQPage, Article (블로그용), BreadcrumbList
  - sitemap.xml + robots.txt 자동 생성
  - Higgsfield MCP로 카페 컨셉샷 12장 + 메뉴 비주얼 6장 자동 생성
  - 콘텐츠 8편 (한국어 6 + 영어 2) 자동 작성
  - Vercel 배포 → `rufruf-mangwon.vercel.app`
- **VERIFY**:
  - Google Rich Results Test 통과 (LocalBusiness + FAQPage 둘 다)
  - Lighthouse 90+ (Performance, SEO, Best Practices)
  - 모바일 렌더링 OK
- **BLOCK**: Schema 검증 실패 시 Day 7 일부 진행.

#### Day 7 (3시간) — Wikidata + OpenStreetMap + 검색엔진 등록
- **IN**: Day 6 사이트 라이브.
- **OUT**:
  - Wikidata 엔트리 자동 생성 (러프러프 망원점, Q-number 발급)
  - OpenStreetMap POI 등록 (이름·카테고리·좌표·웹사이트)
  - Google Search Console HTML 메타 인증 + 사이트맵 제출
  - Bing Webmaster 등록 + 사이트맵 + IndexNow 푸시
  - Naver Webmaster Tools 등록 시도 (한국어 핵심)
- **VERIFY**:
  - Wikidata Q-number 확인
  - OSM osm.org에서 POI 검색 시 등장
  - GSC `Site verified` 상태
  - Bing IndexNow 200 OK
- **BLOCK**: Wikidata/OSM은 누적 등록 거부 가능 → Day 8 진행 가능, 재시도 큐 등록.

#### Day 8 (4시간) — 멀티 도메인 분산 + 자사 에이전시 사이트
- **IN**: Day 7 등록 완료.
- **OUT**:
  - Tistory API로 한국어 블로그 1개 개설 + 첫 글 5개 자동 게재 (망원 러프러프 후기형)
  - Medium 영어 페이지 1개 + 첫 글 3개 (외국인 관광객 쿼리)
  - Pinterest 보드 + 핀 12개 (사진 + 설명)
  - 자사 에이전시 사이트 `aeo-agency.vercel.app` 구축 — 6페이지
    - `/` (히어로 + 케이스 스터디 1: 망원), `/services`, `/case-studies`, `/pricing`, `/about`, `/contact`
- **VERIFY**:
  - 5개 채널 각각 URL 살아있음 확인
  - 모든 외부 채널에서 자체 사이트로 백링크 1개 이상
- **BLOCK**: 외부 API 실패 시 해당 채널만 skip, 나머지 진행.

#### Day 9 (3시간) — 매체 어프로치 1차 발송
- **IN**: Day 8 자체 사이트 라이브 + Day 5 outreach 시스템 ready.
- **OUT**:
  - 디에디트·세시간전·어반인사이드·디자인하우스·시티호퍼스 5개 매체 에디터 이메일 발굴 (LinkedIn / 공식 contact)
  - 개인화 콜드메일 5건 자동 발송 (망원 큐레이션 제안 형식)
  - `outreach` 테이블에 5건 적재
  - Telegram 알림 발사
- **VERIFY**:
  - 5건 모두 Resend로 sent 상태
  - DB 적재 확인
- **BLOCK**: 회신 대기 (이는 Day 10 이후 자동 처리)

#### Day 10 (4시간) — 영업 도구 + 진단 PDF 자동 생성기
- **IN**: Week 2 자체 검증 셋업 완료.
- **OUT**:
  - `scripts/sales/diagnose.py` — 도메인 입력 → 30개 쿼리 자동 측정 → 1페이지 진단 PDF 자동 생성
  - 진단 PDF 템플릿: 현재 SOV / 답변 내 경쟁사 / 우리 가입 시 개선 액션 5 / 예상 ROI
  - `/ops/sales` 대시보드 — 잠재 클라이언트 발굴 + 진단 추적
- **VERIFY**:
  - 임의 도메인 1개 (예: channel.io) 진단 → PDF 1건 생성 → 내용 검수
- **BLOCK**: 측정 실패 시 RPM 낮춰 재시도.

---

### 📊 Week 3 — 측정 누적 + 효과 검증

#### Day 11~13 (각 1시간 — 자동 측정, 운영자 관찰만)
- **IN**: cron이 자동 측정 중.
- **OUT (자동)**:
  - 매일 망원 + 자사 사이트 SOV 측정
  - 매일 Ahrefs Brand Radar 다중 LLM 인용 측정
  - GSC 인덱싱 상태 자동 모니터링
- **VERIFY**:
  - 매일 Telegram 알림 1건씩 도착
  - 7일차 (Day 13) SOV 측정 비교: Before 0% → After X% (입증 데이터)
  - 인덱싱 페이지 수 (GSC) 추이
- **BLOCK**: 측정 안 돌면 cron 디버그 후 재실행.

#### Day 14 (3시간) — 한국 세무·노무 사무소 30곳 자동 발굴
- **IN**: Day 10 진단 도구 검증 완료.
- **OUT**:
  - Tavily MCP로 한국 세무사·노무사 사무소 30곳 자동 발굴 (홈페이지 있음 + 블로그 6개월 이상 정체 조건)
  - 각 사무소 도메인·대표 이름·연락처 수집 → `prospects` 테이블 적재
  - 30곳 각자 카테고리 쿼리 5개씩 자동 측정 (총 150쿼리)
  - 각 사무소별 진단 PDF 자동 생성 (Day 10 도구 사용)
- **VERIFY**:
  - `prospects` 테이블 30 rows
  - PDF 30개 생성 (`clients/_prospects/`)
- **BLOCK**: Tavily quota 초과 시 분할 발굴.

#### Day 15 (2시간) — Week 3 검수 + 데이터 패키징
- **IN**: Day 11~14 누적 데이터.
- **OUT**:
  - 망원 + 자사 사이트 SOV "Before vs After" 비교 차트 (대시보드 + PDF)
  - 자사 사이트 GSC 임프레션 추이
  - 인덱싱된 페이지 수
  - 자사 케이스 스터디 PDF 작성 (실제 데이터 기반 — 영업용 핵심 무기)
- **VERIFY**:
  - 케이스 스터디 PDF 5~8 페이지 분량
  - 모든 수치 출처(스크린샷 또는 DB row ID) 명시
- **BLOCK**: 데이터 신뢰성 검수 통과 못 하면 영업 시작 안 함.

---

### 💼 Week 4 — 영업 시작 + 첫 계약 시도

#### Day 16 (3시간) — 콜드메일 1차 발송 (세무·노무)
- **IN**: Day 14 prospect 30곳 + Day 15 케이스 스터디 ready.
- **OUT**:
  - 각 사무소 대표 이메일 자동 발송 (PDF 첨부 + 자사 케이스 링크)
  - Subject: "[사무소명] ChatGPT 답변에 안 나오는 이유"
  - `outreach` 30 rows 적재
  - Gmail MCP inbox 모니터링 시작
- **VERIFY**:
  - Resend 30건 sent
  - bounce rate < 10%
- **BLOCK**: bounce 너무 많으면 이메일 자료 재검증.

#### Day 17 (2시간) — B2B SaaS 15곳 추가 발굴 + 콜드메일
- **IN**: Day 16 1차 발송 완료.
- **OUT**:
  - 스타트업얼라이언스 + 더브이씨에서 한국 SaaS 시리즈 A 이하 15곳 발굴
  - 각각 진단 PDF + 콜드메일 발송
- **VERIFY**: 15건 sent.

#### Day 18~19 (각 2시간) — 회신 응대 + 미팅 셋업
- **IN**: 응답 들어오기 시작 (예상 5~15%, 약 3~7건).
- **OUT**:
  - 긍정 회신 → 자동 미팅 제안 이메일 (Calendly 링크 또는 수동)
  - 추가 질문 → Claude 자동 1차 답안 작성 → 운영자 검토 → 발송
- **VERIFY**:
  - Notion 칸반 또는 `/ops/outreach`에서 모든 회신 추적
- **BLOCK**: 응답 0건이면 Day 20 추가 발송 + 메시지 A/B 테스트.

#### Day 20 (4시간) — 첫 미팅 + 계약 클로징 시도
- **IN**: 미팅 셋업된 클라이언트 1~2건.
- **OUT**:
  - 미팅 자료 자동 준비 (해당 회사 진단 데이터 + 자사 케이스 + 가격표)
  - 미팅 후 follow-up 이메일 자동 발송
  - 계약서 템플릿 (KPI 명시 + 환불 정책)
  - 계약 시 즉시 클라이언트 onboard (slug 등록 → cron 측정 시작)
- **VERIFY**:
  - 미팅 진행 여부 (정성)
  - 계약 1건 이상 클로징 또는 다음 단계 약속
- **BLOCK**: 계약 0건이어도 무한 영업 모드로 전환 (D21~).

---

## 5. 자동화 가드레일 (24/7 안정)

### 매일
- 03:00 KST: SOV 측정 (cron) → 실패 시 운영자 Gmail 알림 + 자동 1회 재시도
- 04:00 KST: 어제 측정 SOV ±10% 변화 알림 (Gmail)
- 04:30 KST: 콘텐츠 큐 24h 이상 미처리 알림 (Gmail)
- 09:00 KST: 어제 매체 응답 요약 알림 (Gmail)

### 매주
- 월 09:00: 클라이언트별 주간 PDF 자동 발송 (Gmail MCP)
- 일 23:00: 시스템 헬스 체크 (DB 용량, API quota, 실패율) → 운영자 Gmail 보고

### 매월 1일
- 09:00: 콘텐츠 신선도 감사 (90일 미갱신 자동 식별)
- 09:30: 월간 보고서 PDF + 자동 발송 (Gmail MCP)
- 10:00: 매체 어프로치 KPI 정리 (응답률 / 채택률)

### 자동 회복
- API 429 → 지수 백오프 1s→2s→4s→8s, 최대 4회
- Supabase 5xx → 60s 후 1회 재시도
- Vercel 배포 실패 → preview deployment 사용, 운영자 Gmail 알림
- cron 미실행 (24h) → 다음 cron에서 catch-up 측정 시도
- Gmail MCP 인증 만료 → OAuth 재인증 안내 자동 발송

---

## 6. 위험 매트릭스 + 롤백

| 위험 | 가능성 | 영향 | 사전 대응 | 발생 시 롤백 |
|------|------|------|---------|------------|
| Gemini Rate Limit 429 빈발 | 중 | 측정 60%+ 실패 | RPM 5로 낮춤 (Day 1 기본값) | 분할 측정 (40개씩 2회) |
| Supabase 무료 한도 (500MB DB / 50K MAU) | 저 | 데이터 적재 중단 | citations 테이블 30일 retention 자동 정리 | 유료 전환 ($25/월) |
| Vercel Hobby 상업 사용 ToS 위반 | 중 | 자사 사이트 정지 | 클라이언트 사이트는 클라이언트 계정으로 배포 / 자사는 Cloudflare Pages 백업 | Cloudflare Pages로 이전 |
| 매체 회신 0건 | 중 | Week 4 영업 차질 | Day 16/17 메시지 A/B 테스트 + 후속 발송 | LinkedIn DM 추가 채널 |
| GitHub Actions public repo 보안 | 저 | 자격증명 누출 | Secrets만 사용, .env 절대 푸시 안 함 | repo private 전환 (월 2,000분 한도) |
| Higgsfield 이미지 생성 비용 한도 | 저 | 비주얼 생성 중단 | 6장만 우선 생성 | placeholder 사용 |
| 네이버 IP 차단 (자동화 시도) | 중 | 네이버 채널 다운 | 우리는 네이버 자동화 시도 안 함 (정책 준수) | N/A |
| 클라이언트 데이터 누출 | 저 | 신뢰 손실 | RLS + slug 기반 + 별도 폴더 + .gitignore | 즉시 해당 슬러그 비활성화 + 사고 알림 |

---

## 7. 완료 정의 (Definition of Done)

각 Day의 산출물은 다음 모두 충족 시 ✅ completed:
1. 코드/파일 존재 (Read tool로 확인)
2. 자동 VERIFY 통과 (CI 또는 로컬 테스트)
3. 운영자(나) 1분 수동 확인
4. `SESSION-STATE.md` 해당 Day completed로 갱신
5. Telegram에 "Day N done" 자동 알림

**Week 단위 DoD**:
- Week 1: 대시보드 + 알림 + 보고서 라이브, 5명 가짜 클라이언트 시뮬레이션 통과
- Week 2: 망원 + 자사 사이트 인덱싱 시작, 5개 매체 콜드메일 발송 완료
- Week 3: 실측 데이터 Before vs After 확보, 케이스 스터디 PDF 완성
- Week 4: 콜드메일 45건 발송, 미팅 1~2건, 첫 계약 1건 클로징 시도

---

## 8. 진행 보고 채널

- **실시간**: Telegram (자동)
- **세션별**: SESSION-STATE.md (수동 갱신, 매 작업 종료 시)
- **주간**: 자사 대시보드 `/ops/internal-report` (자동)
- **마스터플랜 변경**: 본 PLAN.md를 v1.1, v1.2 등으로 분기 (절대 v1.0 직접 수정 금지)

---

## 9. 참고 출처 (이 계획의 근거)

- AI Overview CTR 61% 하락: [Seer Interactive 2025.09](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update)
- AI 인용 브랜드 클릭 +35%: [Digital Bloom 2026](https://thedigitalbloom.com/learn/ai-citation-position-revenue-report-2026/)
- B2B SaaS AI 영향: [G2 LLM Citation Research 2025](https://learn.g2.com/ai-search-surging-for-b2b-buyers)
- 한국 ChatGPT 사용률 54.5%: [OpenSurvey 2025.12](https://blog.opensurvey.co.kr/trendreport/ai-search-2026/)
- Gemini grounding 동작: [Google AI Studio Docs](https://ai.google.dev/gemini-api/docs/grounding)
- Schema.org 효과: [Google Search Central Structured Data](https://developers.google.com/search/docs/appearance/structured-data)
- Vercel 무료 한도: [Vercel Hobby Pricing](https://vercel.com/docs/limits)
- Supabase 무료 한도: [Supabase Free Tier](https://supabase.com/pricing)
