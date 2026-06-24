# 세션 상태 스냅샷

> 새 세션 시작 시 `/status` 가 이 파일 자동 로드.

---

## 📅 최종 업데이트
**날짜**: 2026-06-24
**세션 종료 시점**: 🎉 **4주 마스터플랜 PLAN.md v1.1 완료**

---

## 🎯 프로젝트 정의 (불변)

- **사업 모델**: 1인 AEO 에이전시. Gemini AEO 자동화로 5~10 클라이언트 동시 운영.
- **타깃 엔진**: Gemini 우선, ChatGPT/Perplexity 부차.
- **운영자**: Windows + Claude CLI 단일 사용자. 한국어 기본.
- **인프라**: Claude CLI + GitHub Actions + Supabase + Vercel + Notion + Resend + Telegram + Gmail MCP.

---

## ✅ Day 0 ~ 20 전체 완료

### 📦 라이브 인프라
- **GitHub Repo**: https://github.com/a01050398694-commits/aeo-agency (public, 8 commits)
- **Supabase**: qrcaacrevijtwcibzrep.supabase.co (Seoul, 9테이블 + RLS)
- **Next.js 16 대시보드**: 22 routes 빌드 통과
- **GitHub Actions cron 3개** (매일 03:00 SOV, 매일 04:00 알림, 매주 월 09:00 보고서)
- **Telegram 봇**: @iam8282_bot (chat_id 7626898903)
- **Resend**: onboarding@resend.dev 발신 (askbit.co 미인증)
- **Gmail MCP**: 사용자 OAuth 연결됨

### 📊 Supabase 데이터 현황
```
clients              1  (mangwon-roughrough)
sov_measurements     1  (baseline 0%)
content_queue        3  (answer_block / faq / schema)
media_targets       30  (디에디트 + 세시간전 + 플래텀 등)
outreach             4  (디에디트 / 세시간전 / 세아 / 리드인사)
prospects           26  (채널톡 + 세무 15 + 노무 9 + 디렉토리 2)
jobs_log             0  (cron 첫 실행 후 적재 예정)
weekly_reports       1  (Day 4 테스트)
citations            0
```

### 🌐 dashboard 22 routes
```
운영자:  /ops · /ops/clients/[slug] · /ops/queue · /ops/outreach · /ops/sales
클라:    /[clientSlug]
카페:    /r/[slug] · /menu · /faq · /location · /contact
영업:    /agency · /services · /case-studies · /case-studies/[slug] · /pricing · /about · /contact
시스템:  /api/health · /robots.txt · /<indexnow>.txt · 2 sitemap.xml
```

### 📨 Gmail Drafts 4건 (검토 후 [Send])
1. 디에디트 (hello@the-edit.co.kr) — 매체 큐레이션
2. 세시간전 (partner@momentstudio.kr) — 매체 큐레이션
3. 세무회계 세아 (contact@seah.io) — B2B 영업
4. 리드인사노무컨설팅 (do@leadhr.kr) — B2B 영업

### 📝 자동 생성 산출물
- `tmp/diagnoses/` — prospect 진단 데이터 JSON
- `tmp/meetings/` — 미팅 자료 HTML (prospect-3-20260624.html 생성됨)
- `tmp/wikidata-rufruf-mangwon.json` — Wikidata 등록 사양
- `tmp/osm-rufruf-mangwon.json` — OSM POI 등록 사양
- `tmp/prospect-drafts-20260624-*.json` — 콜드메일 사양

### 📄 문서
- `PLAN.md` v1.1 — 4주 마스터플랜
- `docs/github-actions-setup.md`
- `docs/multi-domain-distribution.md`
- `docs/contract-template.md` ⭐ — 표준 계약서 (KPI 환불 보장 명시)
- `docs/onboarding-checklist.md`

---

## ⏳ 사용자 액션 대기 (선택)

| 액션 | 소요 | 효과 |
|------|------|------|
| **Vercel 배포** (vercel.com/new → import) | 1분 | 사이트 라이브 → IndexNow 푸시 가능 |
| **Gmail Drafts 4건 검토 & Send** | 5분 | 매체 + B2B 첫 영업 |
| **Gmail App Password** 발급 → .env GMAIL_APP_PASSWORD | 2분 | 회신 모니터링 자동화 |
| Wikidata 등록 (`tmp/wikidata-...json`) | 10분 | AI 신뢰도 부스트 |
| OSM POI 등록 | 5분 | 지도 노출 |
| askbit.co DNS 인증 (Resend) | 5분 | 발신자 askbit.co 사용 가능 |

위 액션 다 안 해도 시스템 정상 동작. cron 3개는 이미 24/7 가동.

---

## 🚀 즉시 실행 가능한 명령

```bash
# 새 prospect 자동 진단
python scripts/sales/diagnose.py --name "회사명" --domain example.com \
  --industry "B2B SaaS" --queries "쿼리1" "쿼리2" "쿼리3"

# 미팅 자료 자동 생성
python scripts/sales/prepare_meeting.py --prospect-id <ID>

# 콜드메일 사양 자동 생성 (업종 필터)
python scripts/outreach/prospect_drafts.py --industry-prefix "세무" --limit 10

# 회신 모니터링 (Gmail App Password 셋업 후)
python scripts/outreach/check_replies.py

# Notion 큐 동기화
python scripts/sync/notion_queue.py

# SOV 측정 (단일 클라이언트)
python scripts/daily/gemini_sov.py --client mangwon-roughrough --rpm 5

# IndexNow 푸시 (사이트 배포 후)
python scripts/seo/indexnow.py --host aeo-agency.vercel.app
```

---

## 📈 다음 우선순위 (Day 21+)

### A. 사용자 액션 4건 (가장 빠른 첫 매출 경로)
1. Vercel 배포 → 사이트 라이브
2. Gmail Drafts 4건 검토 & Send
3. App Password 발급 → 회신 모니터링 자동
4. (회신 도착) 미팅 진행 → 첫 계약 시도

### B. 시스템 강화
- Gemini grounding rate limit 우회: Ahrefs Brand Radar MCP 통합 (다중 LLM)
- 추가 prospect 발굴 (B2B SaaS 시리즈 A 명단 — 스타트업얼라이언스/더브이씨)
- 콘텐츠 자동 생성 cron (망원·자사 사이트 정기 블로그)
- Higgsfield로 카페 컨셉샷 12장 (Day 6 보류분)

### C. 영업·운영
- 첫 클라이언트 계약 시 즉시 onboard 워크플로
- 클라이언트별 GSC OAuth (성과 정확 측정)
- 망원 러프러프 사장님 권한 위임 (네이버 스마트플레이스)

---

## 🔐 자격증명 (.env 풀세트)

- ✅ GEMINI / SUPABASE (URL/anon/service_role/publishable/secret/access_token)
- ✅ NOTION / GITHUB / VERCEL / TELEGRAM
- ✅ RESEND (askbit.co 미인증 → onboarding@resend.dev 사용 중)
- ✅ OPS_EMAIL (a01050398694@gmail.com)
- ✅ INDEXNOW_KEY (f2f88cfb...)
- ⚠️ GMAIL_APP_PASSWORD (회신 모니터링용, 미발급)
- ⚠️ WIKIDATA_QID / OSM_NODE_ID (등록 후 입력)
