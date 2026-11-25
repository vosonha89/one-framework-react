# One Framework

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvosonha89%2Fone-framework-react.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fvosonha89%2Fone-framework-react?ref=badge_shield)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/vosonha89/one-framework-react/badge)](https://scorecard.dev/viewer/?uri=github.com/vosonha89/one-framework-react)

A monorepo holding two independent projects: **`one-react-template/`**, a layered React 19 + Vite + TypeScript
application template with a built-in project initializer and code generators, and **`one-frontend-core/`**, the
upstream framework-agnostic core library those layers are built on. There is no root `package.json`: install and
run commands inside the folder you need.

## Initialize a new app

Fetch only the template subfolder, brand it, then install and run. The initializer has zero dependencies, so it
runs before `npm install`:

```bash
npx degit vosonha89/one-framework-react/one-react-template my-app
cd my-app
npm run init -- --name my-app --title "My App" --strip-demo
```

```bash
npm install
npm run dev
```

Generate your first layered feature (View / Hook / State / Model / SCSS):

```bash
npx plop view --name Product
```

Notes:

- Requires Node.js `>=20.19.0` (declared in the template `engines`).
- This repository is a monorepo, so the subfolder path in the `degit` command is mandatory. A full clone or
  GitHub's **Use this template** yields both folders: `cd one-react-template` afterwards and drop
  `one-frontend-core/` unless you want the upstream core source for reference.
- `--strip-demo` removes the sample and UI-kit demo and installs a clean starter view. Never delete
  `src/views/sample/` or `src/views/ui-kit/` by hand — `src/AppRouter.tsx` imports them and the build fails.
- Re-running the initializer aborts unless `--force`; each run is recorded in `.template.json`. Every flag,
  default and environment variable is documented in
  [Initialize the project](./one-react-template/README.md#2-initialize-the-project).

## Repository layout

| Folder | What it is | Canonical docs |
|--------|------------|----------------|
| `one-react-template/` | Self-contained app template: strict OOP, DI, layer boundaries, Tailwind v4, plop generators | [Template README](./one-react-template/README.md) |
| `one-frontend-core/` | Upstream abstract core library, npm workspaces (`packages/core`) | [Core README](./one-frontend-core/README.md) |

## Which doc to read

| You are… | Go to |
|----------|-------|
| Bootstrapping a new app | This section, then [Quick start](./one-react-template/README.md#quick-start) |
| Coding inside a scaffolded app | [Agent guide](./one-react-template/agent.md) |
| Changing the template itself | [Template README](./one-react-template/README.md) and [`plopfile.mjs`](./one-react-template/plopfile.mjs) |
| Changing the core library | [Core README](./one-frontend-core/README.md) and [core skills](./one-frontend-core/packages/core/SKILLS.md) |
| Authoring plans or specs in this repo | [AGENTS.md](./AGENTS.md) |

## Working in this repo

Quality gate for the template (run inside `one-react-template/`):

```bash
npm run lint          # ESLint: type-checked, OOP, JSDoc, layer boundaries
npm run typecheck     # tsc -b
npm run test          # vitest unit + component tests (jsdom)
npm run build:prod    # lint + typecheck + vite build (also build:dev / build:uat)
```

Core library workspaces (run inside `one-frontend-core/`):

```bash
npm install
npm run build         # packages/core: tsc -> lib/
npm run lint
npm run typecheck     # packages/core: tsc --noEmit (includes tests)
npm run test          # packages/core: vitest unit tests
npm run build:all     # every workspace, --if-present
npm run lint:all
```

GitHub Actions runs both quality gates on every push to `main` and on every
pull request: see [`.github/workflows/template.yml`](./.github/workflows/template.yml)
and [`.github/workflows/core.yml`](./.github/workflows/core.yml). Each workflow
is filtered to its own project's paths, so a change only builds what it touches.

## How the core relates to the template

The abstract core is **vendored** into `one-react-template/src/core/` and imported through the `@core` alias, so
a scaffolded app installs with no dependency on the `one-frontend-core` package. `src/core/index.ts` is a
deliberately trimmed barrel — it omits the abstract services the template does not use — so do not "fix" its
drift from upstream. The initializer refuses to write into `src/core/`.

A scaffolded project is a one-shot copy: `src/common`, `src/services`, `src/types` and `src/views` belong to your
team and are never auto-merged. Use the
[receiving template updates](./one-react-template/README.md#receiving-template-updates) recipe to refresh the
vendored core, and check `.template.json` for the template version a project started from.

## License

MIT — see [LICENSE](./LICENSE). Both projects in this monorepo (`one-react-template` and `one-frontend-core`) are released under it.

<!--
  Maintainability: this file links; it does not copy. Flags, project structure, layer rules, quality gate and
  update recipes live in one-react-template/README.md. The only duplicated text allowed here is the init
  command sequence above — update it whenever scripts/init.mjs flags change. Adding a root package.json later
  also requires editing "Repository layout".
-->
