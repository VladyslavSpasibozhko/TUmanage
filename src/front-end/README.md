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
- `shared/routing/` — **deprecated, slated for removal.** Generated route constants (`APP_ROUTES`) and path-builder functions — do not use in new code, use plain path strings instead.
- `shared/ui/` — shared layout (`AppLayout`), structural UI (`Header`, `Sidebar`), text/form primitives (`Text`, `Button`, `Input`, `Select`, `Form`, `FormField`), and primitives (`Loader`, `PageError`)

### `gateway/`

Composed, wired instances built from `shared/` primitives — the app's actual HTTP client, pre-configured with a base URL and (eventually) an auth-refresh interceptor. May type against `entities/`/`domain/` shapes but contains no business rules, only technical wiring. This is the only place besides `features/` allowed to have side effects (network calls). See `gateway/README.md`.

- `gateway/httpl-client/` — the singleton client, imported and used as `client` at call sites (not `httpClient`)

### `entities/`

Front-end representations of the domain entities defined in `src/domain/`. Contains TypeScript types, constants, and pure helper functions. No API calls, no side effects. Entity barrels re-export the entity's own `api/*` config functions only — they do not re-export `src/domain/` types; import those directly from `src/domain/<entity>` at the call site.

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

One folder per user-facing business process. Each feature slice is self-contained: it owns its form components, hooks, service calls, and local state — split into `ui/`, `model/`, and `api/` segments (see `features/README.md` for the full layout and conventions).

Every feature must have a `README.md` documenting the full user flow:
- What screen the user is on
- What inputs are required
- What happens on success
- What happens on each error case

Two conventions established with the first slices (`auth-login`, `auth-register`):
- Components that render user-facing text take a single required `i18n` prop (a typed object of all display strings) instead of hardcoded text or defaulted string props.
- Client-side validation reuses the same ajv schemas the backend already validates against (`src/domain/<entity>/schema.ts` via `src/shared/validation`'s `validate()`), surfaced as one form-level error string rather than hand-rolled or per-field validation.

Examples:
```
features/
  auth-login/
    ui/LoginForm.tsx
    model/useLogin.ts, types.ts
    api/login.ts
  auth-register/
    ui/RegisterForm.tsx
    model/useRegister.ts, types.ts
    api/register.ts
```

## Portability Constraint

`shared/` and `entities/` must work in any React app — no imports from `next/*` or any other framework-specific package. Only `react`, `react-dom`, and plain TypeScript/JS dependencies are allowed.
