# Front-End — Feature-Sliced Design

All client-side code lives in this folder and follows **Feature-Sliced Design (FSD)**. The architecture splits code into layers ordered by responsibility. Upper layers import from lower ones; the reverse is never allowed.

## Layer Overview

```
src/front-end/
  features/    → user-facing business processes (one slice per flow)
  entities/    → typed representations of domain entities
  gateway/     → composed, wired clients (base URL, auth refresh, etc.)
  shared/      → reusable, non-business infrastructure
    http/      → typed HTTP client primitives
    routing/   → generated route constants and path builders
    ui/        → shared layout, structural components, error/loading primitives
```

## Layer Rules

| Layer | May import from | Must never import from |
|-------|-----------------|------------------------|
| `features/` | `entities/`, `gateway/`, `shared/` | other `features/`, `src/app/`, `next/*` |
| `gateway/` | `entities/`, `shared/` | `features/`, `src/app/`, `next/*` |
| `entities/` | `shared/` | `gateway/`, `features/`, `src/app/`, `next/*` |
| `shared/` | — (external libs only) | `entities/`, `gateway/`, `features/`, `next/*` |

## Layer Descriptions

### `shared/`

Non-business infrastructure that any layer can use. Has no knowledge of the application's domain — not even what a "session" is. Each sub-library has its own `README.md`.

- `shared/http/` — typed `fetch` wrapper, interceptor chain primitives (`Http`, `Chain`, `Interceptor`), and `ApiError` class
- `shared/routing/` — generated route constants (`APP_ROUTES`) and type-safe path-builder functions
- `shared/ui/` — shared layout (`AppLayout`), structural UI (`Header`, `Sidebar`), and primitives (`Loader`, `PageError`)

### `gateway/`

Composed, wired instances built from `shared/` primitives — the app's actual HTTP client, pre-configured with a base URL and an auth-refresh interceptor. May type against `entities/` shapes but contains no business rules, only technical wiring. This is the only place besides `features/` allowed to have side effects (network calls).

- `gateway/http/` — the singleton `Http` client, wired with the refresh-token interceptor

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
