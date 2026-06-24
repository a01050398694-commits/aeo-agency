# GitHub Actions 무료 cron 셋업 가이드

> **목표**: 매일 03:00 KST에 모든 활성 클라이언트 SOV 자동 측정.
> **비용**: 0원 (public repo면 Actions 무제한, private면 월 2,000분).
> **워크플로**: `.github/workflows/daily-sov.yml`

## 1. 레포 푸시 (최초 1회)

```bash
cd D:/aeo

# 초기 커밋
git init -b main 2>/dev/null || true
git add .gitignore .gitattributes CLAUDE.md README.md SESSION-STATE.md
git add .env.example .claude/ clients/ docs/ scripts/ .github/
# .env 와 credentials.env* 는 .gitignore 에 의해 자동 제외됨
git commit -m "feat: Phase 1+2 셋업 + 첫 클라이언트(망원-러프러프)"

# GitHub 레포 생성 (PUBLIC 권장 — Actions 무제한)
# PAT: D:\claude\API_REGISTRY.md §13-1 (ghp_dLK...)
gh auth login --with-token < <(echo $GITHUB_PAT)
gh repo create aeo-agency --public --source=. --remote=origin --push
```

private repo로 만들 거면 `--public` 대신 `--private`. 단 월 2,000분 한도 — 일일 측정만 하면 충분.

## 2. Secrets 등록

레포 페이지 → Settings → Secrets and variables → Actions → New repository secret

| Secret 이름 | 값 출처 |
|---|---|
| `GEMINI_API_KEY` | `D:\aeo\.env` GEMINI_API_KEY |
| `SUPABASE_URL` | `D:\aeo\.env` SUPABASE_URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 대시보드 → Settings → API → service_role |

CLI로도 가능 (값은 절대 직접 적지 말 것 — .env에서 읽기):
```bash
# .env에서 자동 추출
set -a; . ./.env; set +a
gh secret set GEMINI_API_KEY --body "$GEMINI_API_KEY"
gh secret set SUPABASE_URL --body "$SUPABASE_URL"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "$SUPABASE_SERVICE_ROLE_KEY"
```

> ⚠️ **절대 키를 문서/코드에 하드코딩하지 말 것.** Public repo면 Google이 자동 감지해서
> 키를 즉시 차단합니다 (PERMISSION_DENIED: "API key reported as leaked"). 실제로 한 번 당했음.

Service role 키 발급:
- https://supabase.com/dashboard/project/qrcaacrevijtwcibzrep/settings/api
- "Project API keys" → service_role → 복사

## 3. 동작 확인

```bash
# 수동 실행 (특정 클라이언트, 10개 쿼리 limit)
gh workflow run daily-sov.yml \
  -f client_slug=mangwon-roughrough \
  -f limit=10

# 실행 상태 확인
gh run list --workflow=daily-sov.yml --limit 5
gh run watch
```

## 4. 스케줄 확인

cron 표기: `0 18 * * *` = 매일 18:00 UTC = **03:00 KST 익일**

GitHub Actions cron은 ±15분 지연될 수 있음 (best-effort).

## 5. 한도 관리

### Public repo
- Actions: 무제한
- Artifacts: 500MB 무료
- 로그 90일 보관

### Private repo (혹시 private 선택 시)
- 월 2,000분 무료
- 일일 측정 = 약 8분/일 × 30일 = 240분/월 → 여유 충분
- 클라이언트 10명 가정 시 80분/일 → 월 2,400분 (초과)
  → Public 추천

## 6. 추가 워크플로 (Phase 3에 추가 예정)

- `.github/workflows/weekly-gsc.yml` — 매주 월 09:00 KST, GSC 데이터 수집
- `.github/workflows/monthly-report.yml` — 매월 1일, 보고서 생성/이메일
- `.github/workflows/content-refresh.yml` — 매월 1일, 90일 스테일 콘텐츠 식별
