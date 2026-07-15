@AGENTS.md

# Project Rules

## Backend Architecture

Four layers — dependencies only flow downward:

```
app/api/        → presentation:   HTTP handlers, cookies, request/response
services/       → application:    orchestration, use-cases, error handling
repositories/   → infrastructure: persistence only (read/write storage)
domain/         → domain:         pure business logic, types, no side effects
```

**Rules:**
- `domain/` must never import from any other layer — pure logic only
- `repositories/` may import types from `domain/`, never logic
- `services/` orchestrates `domain/` + `repositories/`, no HTTP knowledge
- `app/api/` handles HTTP concerns (cookies, status codes, responses), calls `services/` only
- Types and interfaces live in `domain/` and may be imported by any layer

**What belongs where:**
- `domain/` — business rules, entity creation, validation logic, expiration checks
- `services/` — use-cases (e.g. `createSession`), error wrapping, result shapes `{ ok, data, error }`
- `repositories/` — file I/O, database queries, no business logic
- `app/api/` — set cookies, return HTTP responses, call one service per handler

**services/ input types:**
- A service's input type must be derived from the `domain/` entity types it uses to create/update those entities — never hand-rolled with duplicate field declarations
- Compose via `Pick`/`Omit`/intersection of the relevant `domain/` types (e.g. a service using `createUser` + `createCredential` derives its input from `IUserInput` and `Pick<ICredential, "password">`, not a fresh `{ name, email, password }` interface)
- If a service's input is identical to one entity's shape, alias it directly (`type ILoginInput = ICredential`) rather than redeclaring the fields

## Frontend Architecture (FSD)

All client-side code lives under `src/front-end/` and follows **Feature-Sliced Design**. Layers are ordered top-to-bottom — upper layers may import from lower ones, never the reverse.

```
src/front-end/
  features/    → business-process slices (one folder per user-facing flow)
  entities/    → front-end representations of domain entities (types, constants, helpers)
  gateway/     → composed, wired clients (base URL, auth refresh, etc.)
  shared/      → reusable, non-business infrastructure
    http/      → typed HTTP client primitives
    routing/   → generated route constants and path builders
    ui/        → shared layout, structural components, error/loading primitives
```

**Import rules:**
- `shared/` must never import from `entities/`, `gateway/`, or `features/`
- `entities/` must never import from `gateway/` or `features/`
- `gateway/` may import from `shared/` and `entities/`, never from `features/`
- `features/` may import from `entities/`, `gateway/`, and `shared/`
- No layer may import from `src/app/` (the Next.js host) or use `next/*` APIs

**shared/ rules:**
- No imports from `next` or any framework-specific package
- Dependencies must be limited to `react`, `react-dom`, or plain TypeScript/JS
- Each sub-library (`http/`, `routing/`, `ui/`) must have its own `README.md`
- No business/domain knowledge — must not know what a "session" or "user" is, only generic transport concerns (paths, headers, interceptor mechanism)

**entities/ rules:**
- Contains types, constants, and pure helper functions for a domain entity
- No side effects — no fetching, no stores
- One folder per entity: `entities/user/`, `entities/task/`, `entities/session/`, etc.

**entities/ API config functions:**
- Each backend endpoint gets one pure config function, one file per function, under `entities/<entity>/api/<verb>.ts` (e.g. `entities/session/api/login.ts` exports `loginApi`)
- Route an endpoint to the entity it primarily acts on — the entity whose `_docs.json` `output.data` shape it returns (e.g. `login`/`logout`/`refresh` all return session data → `entities/session/`; `register` is user creation → `entities/user/`)
- A config function takes the endpoint's input as a parameter and returns `Pick<IHttpRequest, "method" | "path" | "body">` (from `shared/http`) — it must not call `fetch` or the `Http` client itself; that happens in `gateway/`
- `method` and `path` come from the route's `_docs.json`; GET endpoints with query params build the path with a query string instead of a `body`
- The input parameter type must be imported from `src/domain/`, never hand-rolled — compose via `Pick`/`Omit`/intersection of domain types the same way `services/` input types are derived (e.g. `registerApi(input: IUserInput & Pick<ICredential, "password">)`)
- Barrel each entity's `index.ts` re-exporting its domain types and all its `api/*` functions

**gateway/ rules:**
- Composes `shared/` primitives (e.g. `Http`, `Chain`, `Interceptor`) into ready-to-use, wired singletons — base URL, default headers, auth-refresh interceptor, etc.
- May have side effects (network calls) — this is the only layer besides `features/` allowed to
- May type against `entities/` shapes, but must not contain business rules (validation, workflow decisions) — only technical wiring
- One folder per composed client: `gateway/http/`, and later e.g. `gateway/socket/` if needed

**features/ rules:**
- One folder per user-facing business process (e.g. `features/auth-login/`)
- Must include a `README.md` describing the full user flow: screen → inputs → success → error paths
- May contain: form components, hooks, service calls, local state — all scoped to that feature
- Service calls go through `gateway/`, not `shared/http` directly
- No imports from other features — if two features share something, move it to `entities/` or `shared/`

## Utils

Each utility function lives in its own file. Test files are colocated with the util they test.

```
utils/
  generateName.mjs
  generateName.test.mjs
  extractParams.mjs
  extractParams.test.mjs
```

**Rules:**
- One util per file — no barrel files that group unrelated utilities
- Test file must be in the same folder as the util it tests, named `<util>.test.mjs`
