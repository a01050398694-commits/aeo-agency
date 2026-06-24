# AEO Agency — Gemini AEO 자동화 시스템

## 프로젝트 개요
- **목적**: 클라이언트 업체의 Google Gemini / AI Overviews AEO를 1인 운영으로 자동화
- **타깃 엔진**: Gemini 우선 (API 개방), ChatGPT 부차 (수동 검증)
- **언어**: 한국어 (UTF-8). 모든 응답·파일은 한국어 우선.
- **인프라**: Claude CLI(설계) + GitHub Actions(cron) + Supabase(DB) + Notion(운영) + Looker Studio(보고)

## 🚨 절대 규칙 (Hard Rules)

1. **거짓 보고 금지**: 안 한 작업을 했다고 말하지 말 것. 부분 완료는 부분 완료라고 명시.
2. **데이터 날조 금지**: 모르는 수치·URL·통계는 "확인 필요" 표시. 추측 금지.
3. **중단 금지**: 한 사이클(계획 → 실행 → 검증)을 끝까지. 막히면 사용자에게 1회 질문 후 진행.
4. **검증 후 보고**: 파일 생성/수정 직후 `Read` 또는 `Bash ls`로 실제 존재 확인. 안 한 검증은 "미검증" 표시.
5. **출처 인용**: 외부 사실 주장 시 `[출처: URL]` 또는 `[코드: 파일경로:라인]` 명시.
6. **불확실 시 "모릅니다"**: Anthropic 공식 가이드. 추측보다 정직.

## 🧠 컨텍스트 관리
- 70% 이상이면 `/compact`, 85% 이상이면 `/clear` 필수.
- 검증된 사실: 70%+ 정밀도 하락, 85%+ 할루시네이션 급증.

## 🎯 작업 워크플로우
1. **계획**: 3단계 이상 작업은 `TaskCreate`로 등록 후 시작.
2. **병렬화**: 독립된 도구 호출은 한 메시지에 묶어서.
3. **에이전트 위임**: 코드베이스 광범위 탐색 → `Explore` 에이전트.
4. **검증**: 작업 완료 직전 실제 산출물 재확인.

## 📁 디렉토리 규칙
- `clients/<이름>/` — 클라이언트별 격리. 자격증명은 `.env` 로컬만.
- `.claude/agents/` — 서브에이전트. 새 에이전트는 frontmatter 필수.
- `.claude/skills/` — 재사용 스킬. SKILL.md 명세 준수.
- `scripts/{daily,weekly,monthly}/` — cron 자동화 스크립트.
- `memory/` — 영구 기억(자동 메모리 시스템).

## 🔐 보안
- `.env`, `credentials.*`, `*.key` 절대 커밋 금지(.gitignore 적용).
- 클라이언트 데이터는 별도 디렉토리, 외부 전송 전 확인.

## 🛠 기술 스택
- Next.js 16 (App Router) / Vercel / Supabase / shadcn/ui
- Python 표준 라이브러리 우선 (의존성 최소화)
- API: Gemini Flash(free), GSC, YouTube Data v3, Knowledge Graph

## 🔁 자기 개선 루프
실수 발생 시 사용자가 "CLAUDE.md 업데이트해줘" 요청 → 해당 규칙 추가.

## 🔄 세션 복원
새 세션 시작 시 **반드시 `SESSION-STATE.md` 먼저 읽기**. 사용자가 `/status` 입력 시 자동 출력.
작업 종료 시 `SESSION-STATE.md` 의 "완료/진행중/다음 우선순위" 섹션 갱신.
