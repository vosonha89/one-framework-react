# Implementation Plan — Track A: Release Readiness (CI + LICENSE + Core Metadata + Doc Accuracy)

## Summary

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 1 | Add root MIT `LICENSE` | `LICENSE` (new) | — | GitHub reports MIT |
| 2 | Add `license` field, both packages | 2 `package.json` | 1 | `npm publish --dry-run` clean |
| 3 | Core publish metadata | `core/package.json` | — | `npm publish --dry-run` |
| 4 | Add core `CHANGELOG.md` | `core/CHANGELOG.md` (new) | 3 | Keep a Changelog format |
| 5 | Fix root README license + CI sections | `README.md` | 1, 13 | Grep old sentence gone |
| 6 | Fix core README usage, layout, lint | `core/README.md` | — | Snippet typecheck |
| 7 | Rewrite `SKILLS.md` to real API | `core/SKILLS.md` | — | Grep nonexistent API zero |
| 8 | Fix `.clinerules` type names | `core/.clinerules` | — | Grep matches source |
| 9 | GitHub Actions workflow, core | `.github/workflows/core.yml` (new) | — | Green run on GitHub |
| 10 | GitHub Actions workflow, template | `.github/workflows/template.yml` (new) | — | Green run on GitHub |
| 11 | Delete dead CircleCI config | `one-frontend-core/.circleci/` (delete) | 9, 10 | No `.circleci` left |
| 12 | Un-ignore template lockfile | `one-react-template/.gitignore` | — | `git check-ignore` exit 1 |

- [x] 1. Add root MIT `LICENSE`
- [x] 2. Add `license` field, both packages
- [x] 3. Core publish metadata
- [x] 4. Add core `CHANGELOG.md`
- [x] 5. Fix root README
- [x] 6. Fix core README
- [x] 7. Rewrite `SKILLS.md`
- [x] 8. Fix `.clinerules`
- [x] 9. Workflow core
- [x] 10. Workflow template
- [x] 11. Delete CircleCI
- [x] 12. Un-ignore lockfile

## Key Changes

### CI/CD

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 13 | Workflow core: node 24, `npm ci`, build, lint, path filter | `.github/workflows/core.yml` | — | Actions tab green |
| 14 | Workflow template: node 24, `npm install`, lint, typecheck, build:prod, path filter | `.github/workflows/template.yml` | — | Actions tab green |
| 15 | Trigger push (main) + pull_request, both workflows | both workflow files | 13, 14 | PR/push triggers run |
| 16 | Delete `.circleci`; CircleCI never reads subfolder config | `one-frontend-core/.circleci/` | 13, 14 | `find` finds nothing |

- [x] 13. Workflow core (node 24, cache npm)
- [x] 14. Workflow template (node 24, no lockfile cache)
- [x] 15. Triggers push + PR
- [x] 16. Delete `.circleci`

### LICENSE & publish metadata

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 17 | MIT, `Copyright (c) 2025–2026 vosonha89` | `LICENSE` (new) | — | Exact standard MIT text |
| 18 | Template `"license": "MIT"` + README note | `one-react-template/package.json`, `README.md` | 17 | Grep finds field |
| 19 | Core: description, license, author, repository, bugs, homepage, keywords | `core/package.json` | 17 | `npm publish --dry-run` |
| 20 | Keep a Changelog, start at 1.0.1 | `core/CHANGELOG.md` (new) | 19 | Format matches standard |

- [x] 17. LICENSE MIT (vosonha89)
- [x] 18. Template license field + README note
- [x] 19. Core metadata complete
- [x] 20. CHANGELOG core

### Core docs accuracy

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 21 | Layout: drop `BaseObject`; list real types | `SKILLS.md`, `core/README.md`, `.clinerules` | — | Grep `BaseObject` zero |
| 22 | Skill 1: `AbstractModel<T>` with `isValid()`, `getError()`; drop `BaseList`, `mapping`, `validate` | `SKILLS.md` | — | Snippet typecheck |
| 23 | Skill 2: `AbstractObjectType.map()` + real `ObjectHelper`; drop `mapArray` | `SKILLS.md` | — | Grep `mapArray` zero |
| 24 | Skill 4: real storage contract (no session variants); `AbstractLogggingService` real name | `SKILLS.md`, `.clinerules` | — | Grep matches source |
| 25 | Skill 5: real `CommonFunction` members only | `SKILLS.md` | — | Grep fake names zero |
| 26 | Skill 6: replace `getPopoverPosition` with `createElementFromString` | `SKILLS.md` | — | Grep fake name zero |
| 27 | Skill 3: correct `RealTimeSharingData` shape | `SKILLS.md` | — | Snippet typecheck |
| 28 | Build & lint: `eslint .` flat config, drop `--ext` | `SKILLS.md`, `core/README.md` | — | Matches scripts |
| 29 | Usage snippet: `container` from `tsyringe` | `core/README.md` | — | Snippet typecheck |
| 30 | Add "Not yet implemented backlog" section | `SKILLS.md` | 22–26 | Section exists |

- [x] 21. Layout fixed, 3 files
- [x] 22. Skill 1 rewritten
- [x] 23. Skill 2 rewritten
- [x] 24. Skill 4 + logging name fixed
- [x] 25. Skill 5 rewritten
- [x] 26. Skill 6 replaced
- [x] 27. Skill 3 corrected
- [x] 28. Lint docs fixed
- [x] 29. Usage snippet fixed
- [x] 30. Backlog section added

### Repo hygiene

| # | Item | Files | Depends on | Verification |
|---|------|-------|------------|--------------|
| 31 | Remove `package-lock.json` ignore line; do not commit template lockfile | `one-react-template/.gitignore` | — | `git check-ignore` exit 1 |
| 32 | Root README: link LICENSE, mention CI | `README.md` | 17, 13, 14 | Old text gone |

- [x] 31. `.gitignore` lockfile line removed
- [x] 32. Root README updated

## Test Plan

| # | Item | Command | Scope |
|---|------|---------|-------|
| 33 | Core lint + build | `npm run lint && npm run build` in `one-frontend-core` | Items 19–30 |
| 34 | Core publish metadata | `npm publish --dry-run` in `packages/core` | Items 17–20 |
| 35 | Template quality gate | `npm run lint && npm run typecheck && npm run build:prod` | Items 18, 31 |
| 36 | Typecheck doc snippets via scratch file, then delete it | `npx tsc --noEmit -p tsconfig.json` | Items 22–29 |
| 37 | Validate workflow YAML | `npx --yes yaml-lint .github/workflows/*.yml` | Items 13–14 |
| 38 | Grep sweep fake API names | `grep -rn` over core docs | Items 21–29 |
| 39 | Lockfile no longer ignored | `git check-ignore one-react-template/package-lock.json` | Item 31 |
| 40 | Secret scan before commit; no tokens in files or staged diff | `grep -rn` + `git diff --cached` scan | Everything |

- [x] 33. Core lint + build green
- [x] 34. `npm publish --dry-run` clean
- [x] 35. Template gate green
- [x] 36. Snippet typecheck green
- [x] 37. Workflow YAML valid
- [x] 38. Grep sweep clean
- [x] 39. `git check-ignore` exit 1
- [x] 40. Secret scan clean

## Risks & Mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 41 | Template CI may hit `allowScripts` prompts on runner | Medium | Comment fallback `npm install-scripts approve esbuild @parcel/watcher` in workflow, per README §3 |
| 42 | Local template lockfile might get committed by mistake | Low | Never add it; review checklist |
| 43 | Removing "aspirational" doc APIs may confuse readers | Low | "Not yet implemented backlog" section in `SKILLS.md` |

- [x] 41. allowScripts fallback documented in workflow
- [x] 42. Review skips template lockfile
- [x] 43. Backlog section added

## Assumptions

| # | Assumption |
|---|------------|
| A1 | Copyright holder is `vosonha89` (confirmed) |
| A2 | GitHub repo is `vosonha89/one-framework-react`; Actions available |
| A3 | Node 24 only in CI (confirmed; engines require >=20.19) |
| A4 | Core keeps version `1.0.1`; CHANGELOG added without bump |
| A5 | Only core package gets a CHANGELOG |
| A6 | No credential values ever written to files, commits or pushed refs |

## Rejected Alternatives

| # | Alternative | Rejected because |
|---|-------------|------------------|
| R1 | Move `.circleci/config.yml` to repo root | CircleCI needs per-project setup; GitHub Actions native here |
| R2 | Single workflow without path filters | Runs both projects on every change |
| R3 | Implement documented-but-missing core APIs | Separate feature track; docs must match reality first |
| R4 | Add `exports` map to core package | CJS-only library; revisit with ESM build |
| R5 | Restore FOSSA badge in README | Cosmetic; FOSSA project needs re-setup |

## Implementation Order

1. Items 17–20: LICENSE + package metadata + CHANGELOG
2. Items 21–30: Core docs (README, SKILLS.md, .clinerules)
3. Items 31–32: Template `.gitignore` + root README
4. Items 13–16: Workflows + delete CircleCI
5. Items 33–40: Full local verification, secret scan
6. Commit in groups: `chore(license)`, `docs(core)`, `ci(github-actions)`
