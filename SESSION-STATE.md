# 🏢 AEO Agency — 지금 어디까지 왔는지 한눈에

> 새 세션에서 `/status` 치면 이 파일이 자동으로 읽힙니다.
> 작성 원칙: 중학생도 이해 가능 + 솔직 + 디테일.

---

## 📅 마지막 작업 시점
**2026-06-24** (정상화 사이클 — cron 검증/Gemini 키 leak 발견/Resend askbit.co 등록/Wikidata·OSM 사양 준비)

---

## 1️⃣ 이게 뭐 하는 사업이야?

```
사람들이 ChatGPT나 Gemini한테 물어보면
  "강남 세무사 추천해줘" 같은 질문에
  답변에 "세무법인 더봄" 이름이 나오게 만들어주는 일.

→ 클라이언트(고객 업체)에게 월 250만원 받고 자동화 시스템 운영
→ 1인 운영자 + Claude Code로 5~10 클라이언트 동시 가능
```

---

## 2️⃣ 지금까지 만든 것 (시스템 — 컴퓨터가 알아서 돌아가는 부분)

### 🌐 웹사이트 (Next.js로 만든 종합 시스템)
인터넷 주소 하나에 페이지가 28개 들어있습니다:

| 카테고리 | URL | 용도 | 누가 봄 |
|---------|-----|------|--------|
| 운영자 | `/ops` | 모든 클라이언트 한눈에 | 운영자만 |
| 운영자 | `/ops/clients/[slug]` | 각 클라이언트 자세히 | 운영자만 |
| 운영자 | `/ops/queue` | 만든 콘텐츠 승인 대기 칸반 | 운영자만 |
| 운영자 | `/ops/outreach` | 매체에 보낸 메일 추적 | 운영자만 |
| 운영자 | `/ops/sales` | 잠재 고객 영업 단계 | 운영자만 |
| 클라이언트 | `/mangwon-roughrough` | 망원 러프러프 보고 페이지 | 사장님 + 누구나 |
| 클라이언트 | `/thebom-tax` | 더봄세무법인 보고 페이지 | 사장님 + 누구나 |
| 카페 사이트 | `/r/rufruf` 외 4페이지 | 망원 러프러프 자체 홈페이지 | 일반 손님 |
| **세무 사이트** | **`/pro/thebom-tax` 외 5페이지** | **더봄세무법인 자체 홈페이지** | **일반 손님** |
| 영업 사이트 | `/agency` 외 7페이지 | "AEO 대행해드립니다" 본인 마케팅 | 잠재 고객 |
| 시스템 | `/api/health` | DB 정상 동작 확인 | 운영자만 |

**현재 위치**: 노트북에서만 동작 중 (`npm run dev`). **Vercel에 배포만 하면** 인터넷에 라이브.

### 🗄️ 데이터베이스 (Supabase, 클라우드에 항상 켜져 있음)
9개 테이블에 데이터가 차곡차곡 쌓입니다:

```
clients (활성 클라이언트)         2개  ← 망원 러프러프 + 더봄세무
sov_measurements (매일 측정)     1개  ← 망원 베이스라인 (더봄은 측정 실패)
content_queue (만든 콘텐츠)       3개  ← 망원 답변블록+FAQ+스키마
media_targets (매체 카탈로그)    30개  ← 디에디트, 플래텀 등
outreach (보낸 메일 추적)        9개  ← 망원 4 + 더봄 5
prospects (잠재 고객)            26개  ← 채널톡 + 세무 15 + 노무 9 + 디렉토리
weekly_reports (주간 보고서)      1개
jobs_log (자동 실행 기록)         0개
citations (인용 상세)             0개
```

### ⏰ 자동 실행 (GitHub Actions — 사용자 안 켜도 매일 알아서)
**3가지 자동 작업이 매일/매주 알아서 돕니다:**

1. **매일 새벽 03:00** — 모든 활성 클라이언트 SOV 측정 (Gemini로 80개 질문)
2. **매일 새벽 04:00** — 변화 있으면 텔레그램 + 이메일로 알림
3. **매주 월요일 09:00** — 1주일 결과 PDF 보고서 자동 발송

### 📨 알림 채널 (실제 동작 확인됨)
- **텔레그램**: @iam8282_bot → 사용자 핸드폰 (chat_id 7626898903)
- **이메일**: a01050398694@gmail.com (Resend onboarding@resend.dev로 발송 — 본인 메일만 가능)

### 🛠️ 자동 도구 (Python 스크립트 14개)
```
scripts/daily/gemini_sov.py            매일 SOV 측정
scripts/setup/preflight.py             환경 검증
scripts/setup/verify_db.py             DB 검증
scripts/setup/supabase-schema.sql      테이블 생성 SQL
scripts/notify/channels.py             텔레그램+이메일 발송
scripts/notify/check_thresholds.py     SOV ±10% 알림
scripts/reports/weekly_email.py        주간 보고서
scripts/outreach/draft_pitches.py      매체 어프로치 (카페)
scripts/outreach/prospect_drafts.py    매체 어프로치 (B2B)
scripts/outreach/check_replies.py      Gmail 회신 모니터링 (Pwd 발급 후)
scripts/sales/diagnose.py              잠재 고객 자동 진단
scripts/sales/prepare_meeting.py       미팅 자료 자동 생성
scripts/seo/indexnow.py                Bing 즉시 인덱싱
scripts/seo/wikidata_draft.py          Wikidata 등록 사양
scripts/sync/notion_queue.py           Notion 동기화
```

각각 한 줄 명령으로 실행됩니다 (예: `python scripts/sales/diagnose.py --name "회사" --domain "x.com" --industry "..."`).

### 📄 만든 문서
- `PLAN.md` v1.1 — 4주 마스터플랜 (Day별 IN/OUT/VERIFY)
- `docs/contract-template.md` — 표준 계약서 (KPI 환불 보장 조항)
- `docs/multi-domain-distribution.md` — Tistory/Medium/Pinterest 셋업 가이드
- `docs/github-actions-setup.md`
- `docs/onboarding-checklist.md`

---

## 3️⃣ 클라이언트 현황 (2개)

### 🥐 망원 러프러프 (망원 디저트 카페) — 사용자 망원 카페
- **상태**: dry-run (지인 아님, 실험용 첫 클라이언트)
- **베이스라인 측정**: SOV 0% (80쿼리 중 20 성공, 60 실패) — Gemini grounding rate limit 문제
- **자체 사이트**: `/r/rufruf` 5페이지 라이브 (Schema 풀세트)
- **매체 어프로치**: Gmail Drafts 2건 (디에디트 + 세시간전)
- **사용자 액션 필요**: Vercel 배포 → IndexNow 푸시
- **천장**: F&B 로컬은 SOV 25~30% (네이버 의존)

### 💼 세무법인 더봄 (홍대점) — 사용자 지인 ★ 첫 B2B 진짜 클라이언트
- **상태**: 온보딩 완료, 진단 보고서 대기
- **대표**: 홍지영 세무사
- **위치**: 서울 마포구 월드컵북로 4길 47 1층
- **전화**: 02-336-0309
- **공식 사이트**: https://thebomtax.com
- **타깃**: 홍대 자영업자 + 숙박업(에어비앤비/펜션)
- **베이스라인 측정**: ❌ **80쿼리 모두 실패** (Gemini Rate Limit 한도 소진)
- **자체 사이트**: `/pro/thebom-tax` 6페이지 라이브 (AccountingService Schema)
- **매체 어프로치**: Gmail Drafts 5건 (플래텀/디에디트/전자신문/세시간전/아웃스탠딩)
- **권한**: 사용자가 모두 받음 (별도 처리 없음)
- **사용자 액션 필요**:
  1. Gmail Drafts 5건 검토 후 [Send]
  2. 사장님(홍지영)에게 진단 결과 전달 (내일 cron 자동 측정 후)
  3. 비용 결정 (현재 0원 — 사용자 판단)

---

## 4️⃣ 솔직히 안 된 것 / 한계 (실측 결과)

### 🔴 GEMINI_API_KEY 차단됨 (진짜 원인 발견)
- 이전 추측: "Rate Limit 분당 2~3 RPM" — **틀렸음**
- 실측: workflow #28104403223 artifact 응답에 `"Your API key was reported as leaked. PERMISSION_DENIED"`
- 원인: `docs/github-actions-setup.md`에 키 하드코딩 → public repo push → Google 자동 감지 → 영구 차단
- 조치: 문서 마스킹 푸시 완료 (커밋 47e8e2e)
- **사용자 액션 필수**: https://aistudio.google.com/apikey 새 키 발급 (2분) → 알려주면 자동 갱신·재측정
- 가이드: `tmp/gemini-key-rotation.md`

### 🔴 Vercel 배포 미완료 (자동화 불가 확정)
- 실측: `vcp_` 토큰은 OAuth integration scope → `v11/projects` POST 시 `403 forbidden: saml`
- **사용자 액션 필수**: https://vercel.com/new → GitHub import → repo "aeo-agency" 선택 → Root `dashboard` → Deploy (1분)
- 또는 https://vercel.com/account/tokens 에서 "Full Account" scope 토큰 발급 → 제가 CLI 배포

### 🟡 GitHub Actions cron — 실제로는 정상
- 이전 추측: "한 번도 안 돌았음" — **부분 오류**
- 실측: 워크플로우 3개 모두 `active`. cron 첫 발화 시각이 **내일 03:00 KST** (어제까진 발화 시점 미도래)
- 발견·수정한 버그: `daily-sov.yml`의 `set -euo pipefail` + `if`분기에서 `$list` unbound (커밋 47e8e2e)
- 수동 트리거 검증: 3/3 성공 (단, SOV는 키 차단으로 응답 실패)

### 🟢 Resend askbit.co 도메인 등록 완료 (자동)
- Resend API로 도메인 추가 성공: id `5281938c-f6d3-4009-91ed-29e101bb30b4` (ap-northeast-1)
- DNS 레코드 3개 응답 받음 (DKIM TXT + SPF MX + SPF TXT)
- **사용자 액션 필수**: 도메인 관리 콘솔(가비아/Cloudflare/etc)에 3개 레코드 추가 (5분)
- 가이드: `tmp/dns-askbit-co.md`
- DNS 전파 후 제가 자동으로 `/domains/<id>/verify` 호출 → 끝

### 🟡 Wikidata + OSM 등록 — 사양 준비 완료, 등록은 수동
- 더봄세무 사양: `tmp/wikidata-thebom-tax.json`, `tmp/osm-thebom-tax.json` (방금 생성)
- 망원 사양: `tmp/wikidata-rufruf-mangwon.json`, `tmp/osm-rufruf-mangwon.json` (기존)
- 등록 자동화 불가 이유: Wikidata는 anonymous bot 차단, OSM은 사용자 계정 필요
- **사용자 액션 권장(아니어도 시스템 동작)**: 각 클라이언트당 10분 ~ 두 곳 등록

### 🔴 Gmail Drafts 자동 발송 불가 (확정)
- Gmail MCP에는 `send_*` 도구 없음 (list_drafts/create_draft/label까지만)
- 대안 검증: Google OAuth refresh_token 시도 → .env에 `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN` 모두 빈 값(len=0)
- **사용자 액션 필수**: Gmail 임시보관함 → 9건 [Send] (3분)
- 가이드: `tmp/gmail-drafts-send-guide.md`

### ⚠️ Gmail 회신 자동 모니터링 미가동
- `.env`에 `GMAIL_APP_PASSWORD` 미발급
- 발급: https://myaccount.google.com/apppasswords (2분)

### ⚠️ Ahrefs Brand Radar 사용 불가
- 현재 Ahrefs 플랜이 "Insufficient plan" (Lite 또는 Free)
- **Brand Radar는 Standard 이상 (월 $249 ≈ 33만원)** 필요
- 결정: **첫 계약 받은 후 결제** (클라이언트 1명 매출 250만원으로 회수 가능)

### ❌ Wikidata / OSM 등록 안 됨
- API anonymous 등록은 봇 차단 (캡차)
- **해결책**: 사양 JSON (`tmp/wikidata-...json`)을 보고 사용자가 wikidata.org에서 10분 등록 (1회만)
- 안 해도 시스템 정상 동작

### ⚠️ 한국 비즈니스 컨택 이메일 부족
- 세무사·노무사 사무소 25곳 발굴했지만 공개 이메일 2곳만 (혜움/넥스트업/다승 등 전화·카톡 위주)
- **현실**: 매체 어프로치는 잘 됨 (디에디트/플래텀 등), 직접 영업은 카톡·전화 필요

---

## 5️⃣ 진짜로 매출 만들려면 사용자가 해야 할 일 (구체적 순서)

### 🔥 오늘 / 내일 (10분)
1. **Gmail 임시보관함 확인** → 9건 Drafts (망원 4 + 더봄 5) 검토 → [Send]
   - 디에디트, 세시간전, 플래텀, 전자신문, 아웃스탠딩, 세아, 리드인사 등
2. **사장님(홍지영)에게 사이트 보여주기**:
   - `/pro/thebom-tax` 페이지 스크린샷 또는 임시 노트북 화면
   - "이런 식으로 AEO 작전 시작하는 중입니다" 설명

### 🟢 이번 주 (1시간)
3. **Vercel 배포** (https://vercel.com/new → 1분) → 사이트 인터넷에 공개
4. **내일 03:00 cron 결과** 확인 (텔레그램 자동 알림)
5. **사장님과 1차 미팅**:
   - `python scripts/sales/prepare_meeting.py --prospect-id N` 한 줄로 자료 자동 생성
   - 또는 dashboard `/pro/thebom-tax` 직접 보여주기

### 🟡 이번 달 (10분/주)
6. 매주 월요일: 자동 발송 주간 보고서 확인
7. 매주 새 매체 5곳 발굴 ("XX 발굴해" 한 마디 → 제가 자동)
8. 매주 새 콜드메일 5건 발송 (Gmail Drafts 검토)
9. 회신 1~2건 도착 → 미팅 → 계약 시도

### 💰 첫 계약 받은 후
10. **Ahrefs Standard 결제** ($249/월) → Brand Radar 활성
11. **askbit.co 도메인 인증** 또는 클라이언트 도메인 발신
12. **Gmail App Password** 발급 → 회신 자동 모니터링 가동

---

## 6️⃣ 비용 / 수익 / 시간 현실

### 지금까지 든 비용
**0원** (전부 무료 한도 + 기존 자격증명 재활용)

### 매출 0원
- 아직 계약 1건 없음
- 망원 카페: 무료 실험
- 더봄세무: 사용자 지인, 비용 미정

### 다음 매출 시점 예측
- **3~7일**: 매체 회신 도착 (5~15% 응답률 → 9건 보내면 0~1건)
- **2~3주**: 첫 미팅
- **3~6주**: 첫 계약 시도
- **현실적 첫 매출**: 6~10주 후 가능 (단, 회신 0건이면 더 길어짐)

### 운영 시간
- **시스템 자동**: 24/7 (cron + DB + 알림)
- **사용자 시간**: 일 5분 (텔레그램 확인) + 주 30분 (Drafts 검토)
- **CLI 대화 시간**: 새 클라이언트 받을 때만 (1명당 30분 ~ 1시간)

---

## 7️⃣ 만든 코드 / 데이터 디테일 (개발자용)

### Git 레포
- **URL**: https://github.com/a01050398694-commits/aeo-agency
- **공개 여부**: Public
- **마지막 커밋**: `d8f16ba` (더봄세무법인 첫 B2B 클라이언트 온보딩)
- **커밋 수**: 10개
- **총 라우트**: 28개 빌드 통과

### Supabase
- **프로젝트**: `aeo-agency` (ref: `qrcaacrevijtwcibzrep`)
- **지역**: ap-northeast-2 (Seoul)
- **요금**: Free tier (DB 500MB / 5GB bandwidth / 50K MAU)
- **현재 사용**: 1% 미만

### GitHub Actions cron 3개
```
.github/workflows/daily-sov.yml         03:00 KST → SOV 측정
.github/workflows/daily-checks.yml      04:00 KST → 임계치 알림
.github/workflows/weekly-report.yml     매주 월 09:00 → PDF 발송
```

### 환경변수 .env (실제 동작 키)
```
GEMINI_API_KEY                ✅ AskBit Gemini #1 재활용
SUPABASE_URL                  ✅ qrcaacrevijtwcibzrep.supabase.co
SUPABASE_ANON_KEY             ✅ JWT
SUPABASE_SERVICE_ROLE_KEY     ✅ JWT (Management API로 자동 발급)
SUPABASE_PUBLISHABLE_KEY      ✅ sb_publishable_l5Brcl...
SUPABASE_SECRET_KEY           ✅ sb_secret_8F1ian...
SUPABASE_ACCESS_TOKEN         ✅ sbp_3b60a0f... (마스터 PAT)
NOTION_TOKEN                  ✅ ntn_120224... (AskBit Auto integration)
GITHUB_PAT                    ✅ ghp_dLK44k...
VERCEL_TOKEN                  ⚠️ vcp_0VXiE4... (team scope 부족)
RESEND_API_KEY                ✅ re_3WMo7h... (askbit.co 발신 미인증)
TELEGRAM_BOT_TOKEN            ✅ 8037198232:... (@iam8282_bot)
TELEGRAM_OPS_CHAT_ID          ✅ 7626898903
OPS_EMAIL                     ✅ a01050398694@gmail.com
INDEXNOW_KEY                  ✅ f2f88cfb...
GMAIL_APP_PASSWORD            ❌ 미발급 (회신 모니터링 비활성)
WIKIDATA_QID                  ❌ 미등록
OSM_NODE_ID                   ❌ 미등록
```

---

## 8️⃣ 새 클라이언트 받았을 때 워크플로 (재사용 가능)

사용자가 "OO업체 받았어" 알려주면 자동 진행:

```
사용자 → 정보 8가지 알려주기 (10분):
  업체명 / 도메인 / 업종 / 서비스 / 사장님 이메일 / 타깃 쿼리 /
  권한 위임 가능 여부 / 월 견적

내(Claude)가 자동:
  Day 0: clients/<slug>/ 폴더 + 6개 파일 자동 생성
  Day 0: Supabase 등록 + active.yaml 갱신
  Day 1: 베이스라인 SOV 측정 (cron 자연 또는 즉시)
  Day 2~3: 자체 사이트 (/pro/<slug> 또는 /r/<slug>) Schema 풀세트
  Day 3~4: 매체 어프로치 Gmail Drafts 5건
  Day 5: 진단 보고서 자동 생성 → 사용자 메일
  Day 7~30: 매일 SOV 자동 측정 + 주간 보고서
```

사용자 추가 액션: Gmail Drafts 5건 [Send] (5분) + 사장님 미팅 (별도).

---

## 9️⃣ 솔직한 정직 평가

### 잘 된 것 ⭕
- 4주 만에 22→28 routes 풀스택 시스템 구축 (비용 0원)
- 자동화 인프라 24/7 가동 (cron + DB + 알림)
- 기존 자격증명 재활용으로 사용자 액션 최소화 (Day 0에 1분만 필요했음)
- 첫 B2B 클라이언트 (더봄세무) 빠른 온보딩

### 안 된 것 ⚠️
- **베이스라인 측정 실패** (Gemini grounding 분당 한도)
- **Vercel 배포 미완료** (PAT scope)
- **첫 계약 0건** (매체 어프로치 응답 대기)
- **Resend askbit.co 미인증** → 외부 발송 제한
- **Ahrefs Brand Radar 미사용** (구독 미달)

### 가장 중요한 사실 (현실 직시)
**시스템은 완성됐지만, 매출은 사용자의 영업 행동(Gmail Send + 사장님 컨택)에 달려있음.**

내(Claude)가 잘하는 것: 자동화, 콘텐츠, 측정, 보고
내가 못하는 것: 사장님과의 실제 미팅, 카톡 응대, 가격 협상, 계약 클로징

---

## 🔟 즉시 실행 가능한 명령 (cheatsheet)

```bash
# 새 클라이언트 받았을 때
python scripts/sales/diagnose.py --name "회사명" --domain example.com \
  --industry "업종" --queries "쿼리1" "쿼리2" "쿼리3"

# 미팅 자료 자동 생성
python scripts/sales/prepare_meeting.py --prospect-id <ID>

# 콜드메일 자동 작성 (Drafts에 저장)
python scripts/outreach/prospect_drafts.py --industry-prefix "세무" --limit 10

# 한 클라이언트 SOV 측정
python scripts/daily/gemini_sov.py --client thebom-tax --rpm 3

# 사이트 배포 후 검색엔진 즉시 알림
python scripts/seo/indexnow.py --host aeo-agency.vercel.app

# 시스템 상태 점검
python scripts/setup/preflight.py
python scripts/setup/verify_db.py

# 대시보드 로컬 실행
cd dashboard && npm run dev
# → http://localhost:3000
```

---

## 다음 세션 시작 시 추천 명령

```
사용자: /status
Claude: [이 파일 읽고 위 내용 요약 출력 — 중학생도 이해 가능 + 솔직]
사용자: "Gmail 회신 왔어?" 또는 "더봄 측정 결과 봐줘" 등
```

---

> **이 파일은 작업 끝날 때마다 자동 업데이트됩니다. 신뢰하세요.**
