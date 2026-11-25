# Implementation Plan — Track B: Template Quality (Tests + CI Generator Verification + ErrorBoundary/404 + NotReady polish)

## Summary

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 1 | Vitest + RTL + jsdom cho template | template `package.json`, `vitest.config.ts` (new) | — | `npm run test` green |
| 2 | Vitest + jsdom cho core | core `package.json`, `vitest.config.ts` (new) | — | `npm run test` green |
| 3 | 7 file test mẫu template (logic + component) | `src/**/__tests__/*.test.tsx` (new) | 1, 8 | Vitest pass |
| 4 | 4 file test core (pure functions + sharing) | `packages/core/src/**/__tests__` (new) | 2 | Vitest pass |
| 5 | ErrorBoundary mới | `src/common/components/errorBoundary/` (new) | 8 | Component test pass |
| 6 | NotFound 404 view + route | `src/views/notFound/`, `AppRouter.tsx`, `App.tsx`, `init.mjs` | 8, 5 | Test + typecheck pass |
| 7 | NotReady styled + i18n | `NotReady.tsx` | 8 | Component test pass |
| 8 | i18n keys mới (en/vi/`LanguageText`) | 2 locale JSON, `languageText.ts` | — | `jq` key parity OK |
| 9 | CI: test step + plop generator smoke job | `.github/workflows/template.yml`, `core.yml` | 3, 4 | YAML lint + logic review |
| 10 | Docs: thêm `npm run test` vào quality gate | 4 file README/agent | 1, 2 | Grep tìm thấy lệnh |

- [x] 1. Vitest template
- [x] 2. Vitest core
- [x] 3. Tests template
- [x] 4. Tests core
- [x] 5. ErrorBoundary
- [x] 6. NotFound + route + init.mjs
- [x] 7. NotReady polish
- [x] 8. i18n keys
- [x] 9. CI updates
- [x] 10. Docs

## Key Changes

### Test infrastructure

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 11 | devDeps: `vitest`, `jsdom`, `@testing-library/react@^16`, `@testing-library/jest-dom`; scripts `test`, `test:watch` | `one-react-template/package.json` | — | `npm install` OK |
| 12 | Config jsdom, include `src/**/__tests__/*.{test,spec}.{ts,tsx}`, explicit imports (no globals) | `one-react-template/vitest.config.ts` (new) | 11 | `vitest run` discovers tests |
| 13 | `vitest.config.ts` vào include của `tsconfig.node.json` | `one-react-template/tsconfig.node.json` | 12 | `tsc -b` green |
| 14 | Core devDeps `vitest`, `jsdom`; script `test` | `core/package.json` (+ lockfile update) | — | `npm install` OK |
| 15 | Config jsdom cho core (URL/cookie tests) | `core/vitest.config.ts` (new) | 14 | `vitest run` discovers |

- [x] 11. Template devDeps + scripts
- [x] 12. Template vitest config
- [x] 13. tsconfig.node include
- [x] 14. Core devDeps + script
- [x] 15. Core vitest config

### ErrorBoundary + NotFound (item 10)

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 16 | Class component: `getDerivedStateFromError`, `componentDidCatch` → `LogggingService.logError`, fallback Tailwind + reload button | `src/common/components/errorBoundary/ErrorBoundary.tsx` (new) | 8 | Test item 24 |
| 17 | Wrap `RouterProvider` trong ErrorBoundary | `src/App.tsx` | 16 | App renders, typecheck |
| 18 | NotFound view UI-only: Tailwind, `label.pageNotFound` + Link home | `src/views/notFound/NotFound.tsx` (new) | 8 | Test item 26 |
| 19 | Route `noMatch` → `<NotFound />` (bỏ redirect mù) | `src/AppRouter.tsx` | 18 | Typecheck + manual |
| 20 | `HOME_ROUTER` trong init.mjs thêm NotFound route (strip-demo path nhất quán) | `scripts/init.mjs` | 18 | `--dry-run` + smoke |
| 21 | Keys: `errorMessage.unexpectedError`, `label.loading`, `label.pageNotFound`, `label.backHome` (en/vi) + interface | `en.json`, `vi.json`, `languageText.ts` | — | `jq` parity, typecheck |

- [x] 16. ErrorBoundary component
- [x] 17. App.tsx wiring
- [x] 18. NotFound view
- [x] 19. AppRouter route
- [x] 20. init.mjs HOME_ROUTER
- [x] 21. i18n keys + interface

### NotReady polish (item 11)

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 22 | Tailwind spinner + `label.loading` qua `LanguageHook` (thay `<div>Not ready</div>`) | `NotReady.tsx` | 21 | Test item 25 |

- [x] 22. NotReady rewrite

### Test files

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 23 | Logic: `deepCopy`; `LoadingService`; `UiKitModel.isValid`; `UiKitState` copy/input/actions | 4 file test logic | 11, 12 | Vitest pass |
| 24 | Component: ErrorBoundary fallback khi child throw; child lành render bình thường | `errorBoundary.test.tsx` | 16 | Vitest pass |
| 25 | Component: NotReady hiển thị `label.loading` (sau `initLanguage`) | `notReady.test.tsx` | 22 | Vitest pass |
| 26 | Component: NotFound hiển thị text + link home (wrap `MemoryRouter`) | `NotFound.test.tsx` | 18 | Vitest pass |
| 27 | Core: `CommonFunction`; `ObjectHelper`; `UIHelper`; Sharing + RealTime roundtrip | 4 file `__tests__` trong core | 15 | Vitest pass |

- [x] 23. Logic tests template
- [x] 24. ErrorBoundary test
- [x] 25. NotReady test
- [x] 26. NotFound test
- [x] 27. Core tests

### CI + docs

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 28 | `template.yml`: step `npm run test` (sau typecheck) | `.github/workflows/template.yml` | 3 | YAML lint |
| 29 | `template.yml`: job `generator-smoke` — plop view/service/model `--name Demo` rồi lint + typecheck | `.github/workflows/template.yml` | 3 | Smoke local + YAML lint |
| 30 | `core.yml`: step `npm run test` (sau build) | `.github/workflows/core.yml` | 4 | YAML lint |
| 31 | Docs: quality gate thêm `npm run test`; nhắc ErrorBoundary/NotFound | template README, `agent.md` §7, root README, core README | 1, 2 | Grep |

- [x] 28. Template CI test step
- [x] 29. Generator smoke job
- [x] 30. Core CI test step
- [x] 31. Docs updates

## Test Plan

| # | Item | Command | Scope |
|---|------|---------|-------|
| 32 | Template test | `cd one-react-template && npm run test` | Items 11–26 |
| 33 | Core test | `cd one-frontend-core/packages/core && npm run test` | Items 14–27 |
| 34 | Template full gate | `npm run lint && npm run typecheck && npm run build:prod` | Items 5–22 |
| 35 | Core full gate | `npm run lint && npm run build` (+ lockfile update commit) | Item 14 |
| 36 | i18n parity | `jq` key-sets của en.json = vi.json | Item 21 |
| 37 | Plop smoke local | plop view/service/model `--name Demo` → lint + typecheck → remove generated | Item 29 |
| 38 | init.mjs strip-demo smoke | copy template → /tmp, symlink node_modules, chạy init thật | Item 20 |
| 39 | Workflow YAML | `npx --yes yaml-lint` 2 file workflow | Items 28–30 |
| 40 | Secret scan trước commit | `grep` diff mới cho token patterns = 0 | Tất cả |

- [x] 32. Template test green
- [x] 33. Core test green
- [x] 34. Template gate green
- [x] 35. Core gate green
- [x] 36. Locale parity OK
- [x] 37. Plop smoke pass
- [x] 38. Strip-demo smoke pass
- [x] 39. YAML valid
- [x] 40. Secret scan clean

## Risks & Mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 41 | Code plop sinh ra có thể fail strict lint | Medium | Smoke local trước; nếu fail sửa `templates/*.hbs` trong track |
| 42 | Test files chịu rules strict (JSDoc, return types) | Low | Arrow callbacks (miễn theo `allowExpressions`); helper class thêm JSDoc |
| 43 | RTL cần v16+ cho React 19 | Low | Cài bản mới nhất, lock `^16` |
| 44 | Template lockfile local đổi sau `npm install` | Low | Vẫn KHÔNG commit lockfile template |
| 45 | `init.mjs` HOME_ROUTER đổi — re-run cần `--force` | Low | Token replacement giữ nguyên; dry-run verify |

- [x] 41. Sửa hbs nếu smoke fail
- [x] 42. Convention test tuân lint
- [x] 43. RTL v16 pin
- [x] 44. Lockfile vẫn untracked
- [x] 45. Dry-run verify init

## Assumptions

| # | Assumption |
|---|------------|
| A1 | Vitest 4.x, jsdom, RTL 16 tương thích Node 24 (engines >=20.19) |
| A2 | Tests đặt trong `src/**/__tests__` — typecheck bởi tsconfig hiện có |
| A3 | NotFound + ErrorBoundary không thuộc demo closure → sống qua `--strip-demo` |
| A4 | `implementation_plan.md` ghi đè bởi plan Track B (Track A ở commit `3454061`) |
| A5 | Plop bypass `-- --name X` chạy đúng như README plop xác nhận |

## Rejected Alternatives

| # | Alternative | Rejected because |
|---|-------------|------------------|
| R1 | `globals: true` trong vitest config | Explicit imports khớp convention codebase |
| R2 | Playwright/E2E tests | Nặng cho template scaffold; để track sau |
| R3 | Dùng `vite.config.ts` cho vitest | Trộn concern; config riêng rõ hơn |
| R4 | Route lazy-loading (`React.lazy`) | Enhancement riêng, không thuộc item 10 |
| R5 | Test `SampleState` với fetch mock | Phức tạp; UiKit state đủ làm mẫu pattern |

## Implementation Order

1. Items 11–15: Test infra (deps, configs, scripts, lockfile core)
2. Items 21 + 16–22: i18n → ErrorBoundary → NotFound → AppRouter/App → init.mjs → NotReady
3. Items 23–27: Viết toàn bộ test files, chạy vitest tới xanh
4. Items 28–31: CI workflows + docs
5. Items 32–40: Full verification (gates, parity, plop smoke, strip-demo smoke, secret scan)
6. Commits: `chore(test)`, `feat(app)`, `ci(workflows)`, `docs(readme)`
