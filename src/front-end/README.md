# Front-End — Feature-Sliced Design

All client-side code lives in this folder and follows **Feature-Sliced Design (FSD)**. The architecture splits code into layers ordered by responsibility. Upper layers import from lower ones; the reverse is never allowed.

## Layer Overview

```
src/front-end/
  features/    → user-facing business processes (one slice per flow)
  entities/    → typed representations of domain entities
  shared/      → reusable, non-business infrastructure
    http/      → typed HTTP client
    routing/   → generated route constants and path builders
    ui/        → shared layout, structural components, error/loading primitives
```

## Layer Rules

| Layer | May import from | Must never import from |
|-------|-----------------|------------------------|
| `features/` | `entities/`, `shared/` | other `features/`, `src/app/`, `next/*` |
| `entities/` | `shared/` | `features/`, `src/app/`, `next/*` |
| `shared/` | — (external libs only) | `entities/`, `features/`, `next/*` |

## Layer Descriptions

### `shared/`

Non-business infrastructure that any layer can use. Has no knowledge of the application's domain. Each sub-library has its own `README.md`.

- `shared/http/` — typed `fetch` wrapper and `ApiError` class
- `shared/routing/` — generated route constants (`APP_ROUTES`) and type-safe path-builder functions
- `shared/ui/` — shared layout (`AppLayout`), structural UI (`Header`, `Sidebar`), and primitives (`Loader`, `PageError`)

### `entities/`

Front-end representations of the domain entities defined in `src/domain/`. Contains TypeScript types, constants, and pure helper functions. No API calls, no side effects.

One folder per entity:

```
entities/
  user/
  session/
  task/
  group/
  role/
```

### `features/`

One folder per user-facing business process. Each feature slice is self-contained: it owns its form components, hooks, service calls, and local state.

Every feature must have a `README.md` documenting the full user flow:
- What screen the user is on
- What inputs are required
- What happens on success
- What happens on each error case

Examples:
```
features/
  auth-login/
  auth-logout/
```

## Portability Constraint

`shared/` and `entities/` must work in any React app — no imports from `next/*` or any other framework-specific package. Only `react`, `react-dom`, and plain TypeScript/JS dependencies are allowed.
