---
description: 모든 클라이언트의 주간 보고서 자동 생성 → Notion 게시 + 이메일 발송
allowed-tools: Read, Write, Bash, Task, Glob, mcp__claude_ai_Notion__notion-create-pages
---

# 주간 보고서 생성

## 인자: $ARGUMENTS
(특정 클라이언트만 하려면 슬러그, 비어있으면 전체)

## 보고서 구성

각 클라이언트별:

1. **SOV 트렌드** (지난 7일)
2. **경쟁사 비교**
3. **GSC 핵심 지표** (클릭/노출/CTR/순위)
4. **이번 주 작업**
   - 신규/리프레시된 콘텐츠
   - 적용된 스키마
   - 발견된 Quick Wins
5. **다음 주 액션 플랜**

## 출력 형식
- Markdown: `clients/<이름>/reports/weekly-YYYY-WW.md`
- PDF: 자동 변환 (선택)
- Notion: 클라이언트 페이지 게시
- 이메일: 클라이언트 담당자에게 발송 (확인 후)

## 검증 단계
- 모든 수치에 출처 (Supabase 테이블명 + 쿼리)
- 추정/예측 표현은 명시
- "약 X%" 금지, 정확한 값
