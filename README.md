# AEO Agency

Gemini AEO(Answer Engine Optimization) 1인 운영 자동화 시스템.

## 🎯 무엇

여러 클라이언트의 Google Gemini / AI Overviews 노출을 한 명이 동시에 운영하기 위한 Claude CLI 기반 자동화 시스템.

## 📐 아키텍처

```
[설계/구축]  Claude CLI (이 디렉토리)
       ↓ 1회 배포
[자동 실행]  GitHub Actions (cron) / Vercel Cron
       ↓
[데이터]    Supabase (Postgres + Auth)
[운영]      Notion (승인 큐, 알림)
[보고]      Looker Studio + 커스텀 Next.js 대시보드
[알림]      Slack / Email
```

## 🚀 빠른 시작

```bash
# 1) 환경변수 셋업
cp .env.example .env
# 실제 값 입력

# 2) 신규 클라이언트 추가
# Claude CLI에서:
/new-client acme-corp

# 3) 일일 체크 (수동 실행)
/daily-check

# 4) 주간 보고서
/weekly-report
```

## 📁 디렉토리 구조

```
aeo/
├── CLAUDE.md                # Claude 프로젝트 지침
├── .claude/
│   ├── settings.json        # 권한 + 훅 + UTF-8
│   ├── agents/              # 서브에이전트
│   ├── skills/              # 재사용 스킬
│   └── commands/            # 슬래시 커맨드
├── clients/                 # 클라이언트별 격리
│   ├── active.yaml          # 활성 레지스트리
│   └── _template/           # 신규 클라이언트 템플릿
├── scripts/                 # 자동화 (cron 호출)
│   ├── daily/
│   ├── weekly/
│   └── monthly/
├── templates/               # 재사용 템플릿
├── docs/                    # 가이드
└── memory/                  # 영구 기억
```

## 🤖 서브에이전트

| 이름 | 역할 |
|---|---|
| `truth-verifier` | 거짓 보고 / 할루시네이션 검증 |
| `aeo-researcher` | 검증된 출처만 사용하는 리서치 |
| `content-writer` | Gemini AEO 콘텐츠 작성 |
| `schema-builder` | JSON-LD 스키마 생성 + 검증 |
| `gemini-monitor` | SOV 측정 + 경쟁사 비교 |
| `client-onboarder` | 신규 클라이언트 셋업 |
| `dashboard-builder` | Next.js 대시보드 구축 |

## 🛠 스킬

| 이름 | 트리거 |
|---|---|
| `gemini-sov-check` | SOV 측정 (수동 + 일일 cron) |
| `schema-markup-generator` | JSON-LD 생성 |
| `gsc-analyzer` | GSC 데이터 분석 |
| `content-refresh` | 90일 룰 위반 페이지 갱신 |
| `client-onboarding` | 신규 클라이언트 양식 |

## ⚡ 슬래시 커맨드

| 커맨드 | 설명 |
|---|---|
| `/new-client <slug>` | 신규 온보딩 |
| `/daily-check` | 일일 헬스 체크 |
| `/weekly-report [slug]` | 주간 보고서 |
| `/verify-truth` | 직전 작업 검증 |
| `/refresh-content <slug>` | 콘텐츠 리프레시 |

## 🚨 핵심 안전 장치

- **거짓 보고 금지**: `truth-verifier` 에이전트가 모든 작업 산출물 검증
- **자격증명 보호**: `.env`, `credentials.*` 절대 커밋 금지
- **다중 클라이언트 격리**: `clients/<slug>/` 디렉토리 분리
- **한글 UTF-8**: `.gitattributes` + settings.json 환경변수
- **단계적 자율도**: 1개월차 100% 승인 게이트 → 점진 자율화

## 📚 다음 단계

1. `.env` 채우기 (Gemini API 키, Supabase, Notion 등)
2. Supabase 스키마 마이그레이션 (TODO: `scripts/setup/supabase-schema.sql`)
3. GitHub Actions cron 등록 (TODO: `.github/workflows/`)
4. Next.js 대시보드 초기화 (TODO: `dashboard/`)
5. 첫 클라이언트 온보딩: `/new-client <slug>`

## 📖 참고 자료

이 프로젝트의 베스트 프랙티스는 다음 검증된 GitHub 리포에서 가져왔습니다:

- [anthropics/skills](https://github.com/anthropics/skills) — 공식 스킬 사양
- [Everything Claude Code](https://github.com/) — 163K stars
- [Superpowers (Obra)](https://github.com/) — 94K+ stars
- [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) — 345 스킬
- [abhishekray07/claude-md-templates](https://github.com/abhishekray07/claude-md-templates) — CLAUDE.md 베스트
- [Anthropic Reduce Hallucinations 공식](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
