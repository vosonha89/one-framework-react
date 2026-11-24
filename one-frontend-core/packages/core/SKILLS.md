# ONE Framework — Core Skills

Framework-agnostic building blocks shared by every ONE frontend package. No React/Vue/Angular dependency lives here.

## Package layout

| Folder | Responsibility | Key exports |
| --- | --- | --- |
| `src/constants` | Enums & constant classes | `StatusCode`, `RequestMethod`, `StorageKey`, `LanguageCode`, `MessageType`, `ConstantValue` |
| `src/types` | Base contracts | `AbstractModel<T>`, `BaseObject`, `ComponentState<T>`, `AnyType`, `ICommonSharingData` |
| `src/functions` | Static helpers | `ObjectHelper`, `CommonFunction`, `UIHelper` |
| `src/services` | Abstract contracts + DI singletons | `AbstractHttpService`, `AbstractRoutingService`, `AbstractValidationService`, `AbstractStorageService`, `AbstractLoggingService`, `AbstractLoadingService`, `AbstractLanguageService`, `SharingDataService`, `RealTimeSharingDataService` |

Everything is re-exported from `src/index.ts`.

## Skills

### 1. Define a domain model
Extend `AbstractModel<T>` and implement `mapping()` / `validate()`. Use `updatePaging` for paginated lists.

```ts
import { AbstractModel, BaseList } from "one-frontend-core";

class UserModel extends AbstractModel<UserModel> {
  id = "";
  name = "";
  dataList: BaseList<UserModel> = new BaseList<UserModel>();

  mapping(response?: unknown): void { /* map response → fields */ }
  validate(): boolean { return this.name.length > 0; }
}
```

### 2. Map raw data into typed objects
Use `BaseObject.mapping` and `ObjectHelper.mapArray` to hydrate arrays.

```ts
import { ObjectHelper } from "one-frontend-core";
const users = ObjectHelper.mapArray(rawArray, UserModel);
```

### 3. Share data across modules (DI singleton)
`SharingDataService` stores serialized values; `RealTimeSharingDataService` exposes an RxJS `BehaviorSubject` for live updates. Both are `@singleton()` via `tsyringe`.

```ts
import { container } from "tsyringe";
import { RealTimeSharingDataService } from "one-frontend-core";

const bus = container.resolve(RealTimeSharingDataService);
bus.saveObject("session", { token: "abc" });
bus.getObject<{ token: string }>("session")?.listener.subscribe(console.log);
```

### 4. Implement a framework adapter
Implement the abstract contracts in a framework-specific package (e.g. `packages/react`):

- `AbstractHttpService<TRequest, TResponse>` → `get/post/put/delete`
- `AbstractRoutingService` → `navigate/replace/back`
- `AbstractValidationService<TModel>` → `validate/getErrors`
- `AbstractStorageService` → `save/get/delete/clear` (+ session variants)
- `AbstractLoggingService` → `log/warn/error`
- `AbstractLoadingService` → `show/hide`
- `AbstractLanguageService<TStorage>` → `setLanguage/getLanguageText`

Register implementations with `tsyringe` so consumers resolve contracts, not concrete classes.

### 5. Format & inspect values
`CommonFunction` provides date/number/currency formatting, `generateUUID`, `convertBase64`, `compareValue`, `formatString`.

```ts
import { CommonFunction } from "one-frontend-core";
CommonFunction.formatCurrency(1234.5);      // "1,234.50"
CommonFunction.formatDateByPattern(new Date(), "DD/MM/YYYY");
```

### 6. UI positioning helpers
`UIHelper.getPopoverPosition(anchor, popover, preferred)` returns `{ position, top, left }` for tooltips/popovers without any framework coupling.

## Conventions

- **DI:** services use `tsyringe` decorators (`@singleton`, `@injectable`). Consumers must import `reflect-metadata` once at entry.
- **Reactive:** `rxjs` powers `RealTimeSharingDataService`.
- **Strict TS:** `strict: true`, decorators enabled, output CommonJS + `.d.ts` to `lib/`.
- **No framework imports** in core. Keep adapters in sibling packages.

## Build & lint

```bash
npm install
npm run build   # tsc → lib/ (js + d.ts)
npm run lint    # eslint . --ext .ts
```

## Adding a new skill

1. Add the contract/helper under the right `src/` folder.
2. Export it from `src/index.ts`.
3. Document it here with a short example.
4. `npm run build && npm run lint` must pass.