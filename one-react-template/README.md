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

## Quick start

### 1. Create a new project from the template

Using `degit` (no git history):

```bash
npx degit your-org/one-react-template my-app
cd my-app
```

Or simply copy the `one-react-template/` folder and rename it.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Environment files live in `configuration/environment/` (Vite `envDir`).
Edit `env.development`, `env.uat`, `env.production` as needed. See [.env.example](./.env.example).

| Variable | Purpose |
|----------|---------|
| `VITE_APP_TITLE` | Application name |
| `VITE_APP_VERSION` | Application version |
| `VITE_APP_ENV` | Environment label |
| `VITE_APP_API_URL` | API base URL |

### 4. Run

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
│   └── sample/
│       ├── Sample.tsx          # View — UI only
│       ├── Sample.hook.tsx     # Hook — orchestration / lifecycle
│       ├── Sample.state.ts     # State — logic (extends ComponentState)
│       ├── Sample.model.ts     # Model — validation (extends BaseModel)
│       └── Sample.scss         # Styles
├── App.tsx / AppRouter.tsx / main.tsx
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

MIT