# ONE Framework — Core Skills

Framework-agnostic building blocks shared by every ONE frontend package. No React/Vue/Angular dependency lives here.

## Package layout

| Folder | Responsibility | Key exports |
| --- | --- | --- |
| `src/constants` | Enums & constant classes | `StatusCode`, `RequestMethod`, `StorageKey`, `LanguageCode`, `MessageType`, `ConstantValue` |
| `src/types` | Base contracts | `AbstractModel<T>`, `ErrorModel`, `AbstractType`, `AbstractObjectType<T>`, `ComponentState`, `AnyType`, `UndefinedType`, `ICommonSharingData` |
| `src/functions` | Static helpers | `ObjectHelper`, `CommonFunction`, `UIHelper` |
| `src/services` | Abstract contracts + DI singletons | `AbstractHttpService`, `AbstractRoutingService`, `AbstractValidationService`, `AbstractStorageService`, `AbstractLogggingService`, `AbstractLoadingService`, `AbstractLanguageService`, `SharingDataService`, `RealTimeSharingDataService` |

Everything is re-exported from `src/index.ts`.

> The logging contract is spelled `AbstractLogggingService` (triple "g"),
> matching its file name `abstractLoggingService.ts`. That is the actual
> public name; renaming it is a breaking release.

## Skills

### 1. Define a domain model

Extend `AbstractModel<T>` where `T extends ErrorModel`, and implement the two
abstract members `isValid()` and `getError(prop)`. The base class tracks
`errors: T[]` and offers `checkError(prop)`.

```ts
import { AbstractModel, ErrorModel } from "one-frontend-core";

interface UserError extends ErrorModel {}

class UserModel extends AbstractModel<UserError> {
    public id = "";
    public name = "";

    public isValid(): boolean {
        const me = this;
        me.errors = [];
        if (me.name.length === 0) {
            me.errors.push({ property: "name", error: "Name is required." });
        }
        return me.errors.length === 0;
    }

    public getError(prop: string): string {
        const me = this;
        return me.errors.find((item) => item.property === prop)?.error ?? "";
    }
}
```

### 2. Map raw data into typed objects

Extend `AbstractObjectType<T>` and call `map(object)` — it assigns the raw
properties onto the instance via `Object.assign`. Use `ObjectHelper.deepCopy`
for a prototype-preserving copy.

```ts
import { AbstractObjectType, ObjectHelper } from "one-frontend-core";

interface RawUser {
    id: string;
    name: string;
}

class UserObject extends AbstractObjectType<RawUser> {
    public id = "";
    public name = "";
}

const user = new UserObject();
user.map({ id: "1", name: "Ada" } as RawUser);
const clone = ObjectHelper.deepCopy(user);
```

### 3. Share data across modules (DI singleton)

`RealTimeSharingDataService` stores values per key and exposes an RxJS
`BehaviorSubject` for live updates; both sharing services are `@singleton()`
via `tsyringe`.

```ts
import { container } from "tsyringe";
import { RealTimeSharingDataService } from "one-frontend-core";

const bus = container.resolve(RealTimeSharingDataService);
bus.saveObject("session", { token: "abc" });
bus.getObject<{ token: string }>("session")?.listener.subscribe(console.log);
```

`SharingDataService` mirrors this API with plain serialized values
(`saveObject` / `getObject` / `deleteObject`) and no RxJS dependency.

### 4. Implement a framework adapter

Implement the abstract contracts in a framework-specific package (e.g. `packages/react`):

- `AbstractHttpService<TRequest, TResponse>` → `get(url, params?)`, `post(url, body)`, `put(url, body)`, `delete(url, params?)`
- `AbstractRoutingService` → `navigate(path, params?)`, `replace(path, params?)`, `back()`
- `AbstractValidationService<TModel>` → `validate(model)`, `getErrors(model)`
- `AbstractStorageService` → `clear()`, `saveObject(key, value)`, `getObject(key)`, `deleteObject(key)`; every method is async and there are no session-storage variants
- `AbstractLogggingService` → `logError<T extends BaseServerError>(ex)`; `BaseServerError` is `{ code, title, message, type }`
- `AbstractLoadingService` → `show()`, `hide()`
- `AbstractLanguageService<TStorage extends AbstractStorageService>` → `setLanguage(value)`, `getLanguageText(value)`; exposes `storeService` and `text`

Register implementations with `tsyringe` so consumers resolve contracts, not concrete classes.

### 5. Format & generate values

`CommonFunction` provides:

- `formatCurrency(value, locales, currency)` — localized currency via `Intl.NumberFormat`
- `createUUID()` — random UUID v4-style string
- `randomNumber(min, max)` — random integer in `[min, max)`
- `sleep(ms)` — Promise resolving after the delay

```ts
import { CommonFunction } from "one-frontend-core";

CommonFunction.formatCurrency(1234.5, "en-US", "USD"); // "$1,234.50"
CommonFunction.createUUID();                            // e.g. "3f2b1a4c-..."
await CommonFunction.sleep(250);
```

### 6. Inspect, copy and transform values

`ObjectHelper` provides:

- `getValue<D>(object, propertyName)` — typed read of an own property
- `hasApiError(response)` — true when the response carries a non-zero `code`
- `deepCopy(value)` — `structuredClone` of fields, with the source chained as the copy's prototype
- `deepCopyHemers(value)` — prototype-chaining copy without cloning nested objects
- `getURLParam(name)` — query param read; `setURLParam(name, value, isSilent = true)` and `deleteURLParam(name, isSilent = true)` update the URL
- `getCookie(name)` — cookie value, or `""` when absent

`UIHelper` provides `createElementFromString(text)`, returning `{ __html: string }`
for `dangerouslySetInnerHTML` consumers.

### 7. Track component state

`ComponentState` is the base for per-screen state objects: `isReady = false`,
`copy<TObject>()` (prototype-preserving deep copy) and the abstract `init()`
that concrete states must implement.

## Conventions

- **DI:** services use `tsyringe` decorators (`@singleton`, `@injectable`). Consumers must import `reflect-metadata` once at entry.
- **Reactive:** `rxjs` powers `RealTimeSharingDataService`.
- **Strict TS:** `strict: true`, decorators enabled, output CommonJS + `.d.ts` to `lib/`.
- **No framework imports** in core. Keep adapters in sibling packages.

## Build & lint

```bash
npm install
npm run build   # tsc → lib/ (js + d.ts)
npm run lint    # eslint . (ESLint 9 flat config)
```

## Not yet implemented backlog

The following helpers were sketched or requested but are **not** part of the
current public API. Ship them in a minor release with tests and a CHANGELOG
entry:

- `ObjectHelper.mapArray(rawArray, Type)` — hydrate an array of raw objects
- `UIHelper.getPopoverPosition(anchor, popover, preferred)` — framework-free popover positioning
- `CommonFunction.formatDateByPattern(date, pattern)` — pattern-based date formatting
- `CommonFunction.convertBase64` / `compareValue` / `formatString`

`BaseList` (paginated list container) is **not** exported by this package; it
lives in the React template (`one-react-template/src/common/types/baseType.ts`).

## Adding a new skill

1. Add the contract/helper under the right `src/` folder.
2. Export it from `src/index.ts`.
3. Document it here with a short example.
4. `npm run build && npm run lint` must pass.
