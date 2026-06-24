---
description: 모든 활성 클라이언트의 일일 헬스 체크 (SOV + GSC + 알림) 실행
allowed-tools: Read, Bash, Task, Glob
---

# 일일 헬스 체크

## 실행 대상
`clients/active.yaml` 에 등록된 모든 클라이언트

## 병렬 실행

각 클라이언트에 대해:

1. **gemini-monitor** 에이전트 → SOV 측정
2. **gsc-analyzer** 스킬 → 트래픽 이상 감지
3. 결과 통합 → Supabase 저장
4. 이상 발견 → Slack 알림

## 출력
- 콘솔: 클라이언트별 1줄 요약
- 파일: `logs/daily-check-YYYY-MM-DD.md`
- 알림: Slack #ops-alerts (긴급만)

## 무료 한도 체크
- Gemini API: 사용량 / 1500 표시
- GSC API: 정상 응답 비율

## 완료 보고
- 정상 X개 / 경고 Y개 / 긴급 Z개
- 다음 권장 액션
