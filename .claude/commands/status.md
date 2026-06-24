---
description: 프로젝트 현재 상태 / 마지막 작업 / 사용자가 다음에 뭘 해야 하는지 — 중학생도 이해 가능 + 솔직 + 디테일
allowed-tools: Read, Bash, Glob
---

# /status — 프로젝트 상태 (사용자 친화형)

## 실행 절차

1. **`SESSION-STATE.md` 읽기 (전체)** — 9개 섹션 모두 파악
2. **`CLAUDE.md` 읽기** — 절대 규칙 재확인 (거짓 보고 금지 등)
3. **실시간 검증** (병렬 실행):
   - Supabase 행 수 (`select count from clients/prospects/outreach...`)
   - git status (미커밋 변경)
   - dashboard 빌드 라우트 수 (`ls dashboard/.next/server/app | wc -l` 또는 SESSION-STATE 기준)
   - TaskList (진행 중 작업)
   - Gmail Drafts 개수 (Gmail MCP `list_drafts` query="aeo")
4. **출력**: 아래 형식 — 사용자가 즉시 행동 결정 가능하게

## 출력 형식 (중학생 수준 + 솔직 + 디테일)

```
🏢 AEO Agency 현황 — YYYY-MM-DD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ 한 줄 요약
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[지금 어디 와 있는지 한 문장 — 예: "시스템 다 만들었고 첫 B2B 클라이언트 더봄세무 온보딩 완료. 매체 어프로치 9건 발송 대기 중."]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2️⃣ 클라이언트 현황
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥐 망원 러프러프
  - 상태: dry-run, SOV 0%
  - 사이트: /r/rufruf 라이브 (로컬)
  - 매체 Drafts: 2건 발송 대기

💼 세무법인 더봄 (홍대, 첫 B2B)
  - 대표: 홍지영 / ☎ 02-336-0309
  - 사이트: /pro/thebom-tax 라이브 (로컬)
  - 매체 Drafts: 5건 발송 대기
  - 베이스라인: [측정 결과 또는 "대기 중"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3️⃣ 시스템 (자동 동작 중)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Supabase 9테이블 (Seoul) — clients X / prospects X / outreach X
✅ Next.js dashboard 28 routes (로컬 빌드 통과)
✅ GitHub Actions cron 3개
   - 매일 03:00 KST: SOV 측정
   - 매일 04:00 KST: 임계치 알림
   - 매주 월 09:00: 주간 보고서
✅ 텔레그램 봇 @iam8282_bot
✅ Gmail MCP + Resend (제한적)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4️⃣ 솔직 — 안 된 것 / 한계
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[냉정하게]
❌ Vercel 배포 (사용자 1분 액션 필요)
❌ 베이스라인 SOV (Gemini Rate Limit)
❌ Ahrefs Brand Radar (Standard $249/월 필요)
❌ Gmail 회신 자동 모니터링 (App Password 미발급)
❌ Resend askbit.co 발신 (DNS 인증 미완)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5️⃣ 사용자가 진짜로 할 일 (우선순위 순)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 오늘 (10분 액션)
1. Gmail 임시보관함 → 9건 Drafts 검토 → [Send]
   → 매체 어프로치 시작 (응답률 5~15%)

🟢 이번 주 (1시간)
2. Vercel 배포 (vercel.com/new) → 사이트 인터넷 라이브
3. 더봄 사장님과 미팅 (baseline 자동 측정 결과 받은 후)
4. 새 prospect 5곳 발굴 → 다음 콜드메일 5건

💰 첫 계약 받으면
5. Ahrefs Standard $249 결제 → Brand Radar 활성
6. askbit.co DNS 인증 → 외부 발신 가능

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6️⃣ 즉시 쓸 수 있는 명령
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 새 클라이언트 받았을 때
python scripts/sales/diagnose.py --name "회사" --domain ex.com --industry "..." --queries ...

# 미팅 자료 자동 생성
python scripts/sales/prepare_meeting.py --prospect-id <ID>

# 콜드메일 Drafts 자동 작성
python scripts/outreach/prospect_drafts.py --industry-prefix "세무" --limit 10

# 대시보드 로컬 실행
cd dashboard && npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7️⃣ 자세한 내용은 SESSION-STATE.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9개 섹션, 모든 디테일 (테이블 행 수, 환경변수, Git 커밋, 비용 등)
```

## 절대 규칙
- SESSION-STATE.md 없으면 "초기 상태" 표시 + 사용자에게 새 시작 여부 확인
- 모든 숫자는 실시간 검증 (Supabase 쿼리 / Glob 결과)
- 추측 금지 — 모르면 "확인 필요"
- 사용자 행동 우선순위는 항상 명확히 (1순위, 2순위, ...)
- 안 된 것 / 한계도 솔직히 (CLAUDE.md §1 거짓 보고 금지)

## 출력 톤
- 중학생도 이해 가능 (어려운 용어 풀어서)
- 비유 활용 ("ChatGPT한테 추천해줘 라고 물었을 때 우리 가게 이름 나오게 하는 일")
- 단계별 (1️⃣ 2️⃣ 3️⃣ 순서)
- 행동 가능한 형태로 (사용자가 다음에 뭘 할지 명확)
