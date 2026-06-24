---
description: 90일 룰 위반 페이지 자동 식별 + 리프레시 드래프트 생성 → 승인 큐
allowed-tools: Read, Write, Edit, Task, Glob, WebFetch
---

# 콘텐츠 리프레시

## 인자: $ARGUMENTS
(클라이언트 슬러그)

## 실행 절차

1. `content-refresh` 스킬 호출
2. 90일 룰 위반 페이지 리스트업
3. 우선순위 정렬 (클릭 하락 + 순위 하락 가중)
4. 상위 5개에 대해 `content-writer` 에이전트 호출
5. 리프레시 드래프트 생성 → `clients/$ARGUMENTS/content/pending/`
6. 원본 백업 → `clients/$ARGUMENTS/content/archive/`
7. Notion 승인 큐에 카드 추가

## 절대 규칙
- ❌ 원본 백업 없이 수정 금지
- ❌ 가짜 업데이트 (날짜만 변경) 금지
- ✅ 사용자 승인 전 라이브 배포 금지
