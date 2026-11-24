# one-frontend-core (core)

Framework-agnostic core of the ONE framework: base contracts, constants, static helpers and DI services shared by every frontend package. Contains **no** React/Vue/Angular dependency.

## Install

```bash
npm install
```

## Build & lint

```bash
npm run build   # tsc → lib/ (CommonJS + .d.ts)
npm run lint    # eslint . --ext .ts
```

## Usage

```ts
import "reflect-metadata";
import { AbstractModel, ObjectHelper, CommonFunction, container } from "one-frontend-core";
```

See [`SKILLS.md`](./SKILLS.md) for the skill catalog and [`.clinerules`](./.clinerules) for architecture rules.

## Layout

- `src/constants` — `StatusCode`, `RequestMethod`, `StorageKey`, `LanguageCode`, `MessageType`, `ConstantValue`
- `src/types` — `AbstractModel`, `BaseObject`, `ComponentState`, `AnyType`, `ICommonSharingData`
- `src/functions` — `ObjectHelper`, `CommonFunction`, `UIHelper`
- `src/services` — abstract contracts + `SharingDataService`, `RealTimeSharingDataService`

Public surface is exported from `src/index.ts`.