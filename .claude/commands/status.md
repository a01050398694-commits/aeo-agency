---
description: 프로젝트 현재 상태 / 마지막 작업 / 다음 우선순위를 한 화면에 출력. 새 세션 시작 시 가장 먼저 실행 권장.
allowed-tools: Read, Bash, Glob
---

# /status — 프로젝트 상태 점검

## 실행 절차

1. **SESSION-STATE.md 읽기** → 직전 세션 종료 시점 상태 로드
2. **CLAUDE.md 읽기** → 절대 규칙 재확인
3. **파일 인벤토리 점검**:
   - `.claude/agents/` 에이전트 개수
   - `.claude/skills/` 스킬 개수
   - `.claude/commands/` 커맨드 개수
   - `clients/` 활성 클라이언트 수
4. **git status** → 미커밋 변경사항
5. **TaskList** → 미완료 작업 확인

## 출력 형식

```
🏢 AEO Agency 프로젝트 상태
═══════════════════════════════════

📅 마지막 세션: YYYY-MM-DD
🎯 프로젝트 단계: [Phase 1 셋업 완료 / Phase 2 인프라 구축 / ...]

✅ 완료된 구축
- 에이전트: X개
- 스킬: X개
- 커맨드: X개
- 클라이언트: X개

🔄 진행 중
- [작업명] (TaskList #N)

⏭️ 다음 우선순위
1. [최우선 작업]
2. [두번째]
3. [세번째]

⚠️ 미해결 결정사항
- [질문/대기 항목]

📋 미커밋 변경 (git status)
- [파일 목록]

💡 즉시 실행 가능한 커맨드
- /new-client <slug>  — 신규 클라이언트
- /daily-check         — 일일 헬스 체크
- /verify-truth        — 직전 작업 검증
```

## 절대 규칙
- SESSION-STATE.md 없으면 "초기 상태" 표시 후 사용자에게 새 시작인지 확인
- 파일 인벤토리는 실제 `Glob` 결과로만 (추측 금지)
- TaskList는 실제 호출 결과만
