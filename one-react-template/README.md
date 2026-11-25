# One React Template

A reusable **React 19 + Vite + TypeScript** template for bootstrapping new projects with a strict, layered architecture.

The abstract core (DI via `tsyringe`, base models, helpers) is vendored into `src/core/`,
so the template is **self-contained** — no external core npm dependency. The full core
library source lives in the sibling [`one-frontend-core/`](../one-frontend-core) folder.

## Highlights

- **Strict OOP** — business logic lives in classes (State / Model / Service), not in components.
- **Type-safe** — TypeScript `strict`, no explicit `any`, explicit return types and member accessibility enforced by ESLint.
- **JSDoc** — required on public classes, methods and functions.
- **Layered structure** — `core` → `common` → `services` / `types` → `views`, with import boundaries enforced by ESLint.
- **Self-contained core** — abstract base library vendored in `src/core/`, imported via the `@core` alias.
- **View‑Hook‑State‑Model** — every screen is split into independent UI, orchestration, logic and validation files.
- **Dependency Injection** — `tsyringe` with `@singleton()` / `@injectable()` services.
- **Code generator** — `plop` scaffolds new views / services / models that already comply with the rules.
- **i18n** — English / Vietnamese JSON locale files.
- **Styling** — Tailwind CSS v4 (`@tailwindcss/vite`) alongside layered SCSS; utilities and component styles coexist. See the `/ui-kit` page for a live showcase of basic elements.

## Quick start

Requires Node.js >= 20.19 (Vite 8) and npm >= 10.

### 1. Create a new project from the template

Using `degit` (no git history). The template is a subfolder of the monorepo, so include it in the source:

```bash
npx degit vosonha89/one-framework-react/one-react-template my-app
cd my-app
```

Private repository? Use git mode, or clone and copy the folder:

```bash
npx degit --mode=git vosonha89/one-framework-react/one-react-template my-app
# or
git clone --depth 1 https://github.com/vosonha89/one-framework-react.git
cp -r one-framework-react/one-react-template my-app && cd my-app
```

GitHub's **Use this template** button copies the whole monorepo: `cd one-react-template` afterwards and
delete the sibling `one-frontend-core/` folder unless you want the upstream core source for reference.

### 2. Initialize the project

```bash
npm run init -- --name my-app --title "My App" --strip-demo
```

This renames the package, the app title in every env file, the HTML title, the locale `appName` and the
doc headings, and resets the demo API URL. `--strip-demo` additionally removes the sample and UI-kit
demo and installs a clean starter view at `src/views/home/Home.tsx`.

| Flag | Purpose |
|------|---------|
| `--name <slug>` | npm package name (defaults to the sanitized folder name) |
| `--title <text>` | App title for env files, HTML and locales (defaults to the name) |
| `--api-url <url>` | API base URL written to the env files that define it |
| `--strip-demo` | Remove demo views/services/types and add the starter home view |
| `--dry-run` | Print the planned changes without writing anything |
| `--force` | Re-run on a project that was already initialized |

The run is recorded in `.template.json` (template version, name, title, timestamp). A second run aborts
unless `--force` is passed, and every edit is an exact-token replacement, so re-running is safe.

> Never delete `src/views/sample/` or `src/views/ui-kit/` by hand — `src/AppRouter.tsx` imports them and
> the build will fail. Use `npm run init -- --strip-demo` instead.

### 3. Install dependencies

```bash
npm install
```

If npm reports `install-scripts ... blocked because they are not covered by allowScripts`:

```bash
npm install-scripts approve esbuild
npm install-scripts approve @parcel/watcher
npm rebuild esbuild @parcel/watcher
```

The template ships no lockfile; commit the one `npm install` generates into your own repository.

### 4. Configure environment

Environment files live in `configuration/environment/` (Vite `envDir`).
Edit `env.development`, `env.uat`, `env.production` as needed. See [.env.example](./.env.example).

| Variable | Purpose |
|----------|---------|
| `VITE_APP_TITLE` | Application name |
| `VITE_APP_VERSION` | Application version |
| `VITE_APP_ENV` | Environment label |
| `VITE_APP_API_URL` | API base URL |

### 5. Run

```bash
npm run dev          # development server
npm run build:prod   # lint + typecheck + production build
```

## Project structure

```
src/
├── assets/language/        # i18n JSON (en.json, vi.json)
├── core/                   # Vendored abstract core lib (@core alias, lowest layer)
│   ├── types/              # AbstractModel, AbstractObjectType, ComponentState
│   ├── functions/          # ObjectHelper, CommonFunction, UIHelper
│   ├── constants/          # LanguageCode, StatusCode, StorageKey, ...
│   └── services/           # AbstractStorageService, AbstractLogggingService
├── common/                 # Shared lower layer (no app business)
│   ├── components/         # Shared UI (NotReady, ...)
│   ├── constants/          # AppEnvironment, StorageKey, AlertType, ...
│   ├── functions/          # ObjectHelper, CommonFunction, UIHelper
│   ├── hooks/              # formHook, globalHook, languageHook
│   ├── services/           # BaseService, language/storage/alert/loading/logging
│   └── types/              # ComponentState, BaseModel, BaseList, LanguageText
├── services/               # Business services + request/response objects
│   ├── requestObject/
│   ├── responseObject/
│   └── sample.Service.ts
├── types/                  # Domain objects (map API responses)
├── views/                  # Pages, each split into 5 files
│   ├── sample/
│   │   ├── Sample.tsx          # View — UI only
│   │   ├── Sample.hook.tsx     # Hook — orchestration / lifecycle
│   │   ├── Sample.state.ts     # State — logic (extends ComponentState)
│   │   ├── Sample.model.ts     # Model — validation (extends BaseModel)
│   │   └── Sample.scss         # Styles
│   └── ui-kit/                 # Tailwind showcase page (/ui-kit)
├── App.tsx / AppRouter.tsx / main.tsx
├── tailwind.css            # Tailwind v4 entry (@import "tailwindcss")
└── index.scss / App.scss
```

### Layer rules (enforced by ESLint `boundaries`)

```
views ──▶ services ──▶ common ──▶ core
  │          │            │
  └──▶ types ┘            └──▶ core   (all layers may import @core)
```

| From | May import |
|------|------------|
| `core` | `core` only |
| `common` | `common`, `core` |
| `services` | `common`, `services`, `types`, `core` |
| `types` | `common`, `services`, `types`, `core` |
| `views` | `common`, `services`, `types`, `views`, `core` |
| root (`App`, `main`, `AppRouter`) | everything |

`core` is the lowest layer and must not import any app layer. `common` must never import `views`, app `services` or app `types`. Views must not import the root router (avoids cycles). Import core via the `@core` alias.

## The View‑Hook‑State‑Model pattern

- **View (`*.tsx`)** — renders UI, reads `componentState`, calls hook actions. No business logic.
- **Hook (`*.hook.tsx`)** — `useState(new XState())`, `useEffect` lifecycle, copies state (`state.copy()`) before mutating, pushes new state.
- **State (`*.state.ts`)** — extends `ComponentState`, resolves services via DI, holds `model`, implements `init()` and actions.
- **Model (`*.model.ts`)** — extends `BaseModel`, holds form fields, implements `isValid()`.

```tsx
// View
const elHook = SampleHook();
if (elHook.componentState.isReady) { /* render */ }

// Hook
const pageState = componentState.copy<SampleState>();
await pageState.init();
setcomponentState(pageState);

// State
public async init(): Promise<void> { /* call services, set isReady */ }

// Model
public isValid(): boolean { /* push errors, return errors.length === 0 */ }
```

## Code generator

```bash
npm run generate                 # interactive: pick view / service / model
npx plop view --name Product     # scaffold src/views/product/Product.*
npx plop service --name Product  # scaffold service + request/response/object
npx plop model --name Product    # scaffold a view model
```

Generated files already include access modifiers, return types and JSDoc, and pass the quality gate.

## Quality gate

Run before committing:

```bash
npm run lint        # ESLint (strict type-checked + OOP + JSDoc + boundaries)
npm run typecheck     # tsc -b
npm run build:prod    # lint + typecheck + vite build (also :dev / :uat)
```

## Receiving template updates

A scaffolded project is a one-shot copy: `src/common`, `src/services`, `src/types` and `src/views` belong
to your team and are never auto-merged. To refresh the vendored core from upstream, pull the core source
into a temporary folder and review the diff before applying anything:

```bash
npx degit vosonha89/one-framework-react/one-frontend-core/packages/core/src /tmp/core-latest
diff -ru src/core /tmp/core-latest
```

`src/core/index.ts` is a trimmed barrel and intentionally differs from upstream. Check `.template.json`
for the template version your project started from.

## Conventions

- Classes `PascalCase`, methods `camelCase`, files match the exported symbol.
- Every class member has `public` / `private` / `protected`; use `readonly` where appropriate.
- Use `const me = this;` inside methods (allowed by ESLint).
- No explicit `any`; use framework types or `unknown`.
- JSDoc on every public class, method and function (`@param` / `@returns`).
- Services extend `BaseService` and are `@injectable()`; shared services are `@singleton()`.
- Extend abstract base classes from `@core`; treat `src/core/` as a vendored library (its own lint scope).

See [agent.md](./agent.md) for the full agent/developer rule set.

## License

MIT — the full license text lives in the `LICENSE` file at the root of the source repository.