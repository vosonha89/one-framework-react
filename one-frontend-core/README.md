# one-framework (monorepo)

Monorepo for the ONE frontend framework. The framework-agnostic core lives in `packages/core` and is published as `one-frontend-core`.

## Workspaces

| Package | Path | Description |
| --- | --- | --- |
| `one-frontend-core` | `packages/core` | Framework-agnostic core: contracts, constants, helpers, DI services |

## Commands

```bash
npm install          # install all workspaces
npm run build        # build the core package (tsc → lib/)
npm run lint         # lint the core package
npm run build:all    # build every workspace
npm run lint:all     # lint every workspace
```

Framework-specific adapters (React, Vue, …) are added as sibling packages under `packages/`. The core itself carries no UI-framework dependency.

See [`packages/core/SKILLS.md`](./packages/core/SKILLS.md) for the core skill catalog.