---
description: 신규 클라이언트 온보딩을 시작합니다. 정보 수집 양식 → 폴더 생성 → 베이스라인 진단까지 자동.
allowed-tools: Read, Write, Edit, Bash, Glob, Task, mcp__claude_ai_Notion__notion-search
---

# 신규 클라이언트 온보딩 시작

## 인자: $ARGUMENTS
(클라이언트 슬러그, 예: `acme-corp`)

## 실행 절차

1. `client-onboarder` 서브에이전트 호출 → 정보 수집 양식 제시
2. 사용자 응답 받기 → `clients/$ARGUMENTS/profile.yaml` 저장
3. 자격증명은 `clients/$ARGUMENTS/credentials.env` 에 별도 저장 (gitignored)
4. 폴더 구조 생성:
   - `content/{pending,approved,schema,archive}`
   - `research/`, `reports/`, `logs/`
5. 베이스라인 진단 병렬 실행:
   - `gemini-monitor`: 현재 SOV 측정
   - `aeo-researcher`: 경쟁사 분석
   - `schema-builder`: 기존 스키마 감사
6. 진단 결과 → `clients/$ARGUMENTS/reports/onboarding-diagnostic.md`
7. 30/60/90일 로드맵 → `clients/$ARGUMENTS/roadmap.md`

## 완료 보고
- 생성된 모든 파일 경로
- 사용자가 직접 해야 할 수동 작업 (GBP 검증 등)
- 다음 권장 액션
