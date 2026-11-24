# Agent Guide for one-react-template

Strict guidelines for agents and developers working in projects created from this template.
These rules are enforced by ESLint (`eslint.config.js`) and TypeScript (`tsconfig.app.json`).

---

## 1. Architecture

- **Stack**: React 19 + TypeScript + Vite, DI via `tsyringe`; self-contained core lib in `src/core/` (alias `@core`).
- **Design**: strict OOP, SOLID, layered structure, View‑Hook‑State‑Model pattern.
- **Layers**: `core` (abstract base) → `common` (shared) → `services` / `types` (business/domain) → `views` (pages).

---

## 2. Strict rules

- **TypeScript**: `strict` mode. No explicit `any` (use framework types or `unknown`).
- **Access modifiers**: every class member uses `public` / `private` / `protected`; use `readonly` where appropriate.
- **Return types**: every function/method declares an explicit return type.
- **JSDoc**: required on every public class, method and function; include `@param` and `@returns`.
- **OOP**: business logic lives in classes (State / Model / Service), never in components.
- **`this` alias**: use `const me = this;` inside methods (the only allowed alias).
- **DI**: resolve services with `container.resolve(...)`; services are `@injectable()`, shared services `@singleton()`.
- **Immutability**: copy state (`state.copy<T>()`) before mutating, then `setState(copy)`.

---

## 3. Layer boundaries (ESLint `boundaries/element-types`)

| From | Allowed imports |
|------|-----------------|
| `core` | `core` |
| `common` | `common`, `core` |
| `services` | `common`, `services`, `types`, `core` |
| `types` | `common`, `services`, `types`, `core` |
| `views` | `common`, `services`, `types`, `views`, `core` |
| root | all |

- `core` is the lowest layer; it must NOT import any app layer. Import it via `@core`.
- `common` must NOT import app `services`, app `types`, or `views`.
- `views` must NOT import the root router (`AppRouter`) — prevents import cycles.
- Extend abstract base classes from `@core`; `src/core/` is vendored (its own lint scope).

---

## 4. Creating a view

Location: `src/views/<kebab-name>/`. Five files:

- `<Name>.tsx` — UI only; reads `componentState`, calls hook actions; gates on `isReady`.
- `<Name>.hook.tsx` — `useState(new <Name>State())`, `useEffect` lifecycle, actions; returns state + handlers.
- `<Name>.state.ts` — extends `ComponentState`; `model`, `modelPropName`, `init(): Promise<void>`, actions.
- `<Name>.model.ts` — extends `BaseModel`; fields + `isValid(): boolean`.
- `<Name>.scss` — styles.

Prefer the generator:

```bash
npx plop view --name <Name>
```

---

## 5. Creating a service

Location: `src/services/`. Extend `BaseService`, decorate `@injectable()`.

- Define `apiUrl` map using `AppEnvironment.VITE_APP_API_URL`.
- Use dedicated request (`requestObject/`) and response (`responseObject/`) types.
- Map responses into domain objects in `src/types/` (extend `AbstractObjectType`).
- Handle errors with `AppError` / `handleError` returning `SystemError`.

```bash
npx plop service --name <Name>
```

---

## 6. i18n

- Locale files: `src/assets/language/en.json` and `vi.json`.
- Keep both locales in sync (identical key sets) and matching `LanguageText`.
- Access text via `languageService.text` or the `LanguageHook`.

---

## 7. Development workflow (quality gate)

For every task, run and pass:

```bash
npm run lint        # must be 0 errors
npm run typecheck   # tsc -b, must be 0 errors
npm run build:prod  # lint + typecheck + vite build (also :dev / :uat)
```

---

## 8. Task checklist

- [ ] Follow layered structure and naming conventions.
- [ ] Use OOP, DI, access modifiers and explicit return types.
- [ ] Add JSDoc (`@param` / `@returns`) to public classes/methods/functions.
- [ ] Respect layer boundaries; no `any`.
- [ ] Keep `en.json` / `vi.json` keys in parity.
- [ ] Pass lint + typecheck + build before submitting.