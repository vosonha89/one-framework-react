# one-frontend-core (core)

Framework-agnostic core of the ONE framework: base contracts, constants, static helpers and DI services shared by every frontend package. Contains **no** React/Vue/Angular dependency.

## Install

```bash
npm install
```

## Build & lint

```bash
npm run build   # tsc → lib/ (CommonJS + .d.ts)
npm run lint    # eslint . (ESLint 9 flat config)
```

## Usage

`container` comes from `tsyringe`; this package exports only contracts,
constants, helpers and the sharing services:

```ts
import "reflect-metadata";
import { container } from "tsyringe";
import { AbstractModel, ObjectHelper, CommonFunction } from "one-frontend-core";
```

See [`SKILLS.md`](./SKILLS.md) for the skill catalog and [`.clinerules`](./.clinerules) for architecture rules.

## Layout

- `src/constants` — `StatusCode`, `RequestMethod`, `StorageKey`, `LanguageCode`, `MessageType`, `ConstantValue`
- `src/types` — `AbstractModel`, `ErrorModel`, `AbstractType`, `AbstractObjectType`, `ComponentState`, `AnyType`, `ICommonSharingData`
- `src/functions` — `ObjectHelper`, `CommonFunction`, `UIHelper`
- `src/services` — abstract contracts (including `AbstractLogggingService`) + `SharingDataService`, `RealTimeSharingDataService`

Public surface is exported from `src/index.ts`.

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

## License

MIT — see the repository root `LICENSE`.