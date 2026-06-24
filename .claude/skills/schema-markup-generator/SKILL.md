---
name: schema-markup-generator
description: 클라이언트 페이지에 Schema.org JSON-LD 마크업 자동 생성 + 검증. Organization, FAQPage, Article, HowTo, Product, LocalBusiness 지원. Triggers when user says "스키마 만들어줘", "JSON-LD 생성", or new content is published.
---

# Schema Markup Generator

## 지원 타입 결정 트리

```
페이지 종류는?
├─ 홈페이지 → Organization (필수)
├─ 블로그 글 → Article + FAQPage (둘 다)
├─ 튜토리얼 → HowTo + FAQPage
├─ 제품 페이지 → Product + FAQPage
├─ 매장 페이지 → LocalBusiness
└─ 모든 페이지 → BreadcrumbList (별도 추가)
```

## 표준 생성 절차

1. **페이지 콘텐츠 분석**: `Read` 또는 URL `WebFetch`
2. **타입 결정**: 위 트리
3. **데이터 매핑**: 페이지 실제 콘텐츠 → 스키마 필드
4. **JSON-LD 생성**: 4 스페이스 인덴트
5. **검증**:
   - JSON 파싱 가능?
   - 필수 필드 모두 채워졌나?
   - URL 모두 https인가?
6. **저장**: `clients/<이름>/content/schema/<페이지슬러그>.jsonld`
7. **HTML 통합 스니펫 생성**:
   ```html
   <script type="application/ld+json">
   { ... }
   </script>
   ```

## FAQPage 특별 규칙

페이지에 **실제로 존재하는** Q&A만 마크업. 가짜 FAQ 추가 시 Google penalty.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "실제 페이지의 H2/H3 질문",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "페이지에 실제로 있는 답변 (HTML 가능)"
      }
    }
  ]
}
```

## 검증 도구
- **로컬**: `python -c "import json; json.load(open('...'))"`
- **Google Rich Results**: 사용자에게 수동 검증 안내
  - https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/

## 절대 규칙
- ❌ 페이지에 없는 콘텐츠 마크업 금지
- ❌ 가짜 평점/리뷰 추가 금지
- ✅ sameAs URL은 모두 200 응답 확인
- ✅ 이미지 URL은 절대경로 (https://...)
